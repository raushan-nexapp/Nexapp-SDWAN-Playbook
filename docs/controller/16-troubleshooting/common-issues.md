# Common Issues

## Overview

This page provides quick-reference troubleshooting for the most common problems encountered when using the Nexapp SDWAN Controller. Issues are grouped by category. For deployment-specific problems, see [Deployment Issues](deployment.md). For API error codes, see [API Troubleshooting](api.md).

## Login and Access

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| Cannot log in — credentials rejected | Wrong username or password | Click **Forgot Password** to reset via email. If email is unavailable, an admin can reset via **Administration Panel > Users**. |
| Cannot log in — account disabled | The account's **Is Active** flag was turned off | Contact a superuser or organization admin to reactivate the account at **Users & Organizations > User Management**. |
| Login succeeds but dashboard is empty | User not assigned to any organization | Go to **Users & Organizations > User Management**, open the user profile, and assign one or more organizations. |
| API returns `401 Unauthorized` | Token is missing, invalid, or expired | Regenerate the token at profile → **API Token**. Update all scripts using the old token. |
| API returns `403 Forbidden` | User lacks permission for the requested resource | Verify the user's role and organization membership. Operators cannot modify data. |
| Two-factor authentication prompt unexpected | 2FA was enabled by an admin for security policy | Use your TOTP app (Google Authenticator, Authy) to get the 6-digit code. If app is lost, contact a superuser to disable 2FA on your account. |

## Devices

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| Device shows **Offline** | ZeroTier management plane is not connected | SSH to the device and check the ZeroTier service status. Verify the device has internet access and can reach the ZeroTier network. |
| Device registered but configuration not present | Configuration was not pushed yet | Click **Deploy** on the topology that includes the device. |
| Device shows **Unknown** status indefinitely | Status polling worker is not running | Check `GET /api/v1/health/` — verify `worker.monitoring` is showing `ok`. Restart the monitoring worker if not. |
| Device registered to wrong organization | Organization was set incorrectly during registration | Go to **Devices**, open the device, and change the **Organization** field. |
| Device not visible to a user | User is in a Device Access Zone that does not include this device | Add the device to the user's zone at **Users & Organizations > Device Access Zones**. |
| Device shows correct status but topology shows stale data | Topology cache not refreshed | Go to **SD-WAN Topology**, open the topology, and click **Refresh Status**. |

## Deployment

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| Deploy button grayed out | No hub device assigned to topology, or topology has no devices | Open the topology settings and assign a hub device. Verify at least one spoke is assigned. |
| Deploy stays in **Pending** indefinitely | Deploy worker is down | Check `GET /api/v1/health/`. If `worker.deploy` shows `error`, restart the worker service on the server. |
| Deploy fails with "validation error" | Missing required field or conflicting configuration | Click on the failed deployment in **Deployment History** to see the detailed error message. Fix the identified issue and retry. |
| Deployment partially succeeded (some devices OK, some failed) | Intermittent connectivity to specific devices | Open the deployment detail to see which devices failed. Retry failed devices individually. |
| Deploy succeeded but device running old configuration | Rollback was triggered automatically | Check the deployment history for a rollback event. Review the rollback reason in the deployment detail. |

For detailed deployment troubleshooting, see [Deployment Issues](deployment.md).

## Background Workers

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| Email reports not being sent | Beat scheduler is not running | Run `sudo systemctl restart nexappcontroller-celery-beat.service` on the server. |
| DPI data not updating | Beat scheduler or network worker is down | Check `GET /api/v1/health/` for worker status. Restart the affected worker. |
| SLA alerts not triggering | Beat scheduler is not running SLA checks | Restart the beat scheduler. If persistent, check `/var/log/nexappcontroller/celery-beat.log` for errors. |
| All background tasks stopped | Redis is down | Check Redis: `sudo systemctl status redis`. Restart if stopped: `sudo systemctl restart redis`. |

## Data and Analytics

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| DPI dashboard shows no data | DPI data collection has not run yet (new device) or beat worker is down | Wait 60 minutes for the first data collection cycle, or check the beat scheduler health. |
| Reports show incorrect date ranges | Report template timezone mismatch | Verify the organization timezone setting at **Users & Organizations > Organizations**. |
| Data Usage dashboard shows zero bytes | DPI is not enabled on the device, or device firmware does not support DPI | Enable DPI on the device and verify the firmware version supports application-level analytics. |

## Performance

| Symptom | Likely Cause | Resolution |
|---------|-------------|-----------|
| Web interface is slow | Server under high load (many deployments or polling cycles) | Check server CPU and memory. Consider scheduling bulk deployments during off-peak hours. |
| API responses are slow | Too many results per page or missing date filters | Add `?page_size=20` to limit results. Add `?start_date=` and `?end_date=` to filter time ranges. |
| API returns `429 Too Many Requests` | Rate limit exceeded (60/min burst, 1000/hr sustained) | Add delays between requests. Use exponential backoff. Cache responses where possible. |

## Getting Support

If an issue cannot be resolved with the guidance above:

1. Check `GET /api/v1/health/` and record the full JSON response.
2. Capture the relevant section from `/var/log/nexappcontroller/app.log`.
3. Note the exact steps that reproduce the issue.
4. Contact support with this information.

## See Also

- [Deployment Issues](deployment.md) — Detailed deployment troubleshooting
- [API Troubleshooting](api.md) — API error codes and solutions
- [Background Task Workers](../15-admin/celery.md) — Worker management and restart
- [Health Monitoring](../15-admin/health-monitoring.md) — Full health monitoring guide
