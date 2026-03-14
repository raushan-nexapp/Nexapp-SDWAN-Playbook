# Tenant Policies

## Overview

A tenant policy defines the VRF (Virtual Routing and Forwarding) parameters that the
controller pushes to devices when you deploy a multi-tenant SD-WAN topology. Each tenant
gets a separate, isolated routing table on every router in the topology. Traffic from one
tenant cannot reach another tenant's network unless you explicitly configure route leaking.

Navigate to **Policy Engine > BGP** to manage tenant policies.

## Use Cases

- **Managed Service Provider (MSP)**: Host multiple enterprise customers on a shared
  SD-WAN infrastructure. Each customer sees only their own routes and traffic.
- **Enterprise with security zones**: Separate production, development, and guest traffic
  on the same physical SD-WAN fabric without additional hardware.
- **Regulated industries**: Maintain compliance by preventing data from different
  classifications from ever sharing a routing table.

## Relationship to VRF

A tenant policy creates the VRF definition that is pushed to devices. Each tenant policy
maps to one VRF on each device. For detailed VRF configuration including route distinguishers
and route targets, see [VRF Configuration](../08-vrf/configuration.md).

## Creating a Tenant Policy

1. Navigate to **Policy Engine > BGP**.
2. Click **Add Tenant Policy**.
3. Fill in the fields below.
4. Click **Save**.

## Tenant Policy Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Tenant Name** | Unique name for this tenant (e.g., `acme-corp`, `zone-production`) | Yes |
| **VRF Name** | Name of the VRF on the device — must be unique per device (e.g., `VRF_ACME`) | Yes |
| **Route Distinguisher Prefix** | Base value for auto-generating per-device RDs (e.g., `65001`) | Yes |
| **Route Target Import** | RT that this VRF accepts routes tagged with (e.g., `65001:100`) | Yes |
| **Route Target Export** | RT that this VRF tags its exported routes with (e.g., `65001:100`) | Yes |
| **Global** | Apply this tenant definition to all devices in the topology | Yes |

## Route Distinguisher and Route Target

**Route Distinguisher (RD)** makes each VRF's prefixes globally unique in the MP-BGP
routing table, even when different tenants use the same IP address space. Format:
`<AS>:<VRF-ID>` (e.g., `65001:100` for tenant 100 in AS 65001).

**Route Targets (RT)** control which VRFs import each other's routes. Two VRFs exchange
routes only when the exporting VRF's RT appears in the importing VRF's import list.

For traffic isolation (no sharing between tenants):
- Export RT: `65001:100`
- Import RT: `65001:100` (same value — each VRF only imports its own routes)

For route leaking between two tenants (e.g., shared services):
- Shared-services VRF export RT: `65001:999`
- Tenant A import RT: `65001:100, 65001:999` (imports own routes + shared services)
- Tenant B import RT: `65001:200, 65001:999`

## Traffic Isolation

Once VRFs are deployed, a device maintains completely separate routing tables for each
tenant. A packet arriving on a tenant A WAN link is forwarded only using tenant A's routing
table and exits only on tenant A interfaces. Tenant B's routes are invisible to tenant A.

This isolation is enforced at the routing table level, not by firewall rules. There is no
configuration error that accidentally leaks routes unless you explicitly add a matching RT.

## Deploying Tenant Policies

1. Create tenant policies for each customer/zone.
2. Attach each policy to the topology under **Policy Engine > BGP**.
3. Trigger a deployment — the controller pushes VRF definitions to all devices in the
   topology.
4. Verify: after deployment, each device should show the VRF in its routing table summary.

## Route Leaking (Controlled Sharing)

To allow tenant A to reach a shared-services network (e.g., DNS, NTP at `203.0.113.0/24`):

1. Create a `shared-services` tenant policy with export RT `65001:999`.
2. Add RT `65001:999` to the import list of tenant A's policy.
3. Redeploy.
4. Tenant A can now reach the shared-services prefix; tenant B is unaffected unless you
   also add the RT to tenant B's import list.

## See Also

- [VRF Overview](../08-vrf/overview.md) — Architecture and scalability of VRF multi-tenancy
- [VRF Configuration](../08-vrf/configuration.md) — Detailed VRF field reference
- [MP-BGP Integration](../08-vrf/mp-bgp.md) — How MP-BGP carries VRF routes between sites
- [Global Policy Engine](overview.md) — Policy lifecycle and attachment
