# IPsec VPN

!!! note "Standalone & Controller-Managed"
    IPsec tunnels can be configured locally or pushed from the controller. When controller-managed, tunnel settings may be overwritten by the next deployment.

## Overview

IPsec is an industry-standard site-to-site VPN protocol using IKEv1 or IKEv2 with two-phase negotiation. It provides strong encryption and is compatible with third-party firewalls from vendors such as FortiGate, Cisco, and Palo Alto. NexappOS uses a 3-step wizard to configure IPsec tunnels: network settings, authentication, and encryption parameters.

Navigate to **VPN > IPsec Tunnels** to access this page.

!!! tip
    SD-WAN encryption also uses IPsec internally for overlay tunnels. For SD-WAN-specific IPsec configuration, see [SD-WAN Encryption](../05-sdwan/encryption.md).

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You know the remote gateway's public IP address or hostname.
- You have agreed on a pre-shared key (PSK) or certificate with the remote peer.
- Both sides agree on encryption algorithms and DH groups.
- The firewall allows IKE (UDP port `500`) and NAT-T (UDP port `4500`).

## Configuration

### Creating a Tunnel

1. Click **Add IPsec Tunnel**.
2. Complete the 3-step wizard.

### Step 1: Network Settings

| Field | Description |
|-------|-------------|
| **Status** | Enable or disable the tunnel. |
| **Tunnel Name** | A descriptive name (e.g., `branch-to-hq`). Cannot be changed after creation. |
| **WAN IP Address** | The local WAN interface IP to use as the tunnel source. |
| **Remote IP Address** | The public IP or hostname of the remote gateway (e.g., `198.51.100.10`). |
| **Local Networks** | Subnets behind this router to share over the tunnel (e.g., `192.168.1.0/24`). |
| **Remote Networks** | Subnets behind the remote gateway (e.g., `192.168.2.0/24`). |
| **Local Identifier** | IKE identity for this side (usually the WAN IP or FQDN). |
| **Remote Identifier** | IKE identity for the remote side. |

### Step 2: Authentication

| Field | Description |
|-------|-------------|
| **Pre-Shared Key** | Choose to generate a key automatically or enter a custom PSK. Both sides must use the same key. |
| **Dead Peer Detection (DPD)** | Enable to detect when the remote peer becomes unreachable. When triggered, the tunnel restarts automatically. |
| **Compression** | Enable IPComp header compression. Disable unless bandwidth is severely constrained. |

### Step 3: Encryption Parameters

#### Phase 1 (IKE)

| Field | Description |
|-------|-------------|
| **IKE Version** | IKEv1, IKEv2, or both. IKEv2 is recommended for better security and performance. |
| **Encryption Algorithm** | Cipher for IKE negotiation (e.g., `AES-256`). |
| **Integrity Algorithm** | Hash for IKE authentication (e.g., `SHA-256`). |
| **Diffie-Hellman Group** | Key exchange group (e.g., `modp2048`). Higher groups provide stronger security but use more CPU. |
| **Key Lifetime** | Time in seconds before rekeying Phase 1 (default: `3600`). |

#### Phase 2 (ESP)

| Field | Description |
|-------|-------------|
| **Encryption Algorithm** | Cipher for data encryption (e.g., `AES-256`). |
| **Integrity Algorithm** | Hash for data authentication (e.g., `SHA-256`). |
| **DH Group (PFS)** | Perfect Forward Secrecy group. Set to none to disable PFS. |
| **Key Lifetime** | Time in seconds before rekeying Phase 2 (default: `3600`). |

### Managing Tunnels

The tunnel table displays all configured IPsec tunnels with their status. SD-WAN bonding tunnels are managed separately under **SD-WAN > Fabric** and do not appear in this list.

- **Enable/Disable** -- Toggle the tunnel on or off.
- **Edit** -- Modify tunnel parameters.
- **Delete** -- Remove the tunnel permanently.

Tunnel status refreshes every 10 seconds.

## Verification

1. Create a tunnel and ensure the remote side has matching parameters.
2. Check the tunnel table for a **Connected** status.
3. From a device on the local LAN, ping a device on the remote LAN.
4. Verify traffic counters increment for the tunnel.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Phase 1 failure | IKE version, encryption, or DH group mismatch | Verify both sides use the same IKE version, cipher, integrity algorithm, and DH group. |
| Phase 2 mismatch | Local/remote network subnets do not match | Ensure the **Local Networks** on one side exactly match the **Remote Networks** on the other side. |
| DPD timeout | Remote peer is unreachable or has changed IP | Verify the remote gateway IP is correct and reachable. Check for NAT or firewall changes on the path. |
| Tunnel flapping | Key lifetime too short or unstable WAN link | Increase the key lifetime. Investigate WAN link stability using **Monitoring > Ping & Traceroute**. |
| Tunnel connected but no traffic | Firewall zone not assigned to the IPsec interface | Assign the tunnel interface to the correct firewall zone under **Firewall > Zones & Policies**. |

!!! info "See Also"
    - [SD-WAN Encryption](../05-sdwan/encryption.md) -- IPsec used within the SD-WAN overlay
    - [OpenVPN Site-to-Site](openvpn-s2s.md) -- Alternative site-to-site VPN
    - [WireGuard VPN](wireguard.md) -- Modern high-performance alternative
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Allow IKE/NAT-T traffic
