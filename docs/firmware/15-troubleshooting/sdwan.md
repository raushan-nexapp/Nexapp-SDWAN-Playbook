# SD-WAN Troubleshooting

## Overview

This page aggregates troubleshooting guidance for all SD-WAN features: overlay tunnels, underlay members, SLA monitoring, QoS, routing (BGP/OSPF), and high availability. For general system issues, see [Common Issues](common-issues.md). For network connectivity problems, see [Connectivity Troubleshooting](connectivity.md).

## Overlay & Tunnels

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Overlay status shows "Disconnected" | No WAN members configured or all members are down | Add at least one WAN member and verify the WAN interface has internet connectivity. See [SD-WAN Overview](../05-sdwan/overview.md). |
| Tunnel shows "Down" | PSK mismatch between hub and spoke | Verify the PSK is identical on both devices. Regenerate and reapply if needed. See [Encryption](../05-sdwan/encryption.md). |
| Tunnel flaps (connects and disconnects repeatedly) | Underlay WAN link is unstable or MTU is too high causing fragmentation | Lower the **TUN MTU** to `1300` and check the WAN link for packet loss. |
| Spoke cannot reach the hub | Firewall on the hub or ISP is blocking the bonding port | Verify port `5511` (default) is open on the hub's WAN firewall. Check with your ISP if the port is blocked. |
| Tunnel established but no traffic flows | Firewall blocking tunnel ports | Verify the bonding port (default `5511`) is allowed in the firewall on both hub and spoke. |
| Only one WAN link is active | WAN mode set to Single or Dual Standby | Change WAN mode to Dual Active to use both links simultaneously. |
| FEC enabled but no improvement | FEC mode set to Fixed on a link with variable loss | Switch to **Adaptive** FEC, which adjusts overhead based on measured packet loss. |
| High latency on overlay | Underlay WAN link congestion | Check WAN link utilization. Enable QoS or adjust member weights to balance load. |

## Underlay Members

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Member shows "Down" | The WAN interface has no connectivity or the interface name is incorrect | Verify the interface has an IP address and can reach the internet. Check the interface name matches exactly. |
| Traffic not balanced across members | Weights are not configured proportionally, or one member has higher priority | Adjust weights to reflect desired traffic distribution. Ensure both members have the same priority value. |
| "Port already in use" error | Another member is using the same UDP port | Assign a unique port to each member (e.g., `5511`, `5512`). |
| Member added but tunnel still down | Overlay is not configured or PSK is missing | Configure the overlay tunnel first and ensure a PSK is set. See [Overlay Tunnels](../05-sdwan/overlay-tunnels.md). |

## SLA & Health Monitoring

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Monitor always shows link as down | The probe target is unreachable or blocks the selected protocol | Try a different target (e.g., `1.1.1.1`). If using ping, the target may block ICMP; switch to HTTP or TCP. |
| False positives (link flaps up/down frequently) | Failtime is set too low | Increase **Failtime** to `5` or higher. Increase the **Interval** to reduce probe frequency. |
| High loss reported but link works fine | The probe target is rate-limiting or dropping ICMP | Use a different probe target, or switch to HTTP/TCP protocol. |
| SLA thresholds not triggering | Threshold values set to `0` (disabled) | Enter non-zero values for the thresholds you want to enforce. |
| All metrics show 0.0 on the health dashboard | No path monitors configured or probe target unreachable | Create a path monitor with a reachable target (e.g., `8.8.8.8`). See [Path Monitors](../06-sla/path-monitors.md). |
| MOS score is always 0.0 | MOS requires RTT, jitter, and loss data from an active health probe | Ensure at least one path monitor is running and collecting data. |
| Tier matrix shows all cells as "N/A" | No quality tiers are defined | Create at least one quality tier for each path monitor. See [Quality Tiers](../06-sla/quality-tiers.md). |
| All links classified as the lowest tier | Tier thresholds are too strict | Widen the thresholds (e.g., increase max latency from `50` to `100` ms). |

## Traffic Steering

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Traffic not following the policy | The policy priority is higher (larger number) than a more general policy | Move the specific policy to a lower priority number so it is evaluated first. |
| DPI application not matching | DPI is not enabled or the application is not yet classified | Verify DPI is enabled. Traffic may need to flow for a few seconds before classification takes effect. |
| Failover not triggering within a policy | No path monitor configured for the policy | Associate a path monitor with the policy and set a reasonable failtime. |
| Breakout traffic still going through the tunnel | Action is set to "Tunnel" instead of "Breakout" | Change the policy action to **Breakout** and set the path preference to **underlay**. |

## QoS

| Symptom | Cause | Resolution |
|---------|-------|------------|
| QoS service shows "Stopped" | Configuration error prevents the service from starting | Check for at least one configured interface with valid bandwidth limits. See [QoS Overview](../07-qos/overview.md). |
| No traffic in any priority class | No interfaces have QoS enabled | Add at least one interface under the **Interfaces** tab. See [Interface QoS](../07-qos/interface-qos.md). |
| All traffic classified as "Best Effort" | No classification rules defined | Create rules under the **Rules** tab to match specific applications or ports. See [QoS Rules](../07-qos/rules.md). |
| Bandwidth limits not applied | The interface entry is disabled | Enable the interface under **QoS > Interfaces**. |
| Actual speed lower than configured limit | The limit is set higher than the physical link speed | Set bandwidth to 90--95% of the actual ISP speed, not the advertised maximum. |
| Application-based rule has no effect | DPI is not enabled on the router | Enable DPI under **Security > DPI** before using application-based QoS rules. |

## Routing (BGP)

| Symptom | Cause | Resolution |
|---------|-------|------------|
| BGP session not established | Firewall blocking TCP port 179 | Add a firewall rule to allow BGP traffic on port `179` between peers. See [BGP](../08-routing/bgp.md). |
| Neighbor stuck in "Active" state | Incorrect neighbor IP or remote AS | Verify the neighbor IP and remote AS match the configuration on the remote peer. |
| Routes not advertised to neighbor | No networks configured or redistribution disabled | Add networks under the **Networks** section, or enable **Redistribute Connected/Static**. |
| Routes not received from neighbor | Prefix list or route map is filtering them | Review the inbound prefix list and route map applied to the neighbor. |
| Prefix list blocking expected routes | GE/LE values are too restrictive | Adjust the GE and LE values to match the expected prefix lengths. |
| Session flapping | Keepalive/holdtime mismatch or unstable link | Ensure both sides use the same timer values. Check the underlying link stability. |

## Routing (OSPF)

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Adjacency not forming | Hello/Dead interval mismatch between neighbors | Ensure both routers use the same Hello and Dead intervals on the shared link. See [OSPF](../08-routing/ospf.md). |
| Adjacency not forming (area mismatch) | Both routers configured with different OSPF areas on the shared interface | Verify both routers use the same OSPF area on the shared interface. |
| Routes not propagated | Network statement missing or disabled | Add the correct network prefix and area under the **Networks** section. |
| MTU mismatch preventing Full state | Different MTU values on the shared link | Set the same MTU on both sides under **Network > Interfaces and Devices > Advanced Settings**. |
| High CPU usage from OSPF | Too many routes in a single area | Split the network into multiple OSPF areas to reduce link-state database size. |

## High Availability (VRRP)

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Failover does not trigger when primary goes down | Only the WAN failed but the heartbeat interface is still up | Include the WAN interface in the monitored interfaces. See [HA Failover](../09-ha/failover.md). |
| Services not synced after failover | Configuration synchronization was interrupted | Log in to the new Master and click **Force Sync**. |
| Both routers active simultaneously (split-brain) | The heartbeat link is down but both routers reach clients | Restore the physical heartbeat connection immediately. Click **Force Sync** on the Master. See [HA Overview](../09-ha/overview.md). |
| Recovered primary does not rejoin as Backup | The HA service was reset during the outage | Re-run the setup wizard from the current Master. See [VRRP Setup](../09-ha/vrrp.md). |
| Virtual IP not responding after failover | The interface or virtual IP was not added to managed interfaces | Add the interface and virtual IP under the **Managed Interfaces** tab. |
| Requirements validation fails during setup | Hardware mismatch between the two routers | Ensure both routers have identical hardware and the same number of network interfaces. |

!!! info "See Also"
    - [SD-WAN Fabric Overview](../05-sdwan/overview.md) -- SD-WAN configuration
    - [Health Dashboard](../06-sla/health-dashboard.md) -- SLA monitoring dashboard
    - [High Availability Overview](../09-ha/overview.md) -- VRRP and failover configuration
    - [Common Issues](common-issues.md) -- General system troubleshooting
    - [Connectivity Troubleshooting](connectivity.md) -- Network connectivity issues
