# Web Content Filter

!!! note "Standalone Only"
    The Web Content Filter is a local filtering service. It is not managed by the controller.

## Overview

The Web Content Filter blocks access to websites by category (such as adult content, gambling, social media, or malware) or by specific URL patterns. It works by intercepting HTTP requests and matching them against categorized URL databases. You can define custom allow and block lists to fine-tune filtering for your network.

Navigate to **Security > Web Filter** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- LAN clients use the router as their DNS server and HTTP proxy (default configuration).

## Configuration

The page is organized into four tabs: **Settings**, **Categories**, **Custom Rules**, and **Statistics**.

### Settings

1. Navigate to the **Settings** tab.
2. Toggle the Web Content Filter to **Enabled**.
3. Click **Save**.

| Field | Description |
|-------|-------------|
| **Enabled** | Turn web content filtering on or off. |

### Categories

The **Categories** tab lists all available URL categories. Toggle individual categories on or off to control which types of content are blocked.

Common categories include:

- **Adult Content** -- Explicit material
- **Gambling** -- Online betting and casino sites
- **Social Media** -- Social networking platforms
- **Malware** -- Known malware distribution sites
- **Phishing** -- Fraudulent sites impersonating legitimate services
- **Streaming** -- Video and audio streaming platforms

1. Navigate to the **Categories** tab.
2. Toggle the categories you want to block.
3. Click **Save**.

### Custom Rules

The **Custom Rules** tab lets you add specific URLs or domains to a custom allow list or block list, overriding category-based decisions.

1. Navigate to the **Custom Rules** tab.
2. Click **Add Rule**.
3. Enter the URL or domain pattern.
4. Select the action: **Allow** or **Block**.
5. Click **Save**.

!!! tip
    Use custom allow rules to unblock specific sites within a blocked category. For example, block the "Social Media" category but allow `linkedin.com` for business use.

### Statistics

The **Statistics** tab displays filtering activity: number of requests processed, requests blocked, and top blocked categories. Use this data to evaluate whether your filtering policy is too strict or too permissive.

## Verification

1. Enable the Web Content Filter and block at least one category.
2. From a LAN device, attempt to access a website in the blocked category.
3. Verify the browser displays a block page or the connection is refused.
4. Add the site to the custom allow list and verify access is restored.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| HTTPS sites not blocked | Web filter cannot inspect encrypted traffic without proxy | Enable the HTTPS filtering option if available, or use InstaShield DNS for domain-level blocking. |
| Site miscategorized | URL database assigns the wrong category to a domain | Add the site to the custom allow or block list to override the category. |
| Bypass not working | Client is using a DNS server other than the router | Ensure LAN clients use the router as their DNS server. Check DHCP settings. |
| Block page not displayed | Browser uses DNS-over-HTTPS (DoH) bypassing the router's DNS | Disable DoH in the client browser or block DoH endpoints at the firewall level. |

!!! info "See Also"
    - [InstaShield DNS](threat-shield-dns.md) -- DNS-level content blocking (works with HTTPS)
    - [DPI Engine](dpi.md) -- Application-level traffic classification
