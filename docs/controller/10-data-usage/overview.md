# Data Usage Dashboard Overview

## Overview

The Data Usage Dashboard shows cumulative bandwidth consumption across your entire fleet — broken down by topology, device, WAN link type, application category, and individual application. It is the primary tool for tracking how much data each site and device is consuming and for spotting trends before they become billing or capacity problems.

Navigate to **Data Usage Dashboard** in the left navigation to access this section.

## Dashboard Sections

The dashboard is organized into three main sections:

| Section | Description |
|---------|-------------|
| **Topology Summary** | Fleet-wide Sankey diagram showing data flow from topologies through devices to applications |
| **Per-Device Table** | Sortable table of all devices with total RX, TX, and top application |
| **Time Trend** | Line chart showing aggregate bandwidth over the selected time range |

## Sankey Visualization (5-Level Drill-Down)

The Sankey diagram provides a visual flow map of bandwidth consumption, organized in five levels:

```
Level 1: Topology
    ↓
Level 2: Device
    ↓
Level 3: WAN Type (Fiber, LTE/5G, MPLS, DSL, etc.)
    ↓
Level 4: Application Category (Streaming, Productivity, P2P, etc.)
    ↓
Level 5: Application (YouTube, Zoom, BitTorrent, etc.)
```

The width of each band in the Sankey diagram is proportional to the bandwidth consumed. Hover over any band to see the exact bytes transferred and percentage of total traffic. Click any node to focus the view on that specific topology, device, WAN type, or category.

## Time Range Options

| Range | Description |
|-------|-------------|
| Today | Data from midnight to the current time |
| Last 7 days | Rolling 7-day window |
| Last 30 days | Rolling 30-day window (default view) |
| Last 90 days | Full retention window view |
| Custom | Select any start and end date within the 90-day retention period |

## Bandwidth Units

The dashboard auto-scales values for readability:

| Scale | Threshold |
|-------|-----------|
| KB | Transfers under 1 MB |
| MB | Transfers under 1 GB |
| GB | Transfers under 1 TB |
| TB | Very large transfers |

All values represent total bytes transferred (RX + TX combined unless otherwise labeled).

## Data Sources

The Data Usage Dashboard combines two data streams:

- **DPI Snapshots** (hourly) — Application-level breakdown by category and individual app. Received from routers every 60 minutes via the DPI sink endpoint.
- **Interface Counters** (aggregated) — Total bytes per WAN interface. Used for the WAN Type breakdown when DPI data is unavailable for a device.

If a device has DPI disabled, WAN interface counter data is still displayed but without the application-level drill-down.

## Exporting Data

To download a full usage report:

1. Set the desired time range and apply any topology or device filters.
2. Click **Export CSV** at the top-right of the Per-Device table.
3. The CSV downloads immediately and contains:
   - Device Name, Topology, WAN Type, RX Bytes, TX Bytes, Top Application, Top Category, Period Start, Period End

For organization-wide exports covering all devices and all dates within the retention window, use **Report > Export** instead, which supports PDF formatting and email delivery.

## Summary Cards

Four summary cards at the top of the dashboard give a quick fleet-wide snapshot:

| Card | Metric |
|------|--------|
| **Total Data** | Sum of all RX + TX bytes across all devices in the selected period |
| **Top Device** | Device with highest total consumption and its volume |
| **Top Application** | Application with highest bandwidth and the percentage of total it represents |
| **Cellular Usage** | Total data consumed over LTE/5G WAN links (useful for billing) |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Sankey diagram shows no level 4/5 data | DPI not enabled on routers | Enable DPI in device configuration and wait for the next hourly snapshot |
| Device shows 0 bytes | Device has been offline | Check **Devices > Devices**; data will backfill when device reconnects if snapshots were buffered |
| Custom date range shows no data | Range predates data collection start | Select a more recent range; retention is a maximum of 90 days |
| WAN type shows as "Unknown" | Interface metadata missing carrier type | Verify WAN interface labels in the device configuration match known type values (fiber, lte, dsl, mpls) |

!!! info "See Also"
    - [Per-Device Analytics](per-device.md) — Drill into individual device consumption
    - [Cellular Analytics](cellular.md) — Track LTE/5G usage for billing reconciliation
    - [DPI Analytics Overview](../09-dpi/overview.md) — How application classification data is collected
    - [Reports](../11-reports/templates.md) — Schedule automated data usage reports
