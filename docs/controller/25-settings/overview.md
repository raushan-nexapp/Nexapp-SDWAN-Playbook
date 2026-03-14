# Settings

## Overview

The Settings section provides organization-level and system-level configuration for controller behavior, including SLA metric thresholds, data retention policies, notification preferences, and integration settings.

Navigate to **Settings** in the controller sidebar.

---

## SLA Metric Settings

SLA Metric Thresholds define the numeric limits used to trigger alerts and steer traffic:

1. Navigate to **Settings > SLA Metrics**
2. Select or create a threshold configuration

| Field | Description | Default |
|-------|-------------|---------|
| **Latency Warning** | Latency (ms) that triggers a warning | 100 ms |
| **Latency Critical** | Latency (ms) that triggers a critical alert | 200 ms |
| **Jitter Warning** | Jitter (ms) warning threshold | 30 ms |
| **Jitter Critical** | Jitter (ms) critical threshold | 60 ms |
| **Packet Loss Warning** | Packet loss (%) warning | 1% |
| **Packet Loss Critical** | Packet loss (%) critical | 5% |
| **Bandwidth Min** | Minimum acceptable bandwidth (Mbps) | 1 Mbps |

---

## Data Retention Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **DPI Snapshot Retention** | 90 days | How long raw DPI snapshot data is kept |
| **Metric Retention** | 365 days | How long time-series metrics are kept |
| **Log Retention** | 30 days | How long access and audit logs are kept |
| **Deploy History Retention** | Unlimited | Deployment records are kept indefinitely |

To change retention: contact your system administrator to update the `settings.py` configuration.

---

## Email / SMTP Settings

Configure outbound email for report scheduling and alerts:

| Setting | Description |
|---------|-------------|
| **SMTP Host** | Mail server hostname |
| **SMTP Port** | Port (587 for STARTTLS, 465 for SSL) |
| **From Address** | Sender address for all controller emails |
| **Username / Password** | SMTP authentication |

These settings are configured at the server level in the controller's environment configuration file.

---

## Organization Settings

Each organization can configure:

| Setting | Description |
|---------|-------------|
| **Timezone** | Used for scheduled report times |
| **Allowed Devices** | Maximum number of devices this org can register |
| **Email Domain** | Auto-assign users registering with this domain |

Access: **Users & Organizations > Organizations > [org] > Edit**

---

## API Token Management

Each user has a personal API token for programmatic access:

1. Log in to the controller
2. Click your username in the top-right corner
3. Select **Profile**
4. Copy or regenerate your **API Token**

The token is used in the `Authorization: Token <key>` header for all API requests.

---

## See Also

- [Users & Organizations](../13-multi-tenancy/users.md)
- [REST API Authentication](../14-api/authentication.md)
- [Performance SLA](../06-policies/sla.md)
