# HA Configuration

## Overview

This page walks through the complete process of configuring a VRRP high-availability pair on the controller. After completing these steps, two physical routers at the same site will share a Virtual IP and fail over automatically if the primary router fails.

Navigate to **High Availability > HA Devices** to manage HA pairs.

## Prerequisites

Before you begin:

- Both routers must be registered in the controller under the same organization. See [Device Registration](../03-devices/registration.md).
- Both routers must be online and reachable from the controller.
- A Virtual IP address must be available in the LAN subnet (not already assigned to any device).
- A dedicated Ethernet cable must be connected directly between one physical interface on each router — this will be the heartbeat link.
- Both routers must be running the same firmware version.

## Step 1: Add an HA Device Pair

1. Navigate to **High Availability > HA Devices**.
2. Click **Add HA Device**.
3. Fill in the form:

| Field | Description |
|-------|-------------|
| **Pair Name** | A descriptive name for this HA pair (e.g., "Mumbai-HQ-HA") |
| **Primary Device** | Select the router that will be the active primary |
| **Backup Device** | Select the router that will stand by in passive mode |
| **Virtual IP** | The shared IP address that LAN clients will use as their gateway |
| **Virtual IP Subnet** | The subnet mask for the Virtual IP (e.g., /24) |
| **VRRP Group ID** | A unique ID for this VRRP instance (1–255). Use a different ID for each HA pair in the same L2 domain |

4. Click **Next** to proceed to interface mapping.

## Step 2: Map Interfaces

Interface mapping tells the controller which interface on the backup corresponds to each interface on the primary. This is required for service synchronization and Virtual IP assignment.

| Primary Interface | Backup Interface | Purpose |
|------------------|-----------------|---------|
| LAN (e.g., eth0) | LAN (e.g., eth0) | Virtual IP assigned here |
| WAN 1 (e.g., eth1) | WAN 1 (e.g., eth1) | WAN interface for SD-WAN tunnel |
| Heartbeat (e.g., eth2) | Heartbeat (e.g., eth2) | VRRP heartbeat — direct cable between nodes |

For each interface on the primary, select the corresponding interface on the backup from the dropdown. At minimum, you must map the LAN interface (where the Virtual IP lives) and the heartbeat interface.

Click **Next** after completing the mappings.

## Step 3: Configure VRRP Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Primary Priority** | 100 | VRRP election priority for the primary node. Higher number wins. |
| **Backup Priority** | 90 | VRRP election priority for the backup node. Must be lower than primary. |
| **Advertisement Interval** | 1 second | How often the primary sends VRRP heartbeat messages |
| **Preemption** | Enabled | When enabled, the original primary reclaims the primary role automatically after recovering from a failure |
| **Preemption Delay** | 30 seconds | Wait time before preemption occurs — allows services to fully start on the recovering node |

In most deployments, use the defaults. Disable Preemption if you prefer the backup to remain primary after a failover (manual promotion preferred for controlled maintenance).

Click **Next**.

## Step 4: Review and Save

Review the configuration summary:

- Pair name and device selection
- Virtual IP and subnet
- Interface mappings
- VRRP parameters

Click **Save and Deploy**. The controller pushes the HA configuration to both devices. Initial synchronization takes approximately 30–60 seconds.

## Verifying the Configuration

After saving:

1. Navigate to **High Availability > HA Devices**.
2. Find the new HA pair in the list.
3. Verify the **State** column shows **Normal**.
4. Click the pair name to open its detail page.
5. Confirm:
   - **Primary Device** shows **Master**
   - **Backup Device** shows **Backup**
   - **Last Sync** shows a timestamp within the last 2 minutes

To verify the Virtual IP is active:

1. From a LAN client at the site, run: `ping 192.0.2.1` (replace with your Virtual IP).
2. The ping should succeed and reply from the Virtual IP.

## Testing Failover

To verify failover works correctly before putting the pair into production:

1. Ensure both nodes are in Normal state.
2. Click **Force Sync** in the pair's detail page to ensure all configuration is up to date on the backup.
3. Physically disconnect the primary router's power or LAN cable — or, for a less disruptive test, click **Simulate Failover** in the pair detail page.
4. Within 3–5 seconds, the backup should promote itself to primary.
5. Verify that LAN clients can still ping the Virtual IP and that SD-WAN tunnels re-establish on the backup.
6. Restore the primary router. If Preemption is enabled, it reclaims the primary role after the preemption delay.

## Managing an Existing HA Pair

From the HA pair detail page, the following actions are available:

| Action | Description |
|--------|-------------|
| **Sync Now** | Push all current configuration from primary to backup immediately |
| **Force Failover** | Manually promote backup to primary (primary gracefully steps down) |
| **Edit Configuration** | Modify interface mappings or VRRP parameters |
| **Disable HA** | Pause HA protection without removing configuration — useful during firmware upgrades |
| **Delete Pair** | Remove the HA pair entirely; both routers revert to standalone mode |

!!! warning
    Clicking **Delete Pair** removes all HA configuration from both routers. The Virtual IP is released. LAN clients will need to be reconfigured to use the primary router's physical LAN IP as their gateway.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| "Save and Deploy" fails with "Device unreachable" | One or both routers offline | Verify both devices show Online status in **Devices** before creating the HA pair |
| State shows "Sync Error" immediately after creation | SSH or network connectivity issue between nodes | Verify both routers can reach each other on the heartbeat interface; check firewall rules |
| Backup does not take over after primary disconnected | Heartbeat interface not mapped or physically disconnected | Verify the heartbeat interface mapping and confirm the direct cable is in place |
| Preemption not happening after recovery | Preemption disabled or preemption delay too long | Check VRRP parameters in the pair settings and verify Preemption is enabled |
| Virtual IP not responding on LAN | Virtual IP not in the same subnet as LAN | Verify the Virtual IP and subnet mask match the LAN network prefix |

!!! info "See Also"
    - [HA Overview](overview.md) — How the two HA layers work
    - [DC/DR Failover](dcdr-failover.md) — Controller-level failover between data centers
    - [Router HA Wizard](../../firmware/09-ha/vrrp.md) — Set up HA from the router web UI
