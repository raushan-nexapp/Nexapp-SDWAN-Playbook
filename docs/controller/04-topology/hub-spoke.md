# Hub & Spoke Setup

## Overview

Hub-spoke is the most common SD-WAN topology. A single hub router at the data center or headquarters acts as the central aggregation point, and spoke routers at branch offices establish encrypted overlay tunnels to the hub. All branch-to-branch traffic is forwarded through the hub by default, simplifying routing and centralized traffic inspection.

## Architecture

```
                    ┌──────────────────┐
                    │   Hub Router     │
                    │   (DC / HQ)      │
                    │   Public IP      │
                    └────────┬─────────┘
                             │  Overlay Tunnels
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────┴──────┐ ┌─────┴──────┐ ┌────┴───────┐
        │  Spoke 1   │ │  Spoke 2   │ │  Spoke N   │
        │  Branch A  │ │  Branch B  │ │  Branch N  │
        │  (NAT OK)  │ │  (NAT OK)  │ │  (NAT OK)  │
        └────────────┘ └────────────┘ └────────────┘
```

Each spoke establishes an individual tunnel to the hub. Spokes do not connect to each other directly — traffic between Spoke 1 and Spoke 2 travels: Spoke 1 → Hub → Spoke 2 (hair-pinning).

## Hub Requirements

The hub plays the most critical role in the topology. It must meet these requirements:

| Requirement | Detail |
|---|---|
| **Fixed public IP** | Spokes need a stable target address to establish the tunnel. Dynamic IPs are not supported for the hub role. |
| **Bandwidth** | Must handle the aggregate traffic of all spokes simultaneously. Budget for the sum of all spoke traffic plus overhead. |
| **Low latency** | Hub location should be geographically central to minimize round-trip time for all spokes. |
| **High availability** | For production, use an HA hub pair (see [High Availability](../12-ha/overview.md)) so spoke connectivity survives a hub failure. |
| **Open ports** | Inbound UDP on the bonding port (default 5511) must be reachable from the internet. |

## Spoke Requirements

Spokes have much lower requirements than the hub:

| Requirement | Detail |
|---|---|
| **Internet access** | Any internet connection (static or dynamic IP, behind NAT or CGNAT) |
| **Outbound UDP** | Outbound UDP on the bonding port must not be blocked by the ISP or local firewall |
| **Controller access** | HTTPS port 443 to the controller URL for registration and management |

Spokes do not need inbound port forwarding — they initiate the tunnel connection outbound to the hub.

## Traffic Flow

### Spoke-to-Hub Traffic (default)

All spoke traffic destined for the hub (e.g., accessing HQ servers, internet through hub-side breakout):

```
Client at Branch → Spoke tunnel interface → Encrypted SD-WAN tunnel → Hub → Destination
```

### Spoke-to-Spoke Traffic (default, hair-pinning)

Traffic between two branches without ADVPN:

```
Client at Branch A → Spoke 1 → Hub → Spoke 2 → Client at Branch B
```

This adds one extra hop and doubles the latency of the spoke-to-spoke path. For latency-sensitive applications between branches, enable ADVPN.

## ADVPN: Direct Spoke-to-Spoke Tunnels

ADVPN (Auto Discovery VPN) eliminates hair-pinning by allowing spokes to establish direct tunnels to each other on demand, while still maintaining the hub as a control point.

**How ADVPN works:**

1. Spoke 1 initiates traffic to Spoke 2 via the hub
2. The hub detects the spoke-to-spoke traffic pattern
3. The hub signals both spokes to establish a direct tunnel
4. Subsequent traffic flows directly: Spoke 1 ↔ Spoke 2 (no hub in the data path)
5. The direct tunnel is torn down after an inactivity timeout

**Enabling ADVPN:** In the Topology Wizard Step 4 (Overlay Settings), toggle **ADVPN** to **On**. You can also enable it from **SD-WAN Fabric > [name] > Settings**.

Enabling ADVPN triggers a new deployment to all devices in the topology.

**ADVPN requirements:**
- Both spokes must have at least one WAN link that is not behind symmetric NAT
- The hub must have adequate CPU to handle the short-lived signaling phase for each new spoke pair

## Scaling: How Many Spokes Per Hub?

| Hub Hardware | Recommended Max Spokes | Notes |
|---|---|---|
| 4-core, 8 GB RAM | Up to 50 spokes | Suitable for SMB deployments |
| 8-core, 16 GB RAM | Up to 100 spokes | Recommended production hub |
| 16-core, 32 GB RAM | Up to 200 spokes | Large enterprise or ISP hub |

For deployments larger than the recommended maximum, create multiple topologies with separate hubs, or use a hierarchical hub model (regional hubs connected to a super-hub).

## Failover Behavior

If the hub goes down:
- All spoke tunnels drop (spokes cannot communicate with each other or the hub)
- Spokes continue to try reconnecting every 30 seconds
- ADVPN direct tunnels (if established) also drop because they require the hub for re-establishment

To protect against hub failure, configure an HA hub pair. See [High Availability](../12-ha/overview.md) for detailed setup.

## Configuration Reference

When the wizard deploys a hub-spoke topology, the controller pushes these settings to each device:

**Hub device receives:**
- Role: `hub`
- Tunnel IP: First address in the tunnel range (e.g., `10.100.0.1`)
- Configured WAN member interfaces

**Each spoke device receives:**
- Role: `spoke`
- Hub IP: The hub's public WAN IP address
- Spoke tunnel IP: Sequential address in the tunnel range (e.g., `10.100.0.2`, `10.100.0.3`)
- PSK and encryption settings (same on all devices)
- Configured WAN member interfaces for this spoke

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Spoke shows "Connecting" indefinitely | Spoke cannot reach hub's public IP on bonding port | Verify hub firewall allows inbound UDP 5511; verify hub public IP in topology settings is correct |
| Hub is online but all spokes are Disconnected | PSK mismatch after manual edit | Redeploy the topology from **SD-WAN Fabric > [name] > Redeploy All** to re-sync PSK to all devices |
| ADVPN not forming direct tunnels | One spoke is behind symmetric NAT | Check spoke NAT type; symmetric NAT prevents direct tunnel establishment |
| Spoke-to-spoke latency is high without ADVPN | Hair-pinning through hub adds 1–2 extra RTTs | Enable ADVPN or consider placing the hub closer to the majority of spokes |

!!! info "See Also"
    - [Topology Overview](overview.md) — Topology types and status model
    - [Topology Wizard](wizard.md) — Create a hub-spoke topology with the guided wizard
    - [Mesh Topology](mesh.md) — Alternative for small deployments needing low spoke-to-spoke latency
    - [High Availability](../12-ha/overview.md) — Protect against hub failure with HA
