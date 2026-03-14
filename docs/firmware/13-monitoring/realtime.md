# Real-Time Monitoring

!!! note "Standalone & Controller-Managed"
    Real-time monitoring is available in both modes. All data is collected and displayed locally on the router.

## Overview

The **Real-Time Monitoring** dashboard provides live visibility into your router's network activity, security events, and VPN status. Charts update automatically, giving you an at-a-glance view of traffic patterns, interface utilization, and system health.

Navigate to **Monitoring > Real-Time** to access this dashboard.

## Dashboard Tabs

The dashboard is organized into seven tabs. Each tab focuses on a specific area of router operation.

### Traffic

Displays live bandwidth utilization charts for each network interface. You can see bytes sent and received per second, helping you identify congested links or unexpected traffic spikes.

### Connectivity

Shows the current status of all network interfaces, including link state (up/down), IP addresses, and traffic counters. Use this tab to quickly verify that WAN and LAN interfaces are operational.

### VPN

Displays the status of all VPN tunnels (OpenVPN, WireGuard, IPsec). You can see which tunnels are connected, their uptime, and the amount of data transferred through each tunnel.

### Security

Shows active threat protection status, firewall events, and blocked connections. Use this tab to monitor DPI alerts, intrusion prevention events, and threat shield activity.

### Instant Traffic

Provides a real-time per-connection view of active network flows. You can see source and destination addresses, protocols, ports, and the amount of data transferred for each active connection.

### SD-WAN Fabric

Displays the SD-WAN overlay status, including tunnel health, WAN member states, and bonding daemon activity. This tab is only populated when the SD-WAN fabric is configured.

### App Traffic

Shows application-level traffic classification powered by DPI. You can see which applications are consuming bandwidth, sorted by usage. This tab requires DPI to be enabled under **Security > DPI**.

## How to Use

1. Navigate to **Monitoring > Real-Time**.
2. Select the tab for the area you want to monitor.
3. Charts and tables update automatically every few seconds.
4. Use the information to identify bandwidth bottlenecks, verify interface status, or confirm VPN tunnel health.

!!! tip
    Open the **Instant Traffic** tab to identify which connections are consuming the most bandwidth in real time. This is especially useful when diagnosing unexpected congestion.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Charts not loading or showing empty | The monitoring service has not started, or the browser lost connection to the router | Refresh the page. If charts remain empty, verify you can reach the router's management IP. |
| Data appears stale or not updating | Auto-refresh may have stopped due to a network interruption | Reload the browser tab. Check that the router is reachable. |
| High CPU shown on the dashboard | A service or process is consuming excessive resources | Navigate to the **Traffic** or **Instant Traffic** tab to identify the source of high utilization. Review active connections and consider enabling QoS. |
| SD-WAN Fabric tab shows no data | The SD-WAN overlay is not configured or the bonding service is not running | Configure the SD-WAN overlay under **SD-WAN > Overview** and ensure at least one WAN member is added. |
| App Traffic tab shows "DPI not enabled" | DPI classification is disabled | Enable DPI under **Security > DPI** to see application-level traffic data. |

!!! info "See Also"
    - [Ping & Traceroute](ping-traceroute.md) -- Test reachability and trace network paths
    - [Speed Test](speedtest.md) -- Measure WAN bandwidth
    - [System Logs](logs.md) -- View detailed system event logs
