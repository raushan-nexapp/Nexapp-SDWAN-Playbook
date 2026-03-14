# Administration Panel

## Overview

The Nexapp SDWAN Controller provides a low-level administration panel for direct database management, bulk operations, and tasks that are not available in the standard web interface. The administration panel is available only to superuser accounts.

**URL:** `https://<controller>/admin/`

!!! warning "Use with Caution"
    Direct changes through the administration panel bypass the application's validation logic. Use the standard web interface (**Users**, **Device Management**, **SD-WAN Topology**) for all routine operations. Reserve the administration panel for emergency recovery, initial setup, and bulk data operations that require direct database access.

## Accessing the Panel

1. Navigate to `https://<controller>/admin/`.
2. Log in with a superuser account. Staff and Operator accounts cannot access this panel.
3. The main dashboard shows all registered models organized by application.

## Key Sections

### Authentication and Authorization

| Section | Use |
|---------|-----|
| **Groups** | Create user groups for bulk permission assignment |
| **Users** | View and manage all user accounts, reset passwords, toggle active status |
| **Tokens** | View and revoke API tokens for any user |

### Organization Management

| Section | Use |
|---------|-----|
| **Organizations** | Create organizations, update slugs (emergency only — avoid post-creation), manage org membership |
| **Device Access Zones** | Manage zones and user-device assignments |

### Device and Topology

| Section | Use |
|---------|-----|
| **Devices** | View all registered devices across all organizations |
| **Topologies** | View topology records, manually override status fields |
| **Deployment Records** | View full deployment history, clear stuck deployment locks |

### DPI and Analytics

| Section | Use |
|---------|-----|
| **DPI Snapshots** | View raw DPI data records; useful for debugging missing dashboard data |
| **Application Traffic** | Review per-application traffic records |
| **DPI Alerts** | Manually acknowledge or close DPI alerts |

### Reporting

| Section | Use |
|---------|-----|
| **Report Templates** | Create and edit report templates |
| **Report Email Schedules** | View and manage scheduled report deliveries |
| **Email Templates** | Edit HTML email templates used for reports and notifications |

### Access Logs

| Section | Use |
|---------|-----|
| **Access Events** | View the full audit log of all user actions |

## Creating a Superuser Account

If you need to create the initial superuser or recover access, use the following command on the controller server:

```bash
ssh -i ~/PST/test_ubuntu24.04.pem ubuntu@3.6.121.36
cd /opt/nexappcontroller/src/tests
sudo /opt/nexappcontroller/env/bin/python manage.py createsuperuser
```

Enter a username, email, and password when prompted. The account is immediately available for login.

## Resetting a User Password via Admin Panel

1. Go to **Authentication and Authorization > Users**.
2. Find the user by username or email.
3. Click on the username to open the user record.
4. Scroll to the **Password** section and click **this form** to use the password change form.
5. Enter the new password and save.

## Bulk Operations

The admin panel supports bulk actions on selected records:

1. Navigate to any model list view.
2. Check the boxes next to the records to modify.
3. Select an action from the **Action** dropdown.
4. Click **Go**.

Available bulk actions include deleting records and changing status fields. Custom bulk actions are available on the Devices and Deployments models.

## Inline Editing

Many models support inline editing of related objects. For example:

- Opening a **Topology** record shows its associated devices inline.
- Opening an **Organization** record shows its users inline.

This allows reviewing and editing related data without navigating away from the main record.

## Email Templates

HTML email templates for reports and notifications are managed at **Report > Email Scheduling**. Templates use Django template syntax and support variables such as `{{ report_name }}`, `{{ organization }}`, and `{{ generated_at }}`.

Editing email templates affects all future emails. Test any changes by triggering a test report from the Reports section of the standard web interface.

## Clearing a Stuck Deployment

If a deployment shows as `in_progress` indefinitely:

1. Go to **Device and Topology > Deployment Records**.
2. Find the stuck deployment record.
3. Change the `status` field from `in_progress` to `failed`.
4. Click **Save**.

This releases the lock so the topology can be deployed again. Investigate the cause of the stuck deployment in the task logs before retrying.

## See Also

- [Background Task Workers](celery.md) — Worker management and restart procedures
- [Health Monitoring](health-monitoring.md) — System health dashboard
- [Audit Logging](audit-logging.md) — Access event log
- [Common Issues](../16-troubleshooting/common-issues.md) — Troubleshooting guide
