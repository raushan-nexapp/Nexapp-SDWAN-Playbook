# BGP Route Reflector Monitoring

## Overview

The BGP Route Reflector monitoring dashboard shows the real-time state of all BGP sessions
between the controller and connected NexappOS devices. Use this view to confirm neighbors
are established, verify prefix counts, and diagnose connectivity issues.

Navigate to **Policy Engine > Route Reflector > Monitoring** to access this dashboard.

## Neighbor Table

The neighbor table is the primary view, showing one row per configured BGP peer:

| Column | Description |
|--------|-------------|
| **Neighbor IP** | ZeroTier IP address of the device (e.g., `10.0.0.2`) |
| **Device** | Registered device name in the controller |
| **AS** | The peer's Autonomous System Number |
| **State** | Current BGP session state (see Session States below) |
| **Up/Down** | Duration since the session last changed state (e.g., `2d 14h 33m`) |
| **Prefixes Received** | Number of IP prefixes learned from this neighbor |
| **Prefixes Sent** | Number of prefixes the controller has reflected to this neighbor |
| **Last Updated** | Timestamp of the most recent prefix update from this neighbor |

Click any row to expand the detailed session view for that neighbor.

## Session States

| State | Color | Meaning |
|-------|-------|---------|
| **Established** | Green | Session is active; routes are being exchanged normally |
| **Active** | Amber | Controller is attempting to connect; no session yet |
| **Idle** | Red | Session is administratively down or errored; no connection attempts |
| **Connect** | Blue | TCP handshake in progress |
| **OpenSent** | Blue | BGP OPEN message sent; awaiting response |
| **OpenConfirm** | Blue | Awaiting final confirmation to reach Established |

## Prefix Table

Click the **Prefixes** tab to see all routes learned by the route reflector:

| Column | Description |
|--------|-------------|
| **Network** | The destination prefix (e.g., `192.0.2.0/24`) |
| **Learned From** | The neighbor that advertised this prefix |
| **Reflected To** | List of neighbors this prefix has been sent to |
| **Next Hop** | Next-hop IP as advertised |
| **AS Path** | AS path attribute |
| **Local Pref** | Local preference value |
| **MED** | Multi-Exit Discriminator |
| **Age** | How long this route has been in the table |

Use the search box above the table to filter by prefix or neighbor.

## Route Table (RIB)

Click the **Route Table** tab to view the full BGP Routing Information Base with best-path
selection applied:

- Routes shown with a `>` marker are the best path for that prefix.
- Multiple paths for the same prefix are listed in order of preference.
- The route table reflects exactly what the FRRouting daemon has installed.

## Neighbor Detail View

Click a neighbor row to open its detailed session panel:

- **Timers**: negotiated keepalive and hold-time values
- **Capabilities**: supported BGP capabilities (route refresh, 4-byte ASN, MP-BGP families)
- **Message counters**: total OPEN, UPDATE, KEEPALIVE, and NOTIFICATION messages exchanged
- **Prefix limits**: configured maximum and current count; warning threshold
- **Error history**: last BGP NOTIFICATION code and subcode if the session reset recently

## Refresh

The monitoring dashboard polls the FRRouting daemon every 30 seconds. Click **Refresh Now**
in the toolbar to force an immediate update.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Neighbor stuck in **Active** | Device cannot reach controller on TCP port 179 | Verify ZeroTier is running on both controller and device. Check that no firewall on the controller blocks inbound port 179 from the ZeroTier interface. |
| Neighbor stuck in **Active** | Incorrect neighbor IP configured | Confirm the ZeroTier IP in the neighbor configuration matches the device's actual ZeroTier address. Navigate to **Devices > [device] > ZeroTier** to verify. |
| Neighbor shows **Idle** | Neighbor entry disabled or FRR not running | Check that the neighbor is enabled in **Policy Engine > Route Reflector**. Verify FRR service status on the controller server. |
| Prefixes Received = 0 | Device not advertising any networks | Verify BGP is enabled on the device and the device has networks configured for advertisement. Check the device-side BGP page. |
| Session flapping (Up/Down resets frequently) | Unstable ZeroTier link or hold-timer too short | Check ZeroTier link stability. Consider increasing the BGP hold-time from 90 s to 180 s in the global RR settings. |
| Expected routes not reflected to a neighbor | Route Reflector Client flag not set | Open the neighbor in **Policy Engine > Route Reflector** and confirm **Route Reflector Client** is enabled. |
| Prefix count keeps growing | No maximum prefix limit configured | Set **Max Prefixes** on the neighbor to prevent route table exhaustion. |

## Viewing Diagnostics in the CLI

For advanced diagnosis, you can access the FRRouting VTY shell directly on the controller
server. Contact your administrator for access. Useful commands:

```
show bgp summary
show bgp neighbors 10.0.0.2
show bgp ipv4 unicast
show ip route bgp
```

These commands show the same information as the monitoring dashboard but with additional
detail and the ability to run live queries.

## See Also

- [BGP Route Reflector Configuration](configuration.md) — Add neighbors and apply settings
- [BGP Route Reflector Overview](overview.md) — Architecture and how the RR works
- [MP-BGP Integration](../08-vrf/mp-bgp.md) — vpnv4 prefix monitoring for VRF deployments
