export {
  // Types and constants
  LIFECYCLE_STATES,
  SCALE_INDICATORS,
  DOMAIN_TAGS,
  PRIORITY_LEVELS,
  PRIORITY_WEIGHTS,
  EFFORT_SIZES,
  EFFORT_POINTS,
  OWNER_TYPES,
  AGENT_IDENTITIES,
  ALL_EMOJIS,
  TRINARY_LABELS,
  getCategoryForEmoji,
} from "./types.js";

export type {
  LifecycleEmoji,
  LifecycleCode,
  ScaleEmoji,
  ScaleCode,
  DomainEmoji,
  DomainCode,
  PriorityEmoji,
  PriorityCode,
  EffortEmoji,
  EffortCode,
  OwnerEmoji,
  OwnerCode,
  AgentEmoji,
  AgentCode,
  Trinary,
  Category,
  GreenLightEntity,
  NatsSubject,
} from "./types.js";

export {
  parse,
  serialize,
  segmentEmojis,
  toNatsSubject,
  parseNatsSubject,
  validate,
} from "./parser.js";

// State machine
export {
  TRANSITIONS,
  TERMINAL_STATES,
  LIFECYCLE_TRINARY,
  canTransition,
  transition,
  nextStates,
  isTerminal,
  getTrinarySentiment,
} from "./state-machine.js";

// Trinary logic
export {
  negate,
  and,
  or,
  consensus,
  amundson,
  zFramework,
  isEquilibrium,
  label as trinaryLabel,
  symbol as trinarySymbol,
} from "./trinary.js";

// NATS messaging
export {
  buildSubject,
  buildPattern,
  parseSubject,
  validateMessage,
  createMessage,
} from "./nats.js";

export type { NatsMessage } from "./nats.js";
