# Failover & Recovery

!!! note "Standalone & Controller-Managed"
    Failover happens automatically on the routers. The controller monitors failover events
    and reports status changes.

## Overview

Once high availability is configured, failover protection runs continuously. If the primary router becomes unreachable, the secondary router detects the failure through heartbeat monitoring and automatically takes over all network services. This page explains how failover works, how to manage the interfaces under HA control, and how to perform manual recovery.

Navigate to **HA > High Availability > Managed Interfaces** to manage which interfaces participate in HA failover.

## How Failover Works

1. **Heartbeat monitoring** -- The primary and secondary routers exchange heartbeat messages on the dedicated HA interface. If the secondary does not receive a heartbeat within the dead interval, it declares the primary as failed.
2. **Virtual IP takeover** -- The secondary router claims the virtual IP addresses that clients use as their gateway. This happens transparently -- client devices do not need to change their configuration.
3. **Service activation** -- All synchronized services (SD-WAN, routing, VPN, firewall, etc.) activate on the secondary router using the configuration replicated from the primary.
4. **Traffic resumes** -- Within seconds of detection, the secondary router handles all network traffic previously managed by the primary.

!!! note
    The failover time depends on the heartbeat dead interval. Typical failover completes within 3-10 seconds after the primary becomes unreachable.

## Managed Interfaces

The **Managed Interfaces** tab lets you control which network interfaces are included in HA failover.

### Interface Table

Each managed interface displays:

| Column | Description |
|--------|-------------|
| **Name** | The interface name (e.g., `lan`, `wan`). |
| **Device** | The underlying physical device. |
| **Primary IP** | The IP address of this interface on the primary router. |
| **Secondary IP** | The IP address of this interface on the secondary router. |
| **Virtual IP** | The shared virtual IP that floats between primary and secondary during failover. |
| **Aliases** | Additional virtual IP addresses assigned to this interface. |

### Adding a Managed Interface

1. Navigate to **HA > High Availability > Managed Interfaces**.
2. Click **Add Interface**.
3. Fill in the form:

| Field | Description | Required |
|-------|-------------|----------|
| **Interface** | Select an unmanaged interface to add to HA. | Yes |
| **Primary IP** | The IP address on the primary node for this interface. | Yes |
| **Secondary IP** | The IP address on the secondary node for this interface. | Yes |
| **Virtual IP** | The shared virtual IP address that clients use as their gateway. | Yes |

4. Click **Save**.

### Removing a Managed Interface

1. Click the **Delete** button next to the interface.
2. Confirm the removal. The interface stops participating in HA failover but remains active on the router.

### Adding Aliases

You can add extra virtual IP addresses to a managed interface (for example, to serve multiple subnets through a single interface).

1. Click the **Edit** button on the managed interface.
2. Add one or more **Alias** IP addresses.
3. Click **Save**.

## Force Actions

The following actions are available from the **Overview** tab:

| Action | When to Use |
|--------|-------------|
| **Force Sync** | After making configuration changes on the primary that you want immediately pushed to the secondary. Normally, sync happens automatically. |
| **Stop Service** | To temporarily pause HA failover for maintenance (e.g., firmware upgrade on the secondary). Both routers continue running independently. |
| **Start Service** | To re-enable HA failover after maintenance. |
| **Reset Configuration** | To completely tear down the HA cluster and return both routers to standalone mode. |

!!! warning
    Stopping the HA service disables failover protection. If the primary fails while the
    service is stopped, the secondary will NOT take over automatically.

## Recovery After Failover

When the original primary router comes back online after a failover:

1. **Non-preemptive mode (default)** -- The secondary continues as Master. The recovered primary joins as Backup. No automatic switchback occurs. This prevents flapping if the primary has an intermittent issue.
2. **Preemptive mode** -- The recovered primary reclaims the Master role automatically. The secondary returns to Backup. This is not the default behavior.

To manually switch roles after recovery:

1. Navigate to **HA > High Availability** on the current Master (the secondary that took over).
2. Click **Force Sync** to ensure both nodes have identical configuration.
3. Click **Stop Service** on the current Master, then **Start Service** on the desired Master.

!!! tip
    After a failover event, always investigate why the primary failed before switching it
    back to the Master role. Check power, network cables, and system logs.

## Verification

1. Navigate to **HA > High Availability > Managed Interfaces**.
2. Confirm all expected interfaces are listed with correct Primary IP, Secondary IP, and Virtual IP.
3. From a client device, ping the Virtual IP and verify it responds.
4. Test failover by disconnecting the primary router's WAN cable and confirming the Virtual IP remains reachable.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Failover does not trigger when primary goes down | The heartbeat interface is still up (only the WAN failed) | Ensure the WAN interface is included in the monitored interfaces so its failure triggers failover |
| Services not synced after failover | Configuration synchronization was interrupted before the failure | Log in to the new Master and click **Force Sync** to push the latest configuration |
| Both routers active simultaneously (split-brain) | The heartbeat link is down but both routers can still reach clients | Restore the physical heartbeat connection immediately, then click **Force Sync** on the Master |
| Recovered primary does not rejoin as Backup | The HA service was reset or the configuration was lost during the outage | Re-run the setup wizard from the current Master to re-establish the cluster |
| Virtual IP not responding after failover | The interface or virtual IP was not added to managed interfaces | Add the interface and virtual IP under the **Managed Interfaces** tab |

!!! info "See Also"
    - [High Availability Overview](overview.md) -- HA concepts, status dashboard, and service sync
    - [VRRP Setup](vrrp.md) -- Run the setup wizard to establish or re-establish the cluster
    - [DC/DR Failover](../14-dcdr/overview.md) -- Controller-level failover between data centers
