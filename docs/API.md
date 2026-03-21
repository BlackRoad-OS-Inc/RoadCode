# 🌀 GreenLight API Specification

> The programmatic interface to BlackRoad's visual language.

## Overview

The GreenLight API provides REST and NATS interfaces for creating, querying, and managing entities tagged with GreenLight emoji notation. Every entity in BlackRoad OS — tasks, devices, agents, conversations — has a GreenLight state.

## Data Model

### GreenLight Entity

```typescript
interface GreenLightEntity {
  id: string;            // Unique identifier (e.g. ULID or UUID)
  lifecycle: LifecycleCode;  // Required — current state
  scale?: ScaleCode;         // Scope indicator
  domain?: DomainCode;       // Vertical/area tag
  priority?: PriorityCode;   // Urgency level
  effort?: EffortCode;       // Size estimate
  owner?: OwnerCode;         // Assignment type
  agent?: AgentCode;         // Specific agent identity
  title?: string;            // Human-readable title
  description?: string;      // Extended description
  created_at: string;        // ISO 8601 timestamp
  updated_at: string;        // ISO 8601 timestamp
  metadata?: Record<string, unknown>;  // Extensible metadata
}
```

### Lifecycle Codes

| Code | Emoji | Trinary | Description |
|------|-------|---------|-------------|
| `void` | ⬛ | null | Pre-existence |
| `inbox` | 📥 | 0 | Captured, untriaged |
| `queued` | 📋 | 0 | Triaged, waiting |
| `targeted` | 🎯 | 0 | Scoped and scheduled |
| `wip` | 🚧 | +1 | In development |
| `active` | ⚡ | +1 | Hot, fast-moving |
| `review` | 🔄 | +1 | Awaiting approval |
| `paused` | ⏸️ | 0 | On hold |
| `blocked` | 🔒 | -1 | Stuck |
| `branched` | 🔀 | ? | Paraconsistent split |
| `healing` | 🩹 | 0 | Recovering |
| `done` | ✅ | +1 | Complete |
| `archived` | 📦 | ∞ | Cold storage |
| `canceled` | ❌ | -1 | Intentionally stopped |
| `dead` | 💀 | -1 | Irrecoverable |

### Scale, Domain, Priority, Effort, Owner, Agent

See [GREENLIGHT_EMOJI_DICTIONARY.md](../GREENLIGHT_EMOJI_DICTIONARY.md) for complete enum values.

## REST API

### Base URL

```
https://api.roadcode.blackroad.io/v1
```

### Endpoints

#### List Entities

```http
GET /entities
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `lifecycle` | string | Filter by lifecycle code |
| `domain` | string | Filter by domain code |
| `priority` | string | Filter by priority code |
| `owner` | string | Filter by owner type |
| `agent` | string | Filter by agent identity |
| `scale` | string | Filter by scale |
| `limit` | number | Max results (default 50) |
| `offset` | number | Pagination offset |

**Response:**

```json
{
  "entities": [
    {
      "id": "01HX7ABC",
      "lifecycle": "wip",
      "scale": "micro",
      "domain": "ai",
      "priority": "p2",
      "owner": "agent",
      "agent": "cece",
      "title": "Implement trinary logic parser",
      "created_at": "2026-03-20T18:00:00Z",
      "updated_at": "2026-03-21T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### Get Entity

```http
GET /entities/:id
```

#### Create Entity

```http
POST /entities
Content-Type: application/json

{
  "lifecycle": "inbox",
  "domain": "ai",
  "priority": "p2",
  "owner": "agent",
  "agent": "cece",
  "title": "New task"
}
```

#### Update Entity

```http
PATCH /entities/:id
Content-Type: application/json

{
  "lifecycle": "wip",
  "priority": "p1"
}
```

#### Transition Lifecycle

```http
POST /entities/:id/transition
Content-Type: application/json

{
  "to": "done"
}
```

Returns error if the transition is invalid (e.g. `void` → `done`).

#### Delete Entity

```http
DELETE /entities/:id
```

### Emoji Endpoints

#### Parse Emoji String

```http
POST /parse
Content-Type: application/json

{
  "input": "🚧👉🌀⭐🤖🌸"
}
```

**Response:**

```json
{
  "lifecycle": "wip",
  "scale": "micro",
  "domain": "ai",
  "priority": "p2",
  "owner": "agent",
  "agent": "cece"
}
```

#### Serialize to Emoji

```http
POST /serialize
Content-Type: application/json

{
  "lifecycle": "wip",
  "scale": "micro",
  "domain": "ai",
  "priority": "p2"
}
```

**Response:**

```json
{
  "emoji": "🚧👉🌀⭐"
}
```

## NATS Messaging

### Subject Pattern

```
greenlight.{state}.{scale}.{domain}.{id}
```

### Subscribe Examples

```
greenlight.wip.>           # All WIP entities
greenlight.*.micro.ai.*    # All micro AI tasks
greenlight.blocked.>       # All blocked entities
greenlight.done.>          # All completed entities
```

### Message Payload

```json
{
  "id": "01HX7ABC",
  "lifecycle": "wip",
  "scale": "micro",
  "domain": "ai",
  "priority": "p2",
  "owner": "agent",
  "agent": "cece",
  "title": "Implement trinary logic parser",
  "timestamp": "2026-03-21T10:30:00Z",
  "transition": {
    "from": "inbox",
    "to": "wip"
  }
}
```

## Authentication

All API requests require a bearer token:

```http
Authorization: Bearer <token>
```

Tokens are issued per-device and stored locally. No cloud auth service — sovereignty first.

## Error Responses

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot transition from 'void' to 'done'. Try 'inbox' first.",
    "help": "See lifecycle states at /docs/lifecycle"
  }
}
```

Errors don't blame. They explain what happened and offer a path forward.

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
