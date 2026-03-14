# InstaShield IP (IP Threat Protection)

!!! note "Standalone & Controller-Managed"
    InstaShield IP runs locally on the router using downloaded blocklists. When controller-managed, blocklist sources and update schedules can be pushed from the controller.

## Overview

InstaShield IP provides IP-based threat protection by blocking traffic to and from known malicious IP addresses. It uses community-maintained blocklists (such as abuse.ch and emerging threats feeds) to automatically identify and block connections to command-and-control servers, botnets, and other threat infrastructure. You can also block traffic by country using GeoIP filtering.

Navigate to **Security > InstaShield IP** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router has internet connectivity to download blocklist updates.
- DNS resolution is working on the router.

## Configuration

The page is organized into six tabs: **Blocklist**, **Allowlist**, **Local Blocklist**, **Banned IPs**, **Geo-IP Blocking**, and **Settings**.

### Settings

1. Navigate to the **Settings** tab.
2. Toggle InstaShield IP to **Enabled**.
3. Configure the update schedule (how often blocklists are refreshed from their sources).
4. Click **Save**.

| Field | Description |
|-------|-------------|
| **Enabled** | Turn IP threat protection on or off. |
| **Update Schedule** | How frequently the router downloads updated blocklists (e.g., every 6 hours). |

### Blocklist Sources

The **Blocklist** tab displays external blocklist feeds. Each feed has a name, description, and enable/disable toggle. Common feeds include:

- **abuse.ch** -- Malware and botnet IP addresses
- **Emerging Threats** -- Known exploit and attack sources
- **Spamhaus DROP** -- Hijacked IP ranges

Toggle individual feeds on or off based on your security requirements.

### Allowlist

The **Allowlist** tab lets you exempt specific IP addresses from blocking. If a legitimate service is incorrectly blocked by a feed, add its IP address here.

1. Navigate to the **Allowlist** tab.
2. Click **Add**.
3. Enter the IP address and an optional description.
4. Click **Save**.

### Banned IPs

The **Banned IPs** tab shows all IP addresses currently blocked by InstaShield IP. You can search this list to check whether a specific IP is being blocked and which blocklist feed flagged it.

### Geo-IP Blocking

Geo-IP blocking lets you block all traffic to or from specific countries.

1. Navigate to the **Geo-IP Blocking** tab.
2. Select the countries you want to block.
3. Click **Save**.

!!! warning
    Geo-IP blocking affects all traffic, including legitimate services hosted in the selected countries. Use this feature carefully and monitor the Banned IPs list after enabling it.

### Local Blocklist

The **Local Blocklist** tab lets you manually add IP addresses to block, independent of any external feed.

1. Navigate to the **Local Blocklist** tab.
2. Click **Add**.
3. Enter the IP address and an optional description.
4. Click **Save**.

## Verification

1. Enable InstaShield IP and at least one blocklist feed.
2. Wait for the initial blocklist download to complete (check the Settings tab for the last update timestamp).
3. Navigate to the **Banned IPs** tab and confirm entries are populated.
4. Attempt to reach a known blocked IP from a LAN device and verify the connection is refused.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Legitimate traffic blocked | IP address appears on a community blocklist | Add the IP to the **Allowlist** tab to exempt it from blocking. |
| Blocklists not updating | No internet connectivity or DNS failure on the router | Verify the router can reach the internet. Check DNS settings under **Network > DNS & DHCP**. |
| Geo-IP not blocking expected country | GeoIP database not yet downloaded or country not selected | Confirm the country is selected and wait for the GeoIP database to download. |
| High memory usage | Too many blocklist feeds enabled simultaneously | Disable feeds you do not need. Each feed consumes memory proportional to its size. |

!!! info "See Also"
    - [InstaShield DNS](threat-shield-dns.md) -- DNS-level threat protection
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Network-level traffic filtering
