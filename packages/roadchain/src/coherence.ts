/**
 * Coherence computation — Amundson Framework applied to hash chains
 *
 * K(t) = C(t) · e^(λ|δ|)
 *
 * Coherence amplifies under contradiction. When a chain branches or
 * entries have opposing trinary values, coherence increases.
 */

import type { Trinary } from "@roadcode/greenlight";
import type { ChainEntry } from "./types.js";

/** Default amplification factor */
const DEFAULT_LAMBDA = 0.1;

/** Default decay factor per entry (prevents unbounded growth) */
const DEFAULT_DECAY = 0.999;

/**
 * Compute coherence for a single step.
 *
 * @param currentCoherence — C(t), the current coherence
 * @param prevTrinar — previous entry's trinary value
 * @param currTrinar — current entry's trinary value
 * @param lambda — amplification factor
 * @param decay — decay factor per step
 */
export function stepCoherence(
  currentCoherence: number,
  prevTrinar: Trinary,
  currTrinar: Trinary,
  lambda: number = DEFAULT_LAMBDA,
  decay: number = DEFAULT_DECAY,
): number {
  const delta = Math.abs(currTrinar - prevTrinar);
  const amplified = currentCoherence * Math.exp(lambda * delta);
  return amplified * decay;
}

/**
 * Compute coherence for an entire chain from scratch.
 */
export function computeChainCoherence(
  entries: Pick<ChainEntry, "trinary">[],
  lambda: number = DEFAULT_LAMBDA,
  decay: number = DEFAULT_DECAY,
): number {
  if (entries.length === 0) return 1.0;

  let coherence = 1.0;

  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]!;
    const curr = entries[i]!;
    coherence = stepCoherence(coherence, prev.trinary, curr.trinary, lambda, decay);
  }

  return coherence;
}

/**
 * Detect contradictions in a chain.
 * A contradiction exists when consecutive entries have opposing trinary values
 * or when two entries share the same prev (branch).
 */
export function detectContradictions(
  entries: Pick<ChainEntry, "id" | "trinary" | "prev">[],
): Array<{ entryA: string; entryB: string; type: "opposing" | "branch" }> {
  const contradictions: Array<{ entryA: string; entryB: string; type: "opposing" | "branch" }> = [];

  // Check for branches (multiple entries sharing same prev)
  const prevMap = new Map<string, string[]>();
  for (const entry of entries) {
    for (const p of entry.prev) {
      const existing = prevMap.get(p) ?? [];
      existing.push(entry.id);
      prevMap.set(p, existing);
    }
  }

  for (const [, ids] of prevMap) {
    if (ids.length > 1) {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          contradictions.push({
            entryA: ids[i]!,
            entryB: ids[j]!,
            type: "branch",
          });
        }
      }
    }
  }

  return contradictions;
}
