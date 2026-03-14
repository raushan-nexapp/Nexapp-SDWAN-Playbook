# Tier Matrix

!!! note "Standalone & Controller-Managed"
    The tier matrix is available in both standalone and controller-managed modes. It displays real-time quality tier assignments.

## Overview

The Tier Matrix is a real-time heatmap grid that shows which quality tier each WAN link currently meets for each configured path monitor. Rows represent WAN members, columns represent path monitors, and each cell shows the tier classification along with the current latency, jitter, and loss values.

The matrix auto-refreshes every 5 seconds to reflect current link conditions.

Navigate to **Policy Engine > Performance SLA > Tier Matrix** to access this view.

## Prerequisites

- At least one WAN member is configured and active (see [Underlay Members](../05-sdwan/underlay-members.md)).
- At least one path monitor is configured and collecting data (see [Path Monitors](path-monitors.md)).
- At least one quality tier is defined for the path monitor (see [Quality Tiers](quality-tiers.md)).

## Reading the Matrix

### Grid Layout

- **Rows** -- One row per WAN member (e.g., `wan1`, `wan2`).
- **Columns** -- One column per configured path monitor.
- **Cells** -- Each cell displays the tier classification and metrics for that member/monitor combination.

### Cell Content

Each cell shows:

- **Tier label** -- e.g., "Tier 1", "Tier 3", or "N/A" if the link does not meet any tier.
- **Metrics summary** -- Current latency / jitter / loss values (e.g., "12ms / 3ms / 0.1%").

Hover over a cell to see a detailed tooltip with exact latency, jitter, loss, and status values.

### Color Coding

| Color | Tier Range | Meaning |
|-------|-----------|---------|
| Green | Tier 1--2 | Good quality. Suitable for voice and video. |
| Yellow | Tier 3--4 | Acceptable quality. Fine for business applications. |
| Orange | Tier 5--6 | Degraded quality. Use for bulk or non-critical traffic only. |
| Red | Tier 7+ | Critical quality. Link is severely impaired. |
| Gray | N/A | No data available or link does not meet any tier. |

## Configuration

The Tier Matrix is a read-only monitoring view. You do not configure settings on this page. To change the matrix content:

- Add or remove WAN members (see [Underlay Members](../05-sdwan/underlay-members.md)).
- Add or remove path monitors (see [Path Monitors](path-monitors.md)).
- Create or adjust quality tier thresholds (see [Quality Tiers](quality-tiers.md)).

## Verification

1. Navigate to **Policy Engine > Performance SLA > Tier Matrix** and confirm the grid displays rows for all active WAN members and columns for all configured path monitors.
2. Verify that color coding matches expected link quality (e.g., a healthy fiber link should show green, a congested cellular link may show yellow or orange).
3. Observe the auto-refresh -- metrics should update every 5 seconds.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Matrix shows all cells as "N/A" (gray) | No quality tiers are defined, or path monitors are not collecting data | Create at least one quality tier for each path monitor. Verify path monitors are enabled and the probe target is reachable. |
| All members show the same tier | Quality tier thresholds are too wide, causing all links to qualify for the same tier | Tighten the tier thresholds to differentiate between link qualities. For example, set Tier 1 latency to `50` ms and Tier 2 to `100` ms. |
| Matrix shows "No tier matrix data available" | No WAN members or path monitors are configured | Configure at least one WAN member and one path monitor with quality tiers. |
| Cells show red but the link seems functional | The link is functional but exceeds the quality tier thresholds | Check the actual latency, jitter, and loss values in the tooltip. The link may be working but with degraded performance. Adjust tier thresholds if they are too strict. |

!!! info "See Also"
    - [Quality Tiers](quality-tiers.md) -- Define the tier thresholds displayed in the matrix
    - [Path Monitors](path-monitors.md) -- Configure the health probes that feed the matrix
    - [Health Dashboard](health-dashboard.md) -- View raw link health metrics
    - [Traffic Steering](traffic-steering.md) -- Use tier requirements in steering decisions
