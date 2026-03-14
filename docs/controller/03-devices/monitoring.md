# Device Status & Monitoring

## Overview

The controller continuously monitors every registered device and collects real-time health data. Status is updated every 30 seconds via the ZeroTier management plane. This page explains the status model, available metrics, alert configuration, and the device health dashboard.

## Status Model

Every device has a status badge that reflects its current reachability:

| Status | Badge Color | Meaning |
|---|---|---|
| **Online** | Green | Device reachable, tunnel connected, all health checks passing |
| **Degraded** | Yellow | Device reachable but one or more health checks failing (e.g., WAN member down) |
| **Offline** | Red | Device not responding to status polls for more than 90 seconds |
| **Unknown** | Gray | Device registered but not yet polled (typically just after approval) |

Status changes are logged in the audit log and trigger alerts if configured (see [Alert Configuration](#alert-configuration) below).

## Device Status Dashboard

Navigate to **Devices** to see the full fleet status at a glance. The list view shows each device with its current status badge, last seen time, topology membership, and location.

Use the filter bar to narrow the view:

| Filter | Options |
|---|---|
| **Status** | Online, Degraded, Offline, Unknown |
| **Organization** | Filter by customer or department |
| **Topology** | Show only devices belonging to a specific topology |
| **Location** | Filter by site or region tag |

Click any device row to open the device detail page, which includes a real-time status panel showing all monitored metrics.

## Metrics Collected

The controller collects the following metrics from each device on every status poll:

### Tunnel Status

| Metric | Description |
|---|---|
| Tunnel state | Connected, Connecting, Disconnected |
| Uptime | How long the tunnel has been continuously connected |
| Bytes in / out | Total tunnel traffic since last restart |
| Active WAN members | Number of WAN links currently passing tunnel traffic |

### WAN Member Health

For each WAN member (underlay link) in the SD-WAN fabric:

| Metric | Description |
|---|---|
| Link state | Up, Down, Degraded |
| RTT (latency) | Round-trip time in milliseconds |
| Jitter | Variation in packet arrival time (ms) |
| Packet loss | Percentage of packets lost in the last measurement interval |
| Bandwidth | Measured upload and download throughput |

### System Resources

| Metric | Description |
|---|---|
| CPU usage | Percentage of CPU used across all cores |
| RAM usage | Memory used vs. total available |
| Disk usage | Root and data partition utilization |
| Uptime | Time since last system reboot |

## Historical Graphs

Navigate to **Devices > [device-name] > Monitoring** to view historical metric graphs. Available time ranges:

| Range | Data Resolution |
|---|---|
| Last 1 hour | 30-second intervals |
| Last 24 hours | 5-minute averages |
| Last 7 days | 1-hour averages |
| Last 30 days | 6-hour averages |

Graphs are rendered for: tunnel status timeline, per-WAN-member RTT/jitter/loss, and system CPU/RAM/disk.

## Alert Configuration

Alerts notify administrators when device health crosses a threshold. Navigate to **Application Intelligence > Alerts & Anomalies** to configure alert rules.

### Alert Types

| Alert Type | Trigger Condition |
|---|---|
| **Device Offline** | Device does not respond to status poll for N minutes (default: 5 minutes) |
| **WAN Link Down** | A WAN member transitions to Down state |
| **High Latency** | Average RTT exceeds threshold (e.g., > 100 ms) |
| **Packet Loss** | Packet loss percentage exceeds threshold (e.g., > 1%) |
| **High CPU** | CPU usage exceeds threshold for sustained period (e.g., > 90% for 5 min) |
| **Tunnel Disconnected** | SD-WAN tunnel drops from Connected state |

### Configuring an Alert Rule

1. Navigate to **Application Intelligence > Alerts & Anomalies**
2. Fill in the alert parameters:

| Field | Description |
|---|---|
| **Name** | Descriptive name for this rule |
| **Scope** | All devices, specific organization, or specific topology |
| **Condition** | Alert type and threshold value |
| **Duration** | How long the condition must persist before alerting (avoids flapping) |
| **Notification** | Email recipients, or webhook URL |
| **Severity** | Warning (yellow), Critical (red) |

3. Click **Save and Enable**

### Notification Channels

| Channel | Configuration |
|---|---|
| **Email** | Enter comma-separated recipient addresses |
| **Webhook** | Enter HTTPS URL; controller POSTs a JSON payload on trigger |

## Topology-Level Status

Navigate to **SD-WAN Fabric > [topology-name]** for a topology-scoped status view showing all devices in that topology, their individual tunnel states, and a summary of WAN member health across the fabric.

The topology status page is particularly useful during deployments — you can monitor all devices in the topology transitioning from Connecting to Connected after a configuration push.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Device shows Offline but router is running | ZeroTier management plane issue | SSH to the router and verify ZeroTier is connected: check **Status > Overview > Management** on the router UI |
| Status shows Online but tunnel is Disconnected | SD-WAN daemon stopped | Navigate to **Devices > [device] > Terminal** and check the daemon status |
| Metrics graphs show no data | Device was recently registered or monitoring agent restarted | Allow 5 minutes for data to populate after initial registration |
| Alerts not being received | Email configuration wrong or SMTP blocked | Test email settings in **Settings > Email** |

!!! info "See Also"
    - [Device Registration](registration.md) — Register devices so monitoring can begin
    - [Device Terminal](terminal.md) — Access the router CLI for live diagnostics
    - [DPI Analytics](../09-dpi/overview.md) — Application-level traffic monitoring
    - [Performance SLA](../06-policies/sla.md) — SLA threshold configuration and monitoring
