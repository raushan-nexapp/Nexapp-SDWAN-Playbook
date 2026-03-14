# Health Dashboard

!!! note "Standalone & Controller-Managed"
    The health dashboard is available in both standalone and controller-managed modes. It displays real-time link health data collected by the bonding protocol.

## Overview

The Health Dashboard provides a real-time view of WAN link health metrics for all SD-WAN members. It displays RTT (round-trip time), jitter, packet loss, MOS (Mean Opinion Score), quality classification, and SLA compliance status for each WAN link. The dashboard auto-refreshes every few seconds to show current conditions.

Navigate to **Policy Engine > Performance SLA** to access the Health Dashboard. It is the default view when you open the Performance SLA page.

## Prerequisites

- SD-WAN is configured with at least one active overlay tunnel and one WAN member (see [SD-WAN Fabric Overview](../05-sdwan/overview.md)).
- The bonding daemon is running and collecting health metrics.
- At least one path monitor is configured to generate health data (see [Path Monitors](path-monitors.md)).

## Dashboard Metrics

The health table displays one row per WAN member with the following columns:

| Column | Description |
|--------|-------------|
| **Member** | The WAN member name (e.g., `wan1`, `wan2`). |
| **RTT (ms)** | Round-trip time in milliseconds. Lower values indicate a faster link. Typical values: LAN < 1 ms, broadband 10--50 ms, cellular 30--100 ms. |
| **Jitter (ms)** | Variation in RTT over time, measured in milliseconds. Lower is better. Jitter above 30 ms degrades voice and video quality. |
| **Loss (%)** | Percentage of packets lost on this link. Any loss above 0% indicates congestion or link instability. |
| **MOS** | Mean Opinion Score, a calculated voice quality metric from 1.0 (unusable) to 5.0 (excellent). Based on RTT, jitter, and loss using the E-model algorithm. MOS above 4.0 is considered good for VoIP. |
| **Quality** | Classification badge based on current metrics: **Good** (green), **Degraded** (yellow), or **Bad** (red). |
| **SLA Met** | Whether the link meets the configured SLA thresholds. Shows a green checkmark or red cross. |

## Reading the Dashboard

- **Green quality badge** -- The link is healthy and within normal operating parameters.
- **Yellow quality badge** -- The link is experiencing elevated latency, jitter, or loss. Performance-sensitive applications may be affected.
- **Red quality badge** -- The link is severely degraded. The bonding protocol may have already failed traffic over to a better link.

The **SLA Met** column reflects whether the link meets the thresholds defined in your path monitors. If no SLA thresholds are configured, this column defaults to the link's availability status.

## Configuration

The Health Dashboard is a read-only monitoring view. You do not configure settings on this page. To change what metrics are collected and what thresholds define SLA compliance:

- Create or edit path monitors to define probe targets and SLA thresholds (see [Path Monitors](path-monitors.md)).
- Create quality tiers to classify link health into tiers (see [Quality Tiers](quality-tiers.md)).

## Verification

1. Navigate to **Policy Engine > Performance SLA** and confirm the health table displays rows for all active WAN members.
2. Verify that RTT, jitter, and loss values are non-zero (indicating the probe is running).
3. Compare displayed metrics with an independent measurement (e.g., manual ping) to confirm accuracy.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Dashboard shows "No members configured" | SD-WAN bonding is not configured or the daemon is not running | Configure the SD-WAN overlay and add at least one WAN member. See [SD-WAN Fabric Overview](../05-sdwan/overview.md). |
| All metrics show 0.0 | No path monitors are configured, or the probe target is unreachable | Create a path monitor with a reachable target (e.g., `8.8.8.8`). See [Path Monitors](path-monitors.md). |
| Dashboard shows "Error fetching status" | The bonding daemon crashed or the device API is unavailable | Check the device status page for errors. Restart the SD-WAN service if needed. |
| MOS score is always 0.0 | MOS requires RTT, jitter, and loss data from an active health probe | Ensure at least one path monitor is running and collecting data. |

!!! info "See Also"
    - [Path Monitors](path-monitors.md) -- Configure health probes and SLA thresholds
    - [Quality Tiers](quality-tiers.md) -- Classify link health into quality profiles
    - [Traffic Steering](traffic-steering.md) -- Steer traffic based on link quality
    - [Tier Matrix](tier-matrix.md) -- Visual grid of link quality per monitor
