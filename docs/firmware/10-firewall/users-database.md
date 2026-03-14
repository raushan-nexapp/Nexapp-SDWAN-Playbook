# Users Database

!!! note "Standalone & Controller-Managed"
    The local user database can be configured on the router. When controller-managed, user accounts may be synchronized from the controller.

## Overview

The Users Database stores local user accounts used for VPN authentication (OpenVPN) and identity-based firewall policies. You can create users, assign passwords, and grant administrator privileges. For enterprise environments, remote LDAP or Active Directory databases can also be connected.

Navigate to **Users & Objects > Users Database** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For remote databases: an LDAP or Active Directory server is reachable from the router.

## Configuration

### Database Tabs

The page displays one tab per configured database. The **Local Database** tab is always present. If remote LDAP databases are connected, they appear as additional tabs.

### Database Card

Each database tab shows a card with the database type and connection details:

- **Local Database** -- stores users directly on the router.
- **Remote LDAP** -- connects to an external LDAP directory (RFC 2307 schema).
- **Remote Active Directory** -- connects to a Microsoft AD server.

For remote databases, the **URI** (e.g., `ldaps://192.168.1.50:636`) is displayed on the card. Click **Edit** to modify connection settings or delete the remote database.

### Creating a User

1. Select the appropriate database tab (typically **Local Database**).
2. Click **Add User**.
3. Enter the **Username**.
4. Enter a **Password**.
5. Optionally add a **Description**.
6. Click **Save**.

### Managing Users

The user table displays all accounts in the selected database:

| Column | Description |
|--------|-------------|
| **Name** | The username. |
| **Description** | Optional description of the account. |
| **Admin** | Whether the user has administrator privileges. |
| **OpenVPN IP** | Reserved VPN IP address (if configured). |

- Click the edit icon to modify a user's password or description.
- Click **Set Admin** to grant administrator privileges, or **Remove Admin** to revoke them.
- Click the delete icon to remove a user account.

## Verification

1. Create a local user account.
2. Verify the user appears in the users table.
3. If the user is for VPN access, connect with an OpenVPN client using the new credentials.
4. Confirm the connection succeeds and the user appears in the active VPN sessions list.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Cannot add user -- error loading database | Database service not running | Refresh the page. If the error persists, reboot the router. |
| LDAP users not appearing | Incorrect URI or bind credentials | Verify the LDAP URI, bind DN, and password in the remote database configuration. |
| VPN authentication fails with correct password | User created in wrong database | Verify the OpenVPN server is configured to use the same database where the user was created. |

!!! info "See Also"
    - [OpenVPN Road Warrior](../12-vpn/openvpn-rw.md) -- Remote access VPN using local user authentication
    - [Firewall Objects](objects.md) -- Reusable address and domain objects for firewall rules
    - [Firewall Rules](rules.md) -- Create rules that reference user identities
