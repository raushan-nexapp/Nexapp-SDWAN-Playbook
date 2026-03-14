# IPAM — IP Address Management

## Overview

The IPAM module provides structured IP address management for your network. Define subnets, allocate IP ranges, and track address assignments across all managed sites from a central location.

Navigate to **Ipam** in the controller sidebar.

---

## IPAM Objects

| Object | Description |
|--------|-------------|
| **Subnet** | IP network block (e.g., `10.100.0.0/16`) |
| **IP Address** | Individual IP within a subnet |
| **Subnet Division Rule** | Automatically split a large subnet into smaller blocks |

---

## Managing Subnets

### Adding a Subnet

1. Navigate to **Ipam > Subnets**
2. Click **Add Subnet**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Subnet** | CIDR notation (e.g., `192.0.2.0/24`) |
| **Organization** | Owner org |
| **Description** | Purpose of this subnet |
| **Master Subnet** | Parent subnet (for hierarchical IPAM) |
| **DNS Servers** | Assigned DNS for this subnet |
| **Tags** | Optional labels |

4. Click **Save**

### Subnet Detail View

The subnet detail page shows:
- **IP Address List** — all allocated IPs within this subnet
- **Available Count** — free addresses remaining
- **Usage %** — utilization gauge
- **Import CSV** — bulk import IP allocations

---

## Managing IP Addresses

### Allocating an IP

1. Navigate to **Ipam > IP Addresses**
2. Click **Add IP Address**
3. Fill in:

| Field | Description |
|-------|-------------|
| **IP Address** | The specific IP (e.g., `192.0.2.15`) |
| **Subnet** | Parent subnet |
| **Organization** | Owner org |
| **Description** | What this IP is assigned to |
| **Device** | Linked device (optional) |

---

## Subnet Division Rules

Subnet Division Rules automatically carve a master subnet into smaller blocks per organization or site:

1. Navigate to **Ipam > Subnets > [subnet] > Division Rules**
2. Add a rule: **Number of Hosts** per sub-subnet
3. The controller allocates a `/prefix` block to each requesting object

**Use case**: Allocate a `/24` to each new customer from a master `/16` pool.

---

## CSV Import/Export

Subnets support bulk IP import via CSV:

1. Navigate to **Ipam > Subnets > [subnet]**
2. Click **Import IPs from CSV**
3. Upload CSV with columns: `ip_address, description, device`

Export the current allocation list: **Ipam > Subnets > [subnet] > Export CSV**

---

## See Also

- [Device Registration](../03-devices/registration.md)
- [VPN Servers](../17-configurations/vpn-servers.md)
