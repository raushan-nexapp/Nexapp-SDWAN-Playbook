# High Availability

!!! note "Standalone & Controller-Managed"
    High availability can be configured locally on the router or monitored remotely through the
    controller's REST API. When controller-managed, HA status is visible in the controller dashboard.

## Overview

High Availability (HA) protects your network against router failure by pairing two identical NexappOS routers in an active/passive cluster. If the primary router fails, the secondary router automatically takes over within seconds -- keeping your network online without manual intervention.

Navigate to **HA > High Availability** to access this feature.

## How It Works

The HA cluster consists of two routers:

- **Primary (Master)** -- Actively handles all network traffic. Configuration changes are made on this node.
- **Secondary (Backup)** -- Stands by in a passive state. Receives synchronized configuration from the primary and takes over automatically if the primary becomes unreachable.

Both routers share one or more **virtual IP addresses (VIPs)**. Client devices use the virtual IP as their gateway. When failover occurs, the secondary router claims the virtual IP and begins processing traffic transparently.

## Synchronized Services

When you configure HA, the system automatically synchronizes configuration between the primary and secondary routers. The following service categories are kept in sync:

- **SD-WAN** -- Bonding tunnels, overlay configuration, WAN member settings
- **Routing** -- BGP, OSPF, and static route configurations
- **VPN** -- IPsec, OpenVPN, and WireGuard tunnels
- **Security** -- Firewall rules, DPI settings, threat shield, QoS policies
- **Network** -- Interface settings, DNS, DHCP, DDNS
- **System** -- NTP, logging, certificates, scheduled tasks

!!! note
    The secondary router maintains its own independent connection to the controller and its own management network identity. This ensures the backup node remains reachable and can register independently if the primary is down.

## Prerequisites

- Two NexappOS routers with **identical hardware** (same CPU, NICs, storage).
- Both routers connected to the same broadcast domain via a network switch.
- A dedicated physical LAN interface available for heartbeat communication between nodes.
- Both routers running the same firmware version.

## HA Status Dashboard

Once HA is configured, the **Overview** tab displays four status cards:

| Card | Description |
|------|-------------|
| **High Availability Service** | Shows whether the HA service is Enabled or Disabled. |
| **Primary Node** | Displays the role (Master/Backup) and service status of this router. |
| **Secondary Node** | Displays the role and status of the partner router. Shows "Offline" if the secondary is unreachable. |
| **Synchronization** | Shows the last sync status (Up to Date, Successful, or error details) and timestamp. |

## Available Actions

From the **Overview** tab, you can perform the following actions:

| Action | Description |
|--------|-------------|
| **Force Sync** | Immediately synchronize all configuration to the secondary node. |
| **Stop Service** | Temporarily disable HA failover protection. Both routers continue running but failover is paused. |
| **Start Service** | Re-enable HA failover after it was stopped. |
| **Reset Configuration** | Remove all HA configuration from both nodes. This is a destructive action. |

!!! warning "Data Loss Risk"
    Resetting HA configuration removes all HA settings from both routers. You will need to
    re-run the setup wizard to re-establish the cluster.

## Verification

1. Navigate to **HA > High Availability**.
2. Confirm the **High Availability Service** card shows **Enabled**.
3. Verify the **Primary Node** shows **Master** and the **Secondary Node** shows **Backup**.
4. Check the **Synchronization** card shows **Up to Date** with a recent timestamp.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Secondary node shows "Offline" | The secondary router is powered off or unreachable | Verify the secondary router is powered on and connected to the same network |
| Synchronization shows "SSH Failed" | SSH connectivity between nodes is broken | Verify network connectivity between the primary and secondary, and confirm SSH credentials are correct |
| HA service is Disabled after reboot | The service was stopped manually before the reboot | Click **Start Service** to re-enable HA |
| Both nodes show "Master" (split-brain) | The heartbeat link between nodes is down | Restore the physical connection on the dedicated heartbeat interface between both routers |

!!! info "See Also: Controller Manual"
    To manage high availability from the controller, see
    [HA Management](../../controller/12-ha/overview.md) in the Controller Manual.

!!! info "See Also"
    - [VRRP Setup](vrrp.md) -- Run the setup wizard to establish the HA cluster
    - [Failover & Recovery](failover.md) -- Understand failover behavior and manual recovery
    - [DC/DR Failover](../14-dcdr/overview.md) -- Controller-level failover between data centers
