# DPI Snapshots

## Overview

DPI Snapshots are the raw data records collected from managed routers every hour. Each snapshot captures the application traffic breakdown observed on a specific device during that one-hour window. All charts and analytics in the Application Intelligence section are built from these snapshots.

Navigate to **Application Intelligence > Snapshots** in the controller sidebar.

---

## Snapshot Data Fields

| Field | Description |
|-------|-------------|
| **Device** | Router that generated the snapshot |
| **Timestamp** | Start of the hour-long collection window |
| **Snapshot ID** | Unique identifier |
| **Apps Count** | Number of distinct applications observed |
| **Total Bytes** | Total bytes in this snapshot window |
| **Top Application** | Highest-traffic application in this window |

---

## Viewing Snapshots

1. Navigate to **Application Intelligence > Snapshots**
2. The list shows all collected snapshots. Filter by:
   - **Device** — snapshots from a specific router
   - **Date Range** — custom date range
3. Click a snapshot to see the full per-application breakdown for that hour

---

## Snapshot Detail

Each snapshot detail page shows a table of all applications detected in that hour-long window:

| Column | Description |
|--------|-------------|
| **Application** | Application name |
| **Category** | Application category |
| **Bytes In** | Download bytes |
| **Bytes Out** | Upload bytes |
| **Flows** | Number of TCP/UDP flows |
| **Devices** | Number of source client devices |

---

## Data Collection Frequency

Snapshots are collected **every 60 minutes** from each managed device. The router DPI engine buffers data locally and pushes a summary to the controller REST sink endpoint on the hour. Real-time per-second data is available directly on the router under **Monitoring > Real-Time Traffic**.

---

## Data Retention

Default snapshot retention: **90 days** (configurable per organization). After 90 days, snapshots are automatically deleted. The hourly aggregation means disk space grows linearly with the number of managed devices.

| Devices | Snapshots per day | Retention (90d) |
|---------|------------------|-----------------|
| 10 | 240 | ~21,600 rows |
| 100 | 2,400 | ~216,000 rows |
| 500 | 12,000 | ~1,080,000 rows |

---

## API Access

Snapshots are accessible via the DPI API for programmatic consumption:

```
GET /api/v1/dpi/snapshots/?device=<uuid>&start=<date>&end=<date>
Authorization: Token <key>
```

---

## See Also

- [Dashboard](overview.md)
- [App Traffic](traffic-analysis.md)
- [DPI API](../14-api/dpi.md)
