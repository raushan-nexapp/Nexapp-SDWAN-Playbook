# System Requirements

## Overview

The Nexapp SDWAN Controller runs on a standard Linux server. This page documents the hardware, operating system, software, and network requirements for each deployment size tier.

## Operating System

| Requirement | Supported Versions |
|---|---|
| **OS** | Ubuntu 22.04 LTS, Ubuntu 24.04 LTS |
| **Architecture** | x86_64 (64-bit) |
| **Kernel** | 5.15 or later |

Ubuntu 22.04 LTS is the tested production baseline. Ubuntu 24.04 LTS is supported for new deployments. Other Debian-based distributions may work but are not tested or supported.

## Hardware Requirements

### Small Deployment (up to 50 devices)

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 50 GB SSD |
| Network | 10 Mbps | 100 Mbps |

### Medium Deployment (50–200 devices)

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Disk | 50 GB SSD | 100 GB SSD |
| Network | 100 Mbps | 1 Gbps |

### Large Deployment (200+ devices)

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 8 cores | 16+ cores |
| RAM | 16 GB | 32+ GB |
| Disk | 200 GB SSD | 500 GB SSD (RAID or separate volume for PostgreSQL) |
| Network | 1 Gbps | 10 Gbps |

!!! note "Disk Growth"
    DPI analytics data is the primary driver of disk growth. At the default 90-day retention, each device generates approximately 50 MB of DPI snapshot data per month. For 200 devices at 90 days, budget at least 9 GB for DPI data alone, in addition to the base OS and application footprint.

## Software Dependencies

All dependencies must be installed before running the controller. The versions below are the tested production stack:

| Software | Minimum Version | Notes |
|---|---|---|
| Python | 3.11 | Virtual environment recommended |
| PostgreSQL | 16 | PostgreSQL 14 is the minimum supported version |
| Redis | 7 | Used as message broker and cache |
| Nginx | 1.24 | Web server and reverse proxy |
| Node.js | 18 LTS | Required only during initial static file build |

## Network Requirements

### Inbound Ports (controller server)

| Port | Protocol | Purpose |
|---|---|---|
| 80 | TCP | HTTP (redirect to HTTPS) |
| 443 | TCP | HTTPS web UI and REST API |

### Outbound Connectivity (controller server)

| Destination | Port | Protocol | Purpose |
|---|---|---|---|
| ZeroTier infrastructure | 9993 | UDP | ZeroTier management plane |
| ZeroTier infrastructure | 9993 | TCP (fallback) | ZeroTier when UDP is blocked |
| SMTP server (optional) | 587 or 465 | TCP | Email delivery for reports and alerts |

### Router-to-Controller Connectivity

NexappOS routers must be able to reach the controller on port 443 (HTTPS). The controller does not require inbound access from the routers directly — all management communication is routed through the ZeroTier overlay after initial registration.

| Direction | Requirement |
|---|---|
| Router → Controller | HTTPS port 443 reachable from router's internet connection |
| Controller → Router | Via ZeroTier overlay (no direct inbound port required on router) |

## DNS and TLS

- The controller should be accessible via a fully qualified domain name (FQDN) such as `controller.example.com`
- A valid TLS certificate is required. Let's Encrypt is recommended for internet-facing deployments
- Routers use the controller URL to self-register; the URL must be stable and the certificate must be trusted by the router

## Firewall Rules (Controller Server)

If the server has a local firewall (ufw, iptables), ensure the following rules are in place before installation:

```bash
# Allow HTTPS from anywhere (router registrations + admin access)
ufw allow 443/tcp

# Allow HTTP for Let's Encrypt ACME challenges
ufw allow 80/tcp

# Allow ZeroTier management plane
ufw allow 9993/udp
```

## Pre-Installation Checklist

Before proceeding to installation:

- [ ] Ubuntu 22.04 or 24.04 LTS installed with SSH access
- [ ] Minimum RAM and disk requirements met for your device count
- [ ] FQDN resolves to the server's public IP
- [ ] TLS certificate available (or Let's Encrypt will be configured)
- [ ] Outbound UDP 9993 to ZeroTier infrastructure is not blocked
- [ ] PostgreSQL 16 and Redis 7 packages available in the OS package repository

!!! info "See Also"
    - [Docker Deployment](docker.md) — Recommended for most new deployments
    - [Manual Installation](manual.md) — Step-by-step Ubuntu installation guide
    - [Initial Configuration](initial-config.md) — First-run setup after installation
