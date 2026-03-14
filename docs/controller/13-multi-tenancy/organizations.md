# Organizations

## Overview

An organization is the top-level isolation unit in the Nexapp SDWAN Controller. Every device, topology, policy, user assignment, DPI snapshot, and report belongs to exactly one organization. Users assigned to an organization can only see that organization's data — they cannot access devices, topologies, or analytics belonging to another organization.

This model enables Managed Service Providers (MSPs) to manage multiple customers from a single controller instance with strict data separation between customers.

## Navigating to Organizations

Go to **Users & Organizations > Organizations** in the left navigation sidebar. The list view shows all organizations you have access to. Superusers see all organizations; staff and operator users see only the organizations they are assigned to.

## Creating an Organization

1. Click **Add Organization** in the top-right corner.
2. Fill in the required fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Human-readable display name | `Acme Corporation` |
| **Slug** | URL-safe identifier used in API paths | `acme-corporation` |
| **Timezone** | Organization's local timezone for reports | `Asia/Kolkata` |
| **Contact Email** | Primary contact for notifications | `admin@acme.example` |
| **Description** | Optional notes about the organization | `Enterprise customer, 12 branch sites` |

3. Click **Save**. The organization is created and available for device assignment immediately.

!!! warning "Slug is Permanent"
    The organization slug cannot be changed after creation. It is embedded in API URL paths and internal references. Choose a slug that clearly reflects the organization name.

## Assigning Devices to an Organization

Every NexappOS device registered with the controller must be assigned to an organization:

1. Go to **Devices**.
2. Click on the device name to open the device detail page.
3. In the **Organization** field, select the correct organization from the dropdown.
4. Click **Save**.

Devices without an organization assignment are visible only to superusers.

## Assigning an Organization Administrator

An organization administrator manages all resources within that organization. To assign one:

1. Go to **Users & Organizations > User Management**.
2. Open the user's profile.
3. Set **Role** to `Staff` and add the organization under the **Organizations** field.
4. Enable the **Is Organization Admin** flag.
5. Click **Save**.

Organization admins can add and remove other users within their organization but cannot create new organizations or access other organizations' data.

## Superuser Access

A superuser account has unrestricted access to all organizations. Superusers can:

- Create, modify, and delete organizations
- View all devices, topologies, and data across all organizations
- Assign users to organizations
- Access the administration panel at `/admin/`

Limit superuser accounts to platform administrators. Day-to-day MSP operations should use staff accounts scoped to specific organizations.

## Isolation Guarantees

The controller enforces strict organization isolation at every layer:

| Layer | Isolation Mechanism |
|-------|---------------------|
| **REST API** | Every query is filtered by the requesting user's organization memberships |
| **Web UI** | Dropdowns and list views only show resources belonging to the user's organizations |
| **Reports** | Report templates and scheduled reports are organization-scoped |
| **Application Intelligence** | Traffic data is stored and queried per-organization |
| **Audit Logs** | Access events are scoped to the organization of the accessed resource |

No configuration or code change is needed to enable isolation — it is enforced automatically for all non-superuser accounts.

## Example: MSP with Three Customers

An MSP managing three customers (Acme, Globex, and Initech) would:

1. Create three organizations: `acme-corp`, `globex-industries`, `initech-llc`.
2. Register each customer's routers and assign them to the appropriate organization.
3. Create staff accounts for each customer's IT administrator, scoped to their organization.
4. Create a superuser account for the MSP's platform team with access to all three organizations.

Customer admins can only see and manage their own routers and topologies. The MSP platform team sees everything.

## Deleting an Organization

Deleting an organization removes all associated devices, topologies, policies, and user assignments. This action is irreversible.

1. Ensure all devices have been decommissioned or reassigned.
2. Go to **Users & Organizations > Organizations**.
3. Select the organization and choose **Delete**.
4. Confirm the deletion in the dialog.

!!! danger "Permanent Data Loss"
    Deleting an organization permanently removes all DPI snapshots, deployment history, and reports for that organization. Export any required data before deletion.

## See Also

- [User Management](users.md) — Create users and assign them to organizations
- [Device Access Zones](access-zones.md) — Restrict device visibility within an organization
- [REST API Authentication](../14-api/authentication.md) — API authentication and organization-scoped queries
