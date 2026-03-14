# Initial Setup Wizard

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Setup Wizard guides you through the essential first-time configuration of your NexappOS router. It appears automatically on the first login after a fresh install or factory reset. The wizard walks you through changing the default password, configuring SSH access, securing management ports, and reviewing your choices before finalizing.

Completing the wizard ensures your router is secured before you begin configuring network services.

## Prerequisites

- A fresh NexappOS installation or a router that has been factory-reset.
- Browser access to the router management interface (default: `https://192.168.1.1`).
- The default administrator credentials (printed on the router label or in the quick-start guide).

## Steps

The wizard consists of five steps, tracked by a progress bar at the top of the screen.

### Step 1: Welcome

The welcome screen displays the NexappOS logo and a brief description of what the wizard will configure. Click **Next** to begin.

!!! note
    If you have already changed the default password (for example, via SSH before opening the web UI), the wizard skips the password step automatically.

### Step 2: Change Password

1. Enter a new administrator password in the **New Password** field.
2. Re-enter the password in the **Confirm Password** field.
3. Click **Next** to proceed.

!!! warning "Security"
    Choose a strong password (12+ characters, mixed case, numbers, symbols). The default password is publicly documented and must be changed before exposing the router to any network.

### Step 3: SSH Access

1. Review the current SSH settings.
2. Optionally paste an SSH public key for key-based authentication.
3. Toggle **Allow SSH Password Authentication** on or off based on your security policy.
4. Click **Next** to proceed.

### Step 4: Management Port 9090

1. The wizard checks whether the management UI port (`9090`) is accessible from the WAN zone.
2. If a firewall rule allows WAN access to port `9090`, you see a warning.
3. Choose to keep or remove WAN access to port `9090`.
4. Click **Next** to proceed.

!!! tip
    For production deployments, restrict management port access to the LAN zone only. If you need remote management, use a VPN instead of exposing the management port to the internet.

### Step 5: Management Port 443

1. The wizard checks whether HTTPS port `443` is accessible from the WAN zone.
2. Choose to keep or remove WAN access to port `443`.
3. Click **Next** to proceed.

### Summary

The final screen displays a summary of all changes made during the wizard:

- Password status (changed or skipped)
- SSH configuration
- Port 9090 firewall rule status
- Port 443 firewall rule status

Review the summary and click **Finish** to apply all changes. A completion animation plays while the router applies the configuration. The browser then redirects you to the main dashboard.

## Verification

1. After the wizard completes, log in with your new password to confirm it was applied.
2. Attempt an SSH connection to verify your SSH settings are active.
3. From an external network, confirm that management ports are not accessible if you chose to restrict them.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Wizard does not appear after login | The wizard was already completed on a previous session. | Perform a factory reset to re-trigger the wizard, or configure settings manually through the web UI. |
| "Finish" button unresponsive | A configuration step failed to save in the background. | Check for error notifications on the summary screen. Refresh the browser and retry. |
| Locked out after changing password | New password was not entered correctly in the confirm field. | Use SSH with the default credentials (if SSH password auth was not disabled) or perform a factory reset. |
| Management ports still accessible from WAN | Firewall rule changes did not apply. | Navigate to **Firewall > Rules** and verify that WAN-to-device rules for ports `9090` and `443` are removed. |

## See Also

- [SSH Access](../03-system/ssh.md)
- [Factory Reset](../03-system/factory-reset.md)
- [Dashboard](../03-system/dashboard.md)
