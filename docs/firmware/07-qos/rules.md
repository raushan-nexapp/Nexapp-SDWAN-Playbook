# QoS Rules

!!! note "Standalone & Controller-Managed"
    QoS rules can be configured locally on the router or pushed from the controller.
    When controller-managed, local changes may be overwritten by the next deployment.

## Overview

QoS rules classify network traffic and assign it to one of the four priority classes (Voice, Video, Best Effort, or Bulk). Without rules, all traffic is treated as Best Effort. By creating rules, you ensure that latency-sensitive applications receive priority treatment while bulk transfers are deprioritized.

Navigate to **Policy Engine > QoS > Rules** to access this feature.

## Prerequisites

- The QoS service is enabled (see [QoS Overview](overview.md)).
- At least one interface has bandwidth limits configured (see [Interface QoS](interface-qos.md)).
- If you plan to use application-based matching, DPI must be enabled on the router.

## Configuration

### Creating a Rule

1. Navigate to **Policy Engine > QoS > Rules**.
2. Click **Add Rule**.
3. Fill in the rule form:

| Field | Description | Required |
|-------|-------------|----------|
| **Match Type** | How to identify the traffic. Options described below. | Yes |
| **Match Value** | The specific value to match against (depends on match type). | Yes |
| **Priority Class** | The priority queue to assign matched traffic to: **Voice**, **Video**, **Best Effort**, or **Bulk**. | Yes |

### Match Types

| Match Type | Description | Example Value |
|-----------|-------------|---------------|
| **Application** | Match by DPI-classified application name. Requires DPI to be enabled. | `Zoom`, `Netflix` |
| **DNS Pattern** | Match by domain name pattern. Supports wildcards. | `*.zoom.us` |
| **TCP Port** | Match by TCP destination port number. | `443` |
| **UDP Port** | Match by UDP destination port number. | `5060` |
| **IPv4 Address** | Match by source or destination IPv4 address or CIDR range. | `192.168.1.100` or `10.0.0.0/24` |
| **IPv6 Address** | Match by source or destination IPv6 address or CIDR range. | `fd00::1/64` |

4. Click **Add Rule**.

!!! example
    To prioritize all Zoom traffic as Voice:

    - **Match Type**: Application
    - **Match Value**: Zoom
    - **Priority Class**: Voice

### Rule Sources

Each rule in the table shows a **Source** column:

- **User** -- Rules you created manually. These can be deleted.
- **System** -- Built-in rules provided by the QoS engine. These cannot be deleted.

### Deleting a Rule

1. Locate the user-created rule in the table.
2. Click the **Delete** (trash) icon.
3. Confirm the deletion in the modal dialog.

!!! note
    System rules cannot be deleted. Only user-created rules show the delete icon.

## How Classification Works

When a packet arrives, the QoS engine evaluates rules in order:

1. **Application rules** are matched first using the DPI engine.
2. **DNS, port, and IP rules** are matched next.
3. If no rule matches, the packet is assigned to the **Best Effort** class.

The assigned priority class determines the DSCP marking applied to the packet, which controls how the QoS scheduler queues and forwards it.

## Verification

1. Navigate to **Policy Engine > QoS > Rules**.
2. Confirm your rules appear in the table with the correct match type, value, and priority class.
3. Navigate to **Policy Engine > QoS > Overview** and verify that traffic appears under the expected priority class in the live statistics.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Rule does not match any traffic | The match type or value is incorrect | Verify the match value exactly matches the application name, port, or IP address |
| Wrong priority class is applied | A higher-priority rule is matching first | Check the rule order and ensure more specific rules are listed before general ones |
| Application-based rule has no effect | DPI is not enabled on the router | Enable DPI under **Security > DPI** before using application-based QoS rules |
| "QoS not running" warning appears | The QoS service is disabled | Enable the QoS service on the main QoS page |

!!! info "See Also"
    - [QoS Overview](overview.md) -- Enable the QoS service and view priority classes
    - [Interface QoS](interface-qos.md) -- Set per-interface bandwidth limits
    - [DPI](../11-security/dpi.md) -- Enable Deep Packet Inspection for application classification
