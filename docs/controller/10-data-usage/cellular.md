# Cellular Analytics

## Overview

Cellular Analytics tracks data consumption on LTE and 5G WAN links separately from wired connections. This is essential for organizations using cellular as a primary or backup WAN link, where every gigabyte has a cost. Use this view to monitor usage against your data plan, set overage alerts, and export billing-reconciliation reports.

Navigate to **Data Usage Dashboard > Cellular** to access this view.

## Why Cellular Analytics

Unlike wired broadband with unlimited data plans, cellular WAN links are typically sold with a monthly data cap and per-GB overage charges. Without visibility into cellular consumption, organizations face:

- Unexpected overage bills from the carrier
- Throttling or service suspension when the cap is reached
- No audit trail for billing disputes with the carrier

Cellular Analytics provides the visibility needed to manage these risks proactively.

## What the Dashboard Shows

The Cellular Analytics page includes:

| Section | Description |
|---------|-------------|
| **Fleet Summary** | Total cellular usage across all devices in the selected period |
| **Per-SIM Table** | Usage broken down by SIM card / carrier for each device |
| **Billing Cycle Gauge** | Visual indicator of current-cycle usage vs plan limit |
| **Trend Chart** | Daily cellular usage over the selected date range |
| **Overage Risk Devices** | Devices projected to exceed their data cap before the billing cycle ends |

## Carrier Detection

The controller identifies cellular WAN links automatically based on the WAN interface type configured on the device. Links labeled as `lte`, `5g`, or `cellular` in the device configuration are categorized as cellular for analytics purposes.

Where multiple SIM cards are present (dual-SIM devices or LTE bonding setups), the controller tracks each SIM separately using the interface name as the identifier (e.g., `wwan0`, `wwan1`).

## Configuring Billing Cycles

Each carrier relationship may have a different billing cycle start date. Configure this per device to ensure accurate period-to-date calculations:

1. Navigate to **Data Usage Dashboard > Cellular**.
2. Click **Configure** next to the device or SIM you want to configure.
3. Set the **Billing Cycle Start Day** (1–31). If your billing cycle starts on the 15th, enter 15.
4. Set the **Monthly Data Cap** in GB (e.g., 50 for a 50 GB plan).
5. Click **Save**.

The Billing Cycle Gauge resets automatically on the configured start day each month.

## Usage Gauges

Each configured SIM displays a circular gauge showing:

- **Used** — GB consumed in the current billing cycle
- **Remaining** — GB remaining before the cap is reached
- **Projected** — Estimated usage by end of cycle based on daily average

| Gauge Color | Meaning |
|-------------|---------|
| Green | Less than 70% of cap used |
| Orange | 70–90% of cap used |
| Red | Over 90% of cap used or cap exceeded |

## Overage Alerts

Set up proactive alerts so you are notified before hitting the cap:

1. Open the device's cellular configuration (see above).
2. Under **Overage Alerts**, configure:
   - **Warning threshold** — Alert when usage reaches this percentage of the cap (e.g., 80%).
   - **Critical threshold** — Alert at this percentage (e.g., 95%).
   - **Recipients** — Email addresses to notify.
3. Click **Save**.

When an alert triggers, an email is sent with the current usage, cap value, days remaining in the cycle, and a direct link to the Cellular Analytics view for that device.

## Exporting for Billing Reconciliation

To generate a carrier billing report:

1. Set the date range to match your billing cycle (e.g., March 15 – April 14).
2. Click **Export CSV**.
3. The CSV contains:
   - Device Name, SIM/Interface, Carrier (if detected), Daily RX Bytes, Daily TX Bytes, Daily Total, Period Start, Period End, Billing Cycle Total

Import this CSV into your billing system or compare it against the carrier invoice to verify accuracy.

The export provides a daily breakdown rather than monthly totals, making it possible to identify the specific days where overage occurred.

## Cellular vs Wired Breakdown

On devices with both cellular and wired WAN links, the Data Usage Dashboard separates traffic by link type:

- Navigate to **Data Usage Dashboard > Per-Device** and open a device.
- The WAN Member Breakdown section shows separate rows for each link type.
- Cellular links are labeled with the SIM interface name and show carrier information if available.

This separation lets you verify that failover events (wired link going down, cellular taking over) are correctly accounted for in billing.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Cellular links not appearing | Interface not labeled as LTE/5G in device config | Verify WAN interface type is set to `lte` or `5g` in the device configuration |
| Billing cycle gauge not resetting | Billing cycle start day not configured | Set the start day in the cellular configuration for that device |
| Usage shows higher than carrier invoice | Device is counting all traffic including VPN overhead | Carrier typically bills at the radio layer before encryption; some overhead discrepancy is expected |
| Overage alert not arriving | SMTP not configured or wrong email | Check **Settings** and verify the recipient address |
| Multiple SIMs showing as one | Both SIMs use the same interface name | Ensure WAN interfaces are named distinctly (e.g., `wwan0` and `wwan1`) |

!!! info "See Also"
    - [Data Usage Overview](overview.md) — Fleet-wide summary including all WAN types
    - [Per-Device Analytics](per-device.md) — Full device consumption detail
    - [Reports](../11-reports/templates.md) — Schedule monthly cellular usage reports by email
