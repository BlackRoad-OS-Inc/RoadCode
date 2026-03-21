import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildSubject,
  buildPattern,
  parseSubject,
  validateMessage,
  createMessage,
} from "../src/index.js";

describe("buildSubject", () => {
  it("builds a valid NATS subject", () => {
    assert.equal(
      buildSubject("wip", "micro", "ai", "01HX7ABC"),
      "greenlight.wip.micro.ai.01HX7ABC",
    );
  });

  it("builds subjects for different states", () => {
    assert.equal(
      buildSubject("blocked", "planetary", "infra", "ID123"),
      "greenlight.blocked.planetary.infra.ID123",
    );
  });
});

describe("buildPattern", () => {
  it("builds wildcard pattern for all WIP", () => {
    assert.equal(buildPattern({ state: "wip" }), "greenlight.wip.*.*.*");
  });

  it("builds pattern for specific domain", () => {
    assert.equal(
      buildPattern({ domain: "ai" }),
      "greenlight.*.*.ai.*",
    );
  });

  it("builds fully wildcard pattern", () => {
    assert.equal(buildPattern({}), "greenlight.*.*.*.*");
  });

  it("builds specific pattern", () => {
    assert.equal(
      buildPattern({ state: "done", scale: "macro", domain: "chain", id: "X" }),
      "greenlight.done.macro.chain.X",
    );
  });
});

describe("parseSubject", () => {
  it("parses a valid subject", () => {
    const result = parseSubject("greenlight.wip.micro.ai.01HX7ABC");
    assert.ok(result !== null);
    assert.equal(result!.state, "wip");
    assert.equal(result!.scale, "micro");
    assert.equal(result!.domain, "ai");
    assert.equal(result!.id, "01HX7ABC");
  });

  it("returns null for wrong prefix", () => {
    assert.equal(parseSubject("other.wip.micro.ai.01HX"), null);
  });

  it("returns null for wrong segment count", () => {
    assert.equal(parseSubject("greenlight.wip.micro"), null);
  });

  it("returns null for invalid lifecycle", () => {
    assert.equal(parseSubject("greenlight.fake.micro.ai.ID"), null);
  });

  it("returns null for invalid scale", () => {
    assert.equal(parseSubject("greenlight.wip.fake.ai.ID"), null);
  });

  it("returns null for invalid domain", () => {
    assert.equal(parseSubject("greenlight.wip.micro.fake.ID"), null);
  });
});

describe("validateMessage", () => {
  it("validates a correct message", () => {
    const errors = validateMessage({
      id: "01HX7ABC",
      entity: { lifecycle: "wip", scale: "micro", domain: "ai" },
      timestamp: "2026-03-21T10:30:00Z",
    });
    assert.deepStrictEqual(errors, []);
  });

  it("validates message with transition", () => {
    const errors = validateMessage({
      id: "01HX7ABC",
      entity: { lifecycle: "wip" },
      timestamp: "2026-03-21T10:30:00Z",
      transition: { from: "inbox", to: "wip" },
    });
    assert.deepStrictEqual(errors, []);
  });

  it("rejects non-object", () => {
    const errors = validateMessage("not an object");
    assert.ok(errors.length > 0);
  });

  it("rejects missing id", () => {
    const errors = validateMessage({
      entity: { lifecycle: "wip" },
      timestamp: "2026-03-21T10:30:00Z",
    });
    assert.ok(errors.some((e: string) => e.includes("id")));
  });

  it("rejects missing entity", () => {
    const errors = validateMessage({
      id: "01HX7ABC",
      timestamp: "2026-03-21T10:30:00Z",
    });
    assert.ok(errors.some((e: string) => e.includes("entity")));
  });

  it("rejects invalid lifecycle in entity", () => {
    const errors = validateMessage({
      id: "01HX7ABC",
      entity: { lifecycle: "fake" },
      timestamp: "2026-03-21T10:30:00Z",
    });
    assert.ok(errors.some((e: string) => e.includes("lifecycle")));
  });

  it("rejects invalid transition codes", () => {
    const errors = validateMessage({
      id: "01HX7ABC",
      entity: { lifecycle: "wip" },
      timestamp: "2026-03-21T10:30:00Z",
      transition: { from: "fake", to: "also_fake" },
    });
    assert.ok(errors.length >= 2);
  });
});

describe("createMessage", () => {
  it("creates a well-formed message", () => {
    const msg = createMessage("01HX", { lifecycle: "wip", scale: "micro", domain: "ai" });
    assert.equal(msg.id, "01HX");
    assert.equal(msg.entity.lifecycle, "wip");
    assert.ok(msg.timestamp.length > 0);
    assert.equal(msg.transition, undefined);
  });

  it("includes transition when provided", () => {
    const msg = createMessage(
      "01HX",
      { lifecycle: "wip" },
      { from: "inbox", to: "wip" },
      "cece",
      "agent",
    );
    assert.ok(msg.transition !== undefined);
    assert.equal(msg.transition!.from, "inbox");
    assert.equal(msg.transition!.to, "wip");
    assert.equal(msg.actor, "cece");
    assert.equal(msg.actorType, "agent");
  });
});
