# Speed Test

!!! note "Standalone & Controller-Managed"
    Speed test is available in both modes. The test runs directly on the router to measure actual WAN throughput.

## Overview

The **Speed Test** tool measures your router's download speed, upload speed, and latency to a public test server. Results help you verify that your ISP is delivering the expected bandwidth and identify performance bottlenecks.

Navigate to **Monitoring > Speedtest** to access this tool.

## How to Use

1. Configure the test options:

| Option | Description |
|--------|-------------|
| **Force Latency Test** | When enabled (default), runs a dedicated latency measurement before the bandwidth test. |
| **Disable QoS During Test** | Temporarily bypasses QoS shaping to measure raw link speed. Enable this to see the actual ISP speed without QoS limits. |
| **WAN Interface** | Select which WAN interface to test. Leave on **Auto (Default)** to use the primary WAN. |

2. Click **Run Speed Test** to start.
3. The test progresses through three phases: latency measurement, download test, and upload test. A live gauge shows the current speed during each phase.
4. When the test completes, the results display:
    - **Download speed** in Mbit/s
    - **Upload speed** in Mbit/s
    - **Ping** (latency) in milliseconds
    - **Jitter** in milliseconds
    - **Server** used for the test
5. Click **Stop** to cancel a running test.

## Reading Results

- **Download/Upload gauges** -- Semi-circle gauges showing throughput relative to a 200 Mbit/s scale.
- **Ping** -- Round-trip latency to the test server. Lower is better (under 20 ms is good).
- **Jitter** -- Variation in latency. Lower is better (under 5 ms is ideal for VoIP).

!!! tip
    Run the speed test with **Disable QoS During Test** enabled to see the true ISP speed. Then run again with QoS active to verify your shaping policies are working correctly.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Test fails to start | Another speed test is already running, or the test service is unavailable | Wait for any running test to complete, then try again. |
| Results are much lower than expected | QoS is shaping traffic, or the WAN link is congested | Enable **Disable QoS During Test** and rerun. Check for other devices consuming bandwidth. |
| "No server found" or server selection fails | The router cannot reach the speed test servers | Verify the router has internet connectivity. Check DNS resolution. |
| Results vary significantly between runs | Network congestion varies over time, or the test server is under load | Run multiple tests at different times of day. Try selecting a different test server manually. |

!!! info "See Also"
    - [iPerf3 Bandwidth Test](iperf3.md) -- Test throughput to a specific server with more control
    - [Real-Time Monitoring](realtime.md) -- View live bandwidth utilization
    - [Interface QoS](../07-qos/interface-qos.md) -- Configure bandwidth limits per interface
