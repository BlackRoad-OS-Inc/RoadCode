/**
 * Chain — In-memory PS-SHA∞ chain implementation
 *
 * Append-only ledger with trinary truth values, branching support,
 * and coherence tracking.
 */

import type { Trinary } from "@roadcode/greenlight";
import type { ChainEntry, ChainPayload, ChainMeta, VerifyResult } from "./types.js";
import { computeHash, verifyHash } from "./hash.js";
import { stepCoherence, computeChainCoherence, detectContradictions } from "./coherence.js";

let counter = 0;
function generateId(): string {
  return `entry-${Date.now()}-${++counter}`;
}

/**
 * An in-memory PS-SHA∞ chain.
 *
 * @example
 * const chain = Chain.create("gl-main");
 * chain.append({ type: "gl.create", version: "1.0", data: {}, actor: "cece", actorType: "agent" });
 */
export class Chain {
  readonly id: string;
  private entries: ChainEntry[] = [];
  private hashIndex = new Map<string, ChainEntry>();

  private constructor(id: string) {
    this.id = id;
  }

  /** Create a new empty chain */
  static create(chainId: string): Chain {
    return new Chain(chainId);
  }

  /** Get the current head hash (or empty string for empty chain) */
  get head(): string {
    return this.entries.length > 0 ? this.entries[this.entries.length - 1]!.hash : "";
  }

  /** Get the number of entries */
  get length(): number {
    return this.entries.length;
  }

  /** Get the current coherence score */
  get coherence(): number {
    if (this.entries.length === 0) return 1.0;
    return this.entries[this.entries.length - 1]!.coherence;
  }

  /** Get all entries (read-only) */
  getEntries(): readonly ChainEntry[] {
    return this.entries;
  }

  /** Get an entry by hash */
  getByHash(hash: string): ChainEntry | undefined {
    return this.hashIndex.get(hash);
  }

  /** Get chain metadata */
  getMeta(): ChainMeta {
    const branches = detectContradictions(this.entries).filter((c) => c.type === "branch").length;
    return {
      id: this.id,
      length: this.entries.length,
      coherence: this.coherence,
      head: this.head,
      branches,
      createdAt: this.entries.length > 0 ? this.entries[0]!.timestamp : "",
      updatedAt: this.entries.length > 0 ? this.entries[this.entries.length - 1]!.timestamp : "",
    };
  }

  /**
   * Append a new entry to the chain.
   *
   * @param payload — the entry payload
   * @param trinary — truth value (default +1, affirmation)
   * @param prev — custom prev hashes (default: current head)
   * @returns the created entry
   */
  append(
    payload: ChainPayload,
    trinary: Trinary = 1,
    prev?: string[],
  ): ChainEntry {
    const prevHashes = prev ?? (this.head ? [this.head] : []);
    const sequence = this.entries.length;
    const timestamp = new Date().toISOString();

    const id = generateId();

    // Compute hash
    const hash = computeHash({
      id,
      chainId: this.id,
      prev: prevHashes,
      trinary,
      payload,
      timestamp,
    });

    // Compute coherence
    let coherence: number;
    if (this.entries.length === 0) {
      coherence = 1.0;
    } else {
      const lastEntry = this.entries[this.entries.length - 1]!;
      coherence = stepCoherence(lastEntry.coherence, lastEntry.trinary, trinary);
    }

    const entry: ChainEntry = {
      id,
      chainId: this.id,
      hash,
      prev: prevHashes,
      trinary,
      sequence,
      payload,
      timestamp,
      coherence,
    };

    this.entries.push(entry);
    this.hashIndex.set(hash, entry);

    return entry;
  }

  /**
   * Create a branch — append an entry with the same prev as another entry.
   * This represents a contradiction in the chain.
   */
  branch(
    fromHash: string,
    payload: ChainPayload,
    trinary: Trinary = -1,
  ): ChainEntry {
    const fromEntry = this.hashIndex.get(fromHash);
    if (!fromEntry) {
      throw new Error(`Entry not found: ${fromHash}`);
    }

    return this.append(payload, trinary, fromEntry.prev);
  }

  /**
   * Merge two branch heads into a single entry.
   */
  merge(
    hashes: string[],
    payload: ChainPayload,
    trinary: Trinary = 1,
  ): ChainEntry {
    for (const h of hashes) {
      if (!this.hashIndex.has(h)) {
        throw new Error(`Entry not found: ${h}`);
      }
    }

    return this.append(payload, trinary, hashes);
  }

  /**
   * Verify the entire chain's integrity.
   */
  verify(): VerifyResult {
    const errors: string[] = [];

    if (this.entries.length === 0) {
      return { valid: true, errors: [], entriesChecked: 0, coherence: 1.0 };
    }

    // Genesis entry checks
    const genesis = this.entries[0]!;
    if (genesis.prev.length !== 0) {
      errors.push(`Genesis entry should have empty prev, got ${genesis.prev.length} references`);
    }
    if (genesis.sequence !== 0) {
      errors.push(`Genesis entry should have sequence 0, got ${genesis.sequence}`);
    }

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i]!;

      // Verify hash
      if (!verifyHash(entry)) {
        errors.push(`Entry ${entry.id} (seq ${entry.sequence}): hash mismatch`);
      }

      // Verify prev references exist (except genesis)
      if (i > 0) {
        for (const p of entry.prev) {
          if (!this.hashIndex.has(p)) {
            errors.push(`Entry ${entry.id} (seq ${entry.sequence}): prev reference ${p} not found`);
          }
        }
      }

      // Verify sequence is monotonic
      if (entry.sequence !== i) {
        errors.push(`Entry ${entry.id}: expected sequence ${i}, got ${entry.sequence}`);
      }
    }

    // Recompute coherence and compare
    const recomputed = computeChainCoherence(this.entries);
    const lastCoherence = this.entries[this.entries.length - 1]!.coherence;
    if (Math.abs(recomputed - lastCoherence) > 0.001) {
      errors.push(`Coherence mismatch: stored ${lastCoherence}, computed ${recomputed}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      entriesChecked: this.entries.length,
      coherence: lastCoherence,
    };
  }
}
