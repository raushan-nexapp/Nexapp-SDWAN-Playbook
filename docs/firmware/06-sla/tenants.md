# Tenant QoS

!!! note "Standalone & Controller-Managed"
    Tenant QoS can be configured locally or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Tenant QoS provides per-subnet bandwidth isolation and fair-share allocation. You define tenants by their LAN subnet, assign a bandwidth limit and priority weight, and the system enforces QoS rules so that each tenant gets its fair share of WAN bandwidth. This prevents a single busy subnet from consuming all available bandwidth and starving other tenants.

Tenant QoS is ideal for multi-tenant environments where multiple organizations, departments, or customer sites share the same SD-WAN connection.

Navigate to **Policy Engine > Performance SLA > Tenants** to manage tenant QoS.

## Prerequisites

- SD-WAN is configured with at least one active overlay and WAN member.
- You know the LAN subnets for each tenant.
- QoS is enabled on the device (see QoS configuration in the SD-WAN Fabric settings).

## Configuration

### Adding a Tenant

1. Navigate to **Policy Engine > Performance SLA > Tenants**.
2. Click **Add Tenant**.
3. Fill in the tenant configuration:

| Field | Description |
|-------|-------------|
| **Tenant Name** | A unique identifier (e.g., `engineering`). Letters, numbers, and underscores only. Not editable after creation. |
| **Subnet (CIDR)** | The LAN subnet for this tenant in CIDR notation (e.g., `10.0.1.0/24`). All traffic from this subnet is classified as belonging to this tenant. |
| **Bandwidth** | The bandwidth limit for this tenant. Format: number followed by unit (e.g., `10mbit`, `1gbit`, `500kbit`). You can set this manually or use the **Recalculate Fair Share** feature. |
| **Priority Weight** | Priority level from `1` to `100`. Higher values receive a larger share of bandwidth during fair-share recalculation. |
| **Status** | Enable or disable the tenant. Disabled tenants have no QoS rules applied. |
| **Description** | (Optional) A descriptive note for this tenant (e.g., "Engineering team subnet"). |

4. Click **Add** to save the tenant.

### Editing and Deleting Tenants

- Click **Edit** on a tenant row to modify its settings (name cannot be changed).
- Click **Delete** to remove a tenant. Confirm the deletion in the dialog. Deleting a tenant also removes its associated steering policy.

### Fair-Share Recalculation

Click **Recalculate Fair Share** to automatically distribute available bandwidth across all enabled tenants based on their priority weights. The system calculates each tenant's share proportionally:

- A tenant with priority `80` gets twice the bandwidth of a tenant with priority `40`.
- The total available bandwidth is derived from the QoS configuration on the device.

After recalculation, a notification shows the allocated bandwidth for each tenant (e.g., "engineering: 15mbit | sales: 10mbit | guest: 5mbit").

!!! tip
    Use fair-share recalculation after adding or removing tenants. You can also override individual tenant bandwidth manually after recalculation.

## How Tenant QoS Works

1. Incoming traffic from LAN subnets is matched to tenants by source IP address.
2. Each tenant's traffic is placed into a dedicated QoS queue with the configured bandwidth limit.
3. When total traffic exceeds the WAN capacity, higher-priority tenants receive their guaranteed bandwidth first.
4. Unused bandwidth from one tenant is available to others (bandwidth sharing).
5. The QoS rules are applied on the WAN egress direction.

## Verification

1. After adding tenants, verify they appear in the tenant list with the correct subnet, bandwidth, and priority.
2. Click **Recalculate Fair Share** and confirm the allocation notification shows reasonable values.
3. Generate traffic from a tenant subnet and verify it is rate-limited according to the configured bandwidth.
4. Verify that traffic from different tenant subnets does not interfere with each other under load.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Tenant QoS not applied | The tenant is disabled, or the QoS subsystem is not running | Verify the tenant status is **Enabled**. Check that QoS is enabled in the SD-WAN Fabric settings. |
| Bandwidth not limited to configured value | The bandwidth format is incorrect or the value is higher than the WAN capacity | Verify the format uses a valid unit (e.g., `10mbit`, not `10mb` or `10`). The bandwidth cannot exceed the actual WAN link speed. |
| Priority weight not affecting distribution | Fair-share recalculation has not been run since changing priorities | Click **Recalculate Fair Share** to recompute bandwidth allocations based on current priority weights. |
| "Invalid format" error on bandwidth field | The bandwidth value does not include a valid unit suffix | Use the format `<number><unit>` where unit is `kbit`, `mbit`, or `gbit` (e.g., `10mbit`). |

!!! info "See Also: Controller Manual"
    To configure tenant QoS globally for all devices, see
    [Tenant Policies](../../controller/06-policies/tenant.md) in the Controller Manual.

!!! info "See Also"
    - [Traffic Steering](traffic-steering.md) -- Steer tenant traffic to specific WAN links
    - [Quality Tiers](quality-tiers.md) -- Define quality profiles for per-tenant SLA
    - [Health Dashboard](health-dashboard.md) -- Monitor WAN link health
    - [Underlay Members](../05-sdwan/underlay-members.md) -- Configure WAN link bandwidth and weights
