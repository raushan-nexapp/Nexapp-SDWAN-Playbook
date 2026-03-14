# Firewall Zones & Policies

Firewall zones group network interfaces together and define how traffic flows between them. Every interface on your NexappOS router belongs to exactly one zone, and zone-to-zone forwarding policies control which traffic is allowed to cross zone boundaries.

!!! note "Standalone & Controller-Managed"
    You can create and manage zones from the local web UI in both modes.
    In controller-managed mode, the controller may push additional zone
    configurations that cannot be modified locally.

## Overview

NexappOS uses a zone-based firewall model. Rather than writing rules for individual interfaces, you assign interfaces to zones and then set policies that govern traffic between those zones. This approach scales well as you add interfaces and simplifies policy management.

### Default Zones

Every NexappOS installation includes these built-in zones:

| Zone | Color | Purpose | Default Interfaces |
|---|---|---|---|
| **LAN** | Green | Trusted local network | `br-lan` (bridged LAN ports) |
| **WAN** | Red | Untrusted Internet-facing network | `wan`, `wan6` |
| **GUEST** | Blue | Isolated guest network (created via preset) | Assigned on creation |
| **DMZ** | Orange | Demilitarized zone for public-facing servers | Assigned on creation |

Additional zones are created automatically when you configure VPN tunnels (OpenVPN, IPsec, WireGuard) or SD-WAN overlays. These system-managed zones cannot be deleted.

### Traffic Direction Terminology

Each zone has three traffic policy settings:

| Policy | Meaning |
|---|---|
| **Traffic to Firewall** (Input) | Traffic from this zone addressed to the router itself (for example, DHCP requests, DNS queries, management access) |
| **Traffic to Same Zone** (Forward) | Traffic between devices within the same zone |
| **Traffic to WAN** | Whether devices in this zone can reach the Internet |

Each policy is set to one of three actions: **ACCEPT** (allow), **REJECT** (deny with notification), or **DROP** (silently discard).

## Prerequisites

- Administrative access to the NexappOS web UI
- A clear understanding of which interfaces serve which network segments

## Viewing Zones

1. Navigate to **Firewall > Zones and Policies**.
2. The zones table displays all configured zones with the following columns:

| Column | Description |
|---|---|
| Zone | Zone name and color-coded icon |
| Allow Forwards To | Other zones this zone is permitted to send traffic to |
| Traffic to WAN | Whether outbound Internet access is allowed (ACCEPT or REJECT) |
| Traffic to Firewall | Input policy for traffic destined to the router |
| Traffic to Same Zone | Forward policy for intra-zone traffic |
| Interfaces | Network interfaces assigned to this zone |
| Logging | Whether traffic matching this zone's policies is logged |

## Creating a Zone

### Using a Preset (Guest or DMZ)

Presets pre-configure zone settings with secure defaults and automatically create the necessary firewall rules (such as allowing DNS and DHCP from guest devices).

1. Navigate to **Firewall > Zones and Policies**.
2. Click **Add Zone**.
3. In the side panel, select a preset:
    - **Guest** — Creates a zone that allows WAN access but blocks forwarding to LAN. Automatically adds rules to allow DNS and DHCP from guest devices.
    - **DMZ** — Creates a zone that allows WAN access but blocks forwarding to LAN. Adds a DNS rule automatically.
4. Review the pre-filled settings. The zone name, forwarding rules, and traffic policies are set automatically.
5. Click **Add Zone**.

### Creating a Custom Zone

1. Navigate to **Firewall > Zones and Policies**.
2. Click **Add Zone**.
3. Select **Custom Zone** as the type.
4. Fill in the following fields:

| Field | Description | Example |
|---|---|---|
| Name | Alphanumeric zone name (displayed in uppercase) | `SERVERS` |
| Allow Forwards To | Zones this zone can send traffic to | LAN |
| Allow Forwards From | Zones allowed to send traffic into this zone | LAN |
| Traffic to WAN | Enable to allow Internet access | Enabled |
| Traffic to Firewall | Policy for traffic to the router (DROP, REJECT, ACCEPT) | DROP |
| Traffic to Same Zone | Policy for intra-zone forwarding (DROP, REJECT, ACCEPT) | DROP |
| Logging | Log traffic matching this zone's default policies | Disabled |

5. Click **Add Zone**.

!!! tip
    Set **Traffic to Firewall** and **Traffic to Same Zone** to **DROP** by default, then create specific firewall rules to allow only the services you need. This follows the principle of least privilege.

## Editing a Zone

1. Navigate to **Firewall > Zones and Policies**.
2. Click the action menu on the zone row and select **Edit**.
3. Modify the zone settings as needed.
4. Click **Save**.

!!! warning
    Changing forwarding policies on a production zone affects all traffic immediately.
    Plan changes during a maintenance window.

## Deleting a Zone

1. Navigate to **Firewall > Zones and Policies**.
2. Click the action menu on the zone row and select **Delete**.
3. Confirm the deletion.

Built-in zones (LAN, WAN) and system-managed zones (created by VPN or SD-WAN services) cannot be deleted.

## Zone Forwarding Examples

### Allow LAN-to-WAN (Default)

By default, the LAN zone forwards traffic to WAN so that LAN devices can access the Internet. This is pre-configured on a fresh installation.

### Isolate Guest from LAN

The Guest preset blocks all traffic from GUEST to LAN while allowing GUEST to WAN. Guest devices can browse the Internet but cannot reach printers, file servers, or other resources on the LAN.

### DMZ with Controlled LAN Access

Create a DMZ zone with WAN access enabled, then add a specific firewall rule (under **Firewall > Rules**) to allow traffic from DMZ to LAN only on the ports your servers need.

## Verification

After creating or modifying zones, verify your configuration:

1. Check that the zone appears in the **Firewall > Zones and Policies** table with the correct forwarding and policy settings.
2. From a device in the source zone, attempt to reach a device in the destination zone. Traffic should be allowed or blocked according to your policies.
3. If logging is enabled, check the system log (**System > Logs**) for entries matching the zone name.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| LAN devices cannot reach the Internet | Traffic to WAN is disabled on the LAN zone | Edit the LAN zone and enable **Traffic to WAN** |
| Guest devices can access LAN resources | Forwarding from GUEST to LAN is allowed | Edit the GUEST zone and remove LAN from **Allow Forwards To** |
| Cannot delete a zone | Zone is a built-in or system-managed zone | System zones cannot be deleted; you can only edit their policies |
| New zone does not appear in the list | Browser cache showing stale data | Refresh the page and check if the zone was saved correctly |
| Traffic is dropped but no log entries appear | Logging is disabled on the zone | Edit the zone and enable **Logging** |
