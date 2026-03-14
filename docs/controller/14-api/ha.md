# HA API Reference

## Overview

The High Availability (HA) API allows programmatic management of HA device pairs and interface mappings. It provides endpoints to create, query, update, and remove HA configurations — complementing the web-based HA wizard covered in [High Availability Overview](../12-ha/overview.md).

All endpoints require token authentication. See [API Authentication](authentication.md) for details.

## Base URL

```
https://<controller>/api/v1/ha/
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ha/device/` | List all HA device pairs |
| `POST` | `/ha/device/` | Create a new HA pair |
| `GET` | `/ha/device/<id>/` | Retrieve a single HA pair |
| `PATCH` | `/ha/device/<id>/` | Update HA pair settings |
| `DELETE` | `/ha/device/<id>/` | Remove an HA pair record |
| `GET` | `/ha/interface/` | List HA interface mappings |
| `POST` | `/ha/interface/` | Add an interface mapping to an HA pair |
| `GET` | `/ha/interface/<id>/` | Retrieve a single interface mapping |
| `PATCH` | `/ha/interface/<id>/` | Update interface mapping |
| `DELETE` | `/ha/interface/<id>/` | Remove an interface mapping |

## HA Device Pair Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `primary_device` | integer | Device ID of the primary router |
| `backup_device` | integer | Device ID of the backup router |
| `virtual_ip` | string | Virtual IP address for failover (VRRP VIP) |
| `virtual_ip_prefix` | integer | CIDR prefix length for the VIP |
| `priority_primary` | integer | VRRP priority for primary (default: 200) |
| `priority_backup` | integer | VRRP priority for backup (default: 100) |
| `preempt` | boolean | Whether primary reclaims active role on recovery |
| `status` | string | Current HA state (see Status Values below) |
| `organization` | string | Organization slug |

## HA Status Values

| Status | Meaning |
|--------|---------|
| `primary_active` | Primary router is active, backup is in standby |
| `backup_active` | Failover has occurred; backup router is now active |
| `split_brain` | Both routers believe they are active — requires immediate attention |
| `offline` | Neither router is reachable |
| `unknown` | Status not yet determined (initial state or polling failure) |

## Examples

### List All HA Pairs

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/ha/device/
```

**Response:**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "primary_device": 5,
      "backup_device": 6,
      "virtual_ip": "192.0.2.1",
      "virtual_ip_prefix": 24,
      "priority_primary": 200,
      "priority_backup": 100,
      "preempt": true,
      "status": "primary_active",
      "organization": "acme-corporation"
    }
  ]
}
```

### Create a New HA Pair

```bash
curl -s -X POST \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_device": 5,
    "backup_device": 6,
    "virtual_ip": "192.0.2.1",
    "virtual_ip_prefix": 24,
    "priority_primary": 200,
    "priority_backup": 100,
    "preempt": true
  }' \
  https://203.0.113.10/api/v1/ha/device/
```

### Get HA Status for a Specific Pair

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/ha/device/1/
```

### Update Preempt Setting

```bash
curl -s -X PATCH \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"preempt": false}' \
  https://203.0.113.10/api/v1/ha/device/1/
```

### Delete an HA Pair

```bash
curl -s -X DELETE \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/ha/device/1/
```

!!! warning "DELETE Does Not Disable HA on Routers"
    Deleting an HA pair from the controller removes the record from the controller database. It does not automatically disable VRRP on the physical routers. Disable HA on the routers first via the router's web interface before deleting the pair from the controller.

## HA Interface Mappings

Interface mappings define which router interfaces are part of the HA configuration.

### HA Interface Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `ha_device` | integer | HA pair ID |
| `primary_interface` | string | Interface name on primary router |
| `backup_interface` | string | Interface name on backup router |
| `virtual_ip` | string | Virtual IP on this interface (if different from pair VIP) |

### Add an Interface Mapping

```bash
curl -s -X POST \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ha_device": 1,
    "primary_interface": "eth0",
    "backup_interface": "eth0",
    "virtual_ip": "198.51.100.1"
  }' \
  https://203.0.113.10/api/v1/ha/interface/
```

## Monitoring HA Status with the API

A common automation pattern is to poll the HA API periodically to detect failover events:

```bash
# Check if any HA pair is in split-brain state
curl -s \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/ha/device/ | \
  python3 -c "import sys,json; pairs=json.load(sys.stdin)['results']; \
  [print(f'ALERT: split_brain on HA pair {p[\"id\"]}') \
   for p in pairs if p['status']=='split_brain']"
```

## See Also

- [API Authentication](authentication.md) — Token setup and rate limits
- [High Availability Overview](../12-ha/overview.md) — HA architecture and web-based setup
- [Health API Reference](health.md) — System health endpoint
- [API Troubleshooting](../16-troubleshooting/api.md) — Common API errors
