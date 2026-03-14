# Global Policy Engine

## Overview

The Global Policy Engine lets you define reusable configuration templates — called policies —
that the controller propagates to devices automatically when you deploy a topology. Instead
of configuring routing, QoS, and SLA thresholds device by device, you create a policy once
and attach it to a topology.

Navigate to **Policy Engine** in the left navigation to access the policy engine.

## Policy Types

The controller supports six categories of policies:

| Policy Type | Purpose | Navigate To |
|-------------|---------|-------------|
| **BGP** | Define BGP neighbor relationships, prefix lists, and route maps | **Policy Engine > BGP** |
| **OSPF** | Define OSPF areas, networks, and redistribution settings | **Policy Engine > OSPF** |
| **QoS** | Classify and prioritize traffic on WAN interfaces | **Policy Engine > QoS Config** |
| **SLA Profiles** | Define latency, jitter, and loss thresholds for path health | **Policy Engine > Performance SLA** |
| **Steering** | Route specific traffic over preferred WAN paths based on SLA | **Policy Engine > Performance SLA** |
| **Tenant** | Define VRF isolation for multi-tenant deployments | **Policy Engine > BGP** |

## Global vs Per-Device Policies

Every policy has a **Global** flag:

- **Global = enabled** — the policy is pushed to every device in the attached topology
  during the next deployment. This is the default for most deployments.
- **Global = disabled** — the policy is applied only to the specific device it is
  assigned to. Use this for per-branch exceptions.

Per-device policies take precedence over global policies when both are assigned to the
same device. For example, a branch with an unusual ISP arrangement can have a custom QoS
policy while all other devices in the topology use the global template.

## Policy Lifecycle

1. **Create** — Define the policy under **Policy Engine > [type]**. Fill in the required fields
   and optionally enable the Global flag.
2. **Attach** — Assign the policy to a topology via the topology detail page, or to a
   specific device via the device detail page.
3. **Deploy** — Trigger a deployment from the topology. The controller includes all attached
   policies in the configuration push.
4. **Active** — The policy is live on the target devices. Status polling confirms the
   applied state within 30 seconds.
5. **Update** — Edit the policy and redeploy. The controller sends only the delta.
6. **Detach** — Remove the policy from the topology or device and redeploy to remove the
   configuration from devices.

## Policy Inheritance

Policy inheritance works at two levels:

1. **Topology-level global policy** — applies to all devices in the topology.
2. **Device-level policy** — overrides the topology-level policy for that one device.

If no policy of a given type is attached at either level, that feature is not configured on
the device. There is no implicit default policy.

## API Access

All policy types are available through the REST API:

| Policy | Endpoint |
|--------|----------|
| BGP | `/api/v1/nsbond/bgp-config/` |
| OSPF | `/api/v1/nsbond/ospf-config/` |
| QoS | `/api/v1/nsbond/qos-config/` |
| SLA Profiles | `/api/v1/nsbond/quality-tier/` |
| Steering | `/api/v1/nsbond/steering-policy/` |
| Tenant | `/api/v1/nsbond/` (VRF endpoints) |

See [REST API Reference](../14-api/authentication.md) for authentication details.

## See Also

- [BGP Policies](bgp.md) — Configure BGP neighbor templates
- [OSPF Policies](ospf.md) — Configure OSPF area templates
- [QoS Policies](qos.md) — Configure traffic classification and prioritization
- [SLA Profiles](sla.md) — Define path health thresholds
- [Steering Policies](steering.md) — Route traffic based on SLA
- [Tenant Policies](tenant.md) — Isolate routing per tenant
