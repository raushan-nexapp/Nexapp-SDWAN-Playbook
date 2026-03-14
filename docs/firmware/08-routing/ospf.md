# OSPF (Open Shortest Path First)

!!! note "Standalone & Controller-Managed"
    OSPF can be configured locally on the router or pushed from the controller as a global policy.
    When controller-managed, local changes may be overwritten by the next deployment.

## Overview

OSPF is a link-state routing protocol that computes the shortest path to every destination in the network. It converges faster than distance-vector protocols and scales well within a single autonomous system. NexappOS uses OSPF to distribute routes within the SD-WAN fabric and across local network segments.

Key OSPF concepts:

- **Areas** -- Logical groupings that reduce routing table size and link-state database overhead. Area `0` is the backbone that all other areas must connect to.
- **Cost** -- A metric based on interface bandwidth. Lower cost paths are preferred.
- **Adjacency** -- Two routers that have exchanged their full link-state databases and are in the "Full" state.

Navigate to **Policy Engine > OSPF** to access this feature.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You have a router ID planned (typically a loopback or management IP address).
- You know which network segments and areas to advertise.

## Configuration

### General Settings

1. Navigate to **Policy Engine > OSPF**.
2. Toggle **OSPF** to **Enabled**.
3. Configure the global OSPF settings:

| Field | Description | Required |
|-------|-------------|----------|
| **Router ID** | A unique IPv4 address identifying this router (e.g., `10.0.0.1`). Must be unique within the OSPF domain. | Yes |
| **Redistribute Connected** | Advertise directly connected routes into OSPF. | No |
| **Redistribute Static** | Advertise static routes into OSPF. | No |
| **Redistribute Kernel** | Advertise kernel routes into OSPF. | No |
| **Default Information Originate** | Advertise a default route (`0.0.0.0/0`) to OSPF neighbors. | No |
| **Always Advertise Default** | Advertise the default route even if this router does not have one in its own table. | No |
| **Default Route Metric** | The OSPF metric assigned to the advertised default route. | No |

4. Click **Save**.

### Networks

Define which network segments participate in OSPF routing.

1. Click **Add Network**.
2. Fill in the network form:

| Field | Description | Required |
|-------|-------------|----------|
| **Network** | The network prefix in CIDR notation (e.g., `192.168.1.0/24`). | Yes |
| **Area** | The OSPF area this network belongs to (e.g., `0` for the backbone area). | Yes |
| **Enabled** | Enable or disable this network entry. | Yes |

3. Click **Save**.

!!! tip
    Start with Area `0` (backbone) for simple deployments. Add additional areas only when you need to segment a large network to reduce routing overhead.

### Interface Settings

Fine-tune OSPF behavior on individual interfaces.

1. Click **Add Interface**.
2. Fill in the interface settings form:

| Field | Description | Required |
|-------|-------------|----------|
| **Interface** | Select the network interface (e.g., `lan`, `wan`). | Yes |
| **Cost** | OSPF cost for this interface (default: `10`). Lower cost means higher preference. | No |
| **Network Type** | The OSPF network type. Options: **Broadcast**, **Non-Broadcast**, **Point-to-Point**, **Point-to-Multipoint**. | No |
| **Hello Interval** | Time in seconds between Hello packets (default: `10`). | No |
| **Dead Interval** | Time in seconds before declaring a neighbor dead if no Hello is received (default: `40`). | No |
| **Passive** | Mark this interface as passive (receive routes but do not send Hello packets). Use for LAN-facing interfaces that should not form adjacencies. | No |
| **Enabled** | Enable or disable OSPF on this interface. | Yes |

3. Click **Save**.

## Viewing OSPF Status

The status section at the top of the OSPF page shows:

- **State** -- Running, Stopped, No Neighbors, or Error.
- **Neighbor summary** -- Count of active OSPF adjacencies.

## Verification

1. Navigate to **Policy Engine > OSPF**.
2. Confirm the OSPF status badge shows **Running** or **Active**.
3. Verify the neighbor count matches the expected number of adjacent routers.
4. Check that networks you configured appear in the network table with **Enabled** status.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Adjacency not forming | Hello/Dead interval mismatch between neighbors | Ensure both routers use the same Hello and Dead intervals on the shared link |
| Adjacency not forming | Area mismatch | Verify both routers are configured with the same OSPF area on the shared interface |
| Routes not propagated | Network statement missing or disabled | Add the correct network prefix and area under the **Networks** section |
| MTU mismatch preventing Full state | Different MTU values on the shared link | Set the same MTU on both sides under **Network > Interfaces and Devices > Advanced Settings** |
| High CPU usage from OSPF | Too many routes in a single area | Split the network into multiple OSPF areas to reduce link-state database size |

!!! info "See Also: Controller Manual"
    To configure OSPF policies globally for all devices, see
    [OSPF Policies](../../controller/06-policies/ospf.md) in the Controller Manual.

!!! info "See Also"
    - [BGP Configuration](bgp.md) -- Dynamic routing between autonomous systems
    - [Static Routes](../04-network/static-routes.md) -- Manual route entries
