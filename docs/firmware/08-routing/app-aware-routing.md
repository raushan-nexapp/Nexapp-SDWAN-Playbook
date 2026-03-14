# Application Aware Routing

!!! note "Standalone & Controller-Managed"
    Steering policies can be configured locally on the router or pushed as global policies from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Application Aware Routing directs traffic through preferred WAN paths based on application type, source/destination address, protocol, or DPI-classified application. Steering policies are evaluated in priority order (lowest number first), and each policy specifies a routing strategy, traffic match criteria, and path preference.

This feature requires an active SD-WAN overlay. Without an overlay, policies that reference tunnel paths have no effect.

Navigate to **Policy Engine > Application Aware Routing** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- An SD-WAN overlay is configured and running with at least one WAN link.
- For DPI-based matching, Deep Packet Inspection must be enabled on the router.
- For SLA-based strategies, at least one link health monitor must be configured.

## Configuration

### Internet Breakout Panel

At the top of the page, the **Internet Breakout** panel shows the current default routing behavior:

- **Default Policy** -- either **Tunnel** (all unmatched traffic goes through the SD-WAN overlay) or **Direct** (unmatched traffic exits via local WAN). Click **Switch to Direct/Tunnel** to toggle.
- **Mode** -- Centralized, Local Breakout, or Split (per-rule).
- **Rule counts** -- Number of tunnel rules vs. direct breakout rules.

### Policy Table

The table lists all steering policies sorted by priority:

| Column | Description |
|--------|-------------|
| **Priority** | Evaluation order. Lower numbers match first (`1` = highest). |
| **Name** | Display name for this policy. |
| **Match** | Summary of traffic match criteria (protocol, IPs, DPI app). |
| **Strategy** | How paths are selected (Manual, Best Quality, Load Balance, etc.). |
| **Action** | **Tunnel** (via overlay) or **Direct** (local internet breakout). |
| **Status** | **Active** or **Inactive**. |

### Creating a Steering Policy

1. Click **Add Policy**.
2. Set **Status** to **Enabled**.
3. Enter a **Name** (e.g., `voip_priority`).
4. Set the **Priority** (1--999). Lower values are evaluated first.
5. Choose an **Action**:
    - **Tunnel** -- route matching traffic through the SD-WAN overlay.
    - **Breakout** -- route matching traffic directly via local WAN. Optionally select a specific **Breakout WAN** link.
6. Choose a **Strategy**:

    | Strategy | Behavior |
    |----------|----------|
    | Manual | Use the specified path preference order. |
    | Priority | Use the highest-priority available path. |
    | Best Quality | Automatically select the best-performing path based on SLA metrics. |
    | Lowest Cost | Prefer the least-cost path. |
    | Load Balance | Distribute traffic across all available paths. |
    | Bonded | Bond all paths for maximum aggregate throughput. |
    | Volume (Weighted) | Distribute by percentage per member (e.g., `wan1:70, wan2:30`). |
    | Spillover | Use the primary link until saturated, then overflow to the next. |
    | Session Hash | Sticky per-session affinity using 5-tuple hash. |

7. Configure **Traffic Matchers** (expand the section):
    - **DPI Application** -- select a specific application identified by DPI (e.g., `zoom`, `youtube`).
    - **Protocol** -- TCP, UDP, or ICMP.
    - **Source/Destination IP** -- filter by IP or CIDR (e.g., `192.168.1.0/24`).
    - **Source/Destination Port** -- single port or range (e.g., `5060` or `80-443`).
8. Optionally expand **Advanced Settings** for SLA thresholds, DSCP marking, packet duplication, and FEC.
9. Click **Create Policy**.

### Editing or Deleting

- Click the edit icon to modify a policy. The section name cannot be changed.
- Click the delete icon to remove a policy.

## Verification

1. Create a steering policy that matches a specific application or subnet.
2. Generate traffic that matches the policy criteria.
3. Check the policy table -- the **Status** column shows **Active**.
4. Navigate to **Monitoring > Realtime** to confirm traffic flows through the expected WAN path.
5. Temporarily disable the preferred link and verify failover behavior matches the selected strategy.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Policy exists but traffic ignores it | Priority is higher (larger number) than a catch-all rule | Lower the priority number so the policy is evaluated before broader rules. |
| DPI application match not working | DPI not enabled or application not yet classified | Enable DPI under **Security > DPI** and allow time for traffic classification to populate. |
| Breakout action has no effect | No SD-WAN overlay active -- all traffic already routes directly | Verify the SD-WAN overlay is running. Breakout only applies when an overlay is active. |
| Best Quality strategy not switching paths | No link health monitors configured | Configure at least one link health monitor under **SLA > Path Monitors**. |

!!! info "See Also"
    - [Traffic Steering](../06-sla/traffic-steering.md) -- SLA-based traffic steering rules
    - [BGP](bgp.md) -- Dynamic routing with BGP
    - [Firewall Rules](../10-firewall/rules.md) -- Layer 3/4 firewall rule configuration
