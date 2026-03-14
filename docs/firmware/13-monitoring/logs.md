# System Logs

!!! note "Standalone & Controller-Managed"
    System logs are available in both modes. Logs are stored and viewed locally on the router.

## Overview

The **System Logs** page displays kernel messages, service events, security alerts, and other system activity. Logs are essential for troubleshooting issues, auditing changes, and understanding router behavior.

Navigate to **Monitoring > Logs** to access this page.

## How to Use

1. Navigate to **Monitoring > Logs**.
2. The log viewer loads the most recent log entries automatically.
3. Use the controls to filter and navigate:

| Control | Description |
|---------|-------------|
| **Search** | Filter log entries by keyword. Matching text is highlighted in the results. |
| **Limit Rows** | Choose how many log lines to display: `100`, `200`, `500`, or `1000`. |
| **Wrap Row** | Toggle line wrapping. When enabled, long log lines wrap to fit the screen. When disabled, lines scroll horizontally. |
| **Pooling** | Toggle automatic refresh. When enabled, the log viewer polls for new entries every 2.5 seconds. |

4. Click the **Download** button (download icon) to export the displayed logs as an Excel file.

## Understanding Log Entries

Each log entry contains a timestamp, a facility/priority level, a service identifier, and the message text. Common service identifiers include:

- **kernel** -- Hardware and driver events
- **firewall** -- Firewall rule matches, blocked connections
- **dhcp** -- DHCP lease events (assignments, renewals, expirations)
- **system** -- Configuration changes, service starts/stops
- **cron** -- Scheduled task execution

!!! tip
    Use the **Search** field to filter logs for a specific service or error message. For example, search for `firewall` to see only firewall events, or search for `error` to find error-level messages.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Logs not appearing or viewer is empty | The log service is not running, or no events have been generated | Refresh the page. If logs remain empty, restart the router and check again. |
| Log file is very large and viewer is slow | The router has been running for a long time without a reboot, and the log buffer is full | Reduce the **Limit Rows** to `100` and use the **Search** filter to narrow results. Consider exporting logs and clearing old entries. |
| Expected events are missing | The log level may be set too high (e.g., only errors are logged, not info messages) | Check the system logging configuration and ensure the appropriate log level is set. |
| Download produces an empty file | No log entries match the current search filter | Clear the search field and try downloading again. |

!!! info "See Also"
    - [Real-Time Monitoring](realtime.md) -- Live dashboard with traffic and security panels
    - [Backup & Restore](../03-system/backup-restore.md) -- Export system configuration
    - [Settings](../03-system/settings.md) -- Configure system logging level
