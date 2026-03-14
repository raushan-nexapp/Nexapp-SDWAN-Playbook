# Quality Tiers

!!! note "Standalone & Controller-Managed"
    Quality tiers can be configured locally or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Quality tiers classify WAN link health into numbered levels based on latency, jitter, and loss thresholds. Each tier defines maximum acceptable values for these metrics. A link is classified into the highest-numbered tier whose thresholds it meets. Tiers feed into traffic steering policies, allowing you to route applications over links that meet specific quality requirements.

For example, you might define:

- **Tier 1** (Gold): latency <= 50 ms, jitter <= 10 ms, loss <= 0.1% -- for voice and video
- **Tier 2** (Silver): latency <= 100 ms, jitter <= 30 ms, loss <= 1% -- for business applications
- **Tier 3** (Bronze): latency <= 300 ms, jitter <= 50 ms, loss <= 5% -- for bulk transfers

Navigate to **Policy Engine > Performance SLA > Quality Tiers** to manage quality profiles.

## Prerequisites

- At least one path monitor is configured and collecting health data (see [Path Monitors](path-monitors.md)).
- You have identified the quality requirements for your applications (latency, jitter, loss tolerances).

## Configuration

### Creating a Quality Tier

1. Navigate to **Policy Engine > Performance SLA > Quality Tiers**.
2. Click **Add Quality Tier**.
3. Fill in the tier configuration:

| Field | Description |
|-------|-------------|
| **Path Monitor** | The path monitor this tier applies to. Select from the list of configured monitors. |
| **Tier ID** | A numeric tier level (1--9). Lower numbers represent higher quality. Tier 1 is the best quality. |
| **Max Latency (ms)** | Maximum RTT for this tier. Links with latency above this value do not qualify. Range: `1`--`10000`. |
| **Max Jitter (ms)** | Maximum jitter for this tier. Range: `1`--`5000`. |
| **Max Loss (%)** | Maximum packet loss percentage for this tier. Range: `0`--`100`. |
| **Min MOS Score** | (Optional) Minimum MOS score for this tier. Range: `1.0`--`4.4`. Leave empty for no MOS requirement. |

4. Click **Add** to save the tier.

!!! tip
    Create at least three tiers (e.g., Tier 1 for voice, Tier 2 for business apps, Tier 3 for best-effort) to give traffic steering enough flexibility to route different applications appropriately.

### Editing and Deleting Tiers

- Click **Edit** on a tier row to modify its thresholds. The path monitor and tier ID cannot be changed after creation.
- Click **Delete** to remove a tier. Traffic steering policies that reference the deleted tier will fall back to default behavior.

## How Tier Classification Works

The bonding protocol evaluates each WAN member's current health metrics against the tier thresholds for each path monitor:

1. The system checks the member's RTT, jitter, and loss against the tier's maximum values.
2. A link qualifies for a tier only if **all** its metrics are within the tier's limits.
3. The link is classified into the lowest-numbered (best) tier it qualifies for.
4. If a link does not meet any tier's requirements, it is classified as untiered.

You can view the current tier classification for all members on the [Tier Matrix](tier-matrix.md) page.

## Verification

1. After creating tiers, navigate to **Policy Engine > Performance SLA > Tier Matrix** to see the real-time tier classification grid.
2. Verify that links with low latency and loss are classified into the expected high-quality tier (e.g., Tier 1).
3. Intentionally degrade a link (if testing) and observe the tier changing to a lower quality level.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Link not matching expected tier | One or more metrics exceed the tier's thresholds | Check the [Tier Matrix](tier-matrix.md) to see which specific metric (latency, jitter, or loss) is disqualifying the link. Adjust tier thresholds or investigate the link issue. |
| All links classified as the lowest tier | Tier thresholds are too strict for the current link quality | Widen the thresholds (e.g., increase Max Latency from `50` to `100` ms). Monitor baseline link quality first before setting tight thresholds. |
| "No path monitors" warning | No path monitors are configured | Create at least one path monitor before adding quality tiers. See [Path Monitors](path-monitors.md). |

!!! info "See Also"
    - [Path Monitors](path-monitors.md) -- Configure health probes that quality tiers evaluate
    - [Tier Matrix](tier-matrix.md) -- Visual real-time tier classification grid
    - [Traffic Steering](traffic-steering.md) -- Use tier requirements in steering policies
    - [Health Dashboard](health-dashboard.md) -- View raw link health metrics
