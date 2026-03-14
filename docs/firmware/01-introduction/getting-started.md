# Getting Started

This page walks you through going from a freshly installed NexappOS router to a working network device in about five minutes.

!!! note "Standalone & Controller-Managed"
    These steps apply to both standalone and controller-managed deployments.
    Controller registration is an optional final step.

## Prerequisites

Before you begin, confirm that you have:

- [x] A NexappOS router with firmware already installed (see [Download & Install](../02-installation/download-install.md))
- [x] An Ethernet cable connecting your computer to one of the router's LAN ports
- [x] A WAN connection (Ethernet from your ISP or upstream network) plugged into the router's WAN port

## Quick Start (5 Minutes)

### Step 1 — Connect and Log In

1. Connect your computer to a **LAN** port on the router with an Ethernet cable.
2. Your computer receives an IP address automatically via DHCP (default range: `192.168.1.0/24`).
3. Open a web browser and navigate to: `https://192.168.1.1:9090`
4. Accept the self-signed certificate warning.
5. Log in with the default credentials:
    - **Username:** `root`
    - **Password:** `Admin@123`

### Step 2 — Change the Default Password

1. After login, navigate to **System > SSH & Password**.
2. Enter a strong new password in the **Root Password** field.
3. Confirm the password and click **Save**.

!!! danger "Security Warning"
    Change the default password immediately. Any device left with default
    credentials is vulnerable to unauthorized access.

### Step 3 — Verify WAN Connectivity

1. Navigate to **System > Dashboard**.
2. Check the **WAN** interface card — it should show an IP address and "Connected" status.
3. If you see "Not connected," go to **Network > Interfaces** and configure your WAN connection (DHCP, static, or PPPoE).

### Step 4 — Set Hostname and Timezone

1. Navigate to **System > Settings**.
2. Set a descriptive **Hostname** (for example, `branch-office-01`).
3. Select your **Timezone** from the dropdown.
4. Click **Save & Apply**.

### Step 5 — Verify Internet Access

1. Navigate to **Monitoring > Diagnostics**.
2. Run a **Ping** test to `8.8.8.8` (or any known public IP).
3. If the ping succeeds, your router has Internet connectivity.

## What to Do Next

After completing the quick start, choose the path that matches your deployment:

| Goal | Next Step |
|---|---|
| Run as a standalone router | [Network Configuration](../02-installation/network-config.md) — set up interfaces, DNS, DHCP |
| Join an SD-WAN network | [Controller Registration](../02-installation/controller-registration.md) — connect to your Nexapp SDWAN Controller |
| Configure firewall rules | [Firewall & Security](../10-firewall/zones-policies.md) — customize zones, rules, NAT |
| Set up VPN | [VPN](../12-vpn/openvpn-rw.md) — configure OpenVPN, WireGuard, or IPsec |

## Essential First Steps Checklist

Use this checklist to ensure your router is production-ready:

- [ ] Default password changed
- [ ] Hostname and timezone set
- [ ] WAN interface connected and receiving an IP
- [ ] LAN subnet configured for your network plan
- [ ] DNS resolver verified (clients can resolve domain names)
- [ ] Firewall rules reviewed and customized
- [ ] Firmware version verified (check **System > Dashboard**)
- [ ] Controller registration completed (if using centralized management)

!!! info "See Also"
    For detailed interface and network setup, see
    [Initial Setup](../02-installation/initial-setup.md) and
    [Network Configuration](../02-installation/network-config.md).
