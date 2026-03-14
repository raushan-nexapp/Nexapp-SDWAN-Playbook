# Remote Terminal

## Overview

The Remote Terminal provides a browser-based command-line interface to any registered NexappOS device without requiring direct SSH access or a VPN connection to the device's local network. The terminal session is proxied through the ZeroTier management plane, so it works for devices behind NAT, CGNAT, or remote-site firewalls.

## Accessing the Terminal

1. Navigate to **Devices** in the controller web UI
2. Click the device you want to connect to
3. Select the **Terminal** tab on the device detail page
4. Click **Open Terminal**

A terminal window opens in the browser. You are connected as the router's admin user.

**Prerequisites:**
- The device must be **Online** (green status) — a device that is Offline or Unknown cannot be reached
- SSH must be enabled on the router (enabled by default on NexappOS)
- The administrator's controller account must have at least **Operator** role for the device's organization

If the device is online but the terminal fails to open, see [Troubleshooting](#troubleshooting) below.

## What You Can Do

The remote terminal gives you full access to the NexappOS router CLI. Common tasks include:

| Task | Command Examples |
|---|---|
| Check SD-WAN tunnel status | `ns-bond status`, `ns-bond members` |
| Run a ping or traceroute | `ping 192.0.2.1`, `traceroute 198.51.100.1` |
| View routing table | `ip route show table main`, `vtysh -c "show ip bgp"` |
| Check system resources | `top`, `free -h`, `df -h` |
| View system logs | `logread -f`, `journalctl -f` |
| Check ZeroTier status | `zerotier-cli status`, `zerotier-cli listnetworks` |
| Run a speed test | `ns.speedtest run` via the API, or `iperf3 -c <server>` |
| View firewall rules | `nft list ruleset` |

!!! tip
    Use the terminal for diagnostic and read-only operations. Configuration changes should be made through the controller's configuration management workflow (templates, topology wizard) so they are tracked in configuration history and survive device reboots.

## Destructive Commands

The following operations require extra caution when run from the remote terminal:

| Operation | Risk | Safer Alternative |
|---|---|---|
| `reboot` | Disconnects the terminal session; device goes offline for 60–90 seconds | Use **Devices > [device] > Actions > Reboot** in the UI, which shows a countdown |
| Changing network interfaces | May break ZeroTier connectivity and lock you out | Test changes in a maintenance window; have physical or console access as backup |
| `factory-reset` | Wipes all configuration including ZeroTier identity | Use only when deliberately decommissioning a device |
| Stopping the ZeroTier daemon | Severs the management plane connection | Coordinate with a local person who can restart it if needed |

The terminal does not enforce restrictions on these commands — it is your responsibility to run destructive operations carefully.

## Session Behavior

| Property | Value |
|---|---|
| **Session timeout** | 5 minutes of keyboard inactivity |
| **Maximum session duration** | 2 hours (regardless of activity) |
| **Concurrent sessions** | Multiple administrators can open separate terminal sessions to the same device simultaneously |
| **Session protocol** | WebSocket over HTTPS (port 443) — no special firewall rules needed on the client side |

When a session times out, the terminal window shows "Session closed due to inactivity." Click **Reconnect** to open a new session.

## Audit Logging

Every terminal session is recorded in the controller audit log:

- Session open: username, device name, timestamp, source IP
- Session close: duration, exit reason (timeout, user close, or network disconnect)
- Command history is not individually logged (only session open/close events)

To view the audit log, navigate to **Admin > Audit Log** and filter by event type **Terminal Session**.

## Security Considerations

- All terminal traffic is encrypted end-to-end: browser → HTTPS → controller → ZeroTier encrypted tunnel → device
- The terminal is accessible only to authenticated controller users with appropriate organization permissions
- Users with **Viewer** role cannot open a terminal session — a minimum of **Operator** role is required
- Sessions are bound to the authenticated user; there is no session sharing or handoff

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Terminal unavailable — device offline" | Device not reachable via ZeroTier | Wait for device to come online or diagnose the ZeroTier connection |
| Terminal opens but immediately closes | SSH service not running on the router | Use an out-of-band method to restart SSH on the device |
| "Access denied" error | Insufficient role for this organization | Request **Operator** or higher role from the organization admin |
| Terminal is slow or laggy | High latency on the ZeroTier path | Check ZeroTier peer latency; the terminal is functional but input may lag at >200 ms |
| Session disconnects every few minutes | Inactivity timeout | Type a key before the 5-minute timeout expires, or enable terminal keepalive in browser settings |

!!! info "See Also"
    - [Device Monitoring](monitoring.md) — Status polling and health metrics without a terminal
    - [Device Registration](registration.md) — Register a device before accessing its terminal
    - [Audit Logging](../15-admin/audit-logging.md) — View all terminal session events
