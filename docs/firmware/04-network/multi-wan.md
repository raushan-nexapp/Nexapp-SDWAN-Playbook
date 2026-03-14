# Multi-WAN

!!! note "Standalone & Controller-Managed"
    Multi-WAN is available in both standalone and controller-managed modes.
    In controller-managed mode, policies and rules may be pushed from the controller.

## Overview

Multi-WAN allows you to use two or more internet connections simultaneously for load
balancing, failover, or policy-based routing. You can distribute traffic across multiple
WAN links to maximize bandwidth, or configure backup links that activate only when the
primary connection goes down.

The Multi-WAN page is divided into two tabs:

- **Multi-WAN Manager** — Create and manage policies and traffic rules.
- **General Settings** — Configure global health-check parameters that apply to all WAN members.

Navigate to **Network > FlowEdge MultiWAN** in the web UI.

## Prerequisites

- At least two WAN interfaces configured under **Network > Interfaces**.
- Each WAN interface must have a valid gateway and DNS configuration.
- WAN interfaces must be assigned to the `wan` firewall zone.

## Configuration

### Step 1: Create a Policy

A policy defines how traffic is distributed across your WAN links. You can create
three types of policies:

| Policy Type | Behavior |
|-------------|----------|
| **Balance** | Distributes traffic across all gateways based on assigned weights. All links are active simultaneously. |
| **Backup** | Uses the highest-priority gateway. Lower-priority gateways activate only when higher-priority ones fail. |
| **Custom** | Combines balance and backup behaviors with multiple priority levels. |

To create a policy:

1. Open the **Multi-WAN Manager** tab.
2. Click **Create Policy**.
3. Enter a descriptive **Label** (e.g., "Primary Balancing").
4. Select the **Behavior**: Balance, Backup, or Custom.
5. Configure the additional health-check fields:
    - **Interval (seconds)** — How often to probe the tracking host (default: 5).
    - **Tracking IP** — The IP address to ping for connectivity checks (e.g., 8.8.8.8).
    - **Tracking Method** — Choose `Ping` or `HTTP`.
6. Select the **Gateway** interfaces from the dropdown.
7. For Balance policies, assign a **Weight** to each gateway (higher weight = more traffic).
8. For Backup policies, add multiple **Priority levels** — gateways in priority 1 are
   preferred over priority 2, and so on.
9. Click **Save**.

!!! tip "Default Policy"
    If no policies exist, you are prompted to create a **Default** policy that automatically
    includes all available WAN gateways.

### Step 2: Create Traffic Rules

Rules determine which traffic is handled by which policy. Without rules, the default
policy applies to all traffic.

1. Click **Create Rule** in the Rules section.
2. Enter a **Rule Name** (e.g., "VoIP Traffic").
3. Select the **Assigned Policy** from the dropdown.
4. Choose the **Protocol**: TCP, UDP, ICMP, or All.
5. Configure source and destination filters:
    - **Source Type** — Address (IP/CIDR), Object (predefined group), or Any.
    - **Source Address** — e.g., `192.168.1.0/24`.
    - **Source Port** — e.g., `5060,5061` or a range like `10000-20000`.
    - **Destination Type** — Address, Object, or Any.
    - **Destination Address** — e.g., `192.0.2.10`.
    - **Destination Port** — e.g., `443`.
6. Enable **Sticky** if you want connections from the same source IP to stay on the
   same gateway for the duration of the session.
7. Click **Save**.

!!! info "Port Syntax"
    You can enter single ports (`443`), comma-separated ports (`80,443`), or port
    ranges (`10000-20000`).

### Step 3: Configure General Settings

The General Settings tab controls the health-check behavior used to detect WAN failures:

1. Open the **General Settings** tab.
2. Add one or more **Tracking Hostnames or IPs** — these are external hosts used to
   determine if a WAN link is functioning (e.g., `8.8.8.8`, `1.1.1.1`).
3. Configure **Ping Settings**:
    - **Ping Timeout** — How long to wait for a response (1–10 seconds).
    - **Ping Interval** — How often to send a health probe (1 second to 1 hour).
    - **Ping Failure Interval** — How often to probe after a failure is detected.
4. Configure **Interface Recovery Thresholds**:
    - **Interface Down** — Number of consecutive failed pings before marking a WAN link
      as offline (1–10 pings).
    - **Interface Up** — Number of consecutive successful pings before marking a WAN link
      as recovered (1–10 pings).
5. Click **Save**.

## Verification

After configuring Multi-WAN, verify that it is working:

1. Return to the **Multi-WAN Manager** tab. Each gateway in your policies shows a
   status badge:
    - **Online** (green) — The WAN link is healthy.
    - **Offline** (red) — Health checks are failing.
    - **Connecting** / **Disconnecting** (yellow) — Transitioning between states.
    - **Disabled** — The WAN interface is administratively disabled.
2. Disconnect your primary WAN cable and confirm that traffic fails over to the backup
   link within the configured threshold time.
3. Reconnect the primary WAN and confirm that the link recovers and traffic returns.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| All WAN links show "Offline" | Tracking hosts are unreachable from all links | Verify the Tracking IPs in General Settings are reachable. Try `8.8.8.8` or `1.1.1.1`. |
| Traffic is not balanced evenly | Gateway weights are not set correctly | Edit the policy and adjust the weight values. A weight of 3 on one gateway vs 1 on another sends roughly 75% / 25% of traffic. |
| Failover takes too long | Interface Down threshold is too high | Reduce the **Interface Down** threshold in General Settings (e.g., from 5 to 2 pings). |
| Sticky sessions are not working | Sticky is not enabled on the rule | Edit the rule and enable the **Sticky** toggle. |
| Policy cannot be deleted | A rule still references the policy | Delete or reassign all rules that use the policy before deleting it. |
| WAN interface is missing from the gateway list | Interface is not in the `wan` firewall zone | Go to **Firewall > Zones & Policies** and ensure the interface is assigned to the `wan` zone. |

!!! info "See Also"
    - [Interfaces](interfaces.md) — Configure WAN and LAN interfaces.
    - [Static Routes](static-routes.md) — Add manual routing entries.
    - [Performance SLA](../06-sla/health-dashboard.md) — Advanced path monitoring and traffic steering for SD-WAN deployments.
