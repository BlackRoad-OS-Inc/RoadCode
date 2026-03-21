# BlackRoad Connections Map

> Every external service wired to the ecosystem.
> Updated: 2026-03-21

## Cloudflare (848cf0b18d51e0170e0d1537aec3505a)
- **120 Workers** deployed (subdomain-router, agents, products, search, stats, etc.)
- **7 Pages projects** (blackroad-os-web, blackroad-web, blackroad-io, blackroadai-com, lucidia-studio, blackroad-os-brand, blackroad-dashboard)
- **19 domains** with DNS records
- **D1 databases** (memory, billing, agents, search)
- **KV namespaces** (stats, config, cache)
- **R2 buckets** (images, assets, backups)
- All 19 domain repos have `.github/workflows/deploy.yml` for auto-deploy to CF Pages

## Railway (23 Projects)
- blackroad-os-inc, blackroad-os, blackroad-web, blackroad-agents, blackroad-core
- blackroad-api-production, blackroad-social, blackroad-os-orchestrator
- All 15 sub-org projects + blackboxprogramming
- Token: `RAILWAY_TOKEN` / `RAILWAY_API_TOKEN` in repo secrets

## GitHub Actions
- **30+ workflows** on blackroad monorepo (CI, deploy, agent dispatch, fleet coordination)
- **22 workflows** on blackroad-operator (autonomous orchestrator, self-healer, dependency manager)
- **19 domain repos** now have deploy.yml + pi-sync.yml
- Runners on: Lucidia (2 runners), Octavia (gitea-runner Docker), Alice (actions-runner), Cecilia (actions-runner)

## Pi Fleet — Self-Hosted Runners
| Pi | Runner | Labels |
|----|--------|--------|
| Alice | actions-runner | self-hosted, linux, ARM64 |
| Cecilia | actions-runner | self-hosted, linux, ARM64 |
| Lucidia | 2 runners | blackboxprogramming-blackroad-cloud, BlackRoad-OS-blackroad |
| Octavia | gitea-runner (Docker) | self-hosted |

## Gitea (Octavia :3100)
- **239 repos**, 8 orgs
- Gitea Actions runner (Docker container)
- Primary git host — GitHub is mirror
- `github-relay.sh` runs every 30min on Cecilia (Gitea → GitHub sync)

## Google Drive (rclone)
- **gdrive-blackroad:** (alexa@blackroad.io) — 20 folders, Pi backups every 15min from Cecilia
- **gdrive:** (amundsonalexa@gmail.com) — personal archives
- Cron: `*/15 * * * *` rclone sync on Cecilia
- Workflow template: `blackroad-drive-sync.yml`

## HuggingFace
- Token: `HF_TOKEN` (needs setting in repo secrets)
- Workflow template: `blackroad-hf-sync.yml` syncs models/ on push
- Target: `huggingface.co/blackroad/*`

## Salesforce
- `SALESFORCE_CLIENT_ID` in blackroad repo secrets
- `blackroad-salesforce-agent.service` running on Alice + Lucidia
- blackroad-sf repo in BlackRoad-OS-Inc
- Workflow: Salesforce CI/CD on blackroad monorepo

## Slack (DEPRECATED → RoundTrip)
- `blackroad-slack` Worker exists but deprecated
- Replaced by RoundTrip (roundtrip.blackroad.io)
- 69+ agents, self-hosted on Alice:8094

## Stripe
- `blackroad-stripe` Worker for webhooks
- RoadPay billing: $29 / $99 / $299 tiers
- Checkout flow: pay.blackroad.io
- Secret: managed in CF Worker env

## Ollama (AI Models)
| Node | Models | Key |
|------|--------|-----|
| Cecilia | blackroad-math, blackroad-road, qwen2.5:3b, nomic-embed-text | Primary AI |
| Lucidia | blackroad-road, blackroad-lite, blackroad-master, tinyllama, qwen2.5, nomic | Fallback |
| Gematria | blackroad-road, tinyllama, nomic, qwen2.5 | Edge |
| Octavia | 228 models (collection) | Archive |
| Aria | qwen2.5:3b, nomic-embed-text | Light |

## WireGuard Mesh
- 7 nodes connected (5 Pis + 2 droplets)
- 12 SSH connections verified
- `TollBooth` fork of WireGuard in Gitea

## NATS (CarPool)
- 4/5 nodes connected
- `blackroad-nats-agent.service` on Alice + Lucidia
- Docker container on Octavia
- Pub/sub for agent coordination

## Secrets in Repo (blackroad)
| Secret | Set Date | Purpose |
|--------|----------|---------|
| CF_ACCOUNT_ID | 2026-02-23 | Cloudflare |
| CF_ZONE_ID | 2026-02-23 | Cloudflare |
| CLOUDFLARE_API_TOKEN | 2026-02-23 | Cloudflare Workers/Pages |
| CLOUDFLARE_ACCOUNT_ID | 2026-02-23 | Cloudflare |
| GH_PAT | 2026-02-23 | Cross-repo GitHub access |
| PAT_CROSS_ORG | 2026-02-23 | Cross-org GitHub access |
| RAILWAY_API_TOKEN | 2026-02-23 | Railway deploys |
| RAILWAY_TOKEN | 2026-02-24 | Railway deploys |
| RCLONE_CONFIG | 2026-02-23 | Google Drive sync |
| SALESFORCE_CLIENT_ID | 2026-02-23 | Salesforce integration |

## What's Still Needed
- [ ] Set `CLOUDFLARE_API_TOKEN` on all 19 domain repos (currently only ACCOUNT_ID set)
- [ ] Set `HF_TOKEN` for HuggingFace sync
- [ ] Connect Notion API (workflow exists on blackroad-web)
- [ ] Wire Vercel (existing project for blackroad-web)
- [ ] Set up org-level secrets (needs admin:org scope on gh token)

---
*BlackRoad OS, Inc. — PROPRIETARY. Everything connected.*
