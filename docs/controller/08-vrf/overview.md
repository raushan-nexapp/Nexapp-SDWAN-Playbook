# VRF Multi-Tenancy Overview

## Overview

VRF (Virtual Routing and Forwarding) multi-tenancy lets you run multiple isolated routing
tables on the same physical SD-WAN infrastructure. Each tenant, customer, or security zone
gets its own VRF — a completely separate routing domain where routes are invisible to other
VRFs unless you explicitly allow sharing.

Navigate to **Policy Engine** in the left navigation, then select the **VRF** subsection.

## What VRF Provides

On a traditional network, all connected sites share a single global routing table. Any
route advertised by one site is visible to all other sites. VRF changes this:

- Each VRF maintains an independent routing table.
- Packets arriving on a tenant interface are forwarded only using that tenant's routing table.
- A packet in VRF A can never reach a destination in VRF B unless route leaking is
  explicitly configured.
- Multiple tenants can use overlapping IP address ranges (e.g., both use `192.168.1.0/24`)
  without conflict, because each VRF treats them as distinct destinations.

## Architecture

```
Controller (Route Reflector)
├── Global BGP + vpnv4 address family
└── Reflects VRF routes between PE devices

NexappOS Device (PE Router)
├── Global routing table (management)
├── VRF: acme-corp  (RD 65001:100, RT import/export 65001:100)
│   ├── LAN: 192.0.2.0/24
│   └── WAN: SD-WAN overlay (ACME traffic only)
└── VRF: beta-inc   (RD 65001:200, RT import/export 65001:200)
    ├── LAN: 192.0.2.0/24  ← same prefix as acme-corp, no conflict
    └── WAN: SD-WAN overlay (Beta traffic only)
```

## How VRF Routes Are Distributed

VRF routes are carried between devices using MP-BGP (Multiprotocol BGP) with the vpnv4
address family. The controller acts as the route reflector for both the global IPv4 table
and the vpnv4 address family:

1. Each device imports its tenant LAN prefixes into the appropriate VRF.
2. The device exports those VRF prefixes to the controller over MP-BGP, tagged with the
   VRF's Route Target (RT).
3. The controller reflects the vpnv4 routes to all other connected devices.
4. A receiving device imports only routes whose exported RT matches its VRF's import RT.
5. The imported routes appear in the corresponding VRF on the remote device.

For detailed MP-BGP setup, see [MP-BGP Integration](mp-bgp.md).

## Use Cases

| Use Case | Description |
|----------|-------------|
| **MSP multi-customer** | Each enterprise customer has a dedicated VRF. Customer A and Customer B share SD-WAN hardware but never see each other's routes. |
| **Enterprise security zones** | Separate production, staging, and guest Wi-Fi into distinct VRFs. Production servers are unreachable from the guest zone. |
| **Regulated data** | Place PCI-scoped devices in a dedicated VRF to satisfy data isolation requirements without separate hardware. |
| **Shared services** | Host DNS, NTP, or Active Directory in a shared-services VRF and selectively leak that VRF's routes into tenant VRFs. |

## Scalability

| Parameter | Limit |
|-----------|-------|
| VRFs per device | Up to 64 (hardware-dependent) |
| Routes per VRF | Up to 10,000 (software routing table) |
| Tenants per topology | No controller-side limit; device hardware is the constraint |

For deployments approaching VRF limits, contact Nexapp support for guidance on hardware
sizing.

## Tenant Isolation Guarantee

Isolation is enforced at the kernel routing table level. Even if an operator misconfigures
firewall rules, traffic from VRF A cannot be forwarded into VRF B's routing domain — the
routing table simply does not contain the destination route. Route leaking is the only
mechanism to allow cross-VRF reachability, and it requires explicit RT configuration on
both sides.

## Getting Started

1. Read [VRF Configuration](configuration.md) to create VRF definitions on the controller.
2. Read [MP-BGP Integration](mp-bgp.md) to enable vpnv4 route distribution.
3. Read [Batch Deploy](batch-deploy.md) to push VRF configuration to all devices at once.
4. Verify isolation by pinging across tenants — traffic should not route between VRFs.

## See Also

- [VRF Configuration](configuration.md) — Create and manage VRF definitions
- [MP-BGP Integration](mp-bgp.md) — Enable vpnv4 address family on the route reflector
- [Batch Deploy](batch-deploy.md) — Push VRF config to all topology devices
- [Tenant Policies](../06-policies/tenant.md) — Push VRF definitions as global policies
