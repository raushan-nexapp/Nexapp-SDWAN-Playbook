# About Nexapp SDWAN Controller

## Overview

The Nexapp SDWAN Controller is an enterprise-grade orchestration platform for managing fleets of NexappOS SD-WAN routers. It provides a single pane of glass for configuration, topology management, policy distribution, traffic analytics, and reporting across all sites — from a handful of branch offices to hundreds of distributed locations.

The controller runs on a Linux server in your data center or cloud environment. All NexappOS routers register with the controller and receive their configuration automatically. Administrators interact with the controller through a web-based UI at `https://<controller>/` or programmatically through the REST API at `https://<controller>/api/v1/`.

## Key Capabilities

| Capability | Description |
|---|---|
| **Fleet Management** | Register, configure, and monitor up to hundreds of NexappOS devices from a single interface |
| **SD-WAN Topology** | Create hub-spoke and mesh topologies using a guided 6-step wizard |
| **Global Policy Engine** | Define BGP, OSPF, QoS, Performance SLA, and traffic steering policies that propagate to all devices |
| **Application Intelligence** | Deep packet inspection with application-level traffic intelligence, usage reports, and alerting |
| **Data Usage Dashboard** | Per-device, per-site, and cellular link bandwidth analytics with drill-down visualization |
| **Automated Reporting** | Scheduled PDF and CSV reports delivered by email on any cadence |
| **High Availability** | Controller-level HA with DC/DR failover so devices stay managed during controller outages |
| **Users** | Organization-scoped data isolation with role-based access control for ISPs and MSPs |
| **REST API** | Full programmatic access for integration with NOC systems, automation pipelines, and third-party tools |
| **Policy Engine > Route Reflector** | Built-in route reflector for centralized BGP route distribution across the SD-WAN fabric |
| **VRF Multi-Tenancy** | Per-tenant route isolation using VRFs and MP-BGP, deployed from the controller |

## Who Is This For?

The Nexapp SDWAN Controller is designed for three primary personas:

**Network Administrators** — IT professionals managing a corporate WAN with multiple branch offices. The controller provides a centralized view of all sites, automated deployment, and policy-driven traffic management without requiring per-device configuration.

**Internet Service Providers (ISPs)** — Providers offering managed SD-WAN services to enterprise customers. Multi-tenancy support ensures each customer's configuration and data are fully isolated, while the global policy engine allows service-level templates to be applied fleet-wide.

**Managed Service Providers (MSPs)** — Organizations managing SD-WAN infrastructure on behalf of multiple clients. The controller's organization model, role-based access control, and API-first design support automated provisioning and white-label deployments.

## Platform Architecture

The controller is built on a layered architecture:

- **Web server**: Nginx proxies HTTPS requests to Gunicorn running an ASGI application server
- **Application layer**: A Python web framework handles REST API requests, authentication, and business logic
- **Background task workers**: Asynchronous workers handle configuration deployment, status polling, DPI ingestion, and report generation
- **Database**: PostgreSQL 16 stores all configuration, topology data, device state, and analytics
- **Cache and queue**: Redis serves as the message broker for background tasks and caches frequently accessed data
- **Management plane**: ZeroTier creates a secure overlay network (10.0.0.0/24) that the controller uses to reach devices regardless of their network topology or NAT configuration

## How Devices Connect

NexappOS routers include the `openwisp_config` package, which runs at startup and contacts the controller. On first contact, the device submits its hardware identity and is placed in the **Pending Devices** queue. An administrator approves the device, after which the controller:

1. Assigns the device to an organization
2. Generates a device key for API authentication
3. Joins the device to the ZeroTier management network
4. Begins status polling every 30 seconds

All subsequent configuration pushes, topology deployments, and policy updates flow from the controller to the device over this management channel.

## Production Deployment

The reference production deployment runs at `https://demo.nexapp.co.in` and serves as the live environment for NexappOS fleet management. See [Installation](../02-installation/requirements.md) for server requirements and deployment options.

!!! info "See Also"
    - [Architecture Overview](architecture.md) — Detailed component diagram and data flows
    - [Getting Started](getting-started.md) — Step-by-step guide to your first deployment
    - [REST API Reference](../14-api/authentication.md) — API authentication and endpoint reference
