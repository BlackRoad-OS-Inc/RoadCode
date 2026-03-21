# 🛣️ RoadCode

[![CI](https://github.com/BlackRoad-OS-Inc/RoadCode/actions/workflows/ci.yml/badge.svg)](https://github.com/BlackRoad-OS-Inc/RoadCode/actions/workflows/ci.yml)
[![Site](https://github.com/BlackRoad-OS-Inc/RoadCode/actions/workflows/deploy-site.yml/badge.svg)](https://roadcode.blackroad.io)

> Sovereign software. Your hardware. Your data. Your agents.
> Remember the Road. Pave Tomorrow.

Canonical specification hub and tooling monorepo for [BlackRoad OS](https://roadcode.blackroad.io).

## Packages

| Package | Description | Tests |
|---------|-------------|-------|
| [`@roadcode/greenlight`](packages/greenlight) | GreenLight emoji parser, state machine, trinary logic, NATS validators | 76 |
| [`@roadcode/greenlight-cli`](packages/greenlight-cli) | CLI tool — parse, serialize, validate, nats, list | 16 |
| [`@roadcode/roadchain`](packages/roadchain) | PS-SHA∞ append-only ledger — chain, branch, merge, verify | 29 |

## Specifications

| Spec | Description |
|------|-------------|
| [GreenLight API](docs/API.md) | REST + NATS API for entity management |
| [Data Model](docs/DATA-MODEL.md) | PostgreSQL schema, lifecycle state machine |
| [Agent Protocol](docs/AGENT-PROTOCOL.md) | Agent identity, capabilities, task assignment |
| [PS-SHA∞](docs/PS-SHA-INFINITY.md) | Paraconsistent hash chains with trinary truth |
| [Device Discovery](docs/DEVICE-DISCOVERY.md) | mTLS onboarding and mesh protocol |
| [RoadChain Ledger](docs/ROADCHAIN-LEDGER.md) | Append-only ledger format |

## Quick Start

```bash
npm install                          # Install all dependencies
make test                            # Build and run 121 tests
make serve                           # Start local site at localhost:4321
```

## GreenLight

No more Jira. No more Asana. GreenLight speaks BlackRoad.

```
🚧👉🌀⭐🤖🌸 = WIP micro AI task, high priority, assigned to Cece
```

```bash
$ npx greenlight parse "🚧👉🌀⭐🤖🌸"
{ "lifecycle": "wip", "scale": "micro", "domain": "ai", "priority": "p2", "owner": "agent", "agent": "cece" }
```

## Links

- [Website](https://roadcode.blackroad.io) — roadcode.blackroad.io
- [Onboarding](ONBOARDING.md) — Start here
- [Architecture](ARCHITECTURE.md) — 6-layer system design
- [Roadmap](ROADMAP.md) — Project phases
- [Contributing](CONTRIBUTING.md) — How to help
- [CLAUDE.md](CLAUDE.md) — AI assistant guide

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️

© 2026 BlackRoad OS, Inc. All rights reserved.
