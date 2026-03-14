# NsBond API Reference

## Overview

The NsBond API provides programmatic access to all SD-WAN management operations. It exposes 20 viewsets at `/api/v1/nsbond/`, covering topology lifecycle, device management, WAN members, SLA path monitors, quality tiers, traffic steering, BGP, OSPF, QoS policies, and deployment records.

All endpoints require token authentication. See [API Authentication](authentication.md) for details.

## Base URL

```
https://<controller>/api/v1/nsbond/
```

## Standard CRUD Operations

Every viewset supports the standard HTTP methods:

| Method | URL Pattern | Action |
|--------|-------------|--------|
| `GET` | `/<resource>/` | List all records (paginated) |
| `POST` | `/<resource>/` | Create a new record |
| `GET` | `/<resource>/<id>/` | Retrieve a single record |
| `PATCH` | `/<resource>/<id>/` | Update specific fields |
| `PUT` | `/<resource>/<id>/` | Replace the entire record |
| `DELETE` | `/<resource>/<id>/` | Delete a record |

## Viewset Reference

| Endpoint | Description | Key Fields |
|----------|-------------|------------|
| `topology/` | SD-WAN topologies | `name`, `type` (hub-spoke/mesh), `hub_device`, `organization` |
| `device/` | Router devices | `name`, `organization`, `status`, `ip_address` |
| `wan-member/` | WAN interfaces on devices | `device`, `interface`, `port`, `weight`, `enabled` |
| `path-monitor/` | SLA path monitors | `device`, `target`, `protocol`, `interval`, `thresholds` |
| `quality-tier/` | QoS quality tiers | `name`, `max_latency`, `max_jitter`, `max_loss` |
| `steering-policy/` | Traffic steering rules | `topology`, `match`, `action`, `quality_tier`, `priority` |
| `bgp-config/` | BGP policy templates | `as_number`, `router_id`, `neighbors`, `is_global` |
| `bgp-neighbor/` | BGP neighbor definitions | `ip`, `remote_as`, `password`, `keepalive`, `holdtime` |
| `bgp-network/` | BGP network advertisements | `prefix`, `mask`, `bgp_config` |
| `bgp-prefix-list/` | BGP prefix filters | `name`, `entries`, `direction` |
| `bgp-route-map/` | BGP route maps | `name`, `match_conditions`, `set_actions` |
| `ospf-config/` | OSPF policy templates | `process_id`, `router_id`, `area`, `is_global` |
| `ospf-network/` | OSPF network definitions | `prefix`, `area`, `ospf_config` |
| `ospf-interface/` | OSPF interface settings | `interface`, `cost`, `hello_interval`, `dead_interval` |
| `qos-config/` | QoS policy templates | `name`, `interfaces`, `is_global` |
| `qos-interface/` | QoS interface bindings | `interface`, `download_bw`, `upload_bw`, `qos_config` |
| `qos-rule/` | QoS traffic classification rules | `match_app`, `match_port`, `class`, `bandwidth_limit` |
| `deployment/` | Deployment records | `topology`, `status`, `started_at`, `completed_at`, `error` |
| `health/` | System health summary | Read-only (see [Health API](health.md)) |

## Examples

### List All Topologies

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/nsbond/topology/
```

**Response:**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Main Office Hub-Spoke",
      "type": "hub-spoke",
      "hub_device": 5,
      "organization": "acme-corporation",
      "status": "deployed"
    }
  ]
}
```

### Create a Topology

```bash
curl -s -X POST \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Branch Network", "type": "hub-spoke", "organization": "acme-corporation"}' \
  https://203.0.113.10/api/v1/nsbond/topology/
```

### Add a WAN Member to a Device

```bash
curl -s -X POST \
  -H "Authorization: Token <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "device": 5,
    "interface": "WAN1",
    "port": 5511,
    "weight": 10,
    "enabled": true
  }' \
  https://203.0.113.10/api/v1/nsbond/wan-member/
```

### Get Deployment Status

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/nsbond/deployment/?topology=1
```

## Custom Actions

In addition to standard CRUD, several viewsets expose custom actions via POST:

| Action | Endpoint | Description |
|--------|----------|-------------|
| `compute` | `POST /topology/<id>/compute/` | Recalculate topology overlays and routing |
| `deploy` | `POST /topology/<id>/deploy/` | Push configuration to all devices in the topology |
| `validate` | `POST /topology/<id>/validate/` | Validate configuration before deployment |
| `sync_sla` | `POST /topology/<id>/sync_sla/` | Sync SLA thresholds from quality tiers to devices |
| `sync_dpi` | `POST /topology/<id>/sync_dpi/` | Sync DPI application groups to devices |
| `wizard_create` | `POST /topology/wizard_create/` | Create a topology via the wizard in one API call |

### Trigger a Deployment

```bash
curl -s -X POST \
  -H "Authorization: Token <your-token>" \
  https://203.0.113.10/api/v1/nsbond/topology/1/deploy/
```

**Response:**

```json
{
  "status": "accepted",
  "deployment_id": 42,
  "message": "Deployment queued. Track progress at /api/v1/nsbond/deployment/42/"
}
```

The deploy action is subject to a rate limit of 10 requests per hour per token.

## Filtering

List endpoints support query parameter filtering:

```bash
# Filter devices by organization
GET /api/v1/nsbond/device/?organization=acme-corporation

# Filter deployments by topology and status
GET /api/v1/nsbond/deployment/?topology=1&status=failed

# Filter steering policies by topology
GET /api/v1/nsbond/steering-policy/?topology=1
```

## Pagination

Default page size is 20. Maximum is 100. Use `?page_size=<n>` and `?page=<n>` to paginate.

## See Also

- [API Authentication](authentication.md) — Token setup and rate limits
- [DPI API Reference](dpi.md) — DPI analytics endpoints
- [HA API Reference](ha.md) — High availability endpoints
- [API Troubleshooting](../16-troubleshooting/api.md) — Common API errors
