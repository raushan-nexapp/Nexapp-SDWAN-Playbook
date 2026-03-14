# DC/DR Recovery & Failback

!!! note "Controller-Managed Only"
    DC/DR recovery is automatic and requires no manual intervention under normal conditions. The router handles failback independently.

## Overview

After a failover event, the router operates under the backup controller (DR). When the primary controller (DC) recovers, the router automatically detects the recovery and switches back. This process preserves the router's identity and credentials, ensuring no re-registration is needed.

## Automatic Failback

While connected to the DR, the router periodically checks whether the DC has come back online:

1. The router probes the DC at regular intervals (controlled by the **Fallback Check Multiplier** setting).
2. If the DC responds, a stability counter increments.
3. If the DC fails to respond, the stability counter resets to zero.
4. Once the stability counter reaches the **Fallback Stability** threshold, the router initiates failback.
5. The router switches back to the DC, restoring the original configuration.

!!! example
    With default settings (Fallback Stability = 3, Check Interval = 15 seconds), the router requires approximately 45 seconds of continuous DC availability before switching back.

The stability window prevents the router from switching back to a DC that is intermittently available (e.g., during a rolling restart).

## Identity Preservation

One of the most important aspects of DC/DR failover is identity preservation. The router maintains its identity across failover and failback events:

- **Credentials** -- The router's registration credentials (unique identifier and authentication key) are saved to persistent storage before each switch. This allows the router to reconnect to either controller without re-registering.
- **Network identity** -- The router's management-plane network identity is backed up and restored during each transition, preventing identity drift.
- **Cross-controller credentials** -- When the DR uses a replicated database from the DC, the router's DC credentials work on the DR without re-registration. The system tries replicated credentials first, then saved credentials, and only re-registers as a last resort.

### Credential Priority

During a controller switch, the router attempts to authenticate in this order:

1. **Saved target credentials** -- Previously saved credentials for the target controller.
2. **Cross-controller credentials** -- Credentials from the other controller (works when databases are replicated).
3. **Fresh registration** -- If both fail, the router registers as a new device (last resort).

!!! warning
    Fresh registration creates a new device entry on the controller. To avoid this, ensure database replication is configured between DC and DR so that cross-controller credentials work.

## Self-Healing Mechanisms

The DC/DR system includes several automatic recovery features:

| Mechanism | Description |
|-----------|-------------|
| **Identity drift detection** | Every 5 minutes, the router verifies its network identity matches the saved backup. If a mismatch is found, the saved identity is restored automatically. |
| **Network auto-repair** | If the management network interface loses its IP address, the system restarts the network service and re-joins the management network. |
| **Rollback on failed switch** | If a controller switch fails after 5 registration attempts, the router rolls back to the previous controller configuration and restarts the agent. |
| **Persistent credential storage** | Credentials survive reboots and firmware upgrades because they are stored in persistent storage, not in temporary memory. |

## Manual Failback

In most cases, failback is automatic. However, if the router does not fail back automatically, you can trigger it from the controller:

1. Verify the DC is fully operational and reachable.
2. Redeploy the device configuration from the DC.
3. The router will receive the updated configuration and reconnect to the DC.

## Recovery After Extended Outage

If the DC was down for an extended period:

1. All routers will be connected to the DR.
2. When the DC comes back online, routers begin their stability checks.
3. Routers that pass the stability window switch back to the DC automatically.
4. The process is staggered naturally since each router has its own check cycle, preventing a thundering-herd reconnection.

!!! tip
    Monitor the controller dashboard during recovery to track how many routers have switched back to the DC. Routers that do not switch back within 10 minutes may need their configuration redeployed.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Router stuck on DR after DC recovery | The DC is not consistently reachable from the router, resetting the stability counter each time | Verify the router can reach the DC (check with ping from the router). Ensure the stability window is not set too high. |
| Credentials lost after failover (router re-registered) | Persistent storage was full or corrupted before the switch | Check the router's storage status. The router should have re-registered automatically, but it will appear as a new device on the controller. Merge the device records if needed. |
| Identity mismatch after failback | A configuration push from the controller overwrote the network identity during the transition | The self-healing mechanism should detect and correct this within 5 minutes. If it persists, restart the failover service from the router's management interface. |
| Multiple routers fail back simultaneously, overwhelming the DC | All routers had the same check timing and passed stability at the same time | This is rare due to natural timing differences. If it occurs, increase the check interval temporarily on the DC to throttle reconnections. |

!!! info "See Also"
    - [DC/DR Overview](overview.md) -- How DC/DR failover works
    - [DC/DR Configuration](configuration.md) -- Adjust failover parameters
    - [High Availability Overview](../09-ha/overview.md) -- Router-level HA with VRRP
