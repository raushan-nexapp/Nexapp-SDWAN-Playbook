# WireGuard VPN

!!! note "Standalone & Controller-Managed"
    WireGuard tunnels can be configured locally or pushed from the controller. When controller-managed, tunnel and peer settings may be overwritten by the next deployment.

## Overview

WireGuard is a modern, high-performance VPN protocol with a simpler configuration model than OpenVPN or IPsec. It uses public/private key pairs for authentication and provides strong encryption with minimal overhead. WireGuard is well suited for both site-to-site and remote access scenarios.

Navigate to **VPN > WireGuard Tunnel** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- At least one WAN interface is configured and connected.
- You have a key pair (generated automatically) or an existing WireGuard configuration to import.
- The firewall allows inbound traffic on the WireGuard listen port.

## Configuration

The page has two tabs: **Server** and **Tunnel**.

### Server Tab

The **Server** tab lets you create WireGuard server instances that accept incoming peer connections.

1. Click **Add Server**.
2. Fill in the server configuration.
3. Add one or more peers.
4. Click **Save**.

### Tunnel Tab

The **Tunnel** tab lets you create outbound WireGuard tunnels to connect to remote WireGuard servers.

### Server Configuration

| Field | Description |
|-------|-------------|
| **Name** | A descriptive name for this WireGuard interface (e.g., `wg-office`). |
| **Listen Port** | UDP port for incoming connections (default: `51820`). |
| **Network** | The WireGuard interface subnet (e.g., `10.10.0.0/24`). |
| **Address** | The IP address assigned to this WireGuard interface (e.g., `10.10.0.1`). |
| **Public Endpoint** | The public IP or hostname peers use to reach this server (e.g., `203.0.113.25`). |
| **MTU** | Maximum Transmission Unit for the tunnel (default: `1420`). |
| **DNS** | DNS servers pushed to peers. |
| **Route All Traffic** | When enabled, peers route all their traffic through this server. |
| **Client-to-Client** | Allow peers to communicate with each other through the server. |

### Peer Configuration

| Field | Description |
|-------|-------------|
| **Name** | A descriptive name for this peer (e.g., `laptop-user`). |
| **Pre-shared Key** | Optional additional layer of symmetric encryption. |
| **Remote Networks** | Subnets accessible behind this peer (e.g., `192.168.2.0/24`). |
| **Local Networks** | Subnets on the server side to advertise to this peer. |
| **Reserved IP** | Fixed IP address for this peer within the WireGuard network. |
| **Route All Traffic** | Route all peer traffic through the tunnel. |

### Downloading Peer Configuration

After creating a peer, you can download its configuration file. Import this file into the peer's WireGuard client application.

## Verification

1. Create a WireGuard server and add a peer.
2. Download the peer configuration and import it on the client device.
3. Activate the tunnel on the client and verify the handshake succeeds.
4. Check the server page for the peer's **Latest Handshake** timestamp.
5. Ping a resource behind the server from the peer device to confirm routing.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Peer unreachable | Firewall blocking the listen port or incorrect public endpoint | Verify the firewall allows inbound UDP on the configured listen port. Check the public endpoint address. |
| Handshake timeout | Key mismatch or NAT issues | Verify the public and private keys match on both sides. Enable persistent keepalive (`25` seconds) if behind NAT. |
| Allowed IPs misconfigured | Peer cannot reach expected subnets | Check **Remote Networks** and **Local Networks** on both sides. The allowed IPs must include the target subnets. |
| Traffic not flowing after handshake | Firewall zone assignment missing for the WireGuard interface | Assign the WireGuard interface to the correct firewall zone. |

!!! info "See Also"
    - [OpenVPN Road Warrior](openvpn-rw.md) -- Alternative remote access VPN with broader client support
    - [IPsec VPN](ipsec.md) -- Industry-standard site-to-site VPN
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Configure zone access for VPN interfaces
