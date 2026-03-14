# Ping Latency Monitor

!!! note "Standalone & Controller-Managed"
    Ping latency monitoring can be configured locally on the router or managed by the controller.

## Overview

The Ping Latency Monitor continuously pings a list of target hosts and records latency data over time. The results feed into the built-in monitoring dashboard, producing historical latency graphs that help you identify trends, detect intermittent issues, and establish performance baselines for your network links.

Navigate to **Monitoring > Ping Latency Monitor** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- Target hosts are reachable via ICMP from the router.
- The monitoring service is running (enabled by default).

## Configuration

### Adding Hosts to Monitor

The page displays a list of target hosts. Each entry is an IP address or hostname that the router pings at regular intervals.

1. In the **Hosts to Monitor** list, enter an IP address or hostname (e.g., `192.0.2.1` or `dns.example.com`).
2. Click **Add Host** to add additional entries.
3. Remove a host by clicking the delete icon next to it.
4. Click **Save** to apply the configuration.

!!! tip
    Add your ISP gateway, a public DNS server (e.g., `8.8.8.8`), and a critical application server to get a comprehensive view of latency across your network path.

### Viewing Latency Graphs

After saving hosts, navigate to **Monitoring > Realtime** or the monitoring dashboard to view latency charts. The graphs display:

- **Average latency** over time for each monitored host.
- **Latency spikes** that indicate congestion or routing changes.
- **Packet loss** periods shown as gaps in the graph.

## Verification

1. Add at least one target host (e.g., `192.0.2.1`).
2. Click **Save**.
3. Wait 2--3 minutes for data collection to begin.
4. Navigate to the monitoring dashboard and confirm latency graphs appear for the configured hosts.
5. Verify the values are consistent with expected round-trip times to each target.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| No graph data after saving hosts | Monitoring service not running or insufficient time elapsed | Wait at least 3 minutes. If no data appears, reboot the router to restart the monitoring service. |
| Latency graph shows gaps | Target host is intermittently unreachable or blocking ICMP | Verify the target allows ICMP echo requests. Check for firewall rules blocking outbound pings. |
| All hosts show high latency | WAN link congestion or DNS resolution delay | If using hostnames, try switching to IP addresses to rule out DNS issues. Check WAN link utilization. |
| Host validation error on save | Invalid hostname or IP format | Enter a valid IPv4 address (e.g., `192.0.2.1`) or a resolvable hostname (e.g., `gateway.example.com`). |

!!! info "See Also"
    - [Realtime Monitoring](realtime.md) -- Live interface and system metrics
    - [Speedtest](speedtest.md) -- On-demand bandwidth measurement
    - [MTR](mtr.md) -- Traceroute with latency statistics per hop
