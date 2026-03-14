# App Groups

## Overview

App Groups let you combine multiple applications and/or categories into a named set for use in policies. Rather than creating a separate policy rule for each individual application, reference one App Group to cover all of them at once.

Navigate to **Application Intelligence > App Groups** in the controller sidebar.

---

## Creating an App Group

1. Navigate to **Application Intelligence > App Groups**
2. Click **Add App Group**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Name** | Descriptive label (e.g., `Business-Critical`, `Block-List`) |
| **Organization** | Owner org |
| **Applications** | Individual apps to include |
| **Categories** | Entire categories to include |

4. Click **Save**

---

## Example App Groups

**Business-Critical**
Includes: Microsoft Teams, Zoom, Salesforce, SAP, Oracle ERP
→ Use in a steering policy: always route over the best SLA path

**Entertainment-Block**
Includes: Streaming category + Gaming category + P2P category
→ Use in a QoS rule: hard limit to 2 Mbps during business hours

**Security-Threat**
Includes: Security Risk category + custom flagged applications
→ Use in a DPI alert: notify immediately on any traffic match

---

## Using App Groups in Policies

| Policy Type | How App Group Is Used |
|------------|----------------------|
| **QoS Config** | Assign bandwidth class to the group |
| **Steering Policy** | Route group traffic via preferred WAN member |
| **DPI Alerts** | Trigger alert when group traffic exceeds threshold |
| **Internet Breakout** | Send group traffic directly to internet (bypass SD-WAN) |

---

## App Group vs Category

| | App Groups | Categories |
|--|-----------|-----------|
| **Scope** | Custom — you define members | Built-in — defined by DPI engine |
| **Members** | Mix of apps + categories | Applications only |
| **Purpose** | Policy reference | Classification |
| **Editable** | Yes | Limited (custom categories only) |

---

## See Also

- [Applications](app-intelligence.md)
- [App Categories](app-categories.md)
- [QoS Config](../06-policies/qos.md)
- [Traffic Steering](../06-policies/steering.md)
