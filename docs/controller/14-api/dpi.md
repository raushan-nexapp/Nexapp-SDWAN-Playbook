# DPI API Reference

## Overview

The DPI (Deep Packet Inspection) API provides programmatic access to application traffic analytics collected from NexappOS routers. The API covers three read endpoints for querying stored analytics data, and one write endpoint for data ingestion from routers.

All read endpoints require user token authentication. The sink (ingestion) endpoint uses device key authentication.

## Base URL

```
https://<controller>/api/v1/dpi/
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dpi/snapshot/` | List DPI hourly snapshots |
| `GET` | `/dpi/app-traffic/` | List application traffic records |
| `GET` | `/dpi/alert/` | List DPI alerts |
| `POST` | `/dpi/sink/` | Ingest DPI data from a router (device auth) |

## DPI Snapshots

Snapshots are hourly summaries of total traffic per device, collected and stored by the controller.

### List Snapshots

```
GET /api/v1/dpi/snapshot/
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `device` | integer | Filter by device ID | `?device=42` |
| `start_date` | date | Include records from this date | `?start_date=2026-01-01` |
| `end_date` | date | Include records up to this date | `?end_date=2026-01-31` |
| `page_size` | integer | Results per page (max 100) | `?page_size=100` |

**Example:**

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  "https://203.0.113.10/api/v1/dpi/snapshot/?device=42&start_date=2026-01-01&end_date=2026-01-31"
```

**Response:**

```json
{
  "count": 744,
  "next": "https://203.0.113.10/api/v1/dpi/snapshot/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1001,
      "device": 42,
      "timestamp": "2026-01-15T14:00:00Z",
      "total_bytes_in": 1073741824,
      "total_bytes_out": 536870912,
      "top_apps": ["YouTube", "Teams", "HTTP"]
    }
  ]
}
```

## Application Traffic Records

Application traffic records provide per-application bandwidth breakdowns within a snapshot period.

### List Application Traffic

```
GET /api/v1/dpi/app-traffic/
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `device` | integer | Filter by device ID | `?device=42` |
| `application` | string | Filter by application name | `?application=YouTube` |
| `start_date` | date | Start of date range | `?start_date=2026-01-01` |
| `end_date` | date | End of date range | `?end_date=2026-01-31` |

**Example — Get Top Apps for a Device:**

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  "https://203.0.113.10/api/v1/dpi/app-traffic/?device=42&start_date=2026-01-01"
```

**Response:**

```json
{
  "count": 15,
  "results": [
    {
      "id": 5001,
      "device": 42,
      "application": "YouTube",
      "category": "Streaming",
      "bytes_in": 5368709120,
      "bytes_out": 104857600,
      "timestamp": "2026-01-15T14:00:00Z"
    }
  ]
}
```

## DPI Alerts

DPI alerts are triggered when traffic anomalies or policy violations are detected.

### List Alerts

```
GET /api/v1/dpi/alert/
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `device` | integer | Filter by device ID | `?device=42` |
| `severity` | string | `low`, `medium`, `high`, `critical` | `?severity=high` |
| `status` | string | `open`, `acknowledged`, `resolved` | `?status=open` |
| `start_date` | date | Alert date range start | `?start_date=2026-01-01` |

**Example:**

```bash
curl -s \
  -H "Authorization: Token <your-token>" \
  "https://203.0.113.10/api/v1/dpi/alert/?severity=high&status=open"
```

## DPI Sink (Ingestion Endpoint)

The sink endpoint receives DPI data pushed by NexappOS routers. This endpoint is called by the router's background DPI collection process and is not intended for direct use by administrators.

```
POST /api/v1/dpi/sink/
```

**Authentication:** Device key via `X-Device-Key` header (not the user API token).

**Rate Limit:** 600 requests per hour per device.

**Request Headers:**

```
X-Device-Key: <device-key-from-controller>
Content-Type: application/json
```

**Request Body:**

```json
{
  "device_id": 42,
  "timestamp": "2026-01-15T14:00:00Z",
  "snapshots": [
    {
      "application": "YouTube",
      "category": "Streaming",
      "bytes_in": 5368709120,
      "bytes_out": 104857600
    }
  ]
}
```

**Response:**

```json
{"status": "accepted", "records_processed": 1}
```

!!! note "Router-Only Endpoint"
    The sink endpoint is called automatically by NexappOS routers. Administrators do not need to call this endpoint manually. Device keys are managed via **Devices**.

## Pagination

All list endpoints use the standard pagination format with `count`, `next`, `previous`, and `results` fields. Default page size is 20. Maximum is 100. Use `?page_size=100` for large date range queries.

## See Also

- [API Authentication](authentication.md) — Token setup and rate limits
- [NsBond API Reference](nsbond.md) — SD-WAN management endpoints
- [DPI Analytics Overview](../09-dpi/overview.md) — DPI dashboard and analytics features
- [API Troubleshooting](../16-troubleshooting/api.md) — Common API errors
