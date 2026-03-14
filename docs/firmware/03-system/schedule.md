# Scheduled Tasks

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Scheduled Tasks page lets you automate recurring operations on your NexappOS router, such as periodic reboots or custom commands. Each task can run at a specific date and time or repeat at a fixed interval. You can enable or disable individual tasks without deleting them.

## Configuration

Navigate to **System > Schedule**.

### Adding a Scheduled Task

1. Click **Add** to open the task drawer.
2. Fill in the following fields:

| Field | Description |
|---|---|
| **Service** | Toggle to enable or disable this task. |
| **Task Name** | A unique name for the task (max 64 characters), e.g., `nightly-reboot`. |
| **Task Type** | Select **Reboot** to restart the router, or **Custom Command** to run a shell command. |
| **Action** | (Custom Command only) The command to execute, e.g., `/usr/bin/my-script.sh`. |
| **Time Mode** | **Range** for a specific date and time, or **Interval** for recurring execution. |

**If Time Mode is Range:**

| Field | Description |
|---|---|
| **Clock Range** | Start and end time (the task executes within this window). |
| **Day** | Day of the month (`1`--`31`). |
| **Month** | Month of the year. |
| **Year** | Four-digit year, e.g., `2026`. |

**If Time Mode is Interval:**

| Field | Description |
|---|---|
| **Interval (minutes)** | How often the task repeats (`1`--`1440` minutes). |

3. Click **Add Task** to save.

### Editing a Task

1. Locate the task in the table.
2. Click **Edit** to open the task drawer with pre-filled values.
3. Modify the desired fields (the task name cannot be changed).
4. Click **Save Changes**.

### Deleting a Task

1. Click **Delete** next to the task you want to remove.
2. A confirmation dialog appears. Click **Delete** to confirm.

## Verification

1. After adding a task, confirm it appears in the **Scheduled Tasks** table with the correct type, mode, and status.
2. For interval-based tasks, wait for one interval to pass and check system logs to confirm execution.
3. For a reboot task, verify the system uptime resets at the scheduled time.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Task shows "Disabled" in the status column | The service toggle was set to off when the task was created. | Edit the task and toggle **Service** to enabled. |
| Scheduled reboot did not occur at the expected time | The router clock is not synchronized. | Navigate to **System > Settings** and verify NTP is configured and the time zone is correct. |
| Custom command task has no effect | The command path is incorrect or the script lacks execute permissions. | SSH into the router and verify the command runs manually. Check file permissions. |
| "Failed to save schedule task" error | The controller backend is not reachable. | Verify the router has network connectivity. Retry after a few seconds. |

## See Also

- [Reboot & Shutdown](reboot-shutdown.md)
- [Settings](settings.md)
