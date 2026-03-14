# Deployment Pipeline

## Overview

When you push a configuration from the Nexapp SDWAN Controller, the deployment pipeline
validates, queues, executes, verifies, and records the operation. Understanding each stage
helps you interpret status indicators and troubleshoot failures quickly.

The pipeline runs through five stages for every deployment, whether you push to a single
device or to every device in a topology at once.

## Pipeline Stages

| Stage | Description | Typical Duration |
|-------|-------------|-----------------|
| **Validate** | Controller checks configuration consistency — required fields, address conflicts, dependency order | < 1 second |
| **Queue** | Deployment task is placed in the dedicated deploy task queue, isolated from real-time status polling | < 1 second |
| **Push** | Controller connects to the target device via ZeroTier management plane and sends the configuration payload | 5 – 30 seconds |
| **Verify** | Device confirms the applied configuration and reports back; daemon restarts if required | 10 – 45 seconds |
| **Record** | Deployment result, operator identity, diff, and timestamp are written to the immutable history log | < 1 second |

## Status Indicators

Each deployment (and each device within a deployment) shows one of five status values:

| Status | Color | Meaning |
|--------|-------|---------|
| **Pending** | Grey | Task is waiting in the queue for a worker to pick it up |
| **Running** | Blue | Push is actively in progress |
| **Success** | Green | Configuration applied and verified on the device |
| **Failed** | Red | Push or verification failed; device retains its previous configuration |
| **Partial** | Amber | Multi-device deployment — some devices succeeded, at least one failed |

## Parallel Deployment

When you deploy to a topology, the controller pushes to all devices simultaneously using
multiple background workers. A 20-device topology does not take 20× as long as a
single-device push — most topologies complete within 60 seconds regardless of device count.

Failed devices are highlighted in red in the topology view. Devices that succeeded are not
affected by failures on other devices.

## Validation Stage

Before any configuration leaves the controller, the validation stage checks:

- All required fields are present (hub IP, tunnel address, at least one WAN member)
- IP address ranges do not conflict across devices in the same topology
- Referenced policies (SLA profiles, QoS templates, BGP configs) still exist and are valid
- Devices are reachable on the ZeroTier management network

If validation fails, no task is queued and no device is touched. The error message
describes exactly which check failed and which field to correct.

## Error Handling

If a push fails mid-deployment:

1. The device is marked **Failed** and retains its previous running configuration.
2. Other devices in the same topology deployment continue without interruption.
3. The failure reason (timeout, reachability error, configuration rejection) is captured in
   the history log with a full diagnostic message.
4. Click **Retry** next to the failed device in **SD-WAN Fabric > Deploy History** to re-run the push
   for that device alone.

## Retry Behavior

Retrying a failed device re-runs the Push and Verify stages only — validation already passed
when the original deployment was created. The retry uses the same configuration snapshot
that was originally dispatched, ensuring the re-push is consistent with the original intent.

## Deployment Queue Architecture

The deploy task queue is separate from the status polling queue. This ensures that a large
deployment pushing to 50 devices simultaneously cannot delay the real-time health status
updates that the dashboard depends on. Status polls run every 30 seconds independently of
any ongoing deployment activity.

## Notifications

If email alerts are configured under **Settings**, the controller
sends a notification when:

- A deployment finishes with one or more **Failed** devices
- A deployment enters **Partial** status

Successful deployments do not generate email alerts by default.

## See Also

- [Configuration Push](config-push.md) — How to initiate a deployment from the UI
- [Deployment History](history.md) — View past deployments, diffs, and rollbacks
- [Global Policies](../06-policies/overview.md) — Manage reusable policy templates
