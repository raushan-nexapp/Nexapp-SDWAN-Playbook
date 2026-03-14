# Device Access Zones

## Overview

Device Access Zones provide fine-grained access control within an organization. While organization membership determines which organization's data a user can access, Access Zones further restrict which specific devices within that organization a user can see and manage.

A user assigned to a Device Access Zone can only view and manage the devices in that zone — not all devices in the organization.

## When to Use Access Zones

Access Zones are useful when:

- An ISP has field engineers responsible for specific geographic regions. Each engineer should only manage routers in their territory.
- A large enterprise has multiple IT teams (e.g., North campus team, South campus team) that should only manage their own branch routers.
- A managed service provider wants to give a customer's junior staff access to a subset of their devices, with senior staff managing the full set.

## Navigating to Device Access Zones

Go to **Users & Organizations > Device Access Zones** in the left navigation sidebar.

## Creating a Device Access Zone

1. Click **Add Zone**.
2. Fill in the zone details:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Human-readable name for the zone | `North Region` |
| **Organization** | The organization this zone belongs to | `Acme Corporation` |
| **Description** | Optional notes explaining the zone's purpose | `Devices at sites in northern region` |

3. Click **Save**.

The zone is created but has no devices or users yet. Add them in the following steps.

## Assigning Devices to a Zone

After creating the zone:

1. Open the zone detail page.
2. Under **Devices**, click **Add Device**.
3. Select one or more devices from the organization's device list.
4. Click **Save**.

A device can belong to multiple zones. If a device is in Zone A and Zone B, any user in either zone can see it.

## Assigning Users to a Zone

1. Open the zone detail page.
2. Under **Users**, click **Add User**.
3. Select users from the organization's user list (Staff or Operator roles only).
4. Click **Save**.

A user must also be a member of the organization before they can be added to a zone in that organization.

## Zone Stacking (Multiple Zone Membership)

A user can be in multiple zones simultaneously. The effective set of visible devices is the union of all zones the user belongs to:

**Example:**

| Zone | Devices |
|------|---------|
| North Region | Router-A, Router-B, Router-C |
| Remote Sites | Router-C, Router-D |

If a user is in both zones, they see: Router-A, Router-B, Router-C, Router-D.

## Access Zone Effects

Zone restrictions apply uniformly across all interfaces:

| Interface | Effect |
|-----------|--------|
| **Web UI** | Device lists, topology views, and dashboards only show zone-scoped devices |
| **REST API** | All API list endpoints filter by zone membership |
| **Application Intelligence** | Traffic data shown only for zone-scoped devices |
| **Reports** | Report data limited to zone-scoped devices |
| **Deployment** | Users cannot trigger deployments for devices outside their zone |

## Admin and Superuser Exceptions

Access zone restrictions do not apply to:

- **Superusers** — always see all devices in all organizations
- **Organization admins** — see all devices in their organization regardless of zone membership

This ensures administrators always have full visibility to handle emergencies.

## Example: ISP Field Engineer Setup

An ISP uses the controller to manage 60 routers across three regions. The setup:

1. Create three zones: `Zone-North` (20 devices), `Zone-Central` (20 devices), `Zone-South` (20 devices).
2. Assign the appropriate devices to each zone.
3. Create three staff user accounts for the field engineers.
4. Add each engineer to their region's zone.
5. Create a senior staff account (not in any zone) — the organization admin flag gives them full visibility.

Each field engineer logs in and sees only their 20 devices. The senior admin sees all 60.

## Removing a Device from a Zone

1. Open the zone detail page.
2. Under **Devices**, click the remove icon next to the device.
3. Confirm removal.

The device is removed from the zone but remains registered with the organization. Users in that zone will no longer see it.

## Deleting a Zone

Deleting a zone removes the zone definition and all its device and user assignments. It does not delete the devices or users — they remain in the organization.

1. Go to **Users & Organizations > Device Access Zones**.
2. Select the zone and click **Delete**.
3. Confirm.

## See Also

- [Organizations](organizations.md) — Top-level isolation between organizations
- [User Management](users.md) — User roles and organization assignment
- [REST API Authentication](../14-api/authentication.md) — API requests respect zone restrictions
