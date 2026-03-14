# VPN Servers

## Overview

VPN Server objects define the server-side configuration of a VPN endpoint managed by the controller. Devices using VPN-type templates reference a VPN Server to obtain connection parameters automatically.

Navigate to **Configurations > VPN Servers** in the controller sidebar.

---

## Supported Backends

| Backend | Protocol | Use Case |
|---------|----------|----------|
| `OpenVPN` | OpenVPN (UDP/TCP) | Road warrior and site-to-site |
| `WireGuard` | WireGuard (UDP) | Lightweight site-to-site |

---

## Creating a VPN Server

1. Navigate to **Configurations > VPN Servers**
2. Click **Add VPN**
3. Fill in required fields:

| Field | Description |
|-------|-------------|
| **Name** | Identifier (e.g., `HQ-OpenVPN-Server`) |
| **Organization** | Owner org |
| **Backend** | `OpenVPN` or `WireGuard` |
| **Host** | Server public IP or FQDN (e.g., `203.0.113.10`) |
| **Config** | Backend-specific configuration block |
| **DH** | Diffie-Hellman parameters (OpenVPN only) |
| **Cert** | Server TLS certificate (from Cas & Certificates) |
| **CA** | CA certificate that signed the server cert |

4. Click **Save**

---

## Linking VPN Servers to Templates

Once a VPN Server is created, create a **VPN-type template** that references it:

1. **Configurations > Templates > Add Template**
2. Set **Type = VPN** and select the VPN Server
3. The template auto-generates device-side VPN client configuration
4. Assign to device groups or individual devices

---

## OpenVPN Server Example

```
port 1194
proto udp
dev tun
server 10.8.0.0 255.255.255.0
keepalive 10 120
cipher AES-256-CBC
persist-key
persist-tun
```

---

## WireGuard Server Example

WireGuard servers are configured with a listening port and peer definitions. The controller manages key generation and peer assignment automatically when used with WireGuard templates.

---

## See Also

- [Configuration Templates](templates.md)
- [Cas & Certificates](../19-cas/overview.md)
- [VPN section in Firmware Manual](../../firmware/12-vpn/openvpn-s2s.md)
