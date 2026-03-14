# Documentation Style Guide

Writing conventions for all NexappOS and Nexapp SDWAN documentation.

---

## Section Anatomy

Every feature documentation page follows this structure:

```
# Feature Name

Brief description (1-2 sentences).

## Overview

What this feature does and why it matters. Include mode badge.

## Prerequisites

What must be configured before this feature works.

## Configuration

Step-by-step task-oriented instructions.

## Verification

How to confirm the feature is working correctly.

## Troubleshooting

Common problems, symptoms, causes, and resolutions.
```

---

## Mode Badges

Every feature section must declare which operating mode applies:

| Badge | Usage |
|-------|-------|
| `!!! note "Standalone & Controller-Managed"` | Feature works in both modes |
| `!!! note "Standalone Only"` | Feature only available without controller |
| `!!! note "Controller-Managed Only"` | Requires controller connection |

**Example:**

```markdown
!!! note "Standalone & Controller-Managed"
    BGP can be configured locally on the router or pushed from the controller.
    When controller-managed, local changes may be overwritten by the next deployment.
```

---

## Terminology Mapping

Use user-facing terms, not internal code names:

| Internal (DO NOT USE) | User-Facing (USE THIS) |
|----------------------|----------------------|
| NsBondTopology | SD-WAN Network / Topology |
| NsBondDevice | SD-WAN Device |
| WanMember | WAN Link / WAN Connection |
| QualityTier | SLA Threshold / Quality Profile |
| SteeringPolicy | Traffic Steering Rule |
| PathMonitor | Link Health Monitor |
| BgpConfig | BGP Configuration |
| OspfConfig | OSPF Configuration |
| QosConfig | QoS Policy |
| VrfConfig | VRF Instance |
| DpiSnapshot | Traffic Snapshot |
| DpiAppTraffic | Application Traffic Data |
| enable-overlay | Start SD-WAN |
| disable-overlay | Stop SD-WAN |
| set-overlay | Configure SD-WAN Overlay |
| add-member | Add WAN Link |
| ubus/RPCD | Device API |
| UCI | System Configuration |
| procd | Service Manager |

---

## Banned Terms

These internal implementation terms must NEVER appear in user documentation:

| Banned Term | Why | Alternative |
|-------------|-----|-------------|
| RPCD | Internal protocol | "device API" or omit |
| UCI | OpenWrt internals | "configuration" or "settings" |
| procd | OpenWrt internals | "service manager" or "the system" |
| Celery | Backend implementation | "background task" or "the controller" |
| Django | Backend framework | "the controller" |
| Redis | Cache implementation | omit |
| PostgreSQL | Database | "the database" (only in admin docs) |
| Vue / Pinia | Frontend framework | omit |
| ubus | OpenWrt IPC | "device API" or omit |
| NSB4 internals | Protocol internals | "bonding protocol" |
| `models.py` / `views.py` | Code files | omit |
| `migration` | Database migration | omit |

**Exception:** The Administration chapter (Ch.15) of the Controller Manual may reference Django admin, Celery, and PostgreSQL since the audience is system administrators.

---

## Admonition Conventions

Use MkDocs Material admonitions consistently:

```markdown
!!! warning "Data Loss Risk"
    Clearly describe what could go wrong and how to avoid it.

!!! note
    Additional context that helps understanding.

!!! tip
    Best practice or time-saving suggestion.

!!! info "See Also"
    Cross-reference to related documentation in the other manual.

!!! danger "Security Warning"
    Security-critical information that must not be ignored.

!!! example
    Concrete example with realistic (but sanitized) values.
```

---

## Cross-Reference Format

When linking between the two manuals, use a "See Also" admonition:

```markdown
!!! info "See Also: Controller Manual"
    To configure BGP globally for all devices, see
    [BGP Policies](../controller/06-policies/bgp.md) in the Controller Manual.
```

### 14 Cross-Reference Integration Points

| # | Topic | Router Chapter | Controller Chapter |
|---|-------|---------------|-------------------|
| 1 | Device Registration | 02-installation/controller-registration | 03-devices/registration |
| 2 | SD-WAN Overlay Setup | 05-sdwan/overlay-tunnels | 04-topology/hub-spoke |
| 3 | WAN Member Config | 05-sdwan/underlay-members | 04-topology/wizard |
| 4 | BGP Configuration | 08-routing/bgp | 06-policies/bgp |
| 5 | OSPF Configuration | 08-routing/ospf | 06-policies/ospf |
| 6 | QoS Configuration | 07-qos/overview | 06-policies/qos |
| 7 | SLA / Path Monitor | 06-sla/path-monitors | 06-policies/sla |
| 8 | Traffic Steering | 06-sla/traffic-steering | 06-policies/steering |
| 9 | DPI Analytics | 11-security/dpi | 09-dpi/overview |
| 10 | HA / VRRP | 09-ha/overview | 12-ha/overview |
| 11 | DC/DR Failover | 14-dcdr/overview | 12-ha/dcdr-failover |
| 12 | Deployment | 02-installation/controller-registration | 05-deployment/pipeline |
| 13 | VRF Multi-Tenancy | 08-routing/vrf | 08-vrf/overview |
| 14 | Tenant Configuration | 06-sla/tenants | 06-policies/tenant |

---

## Example IP Addresses and Credentials

**Never use real infrastructure IPs, tokens, or passwords.** Use these placeholders:

| Type | Placeholder | Example |
|------|------------|---------|
| WAN IP | RFC 5737 range | `192.0.2.1`, `198.51.100.1`, `203.0.113.1` |
| LAN IP | RFC 1918 range | `192.168.1.1`, `10.0.0.1`, `172.16.0.1` |
| Controller URL | Generic | `https://controller.example.com` |
| API Token | Placeholder | `your-api-token-here` |
| Password | Placeholder | `your-password-here` |
| SSH Key | Placeholder | `~/.ssh/id_rsa` |
| ASN | Documentation ASN | `65001`, `65002` |
| ZeroTier Network | Placeholder | `1234567890abcdef` |

---

## Code Block Conventions

Use fenced code blocks with language tags:

```markdown
    ```bash
    # Shell commands
    ssh root@192.0.2.1
    ```

    ```json
    {
      "name": "example-topology",
      "type": "hub-spoke"
    }
    ```
```

For API examples, show both the request and response:

```markdown
    === "Request"
        ```bash
        curl -X GET https://controller.example.com/api/v1/nsbond/topology/ \
          -H "Authorization: Token your-api-token-here"
        ```

    === "Response"
        ```json
        {
          "count": 1,
          "results": [...]
        }
        ```
```

---

## Writing Style

1. **Use active voice**: "Configure the interface" not "The interface should be configured"
2. **Use second person**: "You can..." not "The user can..."
3. **Be concise**: One idea per sentence. Short paragraphs (3-4 sentences max).
4. **Use numbered steps** for procedures, **bullet points** for lists of options
5. **Bold** for UI elements: Click **Save**, navigate to **Network > Interfaces**
6. **Code font** for values, commands, paths: Set the port to `443`, run `ping 192.0.2.1`
7. **No marketing language**: No "powerful", "revolutionary", "best-in-class"
8. **Audience test**: Would a CCNA-certified network administrator understand this without reading the source code?

---

## Version Tags

When a feature was added in a specific version, tag it:

```markdown
!!! note "Since NexappOS 10.01"
    This feature requires NexappOS firmware version 10.01 or later.
```

---

## Troubleshooting Format

Use a consistent symptom-cause-resolution table:

```markdown
## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Tunnel shows "Down" | PSK mismatch between hub and spoke | Verify PSK matches on both devices |
| High latency on overlay | Underlay congestion | Check WAN link utilization, enable QoS |
| BGP session not established | Firewall blocking port 179 | Add firewall rule to allow BGP traffic |
```
