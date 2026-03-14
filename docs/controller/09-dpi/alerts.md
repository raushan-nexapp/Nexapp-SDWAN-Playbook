# Alerts and Anomalies

## Overview

DPI Alerts notify you when traffic conditions exceed defined thresholds or when unexpected application activity is detected. Alerts are evaluated against each incoming hourly snapshot and can trigger email notifications, log entries, or webhook calls.

Navigate to **Application Intelligence > Alerts** to manage alerts.

## Alert Types

| Type | Description | Example |
|------|-------------|---------|
| **Bandwidth Threshold** | Trigger when an application or category exceeds a set volume | Alert when P2P traffic exceeds 500 MB/hour on any device |
| **New Application Detected** | Trigger when an application is seen for the first time on a device or topology | Alert when a gaming application first appears on a corporate site |
| **Anomalous Spike** | Trigger when traffic for an application is significantly higher than its rolling baseline | Alert when Netflix usage is 5x the 7-day average |
| **Security Risk Application** | Trigger when any application with risk level High or Critical is detected | Alert when TOR or coin-mining traffic is seen on any device |

## Active Alerts

The **Alerts** tab shows two sections:

**Active Alerts** — Alerts that have triggered and have not been acknowledged. Each row shows:

| Field | Description |
|-------|-------------|
| Timestamp | When the alert was triggered |
| Type | Alert type (Bandwidth, New App, Anomaly, Security Risk) |
| Device | Which device generated the traffic that triggered the alert |
| Application | Application name that matched the alert condition |
| Metric Value | Observed value (e.g., "720 MB/hour") |
| Threshold | The configured limit that was exceeded |
| Action | Acknowledge or Mute buttons |

**Alert History** — All alerts ever triggered, including acknowledged ones. Searchable by date, device, or application.

## Creating an Alert

1. Navigate to **Application Intelligence > Alerts**.
2. Click **Add Alert**.
3. Fill in the alert form:

| Field | Description |
|-------|-------------|
| **Name** | A descriptive label for this alert rule (e.g., "P2P Over 500MB/hour") |
| **Type** | Select Bandwidth Threshold, New Application, Anomalous Spike, or Security Risk |
| **Scope** | Choose All Devices, a specific Topology, or a specific Device |
| **Application / Category** | The application or category this rule applies to (leave blank for "any") |
| **Threshold** | For bandwidth alerts: enter the limit in MB/hour or GB/day |
| **Action** | Email, Log only, or Webhook |
| **Recipients** | Email addresses (comma-separated) for email actions |
| **Webhook URL** | For webhook actions: the HTTPS endpoint to POST the alert payload to |

4. Click **Save**. The rule is active immediately and will evaluate on the next snapshot.

## Managing Alerts

### Acknowledging an Alert

Acknowledging an alert marks it as reviewed and moves it from the Active list to History. It does not disable the rule — the rule will trigger again if the condition recurs.

1. In the **Active Alerts** list, click **Acknowledge** on the alert row.
2. Optionally add a note (e.g., "Investigated — authorized download").
3. Click **Confirm**.

### Muting an Alert

Muting suppresses a specific alert rule for a defined time window. Use this during scheduled maintenance, large file transfers, or known high-usage periods.

1. Click **Mute** on an active alert or on an alert rule in the **Rules** tab.
2. Select the mute duration: 1 hour, 4 hours, 24 hours, or a custom end time.
3. Click **Apply**. The rule resumes evaluating automatically when the mute period expires.

### Editing or Deleting an Alert Rule

1. Navigate to the **Rules** tab within **Application Intelligence > Alerts**.
2. Click the rule name to edit it.
3. Click **Delete** to remove the rule permanently. This also clears its history.

## Webhook Payload

When an alert triggers with the webhook action, the controller sends a POST request to the configured URL with the following JSON body:

```json
{
  "alert_id": 42,
  "alert_name": "P2P Over 500MB/hour",
  "alert_type": "bandwidth_threshold",
  "triggered_at": "2024-06-15T14:00:00Z",
  "device": "Branch-Mumbai-01",
  "topology": "Mumbai-Region",
  "application": "BitTorrent",
  "category": "P2P",
  "metric_value": 720,
  "threshold": 500,
  "unit": "MB/hour"
}
```

The webhook request includes the header `X-Nexapp-Alert: 1`. Respond with HTTP 200 to acknowledge receipt.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Alert not triggering despite threshold being exceeded | Rule scope set to wrong topology or device | Check the Scope field on the rule; ensure it covers the device generating traffic |
| Email not received for triggered alert | SMTP not configured on the controller | Ask your administrator to verify SMTP settings in **Settings** |
| Webhook returns 4xx error | Authentication required at webhook endpoint | Add authentication headers to the request via the **Webhook Headers** field on the rule |
| Alert triggers every hour despite acknowledging | Condition continues to be met in every snapshot | The condition is ongoing — mute the rule and investigate the source device |
| "No rules configured" after importing settings | Alert rules are organization-scoped | Ensure you are logged in under the correct organization |

!!! info "See Also"
    - [Traffic Analysis](traffic-analysis.md) — Visualize the traffic that triggered the alert
    - [App Intelligence](app-intelligence.md) — View risk levels and create app groups
    - [Reports](../11-reports/templates.md) — Include alert history in scheduled email reports
