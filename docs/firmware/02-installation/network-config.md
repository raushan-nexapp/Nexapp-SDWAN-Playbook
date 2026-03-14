# Network Configuration

This page covers network planning fundamentals: how NexappOS assigns interfaces, how firewall zones work, and how to design your WAN and LAN layout before deploying.

!!! note "Standalone & Controller-Managed"
    You can configure network interfaces locally in both modes.
    In controller-managed mode, some interface settings may be overridden
    by controller-pushed configurations.

## Basic Network Planning

Before configuring interfaces, plan your network layout. A typical NexappOS deployment uses:

- **One or more WAN interfaces** connected to ISPs or upstream routers
- **One LAN interface** (or a bridge of multiple ports) serving the local network
- **Optional: a dedicated management interface** for out-of-band access

### Example: Dual-WAN Branch Office

```
ISP-A (Fiber)             ISP-B (LTE/Broadband)
  │                           │
  ▼                           ▼
┌──────────────────────────────────┐
│  NexappOS Router                  │
│  eth0 = WAN1 (192.0.2.10)       │
│  eth1 = WAN2 (198.51.100.20)    │
│  eth2 + eth3 = LAN (bridge)     │
│         192.168.1.1/24           │
└──────────────────────────────────┘
                │
         Local Network
       192.168.1.0/24
```

### Planning Checklist

Answer these questions before you start:

- [ ] How many WAN connections do you have?
- [ ] What IP assignment method does each WAN use (DHCP, static, PPPoE)?
- [ ] What LAN subnet do you need? (Avoid `192.168.1.0/24` if your ISP uses it.)
- [ ] Do you need VLANs on the LAN side?
- [ ] Will this router join an SD-WAN overlay? (If yes, the controller manages overlay interfaces.)

## WAN and LAN Interface Assignment

### Viewing Current Interfaces

1. Navigate to **Network > Interfaces**.
2. You see a list of all configured logical interfaces with their protocol, IP address, and status.

### Default Interface Mapping

On a standard four-port NexappOS router, the default assignment is:

| Physical Port | Logical Interface | Zone | Purpose |
|---|---|---|---|
| eth0 | WAN | WAN | Primary Internet uplink |
| eth1 | (unassigned) | — | Available for WAN2 or other use |
| eth2, eth3 | LAN (bridged) | LAN | Local network |

!!! tip
    If your router has more than four ports, the additional ports are unassigned
    by default. You can assign them as additional WAN links (for Multi-WAN) or
    add them to the LAN bridge.

### Adding a Second WAN Interface

To configure a second WAN link for Multi-WAN failover or load balancing:

1. Navigate to **Network > Interfaces**.
2. Click **Add New Interface**.
3. Set the name to `WAN2`.
4. Select the physical device (for example, `eth1`).
5. Choose the protocol (DHCP, Static, or PPPoE).
6. Set the firewall zone to **WAN**.
7. Click **Save & Apply**.

### Modifying the LAN Bridge

To add or remove physical ports from the LAN bridge:

1. Navigate to **Network > Interfaces**.
2. Click **Edit** on the **LAN** interface.
3. Under **Physical Settings**, select or deselect the ports included in the bridge.
4. Click **Save & Apply**.

## Default Firewall Zones

NexappOS uses a zone-based firewall. Two zones are configured by default:

| Zone | Direction | Default Policy | Description |
|---|---|---|---|
| **LAN** | Inbound | Accept | Trusted local network — all traffic is accepted by default |
| **LAN** | Outbound | Accept | LAN devices can reach the Internet and other zones |
| **WAN** | Inbound | Reject | Untrusted — all unsolicited inbound traffic is blocked |
| **WAN** | Outbound | Accept | Router can initiate outbound connections |
| **LAN → WAN** | Forwarding | Accept | LAN clients can access the Internet (with masquerading/NAT) |
| **WAN → LAN** | Forwarding | Reject | Internet traffic cannot reach LAN unless explicitly allowed |

### How Zones Protect Your Network

- **WAN inbound reject** blocks all unsolicited Internet traffic from reaching the router or LAN.
- **Masquerading** on the WAN zone translates LAN private IPs to the WAN public IP for outbound traffic.
- **Port forwarding** rules can selectively allow inbound traffic to specific LAN hosts and ports.

!!! warning
    Do not change the WAN zone default policy to "Accept" unless you have a
    specific reason and have added appropriate filtering rules. An open WAN zone
    exposes the router and LAN to the Internet.

### Viewing and Editing Zones

1. Navigate to **Firewall > Zones & Policies**.
2. You see the zone list with input, output, and forward policies.
3. Click a zone name to edit its settings, or click **Add Zone** to create a new zone (for example, a DMZ or guest network).

## Common Network Layouts

### Single WAN, Single LAN (Basic)

Best for small offices with one Internet connection.

- WAN: `eth0` (DHCP or static)
- LAN: `eth1-eth3` (bridged, `192.168.1.0/24`)

### Dual WAN, Single LAN (Redundancy)

Best for branch offices needing Internet failover.

- WAN1: `eth0` (primary ISP)
- WAN2: `eth1` (backup ISP)
- LAN: `eth2-eth3` (bridged, `192.168.1.0/24`)
- Configure Multi-WAN under **Network > Multi-WAN** for failover or load balancing.

### Dual WAN, Dual LAN (Segmented)

Best for environments needing network segmentation (for example, corporate and guest).

- WAN1: `eth0`, WAN2: `eth1`
- LAN: `eth2` (`192.168.1.0/24` — corporate)
- GUEST: `eth3` (`192.168.2.0/24` — guest, isolated from LAN)

!!! info "See Also"
    - [Multi-WAN](../04-network/multi-wan.md) — failover and load balancing across WAN links
    - [Firewall & Security](../10-firewall/zones-policies.md) — advanced zone configuration, rules, and NAT
    - [Controller Registration](controller-registration.md) — connect to centralized management
