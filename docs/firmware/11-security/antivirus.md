# Antivirus

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Antivirus feature provides file-based malware scanning on your NexappOS router using the ClamAV engine. You can enable real-time scanning of network traffic, configure detection actions, manage quarantined files, and run on-demand scans of specific files. A separate **Gateway Scanning** tab integrates antivirus with the web gateway proxy for HTTP/SMTP traffic inspection.

## Prerequisites

- The ClamAV package is installed on the router (included by default in NexappOS 10.01+).
- Sufficient storage space for the virus signature database (approximately 300 MB).

## Configuration

Navigate to **Security > Antivirus**.

The page has three tabs: **Setting**, **Isolate File**, and **Gateway Scanning**.

### Setting Tab

Configure the core antivirus engine.

| Field | Description | Default |
|---|---|---|
| **Service** | Toggle the antivirus engine on or off. | Off |
| **Update Interval** | How often virus signatures are updated, in seconds (`0`--`604800`). Set to `86400` for daily updates. | `86400` |
| **Max File Size** | Maximum file size to scan, in MB (`1`--`4096`). | `25` |
| **Detection Action** | What happens when a virus is found: **Block** (drop the file), **Log** (record only), or **Quarantine** (move to isolation). | Block |
| **Auto Update** | Automatically download the latest virus signatures on schedule. | Off |
| **FTP Scanning** | Scan files transferred via FTP. | Off |

The **Status** card below the toggle shows whether the antivirus daemon is running, the current signature version, database file count, and quarantine count.

**To save settings:** Configure the fields and click **Save**.

**To update signatures manually:** Click **Update Signatures**. A notification confirms when the update begins.

**On-Demand Scan:** Enter a file path (e.g., `/tmp/suspicious_file`) in the **On-Demand Scan** section and click **Scan Now**. The result indicates whether the file is clean or infected, and shows the virus name if detected.

### Isolate File Tab

View and manage quarantined files.

| Column | Description |
|---|---|
| **File Name** | The original name of the quarantined file. |
| **Size** | File size in bytes, KB, or MB. |
| **Quarantined At** | Date and time the file was quarantined. |

**To delete a quarantined file:** Click **Delete** next to the file. The file is permanently removed.

### Gateway Scanning Tab

Configure antivirus scanning through the web gateway proxy. This tab controls settings for the ICAP-based scanner that inspects HTTP and SMTP traffic passing through the gateway.

| Field | Description |
|---|---|
| **HTTP Scanning** | Scan HTTP downloads for malware. |
| **SMTP Scanning** | Scan email attachments for malware. |
| **Max Scan Size** | Maximum file size for gateway scanning (MB). |
| **Block Encrypted Archives** | Block password-protected archives that cannot be scanned. |
| **Scan Archives** | Extract and scan files inside archive formats (ZIP, TAR, etc.). |

The dashboard cards show scan statistics: total scanned, clean, infected, and errors. A **Recent Detections** table lists the latest virus detections with timestamps.

## Verification

1. After enabling the service, check that the status card shows **Running** and a recent signature date.
2. Download the EICAR test file (`eicar.com`) through the router to verify detection.
3. Check the **Isolate File** tab to confirm quarantined files appear when the action is set to Quarantine.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Status shows "Stopped" after enabling | Insufficient memory or storage for the signature database. | Check available storage with **System > Storage**. Free at least 300 MB for the virus database. |
| Signature update fails | The router does not have internet access. | Verify WAN connectivity. Check DNS resolution. Ensure the firewall allows outbound HTTPS. |
| Gateway scanning not detecting threats | The web gateway proxy is disabled. | Navigate to **Security > SSL Inspection** and enable the gateway service. |
| On-demand scan reports "file not found" | The specified file path does not exist on the router. | Verify the path via SSH. Use absolute paths (e.g., `/tmp/filename`). |

## See Also

- [SSL Inspection](ssl-inspection.md)
- [Web Filter](web-filter.md)
- [Security Analytics](analytics.md)
