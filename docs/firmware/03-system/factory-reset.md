# Factory Reset

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

A factory reset restores your NexappOS router to its original default configuration. All custom settings -- including network interfaces, firewall rules, VPN tunnels, SD-WAN overlays, user accounts, and installed packages -- are erased. The firmware version itself is preserved.

Use a factory reset when you need to start from a clean state, recover from a misconfiguration that has locked you out, or repurpose the router for a different deployment.

!!! danger "Security Warning"
    A factory reset permanently erases all configuration data. This action cannot be undone. Back up your configuration before proceeding. See [Backup & Restore](backup-restore.md).

## Prerequisites

- Administrator access to the NexappOS web UI.
- A recent configuration backup stored on a separate device.

## Performing a Factory Reset

1. Navigate to **System > Factory Reset**.
2. The page displays the current firmware version.
3. Click **Perform Factory Reset**.
4. A confirmation dialog appears. To prevent accidental resets, you must type the exact hostname of the router into the text field.
5. Once the hostname matches, the **Confirm** button becomes active.
6. Click **Confirm** to begin the reset.
7. A progress bar tracks the reset process (approximately 45 seconds).
8. The browser reloads to the initial setup wizard once the reset is complete.

## What Is Preserved

| Preserved | Erased |
|---|---|
| Installed firmware version | All network configuration (WAN, LAN, VLAN) |
| Hardware-specific settings (MAC addresses) | Firewall rules and zones |
| | User accounts and passwords |
| | SSH keys |
| | SD-WAN overlays and tunnel configuration |
| | VPN profiles (IPsec, OpenVPN, WireGuard) |
| | Controller registration and certificates |

## Verification

1. After the reset completes, the initial setup wizard should appear in your browser.
2. Confirm the router is accessible at its default LAN IP address (`192.168.1.1`).
3. Verify that you can log in with the default credentials.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Hostname confirmation field does not accept input | A JavaScript error or browser extension is blocking the form. | Try a different browser or disable extensions. |
| Reset appears to complete but settings persist | The reset process was interrupted. | Power-cycle the router and attempt the factory reset again. |
| Cannot reach the router after reset | The router reverted to its default LAN IP (`192.168.1.1`), and your computer is on a different subnet. | Set your computer to DHCP or assign a static IP in the `192.168.1.0/24` range and connect to a LAN port. |

## See Also

- [Backup & Restore](backup-restore.md)
- [Initial Setup Wizard](../16-wizard/setup-wizard.md)
- [Reboot & Shutdown](reboot-shutdown.md)
