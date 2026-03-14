# Firmware Upgrader

## Overview

The Firmware Upgrader section manages over-the-air (OTA) firmware upgrades for all managed NexappOS devices. Upload firmware images, create upgrade batches, schedule maintenance windows, and track upgrade status from the controller.

Navigate to **Firmware** in the controller sidebar.

---

## Firmware Upgrader Objects

| Object | Description |
|--------|-------------|
| **Build** | Uploaded firmware image (`.bin` / `.img` file) |
| **Batch Upgrade** | Upgrade operation targeting a set of devices |
| **Device Firmware Info** | Per-device firmware version and upgrade status |

---

## Uploading a Firmware Build

1. Navigate to **Firmware > Builds**
2. Click **Add Build**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Organization** | Which org can use this build |
| **Version** | Firmware version string (e.g., `10.01.20260301`) |
| **File** | Upload the `.bin` firmware image |
| **Architecture** | Target hardware architecture (e.g., `x86_64`) |

4. Click **Save** — the controller stores the firmware image and computes its SHA-256 hash

---

## Creating a Batch Upgrade

A Batch Upgrade applies a firmware build to multiple devices at once:

1. Navigate to **Firmware > Batch Upgrades**
2. Click **Add Batch Upgrade**
3. Configure:

| Field | Description |
|-------|-------------|
| **Firmware Build** | Select the uploaded build |
| **Devices** | Select specific devices, or use a Device Group |
| **Upload Timeout** | Seconds to wait for file transfer (default: 300) |
| **Upgrade Timeout** | Seconds to wait for device to come back online (default: 600) |

4. Click **Save** then **Start Upgrade** to begin

---

## Upgrade Phases

Each device goes through these phases during an upgrade:

| Phase | Description |
|-------|-------------|
| **Queued** | Waiting for available upgrade slot |
| **Uploading** | Firmware image being transferred to device |
| **Applying** | Device flashing new firmware |
| **Rebooting** | Device restarting with new firmware |
| **Verifying** | Controller confirming device came back online |
| **Success** | Upgrade complete, device online with new version |
| **Failed** | Upgrade failed — see error message |

---

## Upgrade Safety

- Devices remain reachable via ZeroTier management plane throughout the upgrade
- If a device does not reconnect within the Upgrade Timeout, it is marked **Failed**
- Failed devices retain their previous firmware (sysupgrade preserves `/overlay`)
- Configuration is preserved automatically (`sysupgrade -c`)

---

## Monitoring Upgrade Progress

During a batch upgrade, the detail page shows a live progress table:

| Device | Phase | Duration | Error |
|--------|-------|----------|-------|
| Branch-01 | Success | 4m 32s | — |
| Branch-02 | Rebooting | 1m 10s | — |
| Branch-03 | Failed | 8m 00s | Timeout |

---

## See Also

- [Device Registration](../03-devices/registration.md)
- [Device Monitoring](../03-devices/monitoring.md)
- [Firmware Update (Firmware Manual)](../../firmware/03-system/firmware-update.md)
