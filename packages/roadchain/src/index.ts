export { Chain } from "./chain.js";
export { computeHash, verifyHash } from "./hash.js";
export { stepCoherence, computeChainCoherence, detectContradictions } from "./coherence.js";

export type {
  ChainEntry,
  ChainPayload,
  ChainMeta,
  VerifyResult,
} from "./types.js";
