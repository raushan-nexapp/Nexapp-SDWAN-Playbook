# Mesh Topology

## Overview

In a mesh topology, every device connects directly to every other device. There is no hub — each router establishes peer tunnels to all other routers in the topology. Mesh provides the lowest possible latency between any two sites and eliminates the single point of failure inherent in hub-spoke designs, at the cost of scalability.

## Architecture

```
        ┌──────────────────┐
        │   Site A         │
        │   192.0.2.10     │
        └──────┬───────────┘
              /|\
             / | \
            /  |  \
           /   |   \
┌─────────┴─┐  |  ┌─┴─────────┐
│ Site B    │  |  │  Site C   │
│192.0.2.20 ├──┤──┤192.0.2.30 │
└───────────┘  |  └───────────┘
               │
        ┌──────┴──────┐
        │  Site D     │
        │ 192.0.2.40  │
        └─────────────┘
```

In a 4-device mesh, each device maintains 3 peer tunnels. In an N-device mesh, each device maintains N-1 tunnels and the total number of tunnels in the topology is N × (N-1) / 2.

## When to Use Mesh

Mesh is ideal for:

- **Small deployments (2–10 sites)** where every site needs to communicate with every other site
- **Multi-data center configurations** where latency between DCs is critical
- **Financial or trading networks** where any added hop is unacceptable
- **Disaster recovery pairs** where two sites must communicate directly with no intermediary

## When NOT to Use Mesh

Avoid mesh for large deployments:

| Device Count | Total Tunnels | Complexity |
|---|---|---|
| 5 | 10 | Manageable |
| 10 | 45 | Getting complex |
| 20 | 190 | Challenging |
| 50 | 1,225 | Not recommended |

For more than 20 devices, hub-spoke (optionally with ADVPN) is significantly easier to manage and troubleshoot.

## Device Requirements

All devices in a mesh topology must meet the same requirements:

| Requirement | Detail |
|---|---|
| **Public IP or NAT traversal** | Each device must be able to receive inbound tunnel connections from all peers. Devices behind full-cone NAT or with a public IP work well. Symmetric NAT is not supported for mesh peers. |
| **Adequate CPU for N-1 tunnels** | Each device maintains tunnels to all other peers simultaneously |
| **Consistent firmware version** | All devices in a mesh should run the same NexappOS version to avoid protocol compatibility issues |

## Configuration via Wizard

Select **Mesh** as the topology type in Step 1 of the Topology Wizard. The wizard does not prompt you to select a hub — it asks only for the list of peer devices.

In Step 3, all selected devices are treated as equal peers. There is no hub/spoke role distinction.

The controller assigns tunnel interface IPs sequentially:
- Device 1: First IP in the tunnel range (e.g., `10.100.0.1`)
- Device 2: `10.100.0.2`
- Device N: `10.100.0.N`

Each device receives the full list of peer IPs and establishes tunnels to all of them.

## Traffic Flow

All traffic in a mesh topology flows directly between devices — there is no central aggregation point and no hair-pinning:

```
Client at Site A → Device A tunnel → Direct encrypted tunnel → Device B → Client at Site B
```

This results in the lowest possible latency for site-to-site communication, limited only by the underlying WAN path quality.

## Failover in Mesh

Because there is no hub, the failure of any single device only affects connectivity to that specific site. All other sites continue communicating directly:

- Site A goes offline → Site B can still reach Site C, Site D, etc.
- Recovery: when Site A comes back online, its tunnels to all peers re-establish automatically

This makes mesh inherently more resilient to individual site failures than hub-spoke.

## Multi-WAN in Mesh

Each device in a mesh topology can have multiple WAN members configured. The bonding protocol distributes tunnel traffic across all active WAN links. When a WAN link fails, the SD-WAN daemon automatically redistributes traffic to the remaining links.

Each peer tunnel runs over all configured WAN members, providing both redundancy and load balancing.

## Comparison: Hub-Spoke vs Mesh vs Hub-Spoke with ADVPN

| Attribute | Hub-Spoke | Hub-Spoke + ADVPN | Mesh |
|---|---|---|---|
| Spoke-to-spoke latency | Hub RTT × 2 | Direct (after setup) | Direct |
| Scalability | Up to 200+ spokes | Up to 200+ spokes | Up to ~20 devices |
| Single point of failure | Hub | Hub (for new sessions) | None |
| Complexity | Low | Medium | Low (for small N) |
| Hub bandwidth requirement | High (all traffic) | Medium (control plane only after ADVPN) | None (no hub) |
| Configuration push | Simple | Moderate | Simple |
| Best for | Branch office WAN | Large branch + video/VoIP | Multi-DC, small networks |

## Adding a Device to an Existing Mesh

1. Navigate to **SD-WAN Fabric > [mesh-topology-name] > Settings**
2. Click **Add Device**
3. Select the new device from the registered device list
4. Click **Save and Deploy**

The controller calculates the delta configuration:
- The new device receives the full peer list and establishes tunnels to all existing devices
- All existing devices receive an updated peer list that includes the new device

This is a **delta deployment** — only the new device and the existing devices' peer lists are updated. No full re-deployment is required.

## Removing a Device from a Mesh

1. Navigate to **SD-WAN Fabric > [mesh-topology-name] > Settings**
2. Find the device in the device list and click **Remove**
3. Click **Save and Deploy**

The removed device's tunnel configuration is cleared and all remaining devices' peer lists are updated.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Some peer tunnels Connected, others not | Asymmetric NAT on one device | Check NAT type on the failing peer; symmetric NAT prevents tunnel establishment |
| All tunnels drop after adding a new device | Deployment applied only to the new device | Trigger a full redeploy from **SD-WAN Fabric > [name] > Redeploy All** |
| High CPU on devices as mesh grows | N-1 tunnels per device is CPU-intensive at large N | Reduce mesh size or migrate to hub-spoke with ADVPN for deployments > 10 devices |
| Direct path latency higher than expected | WAN path quality issue | Check per-member RTT in **Devices > [device] > Monitoring > WAN Members** |

!!! info "See Also"
    - [Topology Overview](overview.md) — Topology types and the status model
    - [Topology Wizard](wizard.md) — Create a mesh topology with the guided wizard
    - [Hub & Spoke Setup](hub-spoke.md) — Hub-spoke with ADVPN for larger deployments
    - [Performance SLA](../06-policies/sla.md) — Monitor link health across all mesh peers
