# DNS Lookup

!!! note "Standalone & Controller-Managed"
    DNS lookup is available in both modes. The query runs directly on the router.

## Overview

The **DNS Lookup** tool queries DNS servers to resolve domain names into IP addresses and retrieve other DNS record types. Use it to verify DNS resolution, troubleshoot name resolution failures, and inspect DNS records for a domain.

Navigate to **Monitoring > DNS Lookup** to access this tool.

## How to Use

1. Configure the lookup parameters:

| Field | Description |
|-------|-------------|
| **Domain Name** | The domain to look up (e.g., `example.com`). |
| **DNS Server** (optional) | A specific DNS server to query (e.g., `8.8.8.8`). Leave empty to use the router's configured DNS server. |
| **Record Type** | The type of DNS record to query. See the table below. |

2. Click **Lookup** to run the query.
3. Results appear in a table showing each returned record with its type, name, and value.
4. The DNS server used for the query is displayed above the results.

## Record Types

| Type | Description |
|------|-------------|
| **A** | IPv4 address for a domain. |
| **AAAA** | IPv6 address for a domain. |
| **MX** | Mail exchange server and priority. |
| **NS** | Authoritative nameservers for a domain. |
| **TXT** | Text records (SPF, DKIM, domain verification). |
| **CNAME** | Canonical name (alias) pointing to another domain. |
| **SOA** | Start of authority record (primary nameserver, admin email, serial number). |
| **PTR** | Reverse DNS lookup (IP to hostname). |
| **SRV** | Service discovery records (e.g., SIP, XMPP). |
| **ANY** | Returns all available record types for the domain. |

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| "No records found" (NXDOMAIN) | The domain does not exist or is misspelled | Verify the domain name is correct. Try querying a well-known domain (e.g., `google.com`) to confirm DNS is working. |
| Query times out | The DNS server is unreachable or not responding | Check the router's DNS configuration under **Network > DNS & DHCP**. Try specifying a public DNS server (e.g., `8.8.8.8`). |
| Wrong record type selected | The record type does not exist for the queried domain | For example, not all domains have AAAA records. Try querying the **A** record type first. |
| Results show unexpected IP address | DNS cache contains stale data, or the domain was recently changed | Try querying a different DNS server. DNS propagation can take up to 48 hours after a change. |

!!! info "See Also"
    - [DNS & DHCP](../04-network/dns-dhcp.md) -- Configure the router's DNS server and DHCP settings
    - [Ping & Traceroute](ping-traceroute.md) -- Test reachability to resolved IP addresses
    - [Real-Time Monitoring](realtime.md) -- Live connectivity status
