# NexappOS Firmware User Manual

Welcome to the NexappOS firmware documentation. This manual covers all device-level features for configuring and managing your NexappOS SD-WAN router.

## What is NexappOS?

NexappOS is an enterprise-grade network operating system built on OpenWrt, designed specifically for SD-WAN deployments. It provides a comprehensive web-based management interface for configuring networking, security, SD-WAN fabric, routing, VPN, and monitoring features.

## Manual Organization

This manual is organized by functional area:

| Chapter | Description |
|---------|-------------|
| [Introduction](01-introduction/about.md) | Product overview, system requirements, getting started |
| [Installation](02-installation/download-install.md) | Download, install, initial setup, controller registration |
| [System Administration](03-system/dashboard.md) | Dashboard, settings, SSH, backup, updates, certificates |
| [Network Configuration](04-network/interfaces.md) | Interfaces, DNS/DHCP, routes, Multi-WAN, DDNS |
| [SD-WAN Fabric](05-sdwan/overview.md) | Overlay tunnels, underlay members, encryption, ADVPN |
| [Performance SLA](06-sla/health-dashboard.md) | Path monitoring, quality tiers, traffic steering |
| [Quality of Service](07-qos/overview.md) | Bandwidth management, traffic prioritization |
| [Routing](08-routing/bgp.md) | BGP, OSPF, RIP, VRF multi-tenancy |
| [High Availability](09-ha/overview.md) | VRRP, failover, recovery |
| [Firewall & Security](10-firewall/zones-policies.md) | Zones, rules, NAT, port forwarding |
| [Security Services](11-security/dpi.md) | DPI, IPS, threat shield, web filter |
| [VPN](12-vpn/openvpn-rw.md) | OpenVPN, WireGuard, IPsec, L2TP |
| [Monitoring](13-monitoring/realtime.md) | Real-time stats, diagnostics, logs |
| [DC/DR Failover](14-dcdr/overview.md) | Dual-controller failover |
| [Troubleshooting](15-troubleshooting/common-issues.md) | Common issues and solutions |

## Operating Modes

NexappOS can operate in two modes:

### Standalone Mode
The router operates independently with full local configuration through the web UI. All features are available and configured directly on the device.

### Controller-Managed Mode
The router is registered with a Nexapp SDWAN Controller, which provides centralized configuration, policy management, and monitoring. Some settings may be pushed from the controller and cannot be modified locally.

!!! note "Mode Indicator"
    Throughout this manual, features are marked with their applicable mode:

    - **Standalone** — Available in standalone mode only
    - **Controller-Managed** — Requires controller connection
    - **Both** — Available in both modes

## Web UI Access

Access the NexappOS web interface:

1. Connect to the router via LAN
2. Open a browser and navigate to `https://<router-ip>:9090`
3. Log in with your credentials (default: `root` / `Admin@123`)

!!! warning "Change Default Password"
    Always change the default password immediately after first login.
