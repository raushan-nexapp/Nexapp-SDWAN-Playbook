# Docker Deployment

## Overview

Docker Compose is the recommended deployment method for the Nexapp SDWAN Controller. It packages all components — application server, background workers, database, and cache — into isolated containers that start with a single command. This page walks through a complete Docker-based installation.

## Prerequisites

- Ubuntu 22.04 or 24.04 LTS server (see [System Requirements](requirements.md))
- Docker Engine 24 or later
- Docker Compose v2 (`docker compose` plugin — not the legacy `docker-compose` binary)
- At least 8 GB RAM and 50 GB disk
- A domain name pointing to the server, or use the server IP for testing

### Install Docker

```bash
# Install Docker Engine (official method)
curl -fsSL https://get.docker.com | sudo sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Verify Docker and Compose are available
docker --version
docker compose version
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/nexapp/nexapp-controller.git /opt/nexappcontroller
cd /opt/nexappcontroller
```

## Step 2: Configure Environment Variables

Copy the sample environment file and edit it for your deployment:

```bash
cp .env.example .env
```

Open `.env` in your editor and set the following values:

```bash
# Security — generate a unique secret key for each deployment
SECRET_KEY=replace-with-a-long-random-string-50-chars-minimum

# Database
POSTGRES_DB=nexappdb
POSTGRES_USER=nexappuser
POSTGRES_PASSWORD=replace-with-strong-password
DATABASE_URL=postgresql://nexappuser:replace-with-strong-password@db:5432/nexappdb

# Redis
REDIS_URL=redis://redis:6379/0

# Application
ALLOWED_HOSTS=controller.example.com,203.0.113.10
CORS_ALLOWED_ORIGINS=https://controller.example.com

# ZeroTier management plane
ZT_NETWORK_ID=your-16-digit-zerotier-network-id

# Email (optional — for report delivery and alerts)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=alerts@example.com
EMAIL_HOST_PASSWORD=smtp-password
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=Nexapp Controller <alerts@example.com>

# DPI and log retention (days)
DPI_RETENTION_DAYS=90
AUDIT_LOG_RETENTION_DAYS=30
```

!!! warning "Secret Key"
    Never use the default or example `SECRET_KEY` value in production. Generate a unique key using: `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`

## Step 3: Review the Docker Compose Services

The `docker-compose.yml` defines five services:

| Service | Description | Depends On |
|---|---|---|
| `web` | Gunicorn application server (ASGI, 3 workers) | `db`, `redis` |
| `celery` | Background task worker — deploy and default queues | `db`, `redis` |
| `celery-beat` | Scheduled task scheduler (runs periodic jobs) | `db`, `redis` |
| `celery-network` | Status polling worker (every 30s) | `db`, `redis` |
| `redis` | Redis 7 (message broker + cache) | — |
| `db` | PostgreSQL 16 | — |

For production, Nginx runs on the host (not in Docker) and proxies HTTPS to the `web` container on port 8000. This gives you full control over TLS termination and certificate management.

## Step 4: Configure Nginx (Host)

Install Nginx on the host and create a site configuration:

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

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

    location /static/ {
        alias /opt/nexappcontroller/static/;
    }

    location /media/ {
        alias /opt/nexappcontroller/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nexappcontroller /etc/nginx/sites-enabled/
sudo certbot --nginx -d controller.example.com
sudo systemctl reload nginx
```

## Step 5: Start All Services

```bash
cd /opt/nexappcontroller

# Pull the latest images
docker compose pull

# Start all services in the background
docker compose up -d

# Watch the logs during first startup
docker compose logs -f web
```

## Step 6: Run Initial Setup

After all containers are healthy, run one-time setup commands:

```bash
# Apply database migrations
docker compose exec web python manage.py migrate

# Collect static files into the static/ directory (served by Nginx)
docker compose exec web python manage.py collectstatic --noinput

# Create the first admin superuser
docker compose exec web python manage.py createsuperuser
```

## Step 7: Verify the Deployment

```bash
# Check that all containers are running
docker compose ps

# Test the API health endpoint
curl -s https://controller.example.com/api/v1/health/ | python3 -m json.tool
```

A healthy response looks like:

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

If `celery_workers` shows `degraded` or `error`, check the worker logs:

```bash
docker compose logs celery
docker compose logs celery-network
```

## Volume Mounts

| Path (host) | Mount (container) | Contents |
|---|---|---|
| `./static/` | `/app/static/` | Collected static assets (served by Nginx) |
| `./media/` | `/app/media/` | Uploaded files and generated reports |
| `postgres_data` (named volume) | `/var/lib/postgresql/data` | PostgreSQL database files |

## Updating the Controller

```bash
cd /opt/nexappcontroller

# Pull new images
git pull && docker compose pull

# Apply any new database migrations
docker compose exec web python manage.py migrate

# Restart services with zero downtime
docker compose up -d --force-recreate
```

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| `web` container exits immediately | Missing or invalid `SECRET_KEY` in `.env` | Set a valid `SECRET_KEY` and restart |
| Database connection refused | `db` container not ready when `web` starts | `docker compose restart web` after `db` is healthy |
| Static files return 404 | `collectstatic` not run or Nginx path wrong | Run `collectstatic` and verify Nginx `alias` path |
| `celery_workers: error` in health check | No workers running | `docker compose up -d celery celery-network` |

!!! info "See Also"
    - [System Requirements](requirements.md) — Hardware and OS prerequisites
    - [Manual Installation](manual.md) — Alternative installation without Docker
    - [Initial Configuration](initial-config.md) — First login and ZeroTier setup
