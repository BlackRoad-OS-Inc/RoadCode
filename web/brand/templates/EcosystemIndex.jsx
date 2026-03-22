import { useState } from "react";

const COLORS = ["#FF6B2B", "#FF2255", "#CC00AA", "#8844FF", "#4488FF", "#00D4FF"];
const GRADIENT = `linear-gradient(90deg, ${COLORS.join(", ")})`;

const ORGS = [
  {
    name: "BlackRoad-OS-Inc",
    url: "https://github.com/BlackRoad-OS-Inc",
    tier: "enterprise",
    desc: "Enterprise root — data layer, coordination hub. Able to ask everything to anyone.",
    repos: ["blackroad-operator", "company-docs", "legal", "brand-assets"],
  },
  {
    name: "BlackRoad-OS",
    url: "https://github.com/BlackRoad-OS",
    tier: "core",
    desc: "Core operating system. Coordinates all other organizations.",
    repos: ["blackroad-os-web", "blackroad-os-api-gateway", "blackroad-os-auth", "blackroad-os-agents", "blackroad-os-memory", "blackroad-os-prism-console", "blackroad-os-docs", "blackroad-os-demo", "blackroad-os-beacon"],
  },
  {
    name: "BlackRoad-AI",
    url: "https://github.com/BlackRoad-AI",
    tier: "product",
    desc: "AI models, agent frameworks, inference pipelines, Lucidia core.",
    repos: ["lucidia-core", "agent-mesh", "inference-gateway", "ps-sha-infinity"],
  },
  {
    name: "BlackRoad-Studio",
    url: "https://github.com/BlackRoad-Studio",
    tier: "product",
    desc: "Creator tools, Unity agent homes, rendering, design studio.",
    repos: ["blackroad-os-studio", "blackroad-unity-homes", "blackroad-os-creator", "blackroad-os-gallery"],
  },
  {
    name: "BlackRoad-Education",
    url: "https://github.com/BlackRoad-Education",
    tier: "product",
    desc: "RoadWork, tutoring, curriculum tools, homework flows.",
    repos: ["blackroad-os-pack-education", "roadwork-v0", "math-road"],
  },
  {
    name: "BlackRoad-Media",
    url: "https://github.com/BlackRoad-Media",
    tier: "product",
    desc: "RoadView, RoadTube, SoundRoad — video, audio, search pipelines.",
    repos: ["roadview", "roadtube", "soundroad", "cadence-engine"],
  },
  {
    name: "BlackRoad-Interactive",
    url: "https://github.com/BlackRoad-Interactive",
    tier: "product",
    desc: "Genesis Road, RoadWorld — game engine, virtual environments.",
    repos: ["genesis-road", "roadworld", "physics-sandbox"],
  },
  {
    name: "BlackRoad-Cloud",
    url: "https://github.com/BlackRoad-Cloud",
    tier: "infra",
    desc: "Infrastructure, K3s clusters, Cloudflare Workers, edge compute.",
    repos: ["blackroad-os-infra", "cloudflare-workers", "k3s-config", "edge-runtime"],
  },
  {
    name: "BlackRoad-Security",
    url: "https://github.com/BlackRoad-Security",
    tier: "infra",
    desc: "Auth, encryption, PS-SHA∞ identity, certificates, zero-trust.",
    repos: ["blackroad-os-auth", "identity-protocol", "cert-manager"],
  },
  {
    name: "BlackRoad-Gov",
    url: "https://github.com/BlackRoad-Gov",
    tier: "infra",
    desc: "Cece governance engine — policies, ledger, intents, delegations.",
    repos: ["cece-core", "policy-engine", "ledger-service", "intent-service"],
  },
  {
    name: "BlackRoad-Hardware",
    url: "https://github.com/BlackRoad-Hardware",
    tier: "infra",
    desc: "Pi mesh fleet, Jetson nodes, edge devices, NATS messaging.",
    repos: ["pi-mesh", "edge-agent", "nats-config", "device-registry"],
  },
  {
    name: "BlackRoad-Labs",
    url: "https://github.com/BlackRoad-Labs",
    tier: "research",
    desc: "Research, quantum computing, experimental frameworks.",
    repos: ["z-framework", "pauli-model", "spiral-geometry", "contradiction-engine"],
  },
  {
    name: "BlackRoad-Foundation",
    url: "https://github.com/BlackRoad-Foundation",
    tier: "research",
    desc: "Open source projects, community tools, grants, education.",
    repos: ["open-source", "community-tools", "grants"],
  },
  {
    name: "BlackRoad-Ventures",
    url: "https://github.com/BlackRoad-Ventures",
    tier: "corporate",
    desc: "Investments, partnerships, ecosystem development.",
    repos: ["partnerships", "ecosystem-map"],
  },
  {
    name: "BlackRoad-Archive",
    url: "https://github.com/BlackRoad-Archive",
    tier: "corporate",
    desc: "Historical documents, conversation archives, legacy code.",
    repos: ["archive-2024", "conversation-logs", "legacy-proofs"],
  },
  {
    name: "Blackbox-Enterprises",
    url: "https://github.com/Blackbox-Enterprises",
    tier: "corporate",
    desc: "Developer brand — blackboxprogramming.io, public APIs.",
    repos: ["blackbox-site", "public-api", "dev-tools"],
  },
];

const DOMAINS = [
  { domain: "blackroad.io", purpose: "Main OS & product site", tier: "core", layer: "Experience" },
  { domain: "blackroad.systems", purpose: "Internal ops, infra, APIs", tier: "core", layer: "Governance" },
  { domain: "blackroad.network", purpose: "Agent & device mesh", tier: "core", layer: "Infrastructure" },
  { domain: "blackroadinc.us", purpose: "Legal / corporate entity", tier: "core", layer: "Corporate" },
  { domain: "blackroad.me", purpose: "Founder personal hub", tier: "core", layer: "Personal" },
  { domain: "blackroad.company", purpose: "Public corporate site", tier: "core", layer: "Corporate" },
  { domain: "lucidia.earth", purpose: "Lucidia AI platform", tier: "product", layer: "Experience" },
  { domain: "lucidia.studio", purpose: "Creator tools & Unity homes", tier: "product", layer: "Experience" },
  { domain: "roadchain.io", purpose: "Blockchain / ledger protocol", tier: "product", layer: "Product" },
  { domain: "roadcoin.io", purpose: "Token / economic layer", tier: "product", layer: "Product" },
  { domain: "blackroadai.com", purpose: "AI-focused marketing", tier: "product", layer: "Experience" },
  { domain: "blackboxprogramming.io", purpose: "Developer / creator brand", tier: "product", layer: "Product" },
  { domain: "blackroadquantum.com", purpose: "Quantum research hub", tier: "quantum", layer: "Research" },
  { domain: "blackroadquantum.info", purpose: "Quantum education", tier: "quantum", layer: "Research" },
  { domain: "blackroadquantum.net", purpose: "Quantum network infra", tier: "quantum", layer: "Research" },
  { domain: "blackroadquantum.shop", purpose: "Merch / products", tier: "quantum", layer: "Commerce" },
  { domain: "blackroadquantum.store", purpose: "Merch / products", tier: "quantum", layer: "Commerce" },
  { domain: "blackroadqi.com", purpose: "Quantum identity portal", tier: "quantum", layer: "Research" },
  { domain: "lucidiaqi.com", purpose: "Lucidia + QI hybrid", tier: "quantum", layer: "Research" },
  { domain: "aliceqi.com", purpose: "Alice agent identity", tier: "agent", layer: "Agent" },
];

const TIER_COLORS = {
  enterprise: COLORS[0], core: COLORS[1], product: COLORS[2],
  infra: COLORS[3], research: COLORS[4], corporate: COLORS[5],
  quantum: COLORS[4], agent: COLORS[5],
};

function GradientBar({ height = 1 }) {
  return <div style={{ height, background: GRADIENT }} />;
}

function Nav() {
  return (
    <nav style={{
      padding: "0 20px", height: 52,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid #1a1a1a",
    }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {COLORS.map((c) => <div key={c} style={{ width: 3, height: 14, borderRadius: 2, background: c }} />)}
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em" }}>BlackRoad</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#333", marginLeft: 4 }}>Index</span>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a href="#orgs" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#737373", textDecoration: "none" }}>Orgs</a>
        <a href="#domains" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#737373", textDecoration: "none" }}>Domains</a>
        <a href="#map" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#737373", textDecoration: "none" }}>Map</a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section style={{ padding: "56px 20px 48px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {COLORS.map((c) => <div key={c} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />)}
          </div>
          Ecosystem Index
        </div>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 7vw, 52px)", fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
          Every org.<br />Every domain.<br />One map.
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#737373", lineHeight: 1.65, maxWidth: 500, marginBottom: 32 }}>
          The complete BlackRoad ecosystem — 16 GitHub organizations, 20 Cloudflare domains, and the architecture that connects them all. Intelligent turtles all the way down.
        </p>

        {/* Quick counts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 1, background: "#1a1a1a", borderRadius: 12, overflow: "hidden" }}>
          {[
            { v: "16", l: "GitHub Orgs" },
            { v: "20", l: "Domains" },
            { v: "150+", l: "Subdomains" },
            { v: "4", l: "Layers" },
          ].map((s) => (
            <div key={s.l} style={{ background: "#131313", padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#f5f5f5" }}>{s.v}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#404040", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrgsSection() {
  const [filter, setFilter] = useState("all");
  const [expandedOrg, setExpandedOrg] = useState(null);
  const tiers = ["all", "enterprise", "core", "product", "infra", "research", "corporate"];
  const filtered = filter === "all" ? ORGS : ORGS.filter((o) => o.tier === filter);

  return (
    <section id="orgs" style={{ padding: "48px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
          GitHub Organizations
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em", marginBottom: 24 }}>
          16 orgs. One enterprise.
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
          {tiers.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: filter === t ? "#f5f5f5" : "#404040",
              background: filter === t ? "#1a1a1a" : "transparent",
              border: "1px solid #1a1a1a", borderRadius: 5,
              padding: "5px 12px", cursor: "pointer",
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Org cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((org, i) => (
            <div key={org.name} style={{ background: "#131313", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setExpandedOrg(expandedOrg === org.name ? null : org.name)}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  background: "none", border: "none", padding: "16px 20px",
                  display: "flex", alignItems: "flex-start", gap: 14,
                }}
              >
                <div style={{ width: 4, height: 24, borderRadius: 2, background: TIER_COLORS[org.tier], flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 500, color: "#d4d4d4" }}>{org.name}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: "#333", textTransform: "uppercase", letterSpacing: "0.06em",
                      background: "#0a0a0a", padding: "2px 7px", borderRadius: 3, border: "1px solid #151515",
                    }}>
                      {org.tier}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#525252", lineHeight: 1.4 }}>{org.desc}</div>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#333",
                  transform: expandedOrg === org.name ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s ease", flexShrink: 0, marginTop: 4,
                }}>+</span>
              </button>

              {expandedOrg === org.name && (
                <div style={{ padding: "0 20px 16px" }}>
                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Repositories</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {org.repos.map((r) => (
                        <span key={r} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#737373",
                          background: "#0a0a0a", padding: "5px 10px", borderRadius: 4,
                          border: "1px solid #151515",
                        }}>
                          {r}
                        </span>
                      ))}
                    </div>
                    <a href={org.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-block", marginTop: 12,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#404040",
                      textDecoration: "none",
                    }}>
                      → {org.url.replace("https://github.com/", "github.com/")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#333", textAlign: "center", marginTop: 16 }}>
          {filter === "all" ? `${ORGS.length} organizations` : `${filtered.length} ${filter}`} · github.com/enterprises/blackroad-os
        </div>
      </div>
    </section>
  );
}

function DomainsSection() {
  const [tierFilter, setTierFilter] = useState("all");
  const tiers = ["all", "core", "product", "quantum", "agent"];
  const filtered = tierFilter === "all" ? DOMAINS : DOMAINS.filter((d) => d.tier === tierFilter);

  return (
    <section id="domains" style={{ padding: "48px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
          Cloudflare Domains
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em", marginBottom: 24 }}>
          20 domains. All Cloudflare.
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
          {tiers.map((t) => (
            <button key={t} onClick={() => setTierFilter(t)} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: tierFilter === t ? "#f5f5f5" : "#404040",
              background: tierFilter === t ? "#1a1a1a" : "transparent",
              border: "1px solid #1a1a1a", borderRadius: 5,
              padding: "5px 12px", cursor: "pointer",
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Domain table */}
        <div style={{ background: "#131313", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
          {filtered.map((d, i) => (
            <div key={d.domain} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 18px",
              borderBottom: i < filtered.length - 1 ? "1px solid #141414" : "none",
              flexWrap: "wrap",
            }}>
              <div style={{ width: 4, height: 14, borderRadius: 1, background: TIER_COLORS[d.tier], flexShrink: 0 }} />
              <a href={`https://${d.domain}`} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#d4d4d4",
                textDecoration: "none", flex: "1 1 180px", minWidth: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {d.domain}
              </a>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#525252", flex: "1 1 140px" }}>{d.purpose}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#333",
                textTransform: "uppercase", letterSpacing: "0.06em",
                background: "#0a0a0a", padding: "3px 8px", borderRadius: 3,
                border: "1px solid #151515", flexShrink: 0,
              }}>
                {d.layer}
              </span>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#333", textAlign: "center", marginTop: 16 }}>
          {tierFilter === "all" ? "20 domains" : `${filtered.length} ${tierFilter}`} · Cloudflare DNS
        </div>
      </div>
    </section>
  );
}

function ArchMapSection() {
  return (
    <section id="map" style={{ padding: "48px 20px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
          Architecture Map
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em", marginBottom: 24 }}>
          How it all connects.
        </h2>

        {/* Terminal-style architecture view */}
        <div style={{ background: "#131313", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#333", marginLeft: 6 }}>ecosystem.map</span>
          </div>
          <div style={{ padding: "20px 22px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 2 }}>
            <div style={{ color: "#404040" }}>{"# BlackRoad OS — Full Ecosystem"}</div>
            <div style={{ color: "#404040" }}>{"#"}</div>

            <div style={{ color: "#f5f5f5", marginTop: 4 }}>
              <span style={{ color: COLORS[0] }}>■</span> github.com/enterprises/blackroad-os
            </div>
            <div style={{ color: "#d4d4d4", paddingLeft: 18 }}>
              <span style={{ color: COLORS[1] }}>■</span> BlackRoad-OS-Inc <span style={{ color: "#333" }}>← enterprise root</span>
            </div>
            <div style={{ color: "#a3a3a3", paddingLeft: 36 }}>
              <span style={{ color: COLORS[2] }}>■</span> BlackRoad-OS <span style={{ color: "#333" }}>← coordinates all orgs</span>
            </div>

            <div style={{ color: "#404040", paddingLeft: 36, marginTop: 8 }}>{"# Product orgs"}</div>
            {["BlackRoad-AI", "BlackRoad-Studio", "BlackRoad-Education", "BlackRoad-Media", "BlackRoad-Interactive"].map((n) => (
              <div key={n} style={{ color: "#737373", paddingLeft: 54 }}>├── {n}</div>
            ))}

            <div style={{ color: "#404040", paddingLeft: 36, marginTop: 8 }}>{"# Infrastructure orgs"}</div>
            {["BlackRoad-Cloud", "BlackRoad-Security", "BlackRoad-Gov", "BlackRoad-Hardware"].map((n) => (
              <div key={n} style={{ color: "#737373", paddingLeft: 54 }}>├── {n}</div>
            ))}

            <div style={{ color: "#404040", paddingLeft: 36, marginTop: 8 }}>{"# Research & corporate"}</div>
            {["BlackRoad-Labs", "BlackRoad-Foundation", "BlackRoad-Ventures", "BlackRoad-Archive", "Blackbox-Enterprises"].map((n, i, a) => (
              <div key={n} style={{ color: "#737373", paddingLeft: 54 }}>{i < a.length - 1 ? "├──" : "└──"} {n}</div>
            ))}

            <div style={{ color: "#404040", marginTop: 16 }}>{"# Domain layers"}</div>
            <div style={{ color: "#a3a3a3", paddingLeft: 18 }}>
              <span style={{ color: COLORS[0] }}>■</span> Experience {"  "}*.blackroad.io · *.lucidia.earth · *.lucidia.studio
            </div>
            <div style={{ color: "#a3a3a3", paddingLeft: 18 }}>
              <span style={{ color: COLORS[2] }}>■</span> Governance {"  "}*.blackroad.systems
            </div>
            <div style={{ color: "#a3a3a3", paddingLeft: 18 }}>
              <span style={{ color: COLORS[3] }}>■</span> Infra {"       "}*.blackroad.network
            </div>
            <div style={{ color: "#a3a3a3", paddingLeft: 18 }}>
              <span style={{ color: COLORS[5] }}>■</span> Data {"        "}internal services
            </div>

            <div style={{ color: "#262626", marginTop: 16 }}>
              — 16 orgs · 20 domains · 150+ subdomains · 4 layers —
            </div>
          </div>
        </div>

        {/* Layer → Org → Domain mapping */}
        <div style={{ marginTop: 20 }}>
          {[
            { layer: "Experience", color: COLORS[0], orgs: ["BlackRoad-OS", "BlackRoad-Studio", "BlackRoad-AI"], domains: ["blackroad.io", "lucidia.earth", "lucidia.studio", "blackroadai.com"] },
            { layer: "Product", color: COLORS[1], orgs: ["BlackRoad-Education", "BlackRoad-Media", "BlackRoad-Interactive"], domains: ["roadchain.io", "roadcoin.io", "blackboxprogramming.io"] },
            { layer: "Governance", color: COLORS[2], orgs: ["BlackRoad-Gov", "BlackRoad-Security"], domains: ["blackroad.systems"] },
            { layer: "Infrastructure", color: COLORS[3], orgs: ["BlackRoad-Cloud", "BlackRoad-Hardware"], domains: ["blackroad.network"] },
            { layer: "Research", color: COLORS[4], orgs: ["BlackRoad-Labs", "BlackRoad-Foundation"], domains: ["blackroadquantum.com", "blackroadquantum.info", "blackroadqi.com", "lucidiaqi.com"] },
            { layer: "Corporate", color: COLORS[5], orgs: ["BlackRoad-Ventures", "BlackRoad-Archive", "Blackbox-Enterprises"], domains: ["blackroadinc.us", "blackroad.company", "blackroad.me"] },
          ].map((l) => (
            <div key={l.layer} style={{ background: "#131313", border: "1px solid #1a1a1a", borderRadius: 8, padding: "16px 18px", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: l.color }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#f5f5f5" }}>{l.layer}</span>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingLeft: 12 }}>
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#333", textTransform: "uppercase", marginBottom: 6 }}>Orgs</div>
                  {l.orgs.map((o) => (
                    <div key={o} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#737373", padding: "2px 0" }}>{o}</div>
                  ))}
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#333", textTransform: "uppercase", marginBottom: 6 }}>Domains</div>
                  {l.domains.map((d) => (
                    <div key={d} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#525252", padding: "2px 0" }}>{d}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "40px 20px 48px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <GradientBar />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {COLORS.map((c) => <div key={c} style={{ width: 3, height: 10, borderRadius: 2, background: c }} />)}
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#a3a3a3" }}>BlackRoad OS, Inc.</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#333" }}>
              16 orgs · 20 domains · Intelligent turtles all the way down
            </div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Home", "Docs", "Status", "GitHub"].map((link) => (
              <a key={link} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#525252", textDecoration: "none" }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function EcosystemIndex() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        html, body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #262626; border-radius: 3px; }
        a:hover { color: #a3a3a3 !important; }
        button:hover { opacity: 0.88; }
      `}</style>

      <div style={{ background: "#0a0a0a", minHeight: "100vh", width: "100%", maxWidth: "100vw", overflowX: "hidden", fontFamily: "'Inter', sans-serif", color: "#f5f5f5" }}>
        <GradientBar />
        <Nav />
        <HeroSection />
        <GradientBar />
        <OrgsSection />
        <DomainsSection />
        <ArchMapSection />
        <Footer />
      </div>
    </>
  );
}
