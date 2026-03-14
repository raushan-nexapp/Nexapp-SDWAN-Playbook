# Reboot & Shutdown

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

Use the Reboot & Shutdown page to safely restart or power off your NexappOS router. A reboot gracefully stops all services, saves the current configuration, and restarts the system. A shutdown powers the device off completely.

## Prerequisites

- Administrator access to the NexappOS web UI.
- No firmware upgrades or configuration deployments in progress.

## Configuration

Navigate to **System > Reboot & Shutdown**.

### Rebooting the Router

1. In the **Reboot** section, click **Reboot Unit**.
2. A confirmation dialog appears warning that all active connections will be interrupted.
3. Click **Reboot Now** to confirm.
4. A progress bar tracks the reboot process (approximately 45 seconds).
5. The browser automatically reloads the page once the router is back online.

### Shutting Down the Router

1. In the **Shutdown** section, click **Shut Down Unit**.
2. A confirmation dialog displays the router hostname and warns that the device will power off.
3. Click **Shut Down Unit** to confirm.
4. The router powers off. You must physically power on the device to restart it.

!!! warning "Data Loss Risk"
    Ensure no firmware upgrades or configuration deployments are in progress before rebooting or shutting down. Interrupting these operations can leave the router in an inconsistent state.

!!! tip
    If the router is controller-managed, the controller will detect the reboot and may re-deploy pending configurations once the router comes back online.

## Verification

1. After a reboot, log in to the web UI and navigate to **System > Dashboard** to confirm the system uptime has reset.
2. Verify that all services (SD-WAN, firewall, VPN) are running as expected.
3. Check **System > Dashboard** for any error banners indicating services that failed to start after the reboot.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Browser does not reload after reboot | The router IP address changed, or the reboot took longer than expected. | Wait 60 seconds, then manually navigate to the router IP. Check physical link lights. |
| Router does not come back online after reboot | A hardware or configuration issue is preventing boot. | Connect a monitor or serial console to check boot messages. Power-cycle the device. |
| Shutdown command has no effect | The power management service is not responding. | Refresh the page and try again. If the issue persists, use SSH to run `poweroff` manually. |

## See Also

- [Dashboard](dashboard.md)
- [Factory Reset](factory-reset.md)
- [Firmware Update](firmware-update.md)
