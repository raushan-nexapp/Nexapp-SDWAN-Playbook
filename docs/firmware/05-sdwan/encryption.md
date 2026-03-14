# SD-WAN Encryption

!!! note "Standalone & Controller-Managed"
    Encryption settings can be configured locally or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

NexappOS SD-WAN encrypts all overlay tunnel traffic using IPsec. Encryption is enabled automatically when you configure a pre-shared key (PSK) during overlay setup. The IPsec tunnel protects data confidentiality and integrity across untrusted WAN connections.

The encryption subsystem includes an auto-recovery monitor that detects IPsec tunnel failures and automatically re-establishes the secure connection without manual intervention.

## Prerequisites

- The overlay tunnel is configured with a PSK (see [Overlay Tunnels](overlay-tunnels.md)).
- Both hub and spoke devices use the same PSK.
- UDP port `500` (IKE) and UDP port `4500` (NAT-T) are not blocked by upstream firewalls.

## Configuration

Encryption is configured as part of the overlay tunnel setup. When you save an overlay with a PSK, the system automatically:

1. Enables IPsec on the bonding tunnel interface.
2. Configures the IKE negotiation with the PSK.
3. Starts the auto-recovery monitor for fault tolerance.

### Enabling Encryption

1. Navigate to **Network > SD-WAN Fabric > Tunnels**.
2. Click **Edit Overlay**.
3. In the **Pre-Shared Key (PSK)** section, either:
    - Click **Use generated key** to create a strong 32-byte random key, or
    - Click **Use custom key** and enter a key of at least 16 characters.
4. Click **Save**. IPsec is enabled automatically.

### Changing the PSK

1. Open the overlay settings.
2. Click **Change** next to the "PSK is configured" badge.
3. Generate or enter a new key.
4. Click **Save**.
5. Update the peer device with the same new key immediately.

!!! danger "Security Warning"
    Always use a strong PSK (32+ characters). Weak keys are vulnerable to brute-force attacks. Never share PSKs over unencrypted channels (email, chat). Use a secure out-of-band method.

### Disabling Encryption

To disable encryption, remove the PSK from the overlay settings on both hub and spoke. Traffic will flow unencrypted through the bonding tunnel.

!!! warning
    Disabling encryption exposes all tunnel traffic to eavesdropping on the underlay network. Only disable encryption in trusted private networks (e.g., MPLS).

## Cipher Negotiation

The IPsec subsystem negotiates the strongest mutually supported cipher automatically. No manual cipher selection is required. The system supports modern cipher suites including AES-256 for encryption and SHA-256 for integrity.

## Auto-Recovery

The auto-recovery monitor runs continuously and handles the following scenarios:

- **IPsec tunnel drop** -- Detects when the IPsec SA expires or is torn down, and re-establishes it automatically.
- **WAN failover** -- When a WAN link fails and the bonding protocol switches to another member, IPsec re-negotiates on the new path.
- **Reboot recovery** -- After a device reboot, IPsec tunnels are restored automatically as part of the SD-WAN startup sequence.

## Verification

1. Navigate to **Network > SD-WAN Fabric > Tunnels** and verify the overlay shows **Connected** with encryption enabled.
2. Check the PSK badge shows "PSK is configured" (green shield icon).
3. Navigate to **Policy Engine > Performance SLA** and verify link health metrics are flowing (encrypted traffic should not significantly increase latency).

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| PSK mismatch error | Hub and spoke have different PSKs | Re-enter the same PSK on both devices. Generate a new key if unsure which device has the correct key. |
| Tunnel performance degrades with encryption | CPU overload on low-power devices handling encryption | Encryption adds CPU overhead. On devices with hardware crypto acceleration this is negligible. On low-power devices, consider reducing the number of concurrent tunnels. |
| IPsec tunnel does not establish | UDP ports 500 and 4500 blocked by upstream firewall or ISP | Verify that IKE (UDP `500`) and NAT-T (UDP `4500`) traffic is permitted through all firewalls between hub and spoke. |
| Encryption re-negotiation causes brief traffic drop | Normal IKE re-keying behavior | Re-keying causes a sub-second traffic interruption. This is expected. If drops are frequent, check for clock drift between devices. |

!!! info "See Also"
    - [Overlay Tunnels](overlay-tunnels.md) -- Configure overlay and PSK settings
    - [SD-WAN Fabric Overview](overview.md) -- Architecture overview
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Configure firewall rules for IPsec traffic
