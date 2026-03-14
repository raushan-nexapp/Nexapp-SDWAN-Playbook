# VRF (Virtual Routing and Forwarding)

!!! note "Controller-Managed Only"
    VRF deployment requires controller orchestration. The controller creates VRF instances and pushes
    configurations to routers across the SD-WAN fabric.

## Overview

VRF provides per-tenant network isolation on a single physical router. Each VRF instance maintains its own routing table, so multiple tenants can use overlapping IP address ranges (e.g., `10.0.0.0/24`) on the same device without route conflicts or traffic leaking between them.

VRF is essential for service providers and enterprises hosting multiple customers or departments on shared SD-WAN infrastructure.

Navigate to **Policy Engine > VRF** to access this feature.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router is connected to a controller with VRF support enabled.
- BGP is configured on the router if you plan to use MP-BGP for VRF route exchange.

## Key Concepts

| Term | Description |
|------|-------------|
| **VRF Instance** | An isolated routing domain with its own routing table, interfaces, and policies. |
| **Table ID** | The Linux routing table number assigned to this VRF. Allocated automatically. |
| **Route Distinguisher (RD)** | A unique identifier that distinguishes routes from different VRFs in the BGP control plane. Auto-computed from `ASN:VRF_ID`. |
| **Route Target Import (RT Import)** | Specifies which routes from other VRFs to import into this VRF. Used for shared-services scenarios. |
| **Route Target Export (RT Export)** | Specifies which routes from this VRF to export to other VRFs. |

## Configuration

### Enabling VRF Management

1. Navigate to **Policy Engine > VRF**.
2. Toggle **VRF Management** to **Enabled**.

### Creating a VRF Instance

1. Click **Add VRF**.
2. Fill in the VRF form:

| Field | Description | Required |
|-------|-------------|----------|
| **Name** | A unique name for the VRF instance (e.g., `tenant-a`). | Yes |
| **VRF ID** | A numeric identifier for this VRF. | Yes |
| **Table ID** | The Linux routing table number. Must not conflict with existing tables. | Yes |
| **Route Distinguisher (RD)** | Auto-computed as `ASN:VRF_ID`. You can override if needed. | Yes |
| **RT Import** | Route targets to import (e.g., `65001:100`). Controls inter-VRF route sharing. | Yes |
| **RT Export** | Route targets to export (e.g., `65001:100`). | Yes |
| **Interfaces** | Network interfaces assigned to this VRF. Traffic on these interfaces is isolated within the VRF routing table. | No |

3. Click **Save**.

### Editing a VRF Instance

1. Click the **Edit** button next to the VRF entry.
2. Modify the fields as needed.
3. Click **Save**.

### Deleting a VRF Instance

1. Click the **Delete** button next to the VRF entry.
2. Confirm the deletion. This removes the VRF device, unbinds all assigned interfaces, and deletes the associated BGP configuration.

!!! warning "Data Loss Risk"
    Deleting a VRF removes all associated routing entries and interface bindings. Ensure no active traffic is using the VRF before deleting it.

## VRF Status

The VRF table displays the following status information for each instance:

| Column | Description |
|--------|-------------|
| **State** | `Up` (VRF device exists and is active), `Down` (VRF device exists but is inactive), or `Not Created` (configuration exists but the device has not been created yet). |
| **Routes** | Number of routes currently in this VRF routing table. |
| **BGP** | Whether BGP is configured for this VRF (`Configured` or `-`). |

## Inter-VRF Route Leaking

To share routes between VRFs (for example, to allow all tenants to access a shared DNS or internet gateway VRF):

1. Set the **RT Export** on the shared-services VRF to a well-known value (e.g., `65001:999`).
2. Set the **RT Import** on each tenant VRF to include that value.

Only routes matching the imported route targets are shared. All other routes remain isolated within their respective VRFs.

## Verification

1. Navigate to **Policy Engine > VRF**.
2. Confirm each VRF shows a **State** of **Up**.
3. Verify the **Routes** count is non-zero for active VRFs.
4. Check that **BGP** shows **Configured** if MP-BGP is used for route exchange.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| VRF shows "Not Created" state | The VRF device has not been deployed from the controller yet | Deploy the VRF configuration from the controller |
| Routes leaking between VRFs | RT Import/Export values overlap unintentionally | Review the RT Import and RT Export values on each VRF to ensure only intended route sharing occurs |
| VRF status shows "Unknown" | The router cannot query VRF status | Click **Refresh** and verify the router has the VRF kernel module enabled |

!!! info "See Also: Controller Manual"
    To manage VRF instances and multi-tenancy across the SD-WAN fabric, see
    [VRF Multi-Tenancy](../../controller/08-vrf/overview.md) in the Controller Manual.

!!! info "See Also"
    - [BGP Configuration](bgp.md) -- BGP is used with MP-BGP address families for VRF route exchange
    - [OSPF Configuration](ospf.md) -- OSPF within a VRF for internal routing
