# Certificates

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Certificates page lets you manage TLS/SSL certificates used by the NexappOS web UI and reverse proxy. You can view the default self-signed certificate, import custom certificates from your organization's CA, request free certificates from Let's Encrypt, and set which certificate is used by default.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- For Let's Encrypt certificates: the router must be reachable on port 80 from the internet (for HTTP-01 validation), and you must have a valid domain name pointing to the router's public IP address.
- For custom certificates: you have the certificate file (PEM format) and the corresponding private key.

## Configuration

### Viewing Certificates

1. Navigate to **System > Certificates**.
2. The certificates table lists all installed certificates with the following columns:

| Column | Description |
|---|---|
| **Name** | The certificate's common name or label. The default system certificate is labeled "Default certificate". |
| **Type** | `self-signed`, `custom`, or `acme` (Let's Encrypt). |
| **Domain** | The domain(s) the certificate covers. |
| **Expiration** | When the certificate expires. |
| **Default** | Indicates which certificate is currently active for the web UI. |

3. Click a certificate row to view the full certificate details in PEM format.

### Importing a Custom Certificate

1. Click **Import Certificate**.
2. A drawer opens with the following fields:

| Field | Description |
|---|---|
| **Certificate Name** | A label to identify this certificate. |
| **Certificate** | Paste the PEM-encoded certificate (including `-----BEGIN CERTIFICATE-----`). |
| **Private Key** | Paste the PEM-encoded private key. |
| **Certificate Chain** | Paste any intermediate CA certificates (optional but recommended). |

3. Click **Import**. A success notification confirms the certificate was added.

### Creating a Let's Encrypt Certificate

1. Click **Add Let's Encrypt Certificate**.
2. Enter the domain name(s) you want the certificate to cover.
3. Click **Request Certificate**. The router initiates the ACME challenge with Let's Encrypt.
4. Once validated, the certificate is issued and appears in the table with type `acme`.

!!! note "Automatic Renewal"
    Let's Encrypt certificates are valid for 90 days. The router automatically renews them before expiration as long as port 80 remains accessible.

### Setting the Default Certificate

1. In the certificates table, locate the certificate you want to use as the default.
2. Click the **Set as Default** action for that certificate.
3. The web UI restarts with the new certificate. You may need to accept the new certificate in your browser.

### Deleting a Certificate

1. In the certificates table, click the **Delete** action for the certificate you want to remove.
2. Confirm the deletion in the modal dialog.

!!! warning "Cannot Delete Default"
    You cannot delete the certificate that is currently set as the default. Assign a different default first.

## Verification

1. After importing or creating a certificate, verify it appears in the certificates table with the correct name, type, and expiration date.
2. After setting a new default, open the web UI in a new browser tab and verify the browser shows the correct certificate (click the padlock icon in the address bar).
3. For Let's Encrypt certificates, verify the certificate is trusted (no browser warning) and the domain matches.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Let's Encrypt validation fails | Port 80 is not reachable from the internet, or DNS does not resolve to the router's public IP. | Ensure port 80 is forwarded to the router and that your domain's A record points to the router's public IP address. |
| Browser shows certificate warning after import | The certificate chain is incomplete, or the certificate does not match the domain. | Re-import the certificate with the full chain (root CA and intermediate certificates). Verify the certificate's CN or SAN matches the domain you use to access the router. |
| "Cannot set default certificate" error | A pending configuration change is blocking the operation. | Apply or discard pending changes, then try again. |
| Certificate shows "pending" status | The Let's Encrypt certificate request is still being processed. | Wait a few minutes. If the status does not change, check that port 80 is accessible and retry. |
| Cannot delete a certificate | The certificate is currently set as the default. | Set a different certificate as the default first, then delete the old one. |
