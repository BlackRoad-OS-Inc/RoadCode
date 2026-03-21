#!/usr/bin/env node

/**
 * GreenLight CLI — Parse, validate, and format GreenLight emoji entities
 *
 * Usage:
 *   greenlight parse "🚧👉🌀⭐🤖🌸"
 *   greenlight serialize --lifecycle wip --scale micro --domain ai
 *   greenlight validate "🚧👉🌀⭐"
 *   greenlight nats "🚧👉🌀⭐" --id 01HX7ABC
 *   greenlight list [category]
 */

import {
  parse,
  serialize,
  validate,
  toNatsSubject,
  parseNatsSubject,
  LIFECYCLE_STATES,
  SCALE_INDICATORS,
  DOMAIN_TAGS,
  PRIORITY_LEVELS,
  EFFORT_SIZES,
  OWNER_TYPES,
  AGENT_IDENTITIES,
  type GreenLightEntity,
} from "@roadcode/greenlight";

const HELP = `
🛣️ GreenLight CLI — The Visual Language of BlackRoad OS

Usage:
  greenlight parse <emojis>                          Parse emoji string to JSON
  greenlight serialize --lifecycle <code> [...]       Build emoji from codes
  greenlight validate <emojis>                       Validate an emoji string
  greenlight nats <emojis> --id <id>                 Format as NATS subject
  greenlight nats-parse <subject>                    Parse NATS subject
  greenlight list [category]                         List all emojis

Categories: lifecycle, scale, domain, priority, effort, owner, agent

Examples:
  greenlight parse "🚧👉🌀⭐🤖🌸"
  greenlight serialize --lifecycle wip --scale micro --domain ai --priority p2
  greenlight nats "🚧👉🌀" --id 01HX7ABC
  greenlight list priority
`.trim();

function printJson(obj: unknown): void {
  console.log(JSON.stringify(obj, null, 2));
}

function cmdParse(input: string): void {
  const result = parse(input);
  if (!result) {
    console.error("❌ Could not parse input. Ensure it contains a valid lifecycle emoji.");
    process.exit(1);
  }
  printJson(result);
}

function cmdSerialize(args: string[]): void {
  const entity: Partial<GreenLightEntity> = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, "");
    const value = args[i + 1];
    if (key && value) {
      (entity as Record<string, string>)[key] = value;
    }
  }

  if (!entity.lifecycle) {
    console.error("❌ --lifecycle is required");
    process.exit(1);
  }

  const result = serialize(entity as GreenLightEntity);
  console.log(result);
}

function cmdValidate(input: string): void {
  const result = parse(input);
  if (!result) {
    console.error("❌ Could not parse input.");
    process.exit(1);
  }

  const errors = validate(result);
  if (errors.length === 0) {
    console.log("✅ Valid GreenLight entity");
    printJson(result);
  } else {
    console.error("❌ Validation errors:");
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
}

function cmdNats(input: string, args: string[]): void {
  const idIndex = args.indexOf("--id");
  const id = idIndex >= 0 ? args[idIndex + 1] : undefined;

  if (!id) {
    console.error("❌ --id is required");
    process.exit(1);
  }

  const entity = parse(input);
  if (!entity) {
    console.error("❌ Could not parse input.");
    process.exit(1);
  }

  const subject = toNatsSubject(entity, id);
  if (!subject) {
    console.error("❌ Entity needs lifecycle, scale, and domain for NATS subject");
    process.exit(1);
  }

  console.log(subject);
}

function cmdNatsParse(subject: string): void {
  const result = parseNatsSubject(subject);
  if (!result) {
    console.error("❌ Invalid NATS subject. Expected: greenlight.{state}.{scale}.{domain}.{id}");
    process.exit(1);
  }
  printJson(result);
}

function cmdList(category?: string): void {
  const maps: Record<string, Record<string, string>> = {
    lifecycle: LIFECYCLE_STATES,
    scale: SCALE_INDICATORS,
    domain: DOMAIN_TAGS,
    priority: PRIORITY_LEVELS,
    effort: EFFORT_SIZES,
    owner: OWNER_TYPES,
    agent: AGENT_IDENTITIES,
  };

  if (category && category in maps) {
    console.log(`\n${category.toUpperCase()}:`);
    for (const [emoji, code] of Object.entries(maps[category])) {
      console.log(`  ${emoji}  ${code}`);
    }
  } else if (category) {
    console.error(`❌ Unknown category: ${category}`);
    console.error(`   Valid: ${Object.keys(maps).join(", ")}`);
    process.exit(1);
  } else {
    for (const [cat, map] of Object.entries(maps)) {
      console.log(`\n${cat.toUpperCase()}:`);
      for (const [emoji, code] of Object.entries(map)) {
        console.log(`  ${emoji}  ${code}`);
      }
    }
  }
}

// --- Main ---

const [, , command, ...rest] = process.argv;

switch (command) {
  case "parse":
    cmdParse(rest[0] ?? "");
    break;
  case "serialize":
    cmdSerialize(rest);
    break;
  case "validate":
    cmdValidate(rest[0] ?? "");
    break;
  case "nats":
    cmdNats(rest[0] ?? "", rest.slice(1));
    break;
  case "nats-parse":
    cmdNatsParse(rest[0] ?? "");
    break;
  case "list":
    cmdList(rest[0]);
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    console.log(HELP);
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    console.log(HELP);
    process.exit(1);
}
