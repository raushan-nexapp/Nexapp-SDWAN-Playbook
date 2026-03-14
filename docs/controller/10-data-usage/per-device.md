# Per-Device Analytics

## Overview

Per-Device Analytics provides a detailed bandwidth profile for each individual router in your fleet. You can view total consumption, compare devices side-by-side, drill into specific applications, and set per-device data cap alerts.

Navigate to **Data Usage Dashboard > Per-Device** to access this view.

## Device Usage Table

The main table lists every registered device with a summary of its bandwidth consumption for the selected time range:

| Column | Description |
|--------|-------------|
| **Device Name** | Registered device name and topology |
| **Total RX** | Total bytes downloaded (internet → LAN) |
| **Total TX** | Total bytes uploaded (LAN → internet) |
| **Total Combined** | RX + TX sum |
| **Top Application** | Application that consumed the most bandwidth on this device |
| **Top Category** | Application category with the highest usage |
| **Last Updated** | Timestamp of the most recent data snapshot received from this device |
| **WAN Links** | Number of active WAN members |

Click any column header to sort the table. Use the search bar to filter by device name or topology.

## Viewing a Single Device

Click any device row to open its detailed profile page. The profile contains:

**Summary cards**

- Total RX and TX for the selected period
- Average hourly throughput
- Peak usage hour (day and time)
- Days data has been received in the selected range

**Historical Bar Chart** — Daily usage bars for the selected date range. Hover over any bar to see RX and TX values for that day.

**WAN Member Breakdown** — If the device has multiple WAN links, each member's contribution to total traffic is shown as a percentage and absolute value.

**Top Applications table** — The top 10 applications on this device for the selected period, sorted by bytes transferred.

**Top Source IPs** — LAN IP addresses generating the most traffic, mapped to their respective applications where DPI data is available.

## Comparing Devices

To overlay multiple devices on a single chart:

1. In the device usage table, tick the checkbox next to each device you want to compare (up to 5 devices).
2. Click **Compare Selected** above the table.
3. A multi-line chart appears showing each device's daily usage as a separate line in a distinct color.
4. Use the legend to toggle individual devices on or off.

This view is useful for identifying outlier devices consuming disproportionate bandwidth compared to similar branches.

## Setting Per-Device Data Cap Alerts

You can configure a soft and hard threshold for any device's monthly data consumption:

1. Open the device's detail page by clicking its name in the table.
2. Click **Set Data Cap**.
3. Enter the monthly cap in GB.
4. Configure alerts:
   - **80% alert** — Email notification when consumption reaches 80% of the cap.
   - **100% alert** — Email notification when the cap is exceeded.
5. Optionally, enter a webhook URL to receive programmatic notifications.
6. Click **Save**.

The data cap counter resets on the first day of each calendar month. Usage gauge on the device card turns orange at 80% and red at 100%.

## Drill-Down by Application

From the device detail page, click any application in the Top Applications table to see:

- **Hourly trend** — How this application's usage changed over the selected period on this specific device
- **Source IPs** — Which LAN hosts used this application and how much
- **Peak sessions** — The hour with the highest number of concurrent sessions

Use this to identify specific users or hosts responsible for high consumption and address the root cause.

## Exporting Per-Device Data

1. From the device detail page, click **Export CSV**.
2. The CSV contains hourly rows for the selected date range with columns: Timestamp, RX Bytes, TX Bytes, Application, Category, WAN Member.

Alternatively, export the full table from the Per-Device list view:

1. Apply your filters (topology, date range, device search).
2. Click **Export Table CSV**. All visible rows are exported.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Device not appearing in table | Device not registered or has never sent data | Verify device registration under **Devices** and confirm it is online |
| "Last Updated" timestamp is old | Device went offline or DPI sink is not reachable | Check device connectivity and verify the controller API URL is configured on the device |
| Top application shows "Unknown" for all traffic | DPI disabled on this device | Enable DPI in the device configuration and re-deploy |
| Daily bars show gaps | Device was offline on those days | Gaps in the bar chart represent days with no data received |
| Data cap alert not triggering at 80% | Alert recipient email not configured | Edit the data cap settings and verify the recipient email address |

!!! info "See Also"
    - [Data Usage Overview](overview.md) — Fleet-wide Sankey diagram and summary
    - [Cellular Analytics](cellular.md) — Track LTE/5G usage per SIM and carrier
    - [DPI Analytics > Traffic Analysis](../09-dpi/traffic-analysis.md) — Application-level analysis across all devices
