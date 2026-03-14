# VRF Configuration

## Overview

VRF configuration on the Nexapp SDWAN Controller defines the routing table parameters for
each tenant: VRF name, Route Distinguisher, and Route Targets. Once defined, you assign
VRF configurations to devices in a topology and deploy — the controller pushes the VRF
definitions to each device automatically.

Navigate to **Policy Engine > VRF Configuration** to manage VRF configurations.

## Prerequisites

Before configuring VRFs:

- The BGP Route Reflector must be enabled and have all topology devices as established
  neighbors. See [BGP Route Reflector Configuration](../07-bgp-rr/configuration.md).
- MP-BGP vpnv4 address family must be enabled on the route reflector. See [MP-BGP
  Integration](mp-bgp.md).
- All target devices must be registered and reachable on ZeroTier.

## Creating a VRF Configuration

1. Navigate to **Policy Engine > VRF Configuration**.
2. Click **Add VRF Config**.
3. Fill in the required fields (described below).
4. Click **Save**.

## VRF Config Fields

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **VRF Name** | Name of the VRF on the device. Short, descriptive, no spaces. | `VRF_ACME` |
| **Route Distinguisher** | Globally unique identifier in `<AS>:<VRF-ID>` format | `65001:100` |
| **Route Target Export** | RT tag attached to routes advertised from this VRF | `65001:100` |
| **Route Target Import** | RT tag required on incoming routes for this VRF to accept them | `65001:100` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Description** | Human-readable label for this VRF | `Acme Corp - Production` |
| **Redistribute Connected** | Import directly connected subnets on VRF-bound interfaces into this VRF | Enabled |
| **Redistribute Static** | Import static routes configured in this VRF | Disabled |
| **OSPF Redistribute** | Redistribute OSPF routes from this VRF into BGP | Disabled |

## Route Distinguisher Format

The RD format is `<AS>:<VRF-ID>`:

- `<AS>` is your BGP Autonomous System number (e.g., `65001`).
- `<VRF-ID>` is a unique integer per tenant (e.g., `100` for tenant A, `200` for tenant B).

Every VRF configuration in your controller must have a **unique RD**. Using the same RD
for two different VRFs causes routing ambiguity in the vpnv4 table.

| Tenant | VRF Name | Route Distinguisher |
|--------|----------|---------------------|
| Acme Corp | `VRF_ACME` | `65001:100` |
| Beta Inc | `VRF_BETA` | `65001:200` |
| Shared Services | `VRF_SHARED` | `65001:999` |

## Route Target Symmetry

For routes to flow between two sites in the same VRF, the RT configuration must be
symmetric:

- Site A exports with RT `65001:100`
- Site B imports routes with RT `65001:100`

Both sites use the same VRF Config object in the controller, so this symmetry is
maintained automatically. You do not need to create separate VRF configs per device.

## Route Leaking Between VRFs

To allow tenant A to reach a shared-services VRF:

1. Create a shared-services VRF with export RT `65001:999`.
2. Edit tenant A's VRF config and add `65001:999` to its **Route Target Import** list
   (multiple RTs are separated by commas: `65001:100, 65001:999`).
3. Redeploy.

Tenant A's devices will now import shared-services routes in addition to their own. Tenant
B remains isolated unless you also add `65001:999` to tenant B's import list.

## Assigning VRF Configs to Devices

After creating VRF configurations, assign them to devices:

1. Navigate to the device detail page (**Devices > [device]**).
2. Click the **VRF** tab.
3. Click **Add VRF Assignment**.
4. Select the VRF Config from the dropdown.
5. Select the LAN interface that carries this tenant's traffic.
6. Click **Save**.

Or, use a Tenant Policy to push VRF assignments globally to all devices in a topology. See
[Tenant Policies](../06-policies/tenant.md).

## Deploying VRF Configuration

After assigning VRF configs to devices:

1. Navigate to **SD-WAN Topology** and open the topology.
2. Click **Deploy All** to push VRF configuration alongside all other settings.
3. Alternatively, use **Policy Engine > VRF Batch Deploy** to push VRF config exclusively
   to all devices without touching other settings.

After deployment, each device creates the named VRF in its kernel routing table.

## Verification

To verify VRF configuration was applied:

1. Navigate to **Devices > [device]**.
2. Click the **VRF** tab — the configured VRFs are listed with their status.
3. A green indicator means the VRF is active on the device.
4. In **Policy Engine > Route Reflector > Monitoring**, vpnv4 prefixes should appear in the prefix table
   for each tenant.

## See Also

- [VRF Overview](overview.md) — Architecture and use cases
- [MP-BGP Integration](mp-bgp.md) — Enable vpnv4 route distribution
- [Batch Deploy](batch-deploy.md) — Push VRF config to all devices at once
- [Tenant Policies](../06-policies/tenant.md) — Manage VRF as a global policy template
