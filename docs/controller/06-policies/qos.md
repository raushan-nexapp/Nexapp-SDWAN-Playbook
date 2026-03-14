# QoS Policies

## Overview

A QoS (Quality of Service) policy classifies network traffic and assigns bandwidth
guarantees or limits at each device's WAN interfaces. The controller manages QoS as a
three-level hierarchy: Interface, Class Map, and Policy Map. When deployed globally, every
device in the topology enforces the same traffic prioritization rules.

Navigate to **Policy Engine > QoS Config** to manage QoS policies.

## Why Use QoS on SD-WAN

On shared WAN links, bulk transfers can saturate the uplink and introduce latency for
real-time applications. A QoS policy ensures:

- Voice calls maintain sub-20 ms jitter even during peak utilization
- Video conferencing gets sufficient bandwidth without competing with backup jobs
- Critical business applications are never starved by non-essential traffic

## QoS Hierarchy

```
Interface (WAN link)
└── Policy Map
    ├── Class Map: Voice       → priority queue, 20% bandwidth
    ├── Class Map: Video       → bandwidth guarantee, 30%
    ├── Class Map: Critical    → bandwidth guarantee, 20%
    └── Class Map: Best Effort → fair queue, remaining bandwidth
```

Each WAN interface gets one Policy Map. The Policy Map contains multiple Class Maps that
together must not exceed 100% of the interface bandwidth.

## Creating a QoS Policy

1. Navigate to **Policy Engine > QoS Config**.
2. Click **Add QoS Policy**.
3. Set a **Policy Name** and enable the **Global** flag if applicable.
4. Add one or more Interface entries.
5. Within each interface, add a Policy Map.
6. Within the Policy Map, add Class Map entries.
7. Click **Save**.

## Interface Configuration

| Field | Description | Required |
|-------|-------------|----------|
| **Interface** | WAN interface name on the device (e.g., `wan`, `WAN2`) | Yes |
| **Bandwidth** | Total uplink bandwidth in Kbps — used as the 100% reference for percentage allocations | Yes |
| **Policy Map** | The policy map applied to outbound traffic on this interface | Yes |

## Class Map Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Class Name** | Identifier for this traffic class (e.g., `VOICE`, `VIDEO`) | Yes |
| **Match DSCP** | Match packets by DSCP marking (e.g., `ef` for VoIP, `af41` for video) | No |
| **Match Protocol** | Match by application protocol (e.g., `sip`, `rtp`) | No |
| **Match Source** | Match by source IP prefix (e.g., `192.0.2.0/24`) | No |
| **Queue Type** | `priority` for strict priority, `bandwidth` for guaranteed minimum | Yes |
| **Bandwidth %** | Percentage of interface bandwidth allocated to this class | Yes |
| **Burst** | Burst size in bytes (optional, defaults to 1.5× bandwidth) | No |
| **DSCP Remark** | Re-mark outbound packets to this DSCP value after classification | No |

## Traffic Class Recommendations

| Class | DSCP | Queue Type | Suggested Bandwidth |
|-------|------|------------|---------------------|
| Voice | EF (46) | Priority | 15 – 20% |
| Video Conferencing | AF41 (34) | Bandwidth | 25 – 30% |
| Critical Business Apps | AF21 (18) | Bandwidth | 20% |
| Best Effort | Default (0) | Fair queue | Remaining |

## Example: Branch Office QoS

A branch with a 20 Mbps uplink:

- **Interface**: `wan`, **Bandwidth**: `20480` Kbps
- **Class VOICE**: match DSCP `ef`, priority queue, `20%` → 4 Mbps reserved
- **Class VIDEO**: match DSCP `af41`, bandwidth `30%` → 6 Mbps guaranteed
- **Class CRITICAL**: match source `192.0.2.0/24`, bandwidth `20%` → 4 Mbps
- **Class BESTEFFORT**: remaining `30%` → 6 Mbps, shared fairly

## Deployment and Verification

After attaching a QoS policy to a topology and deploying:

1. The QoS configuration is applied to the WAN interface on each device.
2. To verify, check **Monitoring > Interfaces** on the device UI — the interface should show
   the policy map name in the QoS column.
3. Run a speed test or generate traffic and observe queue statistics to confirm traffic is
   being classified correctly.

If a device does not support hardware QoS, the policy is applied in software by the bonding
daemon. Performance may differ from hardware-based enforcement.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Voice still experiencing jitter | DSCP EF not being matched | Verify the upstream device is marking voice traffic with DSCP EF before it reaches the WAN interface |
| Bandwidth percentages exceed 100% | Class map total > 100% | Adjust class map allocations so they sum to 100% or less |
| QoS not applied after deploy | Wrong interface name | Verify the interface name matches exactly (case-sensitive) |
| Best-effort starved | Priority queue consuming too much | Reduce the priority class bandwidth percentage |

## See Also

- [Global Policy Engine](overview.md) — Understand global vs per-device policy scope
- [SLA Profiles](sla.md) — Define path health thresholds
- [Steering Policies](steering.md) — Route traffic based on SLA
