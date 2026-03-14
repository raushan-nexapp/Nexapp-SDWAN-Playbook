# BGP Route Reflector Configuration

## Overview

This page guides you through configuring the FRRouting-based BGP Route Reflector on the
Nexapp SDWAN Controller. Configuration is split into two areas: the Route Reflector global
settings (AS, listen range, cluster ID) and the per-neighbor entries for each device that
will peer with the controller.

Navigate to **Policy Engine > Route Reflector** to access these settings.

## Prerequisites

Before starting:

- FRRouting is installed and the `frr` service is running on the controller server.
- All NexappOS devices are registered in the controller.
- ZeroTier management network is active (devices have IPs in the `10.0.0.0/24` range or
  your configured management subnet).
- TCP port 179 is allowed between the controller's ZeroTier IP and each device's ZeroTier IP.

Verify FRR is running on the controller server:

```
systemctl status frr
```

## Step 1: Configure Global Route Reflector Settings

1. Navigate to **Policy Engine > Route Reflector**.
2. Click **Edit Global Settings**.
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Local AS** | The ASN for the controller's BGP process. All device peers must use this or a compatible AS. | `65000` |
| **Router ID** | A unique IPv4 identifier for the RR — use the controller's ZeroTier IP. | `198.51.100.1` |
| **Listen Range** | ZeroTier subnet — the controller accepts BGP connections from any IP in this range. | `10.0.0.0/24` |
| **Neighbor Password** | Optional MD5 password applied to all neighbors (must match on devices). | `S3cur3P@ssw0rd` |
| **Max Prefixes** | Global maximum prefixes the RR will accept from any single peer. | `1000` |
| **Cluster ID** | Route Reflector cluster identifier — set to the controller's ZeroTier IP. | `198.51.100.1` |

4. Click **Save Global Settings**.

## Step 2: Add Device Neighbors

Add a neighbor entry for each NexappOS device that will peer with the route reflector.

1. Click **Add Neighbor**.
2. Fill in the neighbor form:

| Field | Description | Example |
|-------|-------------|---------|
| **Device** | Select the device from the registered device list | `spoke1-branch-office` |
| **Neighbor IP** | Device's ZeroTier IP address | `10.0.0.2` |
| **Remote AS** | ASN configured on the device. For iBGP, use the same AS as the RR. | `65000` |
| **Description** | Optional human-readable label | `Spoke 1 - Mumbai Office` |
| **Route Reflector Client** | Enable this — marks the neighbor as an RR client so routes are reflected to all other clients | Yes |
| **Next Hop Self** | Force the controller to set itself as next hop when reflecting routes | Recommended |

3. Click **Save Neighbor**.
4. Repeat for each device in the topology.

## Step 3: Configure Redistribution (Optional)

If you want the controller to advertise its own management prefixes (e.g., the ZeroTier
subnet itself), enable redistribution:

1. In the global settings, enable **Redistribute Connected**.
2. This announces the controller's ZeroTier interface subnet to all BGP clients.

Use a prefix list to limit which connected routes are redistributed:

1. Under **Prefix Lists**, click **Add Prefix List**.
2. Create a permit entry for the management subnet only (e.g., permit `10.0.0.0/24`).
3. Attach the prefix list to the redistribution filter.

## Step 4: Apply Configuration

After saving all settings:

1. Click **Apply Configuration** at the top of the BGP Route Reflector page.
2. The controller writes the updated FRR configuration and reloads the routing daemon.
3. A confirmation banner indicates whether the reload succeeded.
4. Navigate to **Policy Engine > Route Reflector > Monitoring** to verify neighbors reach **Established**
   state. This typically takes 30–60 seconds.

## Adding Devices After Initial Setup

When you add a new spoke to an existing topology:

1. Go to **Policy Engine > Route Reflector**.
2. Click **Add Neighbor** and fill in the new device's ZeroTier IP and AS.
3. Click **Apply Configuration**.
4. The new device establishes its BGP session to the controller.
5. The controller automatically reflects the new device's routes to all existing clients.

No changes are required on the existing spoke devices.

## Removing a Neighbor

1. In the neighbor list, click the trash icon next to the neighbor.
2. Click **Apply Configuration** to reload FRR.
3. The session is terminated and the device's routes are withdrawn from the route table.

## Verification

After applying configuration, verify the setup:

1. Navigate to **Policy Engine > Route Reflector > Monitoring**.
2. All configured neighbors should show **Established** status.
3. Prefix counts should be non-zero (each device should be advertising its LAN prefixes).

If a neighbor shows **Active** state, see [BGP Route Reflector Monitoring](monitoring.md)
for troubleshooting guidance.

## See Also

- [BGP Route Reflector Overview](overview.md) — Architecture and how the RR works
- [BGP Route Reflector Monitoring](monitoring.md) — Session states, prefix table, diagnostics
- [VRF MP-BGP Integration](../08-vrf/mp-bgp.md) — Extend BGP RR for multi-tenant routing
