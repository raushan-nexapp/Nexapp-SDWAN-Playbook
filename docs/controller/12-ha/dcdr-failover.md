# DC/DR Failover

## Overview

DC/DR (Data Center / Disaster Recovery) failover is an automatic mechanism that allows NexappOS routers to switch from a failed primary controller (DC) to a standby controller (DR) without any manual intervention or re-registration. This protects your fleet from a complete loss of management access if the primary controller goes offline.

## Architecture

Two controller instances are deployed:

| Instance | Role | Example IP |
|----------|------|-----------|
| **DC (Data Center)** | Primary controller — routers connect here under normal operation | 203.0.113.10 |
| **DR (Disaster Recovery)** | Standby controller — routers switch here if DC fails | 203.0.113.20 |

Each router is configured with both the DC URL and the DR URL. Under normal operation, every router connects exclusively to the DC controller. The DR controller remains on standby.

```
Normal operation:
    Router → DC Controller (203.0.113.10)
    DR Controller (203.0.113.20) — standby, not contacted

After DC failure (>90s):
    Router → DR Controller (203.0.113.20) — automatic switch, no re-registration
```

## Failure Detection

Each router monitors controller reachability independently by polling the controller's health endpoint every 30 seconds. The decision to failover is made per-router:

| Check | Value |
|-------|-------|
| Poll interval | 30 seconds |
| Failure threshold | 3 consecutive missed polls |
| Time to failover decision | ~90 seconds after first missed poll |
| Connection attempt to DR | Immediately after threshold crossed |

The failure detection is designed to be conservative — a brief network hiccup (1–2 missed polls) does not trigger failover, but a sustained outage (90+ seconds) does.

## Failover Sequence

When a router determines the DC is unreachable, it executes the following steps automatically:

1. **Save credentials** — The current DC registration credentials are cached to persistent storage.
2. **Load DR configuration** — The DR controller URL and credentials are loaded from the device's local configuration.
3. **Restore ZeroTier identity** — The router's management network identity is preserved (not regenerated); the same device identity is used on the DR controller.
4. **Connect to DR** — The router registers with the DR controller using its cached identity.
5. **Resume normal operation** — Templates, policies, and status polling resume against the DR controller.

Total elapsed time from decision to DR connection: approximately 2 minutes.

## No Re-Registration Required

A key design goal of DC/DR failover is that routers do not need to be manually re-registered after failover. This is achieved by:

- **Pre-provisioned DR credentials** — The router has a valid authentication token for the DR controller stored before any failure occurs.
- **Identity preservation** — ZeroTier identity (the cryptographic key that identifies the device) is never cleared during failover. The DR controller recognizes the same device identity.
- **Cached configuration** — The router continues running its last-known configuration during the failover transition.

## Configuring DC/DR on Routers

DC/DR is configured in the router's openwisp agent settings. These settings are typically pushed from the controller as part of the device template.

To configure the DC/DR URLs on a device:

1. Navigate to **Devices** in the controller.
2. Click the device name to open its detail page.
3. Click **Configuration**.
4. Under **Agent Settings**, locate the failover configuration block:

| Parameter | Description |
|-----------|-------------|
| **Controller URL (DC)** | Primary controller URL (e.g., `https://203.0.113.10`) |
| **Controller URL (DR)** | Standby controller URL (e.g., `https://203.0.113.20`) |
| **Failover Check Interval** | How often to poll the controller (default: 30 seconds) |
| **Failover Threshold** | Consecutive failures before switching (default: 3) |
| **Fallback Stability Window** | How long DR must be reachable before it is considered stable (default: 5 checks) |

5. Click **Save** and deploy the configuration to the device.

For fleet-wide deployment, add these settings to a **Global Template** under **Configurations > Templates** and apply it to all devices. This ensures every device has both DC and DR URLs from the moment it is registered.

## Returning to DC (Recovery)

After the DC controller is restored, routers do not automatically switch back. This is intentional — automatic return during DC recovery could cause a second disruption if the DC is still unstable.

To return a router to the DC controller:

**Option 1: Gradual migration** — Update the device's agent settings to set the DC URL as primary again and deploy. The router will switch on next configuration push.

**Option 2: Wait for natural reconnect** — When the DR controller pushes a configuration update containing the DC URL as active, routers switch back automatically.

**Option 3: Fleet return** — For large fleets, use the **Bulk Deploy** feature to push a template containing the DC URL to all affected devices simultaneously.

## Monitoring Failover Status

The controller does not have a dedicated "failover status" view because, by definition, the DR controller does not have visibility into what happened on the DC controller. However, you can assess the state of your fleet from the DR controller:

1. Log in to the DR controller.
2. Navigate to **Devices**.
3. Devices that connected after the DC failure will show recent **Last Seen** timestamps.
4. Devices that did not fail over (e.g., they were offline during the DC failure) will show older timestamps.
5. The **Topology** section will show all topologies as they were last synchronized to the DR controller.

## DR Controller Synchronization

For DC/DR to work correctly, the DR controller must have an up-to-date copy of all device registrations, configurations, and templates. Synchronization is typically maintained through:

- **Database replication** — PostgreSQL streaming replication from DC to DR (recommended for production).
- **Periodic backup restore** — Daily backup of the DC database restored to DR (lower consistency, acceptable for many deployments).

!!! note
    Configuration of DC-to-DR database synchronization is a server-level infrastructure task. Contact your system administrator to verify that DR is kept in sync with DC. If the DR database is significantly out of date at the time of a failover, devices may re-register but some recent configuration changes may not be present.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Routers not connecting to DR after DC failure | DR URL not configured on routers | Verify the DR URL is set in agent settings on all devices |
| Router connects to DR but shows no topology | DR database not synced from DC | Restore the latest DC database backup to the DR controller |
| Router switches to DR during a brief DC maintenance window | Failover threshold too low | Increase the failover threshold (e.g., to 5 checks = 2.5 minutes) to reduce false positives |
| After DC recovery, routers do not return | Expected behavior — return is manual | Push a configuration update with the DC URL to affected devices |
| Device re-registers as new device on DR | ZeroTier identity was cleared during failover | Identity should never be cleared; review the failover script for identity preservation logic |

!!! info "See Also"
    - [HA Overview](overview.md) — Both HA layers explained
    - [HA Configuration](configuration.md) — Set up VRRP pairs for router-level HA
    - [Router DC/DR](../../firmware/14-dcdr/overview.md) — DC/DR failover daemon on the router
