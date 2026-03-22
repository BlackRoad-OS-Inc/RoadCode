# Full Website + Brand + SEO Audit — 2026-03-21

## 1. HTTP Status: ALL 19 DOMAINS ARE 200
Every domain resolves and returns content. Zero downtime.

## 2. Content Source Problem
**Critical finding**: Most domains serve OLD Cloudflare Worker content, NOT our new landing pages.

| Domain | Serving From | Our New Page? | Content |
|--------|------------|---------------|---------|
| **blackroad.io** | CF Worker (app-blackroad) | PARTIAL — mixed old/new | 13KB, new chromatic page on Gematria but CF Worker serves old SPA |
| **blackboxprogramming.io** | Caddy (Gematria) | YES — our page | 4KB |
| **blackroadai.com** | CF Worker (ai-blackroadio) | NO — old Worker content | 22KB, has chromatic colors but wrong content |
| **lucidia.earth** | CF Worker (lucidia-sites) | NO — old Worker | 7KB, old pink brand |
| **blackroad.company** | CF Worker | NO — old Worker | 22KB |
| Other 14 domains | CF Workers | NO — old Worker content | 21-28KB each |

**Root cause**: CF Workers have route bindings that take priority over Gematria/Anastasia. Our SCP deploys to Gematria update the files, but CF proxies to Workers first.

**Fix**: Either update CF Worker code to serve our new HTML, or switch DNS to point directly to Gematria/Anastasia bypassing CF Workers.

## 3. SEO Scores

| Domain | Title | Meta Desc | OG Tags | Viewport | Canonical | H1 | Robots | Sitemap | Favicon |
|--------|-------|-----------|---------|----------|-----------|-----|--------|---------|---------|
| blackroad.io | ✅ | ✅ | ❌ missing | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| blackboxprogramming.io | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ serves HTML | ❌ serves HTML | ✅ |
| blackroadai.com | ✅ | ✅ | ✅ partial | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| lucidia.earth | ✅ | ✅ | ✅ partial | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| blackroad.company | ✅ | ✅ | ✅ partial | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |

### Common SEO Issues (ALL domains):
1. **❌ No `<link rel="canonical">`** — Google may see duplicate content across 19 domains
2. **❌ No `og:url`** — Social sharing won't show correct URL
3. **❌ Most missing `og:image`** — No preview image on social shares
4. **❌ Most missing favicon** — Unprofessional in browser tabs
5. **❌ robots.txt serves HTML on most domains** — Should serve actual robots directives
6. **❌ sitemap.xml serves HTML on most domains** — Should serve XML sitemap
7. **❌ No structured data (JSON-LD)** — No rich snippets in Google results

## 4. Brand Consistency

| Brand Version | Domains | Description |
|---------------|---------|-------------|
| **NEW CHROMATIC** (Ember→Cyan) | 10 domains | Space Grotesk, Inter, JetBrains Mono, 6-stop gradient |
| **OLD PINK-ONLY** (#FF1D6C) | 3 domains | blackboxprogramming.io, lucidia.earth, lucidia.studio |
| **NO BRAND** | 1 domain | blackroad.io (our newest page — needs brand CSS from Gematria served) |

### Brand Issues:
1. **blackroad.io** — our chromatic page is on Gematria but CF Worker serves old SPA
2. **blackboxprogramming.io** — still uses old #FF1D6C pink, not chromatic
3. **lucidia.earth** — old pink brand, needs chromatic update
4. **Live data widget** — only 1 domain confirmed pulling from stats API

## 5. Priority Fix List

### Immediate (fix routing so our pages show):
1. [ ] **Update CF Worker `app-blackroad`** to serve our new chromatic blackroad.io HTML
2. [ ] **Update CF Worker `lucidia-sites`** to serve our new lucidia.earth HTML
3. [ ] OR switch DNS from CF proxy to direct Gematria/Anastasia

### SEO (add to all pages):
4. [ ] Add `<link rel="canonical" href="https://DOMAIN">` to every page
5. [ ] Add `og:url`, `og:image` to every page
6. [ ] Add favicon link to every page
7. [ ] Create proper `robots.txt` (not HTML fallback) on each CF Worker
8. [ ] Create proper `sitemap.xml` for each active domain
9. [ ] Add JSON-LD structured data (Organization schema)

### Brand (update remaining old-brand sites):
10. [ ] Update blackboxprogramming.io to chromatic brand
11. [ ] Update lucidia.earth to chromatic brand
12. [ ] Ensure live data widget works on all 19 domains
13. [ ] Add gradient bar, Space Grotesk, proper typography to all pages

---
*Audit completed 2026-03-21 by Meridian session.*
