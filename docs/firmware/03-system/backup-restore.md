# Backup and Restore

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

Backup and Restore lets you save your router's complete configuration to a file and restore it later. You can download backups to your local computer, encrypt them with a passphrase for security, and restore from either a local file or a cloud backup. A separate Migration tab allows you to import configurations from legacy systems.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For encrypted backups: you have set a backup passphrase.
- For cloud backups: you have an active subscription registered on the router.

## Configuration

### Creating a Backup

1. Navigate to **System > Backup and Restore**.
2. You are on the **Backup** tab by default.

**Without a subscription (local backups):**

- Click **Download Unencrypted** to download a plain backup file (`.tar.gz`).
- To download an encrypted backup, first configure a passphrase (see below), then click **Download Encrypted**. The file is saved as `.tar.gz.gpg`.

**With an active subscription (cloud backups):**

- Click **Run Cloud Backup** to upload an encrypted backup to the cloud. This button is available only after you set a passphrase.
- Previously created cloud backups appear in a table showing date, encryption type, and size.
- Click **Download** next to any backup to retrieve it from the cloud.
- Click the actions menu next to a backup and select **Delete** to remove it from cloud storage.

### Managing the Backup Passphrase

The passphrase encrypts your backup files. Without it, you cannot create encrypted backups or restore encrypted archives.

1. On the Backup tab, locate the **Passphrase** section.
2. Click **Configure Passphrase** (or **Edit Passphrase** if one is already set).
3. Enter and confirm your passphrase.
4. Click **Save**.

To remove the passphrase, click **Remove Passphrase** and confirm. After removal, encrypted backups are no longer possible until you set a new passphrase.

!!! warning "Remember Your Passphrase"
    If you lose the passphrase, encrypted backup files cannot be restored. Store the passphrase in a secure location.

### Restoring a Backup

1. Click the **Restore** tab.
2. Click **Restore Backup** to open the restore drawer.
3. Choose the restore source:

| Source | When to Use |
|---|---|
| **From Backup** (subscription only) | Select a cloud backup from the dropdown list. |
| **From File** | Upload a `.tar.gz`, `.tar.gz.gpg`, or `.bin` backup file from your computer. |

4. If the backup is encrypted, enter the passphrase in the **Passphrase** field.
5. Click **Restore**. A progress dialog appears while the router applies the configuration.
6. The router reboots automatically after the restore completes. You are redirected to the login page.

!!! warning "Restore Overwrites Configuration"
    Restoring a backup replaces all current settings. Make sure you have a current backup before restoring an older one.

### Migration

1. Click the **Migration** tab.
2. Click **Upload File** to upload a configuration export from a legacy system.
3. The router imports compatible settings and applies them.

## Verification

1. After creating a backup, verify the downloaded file is not empty (typical size is 10--200 KB for unencrypted, slightly larger for encrypted).
2. After restoring, log back in and confirm your hostname, network settings, and firewall rules match the backup.
3. For cloud backups, verify the new entry appears in the backup list with the correct date and size.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Passphrase not configured" warning | No encryption passphrase has been set. | Click **Configure Passphrase** on the Backup tab and set a passphrase. |
| Restore fails with passphrase error | The wrong passphrase was entered for an encrypted backup. | Verify you are using the exact passphrase that was set when the backup was created. |
| Cloud backup button is disabled | No active subscription or passphrase is not set. | Register your subscription and configure a backup passphrase. |
| Restore progress hangs | The router is applying configuration and rebooting. | Wait up to 60 seconds. If the page does not reload, manually navigate to the router's IP address. |
| Uploaded file is rejected | The file format is not supported. | Ensure the file has a `.tar.gz`, `.tar.gz.gpg`, or `.bin` extension. |
