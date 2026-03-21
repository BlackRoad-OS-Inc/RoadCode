import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  negate,
  and,
  or,
  consensus,
  amundson,
  zFramework,
  isEquilibrium,
  trinaryLabel,
  trinarySymbol,
} from "../src/index.js";

describe("negate", () => {
  it("negates +1 to -1", () => assert.equal(negate(1), -1));
  it("negates -1 to +1", () => assert.equal(negate(-1), 1));
  it("keeps 0 as 0", () => assert.equal(negate(0), 0));
});

describe("and (trinary)", () => {
  it("returns minimum of two values", () => {
    assert.equal(and(1, 1), 1);
    assert.equal(and(1, 0), 0);
    assert.equal(and(1, -1), -1);
    assert.equal(and(0, -1), -1);
    assert.equal(and(-1, -1), -1);
  });
});

describe("or (trinary)", () => {
  it("returns maximum of two values", () => {
    assert.equal(or(1, 1), 1);
    assert.equal(or(1, 0), 1);
    assert.equal(or(1, -1), 1);
    assert.equal(or(0, -1), 0);
    assert.equal(or(-1, -1), -1);
  });
});

describe("consensus", () => {
  it("returns affirmation for mostly positive", () => {
    assert.equal(consensus([1, 1, 0]), 1);
    assert.equal(consensus([1, 1, 1]), 1);
  });

  it("returns negation for mostly negative", () => {
    assert.equal(consensus([-1, -1, 0]), -1);
    assert.equal(consensus([-1, -1, -1]), -1);
  });

  it("returns superposition for mixed", () => {
    assert.equal(consensus([1, -1]), 0);
    assert.equal(consensus([1, 0, -1]), 0);
    assert.equal(consensus([0, 0, 0]), 0);
  });

  it("returns 0 for empty array", () => {
    assert.equal(consensus([]), 0);
  });
});

describe("amundson", () => {
  it("amplifies coherence under contradiction", () => {
    const base = amundson(1.0, 0, 1.0);
    const amplified = amundson(1.0, 2.0, 1.0);
    assert.ok(amplified > base);
  });

  it("returns coherence when no contradiction", () => {
    assert.equal(amundson(5.0, 0, 1.0), 5.0);
  });

  it("treats negative contradiction same as positive", () => {
    const pos = amundson(1.0, 2.0, 1.0);
    const neg = amundson(1.0, -2.0, 1.0);
    assert.equal(pos, neg);
  });

  it("uses lambda as amplification factor", () => {
    const low = amundson(1.0, 1.0, 0.5);
    const high = amundson(1.0, 1.0, 2.0);
    assert.ok(high > low);
  });
});

describe("zFramework", () => {
  it("returns 0 at equilibrium", () => {
    // y * x - w = 0 when y*x = w
    assert.equal(zFramework(2, 3, 6), 0);  // 2*3 - 6 = 0
  });

  it("returns positive when response exceeds target", () => {
    assert.ok(zFramework(3, 3, 5) > 0);  // 3*3 - 5 = 4
  });

  it("returns negative when response undershoots target", () => {
    assert.ok(zFramework(1, 2, 5) < 0);  // 1*2 - 5 = -3
  });
});

describe("isEquilibrium", () => {
  it("returns true when Z is near zero", () => {
    assert.equal(isEquilibrium(0), true);
    assert.equal(isEquilibrium(0.0005), true);
  });

  it("returns false when Z is far from zero", () => {
    assert.equal(isEquilibrium(1.0), false);
    assert.equal(isEquilibrium(-0.5), false);
  });

  it("respects custom tolerance", () => {
    assert.equal(isEquilibrium(0.5, 1.0), true);
    assert.equal(isEquilibrium(0.5, 0.1), false);
  });
});

describe("trinaryLabel", () => {
  it("returns correct labels", () => {
    assert.equal(trinaryLabel(1), "affirmation");
    assert.equal(trinaryLabel(0), "superposition");
    assert.equal(trinaryLabel(-1), "negation");
  });
});

describe("trinarySymbol", () => {
  it("returns correct symbols", () => {
    assert.equal(trinarySymbol(1), "+1");
    assert.equal(trinarySymbol(0), "0");
    assert.equal(trinarySymbol(-1), "−1");
  });
});
