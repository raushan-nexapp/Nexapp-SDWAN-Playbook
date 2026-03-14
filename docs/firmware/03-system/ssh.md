# SSH Access

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

SSH provides secure command-line access to your NexappOS router for advanced troubleshooting, diagnostics, and automation. You can configure the SSH listening port, authentication methods, and manage authorized public keys through the web UI.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- If you plan to use key-based authentication, you have an SSH public key (e.g., generated with `ssh-keygen`).

## Configuration

### SSH Settings

1. Navigate to **System > SSH**.
2. The **SSH Access** section displays the current configuration.
3. Configure the following:

| Setting | Description | Default |
|---|---|---|
| **TCP Port** | The port the SSH server listens on (1--65535). | 22 |
| **Allow SSH Password Authentication** | When enabled, users can log in with a username and password. | Off |
| **Allow Root Login with Password** | When enabled, the root user can authenticate with a password. Requires password authentication to be enabled. | Off |
| **Allow Remote Host Connection (Gateway Ports)** | When enabled, forwarded ports are accessible from remote hosts, not just localhost. | Off |

4. Click **Save** to apply changes.

!!! tip "Security Best Practice"
    For production environments, disable password authentication and use SSH key-based authentication instead. If you must allow password login, change the default port from 22 to reduce automated scanning attempts.

### SSH Keys

In **Standalone Mode**, an **SSH Keys** section appears below the SSH settings. This section lets you manage the public keys authorized to log in without a password.

**To add a key:**

1. Scroll down to the **SSH Keys** section.
2. Paste your public key into the text field. The key must be in standard OpenSSH format (e.g., `ssh-rsa AAAA... user@host` or `ssh-ed25519 AAAA... user@host`).
3. Click **Add Key**.
4. A success notification confirms the key was added. The key now appears in the list with its type and comment.

**To remove a key:**

1. Locate the key you want to remove in the list.
2. Click the trash icon next to the key.
3. A confirmation dialog appears. Click **Delete** to confirm.

## Connecting via SSH

After configuration, connect from a terminal:

```bash
ssh root@192.168.1.1 -p 22
```

Replace `192.168.1.1` with your router's LAN IP address and `22` with your configured port.

If you are using key-based authentication:

```bash
ssh -i ~/.ssh/id_ed25519 root@192.168.1.1 -p 22
```

## Verification

1. After saving SSH settings, open a terminal and attempt an SSH connection to the configured port.
2. If you added an SSH key, verify you can log in without being prompted for a password.
3. If you disabled password authentication, verify that password login attempts are rejected.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Connection refused" when connecting via SSH | The SSH port was changed or the service is not running. | Verify the port in **System > SSH**. Ensure your firewall allows inbound traffic on the configured port. |
| "Permission denied" with correct password | Password authentication is disabled. | Enable **Allow SSH Password Authentication** in the SSH settings, or add your public key to the authorized keys list. |
| "Permission denied" with SSH key | The key format is invalid or the wrong key was added. | Verify you pasted the public key (not the private key). Ensure the key format is `ssh-rsa`, `ssh-ed25519`, or `ecdsa-sha2-nistp256`. |
| Cannot access SSH from a remote network | Firewall rules block the SSH port from the WAN zone. | Add a firewall rule to allow inbound TCP traffic on your SSH port from the desired source. |
| SSH key deletion fails | A network error interrupted the request. | Refresh the page and try again. Check the system logs if the issue persists. |
