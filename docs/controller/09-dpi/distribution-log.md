# Distribution Log

## Overview

The Distribution Log records every time the controller distributes application signature updates or App Group configurations to managed routers. Use it to verify that DPI policy changes have been delivered to devices and troubleshoot delivery failures.

Navigate to **Application Intelligence > Distribution Log** in the controller sidebar.

---

## What Is Logged

| Event Type | Description |
|------------|-------------|
| **App Group Push** | App Group pushed to a device for policy enforcement |
| **Signature Update** | DPI signature database updated on a device |
| **Category Sync** | Category definitions synced to device |
| **Firewall Rule Sync** | Traffic Application firewall rules pushed to device |

---

## Log Columns

| Column | Description |
|--------|-------------|
| **Timestamp** | When the distribution was initiated |
| **Device** | Target router that received the update |
| **Type** | Event type (see above) |
| **Status** | Success, Failed, Pending |
| **Items** | Number of apps/rules/signatures distributed |
| **Error** | Error message if status is Failed |

---

## Viewing the Log

1. Navigate to **Application Intelligence > Distribution Log**
2. Use filters to narrow results:
   - **Device** — filter by specific router
   - **Status** — show only failures
   - **Date Range** — last 24h, 7d, 30d, or custom

---

## Troubleshooting Failed Distributions

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Status = Failed for all devices | Controller cannot reach devices via ZeroTier | Check ZeroTier network status |
| Status = Failed for one device | Device offline or unreachable | Check device online status in Devices list |
| Status = Pending for > 5 minutes | Task worker backlog | Check background worker health |
| Old App Group still enforced on device | Distribution not yet completed | Wait for next scheduled push or trigger manual sync |

---

## Manual Re-distribution

To force a re-push of App Groups to a specific device:

1. Navigate to **Devices** → select device
2. **Application tab > App Database subtab**
3. Click **Sync** to push the latest App Group and category definitions

---

## See Also

- [App Groups](app-groups.md)
- [Applications](app-intelligence.md)
- [Background Workers](../15-admin/celery.md)
