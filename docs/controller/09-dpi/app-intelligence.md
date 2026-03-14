# Application Intelligence

## Overview

Application Intelligence is the built-in database that powers DPI classification. It contains signatures for 3000+ applications, each tagged with a category, risk level, and communication protocol. You can browse the full database, search for specific applications, create custom application groups, and use those groups directly in QoS and traffic-steering policies.

Navigate to **Application Intelligence > Applications** to access this view.

## Application Database

The application table lists every application the DPI engine can identify:

| Column | Description |
|--------|-------------|
| App Name | Human-readable application name (e.g., YouTube, Zoom, BitTorrent) |
| Category | Parent category (Streaming, Productivity, P2P, etc.) |
| Risk Level | Low, Medium, High, or Critical |
| Protocol | Underlying transport (HTTPS, QUIC, UDP, etc.) |
| Description | Brief summary of the application's purpose |

Use the search bar to filter by name. Use the **Category** and **Risk Level** dropdowns to filter the table. Results update instantly as you type.

## Application Categories

| Category | Risk Level Range | Examples |
|----------|-----------------|---------|
| Streaming | Low – Medium | YouTube, Netflix, Twitch, Hotstar, JioTV |
| Social Media | Low – Medium | Facebook, Instagram, WhatsApp, Telegram, Snapchat |
| Productivity | Low | Microsoft 365, Google Workspace, Zoom, Slack, Teams |
| P2P | Medium – High | BitTorrent, uTorrent, eMule, Ares |
| Gaming | Low – Medium | Steam, Xbox Live, PlayStation Network, Battle.net |
| VPN & Tunneling | Medium – High | OpenVPN, WireGuard, Shadowsocks, Psiphon |
| Security Risk | High – Critical | TOR exit nodes, known command-and-control (C2) endpoints, coin miners |
| Cloud Storage | Low | Dropbox, Google Drive, OneDrive, Box |
| General Web | Low | HTTP/HTTPS traffic not matched to a specific signature |

## Risk Levels

| Level | Meaning | Recommended Action |
|-------|---------|-------------------|
| **Low** | Standard business or consumer application | No action needed |
| **Medium** | High bandwidth or dual-use application | Consider bandwidth limits or time-based policies |
| **High** | Evasion tools or policy violation risk | Block or redirect to limited WAN link |
| **Critical** | Known malicious or C2 traffic | Block immediately; investigate source devices |

## Custom Application Groups

Application groups let you bundle multiple applications together for use in a single policy rule. For example, create a "Social Media" group containing Facebook, Instagram, YouTube Shorts, and TikTok, then apply a single bandwidth cap to all of them.

### Creating an App Group

1. Navigate to **Application Intelligence > Applications**.
2. Click **App Groups** (tab at top of page).
3. Click **Add Group**.
4. Enter a **Group Name** (e.g., "High Bandwidth Streaming").
5. In the **Applications** field, search and select the applications to include.
6. Click **Save**.

### Using App Groups in Policies

After creating an app group, reference it when building policies:

- **QoS Rules** — Navigate to **Policy Engine > QoS Config** and select the app group in the **Application** field.
- **Traffic Steering** — Navigate to **Policy Engine > Steering Policy** and use the app group as a match condition to route specific traffic over preferred WAN links.

Changes take effect on the next deployment to affected devices.

## Signature Updates

The application signature database is updated automatically when the controller has internet connectivity. Updates run in the background and do not interrupt existing DPI collection.

To check signature status:

1. Navigate to **Application Intelligence > Applications**.
2. The signature version and last update timestamp are displayed in the header bar.
3. To trigger a manual update, click **Update Signatures**.

!!! note
    Signature updates do not require a device restart or configuration push. The updated signatures are distributed to routers the next time they check in with the controller (typically within 1 hour).

## Identifying Unknown Applications

If you see "Unknown" applications appearing in **Traffic Analysis**, those flows did not match any signature. Common causes:

- A new application or application update changed its traffic fingerprint.
- The traffic uses a proprietary protocol with no public signature.
- The traffic is genuinely unclassified (raw DNS, ICMP, ARP overhead, etc.).

To investigate:

1. Click **Unknown** in the application table.
2. Review the source IPs and destination IPs in the drill-down panel.
3. If the traffic is from a known internal application, contact Nexapp support to add a custom signature.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| App group not appearing in policy builder | Group was just created; cache not refreshed | Reload the policy page or wait 30 seconds |
| Many applications showing as Unknown | Signature database is outdated | Click **Update Signatures** and wait for completion |
| Risk level seems wrong for an application | Signature metadata mismatch | Report via the feedback icon next to the application row |
| App group appears empty after creation | Applications not saved correctly | Re-open the group and verify the applications list; re-save |

!!! info "See Also"
    - [Traffic Analysis](traffic-analysis.md) — View bandwidth usage by application and category
    - [Alerts](alerts.md) — Alert when a specific application exceeds a threshold
    - [Global Policies](../06-policies/overview.md) — Use app groups in QoS and steering policies
