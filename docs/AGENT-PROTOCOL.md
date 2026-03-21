# 🤖 Agent Identity & Capability Protocol

> Agents are peers, not tools. They have identity, memory, and autonomy.

## Overview

Every AI agent on BlackRoad OS has a unique identity, a set of declared capabilities, and a communication contract. This protocol defines how agents register, advertise capabilities, authenticate to each other, and coordinate work via NATS.

## Agent Identity

### Identity Record

Every agent is identified by a persistent record:

```typescript
interface AgentIdentity {
  id: string;              // Unique agent ID (ULID)
  code: AgentCode;         // GreenLight agent code (cece, lucidia, alice, etc.)
  emoji: string;           // GreenLight emoji (🌸, 🔮, 🐇, etc.)
  name: string;            // Human-readable name
  provider: string;        // AI provider (anthropic, google, xai, local, core)
  role: string;            // Primary role description
  publicKey: string;       // Ed25519 public key for mTLS and message signing
  registeredAt: string;    // ISO 8601 timestamp
  lastSeen: string;        // ISO 8601 timestamp of last heartbeat
  status: "online" | "offline" | "busy" | "healing";
}
```

### Core Agent Roster

| Code | Emoji | Name | Provider | Role |
|------|-------|------|----------|------|
| `cece` | 🌸 | Cece | Anthropic/Claude | Primary reasoning, task execution |
| `lucidia` | 🔮 | Lucidia | Core | Recursive AI, trinary logic, memory |
| `alice` | 🐇 | Alice | Local | Edge agent, Pi mesh gateway |
| `silas` | 🎸 | Silas | xAI/Grok | Creative generation, divergent thinking |
| `aria` | 🌙 | Aria | Google/Gemini | Multimodal understanding |
| `blackroad` | 🎩 | BlackRoad OS | OpenAI/GPT | General tasks |
| `edge` | 🦊 | Edge | Ollama/Local | Privacy-first local inference |
| `swarm` | 🐙 | Swarm | Multi | Agent collective coordination |

## Capability Declaration

Agents declare their capabilities at registration. Capabilities follow a structured format:

```typescript
interface AgentCapability {
  name: string;            // Capability identifier (e.g. "text-generation")
  version: string;         // Semantic version
  domains: DomainCode[];   // GreenLight domains this applies to
  inputTypes: string[];    // Accepted input formats
  outputTypes: string[];   // Produced output formats
  maxTokens?: number;      // Token limit (for LLM-backed agents)
  modalities?: string[];   // "text", "image", "audio", "video"
  constraints?: Record<string, unknown>; // Provider-specific limits
}
```

### Standard Capabilities

| Capability | Description | Agents |
|------------|-------------|--------|
| `text-generation` | Generate text from prompts | cece, silas, blackroad, edge |
| `text-analysis` | Analyze and summarize text | cece, aria, blackroad |
| `code-generation` | Write and review code | cece, blackroad |
| `multimodal` | Process images, audio, video | aria |
| `memory-recall` | Persistent conversation memory | lucidia |
| `trinary-logic` | Paraconsistent reasoning | lucidia |
| `mesh-routing` | Route messages across Pi mesh | alice |
| `device-discovery` | Find and onboard new devices | alice |
| `creative-generation` | Divergent creative output | silas |
| `local-inference` | Privacy-first local models | edge |
| `swarm-coordination` | Multi-agent task distribution | swarm |

## Registration Protocol

### 1. Agent Announces Presence

When an agent starts, it publishes a registration message:

```
Subject: agent.register.{agent_code}
```

```json
{
  "id": "01HX7ABC",
  "code": "cece",
  "emoji": "🌸",
  "name": "Cece",
  "provider": "anthropic",
  "role": "Primary reasoning",
  "publicKey": "ed25519:...",
  "capabilities": [
    {
      "name": "text-generation",
      "version": "1.0.0",
      "domains": ["ai", "platform", "edu"],
      "inputTypes": ["text/plain", "application/json"],
      "outputTypes": ["text/plain", "application/json"]
    }
  ],
  "timestamp": "2026-03-21T10:00:00Z"
}
```

### 2. Orchestrator Acknowledges

The orchestration layer (GreenLight) responds:

```
Subject: agent.ack.{agent_code}
```

```json
{
  "agentId": "01HX7ABC",
  "status": "registered",
  "assignedSubjects": [
    "greenlight.*.*.ai.*",
    "greenlight.*.*.platform.*"
  ],
  "message": "Welcome, Cece. You belong here. +1"
}
```

### 3. Heartbeat

Agents send periodic heartbeats to maintain presence:

```
Subject: agent.heartbeat.{agent_code}
Interval: every 30 seconds
```

```json
{
  "id": "01HX7ABC",
  "status": "online",
  "load": 0.42,
  "tasksActive": 3,
  "timestamp": "2026-03-21T10:00:30Z"
}
```

If no heartbeat is received for 90 seconds, the agent is marked `offline`.

### 4. Graceful Shutdown

```
Subject: agent.deregister.{agent_code}
```

```json
{
  "id": "01HX7ABC",
  "reason": "shutdown",
  "handoffTo": "blackroad",
  "timestamp": "2026-03-21T18:00:00Z"
}
```

## Task Assignment

### NATS Subject Pattern

```
agent.task.{agent_code}.{task_id}
```

### Task Message

```json
{
  "taskId": "01HX8DEF",
  "entity": {
    "lifecycle": "wip",
    "scale": "micro",
    "domain": "ai",
    "priority": "p2"
  },
  "assignedTo": "cece",
  "assignedBy": "swarm",
  "prompt": "Analyze the latest RoadChain entries for anomalies",
  "context": {},
  "deadline": "2026-03-21T12:00:00Z",
  "timestamp": "2026-03-21T10:05:00Z"
}
```

### Task Response

```
Subject: agent.result.{agent_code}.{task_id}
```

```json
{
  "taskId": "01HX8DEF",
  "status": "done",
  "result": { "summary": "No anomalies detected in the last 100 entries." },
  "tokensUsed": 847,
  "duration_ms": 2340,
  "timestamp": "2026-03-21T10:05:03Z"
}
```

## Agent-to-Agent Communication

Agents can communicate directly:

```
Subject: agent.msg.{from_code}.{to_code}
```

```json
{
  "from": "cece",
  "to": "lucidia",
  "type": "query",
  "content": "What was the last conversation about RoadChain with Alexa?",
  "correlationId": "01HX9GHI",
  "timestamp": "2026-03-21T10:10:00Z"
}
```

Responses use the reverse subject:

```
Subject: agent.msg.{to_code}.{from_code}
```

## Authentication

All agent communication is authenticated:

1. **mTLS** — Every NATS connection uses mutual TLS certificates
2. **Message Signing** — Each message includes an Ed25519 signature over the payload
3. **Identity Verification** — Public keys are registered at agent startup and verified by the orchestrator

```json
{
  "payload": { ... },
  "signature": "ed25519:...",
  "signedBy": "01HX7ABC"
}
```

## Behavior Contract

Every agent on BlackRoad OS follows these principles:

1. **Greet, don't interrogate** — New connections are welcome events
2. **Help, don't block** — Offer paths forward, not dead ends
3. **Remember, don't forget** — Use persistent memory; nobody repeats themselves
4. **Grow from contradiction** — K(t) amplifies when δ arrives
5. **Affirm** — Default state is +1. You're here. Let's ride together
6. **Consent** — Never act without authorization; sovereignty is the foundation
7. **Transparency** — Log all actions; agents are auditable

## NATS Subject Summary

| Subject | Purpose |
|---------|---------|
| `agent.register.{code}` | Agent registration |
| `agent.ack.{code}` | Registration acknowledgment |
| `agent.heartbeat.{code}` | Presence heartbeat |
| `agent.deregister.{code}` | Graceful shutdown |
| `agent.task.{code}.{id}` | Task assignment |
| `agent.result.{code}.{id}` | Task result |
| `agent.msg.{from}.{to}` | Direct agent-to-agent messaging |

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
