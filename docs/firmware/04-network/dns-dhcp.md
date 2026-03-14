# DNS & DHCP

!!! note "Standalone & Controller-Managed"
    This feature is available in both standalone and controller-managed modes. In controller-managed mode, DHCP and DNS settings may be pushed from the controller.

## Overview

The **DNS & DHCP** page lets you manage the built-in DNS forwarder and DHCP server on your NexappOS router. You can configure DHCP address pools for each LAN interface, reserve fixed IPs for specific devices, create local DNS records, and set upstream DNS forwarding servers.

Navigate to **Network > DNS & DHCP** to access this page. The page is organized into six tabs:

| Tab | Purpose |
|-----|---------|
| **DHCP** | Enable and configure the DHCP server per interface |
| **Static Leases** | Reserve fixed IP addresses for devices by MAC address |
| **Dynamic Leases** | View currently active DHCP leases |
| **DNS** | Configure upstream DNS servers, local domain, and query logging |
| **DNS Records** | Create local hostname-to-IP mappings |
| **Scan Network** | Discover devices on your local network |

## Prerequisites

- You have at least one LAN-zone interface configured with a static IP address.
- You know the IP range you want to assign to DHCP clients.
- If using custom DNS servers, you have the server IP addresses ready.

## DHCP Server Configuration

The DHCP tab displays a card for each interface that has DHCP capability. You can enable or disable the DHCP server independently on each interface.

### Enabling DHCP on an Interface

1. Open the **DHCP** tab.
2. Click **Edit** on the interface card (e.g., `lan`).
3. Toggle **Enabled** to on.
4. Select the **Mode**:
    - **Server** -- The router acts as the DHCP server and assigns addresses from a local pool.
    - **Relay** -- The router forwards DHCP requests to an external DHCP server.

### Server Mode Settings

| Field | Description | Example |
|-------|-------------|---------|
| **Range IP Start** | First address in the DHCP pool | `192.168.1.100` |
| **Range IP End** | Last address in the DHCP pool | `192.168.1.200` |
| **Lease Time** | How long a client keeps its assigned address | `12h` (12 hours), `7d` (7 days) |

!!! tip "Lease Time Format"
    You can specify lease time in minutes (`30m`), hours (`12h`), days (`7d`), or as `infinite` for permanent leases. Short lease times are better for guest networks; longer times suit office LANs.

### Relay Mode Settings

| Field | Description | Example |
|-------|-------------|---------|
| **Local Address** | The IP address of this router on the relay interface | `192.168.1.1` |
| **Server Address** | The IP address of the upstream DHCP server | `192.168.1.254` |

### MAC-IP Binding

You can enforce MAC-to-IP binding on a per-interface basis to prevent IP spoofing:

1. In the DHCP edit drawer, toggle **MAC-IP Binding** to on.
2. Select the binding type:
    - **Soft Binding** -- Logs violations but still allows connectivity.
    - **Strict Binding** -- Blocks traffic from devices using an IP address that does not match their registered MAC address.

### Advanced DHCP Options

Click **Advanced Settings** to access additional options:

- **Force Start** -- Start the DHCP server even if the interface has no active clients. Recommended to leave enabled.
- **DHCP Options** -- Add custom DHCP options (e.g., option 66 for TFTP server, option 150 for VoIP provisioning). Select the option number from the dropdown and enter the value.

## Static Leases (DHCP Reservations)

Static leases guarantee that a specific device always receives the same IP address from the DHCP server.

### Creating a Static Lease

1. Open the **Static Leases** tab.
2. Click **Add Reservation**.
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Hostname** | A friendly name for the device | `printer-floor2` |
| **MAC Address** | The device's hardware address | `AA:BB:CC:DD:EE:FF` |
| **IP Address** | The fixed IP to assign | `192.168.1.50` |
| **Description** | Optional note about this reservation | `HP LaserJet, 2nd floor` |

4. Click **Save**.

!!! warning
    The reserved IP address must fall within the subnet of the interface but should ideally be **outside** the DHCP dynamic range to avoid conflicts.

### Filtering and Managing Leases

- Use the **search box** to filter leases by hostname, IP, MAC, or description.
- Use the **Interface filter** dropdown to show leases for a specific interface.
- Click the **edit** icon on a lease row to modify it, or the **delete** icon to remove it.

### Importing from Dynamic Leases or Network Scan

You can convert a dynamic lease or a discovered device into a static reservation:

1. Open the **Dynamic Leases** or **Scan Network** tab.
2. Find the device you want to reserve.
3. Click the import/add button on that device's row.
4. The static lease form opens pre-filled with the device's hostname, MAC, and IP.
5. Review the values and click **Save**.

## DNS Configuration

The **DNS** tab controls the router's built-in DNS forwarder.

### Configuring DNS Settings

1. Open the **DNS** tab.
2. Configure the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| **DNS Forwarding Servers** | Upstream DNS servers that the router queries for external names | `8.8.8.8`, `1.1.1.1` |
| **DNS Domain** | The local domain name appended to unqualified hostnames | `lan`, `office.local` |
| **Log DNS Queries** | Toggle to enable logging of all DNS queries for debugging | Off (default) |

3. Click **Save** to apply.

!!! tip
    You can add multiple forwarding servers. The router queries them in order and falls back to the next server if the first is unreachable.

## DNS Records

DNS records let you create local hostname-to-IP mappings. Devices on your network can resolve these names without an external DNS server.

### Adding a DNS Record

1. Open the **DNS Records** tab.
2. Click **Add DNS Record**.
3. Fill in the fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Hostname** | The name clients will resolve | `nas.office.local` |
| **IP Address** | The IP address the hostname resolves to | `192.168.1.10` |
| **Name** | Optional description for this record | `Network storage` |
| **Wildcard** | Toggle on to match all subdomains (e.g., `*.office.local`) | Off (default) |

4. Click **Save**.

!!! tip "Wildcard Records"
    When you enable the wildcard option, any subdomain of the hostname also resolves to the specified IP. For example, if you create a wildcard record for `app.local` pointing to `192.168.1.20`, then `api.app.local`, `www.app.local`, and any other subdomain will all resolve to `192.168.1.20`.

## Network Scan

The **Scan Network** tab lets you discover devices on your local network segments. You can use scan results to quickly create static leases or DNS records for discovered devices.

## Verification

After configuring DNS and DHCP:

1. **DHCP** -- Connect a client device to the LAN interface and verify it receives an IP in the configured range. Check the **Dynamic Leases** tab to confirm the lease appears.
2. **Static lease** -- Disconnect and reconnect the reserved device. Confirm it receives the reserved IP address.
3. **DNS forwarding** -- From a client device, run `nslookup google.com` and verify it resolves using your configured upstream servers.
4. **DNS records** -- From a client device, resolve a locally defined hostname (e.g., `nslookup nas.office.local`) and verify it returns the correct IP.

## Troubleshooting

| Symptom | Possible Cause | Resolution |
|---------|---------------|------------|
| Client gets no IP address | DHCP server disabled on the interface, or IP range exhausted | Open the DHCP tab and verify the server is enabled. Expand the range or reduce lease time. |
| Client gets wrong IP despite static lease | MAC address mismatch, or another DHCP server on the network | Double-check the MAC address. Use the Dynamic Leases tab to identify rogue DHCP servers. |
| DNS queries time out | Upstream DNS servers unreachable, or firewall blocking port 53 | Verify the forwarding server IPs are correct. Check WAN connectivity. |
| Local DNS record not resolving | Client using a DNS server other than the router | Ensure the client's DNS server is set to the router's LAN IP (automatic with DHCP). |
| "Interface not found" error | The interface was renamed or deleted since DHCP was configured | Reconfigure DHCP on the current interface from the DHCP tab. |
| Lease time changes not taking effect | Existing clients retain their current lease until it expires | Wait for lease expiration, or manually release/renew on the client device. |

!!! info "See Also"
    - [Interfaces & Devices](interfaces.md) -- Configure the LAN interfaces that DHCP serves
    - [Firewall Zones & Policies](../10-firewall/zones-policies.md) -- Ensure DNS (port 53) is allowed in firewall rules
    - [Threat Shield DNS](../11-security/threat-shield-dns.md) -- DNS-based threat filtering
