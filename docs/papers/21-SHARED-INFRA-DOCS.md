# Paper 21: BlackRoad-Shared-Docs — Infrastructure Canon

**Source:** Google Drive (alexa@blackroad.io) — `BlackRoad-Shared-Docs/` folder
**Verified:** 2026-03-21 by CECE session

---

## Documents in BlackRoad-Shared-Docs

| File | Size | Content |
|------|------|---------|
| `3 Cloudflare DNS.docx` | 219KB | DNS record templates for Epics 1-3 |
| `4 BlackRoad OS Infra ReadMe.docx` | 224KB | Infrastructure setup guide |
| `5 GitHub Projects & SetUp.docx` | 224KB | GitHub organization setup |
| `Cece So far.docx` | 817KB | Operator Engine history (see Paper 20) |

## Infrastructure Setup Guide (Doc 4)

Covers the v1 service architecture for Epics 1-3:

### Domains Required
- `app.blackroad.io` — Main multi-tenant app
- `api.blackroad.io` — HTTP API gateway
- `gov.api.blackroad.io` — Governance API (Cece spine)
- `db.blackroad.systems` — Shared Postgres
- `edu.blackroad.io` — Teacher portal (Education/RoadWork)
- `homework.blackroad.io` — Student portal
- `ws.blackroad.io` — WebSocket hub (reserved)
- `mesh.blackroad.network` — Mesh entry (reserved)
- `status.blackroad.io` — Public status page

### Service Architecture
Everything fronted by Cloudflare DNS, with app/API/Gov on Railway (later migrated to sovereign Pi fleet).

### Config Files
- `dns/blackroad-epics-1-3.csv` — Cloudflare DNS records
- `railway/services-epics-1-3.md` — Service matrix
- `config/service_registry.yaml` — Hostname → layer → repo mapping
- `policies/policies.education.yaml` — Education governance for Cece

## Key Resources on Corporate Drive

| Resource | Location | Description |
|----------|----------|-------------|
| halting problem.pdf | root | 149MB — CS theory reference |
| turing-enigma-treatise.pdf | root | 50MB — Turing/Enigma analysis |
| Visual Differential Geometry.pdf | root | 26MB — Tristan Needham textbook |
| QMGreensite.pdf | root | 4.3MB — Quantum mechanics reference |
| progit.pdf | Root/ | 18.8MB — Pro Git book |
| ai-crypto-investing-unlocked.pdf | Random/ | 378KB — AI crypto manuscript |
| JOUR 4251 lectures (14 PDFs) | root | Journalism/persuasion course materials |
| A000012 - OEIS.pdf | root | OEIS sequence reference |
| Gamma_plus_two.pdf | root | Magic squares method |
| S0002-9904-1947-08895-9.pdf | root | AMS Bulletin 1947 math paper |

---

**Status**: Verified. Infrastructure canon and reference library cataloged.
