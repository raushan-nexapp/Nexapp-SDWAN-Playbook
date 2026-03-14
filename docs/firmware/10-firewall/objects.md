# Firewall Objects

!!! note "Standalone & Controller-Managed"
    Firewall objects can be configured locally on the router or pushed from the controller. When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Firewall objects are reusable definitions of hosts, networks, and domains that you reference in firewall rules instead of typing raw IP addresses or FQDNs repeatedly. Objects make rules easier to read, maintain, and audit. When you update an object, every rule that references it is updated automatically.

Navigate to **Users & Objects > Objects** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.

## Configuration

The page has two tabs: **Host Sets** and **Domain Sets**.

### Host Sets Tab

Host sets define IP-based objects. Each host set has a type:

| Type | Description | Example |
|------|-------------|---------|
| **Host** | A single IP address. | `192.168.1.100` |
| **CIDR** | A network in CIDR notation. | `10.0.0.0/24` |
| **Range** | A contiguous range of IP addresses. | `192.168.1.100-192.168.1.200` |
| **DHCP Static Lease** | A host identified by its DHCP reservation. | `server-01` |
| **DNS Record** | A host resolved from a local DNS record. | `fileserver.lan` |
| **Host Set** | A group of other host objects (nesting). | `servers-group` |
| **VPN User** | A user from the local users database. | `john` |

#### Creating a Host Set

1. Click **Add Host Set**.
2. Enter a **Name** for the object (e.g., `web-servers`).
3. Select the **IP Version** (IPv4 or IPv6).
4. Choose the object **Type** and enter the corresponding value.
5. Click **Save**.

#### Filtering Host Sets

Use the search bar and dropdown filters to narrow the list:

- **Text filter** -- search by name or value.
- **Type filter** -- show only specific object types (Host, CIDR, Range, etc.).
- **IP Version filter** -- show IPv4, IPv6, or Any.

### Domain Sets Tab

Domain sets define collections of domain names (FQDNs) used in firewall rules for DNS-based filtering.

#### Creating a Domain Set

1. Click **Add Domain Set**.
2. Enter a **Name** for the domain set (e.g., `social-media`).
3. Select the **IP Version** (IPv4, IPv6, or Any).
4. Add one or more domain names (e.g., `example.com`, `*.example.com`).
5. Click **Save**.

### Editing or Deleting Objects

- Click the edit icon to modify an object's value or members.
- Click the delete icon to remove an object. If the object is referenced by a firewall rule, a dialog explains which rules use it and prevents deletion until the references are removed.
- Click the usage icon to view which firewall rules reference this object.

## Verification

1. Create a host set with a known IP address.
2. Create a firewall rule that references the host set.
3. Verify the rule applies correctly by testing traffic from or to that IP.
4. Update the host set with a different IP and confirm the rule behavior changes accordingly.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Cannot delete an object | Object is referenced by one or more firewall rules | Click the usage icon to see which rules reference the object. Remove or update those rules first. |
| Domain set not blocking expected traffic | DNS resolution not matching the domain set | Verify the domain names are exact matches. Use wildcard prefix (`*.example.com`) to match subdomains. |
| Host set has no effect on firewall | Object not referenced in any rule | Create or edit a firewall rule and select this object as the source or destination. |

!!! info "See Also"
    - [Firewall Rules](rules.md) -- Create rules that reference firewall objects
    - [Users Database](users-database.md) -- Manage user accounts for identity-based rules
    - [Zones & Policies](zones-policies.md) -- Configure firewall zone defaults
