# Export (PDF / CSV)

## Overview

On-demand export lets you generate and download a report immediately without setting up a schedule. Use it for ad-hoc analysis, one-off customer deliverables, or to preview a template's output before configuring automatic email delivery.

Navigate to **Report**, open any template, and click **Export Now** to begin.

## Export Workflow

1. Navigate to **Report**.
2. Click the template you want to export.
3. Click **Export Now** in the top-right of the template detail page.
4. In the export dialog, configure:

| Field | Description |
|-------|-------------|
| **Date Range** | Select a preset (Last 7 days, Last 30 days, Last 90 days) or enter a custom start and end date |
| **Format** | PDF, CSV, or Both |
| **Scope Override** | Optionally restrict this export to a specific topology or device, overriding the template's default scope |

5. Click **Generate Report**.
6. For small reports (under 10 MB), the file downloads immediately in your browser.
7. For large reports, a progress notification appears. When the export is ready, a download button appears in the notification and an email with a download link is sent to your address.

## PDF Format Details

PDF exports use A4 portrait orientation and include:

- **Header** — Organization name, report title, and date range on every page
- **Table of contents** — Auto-generated for reports with more than 3 sections
- **Charts** — Rendered as inline PNG images (bar charts, line charts, donut charts)
- **Tables** — Zebra-striped rows with column headers repeated on each page break
- **Footer** — Page number and generation timestamp

The PDF is formatted for print. Charts scale to fit the page width. Large tables that exceed one page continue on the next page with the header row repeated.

## CSV Format Details

CSV exports produce one `.csv` file per data section, packaged into a single `.zip` archive:

| File in ZIP | Contents |
|-------------|---------|
| `summary.csv` | Executive summary metrics (bandwidth totals, device count, uptime %) |
| `devices.csv` | Per-device rows (Name, RX, TX, Top App, Last Updated) |
| `applications.csv` | Per-application rows (App Name, Category, Bytes In, Bytes Out, Sessions) |
| `sla_compliance.csv` | Per-device SLA rows (Device, Avg RTT, Avg Jitter, Avg Loss, Compliance %) |
| `alerts.csv` | Alert history rows for the report period |

Not all files are present in every export — only sections included in the template are written.

## Date Range Limits

| Constraint | Value |
|------------|-------|
| Maximum single export range | 90 days |
| Data retention window | 90 days |
| Minimum range | 1 day |

Attempting to export a range older than the retention window returns an empty report. To access data beyond 90 days, enable longer retention in your organization settings (requires administrator access).

## Large Export Handling

Exports that exceed 10 MB are processed in the background:

1. After clicking **Generate Report**, a notification appears: "Your report is being prepared."
2. You can navigate away — the export continues in the background.
3. When ready, the notification updates with a **Download** button and an email is sent to your registered email address.
4. The download link is valid for 7 days. After 7 days, the file is automatically deleted from the controller.

## API Export

Reports can also be exported programmatically via the REST API:

```
GET /api/v1/reports/export/
    ?template=<template_id>
    &start=<YYYY-MM-DD>
    &end=<YYYY-MM-DD>
    &format=pdf
```

**Authentication** — Include your API token: `Authorization: Token <your-token>`

**Response for small reports** — The API returns the file directly as a binary stream with the appropriate `Content-Type` header (`application/pdf` or `application/zip`).

**Response for large reports** — The API returns HTTP 202 Accepted with a `Location` header pointing to a status endpoint. Poll the status endpoint until `status: ready`, then follow the `download_url`.

Example:

```
GET /api/v1/reports/export-status/<job_id>/
→ {"status": "ready", "download_url": "/api/v1/reports/download/<file_id>/", "expires_at": "2024-07-08T09:00:00Z"}
```

## File Retention

| File Type | Retention Period |
|-----------|----------------|
| On-demand exports | 7 days |
| Scheduled email reports | 7 days |
| Preview renders | 24 hours |

After the retention period, files are automatically purged. If you need longer retention, download and store the file externally or in your organization's document management system.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Export dialog shows "No date range available" | No data ingested yet | Verify devices are sending data and select a date after data collection started |
| PDF download opens as blank | Report has no data for the selected scope/range | Expand the date range or check that the template scope includes active devices |
| Large export notification never updates | Background worker is busy with other jobs | Wait a few minutes; if still pending after 10 minutes, try again or contact your administrator |
| API returns 400 Bad Request | Invalid template ID or date format | Verify template ID exists and dates are in YYYY-MM-DD format |
| ZIP file contains empty CSVs | Template sections have no data for the selected range | Adjust the date range or scope to cover a period with available data |

!!! info "See Also"
    - [Report Templates](templates.md) — Create and configure report templates
    - [Email Scheduling](email-scheduling.md) — Automate report delivery on a recurring basis
    - [REST API Reference](../14-api/authentication.md) — Full API documentation for report export
