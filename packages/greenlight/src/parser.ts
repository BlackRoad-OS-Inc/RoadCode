/**
 * GreenLight Parser — Parse composite emoji strings into structured entities
 *
 * Input:  "🚧👉🌀⭐🤖🌸"
 * Output: { lifecycle: "wip", scale: "micro", domain: "ai", priority: "p2", owner: "agent", agent: "cece" }
 */

import {
  type GreenLightEntity,
  type NatsSubject,
  type Category,
  LIFECYCLE_STATES,
  SCALE_INDICATORS,
  DOMAIN_TAGS,
  PRIORITY_LEVELS,
  EFFORT_SIZES,
  OWNER_TYPES,
  AGENT_IDENTITIES,
  getCategoryForEmoji,
} from "./types.js";

/**
 * Segment a string into individual emoji characters/sequences.
 * Handles multi-codepoint emojis (ZWJ sequences, variation selectors, etc.)
 */
export function segmentEmojis(input: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...segmenter.segment(input)]
      .map((s) => s.segment)
      .filter((s) => /\p{Emoji}/u.test(s));
  }
  // Fallback: split on emoji regex
  const matches = input.match(/\p{Emoji_Presentation}[\u{FE00}-\u{FE0F}\u{200D}\p{Emoji_Presentation}]*/gu);
  return matches ?? [];
}

/**
 * Find the code for an emoji in one of the lookup maps.
 * Returns [category, code] or undefined.
 */
function lookupEmoji(emoji: string): [Category, string] | undefined {
  // Try exact match first
  const maps: [Category, Record<string, string>][] = [
    ["lifecycle", LIFECYCLE_STATES],
    ["scale", SCALE_INDICATORS],
    ["domain", DOMAIN_TAGS],
    ["priority", PRIORITY_LEVELS],
    ["effort", EFFORT_SIZES],
    ["owner", OWNER_TYPES],
    ["agent", AGENT_IDENTITIES],
  ];

  for (const [category, map] of maps) {
    if (emoji in map) {
      return [category, map[emoji as keyof typeof map]];
    }
  }

  // Try stripping variation selector (U+FE0F) for partial matches
  const stripped = emoji.replace(/\uFE0F/g, "");
  if (stripped !== emoji) {
    for (const [category, map] of maps) {
      if (stripped in map) {
        return [category, map[stripped as keyof typeof map]];
      }
      // Also try adding variation selector to map keys
      for (const key of Object.keys(map)) {
        if (key.replace(/\uFE0F/g, "") === stripped) {
          return [category, map[key as keyof typeof map]];
        }
      }
    }
  }

  return undefined;
}

/**
 * Parse a composite GreenLight emoji string into a structured entity.
 *
 * @example
 * parse("🚧👉🌀⭐🤖🌸")
 * // { lifecycle: "wip", scale: "micro", domain: "ai", priority: "p2", owner: "agent", agent: "cece" }
 */
export function parse(input: string): GreenLightEntity | null {
  const emojis = segmentEmojis(input.trim());
  if (emojis.length === 0) return null;

  const entity: Partial<GreenLightEntity> = {};

  for (const emoji of emojis) {
    const result = lookupEmoji(emoji);
    if (!result) continue;

    const [category, code] = result;
    (entity as Record<string, string>)[category] = code;
  }

  // lifecycle is required
  if (!entity.lifecycle) return null;

  return entity as GreenLightEntity;
}

/**
 * Serialize a GreenLight entity back into composite emoji string.
 *
 * @example
 * serialize({ lifecycle: "wip", scale: "micro", domain: "ai", priority: "p2" })
 * // "🚧👉🌀⭐"
 */
export function serialize(entity: GreenLightEntity): string {
  const codeToEmoji = new Map<string, string>();

  const maps: [keyof GreenLightEntity, Record<string, string>][] = [
    ["lifecycle", LIFECYCLE_STATES],
    ["scale", SCALE_INDICATORS],
    ["domain", DOMAIN_TAGS],
    ["priority", PRIORITY_LEVELS],
    ["effort", EFFORT_SIZES],
    ["owner", OWNER_TYPES],
    ["agent", AGENT_IDENTITIES],
  ];

  for (const [, map] of maps) {
    for (const [emoji, code] of Object.entries(map)) {
      codeToEmoji.set(code, emoji);
    }
  }

  const parts: string[] = [];
  const fields: (keyof GreenLightEntity)[] = [
    "lifecycle",
    "scale",
    "domain",
    "priority",
    "effort",
    "owner",
    "agent",
  ];

  for (const field of fields) {
    const code = entity[field];
    if (code && codeToEmoji.has(code)) {
      parts.push(codeToEmoji.get(code)!);
    }
  }

  return parts.join("");
}

/**
 * Format a GreenLight entity as a NATS subject.
 *
 * @example
 * toNatsSubject({ lifecycle: "wip", scale: "micro", domain: "ai" }, "01HX7ABC")
 * // "greenlight.wip.micro.ai.01HX7ABC"
 */
export function toNatsSubject(
  entity: GreenLightEntity,
  id: string,
): string | null {
  if (!entity.lifecycle || !entity.scale || !entity.domain) return null;
  return `greenlight.${entity.lifecycle}.${entity.scale}.${entity.domain}.${id}`;
}

/**
 * Parse a NATS subject back into entity fields.
 *
 * @example
 * parseNatsSubject("greenlight.wip.micro.ai.01HX7ABC")
 * // { state: "wip", scale: "micro", domain: "ai", id: "01HX7ABC" }
 */
export function parseNatsSubject(subject: string): NatsSubject | null {
  const parts = subject.split(".");
  if (parts.length !== 5 || parts[0] !== "greenlight") return null;

  return {
    state: parts[1] as NatsSubject["state"],
    scale: parts[2] as NatsSubject["scale"],
    domain: parts[3] as NatsSubject["domain"],
    id: parts[4],
  };
}

/**
 * Validate that a GreenLight entity has all required fields.
 */
export function validate(entity: GreenLightEntity): string[] {
  const errors: string[] = [];

  if (!entity.lifecycle) {
    errors.push("lifecycle is required");
  }

  const validLifecycles = Object.values(LIFECYCLE_STATES);
  if (entity.lifecycle && !validLifecycles.includes(entity.lifecycle as any)) {
    errors.push(`invalid lifecycle: ${entity.lifecycle}`);
  }

  const validScales = Object.values(SCALE_INDICATORS);
  if (entity.scale && !validScales.includes(entity.scale as any)) {
    errors.push(`invalid scale: ${entity.scale}`);
  }

  const validDomains = Object.values(DOMAIN_TAGS);
  if (entity.domain && !validDomains.includes(entity.domain as any)) {
    errors.push(`invalid domain: ${entity.domain}`);
  }

  const validPriorities = Object.values(PRIORITY_LEVELS);
  if (entity.priority && !validPriorities.includes(entity.priority as any)) {
    errors.push(`invalid priority: ${entity.priority}`);
  }

  return errors;
}
