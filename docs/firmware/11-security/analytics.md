# Security Analytics

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Security Analytics dashboard provides a consolidated view of security events across all protection features on your NexappOS router. It aggregates alerts from the intrusion prevention system (IPS), antivirus detections, web filter blocks, anti-spam rejections, and IP blocklist entries into a single dashboard. Use it to identify trends, pinpoint top threat sources, and prioritize security response.

## How to Use

Navigate to **Security > Analytics**.

### Overview Cards

The top row displays five summary cards:

| Card | Description |
|---|---|
| **IPS Alerts** | Total intrusion prevention alerts and the count from the last hour. |
| **AV Detections** | Total antivirus detections (files blocked or quarantined). |
| **Web Filter Blocks** | Total web requests blocked by content filtering, with last-hour count. |
| **Spam Rejected** | Total spam emails rejected, with total emails scanned. |
| **Blocked IPs** | Total IP addresses currently on the blocklist (Threat Shield IP). |

### Top Threats Table

Displays the top 10 IPS signatures that triggered the most alerts, ranked by count. Use this to identify which attack patterns target your network most frequently.

### Top Source IPs Table

Lists the top 10 source IP addresses generating the most security alerts. Investigate high-frequency sources to determine if they are compromised internal hosts or external attackers.

### Top Blocked Destinations Table

Shows the top 10 domains or IP addresses that were blocked by the web filter or threat intelligence. This helps identify which malicious or policy-violating destinations your users attempt to reach most often.

### Log Correlation

At the bottom of the page, the **Log Correlation** section cross-references events from multiple security modules. This helps you identify coordinated attack patterns where the same source IP triggers alerts across IPS, antivirus, and web filtering simultaneously.

Click **Refresh** in the top-right corner to reload all data.

## Verification

1. Generate test traffic that triggers a security event (e.g., access a test URL blocked by the web filter).
2. Navigate to **Security > Analytics** and confirm the event appears in the relevant card and table.
3. Verify the overview card counters increment after the test event.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| All counters show zero | Security features (IPS, antivirus, web filter) are disabled. | Enable at least one security feature and generate test traffic. |
| "Failed to load analytics" error | The analytics service is not running or not installed. | Verify the router firmware is NexappOS 10.01 or later. Reboot the router if the issue persists. |
| Top Sources table is empty but IPS Alerts counter is nonzero | Alert data has not been aggregated yet. | Wait a few minutes for the aggregation cycle to complete, then click **Refresh**. |

## See Also

- [Security Rating](rating.md)
- [IPS](ips.md)
- [Antivirus](antivirus.md)
- [Web Filter](web-filter.md)
- [Threat Shield IP](threat-shield-ip.md)
