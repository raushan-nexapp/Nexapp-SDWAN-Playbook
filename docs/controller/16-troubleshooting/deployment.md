# Deployment Issues

## Overview

This page covers detailed troubleshooting for the configuration deployment pipeline. A deployment pushes the controller's SD-WAN topology configuration to all devices in the topology. Deployment failures are usually caused by one of three root causes: a device is offline (not reachable), a configuration validation error, or a background worker is not running.

## Pre-Deploy Checklist

Before triggering a deployment, verify these preconditions:

- [ ] At least one hub device is assigned to the topology
- [ ] All target devices show **Online** status (green dot in device list)
- [ ] The topology passes validation — click **Validate** before deploying
- [ ] The deploy background worker is healthy (`GET /api/v1/health/` → `worker.deploy: ok`)
- [ ] No previous deployment is currently `in_progress` for this topology

## Issue Reference Table

| Symptom | Root Cause | Resolution |
|---------|-----------|-----------|
| **Deploy button is grayed out** | No hub device assigned to topology | Go to topology settings → assign a hub device |
| **Deploy button is grayed out** | Topology has no devices | Add at least one hub and one spoke to the topology |
| **Deploy stays in `Pending` indefinitely** | Deploy worker is not running | Restart `nexappcontroller-celery.service` on server |
| **"Device unreachable" error** | ZeroTier management IP not responding | Check ZeroTier status on the device (see below) |
| **"Config validation failed"** | Missing required field or conflicting settings | Review error details in Deployment History |
| **Partial deploy (some OK, some failed)** | Intermittent connectivity to specific devices | Retry failed devices; check their ZeroTier connectivity |
| **Deploy takes more than 5 minutes** | Many devices or slow device responses | Monitor progress; consider scaling deploy workers |
| **Deployed but tunnel not up** | SD-WAN overlay service not started on device | Check overlay status on device web interface |
| **Rollback was triggered** | Configuration caused a connectivity failure | Review rollback reason; fix config and redeploy |
| **Rollback failed** | Previous configuration also has a validation error | Manually fix the configuration via device web interface, then redeploy |
| **"Permission denied" on deploy** | User is an Operator (read-only role) | Deploying requires Staff or Superuser role |
| **Deploy rate limit exceeded** | More than 10 deploy requests per hour | Wait for rate limit to reset (1 hour); batch deployments |

## Checking Device Reachability

The most common deployment failure cause is a device being unreachable via the management plane. To diagnose:

### Step 1: Check Device Status in Controller

1. Go to **Devices**.
2. Find the device that failed deployment.
3. Check the **Status** column — it should show **Online** (green dot).

If status is **Offline** or **Unknown**, the device cannot be reached for deployment.

### Step 2: Verify Management Network Connectivity

The controller reaches devices through the ZeroTier management network (10.0.0.0/24). If a device shows Offline:

1. Log in to the device's web interface directly (using its public IP or local IP).
2. Check the ZeroTier status under **Network > ZeroTier**.
3. Verify the device is joined to the correct network and has received an IP address.

### Step 3: Check from Controller Server

```bash
# SSH to controller server
ssh -i test_ubuntu24.04.pem ubuntu@3.6.121.36

# Ping the device's ZeroTier management IP
ping -c 4 10.0.0.2   # spoke1
ping -c 4 10.0.0.3   # hub
```

If the ping fails from the server, the device is not on the ZeroTier network. The device must reconnect before deployment can proceed.

## Viewing Deployment History

Every deployment attempt is recorded with full details:

1. Go to **SD-WAN Topology** → click the topology name.
2. Click the **Deployment History** tab.
3. Click on any deployment entry to view:
   - Start and end timestamp
   - Per-device results (success or error)
   - Detailed error message for each failed device
   - Whether a rollback occurred and why

The deployment detail is the primary tool for diagnosing failures — always review it before taking corrective action.

## Clearing a Stuck Deployment

If a deployment shows as `in_progress` for more than 15 minutes, it may be stuck due to a crashed worker:

1. Go to **Administration > Admin Panel** (at `/admin/`).
2. Navigate to **SD-WAN Fabric > Deploy History**.
3. Find the stuck record (status = `in_progress`).
4. Change the status to `failed`.
5. Click **Save**.
6. Restart the deploy worker: `sudo systemctl restart nexappcontroller-celery.service`.
7. Retry the deployment from the topology page.

## Debugging Config Validation Errors

When a deployment fails with "config validation failed":

1. Open the deployment detail in **Deployment History**.
2. The error message identifies the specific field and device. Common examples:
   - `Missing hub device` — topology has no hub assigned
   - `WAN member interface not found` — interface name does not match device configuration
   - `BGP AS number conflict` — two devices in the topology have the same ASN
   - `IP address overlap` — tunnel addresses conflict

3. Navigate to the specific setting identified in the error and correct it.
4. Click **Validate** to run validation without deploying.
5. Only deploy once validation passes.

## Deployment Progress Tracking

For large topologies (20+ devices), track deployment progress in real time:

1. Open the topology **Deployment History** tab.
2. The in-progress deployment shows a per-device status table that updates as devices are configured.
3. Each device goes through: `queued` → `pushing` → `verifying` → `success` or `failed`.

## See Also

- [Common Issues](common-issues.md) — Quick-reference troubleshooting
- [API Troubleshooting](api.md) — API-triggered deployment errors
- [Background Task Workers](../15-admin/celery.md) — Worker health and restart
- [Health API Reference](../14-api/health.md) — Worker status check
