# iPerf3 Bandwidth Test

!!! note "Standalone & Controller-Managed"
    iPerf3 is available in both modes. The test runs directly on the router.

## Overview

**iPerf3** measures the actual achievable bandwidth between the router and a remote iPerf3 server. Unlike speed tests that use HTTP, iPerf3 tests raw TCP or UDP throughput, giving you a more accurate measurement of link capacity without web protocol overhead.

Navigate to **Monitoring > iPerf3** to access this tool.

## Prerequisites

- A remote iPerf3 server must be running and reachable from the router.
- The iPerf3 port (default `5201`) must be open in any firewalls between the router and the server.

## How to Use

1. Configure the connection settings:

| Field | Description |
|-------|-------------|
| **Server Address** | The IP address or hostname of the remote iPerf3 server (e.g., `10.0.0.1`). |
| **Port** | The iPerf3 server port (default: `5201`). |
| **Protocol** | Select **TCP** for reliable throughput measurement or **UDP** for jitter and packet loss testing. |

2. Configure the test options:

| Field | Description |
|-------|-------------|
| **Duration (seconds)** | How long to run the test (default: `10`). |
| **Parallel Streams** | Number of concurrent streams (default: `1`). Multiple streams can saturate high-bandwidth links. |
| **Direction** | **Client to Server** sends data from the router. Toggle **Reverse** to test Server to Client (download). |

3. Click **Run Test** to start.
4. The raw iPerf3 output scrolls in real time, showing per-interval throughput.
5. When the test completes, a results summary displays:
    - **Sender Bitrate** -- Throughput measured at the sending side.
    - **Receiver Bitrate** -- Throughput measured at the receiving side.
    - **Total Transfer** -- Total data transferred during the test.
6. Click **Stop** to cancel a running test.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| "Connection refused" error | The iPerf3 server is not running or is listening on a different port | Verify the server is running (`iperf3 -s`) and confirm the port number. |
| Port blocked (no response) | A firewall between the router and server is blocking the iPerf3 port | Open port `5201` (or your configured port) in all firewalls along the path. |
| Low throughput despite fast WAN link | Single stream may not saturate the link due to TCP window size | Increase **Parallel Streams** to `4` or higher. |
| UDP test shows high packet loss | The link or an intermediate device is dropping UDP packets | Reduce the target bandwidth or check for network congestion. |

!!! info "See Also"
    - [Speed Test](speedtest.md) -- Quick internet speed measurement using public servers
    - [Interface QoS](../07-qos/interface-qos.md) -- Configure bandwidth shaping per interface
    - [Real-Time Monitoring](realtime.md) -- Live bandwidth utilization charts
