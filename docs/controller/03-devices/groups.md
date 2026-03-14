# Device Groups

## Overview

Device groups let you apply shared configuration templates and variable defaults to sets of devices, eliminating the need to configure each device individually. A group acts as an intermediate layer between global templates and per-device overrides: group-level settings apply to all members, while individual devices can still override specific values.

## Use Cases

| Use Case | Group Name Example | Devices in Group |
|---|---|---|
| Apply the same QoS policy to all branch spokes | `all-spokes` | Every spoke device |
| Segment devices by region for regional BGP policies | `region-india` | All India-based devices |
| Apply customer-specific templates in an MSP environment | `customer-acme` | All devices belonging to Acme Corp |
| Test configuration changes on a subset before fleet rollout | `staging` | 2–3 test devices |

## Creating a Group

1. Navigate to **Configurations > Device Groups**
2. Fill in the required fields:

| Field | Description |
|---|---|
| **Name** | Human-readable group name (e.g., `Branch Spokes`) |
| **Organization** | Organization this group belongs to |
| **Description** | Optional notes about the group's purpose |

3. Click **Save**

The new group appears in the groups list at **Configurations > Device Groups**.

## Assigning Devices to a Group

You can assign devices to groups in two ways:

**From the device detail page:**

1. Navigate to **Devices > [device] > Configuration**
2. Click **Groups**
3. Select one or more groups to add this device to
4. Click **Save**

**From the group detail page:**

1. Navigate to **Devices > Device Groups > [group-name]**
2. Click **Members**
3. Click **Add Devices**
4. Search for and select devices from the registered device list
5. Click **Add**

A device can belong to multiple groups simultaneously. Configuration from all groups is merged when pushed to the device.

## Group Templates

Assign configuration templates to a group so all member devices receive those templates:

1. Navigate to **Devices > Device Groups > [group-name]**
2. Click the **Templates** tab
3. Click **Add Template**
4. Select the template and set its priority within this group
5. Click **Save**

When a configuration push is triggered for a device, the controller collects templates from:
1. All groups the device belongs to (merged by priority)
2. Templates assigned directly to the device (highest priority)
3. The merged result is the effective configuration pushed to the device

## Group Variables

Set shared variable values that apply to all devices in the group:

1. Navigate to **Devices > Device Groups > [group-name]**
2. Click the **Variables** tab
3. Add key-value pairs

Variable resolution follows this hierarchy (later entries override earlier ones):

```
Global defaults → Group variables → Device variables
```

If a device sets `bgp_as = 65001` directly, that overrides the group's `bgp_as` value for that device alone. All other devices in the group continue to use the group's value.

## Pushing Configuration to a Group

To push the current configuration to all devices in a group at once:

1. Navigate to **Devices > Device Groups > [group-name]**
2. Click **Push Configuration to Group**
3. A confirmation dialog shows the number of devices that will be affected
4. Click **Confirm**

The controller queues one deployment job per device. Progress is visible in **SD-WAN Fabric > Deploy History**, filtered by group name.

## Template Merge Example

Consider a device that belongs to two groups:

| Group | Templates Assigned | Variables |
|---|---|---|
| `all-spokes` | `base-spoke-config` (priority 10), `standard-qos` (priority 20) | `ntp_server = 198.51.100.1` |
| `region-india` | `india-bgp-policy` (priority 30) | `bgp_community = 65000:100` |
| (device-level) | `site-specific-routes` (priority 40) | `wan1_ip = 203.0.113.50` |

Effective configuration applied to this device is the merge of all four templates, with device-level settings having the highest priority.

## Removing a Device from a Group

1. Navigate to **Devices > Device Groups > [group-name] > Members**
2. Find the device in the list
3. Click the **Remove** button next to the device
4. Click **Confirm**

Removing a device from a group does not automatically push a configuration update. You must trigger a push manually if you want the group's templates to be removed from the device configuration.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Group push triggers but no devices are updated | Group has no member devices | Add devices to the group in **Groups > [group-name] > Members** |
| Device has unexpected configuration from a group | Device belongs to a group it should not | Review group membership in **Devices > [device-name] > Configuration > Groups** |
| Variable override not working | Variable set at group but device-level value is blank | Device variables take precedence — remove the blank device-level variable to let the group value apply |

!!! info "See Also"
    - [Device Configuration](configuration.md) — Per-device template assignment and variable overrides
    - [Deployment Pipeline](../05-deployment/pipeline.md) — Monitor group-wide deployment jobs
    - [Global Policies](../06-policies/overview.md) — Fleet-wide policy templates that apply to all devices
