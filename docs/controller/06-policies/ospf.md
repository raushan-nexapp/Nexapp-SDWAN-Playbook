# OSPF Policies

## Overview

An OSPF policy is a reusable template that defines Open Shortest Path First routing
configuration pushed to NexappOS devices. OSPF is a link-state interior gateway protocol
commonly used to interconnect SD-WAN sites with existing campus or data-center networks
that already run OSPF.

Navigate to **Policy Engine > OSPF** to manage OSPF policies.

## When to Use OSPF

Use OSPF policies when:

- Your SD-WAN overlays need to exchange routes with an existing campus network running OSPF.
- You want dynamic routing between hub and spoke sites without managing static routes manually.
- You need to redistribute SD-WAN overlay routes into a corporate OSPF domain.

For inter-site routing across the SD-WAN fabric itself, BGP with the controller route
reflector is the recommended approach. OSPF is best for connecting the SD-WAN edge to the
LAN routing domain.

## Creating an OSPF Policy

1. Navigate to **Policy Engine > OSPF**.
2. Click **Add OSPF Policy**.
3. Fill in the fields described below.
4. Click **Save**.

## Policy Fields

### General

| Field | Description | Required |
|-------|-------------|----------|
| **Policy Name** | A descriptive name (e.g., `Campus-OSPF-Area0`) | Yes |
| **Process ID** | OSPF process identifier on the device (e.g., `1`). Unique per device. | Yes |
| **Router ID** | Static router ID for OSPF — typically a loopback address (e.g., `192.0.2.1`) | No |
| **Global** | When enabled, policy applies to all devices in the attached topology | Yes |

### Areas

Define one or more OSPF areas:

| Field | Description | Required |
|-------|-------------|----------|
| **Area ID** | OSPF area identifier — use `0.0.0.0` for backbone Area 0 | Yes |
| **Area Type** | Normal, Stub, or NSSA (Not So Stubby Area) | Yes |
| **Authentication** | None, MD5, or plain-text password for this area | No |
| **Authentication Key** | Password string when authentication is enabled | No |

### Networks

Specify which directly connected subnets participate in OSPF:

| Field | Description |
|-------|-------------|
| **Network** | CIDR prefix of the subnet to include (e.g., `192.0.2.0/24`) |
| **Area** | OSPF area this network belongs to |

### Redistribution

Control which other routing sources are redistributed into OSPF:

| Option | Description |
|--------|-------------|
| **Redistribute Connected** | Announce all directly connected subnets into OSPF |
| **Redistribute Static** | Announce static routes into OSPF |
| **Redistribute BGP** | Import BGP routes into OSPF (use with caution — can cause route loops) |

Set a **Metric** and **Metric Type** (Type 1 or Type 2) for redistributed routes.

### Passive Interfaces

Mark WAN-facing interfaces as passive to prevent OSPF hello packets from being sent toward
the internet. Passive interfaces still contribute their connected routes to OSPF.

Enter the interface names to exclude from OSPF hello processing (e.g., `wan`, `WAN2`).

## Example: Interconnect with Campus Network

A spoke router at a branch office connects to a campus switch running OSPF Area 0. The
LAN subnet is `192.0.2.128/26`.

- **Policy Name**: `Branch-Campus-OSPF`
- **Process ID**: `1`
- **Area**: `0.0.0.0` (backbone), type Normal
- **Network**: `192.0.2.128/26`, Area `0.0.0.0`
- **Passive interface**: `wan` (do not send OSPF hellos toward ISP)
- **Redistribute BGP**: enabled — propagate SD-WAN overlay routes to campus

## Attaching a Policy to a Topology

1. Open the topology detail page.
2. Click the **Policy Engine** tab.
3. Under **OSPF**, select the policy.
4. Click **Save Changes** then trigger a deployment.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Neighbors not forming | Mismatched area type or authentication | Verify area ID, type, and password on both sides |
| Routes not redistributed | Redistribution disabled or metric not set | Enable the appropriate redistribution option and set a metric |
| OSPF hellos going to WAN | WAN interface not marked passive | Add WAN interface name to the passive interfaces list |
| Route loops after BGP redistribution | Mutual redistribution between BGP and OSPF | Use route maps with community tagging to prevent re-importing |

## See Also

- [Global Policy Engine](overview.md) — Understand global vs per-device policy scope
- [BGP Policies](bgp.md) — Dynamic routing across SD-WAN sites
- [Deployment Pipeline](../05-deployment/pipeline.md) — How policies are pushed to devices
