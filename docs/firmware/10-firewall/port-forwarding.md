# Port Forwarding

Port forwarding allows you to make services running on internal servers accessible from the Internet. When an external client sends traffic to a specific port on your router's WAN address, the router redirects (forwards) that traffic to a designated internal server and port.

!!! note "Standalone & Controller-Managed"
    You can configure port forwarding rules from the local web UI in both modes.

## Overview

Port forwarding creates Destination NAT (DNAT) rules that translate incoming connections on the router's public IP address to a private IP address on your LAN or another internal zone. This is essential for hosting web servers, remote desktop services, VPN servers, or any application that external users need to reach.

Each port forwarding rule defines:

- Which **WAN address** and **source port** to listen on
- Which **internal IP** and **destination port** to forward to
- Which **protocols** to forward (TCP, UDP, or both)
- Optional **source restrictions** to limit who can connect

## Prerequisites

- A server or device on your LAN with a static IP address (or a DHCP reservation)
- Knowledge of the port number(s) your service uses
- The internal IP address of the target server

## Creating a Port Forwarding Rule

1. Navigate to **Firewall > Port Forward**.
2. Click **Add Port Forward**.
3. Fill in the following fields in the side panel:

| Field | Description | Example |
|---|---|---|
| Name | Descriptive name for this rule | `Web Server HTTP` |
| Source Port | External port on the WAN interface | `8080` |
| Protocols | TCP, UDP, or both (default: TCP + UDP) | TCP |
| WAN IP | Specific WAN address, or **Any** for all WAN addresses | Any |
| Destination Address | Internal server IP address or select a network object | `192.168.1.50` |
| Destination Port | Port on the internal server (can differ from source port) | `80` |
| Destination Zone | Internal zone where the server resides | LAN |

4. Click **Save**.

!!! tip
    You can use a different external and internal port. For example, forward
    external port `8080` to internal port `80`. This lets you expose a service
    on a non-standard port without reconfiguring the server.

### Restricting Access by Source

To limit who can reach your forwarded service:

1. While creating or editing a port forwarding rule, enter one or more IP addresses or CIDR ranges in the **Restrict Access** field.
2. Only traffic from those source addresses will be forwarded. All other sources are blocked.

You can also select a pre-defined network object instead of entering addresses manually.

### Forwarding a Port Range

To forward a range of consecutive ports, enter the range in the **Source Port** field using a dash separator:

- Single port: `8080`
- Port range: `8080-8090`

The **Destination Port** field should contain the starting port of the internal range. The router maps port `8080` on WAN to port `80` on the server, `8081` to `81`, and so on.

## Common Scenarios

### Web Server

Forward HTTP and HTTPS traffic to an internal web server:

| Field | HTTP Rule | HTTPS Rule |
|---|---|---|
| Name | `Web HTTP` | `Web HTTPS` |
| Source Port | `80` | `443` |
| Protocols | TCP | TCP |
| Destination Address | `192.168.1.50` | `192.168.1.50` |
| Destination Port | `80` | `443` |

### Remote Desktop (RDP)

Forward RDP traffic on a non-standard external port for security:

| Field | Value |
|---|---|
| Name | `RDP Access` |
| Source Port | `33389` |
| Protocols | TCP |
| Destination Address | `192.168.1.100` |
| Destination Port | `3389` |
| Restrict Access | `203.0.113.0/24` |

### VPN Passthrough (L2TP/IPsec)

Forward the L2TP and IPsec ports to an internal VPN concentrator:

| Rule | Source Port | Protocol | Destination Port |
|---|---|---|---|
| `VPN L2TP` | `1701` | UDP | `1701` |
| `VPN IKE` | `500` | UDP | `500` |
| `VPN NAT-T` | `4500` | UDP | `4500` |

All three rules should point to the same internal VPN server IP address.

## Advanced Settings

Click **Advanced Settings** when creating or editing a rule to access additional options:

| Field | Description | Default |
|---|---|---|
| Enable Logging | Log all connections matching this rule | Disabled |
| NAT Reflection | Allow LAN devices to access the service using the WAN IP address (hairpin NAT) | Disabled |
| Reflection Zones | Zones from which NAT reflection is allowed | LAN |

!!! info "NAT Reflection"
    Enable NAT reflection if LAN clients need to access the forwarded service
    using the router's public WAN address instead of the server's internal
    address. This is sometimes called "hairpin NAT" or "NAT loopback".

## Managing Port Forwarding Rules

### Enabling and Disabling Rules

You can toggle a port forwarding rule on or off without deleting it. Click the enable/disable toggle on the rule row in the port forwarding table.

### Duplicating a Rule

To create a similar rule quickly, click the action menu on an existing rule and select **Duplicate**. A copy of the rule is created with "(copy)" appended to the name.

### Filtering Rules

Use the filter text box at the top of the page to search rules by name, port, protocol, WAN address, destination IP, or source restriction.

### Deleting a Rule

Click the action menu on the rule row and select **Delete**. Confirm the deletion in the dialog.

## Verification

After creating a port forwarding rule:

1. From an external network, connect to `<WAN_IP>:<source_port>` using the appropriate client.
2. Verify the connection reaches the internal server.
3. If logging is enabled, check **System > Logs** for entries showing the forwarded connections.
4. If you configured source restrictions, verify that connections from non-allowed addresses are blocked.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| External clients cannot connect | The port forwarding rule is disabled | Check the rule's enabled status in the port forwarding table |
| Connection times out from outside | ISP is blocking the port | Try a non-standard port (for example, `8080` instead of `80`) |
| Rule works externally but not from LAN | NAT reflection is disabled | Edit the rule, open **Advanced Settings**, and enable **NAT Reflection** |
| Only TCP works, UDP is blocked | Protocol is set to TCP only | Edit the rule and add UDP to the selected protocols |
| Port forward does not apply to second WAN | WAN IP field is set to a specific address | Change WAN IP to **Any** to apply to all WAN interfaces |
| "Cannot delete port forward" error | Pending configuration changes conflict | Apply or revert pending changes first, then retry the deletion |
