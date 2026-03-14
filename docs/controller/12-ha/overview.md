# High Availability Overview

## Overview

NexappOS provides two independent layers of high availability that work together to ensure continuous network operation even when hardware or infrastructure fails.

Navigate to **High Availability** in the controller navigation to access HA management.

## Two HA Layers

### Layer 1: Router HA (VRRP)

Router HA protects against failure of a single physical router at a site. Two NexappOS routers — a primary and a backup — are deployed at the same location and share a Virtual IP address. LAN clients use the Virtual IP as their gateway. If the primary router fails, the backup claims the Virtual IP and takes over traffic in approximately 3 seconds.

This layer is managed through the controller's **High Availability > HA Devices** section.

### Layer 2: Controller HA (DC/DR)

Controller HA protects against failure of the controller itself. Two controller instances are deployed — a primary Data Center (DC) and a standby Disaster Recovery (DR) site. Each NexappOS router monitors the controller's reachability. If the DC controller becomes unreachable for 90 consecutive seconds (3 missed checks), each router automatically switches its configuration to connect to the DR controller URL.

This layer is configured on the routers themselves and does not require manual intervention at the controller. See [DC/DR Failover](dcdr-failover.md) for setup details.

## Comparing the Two Layers

| Attribute | Router HA (VRRP) | Controller HA (DC/DR) |
|-----------|-----------------|----------------------|
| Protects against | Primary router hardware failure | Controller server failure |
| Failover time | ~3 seconds | ~2 minutes |
| IP preserved | Yes — Virtual IP stays the same | Yes — ZeroTier identity preserved |
| Re-registration needed | No | No |
| Manual action on failure | None | None |
| Managed from | Controller — **High Availability > HA Devices** | Routers — device configuration |
| Services synced | 27 services (SD-WAN, VPN, QoS, firewall, DPI) | All services — devices reconnect to DR controller |

## How Router HA Works

The two routers in a VRRP cluster continuously send heartbeat messages to each other over a dedicated physical interface. The primary router has a VRRP priority of 100; the backup has 90.

If the backup stops receiving heartbeats from the primary for 3 consecutive intervals (~3 seconds):

1. The backup promotes itself to primary (master) and claims the Virtual IP.
2. A gratuitous ARP is broadcast to update all LAN switches with the new MAC-to-IP mapping.
3. All connected SD-WAN tunnels are re-established from the new primary.
4. The 27 synchronized services restart on the backup router using the most recently synchronized configuration.

When the original primary comes back online, it can optionally reclaim the primary role — this behavior depends on whether **Preemption** is enabled in the HA configuration.

## Synchronized Services

When failover occurs, the following service categories are restored on the backup router using configuration synchronized from the primary:

- **SD-WAN** — Bonding overlay, WAN member settings, FEC configuration
- **Routing** — BGP session config, OSPF area config, static routes
- **VPN** — IPsec profiles, OpenVPN tunnels, WireGuard peers
- **QoS** — Traffic shaping rules, bandwidth limits
- **DPI** — Application signatures, category policies
- **Security** — Firewall rules, NAT masquerade rules, threat shield settings
- **Network** — Interface settings, VLANs, DHCP server state
- **System** — NTP, DNS resolver, scheduled tasks

## HA Dashboard

Navigate to **High Availability** to see a summary of all HA pairs in your organization:

| Column | Description |
|--------|-------------|
| **HA Pair Name** | Configured name for the pair (e.g., "Mumbai-HQ-HA") |
| **Primary Device** | Currently active primary router and its status |
| **Backup Device** | Standby router and its status |
| **Virtual IP** | Shared Virtual IP address used by LAN clients |
| **State** | Normal, Failover Active, Split-Brain, or Sync Error |
| **Last Sync** | Timestamp of the most recent successful configuration sync |
| **Last Failover** | Date and time of the most recent failover event (if any) |

## Prerequisites for Router HA

Before configuring a VRRP pair, ensure:

- Two NexappOS routers are deployed at the same physical site.
- Both routers are connected to the same LAN switch.
- A dedicated physical interface is available on each router for the HA heartbeat link — connect these directly with an Ethernet cable.
- Both routers are running the same firmware version.
- A Virtual IP address is available in the LAN subnet that is not assigned to any other host.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Both routers show as Primary (Split-Brain) | Heartbeat interface disconnected | Restore the physical heartbeat cable between the two routers |
| Backup shows "Sync Error" | SSH connectivity between nodes broken | Verify the heartbeat interface is up; check that both routers can reach each other on the dedicated HA link |
| Failover not occurring after primary failure | VRRP priority misconfigured | Verify primary = 100 and backup = 90 in HA device settings |
| Services not recovered after failover | Sync was out of date at time of failure | Force a sync before expected maintenance windows using **Sync Now** in the HA device settings |

!!! info "See Also"
    - [HA Configuration](configuration.md) — Step-by-step VRRP pair setup
    - [DC/DR Failover](dcdr-failover.md) — Controller-level failover between data centers
    - [Router HA](../../firmware/09-ha/overview.md) — Router-side HA management and VRRP setup wizard
