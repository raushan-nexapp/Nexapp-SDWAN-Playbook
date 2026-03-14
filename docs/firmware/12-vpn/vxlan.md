# VXLAN

!!! note "Standalone & Controller-Managed"
    VXLAN interfaces can be configured locally on the router or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Virtual Extensible LAN (VXLAN) extends Layer 2 Ethernet segments across Layer 3 IP networks. Each VXLAN segment is identified by a 24-bit VXLAN Network Identifier (VNI), supporting up to 16 million isolated virtual networks. VXLAN is commonly used for data center interconnect, multi-tenant environments, and bridging geographically separated LANs.

Navigate to **VPN > VXLAN** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- At least one WAN or LAN interface is configured as the underlay transport.
- The remote VTEP (VXLAN Tunnel Endpoint) is reachable over the IP network.
- UDP port `4789` is permitted by intermediate firewalls (or your custom port).

## Configuration

### Viewing Existing Interfaces

The main table displays all configured VXLAN interfaces with these columns:

| Column | Description |
|--------|-------------|
| **Interface Name** | Logical name of the VXLAN interface (e.g., `vxlan0`). Max 15 characters. |
| **Base Interface** | Physical interface used as the underlay transport (e.g., `eth0`). |
| **VID** | VXLAN Network Identifier. Valid range: `1` to `16777215`. |
| **Peer IP** | IP address of the remote VTEP. |
| **Port** | UDP destination port (default: `4789`). |
| **IP Address** | Optional IP assigned to the local VXLAN interface. |
| **Service** | Whether the interface is **Enabled** or **Disabled**. |

### Creating a VXLAN Interface

1. Click **Add Interface**.
2. Set **Service** to **Enabled**.
3. Enter an **Interface Name** (e.g., `vxlan0`).
4. Enter the **Base Interface** used for underlay transport (e.g., `eth0`).
5. Set the **VID** (VXLAN Network Identifier) -- this must match on both endpoints (e.g., `100`).
6. Enter the **Peer IP** -- the remote VTEP address (e.g., `198.51.100.5`).
7. Set the **Port** (default `4789`). Both endpoints must use the same port.
8. Optionally enter an **IP Address** for the local VXLAN interface (e.g., `10.0.0.1`).
9. Click **Save**.

### Editing or Deleting

- Click the edit icon to modify settings. The **Interface Name** cannot be changed after creation.
- Click the delete icon to remove a VXLAN interface.

## Verification

1. Create matching VXLAN interfaces on both endpoints with the same VID and port.
2. Confirm the interface shows **Enabled** in the table.
3. If IP addresses are assigned, ping the remote VXLAN IP:

    ```bash
    ping 10.0.0.2
    ```

4. For Layer 2 bridging, verify that MAC addresses from the remote LAN appear in the local bridge's forwarding table.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Peer unreachable over VXLAN | UDP port blocked by intermediate firewall | Ensure UDP port `4789` (or your custom port) is allowed between the two VTEPs. |
| VID mismatch -- no traffic flows | VNI configured differently on each endpoint | Verify both endpoints use the same **VID** value. |
| High overhead or fragmentation | MTU not adjusted for VXLAN encapsulation (50-byte overhead) | Reduce the underlay interface MTU or set the VXLAN interface MTU to `1450` to prevent fragmentation. |
| Interface created but no L2 connectivity | VXLAN interface not added to a bridge | Bridge the VXLAN interface with the target LAN interface to enable Layer 2 forwarding. |

!!! info "See Also"
    - [GRE Tunnels](gre.md) -- Simpler point-to-point Layer 3 encapsulation
    - [WireGuard VPN](wireguard.md) -- Encrypted overlay tunnels
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Assign VXLAN interfaces to firewall zones
