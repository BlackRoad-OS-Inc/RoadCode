/**
 * NATS Message Schema — Validates and builds GreenLight NATS messages
 *
 * Subject pattern: greenlight.{state}.{scale}.{domain}.{id}
 *
 * Messages carry the full entity state plus transition metadata.
 */

import type { GreenLightEntity, LifecycleCode, ScaleCode, DomainCode } from "./types.js";
import { LIFECYCLE_STATES, SCALE_INDICATORS, DOMAIN_TAGS } from "./types.js";

/** A GreenLight NATS message payload */
export interface NatsMessage {
  id: string;
  entity: GreenLightEntity;
  timestamp: string;
  transition?: {
    from: LifecycleCode;
    to: LifecycleCode;
  };
  actor?: string;
  actorType?: "human" | "agent" | "system";
}

/** Build a NATS subject from entity fields */
export function buildSubject(
  state: LifecycleCode,
  scale: ScaleCode,
  domain: DomainCode,
  id: string,
): string {
  return `greenlight.${state}.${scale}.${domain}.${id}`;
}

/** Build a NATS wildcard subscription pattern */
export function buildPattern(opts: {
  state?: LifecycleCode;
  scale?: ScaleCode;
  domain?: DomainCode;
  id?: string;
}): string {
  const state = opts.state ?? "*";
  const scale = opts.scale ?? "*";
  const domain = opts.domain ?? "*";
  const id = opts.id ?? "*";
  return `greenlight.${state}.${scale}.${domain}.${id}`;
}

const validLifecycles = new Set(Object.values(LIFECYCLE_STATES));
const validScales = new Set(Object.values(SCALE_INDICATORS));
const validDomains = new Set(Object.values(DOMAIN_TAGS));

/** Parse and validate a NATS subject string */
export function parseSubject(subject: string): {
  state: LifecycleCode;
  scale: ScaleCode;
  domain: DomainCode;
  id: string;
} | null {
  const parts = subject.split(".");
  if (parts.length !== 5 || parts[0] !== "greenlight") return null;

  const [, state, scale, domain, id] = parts;
  if (!state || !scale || !domain || !id) return null;

  if (!validLifecycles.has(state as LifecycleCode)) return null;
  if (!validScales.has(scale as ScaleCode)) return null;
  if (!validDomains.has(domain as DomainCode)) return null;

  return {
    state: state as LifecycleCode,
    scale: scale as ScaleCode,
    domain: domain as DomainCode,
    id,
  };
}

/** Validate a NATS message payload. Returns array of errors (empty = valid). */
export function validateMessage(msg: unknown): string[] {
  const errors: string[] = [];

  if (typeof msg !== "object" || msg === null) {
    return ["message must be an object"];
  }

  const m = msg as Record<string, unknown>;

  if (typeof m.id !== "string" || m.id.length === 0) {
    errors.push("id is required and must be a non-empty string");
  }

  if (typeof m.entity !== "object" || m.entity === null) {
    errors.push("entity is required");
  } else {
    const entity = m.entity as Record<string, unknown>;
    if (!entity.lifecycle || !validLifecycles.has(entity.lifecycle as LifecycleCode)) {
      errors.push("entity.lifecycle must be a valid lifecycle code");
    }
    if (entity.scale && !validScales.has(entity.scale as ScaleCode)) {
      errors.push("entity.scale must be a valid scale code");
    }
    if (entity.domain && !validDomains.has(entity.domain as DomainCode)) {
      errors.push("entity.domain must be a valid domain code");
    }
  }

  if (typeof m.timestamp !== "string") {
    errors.push("timestamp is required and must be a string");
  }

  if (m.transition !== undefined) {
    if (typeof m.transition !== "object" || m.transition === null) {
      errors.push("transition must be an object with from/to fields");
    } else {
      const t = m.transition as Record<string, unknown>;
      if (!validLifecycles.has(t.from as LifecycleCode)) {
        errors.push("transition.from must be a valid lifecycle code");
      }
      if (!validLifecycles.has(t.to as LifecycleCode)) {
        errors.push("transition.to must be a valid lifecycle code");
      }
    }
  }

  return errors;
}

/** Create a well-formed NATS message */
export function createMessage(
  id: string,
  entity: GreenLightEntity,
  transition?: { from: LifecycleCode; to: LifecycleCode },
  actor?: string,
  actorType?: "human" | "agent" | "system",
): NatsMessage {
  return {
    id,
    entity,
    timestamp: new Date().toISOString(),
    ...(transition && { transition }),
    ...(actor && { actor }),
    ...(actorType && { actorType }),
  };
}
