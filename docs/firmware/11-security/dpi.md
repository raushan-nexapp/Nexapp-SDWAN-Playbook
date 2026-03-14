# DPI Engine (Deep Packet Inspection)

!!! note "Standalone & Controller-Managed"
    The DPI engine runs locally on the router for real-time traffic classification. When controller-managed, the controller collects DPI analytics for centralized reporting and policy enforcement.

## Overview

Deep Packet Inspection (DPI) identifies applications in your network traffic regardless of the port or protocol they use. For example, DPI can distinguish YouTube streaming from a regular HTTPS download on port 443. You can use DPI classification for traffic steering, QoS prioritization, and security policies that block or limit specific applications.

Navigate to **Security > DPI Engine** to access this page.

## Prerequisites

- You have administrator access to the NexappOS web UI.
- The router has at least one WAN interface configured and connected.
- If you plan to use DPI with SD-WAN steering or QoS, configure those features first.

## Configuration

### Enabling the DPI Engine

1. Navigate to **Security > DPI Engine**.
2. Toggle the **DPI Engine** switch to **Enabled**.
3. Once enabled, five tabs appear: **Traffic Overview**, **Rules**, **Exceptions**, **Policy**, and **App Database**.

### Traffic Overview

The **Traffic Overview** tab displays real-time application traffic detected on the router. You can see which applications are consuming bandwidth, their traffic volume, and the interfaces they traverse. Use this view to identify unexpected traffic patterns before creating rules.

### Rules

Rules let you block or allow specific applications. To create a DPI rule:

1. Click the **Traffic Overview**, **Rules**, or navigate to the **Rules** tab.
2. Click **Add Rule**.
3. Select one or more applications from the application list.
4. Choose the action: **Block** or **Allow**.
5. Click **Save**.

| Field | Description |
|-------|-------------|
| **Application** | The application to match (e.g., `YouTube`, `BitTorrent`, `Zoom`). |
| **Action** | Whether to block or allow the matched traffic. |

### Exceptions

Exceptions exempt specific interfaces from DPI rule enforcement. For example, you might exempt a management interface so administrative traffic is never blocked.

1. Navigate to the **Exceptions** tab.
2. Click **Add Exception**.
3. Select the interface to exempt (e.g., `lan`, `guest`).
4. Click **Save**.

### Policies

Policies define app-aware traffic steering. You can redirect traffic for specific applications to a particular WAN link or apply bandwidth limits.

1. Navigate to the **Policy** tab.
2. Click **Add Policy**.
3. Select the target applications and the desired action (redirect, limit, or prioritize).
4. Click **Save**.

### App Database

The **App Database** tab lists all recognized applications and their categories. You can search for applications by name and view which category they belong to (e.g., Streaming, Social Media, File Sharing). Custom applications can be added if the default database does not include your target application.

## Verification

1. Enable the DPI engine and wait 30 seconds for classification to begin.
2. Open the **Traffic Overview** tab and confirm that applications appear with traffic counters.
3. Create a test rule to block a specific application (e.g., `BitTorrent`).
4. Generate traffic for that application and verify it is blocked.
5. Check the **Exceptions** tab to confirm exempted interfaces are not affected by rules.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| DPI not classifying traffic | Engine recently enabled; classification needs time to build up | Wait 30--60 seconds after enabling. Refresh the Traffic Overview tab. |
| Application not recognized | Traffic uses an unknown or proprietary protocol | Check the App Database for the application. Add a custom application entry if needed. |
| Rule not blocking traffic | Exception exists for the interface carrying the traffic | Review the Exceptions tab and remove the exception for the target interface. |
| Exceptions not working | Exception was added but changes were not applied | Click **Save** after adding the exception, then verify pending changes are applied. |
| High CPU usage with DPI enabled | Heavy traffic volume on multiple WAN links | Consider disabling DPI on low-priority interfaces using exceptions. |

!!! info "See Also: Controller Manual"
    For centralized DPI analytics, traffic dashboards, and application intelligence across all devices, see
    [DPI Analytics Overview](../../controller/09-dpi/overview.md) in the Controller Manual.

!!! info "See Also"
    - [Traffic Steering](../06-sla/traffic-steering.md) -- Use DPI classifications in steering policies
    - [QoS Overview](../07-qos/overview.md) -- Prioritize traffic based on DPI application categories
