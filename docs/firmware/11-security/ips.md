# IPS (Intrusion Prevention System)

!!! note "Standalone & Controller-Managed"
    IPS runs locally on the router using signature-based detection. When controller-managed, rule sets and suppression lists can be pushed from the controller.

## Overview

The Intrusion Prevention System (IPS) inspects network traffic in real time using signature matching to detect and block exploit attempts, port scans, protocol anomalies, and known attack patterns. IPS operates inline on the traffic path and can either alert on suspicious traffic or actively block it, depending on your chosen operating mode.

Navigate to **Security > IPS** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router has sufficient CPU and memory for real-time traffic inspection.
- IPS rule sets require internet connectivity for initial download and periodic updates.

## Configuration

The page is organized into six tabs: **Event List**, **Rule Browser**, **Filter Bypass**, **Disabled Rules**, **Suppressed Alerts**, and **Settings**.

### Settings

1. Navigate to the **Settings** tab.
2. Toggle IPS to **Enabled**.
3. Select the operating mode:

| Mode | Behavior |
|------|----------|
| **Alert Only** | Detects threats and logs events but does not block traffic. Use this mode during initial deployment to evaluate false positives. |
| **Block** | Detects threats and actively blocks matching traffic. Use this mode once you have tuned suppressed alerts and disabled rules. |

4. Click **Save**.

### Rule Browser

The **Rule Browser** tab lets you search and browse available IPS signatures by category (e.g., exploit, malware, policy, scan). Each rule shows its signature ID, description, severity, and current status (enabled or disabled).

Use the search bar to find rules by keyword or signature ID.

### Event List

The **Event List** tab displays detected intrusion events. Each event includes:

| Field | Description |
|-------|-------------|
| **Timestamp** | When the event was detected. |
| **Severity** | Alert priority level (high, medium, low). |
| **Signature** | The IPS rule that triggered the event. |
| **Source** | Source IP address and port of the traffic. |
| **Destination** | Destination IP address and port of the traffic. |
| **Action** | Whether the traffic was alerted or blocked. |

### Filter Bypass

The **Filter Bypass** tab lets you exempt specific traffic from IPS inspection. Use this when trusted traffic (such as internal monitoring systems) triggers false positives.

1. Navigate to the **Filter Bypass** tab.
2. Click **Add**.
3. Specify the traffic to bypass (by source/destination IP or network).
4. Click **Save**.

### Suppressed Alerts

The **Suppressed Alerts** tab lists signatures whose alerts you have silenced. Suppressing an alert prevents it from appearing in the Event List, but the rule continues to run in detection mode. Use this for known false positives that you want to monitor without cluttering the event log.

### Disabled Rules

The **Disabled Rules** tab lists signatures you have permanently disabled. Disabled rules are not evaluated at all, which reduces CPU load. Disable rules that are not relevant to your network environment (e.g., signatures for services you do not run).

## Verification

1. Enable IPS in **Alert Only** mode.
2. Generate test traffic that should trigger a signature (e.g., run a port scan from a test device).
3. Check the **Event List** tab for detected events.
4. Switch to **Block** mode and verify that matching traffic is dropped.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Performance degradation with IPS enabled | High traffic volume exceeding router CPU capacity | Disable unnecessary rule categories in the Rule Browser. Consider using Alert Only mode on high-throughput links. |
| False positives on legitimate traffic | IPS signature matches normal traffic patterns | Add the signature to Suppressed Alerts or Disabled Rules. Use Filter Bypass for trusted sources. |
| Rules not updating | No internet connectivity for rule set downloads | Verify the router can reach the internet. Check for pending downloads in the Settings tab. |
| Events show "alert" but traffic is not blocked | IPS is running in Alert Only mode | Switch to Block mode in the Settings tab. |

!!! info "See Also"
    - [InstaShield IP](threat-shield-ip.md) -- Complement IPS with IP-level blocklists
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Network-level access control
