# GRE Tunnels

!!! note "Standalone & Controller-Managed"
    GRE tunnels can be configured locally on the router or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Generic Routing Encapsulation (GRE) creates point-to-point tunnels that encapsulate a wide variety of network layer protocols inside virtual point-to-point links. GRE tunnels are commonly used to connect sites running non-IP protocols, bridge isolated subnets across an IP backbone, or provide connectivity to legacy devices that do not support IPsec or WireGuard.

Navigate to **VPN > GRE** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- At least one WAN interface is configured with a routable IP address.
- The remote endpoint is reachable from the local WAN IP.
- IP protocol 47 (GRE) is permitted by any intermediate firewalls.

## Configuration

### Viewing Existing Tunnels

The main table displays all configured GRE tunnels with the following columns:

| Column | Description |
|--------|-------------|
| **Tunnel Name** | Short identifier for the tunnel (max 8 characters). |
| **Service** | Whether the tunnel is **Enabled** or **Disabled**. |
| **Local Virtual IP** | IP address on the local side of the tunnel interface. |
| **Peer Virtual IP** | IP address on the remote side of the tunnel interface. |
| **Local Extern IP** | Physical WAN IP of this router (tunnel source). |
| **Peer Extern IP** | Physical WAN IP of the remote router (tunnel destination). |
| **Key** | Optional tunnel key for demultiplexing multiple GRE sessions between the same endpoints. |
| **MTU** | Maximum transmission unit for the tunnel (typically `1476` for GRE over Ethernet). |
| **Netmask** | Subnet mask for the tunnel interface network. |

### Creating a GRE Tunnel

1. Click **Add Tunnel**.
2. Set **Service** to **Enabled**.
3. Enter a **Tunnel Name** (e.g., `gre1`). Must contain letters, not only numbers, and be at most 8 characters.
4. Enter an **Interface Name** (e.g., `gre-wan1`). Same naming rules apply.
5. Fill in the IP fields:
    - **Local Virtual IP** -- the tunnel-side IP on this router (e.g., `10.0.0.1`).
    - **Peer Virtual IP** -- the tunnel-side IP on the remote router (e.g., `10.0.0.2`).
    - **Local External IP** -- this router's WAN IP (e.g., `192.0.2.10`).
    - **Peer External IP** -- the remote router's WAN IP (e.g., `198.51.100.20`).
6. Optionally set **Key** (e.g., `100`), **MTU** (e.g., `1476`), and **Netmask** (e.g., `255.255.255.0`).
7. Click **Save**.

### Editing or Deleting

- Click the edit icon next to a tunnel to modify its settings. The **Tunnel Name** cannot be changed after creation.
- Click the delete icon to remove a tunnel. A confirmation dialog appears before deletion.

## Verification

1. Create a GRE tunnel on both the local and remote routers with matching external IPs and compatible virtual IPs.
2. Verify the tunnel shows **Enabled** in the table.
3. From the router CLI, ping the peer virtual IP to confirm tunnel connectivity:

    ```bash
    ping 10.0.0.2
    ```

4. Check that routes to the remote network traverse the GRE tunnel interface.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Tunnel shows Enabled but ping fails | IP protocol 47 blocked by intermediate firewall | Verify that GRE (protocol 47) is allowed on all firewalls between the two endpoints. |
| High packet loss on tunnel | MTU too large causing fragmentation | Lower the **MTU** to `1476` or smaller. Run path MTU discovery to find the optimal value. |
| Cannot create tunnel -- name validation error | Tunnel name exceeds 8 characters or contains only numbers | Use a shorter name that includes at least one letter (e.g., `gre1`). |
| Traffic not routing through tunnel | Missing static route for remote subnet | Add a static route pointing the remote subnet to the peer virtual IP via the GRE interface. |

!!! info "See Also"
    - [IPsec VPN](ipsec.md) -- Encrypted site-to-site tunnels with stronger security
    - [VXLAN](vxlan.md) -- Layer 2 extension over Layer 3 networks
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Assign GRE interfaces to firewall zones
