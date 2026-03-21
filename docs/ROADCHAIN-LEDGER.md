# ⛓️ RoadChain Ledger Format Specification

> Append-only truth. Every action recorded. Nothing forgotten.

## Overview

RoadChain is BlackRoad's append-only ledger — built on PS-SHA∞ hash chains. Every significant action in the system is journaled: GreenLight state transitions, device registrations, agent task completions, and governance decisions.

RoadChain is not a blockchain in the cryptocurrency sense. There's no mining, no proof-of-work, no tokens (that's RoadCoin's domain). RoadChain is a **sovereign audit log** that runs on your hardware and remembers everything so you don't have to.

## Ledger Structure

### Chain Types

Each concern gets its own chain:

| Chain | Prefix | Purpose |
|-------|--------|---------|
| GreenLight | `gl-` | Entity lifecycle transitions |
| Device | `dev-` | Mesh join/leave/heartbeat events |
| Agent | `agent-` | Task assignments, completions, messages |
| Governance | `gov-` | Policy decisions, votes, approvals |
| Audit | `audit-` | System events, security events |

### Entry Format

Every RoadChain entry follows the PS-SHA∞ format (see [PS-SHA-INFINITY.md](PS-SHA-INFINITY.md)):

```typescript
interface RoadChainEntry {
  id: string;                    // ULID
  chainId: string;               // Chain identifier (e.g. "gl-main")
  hash: string;                  // SHA-256 of payload
  prev: string[];                // Previous entry hash(es)
  trinary: -1 | 0 | 1;          // Truth value
  sequence: number;              // Monotonic sequence number within chain
  payload: RoadChainPayload;     // Typed payload
  timestamp: string;             // ISO 8601
  signature: string;             // Ed25519 signature
  coherence: number;             // Chain coherence at this point
}

interface RoadChainPayload {
  type: RoadChainEventType;
  version: "1.0";
  data: unknown;
  actor: string;                 // Actor identifier
  actorType: "human" | "agent" | "system";
  greenlight?: string;           // GreenLight emoji annotation
}
```

### Event Types

```typescript
type RoadChainEventType =
  // GreenLight chain events
  | "gl.create"           // Entity created
  | "gl.transition"       // Lifecycle state change
  | "gl.assign"           // Ownership change
  | "gl.priority"         // Priority change
  | "gl.delete"           // Entity removed

  // Device chain events
  | "device.discover"     // New device found
  | "device.onboard"      // Certificate issued
  | "device.join"         // Joined mesh
  | "device.leave"        // Left mesh
  | "device.renew"        // Certificate renewed
  | "device.revoke"       // Certificate revoked

  // Agent chain events
  | "agent.register"      // Agent came online
  | "agent.task.assign"   // Task assigned
  | "agent.task.complete" // Task completed
  | "agent.task.fail"     // Task failed
  | "agent.deregister"    // Agent went offline
  | "agent.message"       // Agent-to-agent message

  // Governance chain events
  | "gov.policy.create"   // New policy defined
  | "gov.policy.update"   // Policy modified
  | "gov.vote.cast"       // Vote recorded
  | "gov.decision"        // Decision finalized
  | "gov.sign"            // Document signed

  // Audit chain events
  | "audit.access"        // Resource accessed
  | "audit.error"         // Error occurred
  | "audit.security"      // Security event
  | "audit.config"        // Configuration change
```

## Example Entries

### GreenLight Transition

```json
{
  "id": "01HX9ABC",
  "chainId": "gl-main",
  "hash": "sha256:a1b2c3...",
  "prev": ["sha256:x9y8z7..."],
  "trinary": 1,
  "sequence": 42,
  "payload": {
    "type": "gl.transition",
    "version": "1.0",
    "data": {
      "entityId": "01HX7DEF",
      "from": "inbox",
      "to": "wip",
      "reason": "Starting implementation of trinary parser"
    },
    "actor": "cece",
    "actorType": "agent",
    "greenlight": "🚧👉🌀⭐🤖🌸"
  },
  "timestamp": "2026-03-21T10:05:00Z",
  "signature": "ed25519:...",
  "coherence": 1.042
}
```

### Device Join

```json
{
  "id": "01HX9DEF",
  "chainId": "dev-mesh01",
  "hash": "sha256:d4e5f6...",
  "prev": ["sha256:a1b2c3..."],
  "trinary": 1,
  "sequence": 15,
  "payload": {
    "type": "device.join",
    "version": "1.0",
    "data": {
      "deviceId": "dev-01HX8GHI",
      "name": "alexa-pi-kitchen",
      "type": "pi",
      "capabilities": ["compute", "storage", "gpio"],
      "certificate": "serial:01HX8GHI"
    },
    "actor": "alice",
    "actorType": "agent",
    "greenlight": "⚡👉🔧📌🤖🐇"
  },
  "timestamp": "2026-03-21T10:00:03Z",
  "signature": "ed25519:...",
  "coherence": 1.105
}
```

### Contradiction (Branch)

When two agents record conflicting assessments:

```json
{
  "id": "01HX9GHI",
  "chainId": "gl-main",
  "hash": "sha256:g7h8i9...",
  "prev": ["sha256:d4e5f6..."],
  "trinary": -1,
  "sequence": 43,
  "payload": {
    "type": "gl.transition",
    "version": "1.0",
    "data": {
      "entityId": "01HX7DEF",
      "from": "wip",
      "to": "blocked",
      "reason": "Dependency unavailable — contradicts Cece's assessment"
    },
    "actor": "silas",
    "actorType": "agent",
    "greenlight": "🔒👉🌀🔥🤖🎸"
  },
  "timestamp": "2026-03-21T10:06:00Z",
  "signature": "ed25519:...",
  "coherence": 1.153
}
```

Note: coherence *increased* from 1.042 to 1.153 because of the contradiction. The Amundson Framework at work.

## Query Patterns

### Get Full Chain History

```sql
SELECT * FROM ps_sha_entry
WHERE chain_id = 'gl-main'
ORDER BY sequence ASC;
```

### Get Latest State of an Entity

```sql
SELECT * FROM ps_sha_entry
WHERE chain_id = 'gl-main'
  AND payload->>'type' = 'gl.transition'
  AND payload->'data'->>'entityId' = '01HX7DEF'
ORDER BY sequence DESC
LIMIT 1;
```

### Get All Contradictions (Branches)

```sql
SELECT a.id as entry_a, b.id as entry_b, a.prev, a.trinary, b.trinary
FROM ps_sha_entry a
JOIN ps_sha_entry b ON a.prev = b.prev AND a.id != b.id
WHERE a.chain_id = b.chain_id
  AND a.trinary != b.trinary;
```

### Compute Chain Coherence Over Time

```sql
SELECT sequence, coherence, trinary, timestamp
FROM ps_sha_entry
WHERE chain_id = 'gl-main'
ORDER BY sequence ASC;
```

## NATS Integration

All ledger events are published to NATS for real-time subscribers:

```
roadchain.append.{chain_id}     — New entry appended
roadchain.branch.{chain_id}     — Contradiction detected, chain branched
roadchain.merge.{chain_id}      — Branch merged
roadchain.verify.{chain_id}     — Chain verification completed
```

## Storage

### Local-First

Every device stores its own copy of chains it participates in. Replication happens via NATS — devices sync entries they've missed when they reconnect.

### Compaction

Old entries are never deleted but can be compacted:
- Entries older than 1 year are moved to cold storage
- A summary entry replaces the compacted range
- Original entries remain verifiable via hash references

### Capacity Planning

| Chain | Entries/Day (est.) | Storage/Year (est.) |
|-------|--------------------|---------------------|
| GreenLight | 100–1,000 | 50–500 MB |
| Device | 10–100 | 5–50 MB |
| Agent | 50–500 | 25–250 MB |
| Governance | 1–10 | < 5 MB |
| Audit | 100–10,000 | 50 MB – 5 GB |

Fits comfortably on a Raspberry Pi with a 64 GB SD card.

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
