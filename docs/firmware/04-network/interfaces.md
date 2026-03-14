# Network Interfaces & Devices

!!! note "Standalone & Controller-Managed"
    This feature is available in both standalone and controller-managed modes. In controller-managed mode, some interface settings may be pushed from the controller and cannot be modified locally.

## Overview

The **Interfaces and Devices** page lets you view, configure, and manage all network interfaces on your NexappOS router. You can assign physical ports to firewall zones, create logical devices (bridges, bonds, VLANs), set IP addressing, and tune advanced parameters such as MTU and link speed.

Navigate to **Network > Interfaces and Devices** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You know the IP addressing plan for your network (subnets, gateways, DNS servers).
- If you are creating VLANs, you know the VLAN IDs used by your upstream switches.

## Interface Layout

The page organizes interfaces by **firewall zone**. Each zone (WAN, LAN, Guest, DMZ, etc.) displays the devices assigned to it, along with their current status, IP addresses, and traffic counters. Unconfigured physical ports appear in a separate "Unconfigured" section at the bottom.

For each interface you can see:

- **Link status** -- up or down indicator
- **IPv4 and IPv6 addresses** currently assigned
- **Traffic counters** -- bytes sent and received
- **Device type** -- physical, VLAN, bridge, or bond

## Configuring a Physical Interface

1. Locate the device you want to configure (in the zone list or the unconfigured section).
2. Click the **Configure** button on the device card.
3. Fill in the configuration form:

| Field | Description |
|-------|-------------|
| **Interface Name** | A short identifier (e.g., `wan`, `lan2`). Letters, numbers, and underscores only. |
| **Zone** | The firewall zone to assign this interface to (WAN, LAN, Guest, etc.). |
| **Protocol** | How the interface obtains its IP address (see below). |
| **Metric** | Route metric for this interface. Lower values have higher priority. |

4. Click **Save** to apply your changes.
5. Review the pending changes banner and click **Apply** to commit.

## Addressing Protocols

You can choose one of four addressing protocols when configuring an interface:

### Static

You manually specify the IP address and gateway.

- **IPv4 Address** -- Enter in CIDR notation (e.g., `192.168.1.1/24`).
- **IPv4 Gateway** -- The default gateway for this interface (e.g., `192.0.2.1`).
- **Enable IPv6** -- Toggle on to also configure a static IPv6 address and gateway.

### DHCP

The interface obtains its IPv4 address automatically from an upstream DHCP server. You can customize:

- **Hostname to send** -- Send the device hostname, a custom hostname, or no hostname to the DHCP server.
- **Client ID** -- An optional identifier sent in DHCP requests.
- **Vendor Class** -- An optional vendor class string for DHCP option 60.

### DHCPv6

The interface obtains its IPv6 address via DHCPv6 from an upstream router.

### PPPoE

Used for DSL and fiber connections that require PPP authentication.

- **Username** -- Your ISP-provided PPPoE username.
- **Password** -- Your ISP-provided PPPoE password.

!!! tip
    PPPoE is only available on physical interfaces, not on bridges or bonds.

## Creating Logical Devices

Click the **Create Logical Device** button to add a bridge or bond.

### Bridge

A bridge combines two or more physical ports into a single Layer 2 broadcast domain.

1. Select **Bridge** as the type.
2. Choose two or more physical devices to include.
3. Assign a zone, protocol, and IP address.
4. Click **Save**.

### Bond

A bond aggregates multiple physical ports for redundancy or increased throughput.

1. Select **Bond** as the type.
2. Choose two or more physical devices to include.
3. Select a **Bonding Policy**:

| Policy | Description |
|--------|-------------|
| **Round Robin** (balance-rr) | Transmits packets sequentially across all members. |
| **Active Backup** (active-backup) | Only one member is active; others are standby. |
| **XOR** (balance-xor) | Selects member based on source/destination MAC hash. |
| **Broadcast** | Transmits on all members simultaneously. |
| **802.3ad (LACP)** | IEEE link aggregation; requires switch support. |
| **Adaptive TLB** (balance-tlb) | Adaptive transmit load balancing; no switch support needed. |
| **Adaptive ALB** (balance-alb) | Adaptive load balancing for both transmit and receive. |

4. For Active Backup policy, select the **Primary Device**.
5. Click **Save**.

## Creating a VLAN

1. Click **Add VLAN** on the Interfaces and Devices page.
2. Select the **VLAN Type**:
    - **802.1Q** -- Standard VLAN tagging (most common).
    - **802.1ad** -- Provider bridging (Q-in-Q double tagging).
3. Select the **Base Device** -- the physical port or bond to tag.
4. Enter the **VLAN ID** (1--4094).
5. Click **Create**. The VLAN device appears under the base device and can be configured like any other interface.

## Alias Interfaces

You can add secondary IP addresses to an existing interface using alias interfaces.

1. Click the **Add Alias** button on the interface card.
2. Enter an alias name (e.g., `al_lan`).
3. Add one or more **IPv4 addresses** in CIDR notation (e.g., `192.168.2.1/24`).
4. Optionally add **IPv6 addresses** if IPv6 is enabled on the parent interface.
5. Click **Save**.

To delete an alias, click the trash icon next to it and confirm the deletion.

## Advanced Settings

Expand the **Advanced Settings** section in the interface configuration drawer to access:

| Setting | Description |
|---------|-------------|
| **MTU** | Maximum Transmission Unit in bytes. Default is 1500. Jumbo frames use 9000. |
| **Link Speed / Auto-Negotiation** | Toggle auto-negotiation off to manually select a link speed (e.g., 1000 Mbps full duplex). |

!!! warning
    Changing MTU can cause connectivity issues if the upstream network does not support the configured size. Only change this value if you understand your network's MTU requirements.

## Unconfiguring a Device

To remove all configuration from a device and return it to the unconfigured pool:

1. Click the kebab menu (three dots) on the device card.
2. Select **Unconfigure**.
3. Confirm the action in the modal dialog.

The device will lose its IP address, zone assignment, and all related settings.

## Verification

After configuring an interface, verify it is working:

1. Check the interface card shows a **green "up"** status indicator.
2. Confirm the correct **IPv4/IPv6 address** is displayed.
3. Navigate to **Monitoring > Ping & Traceroute** and ping the gateway address to confirm connectivity.
4. For WAN interfaces, verify internet access by pinging an external address (e.g., `8.8.8.8`).

## Troubleshooting

| Symptom | Possible Cause | Resolution |
|---------|---------------|------------|
| Interface shows "down" after configuration | Cable unplugged, or link speed mismatch with upstream switch | Check physical cable. Try enabling auto-negotiation. |
| No IP address on DHCP interface | Upstream DHCP server unreachable or not responding | Verify cable, check upstream DHCP server, try releasing and renewing. |
| PPPoE fails to connect | Wrong username/password, or ISP requires a specific service name | Double-check credentials with your ISP. |
| VLAN interface has no connectivity | VLAN ID mismatch with upstream switch, or switch port not configured as trunk | Verify the VLAN ID matches the switch configuration. Ensure the switch port is set to trunk mode. |
| Bridge interface drops packets | Spanning Tree loop or incompatible member devices | Remove one member at a time to isolate the issue. |
| Bond shows only one active link | Bonding policy requires switch-side LACP configuration (802.3ad) | Configure LACP on the switch, or use a policy that does not require switch support (e.g., balance-alb). |
| "Interface name already exists" error | Duplicate name | Choose a unique interface name. |

!!! info "See Also"
    - [DNS & DHCP](dns-dhcp.md) -- Configure DHCP server on LAN interfaces
    - [Static Routes](static-routes.md) -- Add routes for specific interfaces
    - [Multi-WAN](multi-wan.md) -- Load balancing and failover across WAN interfaces
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Manage zone assignments and inter-zone traffic rules
