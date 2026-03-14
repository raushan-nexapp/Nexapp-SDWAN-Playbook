# App Categories

## Overview

Application categories group related applications under a common label. The DPI engine uses categories to classify traffic at a higher level than individual application names, enabling coarse-grained policy enforcement and reporting.

Navigate to **Application Intelligence > App Categories** in the controller sidebar.

---

## Built-in Categories

| Category | Example Applications |
|----------|---------------------|
| **Streaming** | YouTube, Netflix, Twitch, Spotify |
| **Social Media** | Facebook, Instagram, TikTok, WhatsApp |
| **Productivity** | Microsoft 365, Google Workspace, Zoom, Teams |
| **P2P** | BitTorrent, eMule, uTorrent |
| **Gaming** | Steam, PlayStation Network, Xbox Live |
| **Security Risk** | Known C2 traffic, malware beacons |
| **VoIP** | SIP, H.323, Skype audio |
| **Cloud Storage** | Dropbox, Google Drive, OneDrive |
| **Web Browsing** | HTTP/HTTPS general traffic |
| **Email** | SMTP, IMAP, Exchange |

---

## Viewing Categories

1. Navigate to **Application Intelligence > App Categories**
2. The list shows: **Category Name | Application Count | Risk Level | Description**
3. Click a category to see all applications it contains

---

## Using Categories in Policies

Categories are referenced in:

- **QoS policies** — apply bandwidth limits per category (e.g., limit Streaming to 10 Mbps)
- **Steering policies** — route specific categories over preferred WAN paths
- **DPI alerts** — trigger alerts when a category exceeds a threshold
- **App Groups** — combine multiple categories into a custom group for bulk policy

---

## Custom Categories

Custom categories can be created to group applications according to your organization's classification:

1. Navigate to **Application Intelligence > App Categories**
2. Click **Add Category**
3. Set **Name**, **Description**, and **Risk Level**
4. Assign applications to the category from the **Applications** section

---

## See Also

- [Applications](app-intelligence.md)
- [App Groups](app-groups.md)
- [Alerts & Anomalies](alerts.md)
- [QoS Config](../06-policies/qos.md)
