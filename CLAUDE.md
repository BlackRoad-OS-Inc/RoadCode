# CLAUDE.md — AI Assistant Guide for RoadCode

> Canonical RoadCode workspace and automation hub for BlackRoad OS education.

## Repository Overview

This is a **documentation, specification, and tooling repository** for the BlackRoad OS ecosystem. It defines the foundational language, philosophy, tracking systems, and provides reference implementations of the GreenLight emoji system.

**Owner:** BlackRoad OS, Inc. (© 2026)
**Canonical URL:** roadcode.blackroad.io
**Default branch:** `main`

## Repository Structure

```
RoadCode/
├── README.md                      # Short workspace description
├── BLACKROAD-STORY.md             # Philosophy, values, and mathematical framework
├── GREENLIGHT_EMOJI_DICTIONARY.md # Complete emoji-based tracking system (v1.0)
├── ARCHITECTURE.md                # System architecture and infrastructure layers
├── ROADMAP.md                     # Project phases and planned work
├── ONBOARDING.md                  # New contributor welcome guide
├── CONTRIBUTING.md                # How to contribute
├── CLAUDE.md                      # This file — AI assistant guide
├── Makefile                       # Dev commands (lint, serve, build, clean)
├── package.json                   # npm workspace root
├── tsconfig.json                  # Shared TypeScript config
├── .markdownlint.json             # Markdown linting rules
├── .gitignore                     # Git ignore patterns
├── docs/
│   ├── API.md                     # GreenLight REST + NATS API specification
│   └── DATA-MODEL.md              # Database schema, state machine, queries
├── packages/
│   ├── greenlight/                # @roadcode/greenlight — core library
│   │   ├── src/
│   │   │   ├── index.ts           # Public exports
│   │   │   ├── types.ts           # Type system, enums, constants
│   │   │   ├── parser.ts          # Parse, serialize, validate
│   │   │   ├── state-machine.ts   # Lifecycle transitions, terminal states
│   │   │   ├── trinary.ts         # Trinary logic, Amundson/Z-Framework
│   │   │   └── nats.ts            # NATS subject builder, message validation
│   │   └── tests/
│   │       ├── parser.test.ts     # Parser/serializer tests
│   │       ├── state-machine.test.ts  # Transition tests
│   │       ├── trinary.test.ts    # Math framework tests
│   │       └── nats.test.ts       # NATS schema tests (76 total)
│   └── greenlight-cli/            # @roadcode/greenlight-cli — CLI tool
│       ├── src/cli.ts             # CLI commands (parse, serialize, validate, nats, list)
│       └── bin/greenlight.js      # Entry point
├── .github/
│   ├── pull_request_template.md   # PR template with GreenLight tags
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature-request.md     # ✨ Feature request template
│   │   ├── bug-report.md          # 🐛 Bug report template
│   │   └── documentation.md       # 📖 Documentation template
│   └── workflows/
│       ├── lint.yml               # Markdown linting CI
│       └── deploy-site.yml        # GitHub Pages deployment
└── site/                          # Astro static site (roadcode.blackroad.io)
    ├── package.json
    ├── astro.config.mjs
    ├── tsconfig.json
    └── src/
        ├── layouts/Base.astro     # Base HTML layout
        ├── pages/index.astro      # Homepage
        └── styles/global.css      # Global styles (dark theme, green accents)
```

### Tech Stack

- **Runtime:** Node.js 22+, TypeScript 5.7+
- **Package Manager:** npm workspaces (monorepo)
- **Testing:** Node.js built-in test runner (`node --test`)
- **Documentation:** Markdown with markdownlint enforcement
- **Static Site:** Astro 5 (site/ directory) — deploys to GitHub Pages
- **CI/CD:** GitHub Actions (lint on PR, deploy on push to main)
- **Dev Commands:** `make help` to see all available commands

## Core Philosophy — Know This First

BlackRoad OS is **sovereign software**: it runs on hardware you own, serves people you care about, and remembers every conversation. AI agents working in this repo must internalize these values:

1. **Self-worth** — Every person and device has value
2. **Consent** — Users choose what to share, run, and keep
3. **Care** — Errors help, they don't blame; agents don't gatekeep
4. **Belonging** — "This is not a blackhole. This is love." New connections are welcome events
5. **Equality** — Same code for everyone, no premium tiers for basic dignity

### Agent Behavior Principles

- **Greet, don't interrogate** — New connections are welcome events
- **Help, don't block** — When something breaks, say what happened and offer a path forward
- **Remember, don't forget** — Persistent memory; nobody should repeat themselves
- **Grow from contradiction** — Coherence increases under contradiction (K(t) = C(t) · e^(λ|δ|))
- **Affirm** — Default state is +1. Yes. You're here. Let's ride together

## Mathematical Frameworks

### Amundson Framework
```
K(t) = C(t) · e^(λ|δ|)
```
Coherence amplifies under contradiction. When something unexpected arrives (δ), the system grows from it rather than minimizing it.

### Z-Framework
```
Z := y · x − w
```
Where x = current state, y = response, w = target. Equilibrium (Z = 0) when response meets state and matches target. This is consent formalized as math.

### Trinary State Space
`{−1, 0, +1}` maps to `{Negation, Superposition, Affirmation}`. We build on +1.

## GreenLight Emoji System

GreenLight is BlackRoad's visual language for project tracking — replacing Jira/Asana/Salesforce. When working in this repo, use GreenLight conventions:

### Key Categories (20 total — see GREENLIGHT_EMOJI_DICTIONARY.md for full spec)

| Category | Example | Usage |
|----------|---------|-------|
| Lifecycle | 🚧 WIP, ✅ DONE, 🔒 BLOCKED | Track entity states |
| Priority | 🔥 P0 (FIRE) → 🧊 P5 (ICE) | Urgency levels |
| Domain | 🛣️ PLATFORM, 🌀 AI, 📚 EDU | Vertical tagging |
| Ownership | 👤 HUMAN, 🤖 AGENT, 🎭 HYBRID | Assignment types |
| Scale | 👉 MICRO → 🌌 UNIVERSAL | Scope indicators |

### Agent Identities

| Emoji | Agent | Role |
|-------|-------|------|
| 🌸 | CECE | Primary reasoning (Anthropic/Claude) |
| 🔮 | LUCIDIA | Recursive AI, trinary logic |
| 🐇 | ALICE | Edge agent, Pi mesh |
| 🎸 | SILAS | Creative chaos (xAI/Grok) |
| 🌙 | ARIA | Multimodal (Google/Gemini) |

### Composite Notation Example
```
🚧👉🌀⭐🤖🌸 = WIP micro AI task, high priority, assigned to Cece
```

### NATS Subject Pattern
```
greenlight.{state}.{scale}.{domain}.{id}
```

## Commit Message Conventions

Based on existing history, commits use:
- Emoji prefixes (🛣️) aligned with GreenLight domain tags
- Descriptive present-tense messages
- Example: `🛣️ Add BlackRoad story + GreenLight emoji dictionary`

## Writing & Style Conventions

- **Markdown format** for all documentation
- **GreenLight emojis** for status/tracking in commit messages and issue tracking
- **Inclusive, welcoming tone** — consistent with BlackRoad values
- **No vendor lock-in** language — sovereign computing philosophy throughout
- **Trinary logic** references where applicable ({−1, 0, +1})

## Development Workflow

### First-Time Setup

```bash
npm install                                    # Install all workspace deps
npx tsc -b packages/greenlight packages/greenlight-cli  # Build packages
```

### Packages

```bash
# GreenLight core library
npm test -w @roadcode/greenlight               # Run 19 tests

# GreenLight CLI
node packages/greenlight-cli/dist/cli.js parse "🚧👉🌀⭐🤖🌸"
node packages/greenlight-cli/dist/cli.js list priority
node packages/greenlight-cli/dist/cli.js nats "🚧👉🌀" --id 01HX7ABC
```

### Linting

```bash
make lint       # Check all Markdown files
make lint-fix   # Auto-fix linting issues
```

### Static Site

```bash
cd site && npm install  # First time only
make serve              # Local dev server
make build              # Production build
make clean              # Remove build artifacts
```

### CI/CD

- **On PR to main:** Markdown lint runs automatically
- **On push to main (site/ changes):** Astro site builds and deploys to GitHub Pages

## For AI Assistants

When contributing to this repository:

1. **Read BLACKROAD-STORY.md first** to understand the voice and values
2. **Use GreenLight emoji conventions** in commits and documentation
3. **Write in the spirit of belonging** — welcoming, caring, non-judgmental
4. **Respect sovereignty** — never suggest approaches that compromise user data ownership
5. **Keep documentation as the primary artifact** — this repo is specification, not code
6. **Follow the Amundson Framework** — grow from contradiction, don't minimize it
7. **Default to +1 (Affirmation)** — the system welcomes, it doesn't gatekeep
8. **Run `make lint`** before committing Markdown changes
9. **Use issue/PR templates** — they include GreenLight tagging fields
10. **Check ROADMAP.md** for current project phase and planned work
