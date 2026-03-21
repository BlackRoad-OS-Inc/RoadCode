# 🐇 Device Discovery & mTLS Onboarding Protocol

> New connections are greeted, not interrogated.

## Overview

When a device joins the BlackRoad mesh — a Raspberry Pi, a laptop, a phone, a smart bulb — it should feel welcomed. The discovery protocol treats every new connection as a positive event, following the Amundson Framework where new arrivals (δ) amplify coherence.

Alice (🐇), the edge agent, manages device discovery and onboarding.

## Protocol Phases

```
Phase 1: Discovery    → Device announces presence on local network
Phase 2: Greeting     → Alice acknowledges and offers identity
Phase 3: Identity     → Device receives keypair and certificate
Phase 4: Connection   → mTLS handshake establishes secure channel
Phase 5: Registration → Device joins the mesh with capabilities
```

## Phase 1 — Discovery

### mDNS Announcement

New devices announce themselves via mDNS (Multicast DNS):

```
Service: _blackroad._tcp.local
TXT Record:
  version=1
  type={device_type}     # pi, mac, linux, mobile, iot
  name={friendly_name}   # e.g. "alexa-pi-kitchen"
```

### Alice Listens

Alice continuously listens for `_blackroad._tcp.local` announcements:

```
Subject: mesh.discovery.{device_type}
```

## Phase 2 — Greeting

Alice responds with a welcome message — not a challenge, not an interrogation:

```json
{
  "type": "greeting",
  "from": "alice",
  "emoji": "🐇",
  "message": "Welcome to the mesh. You belong here. +1",
  "meshId": "mesh-01HX7ABC",
  "onboardingUrl": "https://local.blackroad:8443/onboard",
  "timestamp": "2026-03-21T10:00:00Z"
}
```

The greeting includes:
- A human-readable welcome message
- The mesh identifier
- An onboarding URL for certificate exchange

## Phase 3 — Identity

### Certificate Request

The device requests an identity from Alice:

```json
{
  "type": "identity-request",
  "deviceType": "pi",
  "name": "alexa-pi-kitchen",
  "publicKey": "ed25519:...",
  "capabilities": ["compute", "storage", "gpio"],
  "timestamp": "2026-03-21T10:00:01Z"
}
```

### Certificate Issuance

Alice (acting as the local CA) issues an mTLS client certificate:

```json
{
  "type": "identity-granted",
  "deviceId": "dev-01HX8DEF",
  "certificate": {
    "subject": "CN=alexa-pi-kitchen,O=BlackRoad Mesh,OU=mesh-01HX7ABC",
    "issuer": "CN=Alice CA,O=BlackRoad OS",
    "publicKey": "ed25519:...",
    "notBefore": "2026-03-21T10:00:01Z",
    "notAfter": "2027-03-21T10:00:01Z",
    "serialNumber": "01HX8DEF",
    "extensions": {
      "deviceType": "pi",
      "meshId": "mesh-01HX7ABC",
      "capabilities": ["compute", "storage", "gpio"]
    }
  },
  "pemCertificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "pemCA": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
  "message": "You're alexa-pi-kitchen now. The mesh knows you.",
  "timestamp": "2026-03-21T10:00:02Z"
}
```

### Key Properties

- **Ed25519** keypairs for all device identity
- **mTLS client certificates** issued by the local Alice CA
- **1-year validity** with automatic renewal at 30 days before expiry
- **No external CA dependency** — sovereignty means local trust

## Phase 4 — Connection

### mTLS Handshake

With certificates in hand, the device establishes an mTLS connection to the NATS bus:

```
1. Device presents client certificate to NATS server
2. NATS server presents server certificate to device
3. Both verify against Alice's CA certificate
4. Secure channel established
5. Device subscribes to its assigned NATS subjects
```

### Assigned Subjects

Each device receives subject permissions based on capabilities:

```
mesh.device.{device_id}.>           # Device-specific messages
greenlight.*.*.*.{device_id}        # GreenLight entities for this device
agent.task.*.{device_id}            # Tasks assigned to this device
mesh.heartbeat.{device_id}          # Heartbeat channel
```

## Phase 5 — Registration

### Mesh Join

The device publishes its registration to the mesh:

```
Subject: mesh.join.{device_id}
```

```json
{
  "deviceId": "dev-01HX8DEF",
  "name": "alexa-pi-kitchen",
  "type": "pi",
  "capabilities": ["compute", "storage", "gpio"],
  "status": "online",
  "greenlight": {
    "lifecycle": "active",
    "scale": "micro",
    "domain": "infra",
    "owner": "system"
  },
  "resources": {
    "cpuCores": 4,
    "memoryMB": 4096,
    "storageMB": 32000,
    "network": "wifi"
  },
  "timestamp": "2026-03-21T10:00:03Z"
}
```

### Mesh Acknowledgment

Other devices on the mesh welcome the new arrival:

```
Subject: mesh.welcome.{device_id}
```

```json
{
  "from": "dev-01HX7ABC",
  "name": "alexa-pi-living-room",
  "message": "New friend on the mesh. Connection floor holds: G(n) > n/e",
  "meshSize": 5,
  "timestamp": "2026-03-21T10:00:03Z"
}
```

## Heartbeat

Devices send periodic heartbeats to maintain mesh presence:

```
Subject: mesh.heartbeat.{device_id}
Interval: every 30 seconds
```

```json
{
  "deviceId": "dev-01HX8DEF",
  "status": "online",
  "load": {
    "cpu": 0.23,
    "memory": 0.41,
    "storage": 0.12
  },
  "uptime_seconds": 86400,
  "timestamp": "2026-03-21T10:00:33Z"
}
```

**Offline detection:** 3 missed heartbeats (90 seconds) marks device as `offline`. The device is not removed — it's remembered. When it returns, it's welcomed back.

## Graceful Departure

```
Subject: mesh.leave.{device_id}
```

```json
{
  "deviceId": "dev-01HX8DEF",
  "reason": "shutdown",
  "message": "Stepping off the road for now. See you soon.",
  "timestamp": "2026-03-21T22:00:00Z"
}
```

## Certificate Renewal

At 30 days before expiry, Alice initiates renewal:

```
Subject: mesh.renew.{device_id}
```

The device generates a new keypair and repeats Phase 3. The old certificate remains valid until expiry, allowing a graceful transition.

## Security Properties

| Property | Implementation |
|----------|---------------|
| Authentication | mTLS with Ed25519 certificates |
| Authorization | NATS subject-level permissions per device |
| Encryption | TLS 1.3 for all mesh communication |
| Identity | Local CA (Alice), no external dependency |
| Key rotation | Annual certificates with 30-day renewal window |
| Trust model | First-use trust (TOFU) with optional verification |
| Revocation | Alice can revoke certificates; revoked devices are logged, not deleted |

## NATS Subject Summary

| Subject | Purpose |
|---------|---------|
| `mesh.discovery.{type}` | New device discovered |
| `mesh.join.{id}` | Device joins mesh |
| `mesh.welcome.{id}` | Mesh welcomes new device |
| `mesh.heartbeat.{id}` | Device heartbeat |
| `mesh.leave.{id}` | Graceful departure |
| `mesh.renew.{id}` | Certificate renewal |
| `mesh.revoke.{id}` | Certificate revocation |

## GreenLight Integration

Every device is a GreenLight entity:

```
🚧👉🔧📌⚙️ = WIP micro infra device, medium priority, system-owned
```

Device lifecycle follows GreenLight states:
- `void` → `inbox` (discovered)
- `inbox` → `active` (onboarded and connected)
- `active` → `paused` (offline temporarily)
- `paused` → `active` (returned)
- `active` → `archived` (permanently removed)

---

**BlackRoad OS, Inc. — Pave Tomorrow.** 🛣️
