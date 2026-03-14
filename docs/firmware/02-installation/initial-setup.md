# Initial Setup

After installing NexappOS and completing first boot, perform these initial configuration steps to secure the router and prepare it for your network.

!!! note "Standalone & Controller-Managed"
    Complete all steps on this page before registering with a controller.
    These local settings are preserved after controller registration.

## Step 1 — Change the Default Password

1. Log in to the web UI at `https://192.168.1.1:9090` using the default credentials (`root` / `Admin@123`).
2. Navigate to **System > SSH & Password**.
3. Enter a strong password in the **Root Password** field.
4. Re-enter the password in the **Confirm Password** field.
5. Click **Save**.

!!! danger "Security Warning"
    Never leave a router in production with the default password. Change it
    immediately after first login.

The root password is used for both the web UI and SSH access. Choose a password that is at least 12 characters long with a mix of uppercase, lowercase, numbers, and symbols.

## Step 2 — Set Hostname and Timezone

1. Navigate to **System > Settings**.
2. Set the **Hostname** to a descriptive name that identifies this router in your network (for example, `hq-gateway` or `branch-mumbai-01`).
3. Select the correct **Timezone** from the dropdown list.
4. Click **Save & Apply**.

!!! tip
    Use a consistent naming convention across all your routers. A good pattern is
    `<site>-<role>-<number>` — for example, `delhi-hub-01` or `mumbai-spoke-03`.
    This makes identification easier in the controller dashboard.

## Step 3 — Configure WAN

The WAN interface connects your router to the Internet or upstream network. NexappOS defaults to DHCP, which works if your ISP or upstream router provides addresses automatically.

To change the WAN configuration:

1. Navigate to **Network > Interfaces**.
2. Click **Edit** on the **WAN** interface.
3. Select the appropriate protocol:

**DHCP (default):**
No additional configuration needed. The router obtains an IP address, gateway, and DNS servers automatically.

**Static IP:**

| Field | Example Value |
|---|---|
| Protocol | Static address |
| IPv4 address | `192.0.2.10` |
| Netmask | `255.255.255.0` |
| Gateway | `192.0.2.1` |
| DNS servers | `8.8.8.8`, `8.8.4.4` |

**PPPoE:**

| Field | Example Value |
|---|---|
| Protocol | PPPoE |
| Username | Your ISP username |
| Password | Your ISP password |

4. Click **Save & Apply**.

### Verify WAN Connectivity

After configuring WAN, verify connectivity:

1. Navigate to **System > Dashboard**.
2. Confirm the WAN interface shows a valid IP address and "Connected" status.
3. Navigate to **Monitoring > Diagnostics** and ping an external address (for example, `8.8.8.8`).

## Step 4 — Configure LAN

The LAN interface serves your local network. The default configuration works for most deployments, but you may want to change the subnet to match your network plan.

1. Navigate to **Network > Interfaces**.
2. Click **Edit** on the **LAN** interface.
3. Adjust the following settings as needed:

| Field | Default | Description |
|---|---|---|
| IPv4 address | `192.168.1.1` | The router's LAN IP address |
| Netmask | `255.255.255.0` | Subnet mask for the LAN |
| DHCP start | `100` | First DHCP address (.100) |
| DHCP limit | `150` | Number of DHCP leases |
| Lease time | `12h` | DHCP lease duration |

4. Click **Save & Apply**.

!!! warning "Data Loss Risk"
    If you change the LAN IP address, your browser connection will drop.
    Reconnect using the new IP address: `https://<new-ip>:9090`.

## Step 5 — Verify DNS Resolution

1. Navigate to **Monitoring > Diagnostics**.
2. Run a **DNS Lookup** for a domain name (for example, `www.google.com`).
3. If the lookup succeeds, DNS is working correctly.

If DNS fails, check that your WAN interface has valid DNS servers configured, or set custom DNS servers under **Network > DNS & DHCP**.

## Summary

After completing these steps, your router is ready for production use:

| Setting | Status |
|---|---|
| Root password | Changed from default |
| Hostname | Set to a descriptive name |
| Timezone | Configured for your location |
| WAN | Connected with Internet access |
| LAN | Configured for your local subnet |
| DNS | Resolving domain names |

!!! info "See Also"
    - [Network Configuration](network-config.md) — detailed interface planning and firewall zones
    - [Controller Registration](controller-registration.md) — connect to a Nexapp SDWAN Controller
