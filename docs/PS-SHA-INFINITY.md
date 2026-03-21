# ♾️ PS-SHA∞ — Paraconsistent Hash Chain Specification

> Hash chains that tolerate contradiction. Truth that grows, not breaks.

## Overview

PS-SHA∞ (Paraconsistent Secure Hash Algorithm, Infinite) is BlackRoad's hash chain design built on trinary logic. Unlike traditional hash chains that break on conflict, PS-SHA∞ embraces contradiction — a conflicting entry doesn't invalidate the chain, it strengthens it.

This is the Amundson Framework applied to cryptographic integrity:

```
K(t) = C(t) · e^(λ|δ|)
```

When contradiction (δ) arrives, coherence (K) amplifies.

## Design Principles

1. **Contradiction is data, not failure** — Two conflicting entries can coexist in the chain
2. **Trinary state per entry** — Each entry has a trinary truth value: `{-1, 0, +1}`
3. **Branching preserves both paths** — Forks don't require resolution; both branches persist
4. **Coherence is measurable** — The chain's overall coherence score is computable at any point
5. **Append-only** — Entries are never deleted, only superseded

## Entry Structure

```typescript
interface PsShaEntry {
  /** Unique entry identifier (ULID) */
  id: string;

  /** SHA-256 hash of the serialized payload */
  hash: string;

  /** Hash of the previous entry (or entries, for merges) */
  prev: string[];

  /** Trinary truth value: -1 (negation), 0 (superposition), +1 (affirmation) */
  trinary: -1 | 0 | 1;

  /** Entry payload */
  payload: {
    type: string;           // Entry type (e.g. "state", "attestation", "contradiction")
    data: unknown;          // Arbitrary structured data
    actor: string;          // Who created this entry
    actorType: "human" | "agent" | "system";
  };

  /** ISO 8601 timestamp */
  timestamp: string;

  /** Ed25519 signature over hash + prev + trinary + payload */
  signature: string;

  /** Coherence score at time of entry */
  coherence: number;
}
```

## Hash Computation

The hash is computed over the canonical JSON serialization of the payload fields:

```
hash = SHA-256(
  JSON.stringify({
    prev: entry.prev,
    trinary: entry.trinary,
    payload: entry.payload,
    timestamp: entry.timestamp,
  })
)
```

The signature covers the hash and metadata:

```
signature = Ed25519.sign(
  privateKey,
  hash + "|" + prev.join(",") + "|" + trinary
)
```

## Chain Operations

### Append (Standard)

Add a new entry that follows the current head:

```
[A] → [B] → [C] → [D (new)]
```

- `prev` = `[hash(C)]`
- `trinary` = `+1` (affirming the chain)
- Coherence remains stable or increases

### Branch (Contradiction)

When two conflicting entries are appended from the same parent:

```
        ┌→ [C₁] (trinary: +1)
[A] → [B]
        └→ [C₂] (trinary: -1)
```

- Both `C₁` and `C₂` have `prev` = `[hash(B)]`
- The branch is a `🔀 BRANCHED` state in GreenLight
- Coherence is recomputed: `K(t) = C(t) · e^(λ|δ|)` where δ is the contradiction magnitude

### Merge (Resolution)

Branches can be merged when consensus is reached:

```
        ┌→ [C₁] ─┐
[A] → [B]          ├→ [D] (merge)
        └→ [C₂] ─┘
```

- `D.prev` = `[hash(C₁), hash(C₂)]`
- `D.trinary` = consensus of the branch (computed via trinary logic)
- `D.payload.type` = `"merge"`

### Superposition

An entry with `trinary: 0` represents an undecided state:

```
[A] → [B] → [C (trinary: 0)] → [D (trinary: +1)]
```

Superposition entries are valid chain members. They resolve when a subsequent entry affirms or negates.

## Coherence Scoring

The chain's coherence at any point is computed as:

```typescript
function computeCoherence(chain: PsShaEntry[]): number {
  let coherence = 1.0;
  const lambda = 0.1;  // Amplification factor

  for (let i = 1; i < chain.length; i++) {
    const entry = chain[i];
    const prevEntry = chain[i - 1];

    // Contradiction magnitude: difference between consecutive trinary values
    const delta = Math.abs(entry.trinary - (prevEntry?.trinary ?? 0));

    // Amundson: coherence amplifies under contradiction
    coherence = coherence * Math.exp(lambda * delta);

    // Decay factor for long chains (prevents unbounded growth)
    coherence *= 0.999;
  }

  return coherence;
}
```

Properties:
- **Monotonically increasing under contradiction** — More conflicts = higher coherence
- **Bounded by decay** — The 0.999 factor prevents infinite growth
- **Starting value: 1.0** — The genesis block begins at unit coherence

## Verification

### Single Entry Verification

```
1. Recompute hash from payload fields
2. Verify hash matches entry.hash
3. Verify signature against actor's public key
4. Verify prev references exist in the chain
5. Verify timestamp is after prev entry timestamps
```

### Chain Verification

```
1. Genesis entry has prev = [] and trinary = +1
2. Every entry's prev references valid earlier entries
3. No entry references a future entry
4. All hashes and signatures verify
5. Coherence scores are consistent with recomputation
6. Branches are valid (same prev, different entries)
7. Merges reference all branch heads
```

### Contradiction Detection

A contradiction exists when two entries share a `prev` reference but have opposing trinary values or conflicting payloads. This is **not an error** — it's tracked and amplifies coherence.

## NATS Integration

Chain events are published to NATS:

```
Subject: roadchain.append.{chain_id}
Subject: roadchain.branch.{chain_id}
Subject: roadchain.merge.{chain_id}
Subject: roadchain.verify.{chain_id}
```

## SQL Schema

```sql
CREATE TABLE ps_sha_entry (
  id          TEXT PRIMARY KEY,
  chain_id    TEXT NOT NULL,
  hash        TEXT NOT NULL UNIQUE,
  prev        TEXT[] NOT NULL DEFAULT '{}',
  trinary     SMALLINT NOT NULL CHECK (trinary IN (-1, 0, 1)),
  payload     JSONB NOT NULL,
  timestamp   TIMESTAMPTZ NOT NULL,
  signature   TEXT NOT NULL,
  coherence   DOUBLE PRECISION NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ps_sha_chain ON ps_sha_entry(chain_id, created_at);
CREATE INDEX idx_ps_sha_hash ON ps_sha_entry(hash);
CREATE INDEX idx_ps_sha_prev ON ps_sha_entry USING GIN(prev);
```

## Comparison with Traditional Hash Chains

| Property | Traditional | PS-SHA∞ |
|----------|-------------|---------|
| Conflict handling | Chain breaks | Chain branches |
| Truth model | Binary (valid/invalid) | Trinary (-1/0/+1) |
| Fork resolution | Required (longest chain) | Optional (both persist) |
| Coherence | Decreases on conflict | Increases on conflict |
| Append-only | Yes | Yes |
| Verification | Hash + signature | Hash + signature + trinary + coherence |

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
