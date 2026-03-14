# Background Task Workers

## Overview

The Nexapp SDWAN Controller uses Celery, a distributed task processing system, to handle operations that cannot run during a web request — deployments, device status polling, DPI data collection, report generation, and SLA monitoring. Understanding how these workers function helps diagnose issues when deployments stall or data stops updating.

!!! note "What is Celery?"
    Celery is the background task system that powers the controller's asynchronous operations. When you click **Deploy**, the web interface submits a task to Celery, which processes it independently. This page covers the operational aspects relevant to administrators.

## Worker Queues

The controller runs five specialized worker queues. Each handles a distinct category of tasks to prevent one type of work from blocking another.

| Queue Name | Service Name | Responsibility |
|------------|-------------|----------------|
| `default` | `nexappcontroller-celery` | General-purpose tasks, user-initiated actions |
| `deploy` | `nexappcontroller-celery` | Configuration push to devices (isolated to prevent blocking) |
| `monitoring` | `nexappcontroller-celery-monitoring` | Device status polling every 30 seconds |
| `network` | `nexappcontroller-celery-network` | Topology sync, network discovery |
| `beat` | `nexappcontroller-celery-beat` | Periodic task scheduler — triggers timed tasks |

The `beat` scheduler is critical: it triggers DPI data collection, SLA metric checks, and email report delivery on schedule. If beat stops running, time-sensitive data collection stops.

## Checking Worker Status

### Via the Health API

```bash
curl -s https://203.0.113.10/api/v1/health/
```

The `celery_workers` field in the response lists each worker and its current status:

```json
{
  "status": "ok",
  "celery_workers": [
    "worker.default@controller: ok",
    "worker.deploy@controller: ok",
    "worker.monitoring@controller: ok",
    "worker.network@controller: ok",
    "worker.beat@controller: ok"
  ]
}
```

A worker showing `error` or missing from the list is not responding.

### Via the Administration Panel

Go to **Administration Panel > Celery Results > Task Results** to see recent task execution history, including task names, execution times, and error messages.

### Via systemctl on the Server

```bash
# Check all controller services at once
sudo systemctl status nexappcontroller-celery.service \
  nexappcontroller-celery-monitoring.service \
  nexappcontroller-celery-network.service \
  nexappcontroller-celery-beat.service
```

## Restarting Workers

Restart workers when they are unresponsive, consuming excessive memory, or failing tasks repeatedly.

**Restart all workers:**

```bash
sudo systemctl restart \
  nexappcontroller-celery.service \
  nexappcontroller-celery-monitoring.service \
  nexappcontroller-celery-network.service \
  nexappcontroller-celery-beat.service
```

**Restart a specific worker (e.g., deploy worker):**

```bash
sudo systemctl restart nexappcontroller-celery.service
```

After restarting, verify status with `GET /api/v1/health/`. Workers typically become healthy within 10–15 seconds of restart.

## Common Issues

| Symptom | Most Likely Cause | Fix |
|---------|------------------|-----|
| Deployments stuck in `Pending` indefinitely | Deploy worker is down | Restart `nexappcontroller-celery.service` |
| Device status not updating (stale `Online`/`Offline`) | Monitoring worker is down | Restart `nexappcontroller-celery-monitoring.service` |
| Email reports not delivered | Beat scheduler not running | Restart `nexappcontroller-celery-beat.service` |
| DPI data shows gaps in the dashboard | Beat scheduler or network worker down | Check both services; restart if stopped |
| Health endpoint shows worker `error` | Worker process crashed | Restart the specific worker service |
| Worker restarts but immediately fails | Memory exhausted or config error | Check `/var/log/nexappcontroller/celery.log` for error details |

## Log Files

Worker logs are written to `/var/log/nexappcontroller/`:

| File | Content |
|------|---------|
| `celery.log` | Default and deploy worker output |
| `celery-monitoring.log` | Status polling output |
| `celery-network.log` | Network sync output |
| `celery-beat.log` | Scheduler output (shows which tasks were triggered and when) |

To tail the deploy worker log during a deployment:

```bash
sudo tail -f /var/log/nexappcontroller/celery.log
```

## Task Queue Depth

If deployments are slow due to many queued tasks, check how many tasks are waiting:

```bash
# Check queue depth via Redis CLI (redis must be accessible)
redis-cli -h localhost LLEN celery
redis-cli -h localhost LLEN deploy
```

A large queue depth on the `deploy` queue means many deployments are waiting. The deploy worker processes tasks sequentially to avoid overwhelming devices.

## Periodic Task Schedule

The beat scheduler runs the following tasks automatically:

| Task | Frequency | Purpose |
|------|-----------|---------|
| Device status poll | Every 30 seconds | Update Online/Offline status for all devices |
| DPI data collection | Every 60 minutes | Fetch application traffic summaries from devices |
| SLA metric check | Every 5 minutes | Evaluate SLA thresholds and trigger alerts |
| Report email delivery | Per schedule | Send reports per their configured email schedule |
| Audit log cleanup | Daily | Remove access events older than the retention period |

## See Also

- [Health Monitoring](health-monitoring.md) — Full health monitoring guide
- [Administration Panel](django-admin.md) — Viewing task results in the admin panel
- [Deployment Issues](../16-troubleshooting/deployment.md) — Troubleshooting stuck deployments
- [Health API Reference](../14-api/health.md) — Programmatic worker status check
