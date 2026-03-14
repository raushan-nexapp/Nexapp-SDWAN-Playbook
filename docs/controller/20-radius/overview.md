# RADIUS

## Overview

The RADIUS section allows you to configure RADIUS servers for 802.1X network access control, captive portal authentication, and accounting. Managed devices can use the RADIUS server configured here for Wi-Fi authentication, PPPoE, or hotspot access.

Navigate to **RADIUS** in the controller sidebar.

---

## RADIUS Objects

| Object | Description |
|--------|-------------|
| **RADIUS Group** | Named group containing one or more RADIUS servers |
| **RADIUS Server** | Individual RADIUS endpoint (IP, port, secret) |
| **NAS** | Network Access Server — the device acting as RADIUS client |

---

## Creating a RADIUS Group

A RADIUS Group bundles primary and optional failover RADIUS servers:

1. Navigate to **RADIUS > RADIUS Groups**
2. Click **Add RADIUS Group**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Name** | Identifier (e.g., `Corporate-RADIUS`) |
| **Organization** | Owner org |
| **Description** | Optional notes |

4. After creating the group, add RADIUS servers to it (see below)

---

## Adding a RADIUS Server to a Group

1. Open the RADIUS Group
2. In the **RADIUS Servers** inline, click **Add another RADIUS Server**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Host** | RADIUS server IP (e.g., `192.0.2.100`) |
| **Port** | Authentication port (default: `1812`) |
| **Accounting Port** | Accounting port (default: `1813`) |
| **Secret** | Shared secret |
| **Timeout** | Request timeout in seconds |
| **Accounting** | Enable RADIUS accounting |
| **Called Station Format** | Format for Called-Station-Id attribute |

---

## Using RADIUS in Device Configuration

Reference the RADIUS Group in a configuration template:

```json
{
  "interfaces": {
    "wlan0": {
      "wifi": {
        "encryption": {
          "proto": "wpa2-enterprise",
          "server": "192.0.2.100",
          "port": 1812,
          "secret": "{{ radius_secret }}"
        }
      }
    }
  }
}
```

Use a template variable for the secret to avoid storing it in plaintext.

---

## RADIUS Accounting

When accounting is enabled, managed devices send `Start`, `Stop`, and `Interim-Update` packets to the RADIUS server. This enables:

- Session tracking per user
- Bandwidth accounting per user/session
- Hotspot billing integration

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| 802.1X fails to authenticate | Wrong secret | Verify secret on both NAS and RADIUS server |
| Timeout errors | Network unreachable | Confirm device can reach RADIUS IP on port 1812 |
| No accounting records | Accounting port blocked | Check firewall allows UDP 1813 |

---

## See Also

- [Configuration Templates](../17-configurations/templates.md)
- [Users & Organizations](../13-multi-tenancy/users.md)
