# Stripe Integration — BlackRoad OS

> Account: *(stored in secrets manager)* | Display: **BlackRoad**
> Dashboard: *(access via Stripe dashboard — do not store URLs with account IDs in source)*

## Core Plans — Payment Links (LIVE)

| Plan | Price | Payment Link |
|------|-------|-------------|
| **Rider** | $29/mo | https://buy.stripe.com/aFadR27Je7tP0m78Mk4Vy0p |
| **Paver** | $99/mo | https://buy.stripe.com/cNi8wI3sY15rgl5aUs4Vy0q |
| **Enterprise** | $299/mo | https://buy.stripe.com/cNidR25B67tP3yj9Qo4Vy0r |

## Product Payment Links

| Product | Price | Payment Link |
|---------|-------|-------------|
| **Lucidia Creator** | $29/mo | https://buy.stripe.com/28E9AM3sYcO91qb4w44Vy0s |
| **RoadWork Tutoring** | $19/mo | https://buy.stripe.com/3cI9AM8Ni8xTgl5e6E4Vy0t |
| **RoadSearch** | $5/mo | https://buy.stripe.com/dRm5kw0gM7tP8SD8Mk4Vy0u |

## All Stripe Products (18 total)

### Core Plans (NEW)
| Product | Price/mo |
|---------|---------|
| Rider Plan | $29 |
| Paver Plan | $99 |
| Enterprise Plan | $299 |

### Vertical Products (NEW)
| Product | Price/mo |
|---------|---------|
| Lucidia Creator | $29 |
| RoadWork Tutoring | $19 |
| RoadCoin Payments | TBD |
| BlackBox Dev Tools | TBD |
| RoadSearch | $5 |

### Org Products (EXISTING)
| Product | Price/mo | Price/yr |
|---------|---------|---------|
| RoadChain Blockchain | $99 | $990 |
| Archive Vault | $15 | $150 |
| Labs Sandbox | $29 | $290 |
| Ventures Toolkit | $49 | $490 |
| Foundation Research | $9 | $90 |
| Gov Compliance | — | — |
| Media RoadCast | — | — |
| Interactive RoadWorld | — | — |
| Security RoadGuard | — | — |
| Cloud RoadHost | — | — |

> **Note:** Product IDs are stored in the secrets manager. Do not commit Stripe IDs to source control.

## Integration Points
- **blackroad-stripe** CF Worker — webhook handler
- **RoadPay** (`roadpay` repo) — billing system
- **pay.blackroad.io** — checkout flow
- Secrets: `STRIPE_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` in CF Worker env

---
*BlackRoad OS, Inc. — PROPRIETARY.*
