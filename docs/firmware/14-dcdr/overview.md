# DC/DR Controller Failover

!!! note "Controller-Managed Only"
    DC/DR failover requires two controllers (primary and backup) and is only available in controller-managed mode. The router must be registered with a controller to use this feature.

## Overview

DC/DR (Data Center / Disaster Recovery) provides automatic controller failover for NexappOS routers. If the primary controller (DC) becomes unreachable, routers automatically switch to the backup controller (DR) without any manual intervention. When the primary controller recovers, routers automatically switch back.

This ensures continuous management-plane connectivity even during controller outages, data center failures, or network partitions.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **DC (Data Center)** | The primary controller that manages routers under normal conditions. |
| **DR (Disaster Recovery)** | The backup controller that takes over when the DC is unreachable. |
| **Reachability Check** | The router periodically probes the active controller to verify it is online and responding. |
| **Failover** | The process of switching from the DC to the DR when the DC is detected as unreachable. |
| **Failback** | The process of switching from the DR back to the DC when the DC recovers. |
| **Identity Preservation** | The router retains its credentials and network identity across failover and failback events, avoiding re-registration. |

## How Failover Works

The DC/DR failover process follows these steps:

1. **Normal operation** -- The router is connected to the DC and receives configuration updates normally.
2. **DC becomes unreachable** -- The router's health check detects that the DC is not responding.
3. **Failure threshold reached** -- After a configurable number of consecutive failed checks, the router initiates failover.
4. **Credential preservation** -- The router saves its current credentials and network identity before switching.
5. **Switch to DR** -- The router connects to the DR controller using saved or replicated credentials.
6. **Operational on DR** -- The router resumes normal operation under DR management.
7. **DC recovery detected** -- The router periodically checks if the DC is back online.
8. **Stability verified** -- After the DC passes multiple consecutive reachability checks, the router initiates failback.
9. **Switch back to DC** -- The router reconnects to the DC, restoring the original configuration.

!!! warning
    During the failover switching process (typically 15--45 seconds), the router's data plane continues forwarding traffic normally. Only the management connection is temporarily interrupted.

## Self-Healing

The DC/DR system includes automatic recovery mechanisms:

- **Identity drift detection** -- The router periodically verifies its network identity matches the saved identity and auto-corrects if a mismatch is detected.
- **Network connectivity repair** -- If the management network interface loses connectivity, the system automatically attempts to restore it.
- **Credential caching** -- Credentials for both DC and DR are saved to persistent storage, surviving reboots and firmware upgrades.
- **Rollback on failure** -- If a failover attempt fails (e.g., the DR is also unreachable), the router rolls back to its previous configuration automatically.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Router not failing over when DC is down | The failure threshold has not been reached yet, or the check interval is too long | Wait for the configured number of consecutive failures. See [Configuration](configuration.md) to adjust thresholds. |
| Router keeps switching between DC and DR (flapping) | The DC is intermittently reachable, causing repeated failover/failback | Increase the stability window so the DC must pass more consecutive checks before failback triggers. See [Configuration](configuration.md). |
| Router cannot connect to either controller | Both DC and DR are unreachable, or network connectivity is down | Verify the router has internet access. Check that both controller URLs are correct and the controllers are running. |

!!! info "See Also: Controller Manual"
    To configure DC/DR failover from the controller side, including setting up database replication and deploying failover settings to routers, see [DC/DR Failover](../../controller/12-ha/dcdr-failover.md) in the Controller Manual.

!!! info "See Also"
    - [DC/DR Configuration](configuration.md) -- Configure failover parameters on the router
    - [DC/DR Recovery](recovery.md) -- Understand failback and identity preservation
    - [High Availability Overview](../09-ha/overview.md) -- Router-level HA with VRRP
