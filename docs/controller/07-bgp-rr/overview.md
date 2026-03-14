# BGP Route Reflector Overview

## Overview

The BGP Route Reflector is a FRRouting (FRR) daemon that runs directly on the Nexapp SDWAN
Controller server. All NexappOS devices establish a single BGP session to the controller
instead of forming a full mesh of BGP sessions between each other. The controller reflects
routes between all connected peers, distributing reachability information across the entire
SD-WAN fabric.

Navigate to **Policy Engine > Route Reflector** in the left navigation to access this feature.

## How It Works

```
                    ┌──────────────────────────┐
                    │  Controller Server        │
                    │  (FRRouting RR)           │
                    │  AS 65000, 198.51.100.1   │
                    └────────┬──────────────────┘
           ┌─────────────────┼──────────────────┐
           │                 │                  │
    ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐
    │  Hub        │   │  Spoke 1    │   │  Spoke 2    │
    │  AS 65001   │   │  AS 65001   │   │  AS 65001   │
    │  10.0.0.3   │   │  10.0.0.2   │   │  10.0.0.6   │
    └─────────────┘   └─────────────┘   └─────────────┘
```

1. Each NexappOS device (hub and spokes) establishes one iBGP session to the controller
   over the ZeroTier management network (typically `10.0.0.0/24`).
2. Devices advertise their LAN prefixes to the controller.
3. The controller, acting as a Route Reflector, sends each device's prefixes to all other
   peers — spokes learn hub routes and each other's routes without needing direct sessions.
4. Devices install the learned routes in their routing tables, enabling full SD-WAN fabric
   reachability.

## Benefits

| Approach | Sessions Required for N Devices |
|----------|--------------------------------|
| Full mesh iBGP (traditional) | N × (N − 1) / 2 |
| Controller Route Reflector | N (one session per device) |

For a 20-device topology, full mesh requires 190 BGP sessions. With the controller route
reflector, only 20 sessions are needed. This dramatically simplifies management as the
network grows.

## Use Cases

- **Dynamic routing** between SD-WAN sites without managing static routes on each device
- **Prefix aggregation** at the controller level before reflecting to peers
- **Multi-site reachability** across an SD-WAN overlay where site subnets change frequently
- **VPN/VRF route distribution** when combined with MP-BGP for multi-tenant deployments
  (see [VRF Multi-Tenancy](../08-vrf/overview.md))

## Prerequisites

Before enabling the BGP Route Reflector:

- FRRouting must be installed on the controller server (provided in the standard controller
  installation package).
- The ZeroTier management network must be active and all devices must have a ZeroTier IP.
- All devices must be registered in the controller and have a ZeroTier IP assigned.
- TCP port 179 (BGP) must be reachable between the controller's ZeroTier IP and each device's
  ZeroTier IP.

## Integration with SD-WAN Overlay

The BGP route reflector distributes routing information at the control plane level. Actual
traffic still flows through the SD-WAN overlay tunnels between devices. BGP provides the
route advertisements; the bonding daemon handles packet forwarding through the encrypted
tunnels.

When you add a new spoke to a topology:

1. The spoke establishes its ZeroTier connection to the controller.
2. You add the spoke as a BGP neighbor in the route reflector configuration.
3. The spoke advertises its LAN prefixes to the controller.
4. The controller reflects those prefixes to all existing spokes.
5. No changes are needed on existing devices — they automatically learn the new spoke's
   routes.

## See Also

- [BGP Route Reflector Configuration](configuration.md) — Step-by-step setup guide
- [BGP Route Reflector Monitoring](monitoring.md) — Session status and route table
- [VRF Multi-Tenancy](../08-vrf/overview.md) — Extend RR with MP-BGP for multi-tenant routing
- [BGP Policies](../06-policies/bgp.md) — BGP configuration templates for devices
