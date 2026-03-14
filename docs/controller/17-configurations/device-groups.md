# Device Groups

## Overview

Device Groups let you assign shared configuration templates to a set of devices. Any template attached to a group is automatically applied to all devices in that group, eliminating per-device configuration for common settings.

Navigate to **Configurations > Device Groups** in the controller sidebar.

---

## Use Cases

- Apply the same NTP/DNS settings to all branch routers
- Push a common QoS template to all customer-edge devices
- Separate groups for region (APAC, EMEA), role (hub, spoke), or customer

---

## Creating a Device Group

1. Navigate to **Configurations > Device Groups**
2. Click **Add Device Group**
3. Fill in the fields:

| Field | Description |
|-------|-------------|
| **Name** | Group identifier (e.g., `Branch-Spokes-India`) |
| **Organization** | Owner org |
| **Templates** | One or more configuration templates to apply |
| **Context** | Key-value variables for template rendering in this group |

4. Click **Save**

---

## Assigning Devices to a Group

Devices are assigned to groups from the device detail page:

1. Navigate to **Devices** → select device
2. **Configuration tab**
3. Under **Groups**, select the group name and click **Save**

Alternatively, assign in bulk: **Configurations > Device Groups > [group] > Devices tab** — use the inline admin to add multiple devices.

---

## Template Merge Order

When a device belongs to multiple groups and also has device-level templates, configuration is merged in this priority order (highest wins):

1. Device-level configuration (highest priority)
2. Group templates (merged in display order)
3. Default controller configuration (lowest priority)

---

## Group-Level Variables

Define variables in the group's **Context** field to override template variables for all devices in the group:

```json
{
  "ntp_server": "192.0.2.10",
  "dns_primary": "192.0.2.53"
}
```

Individual devices can still override group variables.

---

## See Also

- [Configuration Templates](templates.md)
- [Device Configuration](../03-devices/configuration.md)
- [Device Groups (Devices section)](../03-devices/groups.md)
