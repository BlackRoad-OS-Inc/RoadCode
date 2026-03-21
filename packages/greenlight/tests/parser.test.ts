import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parse,
  serialize,
  segmentEmojis,
  toNatsSubject,
  parseNatsSubject,
  validate,
} from "../src/index.js";

describe("segmentEmojis", () => {
  it("splits a composite emoji string into individual emojis", () => {
    const result = segmentEmojis("🚧👉🌀");
    assert.ok(result.length >= 3);
  });

  it("returns empty array for non-emoji input", () => {
    const result = segmentEmojis("hello world");
    assert.deepStrictEqual(result, []);
  });

  it("returns empty array for empty string", () => {
    const result = segmentEmojis("");
    assert.deepStrictEqual(result, []);
  });
});

describe("parse", () => {
  it("parses a full composite GreenLight string", () => {
    const result = parse("🚧👉🌀⭐🤖🌸");
    assert.ok(result !== null);
    assert.equal(result!.lifecycle, "wip");
    assert.equal(result!.scale, "micro");
    assert.equal(result!.domain, "ai");
    assert.equal(result!.priority, "p2");
    assert.equal(result!.owner, "agent");
    assert.equal(result!.agent, "cece");
  });

  it("parses lifecycle-only string", () => {
    const result = parse("✅");
    assert.ok(result !== null);
    assert.equal(result!.lifecycle, "done");
  });

  it("returns null for empty input", () => {
    assert.equal(parse(""), null);
  });

  it("returns null for input with no lifecycle", () => {
    assert.equal(parse("👉🌀"), null);
  });

  it("parses blocked state", () => {
    const result = parse("🔒🌐🔧🔥");
    assert.ok(result !== null);
    assert.equal(result!.lifecycle, "blocked");
    assert.equal(result!.scale, "planetary");
    assert.equal(result!.priority, "p0");
  });

  it("parses done macro chain project", () => {
    const result = parse("✅🎢⛓️📌👥");
    assert.ok(result !== null);
    assert.equal(result!.lifecycle, "done");
    assert.equal(result!.scale, "macro");
    assert.equal(result!.domain, "chain");
    assert.equal(result!.priority, "p3");
    assert.equal(result!.owner, "team");
  });
});

describe("serialize", () => {
  it("serializes entity back to emoji string", () => {
    const result = serialize({
      lifecycle: "wip",
      scale: "micro",
      domain: "ai",
      priority: "p2",
      owner: "agent",
      agent: "cece",
    });
    assert.ok(result.includes("🚧"));
    assert.ok(result.includes("👉"));
    assert.ok(result.includes("🌀"));
    assert.ok(result.includes("⭐"));
    assert.ok(result.includes("🤖"));
    assert.ok(result.includes("🌸"));
  });

  it("serializes minimal entity", () => {
    const result = serialize({ lifecycle: "done" });
    assert.ok(result.includes("✅"));
  });

  it("round-trips parse -> serialize", () => {
    const entity = parse("🚧👉🌀⭐");
    assert.ok(entity !== null);
    const serialized = serialize(entity!);
    const reparsed = parse(serialized);
    assert.ok(reparsed !== null);
    assert.equal(reparsed!.lifecycle, entity!.lifecycle);
    assert.equal(reparsed!.scale, entity!.scale);
    assert.equal(reparsed!.domain, entity!.domain);
    assert.equal(reparsed!.priority, entity!.priority);
  });
});

describe("toNatsSubject", () => {
  it("formats entity as NATS subject", () => {
    const result = toNatsSubject(
      { lifecycle: "wip", scale: "micro", domain: "ai" },
      "01HX7ABC",
    );
    assert.equal(result, "greenlight.wip.micro.ai.01HX7ABC");
  });

  it("returns null when required fields are missing", () => {
    assert.equal(toNatsSubject({ lifecycle: "wip" }, "01HX7ABC"), null);
  });
});

describe("parseNatsSubject", () => {
  it("parses a valid NATS subject", () => {
    const result = parseNatsSubject("greenlight.wip.micro.ai.01HX7ABC");
    assert.ok(result !== null);
    assert.equal(result!.state, "wip");
    assert.equal(result!.scale, "micro");
    assert.equal(result!.domain, "ai");
    assert.equal(result!.id, "01HX7ABC");
  });

  it("returns null for invalid subject", () => {
    assert.equal(parseNatsSubject("not.a.valid.subject"), null);
    assert.equal(parseNatsSubject("greenlight.wip"), null);
    assert.equal(parseNatsSubject(""), null);
  });
});

describe("validate", () => {
  it("returns empty array for valid entity", () => {
    const errors = validate({
      lifecycle: "wip",
      scale: "micro",
      domain: "ai",
      priority: "p2",
    });
    assert.deepStrictEqual(errors, []);
  });

  it("returns error for missing lifecycle", () => {
    const errors = validate({} as any);
    assert.ok(errors.length > 0);
    assert.ok(errors[0]!.includes("lifecycle"));
  });

  it("returns error for invalid lifecycle", () => {
    const errors = validate({ lifecycle: "nope" as any });
    assert.ok(errors.length > 0);
    assert.ok(errors[0]!.includes("invalid lifecycle"));
  });
});
