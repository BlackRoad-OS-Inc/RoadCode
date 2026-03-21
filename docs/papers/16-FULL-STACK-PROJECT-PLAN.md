# Paper 16: Full-Stack Project Plan for BlackRoad AI Web Platform

**Source:** Local — `~/Desktop/BR-Context/Full-Stack Project Plan for BlackRoad AI Web Platform.txt`
**Verified:** 2026-03-21 by CECE session

---

## Two-Portal Architecture

### BlackRoad.io — Creative Suite (Public-Facing)
- **Lucidia** — AI-powered coding IDE
- **RoadBook** — Hybrid social feed
- **RoadView** — Video platform
- **Roadie** — AI tutoring portal

### BlackRoadInc.us — Enterprise Hub (Backend)
- **Genesis Road** — Real-time interactive engine (RIA)
- **RoadChain** — Blockchain + RoadCoin cryptocurrency
- **Monetization** — Payments backend
- **S&P 500** — Blockchain index integration
- **Investor Dashboard** — Administration interfaces

## Technical Stack

| Layer | Component | Technology | Ports |
|-------|-----------|-----------|-------|
| Edge | Gateway Proxy | NGINX 1.25 | 80/443 |
| Auth | Lucidia SSO | Flask + PyJWT, Redis | 7000 |
| Frontend | BlackRoad.io SPA | Next.js 13 + Tailwind | — |
| Backend | API Services | Various microservices | — |

## Design Principles
- Clarity, consistency, security
- User-centric: "beauty, love, and harm-free design"
- Unified SSO across both portals
- Microservice-oriented architecture

---

**Status**: Verified. Comprehensive A-Z project plan.
