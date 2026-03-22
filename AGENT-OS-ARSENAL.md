# Browser-Native Agent OS — Open-Source Arsenal

> 40+ repos across 4 layers for orchestrating 30K agents in the browser.
> Source: Internal research document. All forked into BlackRoad-OS-Inc.

## Layer 1: Agent Orchestration & AI Infrastructure

| Road Product | Forks From | Stars | What It Does |
|-------------|-----------|-------|-------------|
| **RoadGate** | tensorzero | 10.5K | Rust LLM gateway — sub-1ms P99 at 10K+ QPS |
| **RoadAgent** | mastra-ai | 20.6K | TypeScript agent framework — suspend/resume, RAG, MCP |
| **RoadMem** | mem0ai | 41K | Agent memory — 26% better accuracy than OpenAI |
| **RoadRig** | 0xPlaygrounds | 4K | Rust agents → compiles to WASM |
| **RoadMesh-Agent** | SolaceLabs | 1K | Event-driven multi-agent — A2A protocol |
| **RoadVolt** | VoltAgent | 6.9K | TypeScript — resumable streaming, OpenTelemetry |
| **RoadLetta** | letta-ai | 13K | LLM as OS — .af agent file format (MemGPT) |
| **RoadConductor** | conductor-oss | 18K | Netflix workflow engine — durable agent workflows |

## Layer 2: Browser-Native Runtimes & WASM

| Road Product | Forks From | Stars | What It Does |
|-------------|-----------|-------|-------------|
| **RoadQuick** | rquickjs | 1.4K | 210KB JS engine — 30K agents in 6.3GB RAM |
| **RoadPlugin** | extism | 4.9K | Universal WASM plugin system — 15+ language SDKs |
| **RoadSQL** | sql-js | 13K | SQLite in WASM — per-agent database in browser |
| **RoadClay** | nicbarker/clay | — | Microsecond UI layout — C to WASM |
| **RoadRings** | RingsNetwork | 300 | P2P WebRTC+Chord DHT — O(log N) for 30K agents |

## Layer 3: OS & Kernel Patterns

| Road Product | Forks From | Stars | What It Does |
|-------------|-----------|-------|-------------|
| **RoadLunatic** | lunatic | 4.8K | Erlang-inspired WASM runtime — the closest to what we need |
| **RoadActor** | ractor | 1.6K | Rust actor framework — Meta production, 4-priority channels |

## Layer 4: Dev Tooling & Build Systems

| Road Product | Forks From | Stars | What It Does |
|-------------|-----------|-------|-------------|
| **RoadShell** | nushell | 38.8K | Structured data shell — tables, JSON, typed pipelines |
| **RoadMoon** | moonrepo | 3.7K | Polyglot monorepo orchestrator — WASM extensible |
| **RoadMise** | mise | 12K | One tool for all versions — replaces nvm/pyenv/asdf |
| **RoadTUI** | ratatui | 19.1K | Rust terminal UI — sub-millisecond fleet dashboards |
| **RoadJust** | just | 30K | Command runner — `just deploy --node=pi-12` |
| **RoadLint** | biome | 16K | 35x faster than Prettier, compiles to WASM |

## Key Architecture Insight

**The 30K agent math**: V8 isolates cost ~10MB each = 300GB for 30K agents (impossible). QuickJS at 210KB each = **6.3GB** (achievable). Sub-300μs instantiation. Each agent gets its own JavaScript interpreter with its own heap — no shared-state concurrency bugs. This is why RoadQuick is the foundation.

**The workerd pattern**: Cloudflare's open-source Workers runtime uses V8 isolates as "nanoservices" — multiple isolated Workers in the same process with zero context-switch overhead. Already forked as `blackroad-workerd-edge`. Combine with RoadQuick for the browser equivalent.

---
*BlackRoad OS, Inc. — PROPRIETARY. 21 new Road products from this research.*
