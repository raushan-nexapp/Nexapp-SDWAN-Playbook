# SSL Inspection

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

SSL Inspection enables your NexappOS router to inspect encrypted HTTPS traffic passing through the network. It operates as a web gateway proxy that can decrypt, scan, and re-encrypt TLS connections, allowing security features like antivirus scanning, web filtering, and content logging to work on encrypted traffic. The gateway also provides caching, access logging, and bypass lists for exempted domains.

## Prerequisites

- Administrator access to the NexappOS web UI.
- If using deep SSL inspection, you must distribute the router's CA certificate to all client devices on the network.

## Configuration

Navigate to **Security > SSL Inspection**.

The page has five tabs: **Settings**, **Antivirus**, **Bypass List**, **Statistics**, and **Access Log**.

### Settings Tab

| Field | Description | Default |
|---|---|---|
| **Gateway Service** | Toggle the web gateway proxy on or off. | Off |
| **SSL Inspection Mode** | **None** -- no TLS interception. **Certificate** -- validates server certificates without decryption. **Deep** -- full man-in-the-middle inspection (decrypts and re-encrypts traffic). | None |
| **HTTP Port** | The proxy listening port for HTTP traffic. | `3128` |
| **HTTPS Port** | The proxy listening port for HTTPS traffic. | `3129` |
| **Proxy Cache** | Toggle caching of web content. | On |
| **Cache Size (MB)** | Maximum disk space for cached content. | `256` |
| **Proxy Mode** | **Transparent** -- intercepts traffic automatically. **Explicit** -- clients must configure proxy settings. | Transparent |
| **Scan Overlay Traffic** | Scan traffic from SD-WAN overlay tunnels. | On |

!!! warning
    Deep SSL inspection requires distributing the router's CA certificate to all network clients. Without it, browsers will display certificate warnings on every HTTPS site.

**CA Certificate:** When SSL inspection is set to **Certificate** or **Deep**, a CA Certificate section appears showing the certificate subject, expiry date, and fingerprint. Click **Download CA Certificate** to download the PEM file for distribution to clients.

!!! note
    A warning appears if the CA certificate expires within 30 days or has already expired. Regenerate the certificate before it expires to avoid service interruption.

Click **Save** to apply settings. The status badge in the header shows whether the gateway is **Running**, **Enabled (Not Running)**, or **Disabled**.

### Antivirus Tab

This tab controls the ICAP-based antivirus scanner integrated with the gateway proxy. See [Antivirus -- Gateway Scanning](antivirus.md) for details on configuring HTTP/SMTP scanning, archive handling, and viewing scan statistics.

### Bypass List Tab

Domains or IP addresses added to the bypass list are exempt from SSL inspection and proxy caching.

1. Enter a domain (e.g., `bank.example.com`) or IP address in the input field.
2. Click **Add**.
3. The entry appears in the bypass table.

To remove an entry, click **Delete** next to it.

!!! tip
    Add financial, healthcare, and certificate-pinned applications to the bypass list to prevent connectivity issues with deep SSL inspection.

### Statistics Tab

View proxy performance metrics:

| Metric | Description |
|---|---|
| **Total Requests** | Number of HTTP/HTTPS requests processed. |
| **Cache Hit Ratio** | Percentage of requests served from cache. |
| **Cache Hits / Misses** | Breakdown of cache performance. |
| **Cache Size Used** | Disk space consumed by cached content. |

Click **Refresh** to update the counters. Click **Clear Cache** to purge all cached content.

### Access Log Tab

View recent proxy activity including top visited URLs, top client IPs, and a detailed request log showing client, HTTP method, URL, result (HIT, MISS, DENIED), and response size.

## Verification

1. After enabling the gateway, confirm the status badge shows **Running**.
2. From a client device, visit an HTTPS website and verify the connection is proxied (the certificate issuer should show the NexappOS CA if deep inspection is active).
3. Add a domain to the bypass list and confirm that domain's certificate is the original server certificate, not the proxy CA.
4. Check the **Statistics** tab to confirm requests are being tracked.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Browser shows certificate warnings on all HTTPS sites | The CA certificate is not installed on the client device. | Download the CA certificate and install it in the client's trusted root certificate store. |
| Status shows "Enabled (Not Running)" | The proxy service failed to start, often due to a port conflict. | Verify ports `3128` and `3129` are not used by another service. Check system logs for errors. |
| Specific website does not load through the proxy | The site uses certificate pinning and rejects the proxy CA. | Add the domain to the **Bypass List**. |
| Cache hit ratio is 0% | Caching is disabled or the cache size is too small. | Enable **Proxy Cache** and set a sufficient cache size (at least `256` MB). |

## See Also

- [Antivirus](antivirus.md)
- [Web Filter](web-filter.md)
- [Threat Shield DNS](threat-shield-dns.md)
