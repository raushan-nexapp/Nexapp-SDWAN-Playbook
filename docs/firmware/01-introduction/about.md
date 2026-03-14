# About NexappOS

NexappOS is an enterprise-grade network operating system purpose-built for SD-WAN routers. It transforms standard x86 hardware into a fully featured branch gateway with software-defined networking, advanced routing, traffic optimization, and centralized management capabilities.

## Who Is This For?

This manual is written for network administrators and IT professionals responsible for deploying, configuring, and maintaining NexappOS routers at branch offices, data centers, and remote sites. A working knowledge of IP networking (routing, VLANs, firewalls) is assumed.

## Key Features

NexappOS provides a complete branch networking stack in a single firmware image:

| Feature Area | Capabilities |
|---|---|
| **SD-WAN Fabric** | Encrypted overlay tunnels, hub-and-spoke or full-mesh topologies, automatic tunnel failover |
| **Multi-WAN** | Active/active link aggregation, weighted load balancing, per-application path selection |
| **Performance SLA** | Real-time link health monitoring (latency, jitter, packet loss), quality thresholds, automatic traffic steering |
| **Dynamic Routing** | BGP, OSPF, RIP, and VRF-based multi-tenancy for traffic isolation |
| **Quality of Service** | Per-interface bandwidth limits, priority queuing, traffic classification and shaping |
| **Security** | Stateful firewall, Deep Packet Inspection (DPI), Intrusion Prevention System (IPS), Threat Shield, DNS-based web filtering |
| **VPN** | OpenVPN (road warrior and site-to-site), WireGuard, IPsec, L2TP |
| **High Availability** | VRRP-based primary/backup router failover with automatic state synchronization |
| **DC/DR Failover** | Dual-controller failover so routers remain managed even if the primary controller goes offline |
| **Monitoring** | Real-time bandwidth graphs, connection tracking, system resource monitoring, diagnostic tools (ping, traceroute, DNS lookup, speed test) |

## Architecture Overview

NexappOS is organized into three planes that work together to deliver SD-WAN functionality:

### Management Plane

The management plane handles configuration and visibility. You interact with the router through a web-based UI accessible at `https://<router-ip>:9090`. When the router is registered with a Nexapp SDWAN Controller, the controller can push configurations, collect telemetry, and coordinate deployments across your entire fleet.

### Control Plane

The control plane makes forwarding decisions. It runs dynamic routing protocols (BGP, OSPF), monitors WAN link quality in real time, and enforces traffic steering policies. When link quality drops below your defined thresholds, the control plane automatically reroutes traffic to a healthier path.

### Data Plane

The data plane moves packets. It handles overlay tunnel encapsulation, encryption, forward error correction (FEC), firewall rule enforcement, NAT, QoS queuing, and DPI classification. The data plane is optimized for line-rate forwarding on x86 hardware.

## Operating Modes

NexappOS operates in one of two modes:

**Standalone Mode** — You configure every setting directly through the local web UI. The router operates independently with no external dependencies. All features documented in this manual are available.

**Controller-Managed Mode** — The router is registered with a Nexapp SDWAN Controller, which provides centralized configuration, policy distribution, and fleet-wide monitoring. Some settings (such as SD-WAN overlay configuration and routing policies) may be pushed from the controller and cannot be modified locally. You still have full access to the local web UI for diagnostics and settings that are not controller-managed.

!!! note "Mode Indicator"
    Throughout this manual, features are marked with their applicable mode:
    **Standalone**, **Controller-Managed**, or **Both**.

## Firmware Version

This manual covers NexappOS version **10.01** and later. You can check your current firmware version under **System > Dashboard** in the web UI.

!!! info "See Also"
    For centralized management of multiple NexappOS routers, see the
    [Nexapp SDWAN Controller Manual](../../controller/index.md).
