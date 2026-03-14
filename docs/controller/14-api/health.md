# Health API Reference

## Overview

The Health API provides a single endpoint that reports the overall operational status of the Nexapp SDWAN Controller. It is designed for integration with external monitoring systems (Nagios, Prometheus, Grafana, Zabbix, uptime monitors) and load balancer health checks.

The health endpoint does not require authentication, making it safe to poll from monitoring infrastructure without embedding credentials.

## Endpoint

```
GET /api/v1/health/
```

**Authentication:** None required (public endpoint).

**Example:**

```bash
curl -s https://203.0.113.10/api/v1/health/
```

## Response Format

```json
{
  "status": "ok",
  "database": "ok",
  "redis": "ok",
  "celery_workers": [
    "worker.default@controller: ok",
    "worker.deploy@controller: ok",
    "worker.monitoring@controller: ok",
    "worker.network@controller: ok",
    "worker.beat@controller: ok"
  ],
  "topology_count": 3,
  "device_count": 12,
  "online_devices": 11
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall system status: `ok`, `degraded`, or `down` |
| `database` | string | PostgreSQL connection status: `ok` or `error` |
| `redis` | string | Redis connection status: `ok` or `error` |
| `celery_workers` | array | List of worker names and their individual status |
| `topology_count` | integer | Number of active SD-WAN topologies |
| `device_count` | integer | Total registered devices |
| `online_devices` | integer | Devices with status `Online` at last poll |

## HTTP Status Codes

| HTTP Status | `status` Field Value | Meaning |
|-------------|---------------------|---------|
| `200 OK` | `ok` | All components healthy |
| `200 OK` | `degraded` | Some components degraded but controller is functional |
| `503 Service Unavailable` | `down` | Critical component failure; controller may not be fully functional |

!!! tip "Use HTTP Status for Alerting"
    For automated monitoring, check the HTTP status code rather than parsing the JSON body. `200` = healthy, `503` = alert. This simplifies integration with health check systems that only inspect HTTP codes.

## Degraded vs Down

- **`degraded`**: The controller is operational, but one or more non-critical components have issues (e.g., one worker is not responding but others are healthy). Deployments and polling may be partially affected.
- **`down`**: A critical component (database or all workers) has failed. The controller cannot process requests reliably.

## Using with Monitoring Systems

### Prometheus / Alertmanager

Add the health endpoint as a blackbox probe target in your Prometheus configuration:

```yaml
scrape_configs:
  - job_name: 'nexapp_controller_health'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - https://203.0.113.10/api/v1/health/
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - target_label: __address__
        replacement: localhost:9115  # blackbox exporter address
```

### Nagios / Icinga

```bash
# Nagios check command
define command {
  command_name  check_nexapp_health
  command_line  /usr/lib/nagios/plugins/check_http \
                -H $ARG1$ -u /api/v1/health/ \
                --ssl -e "200 OK"
}
```

### Simple Uptime Monitor (curl)

```bash
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://203.0.113.10/api/v1/health/)
if [ "$STATUS" != "200" ]; then
  echo "ALERT: Controller health check failed (HTTP $STATUS)"
  exit 1
fi
echo "OK: Controller is healthy"
```

### Load Balancer Health Check

Configure your load balancer to poll `GET /api/v1/health/` every 10 seconds:

- **Expected HTTP status:** `200`
- **Remove from rotation if:** HTTP `503` or connection refused
- **Re-add after:** 3 consecutive `200` responses

## Interpreting Worker Status

The `celery_workers` array lists each worker queue and its status. The five standard worker queues are:

| Worker Queue | Role |
|-------------|------|
| `worker.default` | General-purpose background tasks |
| `worker.deploy` | Configuration push to devices |
| `worker.monitoring` | Device status polling (every 30 seconds) |
| `worker.network` | Network topology sync |
| `worker.beat` | Periodic task scheduler (reports, DPI collection) |

If a worker shows `error` or is absent from the list, tasks for that queue will queue up but not execute. See [Background Task Workers](../15-admin/celery.md) for recovery steps.

## See Also

- [API Authentication](authentication.md) — Authentication for other API endpoints
- [Background Task Workers](../15-admin/celery.md) — Worker management and troubleshooting
- [Health Monitoring](../15-admin/health-monitoring.md) — Full health monitoring guide
- [Common Issues](../16-troubleshooting/common-issues.md) — Troubleshooting worker failures
