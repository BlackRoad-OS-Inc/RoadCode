/**
 * RoadChain Types — PS-SHA∞ append-only ledger
 */

import type { Trinary } from "@roadcode/greenlight";

/** A single entry in a PS-SHA∞ chain */
export interface ChainEntry {
  /** Unique entry identifier (ULID) */
  id: string;

  /** Chain this entry belongs to */
  chainId: string;

  /** SHA-256 hash of the canonical payload */
  hash: string;

  /** Hash(es) of previous entry/entries */
  prev: string[];

  /** Trinary truth value */
  trinary: Trinary;

  /** Monotonic sequence number within the chain */
  sequence: number;

  /** Entry payload */
  payload: ChainPayload;

  /** ISO 8601 timestamp */
  timestamp: string;

  /** Coherence score at this point in the chain */
  coherence: number;
}

/** Payload for a chain entry */
export interface ChainPayload {
  /** Event type */
  type: string;

  /** Schema version */
  version: "1.0";

  /** Arbitrary structured data */
  data: unknown;

  /** Who created this entry */
  actor: string;

  /** Actor classification */
  actorType: "human" | "agent" | "system";

  /** Optional GreenLight emoji annotation */
  greenlight?: string;
}

/** Chain metadata */
export interface ChainMeta {
  /** Chain identifier */
  id: string;

  /** Number of entries */
  length: number;

  /** Current coherence score */
  coherence: number;

  /** Hash of the latest entry (head) */
  head: string;

  /** Number of active branches */
  branches: number;

  /** Creation timestamp */
  createdAt: string;

  /** Last entry timestamp */
  updatedAt: string;
}

/** Result of chain verification */
export interface VerifyResult {
  valid: boolean;
  errors: string[];
  entriesChecked: number;
  coherence: number;
}
