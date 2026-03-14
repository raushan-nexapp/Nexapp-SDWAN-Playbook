# ZeroTier

!!! note "Standalone & Controller-Managed"
    ZeroTier can be configured locally on the router or managed by the controller. When controller-managed, the network ID and service state may be overwritten by the next deployment.

## Overview

ZeroTier creates virtual Ethernet networks that span the internet, allowing devices to communicate as if they were on the same LAN regardless of physical location. NexappOS uses ZeroTier for management plane connectivity between routers and the SD-WAN controller, providing a secure out-of-band channel that works through NAT and firewalls without port forwarding.

Navigate to **VPN > ZeroTier** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router has internet connectivity (outbound HTTPS access).
- You have a ZeroTier network ID from the ZeroTier Central portal or a self-hosted ZeroTier controller.

## Configuration

### Viewing Current Status

The main table displays the current ZeroTier configuration with these columns:

| Column | Description |
|--------|-------------|
| **Join** | The 16-character network ID this router has joined. |
| **ID** | The unique 10-character node ID assigned to this router. |
| **Version** | The running ZeroTier daemon version. |
| **Network** | The virtual network name or subnet. |
| **MAC** | The virtual MAC address assigned to the ZeroTier interface. |
| **Status** | Current connection status (e.g., `OK`, `ACCESS_DENIED`). |

### Joining a ZeroTier Network

1. Click **Add**.
2. Set **Status** to **Enabled**.
3. Enter the 16-character **Join** network ID (e.g., `1234567890abcdef`).
4. Click **Save**.

The router connects to the ZeroTier network. You must also authorize this device on the ZeroTier Central portal (or your self-hosted controller) before traffic flows.

### Removing a Network

Click the delete icon next to the network entry. The router leaves the ZeroTier network and the virtual interface is removed.

## Verification

1. Join a ZeroTier network and confirm the status shows **OK** in the table.
2. Verify the router appears as an authorized member in the ZeroTier Central portal.
3. From another device on the same ZeroTier network, ping this router's ZeroTier IP:

    ```bash
    ping 10.0.0.2
    ```

4. Confirm bidirectional connectivity by pinging from the router to the remote ZeroTier peer.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Status shows `ACCESS_DENIED` | Router not authorized on the ZeroTier network | Log in to ZeroTier Central and authorize this device's node ID. |
| Status stays blank or shows `REQUESTING_CONFIGURATION` | Outbound HTTPS blocked by firewall | Ensure the router can reach `*.zerotier.com` on port 443. Check upstream firewall rules. |
| No IP address assigned | IP assignment not configured on the network | In ZeroTier Central, enable **Auto-Assign** for the managed route pool, or manually assign an IP to the node. |
| Tunnel works but cannot reach LAN behind router | Missing managed route in ZeroTier network | Add a managed route in ZeroTier Central pointing the remote LAN subnet to this router's ZeroTier IP. |

!!! info "See Also"
    - [WireGuard VPN](wireguard.md) -- Alternative overlay VPN with static key pairs
    - [IPsec VPN](ipsec.md) -- Industry-standard encrypted site-to-site tunnels
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Assign the ZeroTier interface to a firewall zone
