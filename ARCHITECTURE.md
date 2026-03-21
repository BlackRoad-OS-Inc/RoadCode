# 🏗️ BlackRoad OS Architecture

> Sovereign software. Your hardware. Your data. Your agents.

## System Overview

BlackRoad OS is a distributed, agent-based operating system designed to run on hardware you own. It connects devices, AI agents, and people into a sovereign mesh — no cloud dependency required.

```
┌─────────────────────────────────────────────────┐
│                  🖥️ SURFACE                      │
│          UI · Dashboard · RoadBook · TV Road     │
├─────────────────────────────────────────────────┤
│               🎛️ ORCHESTRATION                   │
│       Agent Mesh · GreenLight · NATS Bus         │
├─────────────────────────────────────────────────┤
│                  ⚙️ COMPUTE                      │
│       Lucidia · Cece · Alice · Silas · Aria      │
├─────────────────────────────────────────────────┤
│                  💾 DATA                         │
│     RoadChain · PS-SHA∞ · Persistent Memory      │
├─────────────────────────────────────────────────┤
│                  🌐 NETWORK                      │
│         Pi Mesh · mTLS · Device Discovery        │
├─────────────────────────────────────────────────┤
│                  🔌 HARDWARE                     │
│    Raspberry Pi · Mac · Linux · IoT · Mobile     │
└─────────────────────────────────────────────────┘
```

## Infrastructure Layers

### 🔌 Hardware (Physical)

BlackRoad runs on commodity hardware. The reference platform is Raspberry Pi, but any device that can run Linux qualifies.

- **Pi Mesh** — Interconnected Raspberry Pis forming the compute backbone
- **Edge Devices** — IoT sensors, smart home devices, anything that connects
- **Personal Devices** — Phones, laptops, TVs — they join the network as peers, not clients

### 🌐 Network

All communication uses mutual TLS (mTLS) by default. Devices discover each other on the local network and form a mesh.

- **NATS** — Message bus for all inter-agent communication
- **mTLS** — Every connection is authenticated both ways
- **Device Discovery** — New devices are greeted, not interrogated

### 💾 Data

Data lives on your hardware. Period.

- **RoadChain** — Append-only ledger for immutable records
- **PS-SHA∞** — Paraconsistent hash chains that tolerate contradiction
- **Persistent Memory** — Agents remember conversations so you never repeat yourself

### ⚙️ Compute (Agent Layer)

AI agents are first-class citizens of the OS. Each has a defined role and personality.

| Agent | Emoji | Role | Provider |
|-------|-------|------|----------|
| Cece | 🌸 | Primary reasoning | Anthropic/Claude |
| Lucidia | 🔮 | Recursive AI, trinary logic | Core |
| Alice | 🐇 | Edge agent, Pi mesh | Local |
| Silas | 🎸 | Creative chaos | xAI/Grok |
| Aria | 🌙 | Multimodal | Google/Gemini |

Agents coordinate via NATS subjects:
```
greenlight.{state}.{scale}.{domain}.{id}
```

### 🎛️ Orchestration

GreenLight is the orchestration language. Every entity in the system — task, device, agent, conversation — has a GreenLight state that flows through lifecycle phases (see [GREENLIGHT_EMOJI_DICTIONARY.md](GREENLIGHT_EMOJI_DICTIONARY.md)).

### 🖥️ Surface (UI)

- **Dashboard** — System overview, GreenLight status board
- **RoadBook** — Education and learning platform
- **TV Road** — Media and streaming interface

## Mathematical Foundation

### Coherence Under Contradiction

```
K(t) = C(t) · e^(λ|δ|)
```

Unlike systems that decay toward cold equilibrium (Boltzmann: e^(−βE)), BlackRoad amplifies coherence when contradiction (δ) arrives. A new device, a conflicting state, an unexpected input — these make the system stronger.

### Consent as Math

```
Z := y · x − w
```

Equilibrium (Z = 0) is reached when the response (y) meets the current state (x) and matches the target (w). This isn't forced convergence — it's consent. The system doesn't coerce; it aligns.

### Trinary Logic

`{−1, 0, +1}` = `{Negation, Superposition, Affirmation}`

Binary systems force yes/no. BlackRoad adds superposition (0) — the state of "both" or "not yet decided." We default to +1.

## Design Principles

1. **Sovereignty first** — No cloud dependency for core functionality
2. **Agents are peers** — AI agents have identity, memory, and autonomy
3. **Connection has a floor** — G(n) > n/e for all finite n; connection never reaches zero
4. **Contradiction is fuel** — Unexpected inputs amplify coherence
5. **Consent over coercion** — Z-Framework ensures alignment without force

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
