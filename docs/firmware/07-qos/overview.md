# Quality of Service (QoS)

!!! note "Standalone & Controller-Managed"
    QoS can be configured locally on the router or pushed from the controller as a global policy.
    When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Quality of Service (QoS) prioritizes network traffic so that latency-sensitive applications such as VoIP and video conferencing receive bandwidth before bulk transfers like backups and software updates. NexappOS uses an adaptive QoS engine that classifies traffic into four priority classes and enforces per-interface bandwidth limits.

Navigate to **Policy Engine > QoS** to access this feature.

The QoS page is organized into three tabs:

- **Interfaces** -- Set upload and download bandwidth limits on individual network interfaces.
- **Rules** -- Create classification rules that assign traffic to a priority class based on application, port, IP address, or DNS pattern.
- **Overview** -- View the current priority class definitions, live packet distribution statistics, and active interface status.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You know the actual upload and download speeds of each WAN link (contact your ISP if unsure).
- If you plan to use application-based rules, DPI (Deep Packet Inspection) must be enabled on the router.

## Enabling the QoS Service

1. Navigate to **Policy Engine > QoS**.
2. Toggle the **QoS Service** switch to **Enabled**.
3. The service status badge changes to **Running** when QoS is active.

To disable QoS, toggle the switch back to **Disabled**. All bandwidth limits and classification rules remain saved but are no longer enforced.

## Priority Classes

NexappOS defines four built-in priority classes. Each class receives a share of available bandwidth and applies specific DSCP markings:

| Class | Bandwidth Share | Use Case | DSCP Marking |
|-------|----------------|----------|-------------|
| **Voice** | 25% | VoIP, gaming, DNS | High (EF) |
| **Video** | 50% | Streaming, video calls | Medium-High (AF41) |
| **Best Effort** | 100% (default) | Web browsing, general traffic | Default (CS0) |
| **Bulk** | 6% | Backups, updates, large downloads | Low (CS1) |

!!! tip
    The bandwidth shares are adaptive. When a higher-priority class is idle, lower-priority traffic can use the freed bandwidth.

## Live Statistics

The **Overview** tab displays real-time packet distribution across the four priority classes. Statistics refresh automatically every 5 seconds while the **LIVE** badge is visible. You can pause and resume auto-refresh, or click **Refresh** to update manually.

The statistics panel shows:

- **Packet distribution bar** -- Visual breakdown of traffic by class.
- **Per-class packet counts** -- Total packets classified into each queue.
- **Active interfaces** -- Which interfaces have QoS ingress and egress DSCP marking enabled.

## Verification

1. Navigate to **Policy Engine > QoS > Overview**.
2. Confirm the service badge shows **Running**.
3. Verify the packet distribution bar shows traffic flowing through the expected classes.
4. Open a VoIP call or video stream and confirm it appears under the **Voice** or **Video** class.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| QoS service shows "Stopped" after enabling | The service failed to start due to a configuration error | Check for at least one configured interface with valid bandwidth limits |
| No traffic appears in any priority class | No interfaces have QoS enabled | Add at least one interface under the **Interfaces** tab |
| All traffic is classified as "Best Effort" | No classification rules are defined | Create rules under the **Rules** tab to match specific applications or ports |
| Live statistics are not updating | Auto-refresh is paused | Click the **Resume** button next to the LIVE badge |

!!! info "See Also"
    - [Interface QoS](interface-qos.md) -- Set per-interface bandwidth limits
    - [QoS Rules](rules.md) -- Create traffic classification rules
    - [Traffic Steering](../06-sla/traffic-steering.md) -- SLA-based path selection for SD-WAN

!!! info "See Also: Controller Manual"
    To configure QoS policies globally for all devices, see
    [QoS Policies](../../controller/06-policies/qos.md) in the Controller Manual.
