/**
 * GreenLight Type System — The Visual Language of BlackRoad OS
 *
 * Every entity in the system has a GreenLight state composed of:
 * lifecycle, scale, domain, priority, ownership, and optional metadata.
 *
 * Composite notation: 🚧👉🌀⭐🤖🌸
 * = WIP micro AI task, high priority, assigned to Cece
 */

// --- Lifecycle States ---

export const LIFECYCLE_STATES = {
  "⬛": "void",
  "📥": "inbox",
  "📋": "queued",
  "🎯": "targeted",
  "🚧": "wip",
  "⚡": "active",
  "🔄": "review",
  "⏸️": "paused",
  "🔒": "blocked",
  "🔀": "branched",
  "🩹": "healing",
  "✅": "done",
  "📦": "archived",
  "❌": "canceled",
  "💀": "dead",
} as const;

export type LifecycleEmoji = keyof typeof LIFECYCLE_STATES;
export type LifecycleCode = (typeof LIFECYCLE_STATES)[LifecycleEmoji];

// --- Scale Indicators ---

export const SCALE_INDICATORS = {
  "👉": "micro",
  "🎢": "macro",
  "🌐": "planetary",
  "🌌": "universal",
} as const;

export type ScaleEmoji = keyof typeof SCALE_INDICATORS;
export type ScaleCode = (typeof SCALE_INDICATORS)[ScaleEmoji];

// --- Domain Tags ---

export const DOMAIN_TAGS = {
  "🛣️": "platform",
  "🌀": "ai",
  "⛓️": "chain",
  "💎": "coin",
  "🧠": "intel",
  "📺": "media",
  "🎵": "audio",
  "🎮": "games",
  "📚": "edu",
  "🔒": "security",
  "🏛️": "gov",
  "💼": "biz",
  "🔧": "infra",
  "🎨": "creative",
  "📊": "data",
  "🌱": "growth",
  "🤝": "partner",
  "🔬": "labs",
} as const;

export type DomainEmoji = keyof typeof DOMAIN_TAGS;
export type DomainCode = (typeof DOMAIN_TAGS)[DomainEmoji];

// --- Priority Levels ---

export const PRIORITY_LEVELS = {
  "🔥": "p0",
  "🚨": "p1",
  "⭐": "p2",
  "📌": "p3",
  "💤": "p4",
  "🧊": "p5",
} as const;

export type PriorityEmoji = keyof typeof PRIORITY_LEVELS;
export type PriorityCode = (typeof PRIORITY_LEVELS)[PriorityEmoji];

export const PRIORITY_WEIGHTS: Record<PriorityCode, number> = {
  p0: 100,
  p1: 80,
  p2: 60,
  p3: 40,
  p4: 20,
  p5: 0,
};

// --- Effort / Sizing ---

export const EFFORT_SIZES = {
  "🫧": "xs",
  "🥄": "s",
  "🍽️": "m",
  "🍖": "l",
  "🦣": "xl",
  "🏔️": "xxl",
  "🌍": "xxxl",
} as const;

export type EffortEmoji = keyof typeof EFFORT_SIZES;
export type EffortCode = (typeof EFFORT_SIZES)[EffortEmoji];

export const EFFORT_POINTS: Record<EffortCode, number> = {
  xs: 1,
  s: 2,
  m: 3,
  l: 5,
  xl: 8,
  xxl: 13,
  xxxl: 21,
};

// --- Ownership / Assignment ---

export const OWNER_TYPES = {
  "👤": "human",
  "🤖": "agent",
  "⚙️": "system",
  "👥": "team",
  "🎭": "hybrid",
  "❓": "none",
} as const;

export type OwnerEmoji = keyof typeof OWNER_TYPES;
export type OwnerCode = (typeof OWNER_TYPES)[OwnerEmoji];

// --- Agent Identities ---

export const AGENT_IDENTITIES = {
  "🌸": "cece",
  "🔮": "lucidia",
  "🐇": "alice",
  "🎸": "silas",
  "🌙": "aria",
  "🎩": "blackroad",
  "🦊": "edge",
  "🐙": "swarm",
} as const;

export type AgentEmoji = keyof typeof AGENT_IDENTITIES;
export type AgentCode = (typeof AGENT_IDENTITIES)[AgentEmoji];

// --- Trinary Logic ---

export type Trinary = -1 | 0 | 1;

export const TRINARY_LABELS: Record<Trinary, string> = {
  [-1]: "negation",
  [0]: "superposition",
  [1]: "affirmation",
};

// --- Composite Entity ---

export interface GreenLightEntity {
  lifecycle: LifecycleCode;
  scale?: ScaleCode;
  domain?: DomainCode;
  priority?: PriorityCode;
  effort?: EffortCode;
  owner?: OwnerCode;
  agent?: AgentCode;
  id?: string;
}

// --- NATS Subject ---

export interface NatsSubject {
  state: LifecycleCode;
  scale: ScaleCode;
  domain: DomainCode;
  id: string;
}

// --- All emoji lookup maps ---

export const ALL_EMOJIS = {
  ...LIFECYCLE_STATES,
  ...SCALE_INDICATORS,
  ...DOMAIN_TAGS,
  ...PRIORITY_LEVELS,
  ...EFFORT_SIZES,
  ...OWNER_TYPES,
  ...AGENT_IDENTITIES,
} as const;

export type Category =
  | "lifecycle"
  | "scale"
  | "domain"
  | "priority"
  | "effort"
  | "owner"
  | "agent";

export function getCategoryForEmoji(
  emoji: string,
): Category | undefined {
  if (emoji in LIFECYCLE_STATES) return "lifecycle";
  if (emoji in SCALE_INDICATORS) return "scale";
  if (emoji in DOMAIN_TAGS) return "domain";
  if (emoji in PRIORITY_LEVELS) return "priority";
  if (emoji in EFFORT_SIZES) return "effort";
  if (emoji in OWNER_TYPES) return "owner";
  if (emoji in AGENT_IDENTITIES) return "agent";
  return undefined;
}
