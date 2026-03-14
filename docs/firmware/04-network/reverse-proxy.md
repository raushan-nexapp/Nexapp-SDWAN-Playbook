# Reverse Proxy

!!! note "Standalone & Controller-Managed"
    Reverse Proxy is available in both standalone and controller-managed modes.

## Overview

The reverse proxy feature lets you expose internal web services through the router
without opening individual ports for each service. Incoming HTTPS requests to the
router are forwarded to internal servers based on URL path or domain name.

Common use cases include:

- Exposing an internal web application (e.g., `http://192.168.1.50:8080`) at a
  public URL path like `/myapp`.
- Hosting multiple services behind a single public IP using domain-based routing.
- Terminating SSL/TLS at the router so internal servers can run plain HTTP.
- Restricting access to specific source networks.

Navigate to **Network > Reverse Proxy** in the web UI.

## Prerequisites

- The internal service you want to proxy must be running and accessible from the
  router's LAN interface.
- For domain-based proxies, you need a DNS record (or Dynamic DNS entry) pointing
  your domain to the router's public IP.
- For domain-based proxies with custom certificates, upload the certificate under
  **System > Certificates** first.
- Port 443 (HTTPS) must be open in the firewall for incoming traffic.

!!! warning "Firewall Port"
    If port 443 is not open, the web UI displays a warning banner with a direct link
    to the firewall settings. Click **Open Firewall Settings** to create the necessary
    input rule.

## Configuration

### Choosing a Proxy Type

You can create two types of reverse proxy entries:

| Type | When to Use | Example |
|------|-------------|---------|
| **Path** | You want to route traffic based on the URL path. All domains share the same certificate. | `https://192.0.2.1/grafana` forwards to `http://192.168.1.50:3000` |
| **Domain** | You want to route traffic based on the hostname. Each domain can use its own certificate. | `https://app.example.com` forwards to `http://192.168.1.60:8080` |

### Adding a Path-Based Proxy

1. Click **Add Reverse Proxy**.
2. Select **Path** as the type.
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Path** | The URL path to match. Must start with `/`. | `/grafana` |
| **Destination URL** | The full URL of the internal service, including port. | `http://192.168.1.50:3000` |
| **Description** | A human-readable label for this entry. | `Grafana Dashboard` |

4. Optionally, restrict access by adding **Allowed Networks** (see below).
5. Click **Add Reverse Proxy** to save.

### Adding a Domain-Based Proxy

1. Click **Add Reverse Proxy**.
2. Select **Domain** as the type.
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Domain** | The fully qualified domain name to match. | `app.example.com` |
| **Certificate** | The TLS certificate to use for this domain. Select "Default certificate" to use the router's built-in certificate, or choose a custom certificate you uploaded previously. | `Default certificate` |
| **Destination URL** | The full URL of the internal service. | `http://192.168.1.60:8080` |
| **Description** | A human-readable label. | `Customer Portal` |

4. Optionally, restrict access by adding **Allowed Networks**.
5. Click **Add Reverse Proxy** to save.

!!! tip "Custom Certificates"
    If only the default certificate is available, a warning appears with a link to
    **System > Certificates** where you can upload your own certificate.

### Restricting Access by Network

You can limit which source networks are allowed to reach a proxied service:

1. While creating or editing a proxy entry, click **Add CIDR Network** under
   **Allowed Networks**.
2. Enter a network in CIDR notation (e.g., `192.0.2.0/24`).
3. Add additional networks as needed.
4. If no allowed networks are specified, the proxy is accessible from any source.

### Editing a Proxy

1. Click the **Edit** icon next to the proxy entry.
2. Modify the desired fields. Note that the **Type** and **Domain** fields cannot be
   changed after creation -- delete and recreate the entry if you need to change them.
3. Click **Save**.

### Deleting a Proxy

1. Click the **Delete** icon next to the proxy entry.
2. Confirm the deletion in the dialog.

## Verification

After creating a reverse proxy entry, verify that it is working:

1. **Path-based proxy**: Open a browser and navigate to
   `https://<router-public-ip>/<path>` (e.g., `https://192.0.2.1/grafana`).
   You should see the internal application.

2. **Domain-based proxy**: Ensure DNS for your domain points to the router's public
   IP, then navigate to `https://app.example.com`. You should see the internal
   application with the correct TLS certificate.

3. **Access restriction**: If you configured Allowed Networks, try accessing the
   proxy from a network that is not in the allowed list. The request should be
   blocked.

4. Check that the internal service is reachable from the router itself by opening
   an SSH session and running:
   ```
   curl -s http://192.168.1.50:3000
   ```

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| "Port not open" warning appears on the page | Port 443 is not open in the firewall for incoming connections | Click **Open Firewall Settings** on the warning banner, or go to **Firewall > Rules** and create an input rule allowing TCP port 443 on the WAN zone. |
| Browser shows "Connection refused" | Firewall is blocking traffic, or the reverse proxy service is not running | Verify the firewall input rule for port 443 exists. Reboot the router if the issue persists. |
| Browser shows "502 Bad Gateway" | The internal destination service is not running or the URL is incorrect | Verify the **Destination URL** is correct and that the internal service is accessible from the router's LAN. |
| Certificate warning in browser | Using the default self-signed certificate | Upload a valid TLS certificate under **System > Certificates** and assign it to the domain-based proxy entry. |
| Domain-based proxy returns the wrong site | DNS is not pointing to the router, or the domain does not match | Verify your DNS A record points to the router's public IP. Ensure the **Domain** field exactly matches the hostname in the browser. |
| Access denied from an allowed network | CIDR notation is incorrect | Verify the CIDR network is entered correctly (e.g., `192.0.2.0/24`, not `192.0.2.0/255.255.255.0`). |

!!! info "See Also"
    - [Certificates](../03-system/certificates.md) — Upload and manage TLS certificates.
    - [Firewall Rules](../10-firewall/rules.md) — Configure input rules to allow traffic on port 443.
    - [Dynamic DNS](ddns.md) — Set up a domain name that tracks your public IP for domain-based proxies.
    - [Port Forwarding](../10-firewall/port-forwarding.md) — An alternative for exposing non-HTTP services.
