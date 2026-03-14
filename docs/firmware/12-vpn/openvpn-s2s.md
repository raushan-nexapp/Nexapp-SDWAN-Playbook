# OpenVPN Site-to-Site

!!! note "Standalone & Controller-Managed"
    OpenVPN site-to-site tunnels can be configured locally or pushed from the controller. When controller-managed, tunnel settings may be overwritten by the next deployment.

## Overview

OpenVPN Site-to-Site creates a permanent VPN tunnel between two NexappOS routers (or between a NexappOS router and a third-party device). It connects remote office networks so that devices on each side can communicate as if they were on the same network. One router acts as the server and the other as the client.

Navigate to **VPN > OpenVPN Tunnel** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI on both routers.
- Both routers have WAN connectivity and can reach each other's public IP addresses.
- You know the LAN subnets on each side that need to communicate.
- The firewall allows inbound OpenVPN traffic on the server side.

## Configuration

The page has two tabs: **Server Tunnel** and **Client Tunnel**.

### Creating a Server Tunnel

1. Navigate to the **Server Tunnel** tab.
2. Click **Add Tunnel**.
3. Fill in the tunnel configuration.
4. Click **Save**.

### Creating a Client Tunnel

1. Navigate to the **Client Tunnel** tab.
2. Click **Add Tunnel**.
3. Fill in the tunnel configuration, pointing to the server's public IP.
4. Click **Save**.

### Tunnel Configuration

| Field | Description |
|-------|-------------|
| **Name** | A descriptive name for this tunnel (e.g., `office-to-branch`). |
| **Status** | Enable or disable the tunnel. |
| **Role** | Server or Client. One side must be server, the other client. |
| **Remote Host** | The public IP or hostname of the peer (client side only, e.g., `198.51.100.5`). |
| **Port** | Listening port for the tunnel (default: `1195`). |
| **Protocol** | UDP (recommended) or TCP. |
| **Local Networks** | Subnets on this side to advertise to the remote peer (e.g., `192.168.1.0/24`). |
| **Remote Networks** | Subnets on the remote side to route through the tunnel (e.g., `192.168.2.0/24`). |
| **Authentication** | Shared key (simpler) or certificate-based (more secure). |
| **Cipher** | Encryption algorithm for the tunnel. |
| **Compression** | Disabled, LZO, or LZ4. |

### Connecting Both Sides

1. Configure the server tunnel on Router A.
2. Configure the client tunnel on Router B, entering Router A's public IP as the **Remote Host**.
3. Ensure both sides use the same authentication credentials, cipher, and protocol.
4. Enable both tunnels.

## Verification

1. Check that both tunnels show a **Connected** status (data refreshes every 10 seconds).
2. From a device on Router A's LAN, ping a device on Router B's LAN.
3. From a device on Router B's LAN, ping a device on Router A's LAN.
4. Verify traffic counters increment on both tunnel entries.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Tunnel not establishing | Firewall blocking the tunnel port on the server side | Add a firewall rule to allow inbound traffic on the configured port. Verify NAT traversal if behind another router. |
| Routes not propagated | Local/remote networks mismatch between the two sides | Ensure the **Local Networks** on one side match the **Remote Networks** on the other side, and vice versa. |
| Asymmetric encryption error | Cipher or authentication settings do not match | Verify both sides use the same cipher, digest, and authentication method. |
| Tunnel connects but traffic does not flow | Firewall zone not configured for the tunnel interface | Assign the tunnel interface to the correct firewall zone under **Firewall > Zones & Policies**. |

!!! info "See Also"
    - [OpenVPN Road Warrior](openvpn-rw.md) -- Remote access VPN for individual users
    - [IPsec VPN](ipsec.md) -- Alternative site-to-site protocol compatible with third-party firewalls
    - [WireGuard VPN](wireguard.md) -- Modern high-performance alternative
