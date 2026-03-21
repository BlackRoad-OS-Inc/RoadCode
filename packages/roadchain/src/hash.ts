/**
 * Hashing utilities for PS-SHA∞
 *
 * Uses Node.js built-in crypto for SHA-256.
 */

import { createHash } from "node:crypto";
import type { ChainEntry } from "./types.js";

/**
 * Compute the SHA-256 hash of a chain entry's canonical payload.
 *
 * Hash covers: prev, trinary, payload, timestamp
 * (same fields that would be signed)
 */
export function computeHash(entry: Omit<ChainEntry, "hash" | "coherence" | "sequence">): string {
  const canonical = JSON.stringify({
    prev: entry.prev,
    trinary: entry.trinary,
    payload: entry.payload,
    timestamp: entry.timestamp,
  });

  return "sha256:" + createHash("sha256").update(canonical).digest("hex");
}

/**
 * Verify that an entry's hash matches its payload.
 */
export function verifyHash(entry: ChainEntry): boolean {
  const expected = computeHash(entry);
  return entry.hash === expected;
}
