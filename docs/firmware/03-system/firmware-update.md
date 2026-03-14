# Firmware Update

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

Firmware Update allows you to upgrade your NexappOS router to the latest software release. You can check for updates from the Nexapp repository, schedule upgrades for a maintenance window, or upload a firmware image file manually. Keeping firmware current ensures you have the latest security patches, bug fixes, and feature improvements.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For online updates: the router has outbound internet access to reach the Nexapp update repository.
- For manual updates: you have downloaded the firmware image file (`.img` or `.bin`) from Nexapp.
- **Recommended:** Create a backup before updating (see [Backup and Restore](backup-restore.md)).

## Configuration

### Checking for Updates

1. Navigate to **System > Firmware Update**.
2. The page automatically checks the Nexapp update repository for a newer firmware version.
3. If a new version is available, the current and available version numbers are displayed.

### Updating from the Repository

1. When a new release is shown, click **Update System**.
2. A drawer opens where you can choose to apply the update immediately or schedule it for later.
3. **To apply immediately:** Click **Update Now**. The router downloads the image, flashes it, and reboots. A progress modal tracks the update.
4. **To schedule:** Select a date and time, then click **Schedule**. A notification confirms the scheduled update.

### Cancelling a Scheduled Update

1. If an update is scheduled, an information banner shows the scheduled date, time, and target version.
2. Click **Edit** to change the schedule, or click **Cancel Update** to remove the schedule entirely.
3. Confirm the cancellation in the dialog that appears.

### Updating with an Image File

If your router does not have internet access or you need to install a specific firmware version:

1. On the Firmware Update page, click **Update with Image File**.
2. A drawer opens. Select the firmware image file from your computer.
3. Click **Upload and Install**. The router flashes the image and reboots.

!!! warning "Do Not Interrupt"
    Do not power off the router or close your browser during a firmware update. Interrupting the flash process can render the device unbootable.

!!! tip "Backup First"
    Always create a configuration backup before updating. While updates preserve your settings, having a backup provides a recovery path if anything goes wrong.

## Verification

1. After the router reboots, log in to the web UI.
2. Navigate to **Dashboard** and confirm the **Operating System** field shows the new firmware version.
3. Navigate to **System > Firmware Update** and confirm no new updates are pending.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Connection error" when checking for updates | The router cannot reach the Nexapp update repository. | Verify the router has a working internet connection. Check DNS resolution and firewall rules for outbound HTTPS. |
| "Maintenance" error | The Nexapp update server is undergoing maintenance. | Wait and try again later. |
| "Repository URL not set" error | The update repository URL is not configured. | This typically resolves after a fresh firmware installation. Contact Nexapp support if the issue persists. |
| Router does not come back online after update | The update is still in progress, or a power interruption occurred. | Wait up to 5 minutes for the router to complete the flash and reboot. If it does not come back, connect a monitor and keyboard for console recovery. |
| Image file upload fails | The file is corrupt or in an unsupported format. | Re-download the firmware image and verify its checksum. Ensure the file is a valid NexappOS image. |
| Scheduled update did not run | The router was powered off at the scheduled time. | Reschedule the update for a time when the router will be powered on. |
