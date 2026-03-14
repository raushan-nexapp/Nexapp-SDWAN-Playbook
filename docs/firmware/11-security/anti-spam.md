# Anti-Spam

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Anti-Spam feature filters inbound email traffic to detect and block unsolicited messages. It uses a scoring engine (Rspamd) integrated with the Postfix mail transfer agent to classify emails based on domain reputation, keyword patterns, and configurable scoring thresholds. You can manage trusted and blocked domain lists, create keyword-based filtering rules, and view spam statistics.

## Prerequisites

- The Postfix and Rspamd packages are installed on the router.
- Your router handles mail relay or acts as an email gateway for your network.

## Configuration

Navigate to **Security > Anti-Spam**.

The page has three tabs: **Program Setting**, **Rule Setting**, and **Statistics**.

### Program Setting Tab

Configure the spam filtering engine and mail relay.

| Field | Description |
|---|---|
| **Service Status** | Toggle spam filtering on or off. |
| **Relay Host** | The upstream mail server hostname or IP, e.g., `mail.example.com`. |
| **Port** | The SMTP port for the relay host (`0`--`65535`), e.g., `587`. |
| **TLS Security Level** | Select **None**, **May** (opportunistic TLS), or **Encrypt** (mandatory TLS). |
| **TLS Wrapper** | Enable TLS wrapper mode (implicit TLS on connection). |
| **SASL Auth Enable** | Enable SMTP authentication to the relay host. |
| **Username / Password** | Credentials for SMTP authentication. |
| **Default Action** | Action for unclassified mail: **Accept** or **Reject**. |
| **Worker IP** | IP address for the Rspamd worker socket, e.g., `192.168.1.1`. |
| **Timeout** | Scanning timeout in seconds. |
| **Reject Score** | Score threshold above which emails are rejected (e.g., `15`). |
| **Grey List Score** | Score threshold for greylisting (e.g., `6`). Emails between the greylist and reject scores are temporarily deferred. |

Click **Save** to apply the configuration.

**Download Certificate:** Click the **Download Certificate** button in the header to download the mail server TLS certificate for client configuration.

### Rule Setting Tab

Manage domain-based and keyword-based filtering rules.

**Domain Rules:**

- **Trusted Domains (Allowlist):** Emails from these domains bypass spam filtering.
- **Blocked Domains (Blocklist):** Emails from these domains are always marked as spam.

To add a domain rule, click **Add Rule**, enter the rule name, domain, and select the list (trusted or blocked). Click the status badge on any rule to toggle it between enabled and disabled.

**Keyword Filtering:**

Keyword rules assign a spam score to emails containing specific words or phrases. Each rule includes:

| Field | Description |
|---|---|
| **Rule Name** | A descriptive name for the keyword rule. |
| **Score** | The spam score added when keywords are matched. |
| **Filter Type** | The list category for the rule. |
| **Keywords** | One or more words that trigger the rule. |

Click **Add Keyword** to create a keyword rule. Click the status badge to toggle rules on or off.

### Statistics Tab

View spam filtering metrics including total emails scanned, spam detected, and rejection rates.

## Verification

1. After enabling the service, send a test email through the router and confirm it is delivered.
2. Send an email from a blocked domain and verify it is rejected.
3. Check the **Statistics** tab to confirm the counters increment.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Legitimate emails being rejected | The reject score threshold is too low. | Increase the **Reject Score** value in **Program Setting**. Add trusted sender domains to the allowlist. |
| Spam emails not being filtered | The service is disabled or the reject score is too high. | Verify the service toggle is on. Lower the **Reject Score** threshold. |
| "Failed to load settings" error | The anti-spam service is not installed. | Verify the Rspamd and Postfix packages are installed on the router. |
| SMTP relay connection fails | Incorrect relay host, port, or credentials. | Verify the relay host is reachable. Test the credentials independently. Check the TLS security level matches the relay server requirements. |

## See Also

- [Antivirus](antivirus.md)
- [Security Analytics](analytics.md)
