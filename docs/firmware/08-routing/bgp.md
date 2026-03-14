# BGP (Border Gateway Protocol)

!!! note "Standalone & Controller-Managed"
    BGP can be configured locally on the router or pushed from the controller as a global policy.
    When controller-managed, local changes may be overwritten by the next deployment.

## Overview

BGP is the standard dynamic routing protocol for exchanging routes between autonomous systems. NexappOS uses BGP to establish routing between SD-WAN sites, peer with external networks, and distribute routes through the controller's route reflector.

BGP supports two peering modes:

- **eBGP (External BGP)** -- Peering between routers in different autonomous systems. Used for upstream ISP peering and inter-site routing.
- **iBGP (Internal BGP)** -- Peering between routers in the same autonomous system. Used within the SD-WAN fabric.

Navigate to **Policy Engine > BGP** to access this feature.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You have an Autonomous System Number (ASN) assigned to your network (use private ASN range `65001`--`65534` for internal deployments).
- You know the IP addresses and ASNs of your BGP neighbors.

## Configuration

### General Settings

1. Navigate to **Policy Engine > BGP**.
2. Toggle **BGP** to **Enabled**.
3. Configure the global BGP settings:

| Field | Description | Required |
|-------|-------------|----------|
| **Router AS** | Your local Autonomous System Number (e.g., `65001`). | Yes |
| **Router ID** | A unique IPv4 address identifying this router (e.g., `10.0.0.1`). Typically set to a loopback or management IP. | Yes |
| **Redistribute Connected** | Advertise directly connected routes to BGP neighbors. | No |
| **Redistribute Static** | Advertise static routes to BGP neighbors. | No |
| **Timers Keepalive** | Keepalive interval in seconds (default: `60`). | No |
| **Timers Holdtime** | Hold timer in seconds (default: `180`). The session is declared down if no keepalive is received within this time. | No |
| **Log Neighbor Changes** | Log BGP neighbor state transitions for troubleshooting. | No |
| **Graceful Restart** | Enable graceful restart to preserve forwarding during BGP restarts. | No |
| **Default Local Preference** | Default local preference value for received routes (default: `100`). Higher values are preferred. | No |
| **Deterministic MED** | Compare MED values only between paths from the same AS. | No |

4. Click **Save** to apply the global configuration.

### Neighbors

BGP neighbors (peers) are routers that exchange routing information with this router.

1. Click **Add Neighbor**.
2. Fill in the neighbor form:

| Field | Description | Required |
|-------|-------------|----------|
| **Neighbor IP** | IPv4 address of the remote BGP peer (e.g., `198.51.100.1`). | Yes |
| **Remote AS** | ASN of the remote peer. If different from your AS, this is an eBGP session. | Yes |
| **Description** | A human-readable label for this neighbor. | No |
| **Password** | MD5 authentication password (must match on both sides). | No |
| **eBGP Multihop** | Number of hops allowed for eBGP peers not directly connected (e.g., `2`). | No |
| **Default Originate** | Advertise a default route (`0.0.0.0/0`) to this neighbor. | No |
| **Local Preference** | Override the default local preference for routes from this neighbor. | No |
| **Route Map In** | Apply a route map to incoming routes from this neighbor. | No |
| **Route Map Out** | Apply a route map to outgoing routes to this neighbor. | No |
| **Prefix List In** | Filter incoming routes using a prefix list. | No |
| **Prefix List Out** | Filter outgoing routes using a prefix list. | No |
| **Weight** | BGP weight for routes from this neighbor (Cisco-style, local only). | No |
| **Next Hop Self** | Set this router as the next hop for routes advertised to this neighbor. | No |
| **Soft Reconfiguration Inbound** | Store received routes for policy changes without resetting the session. | No |
| **Maximum Prefix** | Maximum number of prefixes accepted from this neighbor before the session is shut down. | No |
| **Send Community** | Send BGP community attributes to this neighbor (`standard`, `extended`, or `both`). | No |
| **Remove Private AS** | Strip private ASNs from the AS path before advertising to this neighbor. | No |
| **Allow AS In** | Accept routes with your own ASN in the path (useful for hub-and-spoke topologies). | No |
| **Enabled** | Enable or disable this neighbor without deleting it. | Yes |

3. Click **Save**.

### Networks

Advertise specific network prefixes to your BGP neighbors.

1. Click **Add Network**.
2. Enter the **Network** in CIDR notation (e.g., `192.168.1.0/24`).
3. Toggle **Enabled** on.
4. Click **Save**.

### Prefix Lists

Prefix lists filter routes by network prefix and mask length.

1. Click **Add Prefix List**.
2. Fill in the prefix list form:

| Field | Description | Required |
|-------|-------------|----------|
| **List Name** | A name for the prefix list (e.g., `ALLOWED-PREFIXES`). | Yes |
| **Sequence** | Order in which this entry is evaluated (lower numbers first). | Yes |
| **Action** | `permit` to allow matching routes, `deny` to block them. | Yes |
| **Network** | The network prefix to match (e.g., `10.0.0.0/8`). | Yes |
| **GE (Greater or Equal)** | Minimum prefix length to match. | No |
| **LE (Less or Equal)** | Maximum prefix length to match. | No |

3. Click **Save**.

### Route Maps

Route maps apply policy actions (set local preference, prepend AS path, etc.) to routes that match specific criteria.

1. Click **Add Route Map**.
2. Fill in the route map form:

| Field | Description | Required |
|-------|-------------|----------|
| **Map Name** | A name for the route map (e.g., `SET-LOCALPREF`). | Yes |
| **Sequence** | Order in which this entry is evaluated (lower numbers first). | Yes |
| **Action** | `permit` to process matching routes, `deny` to discard them. | Yes |
| **Match Prefix List** | Match routes against a prefix list. | No |
| **Match Community** | Match routes with a specific community value. | No |
| **Match Interface** | Match routes learned via a specific interface. | No |
| **Set Local Preference** | Set the local preference for matching routes. | No |
| **Set Metric** | Set the MED (Multi-Exit Discriminator) value. | No |
| **Set Weight** | Set the BGP weight for matching routes. | No |
| **Set Community** | Attach a community string to matching routes. | No |
| **Set AS Prepend** | Prepend ASNs to the AS path (e.g., `65001 65001` to make the path less preferred). | No |
| **Set Origin** | Override the origin attribute (`igp`, `egp`, or `incomplete`). | No |
| **Set Next Hop** | Override the next-hop address for matching routes. | No |

3. Click **Save**.

## Viewing BGP Status

The **Status** section at the top of the BGP page shows the current state of the BGP process:

- **State** -- Running, Stopped, or Error.
- **Total Neighbors** -- Number of configured peers.
- **Total Prefixes** -- Number of routes in the BGP table.

## Viewing Learned Routes

The **Routes** section displays all routes in the BGP routing table:

| Column | Description |
|--------|-------------|
| **Network** | The destination prefix. |
| **Next Hop** | The next-hop IP address for reaching this prefix. |
| **Peer** | The neighbor from which this route was learned. |
| **AS Path** | The sequence of ASNs the route has traversed. |
| **Origin** | How the route was introduced: `network` (IGP), `redistributed` (incomplete), or `EGP`. |
| **Metric** | The MED value. |
| **Local Pref** | The local preference value. |
| **Weight** | The BGP weight. |
| **Best** | Whether this is the best (active) route for the prefix. |

!!! tip
    Toggle **Show Local Routes** to include locally originated routes in the table.

## SD-WAN Auto-Configuration

If your router is part of an SD-WAN fabric, you can click **Auto-Configure for SD-WAN** to automatically populate BGP settings based on the current overlay topology. This sets the router AS, router ID, and adds neighbors for all SD-WAN peers.

## Verification

1. Navigate to **Policy Engine > BGP**.
2. Confirm the BGP status badge shows **Running** or **Established**.
3. Check that each neighbor shows an **Enabled** status.
4. Review the **Routes** section to verify expected prefixes are being received and advertised.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| BGP session not established | Firewall blocking TCP port 179 | Add a firewall rule to allow BGP traffic on port `179` between peers |
| Neighbor stuck in "Active" state | Incorrect neighbor IP or remote AS | Verify the neighbor IP and remote AS match the configuration on the remote peer |
| Routes not advertised to neighbor | No networks configured or redistribution disabled | Add networks under the **Networks** section, or enable **Redistribute Connected/Static** |
| Routes not received from neighbor | Prefix list or route map is filtering them | Review the inbound prefix list and route map applied to the neighbor |
| Prefix list blocking expected routes | GE/LE values are too restrictive | Adjust the GE and LE values to match the expected prefix lengths |
| Session flapping | Keepalive/holdtime mismatch or unstable link | Ensure both sides use the same timer values, and check the underlying link stability |

!!! info "See Also: Controller Manual"
    To configure BGP policies globally for all devices, see
    [BGP Policies](../../controller/06-policies/bgp.md) in the Controller Manual.

!!! info "See Also"
    - [OSPF Configuration](ospf.md) -- Link-state routing for internal networks
    - [VRF Multi-Tenancy](vrf.md) -- Per-tenant route isolation with BGP address families
