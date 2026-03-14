# User Management

## Overview

The Nexapp SDWAN Controller uses a role-based access control (RBAC) model. Every user is assigned a role that determines what they can see and do, and one or more organizations that determine which data they can access. The combination of role and organization membership enforces the principle of least privilege.

## Navigating to Users

Go to **Users & Organizations > User Management** in the left navigation sidebar. Superusers see all users in the system. Organization admins see only users within their organization.

## User Roles

| Role | Access Level | Typical Use |
|------|-------------|-------------|
| **Superuser** | Full access to all organizations and admin panel | Platform administrators, MSP operations team |
| **Staff** | Read and write access within assigned organizations | Customer IT admins, NOC engineers |
| **Operator** | Read-only access within assigned organizations | Monitoring teams, auditors, read-only dashboards |

- Superusers see all organizations and can access the administration panel at `/admin/`.
- Staff users can create, edit, and delete devices, topologies, and policies within their assigned organizations.
- Operators can view dashboards, DPI analytics, and reports but cannot make configuration changes.

## Creating a User

1. Go to **Users & Organizations > User Management**.
2. Click **Add User**.
3. Fill in the user details:

| Field | Description |
|-------|-------------|
| **Username** | Unique login identifier |
| **Email** | Used for report delivery and password reset |
| **Password** | Minimum 12 characters; must include uppercase, lowercase, digit, and symbol |
| **First Name / Last Name** | Display name |
| **Role** | Select `Superuser`, `Staff`, or `Operator` |
| **Organizations** | Select one or more organizations (required for Staff and Operator) |
| **Is Active** | Controls whether the user can log in |

4. Click **Save**.

## Assigning Organizations to a User

Staff and Operator users must be assigned to at least one organization before they can access any data:

1. Open the user's profile.
2. Under the **Organizations** field, select the organizations this user should access.
3. Save.

A user assigned to multiple organizations sees the combined data of all their assigned organizations. Use [Device Access Zones](access-zones.md) for finer-grained control within a single organization.

## API Token

Each user has their own API token for programmatic access to the REST API:

1. Log in to the controller.
2. Click your profile avatar in the top-right corner.
3. Go to the **API Token** tab.
4. Click **Copy** to copy the token, or **Regenerate** to create a new one.

When a token is regenerated, the previous token is immediately invalidated. Any integrations or scripts using the old token must be updated.

## Password Management

**Changing your own password:**

1. Click your profile avatar → **Change Password**.
2. Enter your current password and the new password (minimum 12 characters).
3. Click **Save**.

**Resetting another user's password (requires Staff or Superuser):**

1. Go to **Users & Organizations > User Management**.
2. Open the target user's profile.
3. Click **Reset Password** and confirm.
4. A password reset email is sent to the user's registered email address.

## Two-Factor Authentication

Two-factor authentication (2FA) adds a second verification step at login using a time-based one-time password (TOTP) app such as Google Authenticator or Authy.

**Enabling 2FA:**

1. Go to your profile → **Security Settings**.
2. Click **Enable Two-Factor Authentication**.
3. Scan the QR code with your TOTP app.
4. Enter the 6-digit code to confirm.
5. Save your backup recovery codes in a secure location.

!!! tip "Recommended for Admins"
    Two-factor authentication is strongly recommended for all superuser and staff accounts to prevent unauthorized access.

## Deactivating a User

Deactivating a user prevents them from logging in while preserving all their historical data (audit logs, deployment records):

1. Go to **Users & Organizations > User Management**.
2. Open the user's profile.
3. Uncheck the **Is Active** field.
4. Click **Save**.

The user's API token also becomes invalid immediately. To permanently remove the user, use the **Delete** action — note this also removes all associated history.

## User Activity and Audit Trail

Every login, logout, and API call by a user is recorded in the audit log. To review a user's activity:

1. Go to **SD-WAN Fabric > Audit Log**.
2. Filter by **User** to see that user's history.
3. Optionally filter by date range or action type.

See [Audit Logging](../15-admin/audit-logging.md) for full details.

## See Also

- [Organizations](organizations.md) — Create organizations and assign devices
- [Device Access Zones](access-zones.md) — Restrict which devices a user can see within an organization
- [API Authentication](../14-api/authentication.md) — Using API tokens for programmatic access
- [Audit Logging](../15-admin/audit-logging.md) — User activity tracking and compliance
