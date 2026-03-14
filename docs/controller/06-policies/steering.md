# Traffic Steering Policies

## Overview

Traffic steering policies define rules that route specific categories of traffic over
preferred WAN paths. Rules are evaluated based on application type, DSCP marking, or source
prefix, and they trigger automatic path switching when the preferred path's SLA degrades
below the configured threshold.

Navigate to **Policy Engine > Performance SLA** to manage steering policies.

## How Steering Works

Without steering, the bonding daemon distributes traffic across all healthy WAN links
by weight (load balancing). With steering policies:

1. A rule matches specific traffic (e.g., voice, by DSCP EF).
2. The matched traffic is directed to a **preferred path** (e.g., a low-latency MPLS link).
3. The preferred path is continuously measured against an **SLA profile**.
4. If the path degrades, the traffic automatically falls back to the next best path.
5. When the preferred path recovers, traffic reverts to it.

## Creating a Steering Policy

1. Navigate to **Policy Engine > Performance SLA**.
2. Click **Add Steering Policy**.
3. Set a **Policy Name** and the **Global** flag.
4. Add one or more steering rules.
5. Click **Save**.

## Steering Rule Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Rule Name** | Descriptive label (e.g., `VoIP-Prefer-MPLS`) | Yes |
| **Priority** | Evaluation order — lower numbers evaluated first; first match wins | Yes |
| **Match Application** | Application category from the DPI engine (e.g., `VoIP`, `Video`) | No |
| **Match DSCP** | DSCP value to match (e.g., `ef` for voice, `af41` for video) | No |
| **Match Source** | Source IP prefix (e.g., `192.0.2.0/24`) | No |
| **Match Destination** | Destination IP prefix | No |
| **Preferred Path** | WAN member or path group to use when healthy | Yes |
| **Fallback Path** | WAN member or path group to use when preferred path is degraded | No |
| **SLA Profile** | Profile that determines whether the preferred path is healthy | No |
| **Action** | `prefer-primary`, `load-balance`, `force-backup`, `block` | Yes |

## Actions

| Action | Behavior |
|--------|----------|
| **Prefer Primary** | Send matched traffic over the preferred path; fall back to fallback path if SLA degrades |
| **Load Balance** | Distribute matched traffic evenly across all healthy WAN members |
| **Force Backup** | Send matched traffic only over the fallback path (bypasses the primary) |
| **Block** | Drop matched traffic — useful for preventing specific applications from using the WAN |

## Rule Evaluation

Rules are evaluated top-to-bottom in priority order. The **first matching rule** determines
the path for each packet. Traffic that does not match any rule is handled by the default
load-balancing behavior.

Place more specific rules (narrow match criteria) above more general rules. For example:

1. Priority 10: Match DSCP EF → Prefer MPLS (voice over dedicated link)
2. Priority 20: Match DSCP AF41 → Prefer MPLS, fall back to broadband (video)
3. Priority 30: Match source `192.0.2.0/24` → Load balance (HQ traffic)
4. Priority 100: Match all → Load balance (default)

## Example: VoIP with MPLS Failover

Route all VoIP traffic over MPLS (member `wan1`). If MPLS latency exceeds 50 ms, fall back
to broadband (member `wan2`):

- **Rule Name**: `VoIP-MPLS-Primary`
- **Priority**: `10`
- **Match DSCP**: `ef`
- **Preferred Path**: `wan1` (MPLS link)
- **Fallback Path**: `wan2` (broadband)
- **SLA Profile**: `Voice-Grade` (latency ≤ 20 ms, jitter ≤ 5 ms, loss ≤ 0.1%)
- **Action**: `prefer-primary`

When the MPLS link's latency rises above 20 ms (Voice-Grade threshold), the bonding daemon
routes VoIP to broadband automatically. When MPLS recovers, VoIP reverts to MPLS.

## Global vs Per-Device Steering

A topology-wide global steering policy applies the same rules to every device. For branches
with different WAN link arrangements (e.g., a site with a cellular backup instead of MPLS),
create a per-device steering policy with adjusted path references.

## Viewing Active Steering

After deployment, check which rules are actively steering traffic:

1. Navigate to **SD-WAN Topology** and open the topology.
2. Click a device, then open the **WAN Members** tab.
3. Each member shows which steering rule is currently routing traffic to it.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Traffic not being steered | Steering policy not deployed | Check deployment history — verify push succeeded |
| Failover not triggering | SLA profile not attached to rule | Add the SLA profile to the steering rule |
| Wrong traffic being matched | Rule priority conflict | Review rule order — ensure specific rules have lower priority numbers than general rules |
| Traffic blocked unexpectedly | A `block` rule matching unintended traffic | Review match criteria on block rules; narrow the match |

## See Also

- [SLA Profiles](sla.md) — Define the thresholds that trigger failover
- [QoS Policies](qos.md) — Prioritize traffic after path selection
- [Global Policy Engine](overview.md) — Policy lifecycle and attachment
