# Logs

## Overview

The Logs section provides an audit trail of all access events on the controller — logins, logouts, page accesses, and API calls. Use this section to review who accessed the controller, when, and from where.

Navigate to **Logs** in the controller sidebar.

---

## Access Event Log

Each row in the access event log represents a single user interaction:

| Field | Description |
|-------|-------------|
| **Timestamp** | Date and time of the event (UTC) |
| **User** | Username of the actor |
| **Action** | Type of event (login, logout, access, api_call) |
| **IP Address** | Source IP of the request |
| **User Agent** | Browser or API client that made the request |
| **Path** | URL path accessed |
| **Method** | HTTP method (GET, POST, etc.) |
| **Status Code** | HTTP response code |
| **Organization** | Org context of the request |

---

## Filtering Logs

1. Navigate to **Logs**
2. Use the filter sidebar to narrow by:
   - **User** — events by a specific operator
   - **Action** — filter to login/logout only
   - **IP Address** — events from a specific IP
   - **Date Range** — custom time window
   - **Status Code** — filter to failed requests (4xx, 5xx)

---

## Event Types

| Action | Description |
|--------|-------------|
| `login` | User logged in successfully |
| `login_failed` | Failed login attempt |
| `logout` | User logged out |
| `password_changed` | User changed their password |
| `api_call` | Token-authenticated API request |
| `admin_access` | Admin panel page accessed |

---

## Security Monitoring

The Logs section is the primary tool for:

- **Detecting brute-force** — repeated `login_failed` events from the same IP
- **Reviewing access patterns** — unusual access times or unknown IPs
- **Incident investigation** — reconstruct what an operator did before an issue occurred
- **Compliance auditing** — demonstrate access control to auditors

---

## Log Retention

Access logs are retained for **30 days** by default. Logs older than the retention period are automatically deleted. Contact your system administrator to adjust retention if longer audit trails are required.

---

## Exporting Logs

To export logs for external SIEM integration:

1. Filter to the desired time range
2. Click **Export CSV** at the top of the log list
3. The CSV includes all visible columns for the filtered records

---

## See Also

- [Audit Logging](../15-admin/audit-logging.md)
- [Users & Organizations](../13-multi-tenancy/users.md)
- [Administration](../15-admin/django-admin.md)
