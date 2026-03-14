# Storage

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

NexappOS runs from a compact root filesystem. For deployments that require extended log retention, packet captures, or large DPI databases, you can attach an external storage device (USB drive, additional disk, or partition). The Storage page lets you select, format, and configure an external device as the router's data storage volume, mounted at `/mnt/data`.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- An external storage device (USB drive, SATA disk, or available partition) is physically connected to the router.

!!! warning "Data Loss"
    Configuring a disk as external storage formats it, erasing all existing data on that device. Back up any important data before proceeding.

## Configuration

### Selecting and Configuring Storage

1. Navigate to **System > Storage**.
2. The page shows one of three states:

**No devices found:** No eligible storage devices are detected. Connect a USB drive or disk and refresh the page.

**Available devices:** One or more unformatted devices or partitions are listed as selectable cards. Each card shows:

| Field | Description |
|---|---|
| **Type** | `Disk` (entire drive) or `Partition` (a single partition on a drive). |
| **Path** | The device path (e.g., `/dev/sdb`). |
| **Size** | Total capacity of the device. |
| **Model** | The disk model name (disks only). |
| **Vendor** | The disk manufacturer (disks only). |

3. Select the device you want to use by clicking its card.
4. Click **Format and Configure Storage** (for a whole disk) or **Configure Storage** (for an existing partition).
5. A confirmation dialog explains what will happen:
    - For disks: the entire drive is formatted (all data is erased).
    - The device is mounted as the data storage volume.
    - System logs are redirected to `/mnt/data/logs/messages`.
    - Additional services can store data on the volume.
6. Click **Format and Configure** to confirm.

**Already configured:** If a storage device is already configured, the page shows its details: device path, type, size, model, and vendor. System logs and extended data are actively stored on this volume.

### Removing Storage

1. On the Storage page, locate the currently configured device.
2. Click **Remove Storage**.
3. A confirmation dialog warns that logs will revert to the default location and stored data will become inaccessible.
4. Click **Remove Storage** to confirm.

!!! note "Data Preservation"
    Removing storage does not erase the data on the device. It only unmounts the volume. You can re-attach it later or connect it to another system to access the data.

## Verification

1. After configuring storage, verify the **Storage** page shows the device details (path, size, model).
2. Navigate to **Dashboard** and confirm the **Data Storage** progress bar appears in the System Information card, showing used vs. total space.
3. Check that system logs are being written to the external volume by navigating to **Logs** and confirming recent entries are present.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| No devices found | No external storage is connected, or the device is not recognized. | Verify the USB drive or disk is physically connected. Try a different USB port. Check that the device is not already mounted by another service. |
| Format fails | The device is in use or has a hardware fault. | Disconnect and reconnect the device. If the error persists, test the device on another computer to rule out hardware failure. |
| Dashboard does not show Data Storage bar | The external storage is not configured or was removed. | Navigate to **System > Storage** and configure a device. |
| "Cannot retrieve storage configuration" error | A system service is temporarily unavailable. | Refresh the page. If the error persists, reboot the router. |
| Storage shows 0 bytes available | The filesystem on the device is corrupt. | Remove the storage configuration, physically reconnect the device, and re-format it through the Storage page. |
