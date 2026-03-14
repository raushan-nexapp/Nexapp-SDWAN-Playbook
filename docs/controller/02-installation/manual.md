# Manual Installation (Ubuntu)

## Overview

This guide covers a bare-metal or virtual machine installation of the Nexapp SDWAN Controller on Ubuntu 22.04 or 24.04 LTS without Docker. This method gives you the most control over the deployment and is used in production environments where Docker is not available.

For most new deployments, [Docker Deployment](docker.md) is simpler and recommended.

## Prerequisites

- Ubuntu 22.04 or 24.04 LTS with root or sudo access
- Server meets the [System Requirements](requirements.md) for your device count
- Domain name resolving to the server's IP (for TLS)
- Outbound internet access to reach ZeroTier infrastructure

## Step 1: Update System and Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y

# Install system packages
sudo apt install -y \
  python3.11 python3.11-venv python3.11-dev \
  python3-pip \
  postgresql-16 postgresql-client-16 \
  redis-server \
  nginx \
  git \
  curl \
  build-essential \
  libpq-dev \
  pkg-config
```

## Step 2: Create Application User and Directory

```bash
# Create a dedicated system user for the controller
sudo useradd -r -s /bin/bash -d /opt/nexappcontroller nexapp
sudo mkdir -p /opt/nexappcontroller
sudo chown nexapp:nexapp /opt/nexappcontroller
```

## Step 3: Clone the Repository and Create Virtual Environment

```bash
sudo -u nexapp bash -c "
  git clone https://github.com/nexapp/nexapp-controller.git /opt/nexappcontroller/src
  python3.11 -m venv /opt/nexappcontroller/env
  /opt/nexappcontroller/env/bin/pip install --upgrade pip
  /opt/nexappcontroller/env/bin/pip install -r /opt/nexappcontroller/src/requirements.txt
"
```

## Step 4: Configure PostgreSQL

```bash
# Start PostgreSQL and enable it on boot
sudo systemctl enable --now postgresql

# Create the database user and database
sudo -u postgres psql <<EOF
CREATE USER nexappuser WITH PASSWORD 'replace-with-strong-password';
CREATE DATABASE nexappdb OWNER nexappuser;
GRANT ALL PRIVILEGES ON DATABASE nexappdb TO nexappuser;
EOF
```

## Step 5: Configure Application Settings

Create the production settings file at `/opt/nexappcontroller/src/nexapp_settings.py`:

```python
# Production settings — customize for your deployment
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'nexappdb',
        'USER': 'nexappuser',
        'PASSWORD': os.environ.get('DB_PASSWORD', 'replace-with-strong-password'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

SECRET_KEY = os.environ.get('SECRET_KEY', 'replace-with-unique-secret-key')

ALLOWED_HOSTS = ['controller.example.com', '203.0.113.10']

REDIS_URL = 'redis://localhost:6379/0'

# ZeroTier management plane network ID
ZEROTIER_NETWORK_ID = os.environ.get('ZT_NETWORK_ID', '')

# Email settings (for reports and alerts)
EMAIL_HOST = 'smtp.example.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'alerts@example.com'
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')
DEFAULT_FROM_EMAIL = 'Nexapp Controller <alerts@example.com>'

# Data retention
DPI_RETENTION_DAYS = 90
AUDIT_LOG_RETENTION_DAYS = 30

DEBUG = False
```

Set environment variables in `/etc/environment` or use a systemd `EnvironmentFile`:

```bash
# Create secrets file (root-readable only)
sudo tee /opt/nexappcontroller/secrets.env > /dev/null <<EOF
SECRET_KEY=replace-with-unique-secret-key-50-chars
DB_PASSWORD=replace-with-strong-password
ZT_NETWORK_ID=your-16-digit-zerotier-network-id
EMAIL_PASSWORD=smtp-password
EOF
sudo chmod 600 /opt/nexappcontroller/secrets.env
sudo chown nexapp:nexapp /opt/nexappcontroller/secrets.env
```

## Step 6: Run Migrations and Collect Static Files

```bash
cd /opt/nexappcontroller/src/tests

# Apply database schema
sudo -u nexapp /opt/nexappcontroller/env/bin/python manage.py migrate

# Collect static files for Nginx to serve
sudo -u nexapp /opt/nexappcontroller/env/bin/python manage.py collectstatic --noinput

# Create admin superuser
sudo -u nexapp /opt/nexappcontroller/env/bin/python manage.py createsuperuser
```

## Step 7: Configure Gunicorn

Create `/opt/nexappcontroller/gunicorn.conf.py`:

```python
bind = "unix:/opt/nexappcontroller/gunicorn.sock"
workers = 3
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 120
keepalive = 5
accesslog = "/var/log/nexappcontroller/access.log"
errorlog = "/var/log/nexappcontroller/error.log"
loglevel = "info"
```

```bash
sudo mkdir -p /var/log/nexappcontroller
sudo chown nexapp:nexapp /var/log/nexappcontroller
```

## Step 8: Configure Systemd Services

### Application Server

Create `/etc/systemd/system/nexappcontroller.service`:

```ini
[Unit]
Description=Nexapp SDWAN Controller
After=network.target postgresql.service redis.service
Requires=postgresql.service redis.service

[Service]
User=nexapp
Group=nexapp
WorkingDirectory=/opt/nexappcontroller/src/tests
EnvironmentFile=/opt/nexappcontroller/secrets.env
ExecStart=/opt/nexappcontroller/env/bin/gunicorn \
  --config /opt/nexappcontroller/gunicorn.conf.py \
  nexapp.asgi:application
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Background Workers

Create `/etc/systemd/system/nexappcontroller-celery.service`:

```ini
[Unit]
Description=Nexapp Controller Worker (deploy)
After=nexappcontroller.service

[Service]
User=nexapp
Group=nexapp
WorkingDirectory=/opt/nexappcontroller/src/tests
EnvironmentFile=/opt/nexappcontroller/secrets.env
ExecStart=/opt/nexappcontroller/env/bin/celery \
  -A nexapp worker -Q deploy,default -c 3 \
  --loglevel=info --logfile=/var/log/nexappcontroller/celery-deploy.log
Restart=always

[Install]
WantedBy=multi-user.target
```

Create similar service files for `nexappcontroller-celery-network` (queue: `network`, concurrency 3) and `nexappcontroller-celery-beat` (runs the periodic scheduler).

## Step 9: Configure Nginx

Create `/etc/nginx/sites-available/nexappcontroller`:

```nginx
server {
    listen 80;
    server_name controller.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name controller.example.com;

    ssl_certificate /etc/letsencrypt/live/controller.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/controller.example.com/privkey.pem;

    client_max_body_size 50M;

    location /static/ {
        alias /opt/nexappcontroller/src/static/;
        expires 30d;
    }

    location /media/ {
        alias /opt/nexappcontroller/src/media/;
    }

    location / {
        proxy_pass http://unix:/opt/nexappcontroller/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nexappcontroller /etc/nginx/sites-enabled/
sudo certbot --nginx -d controller.example.com
sudo nginx -t && sudo systemctl reload nginx
```

## Step 10: Start and Enable All Services

```bash
sudo systemctl daemon-reload

sudo systemctl enable --now nexappcontroller
sudo systemctl enable --now nexappcontroller-celery
sudo systemctl enable --now nexappcontroller-celery-network
sudo systemctl enable --now nexappcontroller-celery-beat

# Verify all services are active
sudo systemctl status nexappcontroller nexappcontroller-celery
```

## Verify the Installation

```bash
curl -s https://controller.example.com/api/v1/health/ | python3 -m json.tool
```

Expected output:

```json
{
  "status": "ok",
  "database": "ok",
  "redis": "ok",
  "celery_workers": "ok"
}
```

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Service fails to start | Missing environment variable | Check `/opt/nexappcontroller/secrets.env` for required variables |
| 502 Bad Gateway from Nginx | Gunicorn socket not created | Check `journalctl -u nexappcontroller` for Python errors |
| `celery_workers: error` | Worker services not running | Run `sudo systemctl status nexappcontroller-celery` |
| Database connection error | Wrong credentials or PostgreSQL not running | Verify `DB_PASSWORD` in secrets file and run `sudo systemctl status postgresql` |

!!! info "See Also"
    - [System Requirements](requirements.md) — Hardware prerequisites and sizing guide
    - [Docker Deployment](docker.md) — Simpler alternative using containers
    - [Initial Configuration](initial-config.md) — First-run setup after installation
