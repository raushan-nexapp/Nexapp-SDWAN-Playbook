# VRF Batch Deploy

## Overview

VRF Batch Deploy pushes VRF configuration to every device in a topology simultaneously.
Rather than deploying VRF changes as part of a full topology deployment, batch deploy lets
you update tenant routing tables in isolation — useful when you need to add a new VRF or
update Route Targets without touching SD-WAN overlay or QoS settings.

Navigate to **Policy Engine > VRF Batch Deploy** to access this feature.

## When to Use Batch Deploy

| Scenario | Recommended Action |
|----------|--------------------|
| Adding a new tenant to an existing topology | Use Batch Deploy to push new VRF definition to all devices without a full overlay redeploy |
| Updating Route Targets after a tenant restructure | Use Batch Deploy — changes VRF config only |
| Initial topology provisioning | Use the standard full topology deploy, which includes VRF config |
| Modifying SD-WAN overlay or QoS alongside VRF changes | Use the standard topology Deploy All |

## Prerequisites

Before running a batch deploy:

- All VRF configurations you want to push must be created and saved in **Policy Engine > VRF Configuration**.
- VRF configs must be assigned to the appropriate devices (either per-device assignment or via a Tenant Policy).
- All target devices must be reachable on the ZeroTier management network.
- The BGP Route Reflector must be running and vpnv4 must be enabled. See [MP-BGP Integration](mp-bgp.md).

## Running a Batch Deploy

1. Navigate to **Policy Engine > VRF Batch Deploy**.
2. Select the **Topology** to deploy VRF configuration to.
3. Optionally, expand the device list and deselect specific devices to exclude them from
   this batch.
4. Review the **VRF Config Summary** — a table showing which VRF configs will be pushed to
   which devices.
5. Click **Deploy VRF Config**.
6. Monitor the progress table — each device shows Pending → Running → Success or Failed.

## Batch Deploy Progress

The progress view shows one row per device in the topology:

| Column | Description |
|--------|-------------|
| **Device** | Device name |
| **VRFs** | Number of VRF configs being pushed to this device |
| **Status** | Pending, Running, Success, Failed |
| **Duration** | Time elapsed for this device |
| **Details** | Link to the per-device deployment log |

The batch deploy completes when all devices reach a terminal state (Success or Failed).
Failed devices retain their previous VRF configuration.

## Verifying After Batch Deploy

After the batch deploy completes:

1. Navigate to **Policy Engine > Route Reflector > Monitoring**.
2. Click the **Prefix Table** tab and switch to **vpnv4 unicast**.
3. Verify that vpnv4 prefixes from each device are present in the route reflector table.
4. For each tenant VRF, confirm that both the local and remote site prefixes appear.

To verify isolation between tenants:

- From a device in VRF A, ping a destination in VRF B's subnet — the ping should fail with
  "No route to host" (not timeout), confirming the routing tables are isolated.
- From a device in VRF A, ping a destination in VRF A on a remote device — the ping should
  succeed, confirming the VRF route was distributed correctly.

## Rolling Back

If a batch deploy introduces a routing issue:

1. Navigate to **SD-WAN Fabric > Deploy History**.
2. Locate the batch deploy record.
3. Click **Re-deploy** on the last known-good deployment to restore the previous VRF config.

The rollback re-pushes the VRF configuration from the selected historical snapshot. See
[Deployment History](../05-deployment/history.md) for details.

## Partial Failures

If some devices succeed and others fail:

1. Review the failed device logs in the batch deploy progress view.
2. Common causes: device unreachable, ZeroTier connection dropped, VRF name conflict.
3. Resolve the issue (e.g., ensure the device is back online).
4. Click **Retry Failed** to re-run the push for failed devices only. Successful devices
   are not touched again.

## Batch Deploy vs Full Deploy

| Feature | Batch VRF Deploy | Full Topology Deploy |
|---------|-----------------|---------------------|
| Pushes VRF config | Yes | Yes |
| Pushes overlay settings | No | Yes |
| Pushes QoS policies | No | Yes |
| Pushes BGP/OSPF policies | No | Yes |
| Speed (VRF changes only) | Faster | Slower |
| Risk of disrupting overlay | None | Low (delta push) |

Use batch deploy when you are confident the only change is VRF-related. Use a full topology
deploy when multiple configuration areas changed simultaneously.

## See Also

- [VRF Overview](overview.md) — Architecture and use cases
- [VRF Configuration](configuration.md) — Create and assign VRF configs
- [MP-BGP Integration](mp-bgp.md) — Enable vpnv4 route distribution
- [Deployment History](../05-deployment/history.md) — Audit trail and rollback
