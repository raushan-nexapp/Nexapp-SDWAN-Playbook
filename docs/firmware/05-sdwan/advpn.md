# ADVPN (Automatic Spoke-to-Spoke Tunnels)

!!! note "Controller-Managed Only"
    ADVPN requires controller orchestration to distribute spoke information and coordinate direct tunnel establishment. This feature is not available in standalone mode.

## Overview

By default, all traffic between spokes travels through the hub (hairpin routing). ADVPN (Auto Discovery VPN) eliminates this by automatically creating direct tunnels between spokes when they need to communicate. This reduces latency, saves hub bandwidth, and improves application performance for spoke-to-spoke traffic.

When ADVPN is enabled, the bonding protocol detects spoke-to-spoke traffic flowing through the hub and triggers a shortcut path. The spokes negotiate a direct tunnel using NAT hole-punching, bypassing the hub entirely for that traffic flow. The shortcut is maintained as long as traffic flows and is torn down after an idle timeout.

## Prerequisites

- SD-WAN overlay is configured and operational on all devices (hub and spokes).
- The controller manages the topology and has ADVPN enabled for the network.
- Spokes must be able to reach each other's public WAN IPs (directly or via NAT traversal).

## Configuration

ADVPN is configured on the controller and pushed to devices as part of the topology deployment:

1. Log in to the controller web interface.
2. Navigate to the SD-WAN topology settings.
3. Enable **Mesh / ADVPN** mode for the topology.
4. Deploy the configuration to all devices.

Once deployed, ADVPN operates automatically. No additional configuration is needed on individual routers.

### How Shortcut Tunnels Work

1. Spoke A sends traffic destined for Spoke B. The traffic routes through the hub.
2. The hub detects the spoke-to-spoke flow and signals both spokes.
3. Spoke A and Spoke B exchange connection information through the hub (acting as a signaling relay).
4. Both spokes attempt NAT hole-punching to establish a direct UDP path.
5. If successful, a shortcut tunnel is created. Traffic flows directly between spokes.
6. If hole-punching fails (e.g., both spokes are behind symmetric NAT), traffic continues through the hub.

### NAT Traversal

ADVPN uses UDP hole-punching for NAT traversal. This works with most NAT types:

- **Full Cone NAT** -- Always works.
- **Restricted Cone NAT** -- Works when both sides initiate simultaneously.
- **Port-Restricted Cone NAT** -- Works in most cases.
- **Symmetric NAT** -- May fail. Traffic falls back to hub routing.

## Verification

1. Log in to the controller and check the topology map for direct spoke-to-spoke links.
2. On a spoke router, navigate to **Network > SD-WAN Fabric** and look for active shortcut tunnels in the tunnel list.
3. From Spoke A, run a traceroute to Spoke B's LAN subnet. A direct path (not through the hub's tunnel address) indicates ADVPN is working.
4. Compare latency between spoke-to-spoke traffic with and without ADVPN. Direct tunnels should show lower RTT.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Shortcut tunnel not forming between spokes | Both spokes are behind symmetric NAT, preventing hole-punching | Verify NAT type on both sides. If symmetric NAT is in use, consider placing one spoke on a public IP or using a different NAT device. |
| Shortcut forms but drops after a few seconds | Firewall or NAT timeout is shorter than the keepalive interval | Check the upstream NAT/firewall timeout settings. Ensure UDP sessions are not aggressively timed out. |
| ADVPN not available in the UI | Feature requires controller-managed mode | ADVPN is only available when the device is registered with a controller and the topology has mesh mode enabled. |
| High CPU usage when many shortcuts are active | Large number of concurrent spoke-to-spoke flows each creating separate tunnels | This is expected with many active shortcut paths. Monitor CPU and consider limiting the number of concurrent shortcuts in the controller topology settings. |

!!! info "See Also"
    - [Overlay Tunnels](overlay-tunnels.md) -- Configure the base overlay tunnel
    - [SD-WAN Fabric Overview](overview.md) -- Hub-spoke architecture
    - [SD-WAN Encryption](encryption.md) -- Encryption for overlay and shortcut tunnels
