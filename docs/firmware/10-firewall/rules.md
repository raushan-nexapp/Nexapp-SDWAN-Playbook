# Firewall Rules

Firewall rules control whether specific traffic is allowed, rejected, or dropped as it passes through the router. Rules provide fine-grained control beyond the default zone policies, letting you allow or block traffic based on source, destination, protocol, port, and zone.

!!! note "Standalone & Controller-Managed"
    You can manage firewall rules from the local web UI in both modes.
    In controller-managed mode, the controller may push additional rules
    that appear as system rules and should be edited with caution.

## Overview

NexappOS organizes firewall rules into three categories based on traffic direction:

| Rule Type | Traffic Direction | Use Case |
|---|---|---|
| **Forward Rules** | Traffic passing through the router from one zone to another | Controlling LAN-to-WAN, GUEST-to-LAN, or inter-VLAN traffic |
| **Input Rules** | Traffic destined to the router itself | Controlling access to management services (SSH, web UI, DNS, DHCP) |
| **Output Rules** | Traffic originating from the router | Controlling what the router itself can reach (updates, NTP, logging) |

Rules are evaluated top-to-bottom. The first matching rule determines the action taken. If no rule matches, the zone's default policy applies.

## Prerequisites

- Firewall zones configured (see [Zones & Policies](zones-policies.md))
- Knowledge of the source/destination IP addresses, ports, and protocols for the traffic you want to control

## Creating a Firewall Rule

1. Navigate to **Firewall > Rules**.
2. Select the appropriate tab: **Forward Rules**, **Input Rules**, or **Output Rules**.
3. Click **Add Forward Rule**, **Add Input Rule**, or **Add Output Rule** (depending on the tab).
4. Fill in the rule fields:

### General Settings

| Field | Description | Example |
|---|---|---|
| Status | Enable or disable the rule | Enabled |
| Rule Name | Descriptive name for the rule | `Allow HTTPS from LAN` |

### Source Settings (Forward and Input Rules)

| Field | Description | Example |
|---|---|---|
| Source Type | Enter addresses manually, select a network object, or choose **Any** | Enter one or more addresses |
| Source Addresses | One or more IP addresses, CIDR ranges, or IP ranges | `192.168.1.0/24` |
| Source Zone | Zone where the traffic originates (or **Any** for all zones) | LAN |

### Destination Settings (Forward and Output Rules)

| Field | Description | Example |
|---|---|---|
| Destination Type | Enter addresses manually, select a network object, or choose **Any** | Enter one or more addresses |
| Destination Addresses | One or more IP addresses, CIDR ranges, or IP ranges | `10.0.0.0/8` |
| Destination Zone | Zone where the traffic is heading (or **Any** for all zones) | WAN |

!!! info "Input and Output Differences"
    For **Input Rules**, the destination is always the router itself — there is no
    destination zone or address field. For **Output Rules**, the source is always
    the router itself — there is no source zone or address field.

### Service and Protocol

| Field | Description | Example |
|---|---|---|
| Destination Service | Predefined service (HTTP, HTTPS, SSH, DNS, etc.), **Custom**, or **Any** | HTTPS |
| Protocols | (Custom service only) One or more protocols: TCP, UDP, ICMP, etc. | TCP |
| Ports | (Custom service with TCP/UDP) Comma-separated list or range | `443, 8443` |

When you select a predefined service, the protocol and port are filled in automatically. Select **Custom** to specify your own protocol and port combination. Select **Any** to match all traffic regardless of protocol or port.

!!! tip "Port Syntax"
    You can enter ports as a comma-separated list (`80, 443, 8080`), a range
    (`8000-8100`), or a combination of both (`80, 443, 8000-8100`).

### Action

| Action | Behavior |
|---|---|
| **ACCEPT** | Allow the traffic to pass |
| **REJECT** | Block the traffic and send an ICMP "destination unreachable" response to the sender |
| **DROP** | Silently discard the traffic with no response |

!!! tip "REJECT vs. DROP"
    Use **REJECT** for traffic from trusted zones (LAN) so that clients get
    immediate feedback. Use **DROP** for traffic from untrusted zones (WAN) to
    avoid revealing the router's presence.

### Rule Position

When creating a new rule, you choose where it is inserted:

| Position | Behavior |
|---|---|
| **Add to the Bottom** | Rule is evaluated last (default) |
| **Add to the Top** | Rule is evaluated first — useful for override rules |

### Advanced Settings

Click **Advanced Settings** to reveal additional options:

| Field | Description |
|---|---|
| Tags | Label the rule with one or more tags for filtering and organization |
| Logging | Enable logging for traffic that matches this rule |

## Rule Ordering and Priority

Rules are evaluated in order from top to bottom. The first rule that matches determines the outcome. This means:

- **More specific rules should appear above less specific rules.** A rule allowing HTTPS from a specific IP should be placed above a rule dropping all traffic.
- **Rules added "to the top" take precedence** over rules added "to the bottom."
- You can reorder rules by deleting and re-creating them with the desired position.

### Example Rule Order

| Position | Rule | Source | Destination | Service | Action |
|---|---|---|---|---|---|
| 1 | Allow Admin SSH | `192.168.1.10` | Firewall | SSH | ACCEPT |
| 2 | Block SSH from GUEST | GUEST zone | Firewall | SSH | DROP |
| 3 | Allow LAN to WAN | LAN zone | WAN zone | Any | ACCEPT |

In this example, the administrator at `192.168.1.10` can SSH into the router (rule 1), guest users cannot (rule 2), and all LAN traffic can reach the Internet (rule 3).

## Managing Rules

### Editing a Rule

1. Navigate to **Firewall > Rules** and select the appropriate tab.
2. Click the action menu on the rule row and select **Edit**.
3. Modify the fields as needed.
4. Click **Save Rule**.

!!! warning "System Rules"
    Rules marked as system rules were created automatically by NexappOS
    services (VPN, DHCP, DNS). You can edit them, but do so with caution —
    incorrect changes may break dependent services.

### Duplicating a Rule

1. Click the action menu on a rule and select **Duplicate**.
2. A copy of the rule is created with a modified name.
3. Edit the copy as needed.

### Enabling and Disabling Rules

Toggle a rule's enabled status directly from the rules table without deleting it. Disabled rules are skipped during evaluation.

### Deleting a Rule

1. Click the action menu on a rule and select **Delete**.
2. Confirm the deletion.

### Filtering Rules

Use the filter text box and tag selector above the rules table to find specific rules quickly. You can filter by rule name, IP address, port, protocol, or tag.

## Verification

After creating or modifying rules:

1. Generate test traffic that should match the rule (for example, try to SSH from the specified source).
2. Verify the expected behavior — traffic is allowed, rejected, or dropped.
3. If logging is enabled on the rule, check **System > Logs** for matching entries.
4. Use **Firewall > Conntrack** to verify that allowed connections appear in the connection tracking table.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Rule exists but traffic is still blocked | A higher-priority rule is matching first and dropping the traffic | Move the ACCEPT rule above the DROP rule by re-creating it with **Add to the Top** |
| Rule exists but traffic is still allowed | A higher-priority ACCEPT rule matches before your DROP rule | Move the DROP rule above the ACCEPT rule |
| Rule matches wrong traffic | Source or destination zone is set to **Any** instead of a specific zone | Edit the rule and set the correct source and destination zones |
| Custom service rule does not match | Protocols field is empty or incorrect | Edit the rule, select **Custom** service, and verify the protocol and port |
| Cannot edit a system rule's name or zone | System rules have restrictions on certain fields | Create a new rule with your desired settings instead of modifying the system rule |
| Rules page shows "No rules found" | You are on the wrong tab (Forward/Input/Output) | Switch to the correct tab using the tabs at the top of the page |
