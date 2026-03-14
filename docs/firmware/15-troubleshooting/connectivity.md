# Connectivity Troubleshooting

## Overview

This page helps you diagnose and resolve network connectivity issues on NexappOS routers. Use the diagnostic workflow below to systematically isolate problems, and refer to the category-specific tables for common symptoms and resolutions.

For SD-WAN overlay and feature-specific issues, see [SD-WAN Troubleshooting](sdwan.md). For general system issues, see [Common Issues](common-issues.md).

## Diagnostic Workflow

When you encounter a connectivity problem, follow these steps in order:

1. **Check interface status** -- Navigate to **Network > Interfaces and Devices** and verify the affected interface shows "Up" with a valid IP address.
2. **Ping the gateway** -- Use **Monitoring > Ping** to ping the interface's default gateway. If this fails, the issue is on the local link.
3. **Check DNS** -- Use **Monitoring > DNS Lookup** to resolve a known domain (e.g., `google.com`). If this fails but the gateway is reachable, DNS is the problem.
4. **Check firewall rules** -- Navigate to **Firewall > Rules** and verify no rules are blocking the affected traffic. Check zone forwarding between source and destination zones.
5. **Check routes** -- Navigate to **Network > Static Routes** and verify a route exists for the destination network. For dynamic routing, check BGP/OSPF neighbor status under **Routing**.
6. **Run traceroute** -- Use **Monitoring > Traceroute** to identify where packets are being dropped along the path.
7. **Check logs** -- Navigate to **Monitoring > Logs** and search for error messages related to the affected interface or service.

## WAN Connectivity

| Symptom | Cause | Resolution |
|---------|-------|------------|
| WAN interface shows "Down" | Cable unplugged, ISP outage, or link speed mismatch | Check the physical cable. Try enabling auto-negotiation. Contact your ISP if the cable is connected. |
| No IP address on DHCP WAN | Upstream DHCP server not responding | Verify the cable. Release and renew the DHCP lease. Check with your ISP. |
| PPPoE fails to connect | Wrong username or password | Double-check credentials with your ISP. Verify no extra spaces in the username/password fields. |
| WAN has IP but no internet | Default route missing, or upstream routing issue | Verify the default gateway is set. Try pinging the gateway IP directly. Run a traceroute to identify where traffic stops. |
| MTU-related connectivity issues | Path MTU is smaller than the configured interface MTU | Lower the MTU to `1400` or enable MSS clamping. Use ping with the "don't fragment" flag to find the correct MTU. |

## LAN Connectivity

| Symptom | Cause | Resolution |
|---------|-------|------------|
| LAN devices cannot reach the router | The LAN interface is down or has the wrong IP | Verify the LAN interface is up and has the expected IP address. Check that the device is in the correct subnet. |
| DHCP not assigning addresses to LAN devices | DHCP server disabled, address pool exhausted, or interface not in LAN zone | Enable DHCP on the LAN interface. Check the pool range and active leases under **Network > DNS & DHCP**. |
| VLAN traffic not passing | VLAN ID mismatch with upstream switch or switch port not in trunk mode | Verify the VLAN ID matches the switch configuration. Ensure the switch port is set to trunk mode. See [Interfaces](../04-network/interfaces.md). |
| Inter-VLAN routing not working | Firewall zone forwarding rules do not allow traffic between VLAN zones | Add zone forwarding rules under **Firewall > Zones & Policies** to permit traffic between the VLAN zones. |

## DNS Issues

| Symptom | Cause | Resolution |
|---------|-------|------------|
| DNS resolution fails for all domains | The router's DNS servers are unreachable | Check DNS server settings under **Network > DNS & DHCP**. Set a public DNS server (e.g., `8.8.8.8` or `1.1.1.1`). |
| DNS resolution fails for internal domains only | The internal DNS server is not configured or unreachable | Add your internal DNS server under **Network > DNS & DHCP**. Verify the server is reachable from the router. |
| DNS resolution is slow | The primary DNS server is slow to respond | Add a faster DNS server or reorder DNS servers so the fastest one is first. Use the [DNS Lookup](../13-monitoring/dns-lookup.md) tool to compare response times. |
| Devices resolve the wrong IP for a domain | DNS cache contains stale entries, or a DNS override is active | Clear the DNS cache by restarting the DNS service. Check for local DNS overrides under **Network > DNS & DHCP**. |

## VPN Connectivity

| Symptom | Cause | Resolution |
|---------|-------|------------|
| VPN tunnel does not establish | Firewall blocking VPN ports, or authentication credentials are incorrect | Verify the required ports are open (e.g., UDP `1194` for OpenVPN, UDP `500`/`4500` for IPsec, UDP `51820` for WireGuard). Check authentication settings. |
| VPN connected but cannot reach remote network | Routing is not configured for the remote subnet | Add a static route for the remote network via the VPN interface, or enable route pushing in the VPN configuration. |
| VPN performance is poor | Encryption overhead on a low-power device, or MTU issues | Try a lighter cipher if supported. Lower the VPN MTU. Run an [iPerf3 test](../13-monitoring/iperf3.md) through the VPN to measure actual throughput. |
| IPsec tunnel shows "Not Established" | Phase 1 or Phase 2 parameters mismatch between peers | Verify IKE version, encryption algorithm, and DH group match on both sides. Check that pre-shared keys are identical. |
| WireGuard peers show "No handshake" | Endpoint address or port is incorrect, or the peer's public key is wrong | Verify the endpoint address, port, and public key on both sides. Ensure UDP traffic is not blocked. |

## Firewall Issues

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Traffic blocked unexpectedly | A firewall rule with higher priority is matching and dropping traffic | Check the firewall rules under **Firewall > Rules**. Rules are evaluated in order; a deny rule before a permit rule will block traffic. |
| Zone forwarding not working | The forwarding rule between zones is missing or disabled | Navigate to **Firewall > Zones & Policies** and verify forwarding is allowed between the source and destination zones. See [Zones & Policies](../10-firewall/zones-policies.md). |
| Port forwarding not working | The port forwarding rule is incorrect, or the destination device's firewall is blocking the connection | Verify the external port, internal IP, and internal port are correct. Check that the destination device is listening on the specified port. |
| NAT not translating | The NAT rule is disabled or the source zone is incorrect | Verify the NAT rule is enabled and the source zone matches the traffic's origin zone. See [NAT](../10-firewall/nat.md). |

## DC/DR Connectivity

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Router not connecting to any controller | Both DC and DR are unreachable, or the management network is down | Verify the router has internet connectivity. Check controller URLs under registration settings. See [DC/DR Overview](../14-dcdr/overview.md). |
| Router stuck on DR after DC recovery | The DC is not consistently reachable, resetting the stability counter | Verify the router can reach the DC. Check DC/DR configuration settings. See [DC/DR Recovery](../14-dcdr/recovery.md). |
| Management network has no IP | The management network interface failed to join or get an address | Check the management network service status. Restart the service if needed. |

!!! info "See Also"
    - [Network Interfaces](../04-network/interfaces.md) -- Configure and verify network interfaces
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Manage zone assignments and inter-zone traffic
    - [Ping & Traceroute](../13-monitoring/ping-traceroute.md) -- Test reachability and trace network paths
    - [DNS Lookup](../13-monitoring/dns-lookup.md) -- Test DNS resolution
    - [Common Issues](common-issues.md) -- General system troubleshooting
    - [SD-WAN Troubleshooting](sdwan.md) -- SD-WAN overlay and feature issues
