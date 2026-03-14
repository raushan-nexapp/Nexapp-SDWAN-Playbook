# NAT Rules

Network Address Translation (NAT) controls how the router rewrites source and destination IP addresses as packets cross zone boundaries. NexappOS provides three NAT features on a single page: Source NAT rules, Network Mapping (Netmap), and NAT Helpers.

!!! note "Standalone & Controller-Managed"
    You can configure NAT rules from the local web UI in both modes.

## Overview

NAT is divided into two tabs in the web UI:

- **Rules & Netmap** — Source NAT rules and network-to-network mapping
- **NAT Helpers** — Protocol-aware modules that fix NAT-incompatible protocols

### Source NAT vs. Masquerade

| Action | Behavior | When to Use |
|---|---|---|
| **SNAT** | Rewrites the source IP to a specific address you choose | Static WAN IP — more efficient because the kernel caches the translation |
| **MASQUERADE** | Rewrites the source IP to the outgoing interface's current address | Dynamic WAN IP (DHCP, PPPoE) — automatically adapts when the address changes |
| **ACCEPT** | Allows traffic without any address rewriting | Traffic that should pass through untranslated |

## Prerequisites

- At least one configured WAN interface with a valid IP address
- Knowledge of the source and destination subnets involved
- For SNAT: a static WAN IP address to use as the rewrite address

## Source NAT Rules

### Creating a Source NAT Rule

1. Navigate to **Firewall > NAT**.
2. On the **Rules & Netmap** tab, click **Add NAT Rule**.
3. Fill in the fields:

| Field | Description | Example |
|---|---|---|
| Rule Name | Descriptive name | `LAN to WAN SNAT` |
| Source Address | Source subnet or host (IPv4 address or CIDR) | `192.168.1.0/24` |
| Outbound Zone | Zone through which traffic exits | WAN |
| Destination Address | Destination subnet or `0.0.0.0/0` for any | `0.0.0.0/0` |
| Action | SNAT, MASQUERADE, or ACCEPT | SNAT |
| Rewrite IP Address | (SNAT only) The IP address to rewrite the source to | `192.0.2.10` |

4. Click **Add NAT Rule**.

!!! tip
    The source and destination address fields offer auto-complete suggestions
    based on hosts and networks already known to the router. You can also type
    a custom address or CIDR.

### Masquerade Rule

To create a masquerade rule for a dynamic WAN connection:

1. Follow the same steps above, but select **MASQUERADE** as the action.
2. The **Rewrite IP Address** field is hidden because the router automatically uses the outgoing interface's current IP.

### Advanced Settings

Click **Advanced Settings** to reveal the **Device** field, which lets you bind the NAT rule to a specific network device (for example, `eth0`). Leave this set to **Any** unless you need to restrict NAT to a single physical interface.

### Editing and Deleting NAT Rules

- To edit a rule, click the action menu on the rule row and select **Edit**.
- To delete a rule, click the action menu and select **Delete**, then confirm.

## Network Mapping (Netmap)

Netmap performs 1:1 network-to-network address translation. It maps an entire subnet to another subnet of the same size. This is useful when you need to connect two networks that use overlapping IP ranges or when you want to present your internal network under a different address range.

There are two types of Netmap rules:

- **Source Netmap** — Rewrites the source network. You specify the destination network and the source mapping.
- **Destination Netmap** — Rewrites the destination network. You specify the source network and the destination mapping.

### Creating a Netmap Rule

1. Navigate to **Firewall > NAT**.
2. On the **Rules & Netmap** tab, scroll down to the **Netmap** section.
3. Click **Add Source Netmap** or **Add Destination Netmap**.
4. Fill in the fields:

| Field | Description | Example |
|---|---|---|
| Name | Descriptive name for the mapping | `Branch Overlap Fix` |
| Source/Destination Network | The peer network (CIDR notation) | `10.0.1.0/24` |
| Map From | Original network range (CIDR) | `192.168.1.0/24` |
| Map To | Translated network range (CIDR) | `172.16.1.0/24` |

5. (Optional) Click **Advanced Settings** to restrict the mapping to specific inbound or outbound devices.
6. Click **Add Netmap**.

### Example: Overlapping Subnet Resolution

Two branch offices both use `192.168.1.0/24`. To allow them to communicate through an SD-WAN tunnel, create a source Netmap on Branch A:

| Field | Value |
|---|---|
| Destination Network | `192.168.1.0/24` (Branch B) |
| Map From | `192.168.1.0/24` (Branch A real) |
| Map To | `172.16.1.0/24` (Branch A translated) |

Branch B sees Branch A's traffic arriving from `172.16.1.0/24` instead of the conflicting `192.168.1.0/24`.

## NAT Helpers

NAT helpers are protocol-aware modules that inspect packet payloads and fix embedded IP addresses that NAT would otherwise break. Some protocols (such as FTP, SIP, and H.323) include IP addresses inside the application data, which must be rewritten to match the translated addresses.

### Viewing and Managing Helpers

1. Navigate to **Firewall > NAT**.
2. Click the **NAT Helpers** tab.
3. The table lists all available helpers with their status:

| Column | Description |
|---|---|
| Name | Helper module name (for example, `ftp`, `sip`, `pptp`) |
| Enabled | Whether the helper is active |
| Loaded | Whether the kernel module is currently loaded |

4. Use the filter text box to search for a specific helper by name.

### Enabling or Disabling a Helper

1. Click the action menu on the helper row and select **Edit**.
2. Toggle the **Enabled** switch.
3. Click **Save**.

### Common Helpers

| Helper | Protocol | Purpose |
|---|---|---|
| `ftp` | FTP | Fixes data channel negotiation for active FTP connections |
| `sip` | SIP/VoIP | Rewrites SDP bodies so VoIP calls traverse NAT correctly |
| `pptp` | PPTP VPN | Tracks GRE sessions for PPTP VPN passthrough |
| `tftp` | TFTP | Handles TFTP data connections through NAT |
| `h323` | H.323 | Fixes signaling for H.323 video conferencing |
| `amanda` | Amanda | Backup protocol helper |
| `irc` | IRC DCC | Fixes direct client-to-client file transfers |
| `snmp` | SNMP | Rewrites SNMP trap addresses |

## Verification

After creating NAT rules:

1. From a device in the source subnet, access a resource in the destination subnet.
2. On the destination side, verify that the source IP appears as the translated address (use **Firewall > Conntrack** to inspect active connections).
3. For Netmap rules, verify that both sides can communicate using the mapped addresses.
4. For NAT helpers, test the specific protocol (for example, transfer a file via FTP to confirm the data channel works).

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Outbound traffic uses the wrong source IP | SNAT rule has incorrect rewrite IP | Edit the NAT rule and correct the **Rewrite IP Address** |
| NAT works on one WAN but not another | Rule is bound to a specific device | Edit the rule, open **Advanced Settings**, and set **Device** to **Any** |
| FTP data transfers fail through NAT | FTP NAT helper is disabled | Go to **NAT Helpers** tab and enable the `ftp` helper |
| VoIP calls connect but have no audio | SIP helper is disabled or blocked | Enable the `sip` NAT helper and ensure UDP ports 5060 and RTP range are not blocked |
| Netmap rule does not translate addresses | Map From and Map To subnets have different sizes | Both CIDR ranges must have the same prefix length (for example, both `/24`) |
| MASQUERADE rule stops working after WAN reconnect | Stale conntrack entries | Go to **Firewall > Conntrack** and clear stale entries, or wait for them to time out |
