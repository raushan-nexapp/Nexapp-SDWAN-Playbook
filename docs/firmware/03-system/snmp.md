# SNMP

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

SNMP (Simple Network Management Protocol) allows network management systems to monitor your NexappOS router remotely. You can query device metrics such as CPU load, memory usage, interface counters, and uptime from any SNMP-compatible monitoring platform (e.g., PRTG, Zabbix, LibreNMS). NexappOS supports both SNMPv2c and SNMPv3.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- You have an SNMP management station configured to poll your router.
- For SNMPv3: you have decided on a username, authentication hash, and encryption method.

## Configuration

### Enabling SNMP

1. Navigate to **System > SNMP**.
2. Toggle the **Service** switch to **Enable**.
3. Select the **SNMP Version**: SNMPv2c or SNMPv3.

### SNMPv2c Settings

When you select SNMPv2c, the following fields appear:

| Field | Description | Example |
|---|---|---|
| **Port** | The port the SNMP agent listens on (1--65535). | `161` |
| **Community** | The community string used for read access (max 32 characters). | `public` |
| **Trap IP** | The IP address of the SNMP manager that receives traps. | `192.0.2.10` |
| **Trap Port** | The port on the SNMP manager for receiving traps. | `162` |

### SNMPv3 Settings

When you select SNMPv3, three sections appear:

**Connection:**

| Field | Description | Example |
|---|---|---|
| **Port** | The SNMP agent listening port. | `161` |
| **Trap IP** | The SNMP manager IP for receiving traps. | `192.0.2.10` |

**Authentication:**

| Field | Description |
|---|---|
| **Username** | The SNMPv3 user name (max 32 characters). |
| **Password** | The authentication password (max 32 characters). |
| **Hash Algorithm** | Choose **MD5** or **SHA** for authentication hashing. |

**Encryption:**

| Field | Description |
|---|---|
| **Encryption Method** | Choose **AES** or **DES** for encrypting SNMP traffic. |
| **Encryption Key** | The privacy passphrase (8--32 characters). |

### Saving

1. After filling in all required fields, click **Save**.
2. A success notification confirms the settings were applied.

### Disabling SNMP

1. Toggle the **Service** switch to **Disable**.
2. Click **Save**. The SNMP agent stops immediately.

## Verification

1. From your SNMP management station, run a test query against the router:
    - **SNMPv2c:** `snmpwalk -v2c -c <community> <router-ip> system`
    - **SNMPv3:** `snmpwalk -v3 -u <username> -a SHA -A <password> -x AES -X <encryption-key> -l authPriv <router-ip> system`
2. Verify you receive system description, uptime, and contact information in the response.
3. To verify traps, trigger a test event and confirm your management station receives the notification.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| SNMP queries return no response | The SNMP service is disabled or the port is blocked by the firewall. | Verify the service is enabled in the web UI. Add a firewall rule allowing inbound UDP on the SNMP port from your management station's IP. |
| "Community string mismatch" on management station | The community string on the router does not match the one configured on your management station. | Verify both sides use the same community string (case-sensitive). |
| SNMPv3 authentication fails | Incorrect username, password, or hash algorithm mismatch. | Verify the username, password, and hash algorithm match on both the router and the management station. |
| Traps not received by management station | Trap IP or trap port is incorrect, or a firewall blocks the traffic. | Verify the trap destination IP and port. Ensure no firewall between the router and the management station blocks outbound UDP on the trap port. |
| "Failed to save settings" error | A required field is missing or has an invalid value. | Check that all fields are filled in and ports are within the 1--65535 range. Passwords must meet the minimum length requirements. |
