# Path Monitors (Link Health Checks)

!!! note "Standalone & Controller-Managed"
    Path monitors can be configured locally or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Path monitors are health probes that continuously measure the quality of your WAN links. Each monitor sends periodic probes (ping, HTTP, or TCP) to a target server and measures RTT, jitter, packet loss, and MOS. The results feed into the Health Dashboard, quality tiers, and traffic steering decisions.

Navigate to **Policy Engine > Performance SLA > Path Monitors** to manage health probes.

## Prerequisites

- SD-WAN is configured with at least one active overlay tunnel and WAN member.
- You have a reachable target for probing (e.g., `8.8.8.8` for ping, or an HTTP endpoint).
- For underlay monitors, at least one WAN member must be configured.

## Configuration

### Creating a Path Monitor

1. Navigate to **Policy Engine > Performance SLA > Path Monitors**.
2. Click **Add Path Monitor**.
3. Fill in the monitor configuration:

| Field | Description |
|-------|-------------|
| **Name** | A unique identifier (e.g., `wan_monitor`). Letters, numbers, and underscores only. |
| **Protocol** | The probe protocol: `ping` (ICMP echo), `http` (HTTP GET), or `tcp` (TCP connection). |
| **Server** | The probe target address (e.g., `8.8.8.8` for ping, `https://example.com` for HTTP). |
| **Interval (ms)** | How often to send probes, in milliseconds. Default is `5000` (5 seconds). Valid range: `100`--`60000`. |
| **Failtime** | Number of consecutive probe failures before the link is marked as down. Default is `3`. Valid range: `1`--`100`. |
| **Recovertime** | Number of consecutive probe successes before a down link is marked as up again. Default is `3`. Valid range: `1`--`100`. |
| **Target** | Where probes are sent: `overlay` (through the SD-WAN tunnel) or `underlay` (directly through WAN interfaces). |
| **Members** | (Required for underlay target) Select which WAN members this monitor applies to. For underlay monitors, all WAN members are typically selected. |
| **Status** | Enable or disable the monitor. |

4. Click **Add** to save the monitor.

### SLA Thresholds

Below the main fields, you can define SLA thresholds. Links exceeding any threshold are flagged as SLA-violated on the Health Dashboard.

| Field | Description |
|-------|-------------|
| **Max Latency (ms)** | Maximum acceptable RTT. Typical values: `100` ms for general use, `50` ms for voice. Range: `1`--`10000`. |
| **Max Jitter (ms)** | Maximum acceptable jitter. Typical values: `30` ms for voice, `50` ms for video. Range: `1`--`5000`. |
| **Max Loss (%)** | Maximum acceptable packet loss percentage. Even `1`% loss degrades voice quality. Range: `0`--`100`. |
| **Min MOS Score** | Minimum acceptable Mean Opinion Score. Typical values: `3.5` for acceptable voice, `4.0` for good. Range: `1.0`--`4.4`. |

Leave any threshold at `0` or empty to disable that specific check.

!!! tip
    Start with generous thresholds (e.g., latency `200` ms, jitter `50` ms, loss `5`%) and tighten them after observing baseline link behavior for a few days.

### Probe Protocols

- **Ping (ICMP)** -- Simplest and most common. Measures RTT and loss. Works with any IP address. Some targets block ICMP, which causes false failures.
- **HTTP** -- Sends an HTTP GET request. Measures full application-layer RTT including DNS resolution and TLS handshake. Use for testing application reachability.
- **TCP** -- Opens a TCP connection to the target. Measures connection setup time. Use when ICMP is blocked but TCP is allowed.

### Failtime and Recovertime

These values control how quickly a link is marked down or up:

- **Failtime = 3** and **Interval = 5000 ms**: The link is marked down after 3 consecutive failed probes (15 seconds).
- **Recovertime = 3** and **Interval = 5000 ms**: The link is marked up after 3 consecutive successful probes (15 seconds).

Lower failtime values detect failures faster but increase the risk of false positives from temporary packet loss.

## Verification

1. After creating a monitor, return to the Path Monitors list and verify the monitor shows as **Enabled**.
2. Navigate to **Policy Engine > Performance SLA** (Health Dashboard) and confirm metrics are being collected for the monitored members.
3. Verify SLA threshold badges appear in the monitor list (e.g., "lat <= 100ms", "jit <= 30ms").

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Monitor always shows link as down | The probe target is unreachable or blocks the selected protocol | Try a different target (e.g., `1.1.1.1`). If using ping, the target may block ICMP; switch to HTTP or TCP. |
| False positives (link flaps up/down frequently) | Failtime is set too low, causing brief packet loss to trigger failure | Increase **Failtime** to `5` or higher. Increase the **Interval** to reduce probe frequency. |
| High loss reported but link works fine | The probe target is rate-limiting or dropping ICMP | Use a different probe target, or switch to HTTP/TCP protocol. Some public DNS servers throttle ICMP. |
| SLA thresholds not triggering | Threshold values set to `0` (disabled) | Enter non-zero values for the thresholds you want to enforce. |
| Monitor shows "No members" for underlay target | No WAN members are selected | Edit the monitor and select the WAN members it should monitor. For underlay mode, all members should be selected. |

!!! info "See Also: Controller Manual"
    To configure path monitors globally for all devices in a topology, see
    [SLA Policies](../../controller/06-policies/sla.md) in the Controller Manual.

!!! info "See Also"
    - [Health Dashboard](health-dashboard.md) -- View real-time link health metrics
    - [Quality Tiers](quality-tiers.md) -- Classify link health into tiers
    - [Traffic Steering](traffic-steering.md) -- Steer traffic based on SLA compliance
