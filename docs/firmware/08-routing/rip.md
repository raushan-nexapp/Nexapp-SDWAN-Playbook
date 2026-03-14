# RIP (Routing Information Protocol)

!!! note "Standalone Only"
    RIP is configured locally on the router. The controller does not manage RIP policies.

## Overview

RIP is a distance-vector routing protocol designed for small, simple networks. NexappOS supports RIPv2, which adds CIDR support and multicast updates. RIP uses hop count as its metric, with a maximum of 15 hops -- any destination more than 15 hops away is considered unreachable.

Navigate to **Policy Engine > RIP** to access this feature.

!!! warning
    RIP is a legacy protocol with slow convergence and a 15-hop limit. For SD-WAN deployments and larger networks, use [BGP](bgp.md) or [OSPF](ospf.md) instead.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- Your network has 15 or fewer hops between any two endpoints.
- All RIP routers in the network use RIPv2.

## Configuration

### Enabling RIP

1. Navigate to **Policy Engine > RIP**.
2. Toggle **RIP Service** to **Enable**.

### Route Redistribution

Configure which route types are shared with RIP neighbors:

| Field | Description |
|-------|-------------|
| **Redistribute Connected** | Advertise directly connected routes to RIP neighbors. |
| **Redistribute Static** | Advertise static routes to RIP neighbors. |
| **Redistribute Kernel** | Advertise kernel-level routes to RIP neighbors. |

### Neighbors

Add the IP addresses of routers that should exchange RIP routes with this router.

1. Click **Add** under the **Neighbor** section.
2. Enter the neighbor's IPv4 address (e.g., `192.168.1.2`).
3. Repeat for additional neighbors.

### Networks

Define which network segments participate in RIP routing.

1. Click **Add** under the **Network** section.
2. Enter the network in CIDR notation (e.g., `192.168.1.0/24`).
3. Repeat for additional networks.

### Saving

Click **Save** at the bottom of the page to apply all RIP settings at once. The configuration takes effect immediately.

## Verification

1. Navigate to **Policy Engine > RIP**.
2. Confirm the RIP service toggle shows **Enable**.
3. Verify your neighbors and networks are listed.
4. Check the router's routing table (via **Monitoring > Routes** if available) for RIP-learned routes.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Routes not exchanged between neighbors | Neighbor IP is incorrect or unreachable | Verify the neighbor IP address and confirm network connectivity between routers |
| Slow convergence after a link change | RIP converges slowly by design (30-second update interval) | Consider migrating to OSPF or BGP for faster convergence |
| Destination unreachable despite being in the network | Hop count exceeds 15 | Reduce the number of hops or switch to a protocol without a hop-count limit (BGP or OSPF) |

!!! info "See Also"
    - [BGP Configuration](bgp.md) -- Recommended for SD-WAN and multi-site deployments
    - [OSPF Configuration](ospf.md) -- Recommended for internal routing with fast convergence
    - [Static Routes](../04-network/static-routes.md) -- Manual route entries
