import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Navigate from dist/tests/ up to dist/src/cli.js
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CLI = resolve(__dirname, "..", "src", "cli.js");

function run(...args: string[]): string {
  return execFileSync("node", [CLI, ...args], {
    encoding: "utf-8",
    timeout: 10_000,
  }).trim();
}

function runFail(...args: string[]): string {
  try {
    execFileSync("node", [CLI, ...args], {
      encoding: "utf-8",
      timeout: 10_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    assert.fail("Expected command to fail");
  } catch (err: any) {
    return (err.stderr || err.stdout || "").toString().trim();
  }
  return "";
}

describe("CLI: parse", () => {
  it("parses a composite emoji string to JSON", () => {
    const out = run("parse", "🚧👉🌀⭐🤖🌸");
    const parsed = JSON.parse(out);
    assert.equal(parsed.lifecycle, "wip");
    assert.equal(parsed.scale, "micro");
    assert.equal(parsed.domain, "ai");
    assert.equal(parsed.priority, "p2");
    assert.equal(parsed.owner, "agent");
    assert.equal(parsed.agent, "cece");
  });

  it("parses a minimal emoji string", () => {
    const out = run("parse", "✅");
    const parsed = JSON.parse(out);
    assert.equal(parsed.lifecycle, "done");
  });

  it("fails on empty input", () => {
    const err = runFail("parse", "");
    assert.ok(err.includes("Could not parse"));
  });
});

describe("CLI: validate", () => {
  it("validates a correct emoji string", () => {
    const out = run("validate", "🚧👉🌀⭐");
    assert.ok(out.includes("Valid"));
  });
});

describe("CLI: nats", () => {
  it("generates a NATS subject", () => {
    const out = run("nats", "🚧👉🌀⭐", "--id", "01HX7ABC");
    assert.equal(out, "greenlight.wip.micro.ai.01HX7ABC");
  });

  it("fails without --id", () => {
    const err = runFail("nats", "🚧👉🌀⭐");
    assert.ok(err.includes("--id"));
  });
});

describe("CLI: nats-parse", () => {
  it("parses a NATS subject to JSON", () => {
    const out = run("nats-parse", "greenlight.wip.micro.ai.01HX7ABC");
    const parsed = JSON.parse(out);
    assert.equal(parsed.state, "wip");
    assert.equal(parsed.scale, "micro");
    assert.equal(parsed.domain, "ai");
    assert.equal(parsed.id, "01HX7ABC");
  });

  it("fails on invalid subject", () => {
    const err = runFail("nats-parse", "invalid");
    assert.ok(err.includes("Invalid"));
  });
});

describe("CLI: list", () => {
  it("lists a specific category", () => {
    const out = run("list", "priority");
    assert.ok(out.includes("PRIORITY"));
    assert.ok(out.includes("p0"));
    assert.ok(out.includes("p5"));
  });

  it("lists all categories when none specified", () => {
    const out = run("list");
    assert.ok(out.includes("LIFECYCLE"));
    assert.ok(out.includes("PRIORITY"));
    assert.ok(out.includes("AGENT"));
  });

  it("fails on unknown category", () => {
    const err = runFail("list", "fakecategory");
    assert.ok(err.includes("Unknown category"));
  });
});

describe("CLI: serialize", () => {
  it("serializes fields to emoji", () => {
    const out = run("serialize", "--lifecycle", "wip", "--scale", "micro", "--domain", "ai");
    assert.ok(out.includes("🚧"));
    assert.ok(out.includes("👉"));
    assert.ok(out.includes("🌀"));
  });

  it("fails without --lifecycle", () => {
    const err = runFail("serialize", "--scale", "micro");
    assert.ok(err.includes("--lifecycle"));
  });
});

describe("CLI: help", () => {
  it("shows help text", () => {
    const out = run("help");
    assert.ok(out.includes("GreenLight CLI"));
    assert.ok(out.includes("parse"));
    assert.ok(out.includes("validate"));
  });

  it("shows help with --help flag", () => {
    const out = run("--help");
    assert.ok(out.includes("GreenLight CLI"));
  });
});

describe("CLI: unknown command", () => {
  it("shows error for unknown command", () => {
    const err = runFail("notacommand");
    assert.ok(err.includes("Unknown command"));
  });
});
