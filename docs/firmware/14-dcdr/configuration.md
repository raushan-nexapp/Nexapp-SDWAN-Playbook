# DC/DR Configuration

!!! note "Controller-Managed Only"
    DC/DR configuration is typically pushed from the controller. The settings described here can be verified locally on the router but are managed centrally.

## Overview

The DC/DR failover system uses a set of parameters to control how the router detects controller failures and when to switch between the primary (DC) and backup (DR) controllers. These settings balance responsiveness (detecting failures quickly) against stability (avoiding false failovers from transient network issues).

## Configuration Fields

The following parameters control the failover behavior:

| Field | Description | Default |
|-------|-------------|---------|
| **Primary Controller URL** | The URL of the primary (DC) controller that the router connects to under normal conditions. | Set during registration |
| **Backup Controller URL** | The URL of the backup (DR) controller that the router switches to when the DC is unreachable. | Set by controller |
| **Check Interval** | How often (in seconds) the router checks if the active controller is reachable. Lower values detect failures faster but generate more network traffic. | `15` |
| **Failure Threshold** | Number of consecutive failed reachability checks before the router triggers a failover. | `3` |
| **Fallback Check Multiplier** | When on the DR, the router checks DC recovery every N main check cycles. A value of `1` means every check cycle. | `1` |
| **Fallback Stability** | Number of consecutive successful DC reachability checks required before the router switches back from DR to DC. Prevents failback flapping. | `3` |
| **Management Network Timeout** | Maximum time (in seconds) to wait for the management network interface to get an IP address during failover. | `30` |

## How the Check Cycle Works

The router runs a continuous health-check loop:

1. Every **Check Interval** seconds, the router probes the active controller.
2. If the probe succeeds, the failure counter resets to zero.
3. If the probe fails, the failure counter increments by one.
4. When the failure counter reaches the **Failure Threshold**, the router initiates failover.

!!! example
    With the default settings (Check Interval = 15 seconds, Failure Threshold = 3), the router detects a DC failure after 3 consecutive failed checks, which takes approximately 45 seconds.

## Adjusting Failover Sensitivity

### Faster Detection

To detect failures more quickly, reduce the check interval and failure threshold:

- Set **Check Interval** to `10` seconds
- Set **Failure Threshold** to `2`

This detects failures in approximately 20 seconds but increases the risk of false failovers during brief network interruptions.

### More Stable (Fewer False Failovers)

To avoid false failovers, increase the failure threshold and fallback stability:

- Set **Failure Threshold** to `5`
- Set **Fallback Stability** to `5`

This requires 75 seconds of DC unreachability before failover and 75 seconds of DC availability before failback.

!!! warning "Avoid Setting Thresholds Too Low"
    Setting the failure threshold to `1` causes the router to fail over on a single missed check, which can happen during brief network congestion. A minimum of `2` is recommended for production environments.

## Verifying Configuration

To verify the DC/DR configuration on the router:

1. Navigate to the router's management interface.
2. Check the controller registration status under **System > Controller Registration**.
3. Verify the primary and backup controller URLs are correct.
4. Confirm the router is currently connected to the expected controller.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Failover not triggering despite DC being down | The failure threshold is set too high, or the check interval is too long | Review the failure threshold and check interval settings. Verify the DC is truly unreachable from the router (not just from your workstation). |
| Premature failover (DC is still reachable) | The check interval is too short or the failure threshold is too low, causing transient network issues to trigger failover | Increase the failure threshold to `5` and the check interval to `30` seconds. |
| DR not reachable when failover triggers | The backup controller URL is incorrect, or the DR server is down | Verify the backup controller URL is correct and the DR server is running. Check network connectivity to the DR. |
| Router re-registers after failover (new device appears on controller) | Credentials were not properly cached before the switch | This indicates the credential caching mechanism could not save the credentials. Check that the router's persistent storage is not full. |

!!! info "See Also"
    - [DC/DR Overview](overview.md) -- How DC/DR failover works
    - [DC/DR Recovery](recovery.md) -- Failback and identity preservation
    - [Controller Registration](../02-installation/controller-registration.md) -- Initial controller setup
