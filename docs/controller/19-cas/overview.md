# CAs & Certificates

## Overview

The CAs & Certificates section manages the Public Key Infrastructure (PKI) for your SD-WAN deployment. You create Certificate Authorities (CAs) and issue device certificates that are used for VPN authentication, controller-to-device TLS, and OpenVPN mutual authentication.

Navigate to **Cas & Certificates** in the controller sidebar.

---

## Concepts

| Term | Description |
|------|-------------|
| **CA (Certificate Authority)** | Root or intermediate CA that signs device certificates |
| **Certificate** | Device-specific certificate signed by a CA |
| **Key** | Private key paired with a certificate |
| **CRL** | Certificate Revocation List — invalidated certificates |

---

## Certificate Authorities

### Creating a CA

1. Navigate to **Cas & Certificates > CAs**
2. Click **Add CA**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Name** | CA identifier (e.g., `NexappOS-Root-CA`) |
| **Organization** | Owner org |
| **Key Length** | 2048 or 4096 bits |
| **Digest** | SHA-256 recommended |
| **Validity** | Validity period in days (e.g., 3650 for 10 years) |
| **Country / State / City** | Certificate subject fields |
| **Common Name** | CA common name |

4. The controller generates the CA key and self-signed certificate automatically.

### CA Actions

| Action | Description |
|--------|-------------|
| **Renew** | Issue a new CA certificate with extended validity |
| **Download** | Download CA certificate (`.crt`) for distribution |
| **Revoke** | Revoke a subordinate certificate |

---

## Device Certificates

### Issuing a Certificate

1. Navigate to **Cas & Certificates > Certificates**
2. Click **Add Certificate**
3. Select the **CA** that will sign this certificate
4. Fill in subject information (Common Name = device FQDN or identifier)
5. Set **Validity** in days
6. Click **Save** — the controller generates the key pair and issues the certificate

### Using Certificates

Certificates are referenced by:

- **VPN Server** objects (for OpenVPN server certificate)
- **VPN Templates** (for device client certificates)
- **Custom templates** (raw UCI reference to cert file paths)

---

## Certificate Revocation

When a device is decommissioned or a key is compromised:

1. Navigate to **Cas & Certificates > Certificates**
2. Select the certificate
3. Click **Revoke** — adds it to the CA's CRL
4. Redeploy the CRL to all OpenVPN servers to enforce revocation

---

## Certificate Expiry

The controller shows a warning badge on certificates expiring within 30 days. Renew before expiry to avoid VPN disruptions:

1. Select the expiring certificate
2. Click **Renew** — issues a new certificate with the same subject, extended validity
3. Push the updated VPN template to affected devices

---

## See Also

- [VPN Servers](../17-configurations/vpn-servers.md)
- [Configuration Templates](../17-configurations/templates.md)
- [VPN (Firmware Manual)](../../firmware/12-vpn/openvpn-s2s.md)
