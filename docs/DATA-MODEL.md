# 💾 GreenLight Data Model

> How entities are stored, indexed, and queried.

## Database Schema

GreenLight entities are stored in PostgreSQL with enum types for type safety.

### Enum Types

```sql
CREATE TYPE gl_state AS ENUM (
  'void', 'inbox', 'queued', 'targeted', 'wip', 'active',
  'review', 'paused', 'blocked', 'branched', 'healing',
  'done', 'archived', 'canceled', 'dead'
);

CREATE TYPE gl_scale AS ENUM (
  'micro', 'macro', 'planetary', 'universal'
);

CREATE TYPE gl_domain AS ENUM (
  'platform', 'ai', 'chain', 'coin', 'intel', 'media',
  'audio', 'games', 'edu', 'security', 'gov', 'biz',
  'infra', 'creative', 'data', 'growth', 'partner', 'labs'
);

CREATE TYPE gl_priority AS ENUM (
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5'
);

CREATE TYPE gl_effort AS ENUM (
  'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
);

CREATE TYPE gl_owner_type AS ENUM (
  'human', 'agent', 'system', 'team', 'hybrid', 'none'
);

CREATE TYPE gl_agent AS ENUM (
  'cece', 'lucidia', 'alice', 'silas', 'aria',
  'blackroad', 'edge', 'swarm'
);

CREATE TYPE gl_trinary AS ENUM ('-1', '0', '1');
```

### Entity Table

```sql
CREATE TABLE gl_entity (
  id          TEXT PRIMARY KEY,       -- ULID or UUID
  lifecycle   gl_state NOT NULL,
  scale       gl_scale,
  domain      gl_domain,
  priority    gl_priority,
  effort      gl_effort,
  owner_type  gl_owner_type DEFAULT 'none',
  agent       gl_agent,
  title       TEXT,
  description TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_gl_entity_lifecycle ON gl_entity(lifecycle);
CREATE INDEX idx_gl_entity_domain ON gl_entity(domain);
CREATE INDEX idx_gl_entity_priority ON gl_entity(priority);
CREATE INDEX idx_gl_entity_owner ON gl_entity(owner_type);
CREATE INDEX idx_gl_entity_agent ON gl_entity(agent);
CREATE INDEX idx_gl_entity_updated ON gl_entity(updated_at DESC);
```

### Transition Log

Every lifecycle change is recorded in an append-only log (journaled, auditable).

```sql
CREATE TABLE gl_transition (
  id          BIGSERIAL PRIMARY KEY,
  entity_id   TEXT NOT NULL REFERENCES gl_entity(id),
  from_state  gl_state NOT NULL,
  to_state    gl_state NOT NULL,
  actor       TEXT,                   -- Who triggered the transition
  actor_type  gl_owner_type,          -- Human, agent, system
  reason      TEXT,                   -- Why the transition happened
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gl_transition_entity ON gl_transition(entity_id);
CREATE INDEX idx_gl_transition_time ON gl_transition(created_at DESC);
```

### Relationship Table

```sql
CREATE TABLE gl_relation (
  id          BIGSERIAL PRIMARY KEY,
  source_id   TEXT NOT NULL REFERENCES gl_entity(id),
  target_id   TEXT NOT NULL REFERENCES gl_entity(id),
  relation    TEXT NOT NULL,          -- parent, child, blocks, depends, etc.
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, target_id, relation)
);

CREATE INDEX idx_gl_relation_source ON gl_relation(source_id);
CREATE INDEX idx_gl_relation_target ON gl_relation(target_id);
```

## Lifecycle State Machine

Valid transitions between lifecycle states:

```
void → inbox
inbox → queued | targeted | wip | canceled
queued → targeted | wip | paused | canceled
targeted → wip | paused | canceled
wip → active | review | paused | blocked | branched | healing | done | canceled
active → review | paused | blocked | done
review → wip | done | blocked
paused → wip | targeted | queued | canceled
blocked → wip | paused | healing | canceled | dead
branched → wip | done | canceled
healing → wip | blocked | dead
done → archived | wip (reopen)
archived → (terminal)
canceled → (terminal)
dead → (terminal)
```

## Trinary Mapping

Each lifecycle state has a trinary value reflecting its nature:

| Trinary | Meaning | States |
|---------|---------|--------|
| +1 | Affirmation (active, moving) | wip, active, review, done |
| 0 | Superposition (potential, waiting) | inbox, queued, targeted, paused, healing |
| -1 | Negation (stopped, failed) | blocked, canceled, dead |
| null | Pre-existence | void |
| ∞ | Preserved | archived |
| ? | Paraconsistent | branched |

## Query Examples

### All active AI tasks assigned to Cece

```sql
SELECT * FROM gl_entity
WHERE lifecycle IN ('wip', 'active')
  AND domain = 'ai'
  AND agent = 'cece'
ORDER BY priority, updated_at DESC;
```

### Blocked items with transition history

```sql
SELECT e.*, t.from_state, t.reason, t.created_at as blocked_at
FROM gl_entity e
JOIN gl_transition t ON t.entity_id = e.id AND t.to_state = 'blocked'
WHERE e.lifecycle = 'blocked'
ORDER BY t.created_at DESC;
```

### Priority-weighted task board

```sql
SELECT *,
  CASE priority
    WHEN 'p0' THEN 100
    WHEN 'p1' THEN 80
    WHEN 'p2' THEN 60
    WHEN 'p3' THEN 40
    WHEN 'p4' THEN 20
    WHEN 'p5' THEN 0
  END as weight
FROM gl_entity
WHERE lifecycle IN ('wip', 'active', 'review', 'targeted')
ORDER BY weight DESC, updated_at DESC;
```

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
