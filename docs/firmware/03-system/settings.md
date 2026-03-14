# System Settings

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

System Settings lets you configure your router's identity (hostname and description), time zone, NTP synchronization, and outbound email (SMTP) for alert notifications. These settings are organized into three tabs: General Settings, Time Synchronization, and SMTP Configuration.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For NTP: your router has outbound internet access on UDP port 123.
- For SMTP: you have the SMTP server address, port, and credentials from your email provider.

## Configuration

### General Settings

1. Navigate to **System > System Settings**.
2. You are on the **General Settings** tab by default.
3. Configure the following fields:

| Field | Description | Required |
|---|---|---|
| **Hostname** | A unique name for this router (letters, digits, hyphens only). | Yes |
| **Short Description** | A brief label to identify this device (e.g., "Branch Office LA"). | No |
| **Notes** | Free-form notes for your reference. | No |
| **Timezone** | Select your local time zone from the dropdown. The list includes all standard IANA time zones. | Yes |

4. The **Local Time** field displays the router's current clock. You can click **Sync with NTP Server** to immediately synchronize the clock.
5. Click **Save** to apply your changes.

!!! warning "Default Hostname"
    If the hostname is still set to the factory default, a warning banner appears prompting you to change it. You should set a unique hostname before registering with a controller.

### Time Synchronization

1. Click the **Time Synchronization** tab.
2. Configure the NTP client:

| Setting | Description |
|---|---|
| **Enable NTP Client** | Toggle on to keep the router's clock synchronized automatically. |
| **Provide NTP Server** | Toggle on to make this router act as an NTP server for LAN clients. |
| **Provide NTP Server to Interface** | When NTP server is enabled, select which interface serves NTP (default: all interfaces). |
| **Use DHCP Advertised Servers** | When checked, the router also uses NTP servers provided by your ISP via DHCP. |

3. Under **NTP Server Candidates**, add one or more NTP server hostnames or IP addresses (e.g., `pool.ntp.org`, `time.google.com`). Click **Add NTP Server** to add additional entries.
4. Click **Save** to apply.

### SMTP Configuration

1. Click the **SMTP Configuration** tab.
2. Configure the outbound email relay:

| Field | Description |
|---|---|
| **SMTP Host** | Your mail server address (e.g., `smtp.gmail.com`). |
| **Port** | SMTP port: 25 (SMTP), 465 (SMTPS), 587 (Submission), or 2525 (Alternate). |
| **Sender Address** | The "From" address for outgoing emails (e.g., `no-reply@example.com`). |
| **Encryption** | Toggle TLS on or off. When enabled, choose STARTTLS or implicit TLS/SSL. |
| **Authentication** | Toggle on if your SMTP server requires credentials. |
| **Username / Password** | Your SMTP login credentials (visible only when authentication is enabled). |

3. Click **Save** to store the SMTP configuration.
4. To verify, scroll down to **Send Test Email**, enter a recipient address, and click **Send Test**. A success or failure notification appears.

## Verification

1. After saving General Settings, navigate to **Dashboard** and confirm the hostname displays your new value.
2. After saving NTP settings, return to the General Settings tab and verify the **Local Time** is accurate.
3. After saving SMTP settings, send a test email and confirm it arrives in the recipient's inbox.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Cannot save configuration" error | A validation error or network timeout occurred. | Check that the hostname contains only valid characters and the timezone is selected. Retry the save. |
| Clock is incorrect after saving NTP settings | NTP servers may be unreachable. | Verify outbound UDP port 123 is not blocked by your firewall. Try a different NTP server (e.g., `time.google.com`). |
| Test email fails | Incorrect SMTP credentials, blocked port, or TLS mismatch. | Verify the SMTP host, port, and credentials. Ensure your firewall allows outbound traffic on the configured port. Try toggling between STARTTLS and implicit TLS. |
| "Default hostname" warning persists | You have not yet changed the factory hostname. | Enter a unique hostname in the General Settings tab and click Save. |
