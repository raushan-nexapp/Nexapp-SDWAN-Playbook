# Controller Registration

Registering your NexappOS router with a Nexapp SDWAN Controller enables centralized configuration, SD-WAN overlay management, fleet-wide policy distribution, and remote monitoring. This page walks you through the registration process.

!!! note "Controller-Managed Only"
    Controller registration is optional. If you plan to use the router in
    standalone mode, you can skip this page entirely.

## Prerequisites

Before you begin, confirm that you have:

- [x] Completed [Initial Setup](initial-setup.md) (password changed, WAN connected, Internet working)
- [x] The **controller URL** (for example, `https://controller.example.com`)
- [x] A **registration key** (also called a shared secret) — your controller administrator provides this
- [x] Outbound Internet access from the router's WAN interface

Your controller administrator can provide the controller URL and registration key from the controller's **Devices > Registration** page.

## Registration Process

### Step 1 — Open Controller Registration Settings

1. Log in to the NexappOS web UI at `https://<router-ip>:9090`.
2. Navigate to **System > Controller**.
3. You see the controller registration form.

### Step 2 — Enter Controller Details

Fill in the following fields:

| Field | Value | Description |
|---|---|---|
| **Controller URL** | `https://controller.example.com` | The full HTTPS URL of your Nexapp SDWAN Controller |
| **Registration Key** | (provided by admin) | The shared secret that authorizes this router to join the controller |
| **Device Name** | `branch-mumbai-01` | A descriptive name for this router (must be unique across the controller) |

!!! tip
    Use the same hostname you set during initial setup as the device name.
    This keeps identification consistent across the local UI and the controller dashboard.

### Step 3 — Register

1. Click **Register**.
2. The router initiates a secure connection to the controller.
3. Registration typically completes within 30-60 seconds.
4. The status changes to **Registered** with a green indicator.

If registration fails, check the [Troubleshooting](#troubleshooting) section below.

## Verifying Registration

### On the Router

1. Navigate to **System > Controller**.
2. Confirm the status shows **Registered** and the last check-in time is recent.
3. Navigate to **System > Dashboard** — you should see a "Controller-Managed" indicator.

### On the Controller

1. Log in to your Nexapp SDWAN Controller at `https://controller.example.com`.
2. Navigate to **Devices > List**.
3. Verify that the router appears in the device list with an **Online** status.

!!! note
    The controller checks the router's status periodically. It may take up to
    60 seconds for the router to appear as "Online" after registration.

## What Changes in Controller-Managed Mode

Once registered, the following behaviors change:

| Area | Standalone | Controller-Managed |
|---|---|---|
| **SD-WAN overlay** | Not available | Configured and deployed by the controller |
| **Routing policies** (BGP, OSPF) | Local configuration only | Can be pushed from controller; local changes may be overridden |
| **QoS policies** | Local configuration only | Can be pushed from controller |
| **SLA monitoring** | Local configuration only | Thresholds and steering rules pushed from controller |
| **Firmware updates** | Manual upload | Can be triggered remotely from controller |
| **Configuration backup** | Local export only | Automatic configuration sync to controller |
| **Network interfaces** | Full local control | Full local control (not managed by controller) |
| **Firewall rules** | Full local control | Full local control (not managed by controller) |
| **VPN (OpenVPN, WireGuard)** | Full local control | Full local control (not managed by controller) |
| **System settings** | Full local control | Full local control (not managed by controller) |

!!! note
    Registration does not lock you out of the local web UI. You retain full
    access to all local settings. Only SD-WAN overlay, routing, QoS, and SLA
    configurations may be managed by the controller.

## Management VPN

When the router registers with the controller, a management VPN tunnel is automatically established. This tunnel provides:

- **Secure communication** between the router and controller over encrypted channels
- **Remote management access** so the controller can reach the router even behind NAT
- **Telemetry collection** for real-time status monitoring and health checks

The management VPN operates on **UDP port 9993** and requires no manual configuration. It is created automatically during registration.

## Unregistering a Device

To remove the router from controller management and return to standalone mode:

1. Navigate to **System > Controller**.
2. Click **Unregister**.
3. Confirm the action in the dialog.
4. The router disconnects from the controller and resumes full standalone operation.

!!! warning
    Unregistering removes the management VPN connection and all controller-pushed
    configurations (SD-WAN overlay, routing policies, QoS). Local settings
    (interfaces, firewall, VPN) are not affected.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Registration fails with "Connection refused" | Router cannot reach the controller URL | Verify WAN has Internet access; confirm the controller URL is correct and reachable |
| Registration fails with "Unauthorized" | Incorrect registration key | Double-check the registration key with your controller administrator |
| Status shows "Registered" but controller shows "Offline" | Firewall blocking management VPN (UDP 9993) | Ensure outbound UDP 9993 is permitted on any upstream firewalls |
| Registration succeeds but SD-WAN does not start | Router not yet added to an SD-WAN topology on the controller | Ask your controller administrator to add this device to a topology |
| "Certificate error" during registration | Clock skew on the router | Set the correct date and time under **System > Settings**, or enable NTP |

!!! info "See Also"
    - [Getting Started](../01-introduction/getting-started.md) — quick start checklist
    - [SD-WAN Fabric](../05-sdwan/overview.md) — how overlay tunnels work after registration
    - Controller Manual: [Device Registration](../../controller/03-devices/registration.md) — controller-side registration workflow
