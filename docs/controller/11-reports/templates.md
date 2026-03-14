# Report Templates

## Overview

Report Templates define what data is included in a report, how it is formatted, and what date range it covers. Once a template is created, it can be exported on demand or attached to an email schedule for automatic delivery.

Navigate to **Report** to view and manage templates.

## Built-in Template Types

The controller ships with four ready-to-use template types:

| Type | Description | Common Use |
|------|-------------|-----------|
| **Topology Summary** | Overview of one or more topologies: device count, uptime %, total bandwidth, overlay status | Weekly management report |
| **Device Inventory** | Full list of registered devices with model, firmware version, registration date, and last-seen timestamp | Asset audit, compliance |
| **SLA Compliance** | SLA metric trends per topology and device: average RTT, jitter, loss, and compliance % against configured thresholds | Monthly SLA review with customers |
| **Traffic Analytics** | Top applications, categories, and per-device bandwidth breakdown for the selected period | Bandwidth planning, capacity review |

## Creating a Custom Template

1. Navigate to **Report**.
2. Click **Add Template**.
3. Fill in the template form:

| Field | Description |
|-------|-------------|
| **Template Name** | Descriptive name (e.g., "Monthly SLA — Mumbai Topology") |
| **Type** | Select from the four built-in types, or choose **Custom** |
| **Scope** | Select All Topologies, a specific Topology, or a specific set of Devices |
| **Date Range Type** | Relative (Last 7 days, Last 30 days, Last 90 days) or Absolute (fixed start/end date) |
| **Output Format** | PDF, CSV, or Both |
| **Sections** | For Custom type: select which data sections to include and reorder with drag-and-drop |

4. Click **Preview** to render a sample report using the most recent 24 hours of data.
5. Click **Save** when satisfied.

## Template Variables

Templates support variables that resolve dynamically when the report is generated. Variables can be used in the report title, header, and email subject/body:

| Variable | Resolves to |
|----------|------------|
| `{{topology_name}}` | Name of the selected topology |
| `{{start_date}}` | Report period start date (YYYY-MM-DD) |
| `{{end_date}}` | Report period end date (YYYY-MM-DD) |
| `{{device_count}}` | Number of devices included in the report |
| `{{org_name}}` | Name of the organization |
| `{{generated_at}}` | Date and time the report was generated |

Example title: `{{topology_name}} — Monthly Report {{start_date}} to {{end_date}}`

## Custom Sections

When creating a Custom template, you can select and reorder any combination of the following sections:

- Executive Summary (total bandwidth, device count, uptime %)
- Topology Map (diagram of hub-spoke topology)
- Device Inventory Table
- SLA Compliance Table (with pass/fail indicators)
- Top Applications by Bandwidth
- Top Categories Chart
- Per-Device Usage Table
- Cellular Usage Summary
- Alert History
- Deployment History

Use drag-and-drop handles in the Sections list to reorder sections. The report renders sections in the order shown.

## Output Formats

**PDF** — A formatted A4 document with the Nexapp logo, organization name, and report date in the header. Charts are rendered as inline images. Tables use zebra-striping for readability. Page numbers and a table of contents are included for reports over 5 pages.

**CSV** — Raw tabular data suitable for import into Excel, Google Sheets, or a BI tool. Each section becomes a separate sheet in the CSV package (delivered as a ZIP archive with multiple `.csv` files). Charts are not included in CSV output.

## Organization Scope

Templates are scoped to the organization they are created in. All users within the same organization can view and use shared templates. Templates created by one organization are not visible to other organizations.

To share a template across organizations, the super-administrator can export it from one organization and import it into another.

## Editing and Deleting Templates

To edit a template, click its name in the Templates list and modify the fields. Click **Save** to apply changes. Edits take effect on the next report export or scheduled send — they do not retroactively change previously generated reports.

To delete a template, click **Delete** from the template detail page. Deleting a template also removes all associated email schedules. Historical report files already sent are not affected.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Preview shows no data | No data available for the auto-selected preview range | Generate a report for a custom date range where you know data exists |
| PDF renders incorrectly in browser | Browser PDF viewer limitations | Download the file and open it in a dedicated PDF reader |
| CSV export produces empty sheets | Template includes sections with no data for the selected scope | Verify the scope includes devices that have data for the date range |
| Template not visible to a colleague | Template created under a different organization | Confirm both users are members of the same organization |

!!! info "See Also"
    - [Email Scheduling](email-scheduling.md) — Automate report delivery by email
    - [Export (PDF/CSV)](export.md) — On-demand report download
    - [DPI Analytics](../09-dpi/overview.md) — Data source for Traffic Analytics templates
    - [SLA Monitoring](../06-policies/overview.md) — Data source for SLA Compliance templates
