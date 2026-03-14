# MTR (My Traceroute)

!!! note "Standalone & Controller-Managed"
    MTR is available in both modes. The test runs directly on the router.

## Overview

**MTR** combines the functionality of ping and traceroute into a single tool. It continuously sends probes to each hop along the path to a destination and builds a statistical view of latency and packet loss at every hop. This makes MTR more useful than a one-time traceroute for diagnosing intermittent network issues.

Navigate to **Monitoring > MTR** to access this tool.

## How to Use

1. Configure the test parameters:

| Field | Description |
|-------|-------------|
| **Target Host** | The destination IP address or hostname (e.g., `198.51.100.1` or `example.com`). |
| **Ping Count** | Number of probes to send per hop (default: `10`). Higher counts give more accurate statistics. |
| **Protocol** | The probe protocol: **ICMP** (default), **TCP**, or **UDP**. Use TCP or UDP if ICMP is blocked. |
| **Max Hops** | Maximum number of hops to trace (default: `30`). |

2. Click **Run MTR** to start.
3. The tool runs the analysis and displays results in a per-hop statistics table.
4. A summary panel shows total hops, average latency, average loss, and the worst-performing hop.
5. Click **Stop** to cancel a running test.

## Reading the Results Table

Each row in the results table represents one hop along the network path:

| Column | Meaning |
|--------|---------|
| **#** | Hop number (1 = first hop after your router). |
| **Host** | The IP address or hostname of the hop. `* (no response)` means the hop did not reply. |
| **Loss** | Percentage of probes lost at this hop. 0% is ideal. |
| **Latency bar** | Visual indicator of average RTT, color-coded from green (fast) to red (slow). |
| **Best** | Lowest round-trip time observed (ms). |
| **Avg** | Average round-trip time (ms). |
| **Worst** | Highest round-trip time observed (ms). |
| **StDev** | Standard deviation of RTT. High values indicate inconsistent latency (jitter). |

## Interpreting MTR Output

- **100% loss at one hop, but subsequent hops respond** -- The hop is rate-limiting or dropping probe responses. This is common and usually not a problem.
- **Loss increases progressively** -- Packet loss is occurring at the first hop that shows elevated loss. Investigate that hop and the link before it.
- **High StDev at a hop** -- The link to that hop has variable latency (jitter), which can degrade VoIP and video.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| MTR shows 100% loss at one hop but reaches the destination | The hop drops ICMP TTL-exceeded or rate-limits responses | This is normal. If the destination is reached, no action is needed. |
| Intermittent loss at a specific hop | Network congestion or a flaky link at that hop | Run MTR over a longer period (increase ping count to `50` or `100`). Contact the ISP if the hop is outside your network. |
| MTR fails to start | The target host field is empty or the service is busy | Enter a valid target host. Wait for any previous test to complete. |
| All hops show `* (no response)` | The probe protocol is blocked by a firewall | Switch the protocol from ICMP to TCP or UDP. |

!!! info "See Also"
    - [Ping & Traceroute](ping-traceroute.md) -- Simple reachability and path tracing
    - [Path Monitors](../06-sla/path-monitors.md) -- Continuous automated link health monitoring
    - [Real-Time Monitoring](realtime.md) -- Live bandwidth and connectivity dashboard
