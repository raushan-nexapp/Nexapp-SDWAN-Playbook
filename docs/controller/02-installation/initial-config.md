# Initial Configuration

## Overview

After installing the controller, a few one-time setup tasks are required before you can register devices and create topologies. This page covers first login, organization setup, API token retrieval, ZeroTier network configuration, and optional email settings.

## Step 1: First Login

Open a browser and navigate to `https://<controller>/`. You will see the login page.

Enter the admin credentials you created during installation (the `createsuperuser` step). If you have not yet created a superuser, run:

```bash
# For Docker deployments
docker compose exec web python manage.py createsuperuser

# For manual installations
cd /opt/nexappcontroller/src/tests
/opt/nexappcontroller/env/bin/python manage.py createsuperuser
```

After logging in, you will land on the main dashboard. The first time you log in, you will see no devices or topologies — this is expected.

## Step 2: Create Your Organization

The controller uses organizations to group devices and users. Most deployments have a single organization. ISPs and MSPs create one organization per customer for data isolation.

1. Navigate to **Admin > Organizations > Add Organization**
2. Fill in the required fields:

| Field | Example Value | Notes |
|---|---|---|
| **Name** | Acme Corp | Human-readable name shown in the UI |
| **Slug** | acme-corp | URL-safe identifier, auto-generated from name |
| **Timezone** | Asia/Kolkata | Used for report scheduling and log timestamps |
| **Description** | (optional) | Internal notes |

3. Click **Save**

The organization you create here will be selected when approving new devices.

## Step 3: Get Your API Token

The API token authenticates REST API calls from CLI tools, scripts, and integrations.

1. Click your username in the top-right navigation bar
2. Select **Profile** from the dropdown
3. Scroll to the **API Token** section
4. If no token exists, click **Generate Token**
5. Copy the token value — it is shown only once for newly generated tokens

Store the token securely. You can verify it works immediately:

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://<controller>/api/v1/health/
```

A successful response returns `{"status": "ok", ...}`.

!!! warning "Token Security"
    Treat the API token like a password. Do not include it in scripts stored in version control. Use environment variables or a secrets manager to pass the token to automation tools.

## Step 4: Configure the ZeroTier Network

The ZeroTier network ID is the management plane that connects the controller to all registered devices. You must configure this before any devices can be managed.

1. Navigate to **Settings**
2. Enter your ZeroTier network ID (16 hexadecimal characters)
3. Click **Save**

If you do not have a ZeroTier network yet, create one at [https://my.zerotier.com](https://my.zerotier.com). After creating the network:

- Set the IP assignment pool to `10.0.0.0/24` (or your preferred management subnet)
- Enable auto-assignment so devices receive IPs automatically on join
- Note the 16-character network ID — this is what you enter in the controller settings

The controller will join the ZeroTier network with IP `10.0.0.1` (the first usable address in the pool). Routers will receive subsequent IPs (10.0.0.2, 10.0.0.3, etc.) as they register.

## Step 5: Configure Email Settings (Optional)

Email is used for scheduled report delivery and alert notifications. If you skip this step, reports can still be generated on demand and downloaded manually.

Navigate to **Settings** and configure:

| Field | Example | Notes |
|---|---|---|
| **SMTP Host** | smtp.gmail.com | Your mail server hostname |
| **SMTP Port** | 587 | 587 for STARTTLS, 465 for SSL |
| **Username** | alerts@example.com | SMTP authentication username |
| **Password** | (your SMTP password) | Stored encrypted |
| **Use TLS** | Yes | Enable STARTTLS for port 587 |
| **From Address** | Nexapp Controller \<alerts@example.com\> | Displayed in email client |

After saving, click **Send Test Email** and enter your address to verify delivery.

## Step 6: Set Data Retention Policies

Navigate to **Settings** to configure how long the controller keeps historical data:

| Data Type | Default Retention | Minimum | Notes |
|---|---|---|---|
| DPI snapshots | 90 days | 7 days | Major driver of disk usage |
| SLA metrics | 90 days | 7 days | Used for historical graphs |
| Audit logs | 30 days | 7 days | Login and configuration change events |
| Report files | 180 days | 30 days | Generated PDF and CSV files |

A background cleanup job runs nightly and removes records older than the configured retention period.

## Step 7: Verify the Full Stack

Run a complete health check to confirm all components are working:

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  https://<controller>/api/v1/health/ | python3 -m json.tool
```

Expected healthy output:

```json
{
  "status": "ok",
  "database": "ok",
  "redis": "ok",
  "celery_workers": "ok",
  "topology_count": 0,
  "device_count": 0
}
```

If any component shows `error` or `degraded`:

| Component | Troubleshooting Step |
|---|---|
| `database: error` | Verify PostgreSQL is running and credentials in settings are correct |
| `redis: error` | Verify Redis is running: `sudo systemctl status redis` |
| `celery_workers: error` | Check worker service status and logs |

## Next Steps

With initial configuration complete, you are ready to register devices and create topologies.

- [Device Registration](../03-devices/registration.md) — Register your first NexappOS router
- [Getting Started](../01-introduction/getting-started.md) — End-to-end first-deployment walkthrough

!!! info "See Also"
    - [System Requirements](requirements.md) — Hardware and OS prerequisites
    - [Docker Deployment](docker.md) — Container-based deployment
    - [Manual Installation](manual.md) — Bare-metal installation guide
