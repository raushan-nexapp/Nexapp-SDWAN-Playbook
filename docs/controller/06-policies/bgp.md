# BGP Policies

## Overview

A BGP policy is a reusable template that defines the Border Gateway Protocol configuration
pushed to NexappOS devices. You create a BGP policy once on the controller and attach it to
a topology or individual device, rather than configuring BGP independently on each router.

When the Global flag is enabled, the policy is pushed to every device in the attached
topology during the next deployment.

Navigate to **Policy Engine > BGP** to manage BGP policies.

## Prerequisites

- You have an Autonomous System Number (ASN) for your network. Use the private range
  `65001`–`65534` for internal deployments.
- You know the IP addresses and ASNs of the BGP neighbors each device should peer with.
- For hub-and-spoke SD-WAN deployments using the controller as a route reflector, see
  [BGP Route Reflector](../07-bgp-rr/overview.md) — that section handles the controller-side
  configuration.

## Creating a BGP Policy

1. Navigate to **Policy Engine > BGP**.
2. Click **Add BGP Policy**.
3. Fill in the policy fields described below.
4. Click **Save**.

## Policy Fields

### General

| Field | Description | Required |
|-------|-------------|----------|
| **Policy Name** | A descriptive name for this policy (e.g., `Branch-BGP-65001`) | Yes |
| **Local AS** | The Autonomous System Number for devices using this policy (e.g., `65001`) | Yes |
| **Router ID** | A unique IPv4 identifier — typically the device's loopback or ZeroTier IP | No |
| **Global** | When enabled, policy applies to all devices in the attached topology | Yes |
| **Redistribute Connected** | Advertise directly connected subnets to BGP neighbors | No |
| **Redistribute Static** | Advertise static routes to BGP neighbors | No |

### Neighbors

Each BGP policy can include one or more neighbor entries:

| Field | Description | Required |
|-------|-------------|----------|
| **Neighbor IP** | IPv4 address of the remote BGP peer (e.g., `198.51.100.1`) | Yes |
| **Remote AS** | ASN of the remote peer | Yes |
| **Password** | MD5 authentication — must match on both sides | No |
| **Next Hop Self** | Force this router as next hop in advertisements to this neighbor | No |
| **Route Map In** | Apply a route map to incoming routes from this neighbor | No |
| **Route Map Out** | Apply a route map to outgoing routes sent to this neighbor | No |
| **Prefix List In** | Filter incoming routes using a named prefix list | No |
| **Prefix List Out** | Filter outgoing routes using a named prefix list | No |
| **Maximum Prefix** | Maximum prefixes accepted before the session is shut down | No |

### Prefix Lists

Prefix lists filter which IP prefixes are accepted or advertised. Add one or more entries:

| Field | Description |
|-------|-------------|
| **List Name** | Identifier used in neighbor entries (e.g., `ALLOW-HQ`) |
| **Sequence** | Evaluation order (lower numbers evaluated first) |
| **Action** | `permit` to allow, `deny` to block matching prefixes |
| **Network** | CIDR prefix to match (e.g., `192.0.2.0/24`) |
| **GE / LE** | Optional: match prefix lengths greater-than-or-equal / less-than-or-equal |

### Route Maps

Route maps modify BGP attributes on routes that match filter criteria:

| Field | Description |
|-------|-------------|
| **Map Name** | Identifier used in neighbor entries (e.g., `SET-LOCALPREF-200`) |
| **Sequence** | Evaluation order |
| **Action** | `permit` to process, `deny` to discard |
| **Match Prefix List** | Apply only to routes matching this prefix list |
| **Set Local Preference** | Override local preference for matched routes |
| **Set MED** | Set the Multi-Exit Discriminator value |
| **Set Community** | Attach a BGP community string |
| **Set AS Prepend** | Prepend ASNs to make the path less preferred |

## Example: Branch BGP Policy

A typical branch deployment where all spokes peer with the controller route reflector at
`198.51.100.1` in AS `65000`:

- **Policy Name**: `Spoke-Standard-BGP`
- **Local AS**: `65001`
- **Global**: enabled
- **Neighbor IP**: `198.51.100.1`, **Remote AS**: `65000`, **Next Hop Self**: enabled
- **Prefix List In**: permit `192.0.2.0/16` le `24` (accept site prefixes only)

## Attaching a Policy to a Topology

1. Navigate to **SD-WAN Topology** and open the target topology.
2. Click the **Policy Engine** tab.
3. Under **BGP**, select the policy from the dropdown.
4. Click **Save Changes**.
5. Trigger a deployment — the controller pushes the BGP configuration to all devices.

## See Also

- [Global Policy Engine](overview.md) — Understand global vs per-device policy scope
- [BGP Route Reflector](../07-bgp-rr/overview.md) — Controller-hosted BGP route reflector
- [OSPF Policies](ospf.md) — Link-state routing alternative
