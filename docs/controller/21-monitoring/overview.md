# Monitoring

## Overview

The Monitoring section provides real-time and historical health metrics for all managed devices. Charts show CPU, memory, storage, interface traffic, latency, and signal strength over time. Alert thresholds trigger notifications when metrics exceed defined limits.

Navigate to **Monitoring** in the controller sidebar.

---

## What Is Monitored

Each managed device automatically reports the following metrics to the controller every 5 minutes:

| Metric Category | Metrics |
|----------------|---------|
| **System** | CPU load (1m/5m/15m), RAM usage, storage usage, uptime |
| **Interfaces** | RX/TX bytes, packets, errors, drops per interface |
| **SD-WAN** | Tunnel status, WAN member latency/jitter/loss |
| **Cellular** | Signal strength (RSRP/RSRQ), SIM carrier, band |
| **Security** | Active connections count, firewall hits |

---

## Device Monitoring View

To view monitoring data for a specific device:

1. Navigate to **Devices** → select device
2. Scroll to the **Status** section — shows current system, network, firewall, security, and VPN status
3. Scroll to the **Charts** section — shows time-series graphs

The **Status** section has main tabs and subtabs:

| Main Tab | Subtabs |
|----------|---------|
| **System** | General, SNMP, ICMP Check, Schedule |
| **Network** | Interface, DNS/DHCP, Routes, VXLAN, FlowEdge, Performance SLA, Reverse Proxy, Advance QoS, RIP, OSPF, BGP, VRF |
| **Firewall** | Port Forward, NAT, Rules, Connections, Zones and Policies |
| **Security** | InstaShield IP, InstaShield DNS, DPI Filter, IPS, Anti Virus, Anti Spam |
| **VPN** | IPsec Tunnel, L2TP, GRE, VRRP, ZeroTier, WireGuard, OpenVPN |

---

## Monitoring Charts

The **Charts** section on each device page shows time-series graphs:

- **CPU / Memory** — last 24h, 7d, 30d
- **Interface Traffic** — RX/TX per interface over time
- **Latency** — per WAN member latency
- **Signal** — cellular signal strength over time (if LTE/5G device)

Charts auto-refresh every 60 seconds when the page is open.

---

## Health Alerts

Monitoring alerts notify operators when thresholds are breached:

1. Navigate to **Monitoring > Alerts** (or via device detail)
2. Set thresholds: CPU%, RAM%, latency (ms), packet loss (%)
3. Alert actions: email notification, webhook

---

## Monitoring Sub-Menu Items

| Item | Description |
|------|-------------|
| **Checks** | Configured health checks (ICMP ping targets, TCP port checks) |
| **Metrics** | All collected time-series metrics with raw data access |
| **Alerts** | Active and historical alerts |
| **Wi-Fi Sessions** | Active Wi-Fi client sessions (if Wi-Fi devices are managed) |

---

## See Also

- [Device Monitoring](../03-devices/monitoring.md)
- [Performance SLA](../06-policies/sla.md)
- [Health Monitoring (Admin)](../15-admin/health-monitoring.md)
