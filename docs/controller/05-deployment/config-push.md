# Configuration Push

## Overview

Configuration push is the operation that sends settings from the controller to one or more
NexappOS devices. The controller connects to each target device over the ZeroTier management
network, applies the pending configuration, and confirms the result.

A push can be triggered from multiple places in the UI depending on whether you want to
update a single device or an entire topology.

## What Gets Pushed

A full push sends all active settings for a device:

- SD-WAN overlay settings (role, hub IP, tunnel address, encryption, WAN members)
- BGP and OSPF routing configuration
- QoS policy (interface, class maps, policy maps)
- SLA thresholds and path monitor settings
- Traffic steering rules
- VRF definitions (if multi-tenancy is enabled)

A delta push sends only the settings that changed since the last successful deployment.
The controller calculates the diff automatically — you do not need to track changes manually.

## Push Modes

| Mode | When to Use |
|------|-------------|
| **Full Push** | Initial provisioning of a new device, or after a factory reset |
| **Delta Push** | Routine policy updates, adding a new WAN member, changing QoS weights |

Delta push is the default for all deployments after the initial provisioning.

## Pushing from a Topology

To push configuration to every device in a topology:

1. Navigate to **SD-WAN Topology** in the left menu.
2. Click the topology name to open the detail view.
3. Click **Deploy All** in the top-right toolbar.
4. Review the pre-push validation summary. If there are errors, correct the flagged settings
   before continuing.
5. Click **Confirm Deploy** to queue the deployment.
6. Watch the device status indicators — each device cycles through Pending → Running →
   Success (or Failed) as workers process the queue.

## Pushing to a Single Device

To push configuration to one device:

1. Navigate to **Devices** in the left menu.
2. Click the device name to open the device detail page.
3. Click the **Configuration** tab.
4. Click **Push Now**.
5. Confirm the action in the dialog.

The device detail page refreshes automatically when the push completes.

## Manual Push from Topology Device View

You can also push to an individual device directly from the topology map:

1. Open the topology detail page.
2. Click the device node on the topology diagram.
3. In the device sidebar that appears, click **Push Config**.

This pushes only to that device using a delta from its last successful deployment.

## Pre-Push Validation

Before the push begins, the controller runs a validation pass:

| Check | Description |
|-------|-------------|
| **Reachability** | Device must be reachable on ZeroTier (ping responds within 3 seconds) |
| **Config completeness** | Hub IP, tunnel address, and at least one WAN member must be set |
| **IP conflict** | Tunnel addresses must be unique across all devices in the topology |
| **Policy references** | All referenced SLA profiles, QoS policies, and BGP configs must exist |

If any check fails, the push is blocked and an error message lists the failing checks.

## Verifying a Successful Push

After the push completes:

1. The device status badge in the topology view turns **green**.
2. The **Last Deployed** timestamp on the device detail page updates.
3. Navigate to **SD-WAN Fabric > Deploy History** to see the full record including the configuration
   diff and duration.
4. For connectivity verification, ping a remote subnet through the overlay tunnel.

Devices typically confirm the applied configuration within 60 seconds of a successful push.
If the status badge remains **Running** after 2 minutes, check the history log for timeout
errors and verify ZeroTier connectivity to the device.

## Bulk Push Considerations

When deploying to a large topology (20+ devices):

- Workers process devices in parallel; most topologies complete within 60 seconds.
- If the controller has 3 background workers, up to 3 devices deploy simultaneously.
- A failed device does not block or cancel pushes to other devices.
- Use **SD-WAN Fabric > Deploy History** to review per-device results after a bulk push.

## See Also

- [Deployment Pipeline](pipeline.md) — Understand the five pipeline stages
- [Deployment History](history.md) — Review push records and roll back if needed
- [Global Policies](../06-policies/overview.md) — Configure policies before pushing
