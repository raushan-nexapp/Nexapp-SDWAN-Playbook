# Underlay Members (WAN Links)

!!! note "Standalone & Controller-Managed"
    You can add and manage WAN members locally or push member configuration from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Underlay members are the physical WAN links that carry SD-WAN tunnel traffic. Each member binds a network interface to the bonding protocol with its own port, weight, and priority settings. The bonding protocol distributes packets across active members using weight-based load balancing and falls back to lower-priority links when higher-priority links fail.

Navigate to **Network > SD-WAN Fabric > Members** to manage WAN links.

## Prerequisites

- The overlay tunnel is configured (see [Overlay Tunnels](overlay-tunnels.md)).
- You have at least one WAN interface with internet connectivity (see [Interfaces](../04-network/interfaces.md)).
- You know the interface names of your WAN connections (e.g., `wan`, `wan2`).

## Configuration

### Adding a WAN Member

1. Navigate to **Network > SD-WAN Fabric > Members**.
2. Click **Add Member**.
3. Fill in the member configuration:

| Field | Description |
|-------|-------------|
| **Section Name** | A unique identifier for this member (e.g., `wan1`). Letters, numbers, and underscores only. |
| **Interface** | The network interface to use for this WAN link. Select from the dropdown or enter the interface name manually (e.g., `wan`, `WAN2`). |
| **Gateway** | (Optional) Override the default gateway for this WAN link (e.g., `192.168.1.1`). Leave empty to use the interface's configured gateway. |
| **Port** | UDP port for bonding tunnel traffic. Default is `5511`. Each member must use a unique port. Valid range: `1024`--`65535`. |
| **Weight** | Traffic share for load balancing (`1`--`100`). Higher weight means more traffic is routed through this link. For Dual Standby mode, set weight to `0` for the standby link. |
| **Priority** | Failover priority (`1`--`255`). Lower values are preferred. Links with the same priority share traffic by weight; higher-priority (higher number) links are used only when all lower-priority links are down. |
| **Cost** | Link cost metric (`0`--`255`). Used by routing decisions to prefer lower-cost paths. |
| **Zone** | Assign the member to the `Underlay` or `Overlay` zone for firewall purposes. |
| **Status** | Enable or disable the member. Disabled members do not carry traffic. |

4. Click **Add Member** to save.

### MPLS + Internet Mode Fields

When the WAN mode is set to **MPLS + Internet**, two additional fields appear:

| Field | Description |
|-------|-------------|
| **Link Type** | Classify this link as `Internet` or `MPLS`. The bonding protocol uses this tag for traffic steering decisions. |
| **Hub Destination IP** | (Optional) Override the hub IP for this specific link. Useful when the hub has different IPs on the MPLS and internet networks. |

### Editing a Member

1. Click **Edit** on the member row.
2. Modify the fields as needed. The section name cannot be changed after creation.
3. Click **Save**.

### Deleting a Member

1. Click **Delete** on the member row.
2. Confirm the deletion in the dialog.

!!! warning
    Deleting the last member will stop the SD-WAN bonding daemon. The overlay tunnel will go down until you add a new member.

## Weight-Based Load Balancing

The bonding protocol distributes packets across members proportional to their weight values. For example:

- `wan1` with weight `70` and `wan2` with weight `30` results in approximately 70% of packets using `wan1`.
- Equal weights (e.g., `50`/`50`) distribute traffic evenly across both links.
- In Dual Standby mode, set the standby link's weight to `0`. It will only activate when the primary link fails.

## Verification

1. Navigate to **Network > SD-WAN Fabric > Members** and confirm all members show a green status indicator.
2. Check that the correct interface and port are listed for each member.
3. Navigate to **Policy Engine > Performance SLA** to verify per-link health metrics.
4. Run a speed test or bandwidth test to confirm traffic is distributed across members.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Member shows "Down" | The WAN interface has no connectivity or the interface name is incorrect | Verify the interface has an IP address and can reach the internet. Check the interface name matches the configured WAN interface exactly. |
| Traffic not balanced across members | Weights are not configured proportionally, or one member has much higher priority | Adjust weights to reflect the desired traffic distribution. Ensure both members have the same priority value. |
| "Port already in use" error | Another member is using the same UDP port | Assign a unique port to each member (e.g., `5511`, `5512`, `5513`). |
| Member added but tunnel still down | Overlay is not configured or PSK is missing | Configure the overlay tunnel first (see [Overlay Tunnels](overlay-tunnels.md)) and ensure a PSK is set. |

!!! info "See Also: Controller Manual"
    To configure WAN members globally using the topology wizard, see
    [Topology Wizard](../../controller/04-topology/wizard.md) in the Controller Manual.

!!! info "See Also"
    - [Overlay Tunnels](overlay-tunnels.md) -- Configure the SD-WAN overlay
    - [SD-WAN Fabric Overview](overview.md) -- Architecture and WAN modes
    - [Traffic Steering](../06-sla/traffic-steering.md) -- Steer traffic based on link quality
