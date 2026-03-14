# Overlay Tunnels

!!! note "Standalone & Controller-Managed"
    You can configure overlay tunnels locally on the router or push settings from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

An overlay tunnel is the encrypted virtual link between a hub and spoke router. It encapsulates your LAN traffic inside bonded WAN connections, providing a single logical path regardless of how many physical WAN links you have. The overlay handles encryption, Forward Error Correction, and multi-WAN failover transparently.

Navigate to **Network > SD-WAN Fabric > Tunnels** and click **Edit Overlay** to configure tunnel settings.

## Prerequisites

- At least one WAN interface is configured with internet connectivity.
- You know the public IP address of the hub router.
- Hub and spoke must use the same pre-shared key (PSK) for authentication.
- Tunnel addresses must be unique within the SD-WAN network and use the same subnet (e.g., `10.254.0.0/24`).

## Configuration

1. Navigate to **Network > SD-WAN Fabric**.
2. On the **Tunnels** tab, click **Edit Overlay**.
3. Fill in the overlay settings:

| Field | Description |
|-------|-------------|
| **Device Role** | Select `Hub` or `Spoke`. The hub is the central device that spokes connect to. |
| **Hub WAN Mode** | How the hub uses its WAN interfaces: `Single`, `Dual Active`, `Dual Standby`, or `MPLS + Internet`. See [Overview](overview.md) for mode descriptions. |
| **Hub IP** | The public IPv4 address of the hub router (e.g., `203.0.113.1`). For a hub device, this is its own public IP. For a spoke, this is the remote hub's IP. |
| **TUN Address (CIDR)** | The overlay tunnel IP address in CIDR format (e.g., `10.254.0.1/24` for the hub, `10.254.0.2/24` for a spoke). Must be unique per device. |
| **TUN MTU** | Maximum transmission unit for the tunnel interface. Default is `1400`. Valid range: `1280`--`1500`. Lower values may be needed if the underlay path has a smaller MTU. |
| **Pre-Shared Key (PSK)** | Authentication key for IPsec encryption. You can generate a strong random key or enter a custom key (minimum 16 characters, no spaces). The same PSK must be configured on both hub and spoke. |

4. Optionally expand **Advanced Settings** to configure:

| Field | Description |
|-------|-------------|
| **FEC Mode** | Forward Error Correction adds redundancy packets to recover from WAN packet loss without retransmission. Options: `Off` (default), `Fixed` (constant overhead), `Adaptive` (adjusts to measured loss). |
| **Hub WAN Failover IPs** | (Hub only) Additional WAN IP addresses for failover. When the hub's primary WAN goes down, spokes detect the failure and switch to the next available IP within ~10-15 seconds. Leave empty for auto-detection from member interfaces. |

5. Click **Save** to apply the configuration.

!!! warning "PSK Security"
    Copy the generated PSK and configure it on the peer device immediately. The PSK is shown only once during generation. If you lose it, you must generate a new key on both devices.

## PSK Management

You can manage the pre-shared key in two ways:

- **Generate a key** -- The system creates a strong 32-byte random key. Copy it and enter the same key on the peer device.
- **Use a custom key** -- Enter your own key (minimum 16 characters). A strength indicator shows whether your key is too short, fair, good, or strong.

If a PSK is already configured, the overlay form shows a "PSK is configured" badge. Click **Change** to replace it with a new key.

## Verification

1. After saving, return to **Network > SD-WAN Fabric > Tunnels** and verify the overlay status shows **Connected**.
2. Confirm the tunnel address appears on the tunnel interface.
3. From the spoke, ping the hub's tunnel address (e.g., `ping 10.254.0.1`) to confirm overlay connectivity.
4. Navigate to **Policy Engine > Performance SLA** to verify link health metrics are being collected.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Tunnel shows "Down" | PSK mismatch between hub and spoke | Verify the PSK is identical on both devices. Regenerate and reapply if needed. |
| Tunnel flaps (connects and disconnects repeatedly) | Underlay WAN link is unstable or MTU is too high causing fragmentation | Lower the **TUN MTU** to `1300` and check the WAN link for packet loss. |
| "Hub IP is required" validation error | Hub IP field is empty or contains an invalid address | Enter a valid IPv4 address (e.g., `192.0.2.1`). |
| Spoke cannot reach hub | Firewall on the hub or ISP blocking the bonding port | Verify port `5511` (default) is open on the hub's WAN firewall. Check with your ISP if the port is blocked. |
| FEC enabled but no improvement | FEC mode set to Fixed on a link with variable loss | Switch to `Adaptive` FEC, which adjusts overhead based on measured packet loss. |

!!! info "See Also: Controller Manual"
    To configure overlay tunnels globally for all devices in a topology, see
    [Hub-Spoke Topology](../../controller/04-topology/hub-spoke.md) in the Controller Manual.

!!! info "See Also"
    - [Underlay Members](underlay-members.md) -- Add WAN links to the overlay
    - [SD-WAN Encryption](encryption.md) -- Encryption details and cipher options
    - [ADVPN](advpn.md) -- Automatic spoke-to-spoke tunnels
