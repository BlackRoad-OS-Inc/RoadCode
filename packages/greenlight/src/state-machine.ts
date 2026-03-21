/**
 * GreenLight Lifecycle State Machine
 *
 * Defines valid transitions between lifecycle states.
 * Terminal states: archived, canceled, dead
 * Reopen: done → wip
 */

import type { LifecycleCode, Trinary } from "./types.js";

/** Valid transitions: key = from-state, value = set of allowed to-states */
export const TRANSITIONS: Record<LifecycleCode, readonly LifecycleCode[]> = {
  void: ["inbox"],
  inbox: ["queued", "targeted", "wip", "canceled"],
  queued: ["targeted", "wip", "paused", "canceled"],
  targeted: ["wip", "paused", "canceled"],
  wip: ["active", "review", "paused", "blocked", "branched", "healing", "done", "canceled"],
  active: ["review", "paused", "blocked", "done"],
  review: ["wip", "done", "blocked"],
  paused: ["wip", "targeted", "queued", "canceled"],
  blocked: ["wip", "paused", "healing", "canceled", "dead"],
  branched: ["wip", "done", "canceled"],
  healing: ["wip", "blocked", "dead"],
  done: ["archived", "wip"],
  archived: [],
  canceled: [],
  dead: [],
};

/** Terminal states that cannot transition further */
export const TERMINAL_STATES: readonly LifecycleCode[] = ["archived", "canceled", "dead"];

/** Check if a transition from one state to another is valid */
export function canTransition(from: LifecycleCode, to: LifecycleCode): boolean {
  const allowed = TRANSITIONS[from];
  return allowed !== undefined && allowed.includes(to);
}

/**
 * Attempt a state transition. Returns the new state or throws with a helpful message.
 */
export function transition(from: LifecycleCode, to: LifecycleCode): LifecycleCode {
  if (canTransition(from, to)) {
    return to;
  }

  const allowed = TRANSITIONS[from];
  if (!allowed || allowed.length === 0) {
    throw new Error(
      `Cannot transition from '${from}' — it is a terminal state.`
    );
  }

  throw new Error(
    `Cannot transition from '${from}' to '${to}'. Valid transitions: ${allowed.join(", ")}`
  );
}

/** Trinary value for each lifecycle state */
export const LIFECYCLE_TRINARY: Record<LifecycleCode, Trinary | null> = {
  void: null,
  inbox: 0,
  queued: 0,
  targeted: 0,
  wip: 1,
  active: 1,
  review: 1,
  paused: 0,
  blocked: -1,
  branched: 0,  // paraconsistent — mapped to superposition
  healing: 0,
  done: 1,
  archived: 1,
  canceled: -1,
  dead: -1,
};

/** Get the trinary value for a lifecycle state */
export function getTrinarySentiment(state: LifecycleCode): Trinary | null {
  return LIFECYCLE_TRINARY[state] ?? null;
}

/**
 * Get all valid next states from the current state.
 * Returns empty array for terminal states.
 */
export function nextStates(from: LifecycleCode): readonly LifecycleCode[] {
  return TRANSITIONS[from] ?? [];
}

/** Check if a state is terminal (no further transitions possible) */
export function isTerminal(state: LifecycleCode): boolean {
  return TERMINAL_STATES.includes(state);
}
