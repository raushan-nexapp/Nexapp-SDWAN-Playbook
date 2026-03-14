# Health Monitoring

## Overview

The Nexapp SDWAN Controller provides multiple layers of health monitoring: a JSON health API for automated monitoring systems, system service status checks, log file analysis, and resource usage monitoring. This page covers the complete health monitoring approach for production deployments.

## Health API

The primary health check endpoint provides a real-time snapshot of all critical controller components:

```
GET /api/v1/health/
```

No authentication is required. The endpoint returns `200 OK` when all components are healthy and `503 Service Unavailable` when a critical component has failed.

**Quick check:**

```bash
curl -s https://203.0.113.10/api/v1/health/ | python3 -m json.tool
```

**Example healthy response:**

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

See [Health API Reference](../14-api/health.md) for full field descriptions and integration examples.

## Component Health Checks

### Database (PostgreSQL)

| Check | Healthy | Degraded |
|-------|---------|---------|
| `database` field | `ok` | `error` |
| Symptom when down | Controller cannot load any data; login fails | — |
| Recovery | Restart PostgreSQL: `sudo systemctl restart postgresql` | — |

### Cache (Redis)

| Check | Healthy | Degraded |
|-------|---------|---------|
| `redis` field | `ok` | `error` |
| Symptom when down | Session logins may fail; task queuing disrupted | — |
| Recovery | Restart Redis: `sudo systemctl restart redis` | — |

### Background Task Workers

| Check | Healthy | Degraded |
|-------|---------|---------|
| All five workers listed | All show `ok` | One or more show `error` or are absent |
| Symptom when down | Deployments queue but don't execute; status polling stops | — |
| Recovery | Restart affected service (see [Background Task Workers](celery.md)) | — |

## Service Status Checks

Verify all controller services are running on the server:

```bash
sudo systemctl status \
  nexappcontroller.service \
  nexappcontroller-celery.service \
  nexappcontroller-celery-monitoring.service \
  nexappcontroller-celery-network.service \
  nexappcontroller-celery-beat.service
```

All five services should show `active (running)`. A `failed` or `inactive` service requires attention.

**Restart all controller services:**

```bash
sudo systemctl restart \
  nexappcontroller.service \
  nexappcontroller-celery.service \
  nexappcontroller-celery-monitoring.service \
  nexappcontroller-celery-network.service \
  nexappcontroller-celery-beat.service
```

## Log Files

| Log File | Content |
|----------|---------|
| `/var/log/nexappcontroller/app.log` | Application errors and warnings |
| `/var/log/nexappcontroller/celery.log` | Background task execution log |
| `/var/log/nexappcontroller/celery-monitoring.log` | Device polling log |
| `/var/log/nexappcontroller/celery-beat.log` | Periodic task scheduler log |
| `/var/log/nginx/access.log` | HTTP request log |
| `/var/log/nginx/error.log` | Nginx error log |

**Monitor application errors in real time:**

```bash
sudo tail -f /var/log/nexappcontroller/app.log
```

**Check for recent errors:**

```bash
sudo grep -i "error\|critical\|exception" /var/log/nexappcontroller/app.log | tail -50
```

## Disk Usage Monitoring

The controller accumulates data over time. Monitor disk usage regularly:

```bash
# Overall disk usage
df -h /opt/nexappcontroller/

# Controller data directories
sudo du -sh /opt/nexappcontroller/src/media/    # Uploaded files and report PDFs
sudo du -sh /opt/nexappcontroller/logs/         # Application log files
sudo du -sh /var/lib/postgresql/                # PostgreSQL data files
```

DPI snapshots and application traffic records are the largest data consumers. Configure data retention settings to limit growth:

- **DPI Snapshots:** default 90-day retention
- **Access Logs:** default 30-day retention
- **Deployment Records:** kept indefinitely (can be cleaned manually)

## External Monitoring Integration

### Poll Interval Recommendation

| Check Type | Recommended Interval |
|-----------|---------------------|
| Health API (`/api/v1/health/`) | Every 60 seconds |
| Service status (`systemctl`) | Every 5 minutes |
| Disk usage | Every 15 minutes |
| Log error rate | Every 5 minutes |

### Prometheus Integration

If the Prometheus metrics exporter is installed, metrics are available at:

```
GET /metrics/
```

Metrics include request counts, response times, database query durations, and queue depths. Configure Prometheus to scrape this endpoint every 30 seconds.

### Alerting Thresholds

Recommended alert conditions:

| Metric | Warning | Critical |
|--------|---------|---------|
| Health API status | `degraded` | `down` |
| Disk usage | >70% | >85% |
| Any worker error | — | Immediately |
| Database connection failure | — | Immediately |
| Online devices drop >20% | Investigate | — |

## See Also

- [Health API Reference](../14-api/health.md) — Full API specification
- [Background Task Workers](celery.md) — Worker management
- [Administration Panel](django-admin.md) — Admin panel access
- [Common Issues](../16-troubleshooting/common-issues.md) — Troubleshooting guide
