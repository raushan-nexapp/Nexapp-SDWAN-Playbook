# Connection Tracking

Connection tracking (conntrack) is the mechanism NexappOS uses to monitor the state of every network connection passing through the router. The Conntrack page lets you inspect, filter, and manage the active connections table in real time.

!!! note "Standalone & Controller-Managed"
    Connection tracking is available from the local web UI in both modes.

## Overview

Every TCP, UDP, and ICMP session that passes through the router is recorded in the conntrack table. The firewall uses this state information to make stateful decisions — for example, allowing return traffic for an established connection even if no explicit rule permits it.

The Conntrack page provides a live view of all tracked connections, showing:

- Source and destination addresses and ports
- Protocol
- Data transfer statistics (bytes uploaded and downloaded)
- Connection state (for stateful protocols like TCP)
- Time remaining before the entry expires

## Prerequisites

- Administrative access to the NexappOS web UI
- Active network traffic passing through the router

## Viewing Active Connections

1. Navigate to **Firewall > Conntrack**.
2. The conntrack table displays all active connections with the following columns:

| Column | Description |
|---|---|
| Source | Source IP address and port |
| Destination | Destination IP address and port |
| Protocol | Transport protocol (TCP, UDP, ICMP, etc.) |
| Download / Upload | Data transferred in each direction (formatted in KB, MB, or GB) |
| State | Connection state — see the table below for TCP states |
| Timeout | Seconds remaining before the entry is removed from the table |

### TCP Connection States

| State | Meaning |
|---|---|
| `ESTABLISHED` | Connection is active with data flowing in both directions |
| `SYN_SENT` | Client has sent the initial SYN; waiting for SYN-ACK |
| `SYN_RECV` | Server received SYN and sent SYN-ACK; waiting for final ACK |
| `FIN_WAIT` | One side has initiated connection teardown |
| `CLOSE_WAIT` | Remote side has closed; local side has not yet closed |
| `TIME_WAIT` | Connection is closed but the entry is retained to handle delayed packets |
| `CLOSE` | Connection is fully closed; entry will be removed shortly |

UDP and ICMP connections do not have states in the same way as TCP. They appear with a dash (`-`) in the State column and rely solely on the timeout value.

## Filtering Connections

The conntrack table can contain thousands of entries on a busy router. Use the filter to narrow the display:

1. Type a search term in the **Filter** text box above the table.
2. The table updates in real time to show only matching entries.
3. You can filter by any visible field: IP address, port number, protocol, or state.

**Filter examples:**

| Filter Text | What It Shows |
|---|---|
| `192.168.1.50` | All connections involving this IP (source or destination) |
| `443` | All connections on port 443 (HTTPS) |
| `tcp` | All TCP connections |
| `ESTABLISHED` | Only active, established TCP connections |

Click **Clear Filter** to reset the filter and show all entries.

## Deleting Connection Entries

You can remove individual connections or clear the entire table.

### Deleting a Single Connection

1. Locate the connection in the table (use the filter if needed).
2. Click the **Delete** button on that row.
3. Confirm the deletion.

The router immediately forgets the connection state. If the connection is still active, subsequent packets will be treated as a new connection and re-evaluated against the firewall rules. In most cases the connection will be re-established transparently.

### Deleting All Connections

1. Click **Delete All** at the top of the conntrack page.
2. Confirm the deletion.

This clears the entire conntrack table. All existing connections lose their tracked state and will be re-evaluated. This can cause brief interruptions for active sessions.

!!! warning
    Clearing all conntrack entries on a production router causes a momentary
    disruption for all active connections. Use this only during maintenance
    or when troubleshooting a specific issue.

## Refreshing the Table

The conntrack table shows a snapshot taken when the page loaded. Click the **Refresh** button to reload the table with the latest connection data.

!!! tip
    On a high-traffic router, the conntrack table changes rapidly. Refresh
    frequently if you are monitoring a specific connection, or use the filter
    to narrow the display.

## Connection Limits and Capacity

The conntrack table has a maximum size determined by the router's available memory. When the table is full, the router cannot track new connections, and new traffic may be dropped.

Signs that the conntrack table is near capacity:

- New connections fail intermittently
- Existing connections work but new ones time out
- System logs show "table full" messages

To manage conntrack capacity:

- **Reduce timeouts** for protocols you do not actively use. Shorter timeouts free table entries faster.
- **Avoid unnecessary NAT** — each NAT translation creates additional conntrack entries.
- **Delete stale entries** using the Conntrack page when troubleshooting.
- **Add more memory** if the router consistently runs at or near table capacity.

## NAT Helper Modules

Certain protocols embed IP addresses inside their application-layer data, which breaks when NAT rewrites the packet headers. NAT helper modules (also called conntrack helpers) inspect these protocols and fix the embedded addresses.

You can manage NAT helpers under **Firewall > NAT > NAT Helpers**. Common helpers include:

| Helper | Protocol | Why It Is Needed |
|---|---|---|
| `ftp` | FTP | Active FTP embeds the client's IP in PORT commands |
| `sip` | SIP/VoIP | SDP bodies contain IP addresses for media streams |
| `pptp` | PPTP VPN | GRE tunnels need special tracking |
| `tftp` | TFTP | Uses ephemeral data ports negotiated inside the protocol |
| `h323` | H.323 | Video conferencing signaling contains embedded addresses |

For detailed helper management, see [NAT Rules](nat.md#nat-helpers).

## Verification

To verify that connection tracking is working correctly:

1. Navigate to **Firewall > Conntrack**.
2. Generate traffic from a LAN device (for example, open a web page).
3. Refresh the conntrack table and look for entries matching the source IP, destination IP, and port.
4. Verify that the State shows `ESTABLISHED` for TCP connections.
5. Check that the Download/Upload columns show increasing byte counts.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Conntrack page shows "No connections found" | No traffic is flowing, or the table was just cleared | Generate some traffic and click **Refresh** |
| Connection appears but traffic is blocked | A firewall rule is dropping the traffic after initial state is created | Check **Firewall > Rules** for conflicting DROP or REJECT rules |
| Connections disappear quickly | Timeout is too short for the protocol | Check timeout settings; some short-lived protocols have aggressive defaults |
| New connections fail on a busy router | Conntrack table is full | Delete stale entries or increase the maximum table size in system settings |
| Filter returns no results | Filter text does not match any field | Try a broader search term (for example, just the IP address without the port) |
| VoIP calls fail with one-way audio | SIP conntrack helper is not loaded | Enable the `sip` NAT helper under **Firewall > NAT > NAT Helpers** |
