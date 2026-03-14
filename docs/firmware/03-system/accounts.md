# User Accounts

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Account page lets you manage your personal settings on the NexappOS router, including your login password, UI language, and two-factor authentication (2FA). These settings apply to the currently logged-in user.

## Prerequisites

- You are logged into the NexappOS web UI.
- For two-factor authentication: you have an authenticator app installed on your mobile device (e.g., Google Authenticator, Microsoft Authenticator, Authy).

## Configuration

### Changing the UI Language

1. Navigate to **Account** (click your username in the top-right corner, or select it from the sidebar).
2. Under **UI Language**, select your preferred language from the dropdown.
3. The interface switches to the selected language immediately.

### Changing Your Password

1. On the Account page, locate the **Change Password** section.
2. Enter your current password.
3. Enter and confirm your new password.
4. Click **Save**.

!!! tip "Strong Passwords"
    Use a password that is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special characters.

### Enabling Two-Factor Authentication

Two-factor authentication adds a second layer of security by requiring a time-based one-time password (TOTP) in addition to your regular password.

1. On the Account page, locate the **Two-Factor Authentication** section.
2. Click **Enable 2FA**.
3. A QR code is displayed. Open your authenticator app and scan the QR code.
4. Enter the six-digit verification code from your authenticator app to confirm setup.
5. Two-factor authentication is now active. On your next login, you are prompted for the code after entering your password.

### Disabling Two-Factor Authentication

1. On the Account page, locate the **Two-Factor Authentication** section.
2. Click **Disable 2FA**.
3. Confirm the action. Two-factor authentication is removed from your account.

!!! warning "Recovery"
    If you lose access to your authenticator app, you will not be able to log into the web UI. Before enabling 2FA, ensure you have a backup method (e.g., recovery codes or SSH access to the router).

## Verification

1. After changing your password, log out and log back in with the new password to confirm it works.
2. After enabling 2FA, log out and verify that the login page prompts you for a TOTP code.
3. After changing the UI language, verify that all menus and labels display in the selected language.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| "Incorrect password" when changing password | The current password you entered does not match your actual password. | Re-enter your current password carefully. If you have forgotten it, ask another administrator to reset it via SSH. |
| Authenticator code rejected during 2FA setup | The code expired (TOTP codes are valid for 30 seconds), or the router's clock is out of sync. | Ensure the router's clock is synchronized via NTP (see [System Settings](settings.md)). Generate a fresh code and enter it within 30 seconds. |
| Locked out after enabling 2FA | You no longer have access to the authenticator app. | Connect to the router via SSH and disable 2FA from the command line. Contact your network administrator for assistance. |
| Language change does not persist | A browser cache issue may prevent the language preference from being stored. | Clear your browser cache and cookies, then set the language again. |
| Password change fails with no error message | A network timeout occurred. | Check your network connection and try again. Verify the router is responsive by refreshing the page. |
