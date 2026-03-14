# Configuration Templates

## Overview

Configuration templates are reusable device configuration blocks that can be pushed to multiple devices at once. Templates define network settings, VPN configurations, QoS rules, or any device parameters using OpenWrt UCI syntax or JSON.

Navigate to **Configurations > Templates** in the controller sidebar.

---

## Template Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Generic** | Raw UCI/JSON configuration block | Custom settings not covered by wizards |
| **VPN** | VPN client configuration (linked to a VPN Server) | OpenVPN, WireGuard site-to-site |
| **OpenWrt** | Full OpenWrt UCI configuration | Advanced system settings |

---

## Creating a Template

1. Navigate to **Configurations > Templates**
2. Click **Add Template**
3. Fill in the required fields:

| Field | Description |
|-------|-------------|
| **Name** | Descriptive label (e.g., `DNS-Override`, `NTP-Servers`) |
| **Organization** | Scope: which org can use this template |
| **Type** | Generic, VPN, or OpenWrt |
| **Backend** | Device backend (`openwrt` for NexappOS routers) |
| **Config** | Configuration content (UCI JSON format) |
| **Tags** | Optional labels for filtering |

4. Click **Save**

---

## Assigning Templates to Devices

Templates are assigned at two levels:

**Device Group level** (recommended for bulk)
Navigate to **Configurations > Device Groups** → select group → add templates.

**Individual device level**
Navigate to **Devices** → select device → **Configuration tab** → add templates.

When a device has multiple templates, configurations are **merged** in priority order. Device-level config overrides group-level templates.

---

## Template Variables

Use variables in templates to customize values per device without creating separate templates:

```json
{
  "interfaces": {
    "loopback": {
      "addresses": [{"address": "{{ management_ip }}", "mask": "32"}]
    }
  }
}
```

Variables are defined per-device under **Configuration > Advanced > Variables**.

---

## Pushing Templates

After creating or modifying a template, changes do **not** automatically apply. You must push configuration:

- **Single device**: **Devices > [device] > Configuration tab > Apply**
- **All devices with this template**: **Configurations > Templates > [template] > Push to devices**

---

## See Also

- [VPN Servers](vpn-servers.md)
- [Device Groups](device-groups.md)
- [Device Configuration](../03-devices/configuration.md)
