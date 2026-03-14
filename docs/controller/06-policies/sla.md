# SLA Profiles

## Overview

An SLA (Service Level Agreement) profile defines the performance thresholds that determine
whether a WAN path is considered healthy. The SD-WAN bonding daemon on each device
continuously measures latency, jitter, and packet loss on every WAN link and compares the
results against the active SLA profile. When a link falls below the threshold, steering
policies can automatically reroute traffic to a healthier path.

Navigate to **Policy Engine > Performance SLA** to manage SLA profiles.

## How SLA Profiles Work

1. You create an SLA profile with thresholds for latency, jitter, and packet loss.
2. You attach the profile to a topology (global) or to a specific device.
3. During deployment, the controller pushes the thresholds to each device.
4. Path monitors on the device probe each WAN link at a configurable interval.
5. When a link's measured KPIs breach the thresholds, the link is flagged as degraded.
6. Traffic steering policies that reference this SLA profile activate their failover rules.

## Creating an SLA Profile

1. Navigate to **Policy Engine > Performance SLA**.
2. Click **Add SLA Profile**.
3. Fill in the fields below.
4. Click **Save**.

## Profile Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Profile Name** | Descriptive name (e.g., `Voice-Grade`, `Video-HD`, `Best-Effort`) | Yes |
| **Latency Threshold (ms)** | Maximum acceptable one-way latency | Yes |
| **Jitter Threshold (ms)** | Maximum acceptable jitter (latency variation) | Yes |
| **Packet Loss Threshold (%)** | Maximum acceptable packet loss percentage | Yes |
| **Bandwidth Minimum (Mbps)** | Minimum acceptable measured throughput (optional) | No |
| **Probe Interval (s)** | How often to probe the WAN link (default: `1` second) | No |
| **Probe Samples** | Number of consecutive samples that must breach the threshold before flagging degraded | No |
| **Global** | When enabled, applied to all devices in the attached topology | Yes |

## Preset Profiles

The following presets are recommended starting points:

| Profile | Latency | Jitter | Packet Loss | Typical Use Case |
|---------|---------|--------|-------------|-----------------|
| **Voice Grade** | 20 ms | 5 ms | 0.1% | VoIP, real-time audio |
| **Video HD** | 50 ms | 10 ms | 0.5% | HD video conferencing |
| **Interactive** | 100 ms | 30 ms | 1% | Remote desktop, VPN |
| **Best Effort** | 300 ms | 100 ms | 5% | Email, file transfer |

## Scope: Global vs Per-Device

A single topology often has multiple SLA requirements:

- Enable **Global** for the default profile that covers most traffic.
- Create a per-device override for branches with atypical WAN characteristics (e.g., a
  satellite link where 200 ms latency is normal and should not trigger failover).

## Probe Samples and Stability

Setting **Probe Samples** to `3` means the link must breach the threshold on 3 consecutive
probes before being flagged as degraded. This prevents single-packet-loss events from
triggering unnecessary failover.

Increase probe samples on links with naturally variable latency (cellular, satellite) to
reduce false positives.

## Integration with Steering Policies

SLA profiles are referenced by traffic steering policies. When a path degrades below the
threshold defined in an SLA profile, the associated steering rule activates and reroutes
traffic to the next preferred path.

See [Steering Policies](steering.md) for how to link SLA profiles to routing decisions.

## Viewing SLA Status

After deployment, view live SLA status:

1. Navigate to **SD-WAN Topology** and open the topology.
2. Click a device to see its WAN member health indicators.
3. Members meeting their SLA profile show green; degraded members show amber or red.

The SLA dashboard updates every 30 seconds based on probe results reported from devices.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Frequent false failovers | Thresholds too tight for the link type | Increase latency/jitter thresholds or increase Probe Samples count |
| No failover when link is bad | Steering policy not attached or SLA profile not deployed | Verify the profile is attached to the topology and a recent deployment succeeded |
| Satellite link always shows degraded | 200 ms baseline latency exceeds threshold | Create a per-device SLA profile with higher latency threshold for satellite devices |

## See Also

- [Steering Policies](steering.md) — Route traffic when SLA degrades
- [QoS Policies](qos.md) — Prioritize traffic classes on WAN interfaces
- [Global Policy Engine](overview.md) — Policy attachment and lifecycle
