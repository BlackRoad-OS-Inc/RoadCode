import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  stepCoherence,
  computeChainCoherence,
  detectContradictions,
} from "../src/index.js";

describe("stepCoherence", () => {
  it("stays near 1.0 with no contradiction", () => {
    const result = stepCoherence(1.0, 1, 1);
    // delta = 0, so e^(0) = 1, then * decay
    assert.ok(result > 0.99);
    assert.ok(result < 1.0);
  });

  it("amplifies under small contradiction", () => {
    // +1 to 0 = delta of 1
    const result = stepCoherence(1.0, 1, 0);
    assert.ok(result > 1.0); // e^(0.1*1) * 0.999 ≈ 1.104
  });

  it("amplifies more under large contradiction", () => {
    // +1 to -1 = delta of 2
    const small = stepCoherence(1.0, 1, 0);   // delta = 1
    const large = stepCoherence(1.0, 1, -1);   // delta = 2
    assert.ok(large > small);
  });

  it("respects custom lambda", () => {
    const lowLambda = stepCoherence(1.0, 1, -1, 0.05);
    const highLambda = stepCoherence(1.0, 1, -1, 0.5);
    assert.ok(highLambda > lowLambda);
  });
});

describe("computeChainCoherence", () => {
  it("returns 1.0 for empty chain", () => {
    assert.equal(computeChainCoherence([]), 1.0);
  });

  it("returns 1.0 for single entry", () => {
    assert.equal(computeChainCoherence([{ trinary: 1 }]), 1.0);
  });

  it("stays stable for consistent chain", () => {
    const entries = Array.from({ length: 10 }, () => ({ trinary: 1 as const }));
    const coherence = computeChainCoherence(entries);
    // Should be close to 1.0, slightly decayed
    assert.ok(coherence > 0.98);
    assert.ok(coherence < 1.01);
  });

  it("increases with contradictions", () => {
    const consistent = computeChainCoherence([
      { trinary: 1 }, { trinary: 1 }, { trinary: 1 },
    ]);
    const contradictory = computeChainCoherence([
      { trinary: 1 }, { trinary: -1 }, { trinary: 1 },
    ]);
    assert.ok(contradictory > consistent);
  });
});

describe("detectContradictions", () => {
  it("returns empty for linear chain", () => {
    const entries = [
      { id: "a", trinary: 1 as const, prev: [] as string[] },
      { id: "b", trinary: 1 as const, prev: ["hash-a"] },
      { id: "c", trinary: 1 as const, prev: ["hash-b"] },
    ];
    const result = detectContradictions(entries);
    assert.equal(result.length, 0);
  });

  it("detects branches (shared prev)", () => {
    const entries = [
      { id: "a", trinary: 1 as const, prev: [] as string[] },
      { id: "b", trinary: 1 as const, prev: ["hash-a"] },
      { id: "c", trinary: -1 as const, prev: ["hash-a"] },
    ];
    const result = detectContradictions(entries);
    assert.equal(result.length, 1);
    assert.equal(result[0]!.type, "branch");
    assert.ok(["b", "c"].includes(result[0]!.entryA));
    assert.ok(["b", "c"].includes(result[0]!.entryB));
  });

  it("detects multiple branches", () => {
    const entries = [
      { id: "a", trinary: 1 as const, prev: [] as string[] },
      { id: "b", trinary: 1 as const, prev: ["hash-a"] },
      { id: "c", trinary: -1 as const, prev: ["hash-a"] },
      { id: "d", trinary: 0 as const, prev: ["hash-a"] },
    ];
    const result = detectContradictions(entries);
    // 3 entries share "hash-a": 3 choose 2 = 3 pairs
    assert.equal(result.length, 3);
  });
});
