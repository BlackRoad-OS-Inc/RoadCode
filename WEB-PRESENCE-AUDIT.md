# Web Presence Audit — Response Plan

> External audit found: "19 domains, 16 orgs, 2 that work"
> This is the fix plan. Executed 2026-03-21.

## Key Findings (Honest Assessment)
1. Only blackroad.io and blackboxprogramming.io were externally verifiable as live
2. Sub-orgs had 0 stars, 0 forks, unmodified open-source forks with copyright claims
3. 17 of 19 domains were dark/not indexed
4. Brand narrative was over-extended for a 4-month-old company

## What We've Done This Session
- [x] Built elaborate landing pages for all 19 domains (now live on Gematria + Anastasia)
- [x] All sites pulling live data from stats API (real numbers, not inflated)
- [x] Archived sub-org repos as private (only RoadCode + .github public)
- [x] Updated org profile README with real numbers
- [x] WHAT_IS_BLACKROAD_OS.md uses verified infrastructure counts
- [x] Removed false "30,000 employees" claims (truth audit was done in prior session)

## Remaining Fixes (Priority Order)
1. [ ] Fix blackroad.io SSR/SEO — Google sees "Loading" (SPA issue)
2. [ ] Close/merge all open Dependabot PRs across repos
3. [ ] Reconcile public numbers — use ONE honest count everywhere
4. [ ] Set up 301 redirects for Tier 3 domains → blackroad.io
5. [ ] Get lucidia.earth indexed by Google
6. [ ] Ensure every public repo has a meaningful README
7. [ ] Disable Dependabot on inactive repos

## Domain Tier Strategy
- **Tier 1 (Active)**: blackroad.io, blackboxprogramming.io, lucidia.earth, blackroadai.com
- **Tier 2 (Hold)**: blackroadquantum.com, roadchain.io
- **Tier 3 (Redirect)**: blackroad.company/network/systems/me → blackroad.io
- **Tier 4 (Drop at renewal)**: blackroadinc.us, blackroadqi.com, 4x quantum variants, lucidia.studio, lucidiaqi.com, roadcoin.io

---
*Audit saved. Fixes in progress.*
