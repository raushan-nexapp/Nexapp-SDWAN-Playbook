# InstaShield DNS (DNS Threat Protection)

!!! note "Standalone & Controller-Managed"
    InstaShield DNS runs locally on the router, intercepting DNS queries. When controller-managed, blocklist sources and bypass rules can be pushed from the controller.

## Overview

InstaShield DNS provides DNS-level threat protection by intercepting DNS queries and blocking access to known malicious domains. It prevents connections to phishing sites, malware command-and-control servers, and unwanted content categories before the connection is established. Because blocking happens at the DNS layer, it is lightweight and effective regardless of the protocol used by the application.

Navigate to **Security > InstaShield DNS** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router is serving DNS for your LAN clients (default behavior).
- The router has internet connectivity to download DNS blocklists.

## Configuration

The page is organized into five tabs: **Blocklist Sources**, **Filter Bypass**, **Allowlist**, **Local Blocklist**, and **Settings**.

### Settings

1. Navigate to the **Settings** tab.
2. Toggle InstaShield DNS to **Enabled**.
3. Click **Save**.

| Field | Description |
|-------|-------------|
| **Enabled** | Turn DNS threat filtering on or off. |

### Blocklist Sources

The **Blocklist Sources** tab lists available DNS blocklist feeds. Each feed targets a category of threats (malware domains, ad servers, tracking domains, adult content).

1. Navigate to the **Blocklist Sources** tab.
2. Toggle individual feeds on or off.
3. Click **Save** to apply changes.

### Local Blocklist

The **Local Blocklist** tab lets you manually block specific domains that are not covered by any feed.

1. Navigate to the **Local Blocklist** tab.
2. Click **Add**.
3. Enter the domain name (e.g., `malicious-site.example.com`).
4. Click **Save**.

### Allowlist

The **Allowlist** tab lets you override blocks for specific domains. If a legitimate domain is blocked by a feed, add it here to allow access.

1. Navigate to the **Allowlist** tab.
2. Click **Add**.
3. Enter the domain name to allow.
4. Click **Save**.

### Filter Bypass

The **Filter Bypass** tab lets you exempt specific devices from DNS filtering entirely. You can specify devices by MAC address or IP address.

1. Navigate to the **Filter Bypass** tab.
2. Click **Add**.
3. Enter the device MAC address or IP address.
4. Click **Save**.

!!! tip
    Use Filter Bypass sparingly. Exempted devices receive no DNS-level threat protection from InstaShield DNS.

## Verification

1. Enable InstaShield DNS and activate at least one blocklist feed.
2. From a LAN device, attempt to resolve a domain known to be on the blocklist.
3. Verify the DNS query returns a blocked response (typically `0.0.0.0` or `NXDOMAIN`).
4. Add the domain to the **Allowlist** and verify it resolves normally.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| DNS resolution slow after enabling | Large blocklist being loaded into memory | Wait 1--2 minutes for the initial blocklist load to complete. Disable unnecessary feeds to reduce load time. |
| Legitimate site blocked | Domain appears on a community blocklist feed | Add the domain to the **Allowlist** tab. |
| Bypass not working for a device | Incorrect MAC or IP address entered | Verify the device MAC/IP in the **Filter Bypass** tab matches the device's actual network address. |
| Blocklist feeds not downloading | No internet connectivity or firewall blocking outbound DNS | Check the router's internet connectivity and DNS settings. |

!!! info "See Also"
    - [InstaShield IP](threat-shield-ip.md) -- IP-level threat protection
    - [DNS & DHCP](../04-network/dns-dhcp.md) -- Configure the DNS server that InstaShield DNS hooks into
