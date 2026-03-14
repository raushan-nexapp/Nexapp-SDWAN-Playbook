# Dynamic DNS

!!! note "Standalone & Controller-Managed"
    Dynamic DNS is available in both standalone and controller-managed modes.

## Overview

Dynamic DNS (DDNS) automatically updates a DNS hostname whenever your router's public IP
address changes. This is essential when your ISP assigns dynamic IP addresses, because it
lets you reach your router, VPN endpoints, or hosted services by a consistent domain name
instead of a changing IP address.

NexappOS supports 80+ DDNS providers out of the box, including Cloudflare, No-IP, DuckDNS,
DynDNS, Google Domains, Namecheap, and many others.

Navigate to **Network > Dynamic DNS** in the web UI.

## Prerequisites

- A registered domain or hostname with a supported DDNS provider.
- Valid credentials (username/password or API token) for your DDNS provider account.
- At least one active WAN interface on the router.

## Configuration

### Adding a DDNS Service

1. Click **Add Service**.
2. Fill in the service details:

| Field | Description | Example |
|-------|-------------|---------|
| **Service Name** | A unique identifier for this entry. Letters, numbers, and underscores only. | `my_cloudflare` |
| **Provider** | Select your DDNS provider from the dropdown. You can type to search. | `cloudflare.com` |
| **Domain / Hostname** | The fully qualified domain name to update. | `router.example.com` |
| **Username / Email** | Your provider account username or email. Some providers use an API token here instead. | `user@example.com` |
| **Password / API Token** | Your provider password or API token. | (hidden) |

3. Configure network settings:

| Field | Description | Default |
|-------|-------------|---------|
| **WAN Interface** | Which WAN interface to monitor for IP changes. | `wan` |
| **IP Source** | How the router detects its public IP. Options: Network (from the interface), Web (from an external service), Interface, or Script. | Network |
| **Use IPv6** | Enable to update AAAA records instead of A records. | Off |
| **Use HTTPS** | Enable to communicate with the DDNS provider over HTTPS. | Off |

4. Configure update timing:

| Field | Description | Range | Default |
|-------|-------------|-------|---------|
| **Check Interval** | How often to check whether the IP address has changed. | 1 -- 1440 minutes | 10 minutes |
| **Force Interval** | Force a DNS update even if the IP has not changed, to prevent the provider from expiring your hostname. | 1 -- 720 hours | 72 hours |

5. Click **Save**.

### Editing a Service

1. Click the **Edit** (pencil) icon next to the service.
2. Modify the desired fields. The password field shows "(unchanged)" -- leave it blank
   to keep the existing password, or enter a new value to change it.
3. Click **Save**.

### Enabling and Disabling a Service

You can temporarily disable a DDNS service without deleting it:

- Click the **Toggle** icon next to the service. A green toggle means the service is
  active; a gray toggle means it is disabled.

### Forcing an Immediate Update

If you need to push a DNS update right away (for example, after a provider credential
change):

1. Click the **Refresh** (rotate) icon next to an enabled service.
2. The icon spins while the update is in progress.
3. Check the **Last IP** column to confirm the update succeeded.

### Deleting a Service

1. Click the **Delete** (trash) icon next to the service.
2. Confirm the deletion in the dialog.

## Verification

After saving a DDNS service, verify that it is working:

1. Check the **Status** column in the service table:
    - **Active** (green) — The service is running and updating successfully.
    - **Stopped** (yellow) — The service is enabled but not currently running.
    - **Disabled** (gray) — The service has been turned off.
2. Check the **Last IP** column — it should display your current public IP address.
3. From an external machine, run a DNS lookup to confirm the hostname resolves:
   ```
   nslookup router.example.com
   ```
4. The resolved IP should match the value shown in the **Last IP** column.

!!! tip "Status Refresh"
    The status display refreshes automatically every 15 seconds. You do not need to
    reload the page.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Status shows "Stopped" | Invalid credentials or provider configuration | Edit the service and verify your username, password/API token, and domain are correct. Check your provider's dashboard for any account issues. |
| Last IP is blank | The service has not completed its first update | Wait for the check interval to elapse, or click the Force Update button. |
| Last IP shows wrong address | IP Source is set incorrectly | Edit the service and change **IP Source** to "Web (External)" to detect your public IP via an external service, rather than reading it from the local interface. |
| Provider not in the dropdown | Provider may use a different listing name | Type the provider name in the search box. Some providers are listed under their API endpoint (e.g., `cloudflare.com-v4`). |
| Updates fail with IPv6 | IPv6 is enabled but the provider does not support AAAA records | Disable the **Use IPv6** toggle, or verify that your provider account supports IPv6 DNS records. |
| Hostname expires at the provider | Force interval is too long | Reduce the **Force Interval** to 24 hours. Many free DDNS providers expire hostnames after 30 days of inactivity. |

!!! info "See Also"
    - [DNS & DHCP](dns-dhcp.md) — Configure local DNS resolution and DHCP server settings.
    - [Interfaces](interfaces.md) — Configure WAN interfaces monitored by DDNS.
    - [Certificates](../03-system/certificates.md) — Manage SSL/TLS certificates for HTTPS-accessible services.
