# MP-BGP Integration

## Overview

MP-BGP (Multiprotocol BGP) extends the standard BGP Route Reflector to carry VRF routes
between SD-WAN devices. While standard BGP exchanges global IPv4 routes, MP-BGP adds the
`vpnv4 unicast` address family (RFC 4364) which carries routes tagged with a VPN label and
Route Distinguisher. This enables per-tenant routing isolation across the shared SD-WAN
infrastructure.

## How MP-BGP Carries VRF Routes

1. A NexappOS device (PE router) has one or more VRFs configured, each bound to a tenant
   LAN interface.
2. The device imports the tenant's LAN prefixes into the VRF routing table.
3. The device exports those VRF prefixes to the controller over the `vpnv4` address family,
   tagging each prefix with the VRF's Route Distinguisher and Route Target.
4. The controller receives the vpnv4 NLRI (Network Layer Reachability Information) and
   reflects it to all other devices configured as vpnv4 neighbors.
5. A receiving device checks the Route Target on each incoming vpnv4 route. If the RT
   matches an RT in its local VRF's import list, the route is installed in that VRF.
6. The tenant's prefix is now reachable from the remote site within the same VRF.

```
Site A Device                Controller (RR)              Site B Device
  VRF_ACME                                                  VRF_ACME
  192.0.2.0/24  ──vpnv4──▶  reflect vpnv4  ──vpnv4──▶  192.0.2.0/24 installed
  RD 65001:100               to all                       in VRF_ACME
  RT export: 65001:100       vpnv4 clients                RT import: 65001:100 ✓
```

## Enabling vpnv4 on the Route Reflector

1. Navigate to **Policy Engine > Route Reflector**.
2. In the **Address Families** section, enable **vpnv4 unicast**.
3. Click **Apply Configuration** to reload FRR with the new address family.

The FRRouting configuration will include:

```
address-family vpnv4 unicast
  neighbor 10.0.0.2 activate
  neighbor 10.0.0.2 route-reflector-client
  neighbor 10.0.0.3 activate
  neighbor 10.0.0.3 route-reflector-client
exit-address-family
```

## Enabling vpnv4 per Neighbor

After enabling the address family globally, activate it for each neighbor:

1. In **Policy Engine > Route Reflector**, open a neighbor entry.
2. Enable **vpnv4 Unicast** under Address Families.
3. Confirm **Route Reflector Client** is checked.
4. Click **Save Neighbor**.
5. Repeat for all device neighbors.
6. Click **Apply Configuration**.

## Route Distinguisher and Route Target Recap

| Attribute | Purpose | Format |
|-----------|---------|--------|
| **Route Distinguisher (RD)** | Makes VRF prefixes globally unique in the vpnv4 table | `<AS>:<VRF-ID>` e.g., `65001:100` |
| **Route Target Export (RT-export)** | Tag attached to routes when exported from a VRF | `65001:100` |
| **Route Target Import (RT-import)** | Filter: only import routes with matching RT | `65001:100` |

For routes to flow between two sites:

- Site A export RT must equal Site B import RT.
- Site B export RT must equal Site A import RT.

When both sites use the same VRF Config object from the controller, this symmetry is
guaranteed automatically.

## Verification

After enabling vpnv4 and deploying:

1. Navigate to **Policy Engine > Route Reflector > Monitoring**.
2. Click the **Prefix Table** tab.
3. Switch the address family selector to **vpnv4 unicast**.
4. You should see vpnv4 prefixes from each device, labeled with their RD.

Expected entries for a two-site deployment with two tenants:

| Network | RD | Learned From |
|---------|----|-------------|
| `192.0.2.0/24` | `65001:100` | spoke1 (10.0.0.2) |
| `198.51.100.0/24` | `65001:100` | spoke2 (10.0.0.6) |
| `192.0.2.0/24` | `65001:200` | spoke1 (10.0.0.2) |
| `198.51.100.0/24` | `65001:200` | spoke2 (10.0.0.6) |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| vpnv4 prefixes not appearing in monitoring | vpnv4 address family not enabled on neighbor | Open the neighbor in configuration, enable vpnv4 unicast, and apply configuration |
| Routes not installed in remote VRF | RT mismatch between export and import | Verify that the exporting VRF's Route Target Export matches the importing VRF's Route Target Import exactly |
| Routes appear in controller table but not on device | VRF config not deployed to device | Check deployment history — push may have failed. Redeploy the VRF configuration. |
| Two tenants sharing the same RD | Operator error — duplicate RD | Assign unique RDs to all VRF configs. Use a consistent scheme: `<AS>:<tenant-id>`. |
| Routes from wrong tenant appearing in VRF | Incorrect RT import configuration | Review the import RT list — ensure it contains only the intended tenant's RT |

## RFC Reference

MP-BGP VPN routing is defined in:

- **RFC 4364** — BGP/MPLS IP Virtual Private Networks (IP VPNs)
- **RFC 4760** — Multiprotocol Extensions for BGP-4

NexappOS uses software-based VRF (no MPLS data-plane). Route labels in the vpnv4 control
plane are used for routing table identification, not for MPLS packet forwarding.

## See Also

- [VRF Overview](overview.md) — Architecture and use cases
- [VRF Configuration](configuration.md) — Create VRF definitions and assign to devices
- [Batch Deploy](batch-deploy.md) — Push all VRF configs to the topology at once
- [BGP Route Reflector Configuration](../07-bgp-rr/configuration.md) — Set up the base RR
