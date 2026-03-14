# Ping & Traceroute

!!! note "Standalone & Controller-Managed"
    Ping and traceroute are available in both modes. Both tools run directly on the router.

## Overview

**Ping** tests basic reachability to a target host by sending ICMP echo requests and measuring round-trip time. **Traceroute** maps the network path between the router and a destination, showing each intermediate hop and its latency.

Use ping to confirm whether a host is reachable. Use traceroute to identify where along the path a connectivity problem occurs.

## Ping

Navigate to **Monitoring > Ping** to access the ping tool.

### How to Use

1. Enter the **Source IP** -- the local IP address to send packets from (e.g., `192.168.1.1`).
2. Enter the **Destination IP** -- the target address to ping (e.g., `198.51.100.1`).
3. Click **Ping** to start.
4. Results appear in real time, showing each reply with its round-trip time.
5. When all packets are sent, a summary line shows packets transmitted, received, and loss percentage.
6. Click **Stop** to cancel a running ping before it completes.

### Reading Results

The summary line at the end of a ping test reports:

- **Packets transmitted** -- Number of echo requests sent.
- **Packets received** -- Number of echo replies received.
- **Packet loss** -- Percentage of lost packets (0% is ideal).
- **RTT min/avg/max** -- Minimum, average, and maximum round-trip times in milliseconds.

## Traceroute

Navigate to **Monitoring > Traceroute** to access the traceroute tool.

### How to Use

1. Enter the **Source IP** -- the local IP address to trace from.
2. Enter the **Destination IP** -- the target to trace the route to.
3. Click **Traceroute** to start.
4. Each hop appears as a row showing the hop number, hostname (if resolvable), IP address, and round-trip times.
5. A summary panel shows total hops, status (reached or incomplete), average latency, and number of timeouts.
6. Click **Stop** to cancel a running traceroute.

### Reading Results

Each hop row displays:

- **Hop number** -- Position in the path (1 = first router after yours).
- **Host / IP** -- The hostname and IP address of the hop.
- **Latency bar** -- A visual indicator of the average RTT at that hop, color-coded from green (fast) to red (slow).
- **Avg RTT** -- Average round-trip time in milliseconds.
- **Status** -- Good, Fair, Slow, or Timeout.

A hop showing `* * * (timeout)` means that router did not respond to the probe. This is common for routers configured to drop ICMP TTL-exceeded packets and does not necessarily indicate a problem.

## When to Use Each Tool

| Tool | Use When |
|------|----------|
| **Ping** | You need to confirm basic reachability or measure latency to a specific host |
| **Traceroute** | You need to identify where packets are being dropped or delayed along a path |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| All packets lost (100% loss) | The target host is unreachable, or a firewall is blocking ICMP | Verify the destination is correct. Check firewall rules on both sides. Try pinging from a different source IP. |
| Traceroute shows `* * *` at one hop but reaches the destination | The intermediate router drops ICMP TTL-exceeded messages | This is normal behavior for many ISP routers. If the destination is reached, no action is needed. |
| Traceroute never reaches the destination | A firewall or routing issue is blocking traffic at a specific hop | Note the last responding hop and investigate routing or firewall rules at that point. |
| "Address not available" error | The source IP address does not exist on the router | Select a valid local IP address that is configured on one of the router's interfaces. |

!!! info "See Also"
    - [MTR](mtr.md) -- Combined ping and traceroute with per-hop statistics
    - [Speed Test](speedtest.md) -- Measure WAN bandwidth
    - [Network Interfaces](../04-network/interfaces.md) -- Verify interface IP addresses
