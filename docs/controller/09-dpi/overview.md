# DPI Analytics Overview

## Overview

Deep Packet Inspection (DPI) identifies the application behind every network flow without decrypting the payload. The controller collects DPI telemetry from every NexappOS router in your fleet, aggregates it centrally, and presents application-level traffic intelligence across your entire network.

Navigate to **Application Intelligence** in the left navigation to access this section. Four tabs are available:

| Tab | Purpose |
|-----|---------|
| **Overview** | Fleet-wide summary: top applications, top categories, bandwidth breakdown |
| **Traffic Analysis** | Time-series charts with device and topology filters |
| **App Intelligence** | Application database — categories, risk levels, custom groups |
| **Alerts** | Threshold-based alerts for bandwidth, new applications, and anomalies |

## How DPI Works

Each NexappOS router runs a signature-based traffic classification engine. As packets traverse the router, the engine inspects flow metadata and matches it against a library of 3000+ application signatures. Matched flows are labeled with an application name, category, and risk level.

The router aggregates classified traffic into hourly snapshots and sends them to the controller via a REST sink endpoint. The controller stores these snapshots and makes them available for analysis, reporting, and alerting.

```
Router (DPI Engine)
    ↓  classify flows every 60 minutes
    ↓  POST /api/v1/dpi/sink/
Controller (DPI Analytics)
    ↓  store snapshot
    ↓  update dashboards + evaluate alert rules
```

## What You Can See

- **Top Applications** — Which applications consumed the most bandwidth across your fleet
- **Top Categories** — Streaming, Social Media, Productivity, P2P, Gaming, and more
- **Per-Device Breakdown** — Which devices are running which applications
- **Trend Over Time** — Application usage hour-by-hour or day-by-day for any time range
- **Anomaly Detection** — Unusual spikes flagged automatically

## Application Categories

DPI classifies every application into one of the following categories:

| Category | Examples |
|----------|---------|
| Streaming | YouTube, Netflix, Twitch, Hotstar |
| Social Media | Facebook, Instagram, WhatsApp, Telegram |
| Productivity | Microsoft 365, Google Workspace, Zoom, Slack |
| P2P | BitTorrent, eMule, uTorrent |
| Gaming | Steam, Xbox Live, PlayStation Network |
| Security Risk | TOR, anonymizers, known C&C traffic |
| VPN | OpenVPN, WireGuard, IPsec, SSL VPN |
| General Web | HTTP/HTTPS traffic not matched to a specific app |

## Data Freshness and Retention

| Setting | Value |
|---------|-------|
| Snapshot interval | Every 60 minutes (one snapshot per router per hour) |
| Real-time view | Available directly on router at **Network > DPI** |
| Default retention | 90 days |
| Maximum retention | Configurable per organization by the administrator |

Snapshots older than the retention period are automatically purged from the database.

## Use Cases

**Bandwidth Planning** — Identify which applications consume the most capacity and plan WAN upgrades accordingly.

**Policy Enforcement** — Use App Intelligence groups to reference applications in QoS or traffic-steering policies. For example, throttle P2P traffic on cellular WAN links.

**Security Incident Investigation** — Filter by the Security Risk category or a specific device to trace suspicious application activity by timestamp.

**Compliance Reporting** — Generate a traffic analytics report to demonstrate that prohibited application categories are blocked or throttled on your network.

## Accessing DPI Analytics

1. Log in to the controller.
2. In the left navigation, click **Application Intelligence**.
3. The **Overview** tab loads automatically, showing fleet-wide summary data for the past 24 hours.
4. Use the time range selector (top-right of any chart) to adjust the analysis window.
5. Use the **Topology** and **Device** filters to focus on a specific site or device.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| No data in DPI Overview | Routers not sending snapshots | Verify the router has internet connectivity to the controller URL and DPI is enabled in the device configuration |
| Data stops after a date | Router went offline | Check **Devices > Devices** for that device; reconnect and snapshots will resume automatically |
| Some applications show as "Unknown" | Flow matched no signature | Update the application signature database via **Application Intelligence > Applications** |
| Dashboard shows "No data for selected range" | Selected time range predates data collection | Expand the time range or choose a period after DPI was first enabled |

!!! info "See Also"
    - [Traffic Analysis](traffic-analysis.md) — Time-series charts and trend view
    - [App Intelligence](app-intelligence.md) — Application database and custom groups
    - [Alerts](alerts.md) — Configure threshold-based DPI alerts
    - [Reports](../11-reports/templates.md) — Schedule traffic analytics reports via email
