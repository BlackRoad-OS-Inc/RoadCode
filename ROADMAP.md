# 🛣️ RoadCode Roadmap

> Remember the Road. Pave Tomorrow.

## Current State: 🌱 Foundation

RoadCode is the canonical specification hub for BlackRoad OS. We're building the language and frameworks that the entire ecosystem depends on.

---

## Phase 1 — 🌱 DISCOVERY (Current)

**Goal:** Establish the foundational specifications and shared language.

- ✅ BlackRoad OS philosophy and values ([BLACKROAD-STORY.md](BLACKROAD-STORY.md))
- ✅ GreenLight emoji dictionary v1.0 ([GREENLIGHT_EMOJI_DICTIONARY.md](GREENLIGHT_EMOJI_DICTIONARY.md))
- ✅ AI assistant guide ([CLAUDE.md](CLAUDE.md))
- ✅ Architecture overview ([ARCHITECTURE.md](ARCHITECTURE.md))
- ✅ Contribution guidelines ([CONTRIBUTING.md](CONTRIBUTING.md))
- ✅ Public website at roadcode.blackroad.io
- ✅ Onboarding guide for new contributors ([ONBOARDING.md](ONBOARDING.md))

## Phase 2 — 📐 PLANNING

**Goal:** Define protocols, APIs, and integration specs.

- ✅ NATS subject schema specification ([docs/API.md](docs/API.md))
- ✅ GreenLight API specification (REST + NATS) ([docs/API.md](docs/API.md))
- ✅ GreenLight data model and lifecycle state machine ([docs/DATA-MODEL.md](docs/DATA-MODEL.md))
- 📋 Agent identity and capability protocol
- 📋 PS-SHA∞ hash chain specification
- 📋 Device discovery and mTLS onboarding protocol
- 📋 RoadChain ledger format specification

## Phase 3 — 🔨 IMPLEMENTATION

**Goal:** Reference implementations and developer tooling.

- ✅ GreenLight CLI tool for project tracking ([packages/greenlight-cli](packages/greenlight-cli))
- ✅ GreenLight core library with parser, serializer, and validator ([packages/greenlight](packages/greenlight))
- ✅ NATS message schemas and validators (`@roadcode/greenlight` nats module)
- ✅ Lifecycle state machine with valid transitions (`@roadcode/greenlight` state-machine module)
- ✅ Trinary logic and mathematical frameworks (`@roadcode/greenlight` trinary module)
- 📋 Agent SDK scaffolding (multi-language)
- 📋 RoadChain client library
- 📋 Pi mesh bootstrapping scripts

## Phase 4 — 🧪 TESTING

**Goal:** Validation frameworks for the ecosystem.

- ✅ GreenLight conformance test suite (76 tests across parser, state machine, trinary, NATS)
- 🚧 Trinary logic test harness (core operations tested, framework expansion in progress)
- 📋 Agent behavior validation framework
- 📋 Network resilience testing toolkit

## Phase 5 — 🚀 DEPLOYMENT

**Goal:** Production-ready packaging and distribution.

- 📋 BlackRoad OS installer (Pi-first)
- 📋 Agent marketplace specification
- 📋 Federation protocol for multi-network coordination
- 📋 RoadCoin economic model specification

---

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Pick any 📋 item, open an issue with a GreenLight tag, and start building. Every commit paves the road.

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
