# SD-WAN Fabric Overview

!!! note "Controller-Managed (primarily)"
    SD-WAN deployment is typically managed by the controller, which pushes overlay, member, and encryption settings to devices. You can also configure SD-WAN locally on a standalone router for single-site deployments.

## Overview

The SD-WAN Fabric is the core of NexappOS networking. It creates encrypted overlay tunnels between hub and spoke routers across commodity internet connections, bonding multiple WAN links into a single resilient transport. The bonding protocol provides packet-level load balancing, Forward Error Correction (FEC), and automatic failover between WAN links.

Navigate to **Network > SD-WAN Fabric** to access the Fabric page.

The Fabric page is organized into three tabs:

- **Tunnels** -- View and configure the overlay tunnel settings (role, hub IP, tunnel address, encryption).
- **Members** -- Add, edit, and remove WAN links (underlay members) that carry tunnel traffic.
- **QoS** -- Configure Quality of Service policies for SD-WAN traffic.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- At least one WAN interface is configured and has internet connectivity (see [Interfaces](../04-network/interfaces.md)).
- You know the hub router's public IP address.
- You have a pre-shared key (PSK) for IPsec encryption, or you will generate one during setup.

## Architecture

NexappOS SD-WAN uses a hub-and-spoke architecture:

- **Hub** -- The central router that all spokes connect to. Typically deployed at the data center or headquarters. The hub has a fixed public IP address.
- **Spoke** -- A branch router that establishes an overlay tunnel to the hub. Spokes can be behind NAT.

Traffic between spokes flows through the hub by default. With ADVPN enabled, spokes can establish direct tunnels to each other automatically (see [ADVPN](advpn.md)).

Each device bonds one or more WAN links into the overlay tunnel. The bonding protocol distributes packets across all active members based on weight, and automatically fails over when a link goes down.

## Configuration Summary

SD-WAN configuration involves three steps:

1. **Configure the overlay** -- Set the device role (hub or spoke), hub IP address, tunnel address, and encryption. See [Overlay Tunnels](overlay-tunnels.md).
2. **Add WAN members** -- Register each WAN link as a member with port, weight, and priority settings. See [Underlay Members](underlay-members.md).
3. **Start SD-WAN** -- After configuring the overlay and adding at least one member, the system starts the bonding daemon and establishes the tunnel.

!!! tip
    For controller-managed deployments, use the topology wizard on the controller to configure hub and spoke devices in a single workflow. The controller pushes all settings automatically.

## WAN Modes

The overlay supports four WAN modes:

| Mode | Description |
|------|-------------|
| **Single** | Standard mode with one WAN link. |
| **Dual Active** | Both WAN links carry traffic simultaneously with load balancing. |
| **Dual Standby** | Primary WAN carries all traffic. Secondary WAN activates on failover (~10-15 seconds). |
| **MPLS + Internet** | Hybrid mode. MPLS carries private traffic through the tunnel; internet provides local breakout. Each member is tagged with a link type. |

## Verification

After configuring SD-WAN:

1. Navigate to **Network > SD-WAN Fabric** and confirm the overlay status shows **Connected**.
2. Check that all WAN members show a green status indicator.
3. Navigate to **Policy Engine > Performance SLA** to verify link health metrics (RTT, jitter, loss).
4. Ping a remote subnet through the tunnel to confirm end-to-end connectivity.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Overlay status shows "Disconnected" | No WAN members configured or all members are down | Add at least one WAN member and verify the WAN interface has internet connectivity. |
| Tunnel established but no traffic flows | Firewall blocking tunnel ports | Verify the bonding port (default `5511`) is allowed in the firewall on both hub and spoke. |
| Only one WAN link is active | WAN mode set to Single or Dual Standby | Change WAN mode to Dual Active if you want both links to carry traffic simultaneously. |
| High latency on overlay | Underlay WAN link congestion | Check WAN link utilization. Enable QoS or adjust member weights to balance load. |

!!! info "See Also"
    - [Overlay Tunnels](overlay-tunnels.md) -- Configure the SD-WAN overlay settings
    - [Underlay Members](underlay-members.md) -- Add and manage WAN links
    - [SD-WAN Encryption](encryption.md) -- IPsec encryption for overlay tunnels
    - [Health Dashboard](../06-sla/health-dashboard.md) -- Monitor real-time WAN link health
