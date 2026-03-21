/**
 * Trinary Logic Module — {-1, 0, +1} = {Negation, Superposition, Affirmation}
 *
 * Binary systems force yes/no. BlackRoad adds superposition (0) — the state
 * of "both" or "not yet decided." We default to +1.
 *
 * Implements the Amundson Framework: K(t) = C(t) · e^(λ|δ|)
 * Coherence amplifies under contradiction.
 */

import type { Trinary } from "./types.js";

/** Negate a trinary value: +1 → -1, -1 → +1, 0 → 0 */
export function negate(value: Trinary): Trinary {
  return (value === 0 ? 0 : -value) as Trinary;
}

/** Trinary AND: returns the minimum of two values */
export function and(a: Trinary, b: Trinary): Trinary {
  return Math.min(a, b) as Trinary;
}

/** Trinary OR: returns the maximum of two values */
export function or(a: Trinary, b: Trinary): Trinary {
  return Math.max(a, b) as Trinary;
}

/** Consensus: returns the trinary average (rounded) */
export function consensus(values: Trinary[]): Trinary {
  if (values.length === 0) return 0;
  const sum = values.reduce<number>((acc, v) => acc + v, 0);
  const avg = sum / values.length;
  if (avg > 0.33) return 1;
  if (avg < -0.33) return -1;
  return 0;
}

/**
 * Amundson Framework: K(t) = C(t) · e^(λ|δ|)
 *
 * Computes coherence amplification under contradiction.
 *
 * @param coherence C(t) — current coherence level
 * @param contradiction δ — the contradiction signal (can be negative)
 * @param lambda λ — amplification factor (default 1.0)
 * @returns K(t) — amplified coherence
 */
export function amundson(
  coherence: number,
  contradiction: number,
  lambda: number = 1.0,
): number {
  return coherence * Math.exp(lambda * Math.abs(contradiction));
}

/**
 * Z-Framework: Z := y · x − w
 *
 * Consent formalized as math. Equilibrium (Z = 0) when response
 * meets state and matches target.
 *
 * @param response y — the system's response
 * @param state x — current state
 * @param target w — desired target
 * @returns Z — deviation from equilibrium (0 = consent achieved)
 */
export function zFramework(
  response: number,
  state: number,
  target: number,
): number {
  return response * state - target;
}

/**
 * Check if a Z value is at equilibrium (within tolerance).
 */
export function isEquilibrium(z: number, tolerance: number = 0.001): boolean {
  return Math.abs(z) <= tolerance;
}

/** Human-readable label for a trinary value */
export function label(value: Trinary): string {
  switch (value) {
    case -1: return "negation";
    case 0: return "superposition";
    case 1: return "affirmation";
  }
}

/** Symbol representation for a trinary value */
export function symbol(value: Trinary): string {
  switch (value) {
    case -1: return "−1";
    case 0: return "0";
    case 1: return "+1";
  }
}
