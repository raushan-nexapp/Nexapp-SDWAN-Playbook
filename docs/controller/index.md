# Nexapp SDWAN Orchestrator & Controller User Manual

Welcome to the Nexapp SDWAN controller documentation. This manual covers the centralized management platform for deploying, configuring, and monitoring your fleet of NexappOS SD-WAN devices.

## What is Nexapp SDWAN Controller?

The Nexapp SDWAN Controller is an enterprise orchestration platform that provides centralized management for all NexappOS devices in your network. Built on Django with a REST API, it enables:

- **Fleet Management** — Register, configure, and monitor hundreds of SD-WAN devices
- **SD-WAN Topology** — Create hub-spoke and mesh topologies with a 6-step wizard
- **Global Policy Engine** — Define BGP, OSPF, QoS, SLA, and steering policies that propagate to all devices
- **Application Intelligence** — Deep packet inspection with application-aware traffic intelligence
- **Reporting** — Automated PDF/CSV reports with email scheduling
- **Users** — Organization-scoped data isolation with role-based access control
- **REST API** — Full programmatic access to all controller features

## Manual Organization

| Chapter | Description |
|---------|-------------|
| [Introduction](01-introduction/about.md) | Architecture overview, getting started |
| [Installation](02-installation/requirements.md) | System requirements, Docker/manual deployment |
| [Device Management](03-devices/registration.md) | Registration, configuration, groups, monitoring |
| [SD-WAN Topology](04-topology/overview.md) | Topology wizard, hub-spoke, mesh |
| [Deployment](05-deployment/pipeline.md) | Configuration push, deployment pipeline, history |
| [Global Policies](06-policies/overview.md) | BGP, OSPF, QoS, SLA, steering, tenant policies |
| [BGP Route Reflector](07-bgp-rr/overview.md) | Controller-based route reflector |
| [VRF Multi-Tenancy](08-vrf/overview.md) | Per-tenant route isolation with MP-BGP |
| [DPI Analytics](09-dpi/overview.md) | Traffic analysis, app intelligence, alerts |
| [Data Usage Dashboard](10-data-usage/overview.md) | Bandwidth analytics, cellular, per-device |
| [Reports](11-reports/templates.md) | Templates, scheduling, PDF/CSV export |
| [High Availability](12-ha/overview.md) | HA configuration, DC/DR failover |
| [Multi-Tenancy](13-multi-tenancy/organizations.md) | Organizations, users, access zones |
| [REST API Reference](14-api/authentication.md) | API authentication, endpoints, examples |
| [Administration](15-admin/django-admin.md) | Django admin, Celery, health, audit |
| [Troubleshooting](16-troubleshooting/common-issues.md) | Common issues and solutions |

## Architecture

```
                    ┌─────────────────────────┐
                    │   Nexapp SDWAN          │
                    │   Controller            │
                    │   (Django + Celery)      │
                    │                         │
                    │  ┌───────┐ ┌──────────┐ │
                    │  │ REST  │ │ Global   │ │
                    │  │ API   │ │ Policies │ │
                    │  └───┬───┘ └─────┬────┘ │
                    │      │           │      │
                    │  ┌───┴───────────┴────┐ │
                    │  │   ZeroTier Mgmt    │ │
                    │  │   (10.0.0.0/24)    │ │
                    │  └───────┬────────────┘ │
                    └──────────┼──────────────┘
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
        │  NexappOS  │   │  NexappOS  │   │  NexappOS  │
        │  Hub       │   │  Spoke 1   │   │  Spoke 2   │
        └───────────┘   └───────────┘   └───────────┘
```

## Access

Access the Nexapp SDWAN Controller:

- **Web Admin**: `https://<controller-ip>/admin/`
- **REST API**: `https://<controller-ip>/api/v1/`
- **Authentication**: Token-based (`Authorization: Token <key>`) or session-based

## Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Disk | 20 GB | 50+ GB SSD |
| Database | PostgreSQL 14 | PostgreSQL 16 |
| Cache | Redis 6 | Redis 7 |
