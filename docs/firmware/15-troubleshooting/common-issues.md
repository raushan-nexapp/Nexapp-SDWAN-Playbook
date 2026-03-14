# Common Issues

## Overview

This page provides a quick reference for the most common issues across all NexappOS features. Issues are organized by category. For feature-specific troubleshooting, see [SD-WAN Troubleshooting](sdwan.md) and [Connectivity Troubleshooting](connectivity.md).

## Login & Access

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Cannot log in to the web UI | Incorrect password, or the management interface IP has changed | Verify you are using the correct IP address and credentials. If you forgot the password, perform a factory reset or use SSH to reset it. |
| Session expired unexpectedly | The session timeout is set too short, or the browser cleared cookies | Log in again. Check session timeout settings under **System > Settings**. |
| "Connection refused" when accessing the web UI | The web server service is not running, or a firewall rule is blocking access | Verify the management port (default `443`) is open. Try accessing via SSH to restart the web service. |
| Cannot access the router via SSH | SSH is disabled, or the SSH port is blocked | Enable SSH under **System > SSH**. Verify the SSH port is allowed in the firewall. |
| Web UI loads but shows a blank page | Browser cache is stale after a firmware upgrade | Clear the browser cache and reload. Try a different browser or incognito mode. |

## System

| Symptom | Cause | Resolution |
|---------|-------|------------|
| High CPU usage | A service or process is consuming excessive resources, or DPI is analyzing heavy traffic | Navigate to **Monitoring > Real-Time** to identify the source. Consider disabling DPI on low-power devices if CPU is consistently above 90%. |
| High memory usage | Too many active connections, large routing tables, or DPI buffers | Check the number of active connections under **Monitoring > Real-Time > Instant Traffic**. Consider restarting services that are consuming excessive memory. |
| Disk full / storage warning | Log files, DPI data, or configuration backups consuming all available storage | Export and download log files, then clear old logs. Remove unused backup files. Check for large temporary files. |
| Service not starting | A configuration error prevents the service from initializing | Check the system logs under **Monitoring > Logs** for error messages from the failing service. Review the service configuration. |
| Router rebooted unexpectedly | A watchdog timer triggered due to an unresponsive service, or a power interruption occurred | Check the system logs for watchdog events or kernel panics. Verify the power supply is stable. |

## Firmware Updates

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Firmware update fails | The firmware image is corrupted, or there is insufficient storage | Re-download the firmware image. Verify the checksum matches. Ensure at least 50 MB of free storage. |
| Router does not boot after firmware update | The update process was interrupted (power loss during flashing) | Use the recovery mode or failsafe boot to restore the previous firmware. |
| Configuration lost after update | The update was performed without preserving settings | Always use **System > Firmware Update** with the "Keep settings" option enabled. Restore from a backup if available. |
| Update shows "Image verification failed" | The firmware image is for a different hardware model | Download the correct firmware for your specific router model. |

## General Network

| Symptom | Cause | Resolution |
|---------|-------|------------|
| DNS not resolving | The router's upstream DNS servers are unreachable or misconfigured | Check DNS settings under **Network > DNS & DHCP**. Try setting DNS to a public server (e.g., `8.8.8.8`). Use the [DNS Lookup](../13-monitoring/dns-lookup.md) tool to test. |
| DHCP not assigning addresses | The DHCP server is disabled, the address pool is exhausted, or the interface is not in the correct zone | Verify DHCP is enabled on the LAN interface. Check the address pool range and active leases. |
| Interface shows "Down" | The cable is unplugged, or there is a link speed mismatch with the upstream switch | Check the physical cable. Try enabling auto-negotiation under **Network > Interfaces and Devices**. |
| Cannot reach devices on another subnet | A static route is missing, or firewall rules block inter-subnet traffic | Add a static route under **Network > Static Routes**. Check firewall zone forwarding rules. |
| Slow internet speed | WAN link congestion, QoS misconfiguration, or ISP throttling | Run a [Speed Test](../13-monitoring/speedtest.md) to measure actual throughput. Check QoS settings under **QoS > Overview**. |

## Controller Registration

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Router cannot register with the controller | The controller URL is incorrect, or the router cannot reach the controller | Verify the controller URL and ensure the router has internet connectivity. Check DNS resolution. |
| Router shows "Unregistered" after being registered | The controller rejected the router's credentials, or the device was deleted from the controller | Re-register the router from **System > Controller Registration**. |
| Configuration not applied after deployment | The router received the configuration but failed to apply it | Check system logs for configuration errors. Verify the deployed templates are compatible with the router's firmware version. |
| Controller shows router as "Offline" | The management-plane network connection is down | Check the router's management interface status. Verify the management network is reachable from the router. |

!!! info "See Also"
    - [SD-WAN Troubleshooting](sdwan.md) -- SD-WAN overlay, SLA, QoS, routing, and HA issues
    - [Connectivity Troubleshooting](connectivity.md) -- WAN, LAN, DNS, VPN, and firewall issues
    - [System Logs](../13-monitoring/logs.md) -- View detailed system event logs
    - [Dashboard](../03-system/dashboard.md) -- System status overview
