# Traffic Analysis

## Overview

The Traffic Analysis view provides time-series charts and ranked tables that show how applications and categories consumed bandwidth across your fleet. Use it to answer questions like "What was our top application at 2 PM yesterday?" or "Which device caused the bandwidth spike last Tuesday?"

Navigate to **Application Intelligence > App Traffic** to access this view.

## Interface Layout

The Traffic Analysis page is divided into four areas:

| Area | Description |
|------|-------------|
| **Filter bar** | Time range, topology, device, and category selectors |
| **Top Applications chart** | Bar chart ranking the top 10 applications by bytes transferred |
| **Top Categories chart** | Donut chart showing bandwidth split by category |
| **Trend view** | Line chart showing selected application or category bandwidth over time |

## Time Range Selector

Use the time range selector (top-right) to control the analysis window:

| Option | Description |
|--------|-------------|
| Last 1 hour | Most recent hourly snapshot |
| Last 6 hours | Last 6 snapshots |
| Last 24 hours | Previous day (default view) |
| Last 7 days | Weekly view |
| Last 30 days | Monthly view |
| Custom | Pick any start and end date within the retention window |

!!! note
    DPI data is collected as hourly snapshots. Selecting "Last 1 hour" shows the most recently received snapshot from each device, which may be up to 60 minutes old. For real-time per-second data, connect directly to the router web UI.

## Filtering Traffic Data

**Filter by Topology** — Select a topology from the dropdown to restrict charts to devices in that topology only. Useful when you manage multiple customer sites and want to isolate analysis.

**Filter by Device** — Select a specific device to show only that router's traffic. The device dropdown is populated after you select a topology.

**Filter by Category** — Click a category label in the Top Categories chart to isolate that category in the Trend view.

## Top Applications Table

Below the charts, a sortable table lists all applications detected in the selected time range:

| Column | Description |
|--------|-------------|
| Application | Application name from the signature database |
| Category | Parent category (Streaming, Social Media, etc.) |
| Bytes In | Download volume (from internet toward LAN) |
| Bytes Out | Upload volume (from LAN toward internet) |
| Sessions | Number of distinct flows detected |
| Peak Time | Hour with the highest bandwidth for this application |
| Device Count | Number of devices that used this application |

Click any column header to sort. Click an application name to open the drill-down view.

## Application Drill-Down

Clicking an application name opens a side panel showing:

- **Devices using this app** — ranked by bytes transferred
- **Hourly trend** — bandwidth for this application over the selected period
- **Top source IPs** — LAN IP addresses generating the most traffic for this application

Use this view to identify which users or devices are responsible for high bandwidth consumption.

## Trend View

The Trend view shows a line chart for one or more selected applications over the selected time range. Each data point corresponds to one hourly snapshot.

To compare applications:

1. Click an application name in the Top Applications table. A colored line is added to the Trend chart.
2. Click additional application names to overlay their trends on the same chart.
3. Click a highlighted application name again to remove it from the chart.

Anomalous spikes — traffic volumes more than two standard deviations above the rolling average — are highlighted in orange on the trend line.

## Exporting Data

To download raw data for the current view:

1. Set your desired time range and filters.
2. Click **Export CSV** (top-right of the table).
3. A CSV file downloads immediately containing all rows from the current filtered view.

The CSV includes: Application, Category, Device, Topology, Bytes In, Bytes Out, Sessions, Timestamp.

For large exports (more than 30 days or 10,000+ rows), the file is prepared in the background and a download link is emailed to you when ready.

## Cross-Reference with Policies

If you identify an application consuming excessive bandwidth, you can immediately jump to the policy engine:

1. Click the application name in the table.
2. In the drill-down panel, click **Create QoS Rule for this App**.
3. The policy builder opens pre-filled with the application name and category.
4. Set a bandwidth limit and click **Save**. The policy is pushed to affected devices on the next deployment.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| All charts show zero | No DPI data received from any device | Verify DPI is enabled on routers and the controller URL is reachable from the devices |
| Application shows "Unknown" | Flow did not match any signature | Check **App Intelligence** for signature update status |
| Export CSV produces empty file | Selected time range has no data | Extend the time range or check device connectivity |
| Anomaly highlights not appearing | Feature requires at least 7 days of baseline data | Allow the system to collect one week of snapshots before anomaly detection activates |

!!! info "See Also"
    - [DPI Analytics Overview](overview.md) — How DPI data collection works
    - [App Intelligence](app-intelligence.md) — Browse and manage the application database
    - [Alerts](alerts.md) — Set automated alerts when traffic thresholds are exceeded
    - [Global Policies](../06-policies/overview.md) — Apply QoS or steering rules based on DPI categories
