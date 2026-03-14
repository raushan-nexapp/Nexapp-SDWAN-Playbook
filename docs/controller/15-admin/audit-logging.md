# Audit Logging

## Overview

The Nexapp SDWAN Controller records an audit trail of all user activity: every login, logout, page visit, API call, and data modification is logged with a timestamp, user identity, source IP address, and result. Audit logs provide accountability, support compliance requirements, and enable forensic investigation of configuration changes.

Audit logs are **append-only** — they cannot be modified or deleted through the web interface or API, ensuring the integrity of the audit trail.

## Navigating to Audit Logs

Go to **SD-WAN Fabric > Audit Log** in the left navigation sidebar.

Alternatively, superusers can access the raw audit event records at `/admin/accesslog/accessevent/`.

## What Is Logged

Every access event record captures the following information:

| Field | Description | Example |
|-------|-------------|---------|
| **Timestamp** | UTC date and time of the event | `2026-01-15 14:32:07 UTC` |
| **User** | Username of the authenticated user | `john.smith` |
| **IP Address** | Source IP of the request | `198.51.100.45` |
| **Action** | Type of action performed | `login`, `api_read`, `api_write`, `logout` |
| **Resource** | The object that was accessed or modified | `Topology: Main Office Hub-Spoke` |
| **Method** | HTTP method used | `GET`, `POST`, `PATCH`, `DELETE` |
| **Result** | Outcome of the action | `success`, `forbidden`, `not_found` |
| **Organization** | Organization context of the accessed resource | `Acme Corporation` |

## Filtering Audit Logs

Use the filters on the **Audit Logs** page to narrow results:

| Filter | Options |
|--------|---------|
| **User** | Filter by specific username |
| **IP Address** | Filter by source IP (useful for investigating suspicious access) |
| **Action** | `login`, `logout`, `api_read`, `api_write`, `admin_access` |
| **Result** | `success`, `forbidden`, `error` |
| **Organization** | Filter by organization |
| **Date Range** | From / To date pickers |

**Example: Find all failed login attempts in the past 7 days:**

1. Go to **SD-WAN Fabric > Audit Log**.
2. Set **Action** to `login`.
3. Set **Result** to `forbidden`.
4. Set **Date Range** to the past 7 days.
5. Click **Apply Filters**.

## Exporting Audit Logs

Download audit logs as CSV for compliance reporting or SIEM integration:

1. Apply the desired filters to scope the export.
2. Click **Export CSV** in the top-right corner.
3. Save the file.

The CSV includes all visible columns and respects the current filter settings.

## Failed Login Tracking

The controller monitors failed login attempts to detect brute-force attacks:

- Repeated failed logins from the same IP address are flagged in the audit log with `result: forbidden`.
- After 5 consecutive failed logins from the same IP within 10 minutes, the controller logs an alert-level event.
- Account lockout (if configured) prevents further login attempts after the threshold is exceeded.

To review failed login activity:

1. Go to **SD-WAN Fabric > Audit Log**.
2. Filter by **Action** = `login` and **Result** = `forbidden`.
3. Sort by **IP Address** to group attempts from the same source.

## Log Retention

Audit log retention is configurable in the controller settings:

| Log Type | Default Retention |
|----------|------------------|
| Access events (login/logout) | 30 days |
| API call events | 30 days |
| Data modification events | 90 days |

Logs older than the retention period are automatically purged by the scheduled cleanup task that runs daily.

To extend retention, update the `AUDIT_LOG_RETENTION_DAYS` and `ACCESS_LOG_RETENTION_DAYS` settings in the controller configuration file and restart the application service.

## API Access for SIEM Integration

Programmatic access to audit logs is available for Security Information and Event Management (SIEM) systems:

```
GET /api/v1/accesslog/
```

This endpoint is restricted to superuser tokens. Use the same query parameters as the web filter (e.g., `?action=login&result=forbidden&start_date=2026-01-01`).

**Example — Pull recent failed logins for SIEM:**

```bash
curl -s \
  -H "Authorization: Token <superuser-token>" \
  "https://203.0.113.10/api/v1/accesslog/?action=login&result=forbidden&page_size=100"
```

## Compliance Considerations

The audit log system is designed to meet common compliance requirements:

| Requirement | Implementation |
|-------------|---------------|
| **Tamper-proof records** | Append-only storage; no delete or modify through UI or API |
| **User accountability** | Every action linked to an authenticated user identity |
| **IP attribution** | Source IP recorded for every event |
| **Time accuracy** | All timestamps stored in UTC; displayed in user's configured timezone |
| **Exportable records** | CSV export with full field set |
| **Configurable retention** | Retention period configurable per compliance requirement |

For PCI-DSS, ISO 27001, or SOC 2 audits, export the relevant date range and present the CSV to your auditor.

## See Also

- [User Management](../13-multi-tenancy/users.md) — Managing user accounts
- [Administration Panel](django-admin.md) — Direct database access for audit records
- [Health Monitoring](health-monitoring.md) — System health and service status
- [Common Issues](../16-troubleshooting/common-issues.md) — Troubleshooting access problems
