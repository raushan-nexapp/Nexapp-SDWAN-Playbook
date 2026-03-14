# Deployment History

## Overview

Every configuration push made through the Nexapp SDWAN Controller is recorded in the
deployment history. History records are immutable — they cannot be edited or deleted —
providing a complete audit trail of who changed what, when, and with what result.

History is accessible at two levels: the topology level (all devices in one topology) and
the global level (all deployments across all topologies).

## Accessing Deployment History

**Global history** — Navigate to **SD-WAN Fabric > Deploy History** in the left menu. This view shows
all deployments across every topology ordered by timestamp (most recent first).

**Topology history** — Open a topology detail page and click the **History** tab. This view
is filtered to show only deployments for devices in that topology.

## History Table Columns

| Column | Description |
|--------|-------------|
| **Timestamp** | Date and time when the deployment was initiated (UTC) |
| **Operator** | Username of the controller user who triggered the push |
| **Topology** | Name of the topology the deployment belongs to |
| **Devices** | Number of devices included in the deployment |
| **Status** | Overall result: Success, Failed, Partial, Running, Pending |
| **Duration** | Total elapsed time from queue to last device confirmation |

## Filtering History

Use the filter bar above the history table to narrow results:

| Filter | Options |
|--------|---------|
| **Topology** | Select one or more topology names |
| **Device** | Filter to deployments that included a specific device |
| **Operator** | Filter to deployments triggered by a specific user |
| **Status** | Success, Failed, Partial, Running, Pending |
| **Date Range** | From / To date pickers (defaults to last 7 days) |

## Deployment Detail View

Click any row in the history table to open the deployment detail view. This page shows:

- **Summary** — overall status, operator, start time, total duration
- **Per-device results** — each device in the deployment with its individual status and duration
- **Configuration diff** — for each device, a side-by-side or unified diff showing exactly
  what configuration changed compared to the previous successful deployment

The diff uses a standard format: lines prefixed with `+` were added, lines prefixed with `-`
were removed, and unchanged lines are shown for context.

## Rolling Back a Deployment

If a recent deployment introduced a problem, you can re-push a previous successful
configuration:

1. Navigate to **SD-WAN Fabric > Deploy History**.
2. Locate the last known-good deployment in the list.
3. Click the deployment row to open the detail view.
4. Click **Re-deploy** in the top-right corner.
5. In the confirmation dialog, verify the target devices and configuration snapshot.
6. Click **Confirm Re-deploy**.

The controller queues a new deployment using the exact configuration snapshot from the
selected history record. The rollback appears as a new entry in the history table — the
original record is preserved unchanged.

!!! tip
    Before rolling back, review the diff on both the current and target records to understand
    exactly what will change on the devices.

## Per-Device Re-deploy

You can also re-deploy to a single device from within a deployment detail view:

1. Open the deployment detail view.
2. Locate the device row.
3. Click **Retry** (for failed devices) or **Re-push** (for previously successful devices).

This pushes only to that one device using the configuration snapshot from the selected
deployment record.

## Audit Trail

Deployment history serves as the authoritative audit trail for configuration changes:

- Records include the operator's username, IP address (if audit logging is enabled), and
  the exact timestamp.
- The configuration snapshot stored with each record reflects the full device config at the
  time of push — not just the diff.
- History records cannot be deleted through the UI or the API. Retention is governed by the
  database storage policy set in **Settings**.

## See Also

- [Configuration Push](config-push.md) — How to initiate a deployment
- [Deployment Pipeline](pipeline.md) — Understand pipeline stages and status indicators
- [Administration](../15-admin/django-admin.md) — Configure audit log retention
