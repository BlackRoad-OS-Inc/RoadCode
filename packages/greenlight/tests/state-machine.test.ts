import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canTransition,
  transition,
  nextStates,
  isTerminal,
  getTrinarySentiment,
  TERMINAL_STATES,
} from "../src/index.js";

describe("canTransition", () => {
  it("allows valid transitions", () => {
    assert.equal(canTransition("void", "inbox"), true);
    assert.equal(canTransition("inbox", "wip"), true);
    assert.equal(canTransition("wip", "done"), true);
    assert.equal(canTransition("wip", "blocked"), true);
    assert.equal(canTransition("done", "archived"), true);
    assert.equal(canTransition("done", "wip"), true); // reopen
  });

  it("rejects invalid transitions", () => {
    assert.equal(canTransition("void", "done"), false);
    assert.equal(canTransition("inbox", "archived"), false);
    assert.equal(canTransition("done", "blocked"), false);
  });

  it("rejects transitions from terminal states", () => {
    assert.equal(canTransition("archived", "wip"), false);
    assert.equal(canTransition("canceled", "inbox"), false);
    assert.equal(canTransition("dead", "healing"), false);
  });
});

describe("transition", () => {
  it("returns new state on valid transition", () => {
    assert.equal(transition("void", "inbox"), "inbox");
    assert.equal(transition("wip", "done"), "done");
  });

  it("throws on invalid transition", () => {
    assert.throws(() => transition("void", "done"), /Cannot transition/);
  });

  it("throws with helpful message for terminal states", () => {
    assert.throws(() => transition("archived", "wip"), /terminal state/);
  });
});

describe("nextStates", () => {
  it("returns valid next states for wip", () => {
    const next = nextStates("wip");
    assert.ok(next.includes("done"));
    assert.ok(next.includes("blocked"));
    assert.ok(next.includes("review"));
    assert.ok(next.length > 0);
  });

  it("returns empty array for terminal states", () => {
    assert.deepStrictEqual(nextStates("archived"), []);
    assert.deepStrictEqual(nextStates("canceled"), []);
    assert.deepStrictEqual(nextStates("dead"), []);
  });
});

describe("isTerminal", () => {
  it("identifies terminal states", () => {
    assert.equal(isTerminal("archived"), true);
    assert.equal(isTerminal("canceled"), true);
    assert.equal(isTerminal("dead"), true);
  });

  it("identifies non-terminal states", () => {
    assert.equal(isTerminal("wip"), false);
    assert.equal(isTerminal("done"), false);
    assert.equal(isTerminal("void"), false);
  });
});

describe("getTrinarySentiment", () => {
  it("returns +1 for active states", () => {
    assert.equal(getTrinarySentiment("wip"), 1);
    assert.equal(getTrinarySentiment("active"), 1);
    assert.equal(getTrinarySentiment("done"), 1);
  });

  it("returns 0 for superposition states", () => {
    assert.equal(getTrinarySentiment("inbox"), 0);
    assert.equal(getTrinarySentiment("paused"), 0);
    assert.equal(getTrinarySentiment("healing"), 0);
  });

  it("returns -1 for negation states", () => {
    assert.equal(getTrinarySentiment("blocked"), -1);
    assert.equal(getTrinarySentiment("canceled"), -1);
    assert.equal(getTrinarySentiment("dead"), -1);
  });

  it("returns null for void", () => {
    assert.equal(getTrinarySentiment("void"), null);
  });
});

describe("TERMINAL_STATES", () => {
  it("contains exactly three terminal states", () => {
    assert.equal(TERMINAL_STATES.length, 3);
    assert.ok(TERMINAL_STATES.includes("archived"));
    assert.ok(TERMINAL_STATES.includes("canceled"));
    assert.ok(TERMINAL_STATES.includes("dead"));
  });
});
