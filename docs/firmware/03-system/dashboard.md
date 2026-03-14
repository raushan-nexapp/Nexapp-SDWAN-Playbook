# Dashboard

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Dashboard is the first page you see after logging into the NexappOS web UI. It provides a real-time summary of your router's health, active services, and network status. Data refreshes automatically every 20 seconds.

## Prerequisites

- You have access to the NexappOS web UI at `https://<router-ip>:9090`.
- You have completed the initial setup wizard.

## Dashboard Widgets

### System Information Card

The system card occupies the left column and displays:

| Field | Description |
|---|---|
| **Hostname** | The router's configured hostname. A warning icon appears if the hostname is still set to the factory default. |
| **Operating System** | The installed NexappOS firmware version. A warning icon appears when a newer version is available. |
| **Uptime** | How long the router has been running since the last reboot (days, hours, minutes). |
| **Load Average** | CPU load averages for the last 1, 5, and 15 minutes. |
| **Memory Usage** | A progress bar showing used vs. total RAM. The bar changes from blue to amber at 75% and red at 90%. |
| **Root Storage** | Used vs. total space on the root filesystem. |
| **Temporary Storage** | Used vs. total space in the temporary filesystem. |
| **Data Storage** | Used vs. total space on the external data partition (visible only when external storage is configured). |

### Service Cards

Each service card shows whether a service is running and, where applicable, a connection counter or status indicator. You can click the service name to navigate directly to its configuration page.

| Card | What It Shows |
|---|---|
| **Internet Connection** | WAN link status and assigned IP address. |
| **FlowEdge MultiWAN** | Whether multi-WAN load balancing is active. |
| **DPI Engine** | Whether Deep Packet Inspection is running. |
| **OpenVPN Road Warrior** | Number of connected remote-access VPN clients. |
| **IPsec Tunnels** | Count of established IPsec tunnels. |
| **WireGuard Tunnels** | Count of active WireGuard peers. |
| **OpenVPN Tunnels** | Count of active site-to-site OpenVPN tunnels. |
| **InstaShield IP** | Threat Shield IP (ban list) status. |
| **InstaShield DNS** | Threat Shield DNS filtering status. |
| **MAC Binding** | Status of MAC address binding rules. |
| **IPS Engine** | Intrusion Prevention System status. |
| **Backup Status** | Whether backups are configured and up to date. |
| **HA Status** | High Availability role (primary/backup) and health. |
| **SD Controller** | Connection status to the Nexapp SDWAN Controller. |
| **SNMP** | Whether SNMP monitoring is enabled. |
| **ZeroTier** | ZeroTier network membership status. |
| **Antivirus** | Antivirus engine status. |
| **Security Overview** | Aggregated security posture summary. |
| **Known Hosts** | Total number of hosts detected on the local network. |

## Verification

1. Navigate to **Dashboard** in the left sidebar.
2. Confirm all service cards load without error banners.
3. Verify memory and storage progress bars display realistic values.
4. Wait 20 seconds and confirm the data refreshes (the uptime value increments).

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Cannot retrieve system info" error | The system information service is temporarily unavailable. | Refresh the page. If the error persists, reboot the router from **System > Reboot and Shutdown**. |
| Hostname shows a warning icon | The hostname is still set to the factory default. | Navigate to **System > System Settings** and set a unique hostname. |
| Firmware version shows a warning icon | A newer firmware release is available. | Navigate to **System > Firmware Update** to review and install the update. |
| A service card shows "not running" | The corresponding service is disabled or has crashed. | Navigate to the service's configuration page and enable it. Check **Logs** for error details. |
| Storage progress bar is red (>90%) | The filesystem is nearly full. | Remove old backups, clear logs, or attach external storage under **System > Storage**. |
