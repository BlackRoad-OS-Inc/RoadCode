# Paper 09: Macro-Quantum Sentinel Zero-Hop Tunnel Setup

**Source:** Google Drive (alexa@blackroad.io) — `Macro-Quantum_Sentinel_Zero-Hop_Tunnel_Setup.docx`
**Verified:** 2026-03-21 by CECE session

---

## Purpose

Bring the Macro-Quantum Sentinel online with a Zero-Hop Cloudflare Tunnel so the Operator can reach the Physical Gateway (Pi 4B) without opening inbound router ports.

## Target Topology

| Component | Device | Role |
|-----------|--------|------|
| Tunnel Host (Physical Gateway) | Raspberry Pi 4B | Remote Control Server |
| Operator | Apple M1 Mac | Root signing authority |
| Exposed Endpoints | ssh.sentinel.\<domain\> | SSH to Pi 4B |
| | health.sentinel.\<domain\> | Optional health endpoint |

**Security Posture**: Outbound-only connector. No public inbound ports.

## Setup Steps

1. **Harden Pi 4B** — Disable password SSH, key-only auth
2. **Install cloudflared** — Tunnel connector
3. **Authenticate** — `cloudflared tunnel login`
4. **Create tunnel** — `cloudflared tunnel create sentinel-zero-hop`
5. **Configure ingress** — SSH on :22, health on :8080
6. **Route DNS** — Point hostnames to tunnel
7. **Enable service** — `systemctl enable --now cloudflared`
8. **Add Cloudflare Access** — MFA required, operator identity only

## Security Requirements

- MFA required for all access
- Device posture checks (optional)
- Key-only SSH (no passwords)
- Zero open inbound ports

---

**Status**: Verified against source. Operational setup guide.
**Related**: BlackBox Protocol, WireGuard mesh, Tor hidden services
