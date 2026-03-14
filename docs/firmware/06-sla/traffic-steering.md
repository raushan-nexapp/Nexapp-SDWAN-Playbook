# Traffic Steering Policies

!!! note "Standalone & Controller-Managed"
    Steering policies can be configured locally or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Traffic steering policies determine which WAN link carries which traffic. You define rules that match traffic by source, destination, protocol, application (DPI), or DSCP marking, and specify how that traffic should be handled -- through the tunnel, via local internet breakout, load-balanced, or dropped. Policies are evaluated in priority order (lowest number first); the first match wins.

Navigate to **Policy Engine > Performance SLA > Steering Policies** to manage traffic steering rules.

## Prerequisites

- SD-WAN is configured with at least one active overlay and WAN member.
- (Optional) Path monitors and quality tiers are configured if you want to use quality-based steering.
- (Optional) DPI (Deep Packet Inspection) is enabled if you want application-aware steering.

## Configuration

### Creating a Steering Policy

1. Navigate to **Policy Engine > Performance SLA > Steering Policies**.
2. Click **Add Steering Policy**.
3. Fill in the basic settings:

| Field | Description |
|-------|-------------|
| **Name** | A unique identifier (e.g., `policy_voip`). Letters, numbers, and underscores only. |
| **Status** | Enable or disable the policy. Disabled policies are skipped during evaluation. |
| **Priority** | Evaluation order (`1`--`999`). Lower numbers are evaluated first. First matching policy wins. |
| **Strategy** | The link selection strategy (see strategy table below). |
| **Action** | What to do with matched traffic: `Tunnel` (send through overlay), `Breakout` (send directly via WAN), `Auto` (system decides), or `Drop` (block traffic). |
| **Path Preference** | (For Manual, Bonded, Priority, Spillover strategies) Preferred path: `overlay` or `underlay`. |

### Strategy Options

| Strategy | Description |
|----------|-------------|
| **Best Quality** | Select the WAN link with the best current health metrics (lowest latency and loss). |
| **Lowest Cost** | Select the WAN link with the lowest cost metric. |
| **Manual** | Use the path preference you specify (overlay or underlay). |
| **Priority** | Follow member priority order; fail over to the next member when the preferred link is down. |
| **Load Balance** | Distribute traffic evenly across all available members by weight. |
| **Bonded** | Bond all available paths together for maximum throughput. |
| **Volume (Weighted)** | Distribute by data volume using explicit weights (e.g., `wan1:70, wan2:30`). |
| **Spillover** | Use the primary link until it reaches a bandwidth threshold, then overflow to secondary links. |
| **Session Hash** | Pin sessions to a specific link based on a hash of source/destination. Ensures session stickiness. |

### Traffic Matching (Optional)

Define which traffic this policy applies to. If no matchers are specified, the policy matches all traffic.

| Field | Description |
|-------|-------------|
| **Source IP/CIDR** | Match traffic from a specific subnet (e.g., `192.168.10.0/24`). |
| **Destination IP/CIDR** | Match traffic to a specific subnet (e.g., `10.0.0.0/8`). |
| **Protocol** | Match by protocol: `TCP`, `UDP`, `ICMP`, or `Any`. |
| **Source / Destination Port** | Match by port number (e.g., `5060` for SIP, `443` for HTTPS). |
| **DPI Application** | Match by deep packet inspection application name (e.g., `Microsoft.Teams`). Requires DPI to be enabled. |
| **DPI Category** | Match by application category (e.g., `streaming-media`, `social-networking`). |
| **DSCP Match** | Match incoming packets with a specific DSCP marking (e.g., `EF` for voice, `AF41` for video). |

### Quality Settings (Optional)

| Field | Description |
|-------|-------------|
| **Traffic Class** | Classify traffic for QoS: `Voice`, `Video`, `Interactive`, `Best Effort`, `Bulk`, or `Management`. |
| **DSCP Mark** | Apply a DSCP marking to matched traffic for downstream QoS treatment. |
| **Path Monitor** | Associate a path monitor with this policy for quality-aware steering. |
| **Required Tier** | Only use links that meet this quality tier or better (see [Quality Tiers](quality-tiers.md)). |

### Advanced Settings (Optional)

| Field | Description |
|-------|-------------|
| **Breakout WAN** | Which WAN member to use for breakout action. Leave as Auto for automatic selection. |
| **Hold Down Time** | Seconds to wait before switching traffic back to a recovered link. Prevents flapping. |
| **Link Cost Factor** | Multiplier for link cost in routing decisions. |
| **Packet Duplication** | Send traffic on all paths simultaneously for maximum reliability. Uses more bandwidth. |
| **Forward Error Correction** | Add redundancy packets per-policy. Adds ~10-25% bandwidth overhead. |

4. Click **Add** to save the policy.

### Using QoS Templates

Click **Apply Template** to apply a pre-built set of steering policies. Templates provide common configurations (e.g., voice-optimized, balanced, cost-saving). Applying a template replaces existing template-generated policies.

### Policy Ordering

Policies are evaluated top-to-bottom by priority number. Place specific rules (e.g., VoIP traffic on the best link) at low priority numbers (high priority) and general rules (e.g., all other traffic) at high priority numbers (low priority).

!!! example
    Priority `10`: VoIP traffic (DSCP EF) -- Best Quality strategy
    Priority `50`: Video conferencing -- Tier 1 required
    Priority `100`: Business apps -- Load Balance strategy
    Priority `900`: Default (all other traffic) -- Lowest Cost strategy

## Verification

1. After creating policies, navigate to the Steering Policies list and verify all policies are enabled and ordered correctly.
2. Generate traffic matching a policy (e.g., a VoIP call) and check the Health Dashboard to confirm it flows through the expected WAN link.
3. Simulate a link failure and verify traffic fails over according to the policy strategy.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Traffic not following the policy | The policy priority is higher (larger number) than a more general policy that matches first | Move the specific policy to a lower priority number so it is evaluated first. |
| DPI application not matching | DPI is not enabled or the application is not yet classified | Verify DPI is enabled on the device. Traffic may need to flow for a few seconds before DPI classifies the application. |
| Failover not triggering | No path monitor configured for the policy, or failtime is set too high | Associate a path monitor with the policy and set a reasonable failtime (e.g., 3). |
| Breakout traffic still going through tunnel | Action is set to `Tunnel` instead of `Breakout` | Change the policy action to `Breakout` and set the path preference to `underlay`. |
| All traffic using one link despite load balance | Weights are not configured or all set to the same value | Verify member weights are set appropriately in [Underlay Members](../05-sdwan/underlay-members.md). |

!!! info "See Also: Controller Manual"
    To configure steering policies globally for all devices, see
    [Steering Policies](../../controller/06-policies/steering.md) in the Controller Manual.

!!! info "See Also"
    - [Path Monitors](path-monitors.md) -- Configure health probes for quality-aware steering
    - [Quality Tiers](quality-tiers.md) -- Define quality levels for tier-based steering
    - [Health Dashboard](health-dashboard.md) -- Monitor real-time link health
    - [Underlay Members](../05-sdwan/underlay-members.md) -- Configure WAN link weights and priorities
