import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Chain } from "../src/index.js";
import type { ChainPayload } from "../src/index.js";

function makePayload(type: string = "gl.create", actor: string = "cece"): ChainPayload {
  return {
    type,
    version: "1.0",
    data: { test: true },
    actor,
    actorType: "agent",
  };
}

describe("Chain", () => {
  it("creates an empty chain", () => {
    const chain = Chain.create("test-chain");
    assert.equal(chain.id, "test-chain");
    assert.equal(chain.length, 0);
    assert.equal(chain.coherence, 1.0);
    assert.equal(chain.head, "");
  });

  it("appends entries with correct sequence", () => {
    const chain = Chain.create("test");
    chain.append(makePayload());
    chain.append(makePayload("gl.transition"));
    chain.append(makePayload("gl.assign"));

    assert.equal(chain.length, 3);
    const entries = chain.getEntries();
    assert.equal(entries[0]!.sequence, 0);
    assert.equal(entries[1]!.sequence, 1);
    assert.equal(entries[2]!.sequence, 2);
  });

  it("genesis entry has empty prev", () => {
    const chain = Chain.create("test");
    const entry = chain.append(makePayload());
    assert.deepStrictEqual(entry.prev, []);
  });

  it("subsequent entries reference previous hash", () => {
    const chain = Chain.create("test");
    const first = chain.append(makePayload());
    const second = chain.append(makePayload("gl.transition"));
    assert.deepStrictEqual(second.prev, [first.hash]);
  });

  it("computes unique hashes per entry", () => {
    const chain = Chain.create("test");
    const a = chain.append(makePayload());
    const b = chain.append(makePayload());
    assert.notEqual(a.hash, b.hash);
  });

  it("entries have sha256: prefix on hash", () => {
    const chain = Chain.create("test");
    const entry = chain.append(makePayload());
    assert.ok(entry.hash.startsWith("sha256:"));
  });

  it("looks up entries by hash", () => {
    const chain = Chain.create("test");
    const entry = chain.append(makePayload());
    const found = chain.getByHash(entry.hash);
    assert.ok(found);
    assert.equal(found!.id, entry.id);
  });

  it("returns undefined for unknown hash", () => {
    const chain = Chain.create("test");
    assert.equal(chain.getByHash("sha256:nonexistent"), undefined);
  });

  it("tracks coherence across entries", () => {
    const chain = Chain.create("test");
    chain.append(makePayload(), 1);
    chain.append(makePayload(), 1);
    // Same trinary: coherence decays slightly (0.999 factor)
    assert.ok(chain.coherence > 0.99);
    assert.ok(chain.coherence < 1.01);
  });

  it("coherence increases under contradiction", () => {
    const chain = Chain.create("test");
    chain.append(makePayload(), 1);
    const beforeContradiction = chain.coherence;
    chain.append(makePayload(), -1); // Contradiction!
    assert.ok(chain.coherence > beforeContradiction);
  });
});

describe("Chain.branch", () => {
  it("creates a branch from an existing entry", () => {
    const chain = Chain.create("test");
    const a = chain.append(makePayload(), 1);
    const b = chain.append(makePayload("gl.transition"), 1);

    // Branch from b's parent (a), creating a contradiction
    const branched = chain.branch(b.hash, makePayload("gl.transition", "silas"), -1);
    assert.deepStrictEqual(branched.prev, b.prev);
    assert.equal(branched.trinary, -1);
  });

  it("throws for unknown hash", () => {
    const chain = Chain.create("test");
    assert.throws(
      () => chain.branch("sha256:fake", makePayload()),
      /Entry not found/,
    );
  });
});

describe("Chain.merge", () => {
  it("merges two entries", () => {
    const chain = Chain.create("test");
    const a = chain.append(makePayload(), 1);
    const b = chain.append(makePayload(), 1);
    const c = chain.append(makePayload(), -1);

    const merged = chain.merge(
      [b.hash, c.hash],
      { type: "gl.transition", version: "1.0", data: { merged: true }, actor: "swarm", actorType: "agent" },
      1,
    );

    assert.deepStrictEqual(merged.prev, [b.hash, c.hash]);
    assert.equal(merged.trinary, 1);
  });

  it("throws for unknown merge target", () => {
    const chain = Chain.create("test");
    chain.append(makePayload());
    assert.throws(
      () => chain.merge(["sha256:fake"], makePayload()),
      /Entry not found/,
    );
  });
});

describe("Chain.verify", () => {
  it("verifies a valid chain", () => {
    const chain = Chain.create("test");
    chain.append(makePayload(), 1);
    chain.append(makePayload("gl.transition"), 1);
    chain.append(makePayload("gl.assign"), 0);

    const result = chain.verify();
    assert.equal(result.valid, true);
    assert.deepStrictEqual(result.errors, []);
    assert.equal(result.entriesChecked, 3);
  });

  it("verifies an empty chain", () => {
    const chain = Chain.create("test");
    const result = chain.verify();
    assert.equal(result.valid, true);
    assert.equal(result.entriesChecked, 0);
  });

  it("reports coherence in verify result", () => {
    const chain = Chain.create("test");
    chain.append(makePayload(), 1);
    chain.append(makePayload(), -1);

    const result = chain.verify();
    assert.ok(result.coherence > 1.0); // Contradiction amplified coherence
  });
});

describe("Chain.getMeta", () => {
  it("returns correct metadata", () => {
    const chain = Chain.create("my-chain");
    chain.append(makePayload(), 1);
    chain.append(makePayload(), 1);

    const meta = chain.getMeta();
    assert.equal(meta.id, "my-chain");
    assert.equal(meta.length, 2);
    assert.ok(meta.coherence > 0);
    assert.ok(meta.head.startsWith("sha256:"));
    assert.ok(meta.createdAt.length > 0);
    assert.ok(meta.updatedAt.length > 0);
  });
});
