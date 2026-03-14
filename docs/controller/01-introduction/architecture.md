# Architecture Overview

## Overview

The Nexapp SDWAN Controller is a multi-tier platform composed of six core components. Understanding the architecture helps you plan your deployment, diagnose issues, and integrate the controller with your existing infrastructure.

## Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                 Nexapp SDWAN Controller              │
│                                                     │
│  ┌─────────┐   ┌──────────────────────────────────┐ │
│  │  Nginx  │   │       Application Layer          │ │
│  │  HTTPS  │──▶│  REST API  │  Web UI  │  Admin   │ │
│  │  :443   │   └──────────────────┬───────────────┘ │
│  └─────────┘                      │                 │
│                                   ▼                 │
│  ┌─────────────────────┐   ┌─────────────────────┐  │
│  │  Background Workers │   │   PostgreSQL 16      │  │
│  │  Deploy / Status /  │◀──│   Config, State,     │  │
│  │  DPI / Reports      │   │   Analytics          │  │
│  └──────────┬──────────┘   └─────────────────────┘  │
│             │                                        │
│  ┌──────────▼──────────┐                            │
│  │  Redis              │                            │
│  │  Queue + Cache      │                            │
│  └─────────────────────┘                            │
└─────────────────────┬───────────────────────────────┘
                      │  ZeroTier Management Plane
                      │  Network: 10.0.0.0/24
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │NexappOS  │ │NexappOS  │ │NexappOS  │
    │Hub       │ │Spoke 1   │ │Spoke 2   │
    │10.0.0.3  │ │10.0.0.2  │ │10.0.0.6  │
    └──────────┘ └──────────┘ └──────────┘
```

## Core Components

### Web Server (Nginx + Gunicorn)

Nginx terminates HTTPS connections and proxies requests to Gunicorn. Gunicorn runs the application in ASGI mode with multiple worker processes to handle concurrent requests. Static files (JavaScript, CSS, images) are served directly by Nginx for performance and do not consume application worker capacity.

### Application Layer

The application layer handles all REST API requests, web UI state, and admin operations. It is organized into specialized modules:

| Module | Responsibility |
|---|---|
| `sdwan_tunnel` | SD-WAN topology lifecycle: create, deploy, monitor, retire |
| `dpi_analytics` | DPI data ingestion, snapshot storage, intelligence API |
| `controller_reports` | Report template management, PDF/CSV generation, email scheduling |
| `sla_metrics` | SLA metric storage and threshold monitoring |
| `sla_profile` | SLA profile templates with KPI thresholds |
| `ipsec_manager` | IPsec profile templates for overlay encryption |
| `high_availability` | HA device pairing, VRRP configuration, DC/DR failover |
| `device_acl` | Zone-based device access control |
| `accesslog` | Audit event recording for login, logout, and configuration changes |
| `traffic_application` | Application and category definitions for DPI classification |

### Background Task Workers

Four worker queues handle asynchronous operations, ensuring that long-running tasks do not block API responses:

| Queue | Tasks | Cadence |
|---|---|---|
| `deploy` | Configuration push, topology deployment, WAN member sync | On demand |
| `network` | Status polling for all registered devices | Every 30 seconds |
| `monitoring` | DPI data ingestion, SLA metric collection | Continuous |
| `default` | Report generation, email delivery, maintenance | Scheduled |

Separating queues ensures deployment jobs never delay status polling, and monitoring data ingestion never blocks report delivery.

### Database (PostgreSQL 16)

PostgreSQL stores all persistent data: device registrations, topology configurations, policy definitions, DPI snapshots, SLA metrics, audit logs, and report templates. The schema uses organization-scoped foreign keys throughout to enforce multi-tenant data isolation at the database level.

### Cache and Queue (Redis 7)

Redis serves three roles:

- **Message broker**: Routes tasks from the application layer to the appropriate worker queue
- **Result cache**: Stores completed task results for fast retrieval
- **Hot cache**: Caches frequently read data (organization lookups, device lists) to reduce database load

### Management Plane (ZeroTier)

The controller joins a ZeroTier overlay network that provides encrypted, NAT-traversing connectivity to every registered device. The controller's ZeroTier IP is `10.0.0.1`. Each router receives a ZeroTier IP in the `10.0.0.0/24` subnet upon registration.

This management plane is transparent to day-to-day operation — you configure the ZeroTier network ID once in the controller settings, and the system handles join, authentication, and routing automatically. It enables the controller to reach devices behind NAT, CGNAT, or multiple layers of firewalls without requiring port forwarding on the device side.

## Key Data Flows

### Device Registration

```
Router boots → registration agent contacts controller URL
  → Controller creates device record (status: Pending)
  → Admin approves device in Devices > Pending
  → Controller assigns device key + ZeroTier membership
  → Device joins ZeroTier network → management plane active
  → Status polling begins every 30 seconds
```

### Configuration Push

```
Admin saves topology or policy in UI
  → Application layer validates and writes to PostgreSQL
  → Deploy task queued in Redis (deploy queue)
  → Worker picks up task, resolves affected device list
  → Worker connects to each device via ZeroTier management proxy
  → Pushes overlay config + WAN member settings
  → Device applies config, SD-WAN daemon restarts
  → Worker polls for confirmation, updates deployment status
  → UI shows per-device result (success / error)
```

### DPI Data Ingestion

```
NexappOS router collects per-application traffic stats (hourly)
  → Router sends DPI snapshot to /api/v1/dpi/sink/
  → Ingestion handler validates and stores in PostgreSQL
  → Monitoring worker aggregates into daily totals
  → Dashboard queries aggregated data for visualization
```

### Status Polling

```
Network worker fires every 30 seconds
  → Queries each device via ZeroTier proxy
  → Collects: tunnel status, WAN health, SLA metrics, system stats
  → Writes update to PostgreSQL
  → WebSocket pushes status change to any open browser sessions
```

## Scalability Notes

For large deployments, background workers can be scaled independently:

- Run multiple worker processes per queue on the same server (default: 3 deploy + 3 network workers)
- Workers are stateless — they pull jobs from Redis and write results to PostgreSQL
- Scale PostgreSQL and Redis independently as the device fleet grows

!!! info "See Also"
    - [About Nexapp SDWAN Controller](about.md) — Platform overview and key capabilities
    - [System Requirements](../02-installation/requirements.md) — Hardware and software sizing guide
    - [REST API Reference](../14-api/authentication.md) — API authentication and endpoint reference
