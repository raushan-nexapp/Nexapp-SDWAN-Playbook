# Discovered Devices

## Overview

The Discovered Devices list shows every endpoint (client device) that has been identified by the DPI engine across all managed routers. Each entry is a unique device profile built from MAC address, IP address, hostname, and observed application traffic.

Navigate to **Application Intelligence > Discovered Devices** in the controller sidebar.

---

## What Is Discovered

The DPI engine passively observes traffic passing through managed routers and builds a profile for each unique source. Discovery includes:

| Field | Description |
|-------|-------------|
| **MAC Address** | Hardware address (available for LAN clients) |
| **IP Address** | Last-seen IP address |
| **Hostname** | Reverse DNS or DHCP hostname (if available) |
| **Device Type** | Inferred from traffic: PC, Mobile, IoT, Server |
| **OS Fingerprint** | Operating system guessed from TCP/IP behavior |
| **Top Apps** | Top 5 applications used by this device |
| **First Seen** | Timestamp of first traffic observation |
| **Last Seen** | Timestamp of most recent traffic |
| **Total Bytes** | Cumulative traffic volume |

---

## Viewing the Device List

1. Navigate to **Application Intelligence > Discovered Devices**
2. The table shows all discovered endpoints. Filter by:
   - **Router** — show only devices on a specific managed router
   - **Device Type** — PC, Mobile, Server, IoT
   - **Date Range** — when traffic was last seen

---

## Device Profile Detail

Click a device to see its full profile:

- **Traffic Timeline** — hourly usage over the last 7 days
- **Top Applications** — ranked by bytes consumed
- **Top Categories** — category breakdown
- **Connection Count** — number of flows per time period

---

## Use Cases

| Use Case | How |
|----------|-----|
| Identify unknown devices on LAN | Filter by "Unknown" device type |
| Find rogue IoT devices | Sort by device type = IoT, check top apps |
| Spot high-bandwidth consumers | Sort by Total Bytes descending |
| Track specific client's app usage | Search by IP or MAC address |

---

## Data Retention

Discovered device profiles are retained for 90 days by default (configurable per organization). Devices not seen for 90 days are automatically purged.

---

## See Also

- [Dashboard](overview.md)
- [App Traffic](traffic-analysis.md)
- [Alerts & Anomalies](alerts.md)
