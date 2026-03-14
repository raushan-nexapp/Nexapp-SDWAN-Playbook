# L2TP VPN

!!! note "Standalone & Controller-Managed"
    L2TP can be configured locally or pushed from the controller. When controller-managed, server and client settings may be overwritten by the next deployment.

## Overview

L2TP (Layer 2 Tunneling Protocol) provides remote access VPN with PPP-based authentication. It supports both client and server modes: use client mode to connect to a remote L2TP server, and server mode to accept incoming connections from remote users. L2TP has native support in Windows, macOS, iOS, and Android without requiring additional client software.

Navigate to **VPN > L2TP** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For server mode: at least one WAN interface is configured and the firewall allows inbound L2TP traffic (UDP port `1701`).
- For client mode: you have the remote server's IP address and PPP credentials.

## Configuration

The page has two tabs: **Client Tunnel** and **Server Tunnel**.

### Client Tunnel

Client tunnels let you connect to remote L2TP servers.

#### Creating a Client Tunnel

1. Navigate to the **Client Tunnel** tab.
2. Click **Add Client Tunnel**.
3. Fill in the client configuration.
4. Click **Save**.

| Field | Description |
|-------|-------------|
| **Service** | Enable or disable this client tunnel. |
| **Interface Name** | A unique name for the tunnel interface (e.g., `l2tp-wan1`). Letters, numbers, and underscores only (max 32 characters). |
| **Server IP** | The remote L2TP server's IP address (e.g., `203.0.113.50`). |
| **Username** | PPP username for authentication. |
| **Password** | PPP password for authentication. |

#### Client Tunnel Table

The client tunnel table shows all configured client tunnels with their interface name, server address, username, and connection status (connected, disconnected, or unknown).

### Server Tunnel

Server mode lets your router accept incoming L2TP connections.

#### Creating the Server

1. Navigate to the **Server Tunnel** tab.
2. Click **Add Server Tunnel**.
3. Fill in the server configuration.
4. Click **Save**.

| Field | Description |
|-------|-------------|
| **Service** | Enable or disable the L2TP server. |
| **IP Pool Start** | Starting IP address for the client address pool (e.g., `10.0.100.10`). |
| **IP Pool End** | Ending IP address for the client address pool (e.g., `10.0.100.50`). |
| **Local IP** | The server-side tunnel endpoint address (e.g., `10.0.100.1`). |
| **Username** | PPP username for client authentication. |
| **Password** | PPP password for client authentication. |
| **MTU** | Maximum Transmission Unit for the tunnel (default: `1440`, range: 128--9000). |
| **MRU** | Maximum Receive Unit for the tunnel (default: `1440`, range: 128--9000). |
| **LCP Interval** | LCP echo request interval in seconds (default: `20`, range: 0--300). |
| **LCP Failure** | Number of LCP echo failures before the connection is dropped (default: `5`, range: 0--300). |

#### Authentication Options

The server supports multiple PPP authentication protocols. Toggle each option based on your security requirements:

| Option | Description |
|--------|-------------|
| **CHAP** | Challenge-Handshake Authentication Protocol. |
| **PAP** | Password Authentication Protocol (less secure than CHAP). |
| **Require MSCHAP v2** | Require Microsoft CHAP version 2 (recommended for Windows clients). |
| **Require CHAP** | Require CHAP authentication. |
| **Require PAP** | Require PAP authentication. |
| **Default Route** | Push a default route to connecting clients. |
| **IP Default** | Assign default IP settings to clients. |
| **Proxy ARP** | Enable Proxy ARP for the tunnel interface. |

#### Connected Clients

When the server is active, the **Client List** section shows currently connected clients with their interface name, assigned IP address, and connection status.

## Verification

1. **Server mode:** Enable the server, then connect from a remote device using native L2TP client (Windows: Settings > Network > VPN).
2. Check the **Client List** for the connected device.
3. From the remote client, ping a LAN resource (e.g., `192.168.1.1`).
4. **Client mode:** Create a client tunnel and verify the status shows **connected**.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Client cannot connect to server | Firewall blocking UDP port `1701` | Add a firewall rule to allow inbound L2TP traffic. If using L2TP/IPsec, also allow UDP ports `500` and `4500`. |
| Authentication failure | Username/password mismatch or unsupported auth protocol | Verify credentials match on both sides. Enable the authentication protocol required by the client (e.g., MSCHAP v2 for Windows). |
| IP pool exhausted | All addresses in the pool are assigned | Expand the IP pool range or disconnect idle clients. |
| Connection drops frequently | LCP failure threshold too low or unstable WAN link | Increase the **LCP Failure** value. Check WAN link stability. |
| Client connects but cannot reach LAN | Missing routes or firewall zone not assigned | Verify the server pushes routes to clients. Assign the L2TP interface to the correct firewall zone. |

!!! info "See Also"
    - [OpenVPN Road Warrior](openvpn-rw.md) -- Alternative remote access VPN with stronger encryption
    - [IPsec VPN](ipsec.md) -- Combine with L2TP for encrypted tunnels (L2TP/IPsec)
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Allow L2TP traffic through the firewall
