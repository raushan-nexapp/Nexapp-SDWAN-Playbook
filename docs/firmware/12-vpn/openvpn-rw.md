# OpenVPN Road Warrior

!!! note "Standalone & Controller-Managed"
    OpenVPN Road Warrior can be configured locally or pushed from the controller. When controller-managed, server settings and user accounts may be overwritten by the next deployment.

## Overview

OpenVPN Road Warrior provides remote access VPN for individual users connecting from laptops, phones, or tablets. It uses TLS-based encryption with certificate or username/password authentication. Each user receives an `.ovpn` configuration file to import into their OpenVPN client application.

Navigate to **VPN > OpenVPN Road Warrior** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- At least one WAN interface is configured and connected.
- You know the public IP address or hostname that remote users will connect to.
- Client devices have an OpenVPN-compatible client application installed.

## Configuration

The page has two tabs: **Road Warrior Server** and **Connection History**.

### Creating the Server

If no server exists, the page shows an empty state with a **Create Server** button.

1. Click **Create Server**.
2. Fill in the server configuration form.
3. Click **Save**.

### Server Configuration

| Field | Description |
|-------|-------------|
| **Status** | Enable or disable the VPN server. |
| **Server Name** | A descriptive name for this VPN instance. |
| **User Database** | Source of user accounts: local database or external (LDAP). |
| **Authentication Mode** | How clients authenticate: username/password, certificate, username + password + certificate, or username + OTP + certificate. |
| **Mode** | Routed (TUN -- Layer 3) or Bridged (TAP -- Layer 2). Routed is recommended for most deployments. |
| **VPN Network** | The subnet used for VPN clients (e.g., `10.8.0.0/24`). Only applies to routed mode. |
| **Dynamic Range Start/End** | IP range within the VPN network assigned to connecting clients. |
| **Public IP / Hostname** | The address remote clients use to reach this server (e.g., `203.0.113.10`). |
| **Protocol** | UDP (faster, recommended) or TCP (works through restrictive firewalls). |
| **Port** | Listening port (default: `1194`). |
| **Route All Traffic Through VPN** | When enabled, all client traffic routes through the VPN, not just traffic for the local network. |
| **Push Custom Network Routes** | Additional subnets to advertise to VPN clients (e.g., `192.168.10.0/24`). |
| **Client-to-Client Traffic** | Allow connected VPN clients to communicate with each other. |
| **Compression** | Disabled, LZO, or LZ4. Disabled is recommended unless bandwidth is severely constrained. |
| **Cipher** | Encryption algorithm. Auto-negotiation (default) selects the strongest mutually supported cipher. |
| **Digest** | Hash algorithm for HMAC authentication. Auto is recommended. |
| **Minimum TLS Version** | Enforce a minimum TLS version (1.1 or 1.2). Auto allows negotiation. |

### Managing User Accounts

1. In the **Road Warrior Server** tab, scroll to the user accounts section.
2. Click **Add User**.
3. Enter the username, password, and optional description.
4. Enable or disable VPN access for this user.
5. Click **Save**.

To revoke access, disable the user's VPN toggle or delete the account.

### Downloading Client Configuration

1. Click the **Download** button next to a user account.
2. Save the `.ovpn` file.
3. Import the file into the user's OpenVPN client application.

### Connection History

The **Connection History** tab shows a log of past VPN connections, including the user, connect/disconnect times, and data transferred.

## Verification

1. Create the server and add a user account.
2. Download the `.ovpn` configuration file.
3. On a remote device, import the file into an OpenVPN client and connect.
4. Verify the connection succeeds and the client receives an IP from the VPN network.
5. From the client, ping a LAN resource (e.g., `192.168.1.1`) to confirm routing.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Client cannot connect | Firewall blocking the VPN port | Verify the WAN firewall allows inbound traffic on the configured port (default `1194/UDP`). |
| Authentication failure | Wrong username/password or expired certificate | Check credentials in the user account list. Regenerate the client certificate if needed. |
| DNS not resolving over VPN | DNS push options not configured | Enable custom DHCP options to push DNS server addresses to clients. |
| Slow VPN performance | TCP protocol or compression overhead | Switch to UDP protocol. Disable compression if CPU usage is high. |
| Client connects but cannot reach LAN | Missing route push for the LAN subnet | Add the LAN subnet to **Push Custom Network Routes** (e.g., `192.168.1.0/24`). |

!!! info "See Also"
    - [OpenVPN Site-to-Site](openvpn-s2s.md) -- Permanent tunnels between routers
    - [WireGuard VPN](wireguard.md) -- Modern alternative with simpler configuration
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Allow VPN traffic through the firewall
