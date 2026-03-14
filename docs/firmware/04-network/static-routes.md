# Static Routes

!!! note "Standalone & Controller-Managed"
    This feature is available in both standalone and controller-managed modes. In controller-managed mode, routes may also be pushed from the controller or learned dynamically via BGP/OSPF.

## Overview

The **Routing Table** page lets you view the active kernel routing table and create static routes that persist across reboots. Static routes tell the router how to reach specific networks that are not directly connected or not learned through dynamic routing protocols.

Navigate to **Network > Routes** to access this page. The page provides two protocol tabs (**IPv4 Routes** and **IPv6 Routes**), each with three sections:

| Section | Description |
|---------|-------------|
| **Active Routing Table** | All routes currently installed in the kernel, including connected, static, DHCP-learned, BGP, and OSPF routes. Read-only. |
| **Static Routes** | Manually configured routes that you can create, edit, enable/disable, and delete. |

Routes in the Active Routing Table are color-coded by protocol origin:

- **bgp** -- Learned via BGP
- **ospf** -- Learned via OSPF
- **static** -- Manually configured
- **connected** -- Directly attached subnets
- **dhcp** -- Learned from a DHCP server

## Prerequisites

- You know the destination network, subnet mask, and next-hop gateway for the route you want to add.
- The gateway address must be reachable from the router (either directly connected or via an existing route).
- If specifying an outgoing interface, that interface must already be configured.

## Adding a Static Route

1. Select the **IPv4 Routes** or **IPv6 Routes** tab.
2. In the **Static Routes** section, click **Create Route**.
3. Fill in the route form:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **Status** | Yes | Enable or disable this route. Disabled routes are saved but not installed in the kernel. | Enabled |
| **Name** | No | A friendly description for this route. | `Branch Office` |
| **Network Address** | Yes | Destination network in CIDR notation. | `10.0.0.0/24` (IPv4) or `fd00::/64` (IPv6) |
| **Gateway** | No | Next-hop IP address. Required unless you select an outgoing interface. | `192.0.2.1` |
| **Metric** | Yes | Route priority. Lower values are preferred when multiple routes exist to the same destination. | `0` |
| **Interface** | No | Outgoing network interface. Select "Any" to let the router decide based on the gateway address. | `wan` |

4. Click **Save**.
5. Review the pending changes banner and click **Apply** to commit the route.

!!! tip "When to Use Gateway vs. Interface"
    - Use **Gateway** when the next hop is a specific router on a shared segment.
    - Use **Interface** when the destination is reachable through a point-to-point link (e.g., a VPN tunnel) with no explicit next-hop address.
    - You can specify both for maximum control.

## Advanced Settings

Click **Advanced Settings** in the route creation drawer to access additional options:

| Setting | Description | Default |
|---------|-------------|---------|
| **Route Type** | The kernel route type. Common values: `unicast` (normal forwarding), `blackhole` (silently drop), `unreachable` (return ICMP unreachable), `prohibit` (return ICMP prohibited). | `unicast` |
| **MTU** | Override the path MTU for this route. Valid range: 68--65535 for IPv4, 1280--65535 for IPv6. | `1500` |
| **On-Link** | Treat the gateway as directly reachable on the link, even if it is not in the same subnet as the interface address. Useful for ISP configurations where the gateway is in a different subnet. | Off |

!!! warning
    The **blackhole**, **unreachable**, and **prohibit** route types discard traffic to the destination network. Use them only for intentional traffic filtering or null routing.

## Editing a Static Route

1. In the Static Routes table, find the route you want to modify.
2. Click the **Edit** button on that row.
3. Update the desired fields in the side drawer.
4. Click **Save** and then **Apply** the pending changes.

## Enabling or Disabling a Route

You can temporarily disable a route without deleting it:

1. Edit the route.
2. Toggle the **Status** switch to disabled.
3. Click **Save** and **Apply**.

Disabled routes appear dimmed in the table and are not installed in the kernel routing table.

## Deleting a Static Route

1. In the Static Routes table, click the kebab menu (three dots) on the route row.
2. Select **Delete**.
3. Confirm the deletion in the modal dialog.
4. Click **Apply** to commit the removal.

!!! warning
    Deleting a route that carries production traffic will immediately interrupt connectivity to the destination network. Verify the route is no longer needed before deleting.

## Policy-Based Routing

NexappOS supports policy-based routing through the Multi-WAN feature, which lets you steer traffic based on source address, protocol, or application rather than just destination. For policy-based routing:

- Use **Multi-WAN rules** to direct specific traffic flows through a preferred WAN interface.
- Use **SD-WAN traffic steering** policies for application-aware path selection based on SLA metrics.

!!! info "See Also"
    - [Multi-WAN](multi-wan.md) -- Configure policy-based routing and WAN failover
    - [SD-WAN Traffic Steering](../06-sla/traffic-steering.md) -- Application-aware path selection

## Verification

After adding or modifying a static route:

1. Check the **Active Routing Table** section. Your route should appear with the protocol badge **static**.
2. From the router's **Monitoring > Ping & Traceroute** page, ping an IP address in the destination network to verify reachability.
3. Run a traceroute to confirm traffic follows the expected path through the configured gateway.
4. If the route has a specific metric, add a second route to the same destination with a different metric and verify that only the lower-metric route is active.

## Troubleshooting

| Symptom | Possible Cause | Resolution |
|---------|---------------|------------|
| Route not appearing in Active Routing Table | Route is disabled, or pending changes have not been applied | Check the route's status toggle. Click **Apply** on the pending changes banner. |
| "Invalid network address" validation error | Missing or incorrect CIDR notation | Enter the network in CIDR format (e.g., `10.0.0.0/24`), not a bare IP address. |
| Traffic not following the static route | A more specific route or a lower-metric route takes precedence | Check the Active Routing Table for conflicting routes. Adjust the metric or make the destination more specific. |
| Gateway unreachable | The gateway IP is not in a directly connected subnet and there is no route to reach it | Add a route to the gateway's subnet first, or enable the **On-Link** advanced option. |
| Route disappears after reboot | Route was added in the Active Routing Table (kernel) but not saved as a static route | Always create routes through the **Static Routes** section, not via command line, to ensure persistence. |
| Asymmetric routing causing connection drops | Return traffic takes a different path than outgoing traffic | Ensure both directions have consistent routes, or disable reverse-path filtering on the affected interface. |

!!! info "See Also"
    - [Interfaces & Devices](interfaces.md) -- Configure the interfaces referenced in routes
    - [BGP](../08-routing/bgp.md) -- Dynamic route exchange via BGP
    - [OSPF](../08-routing/ospf.md) -- Dynamic route exchange via OSPF
    - [Multi-WAN](multi-wan.md) -- WAN failover and load balancing
