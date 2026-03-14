# Device Registration

## Overview

Device registration is the process by which a NexappOS router introduces itself to the controller and enters the managed fleet. Registration is automatic and requires no action on the router beyond setting the controller URL. This page explains how registration works, how to approve devices, and how to configure auto-approval for trusted deployments.

## How Registration Works

NexappOS routers include a registration agent that runs at startup. The registration flow is:

1. The registration agent reads the controller URL from the router's configuration
2. It sends a registration request to `https://<controller>/api/v1/` with the router's hardware identity (MAC address, model, serial number)
3. The controller creates a device record with status **Pending**
4. An administrator reviews and approves the device in **Devices > Devices**
5. On approval, the controller:
   - Generates a unique device key for API authentication
   - Assigns the device to an organization
   - Adds the device to the ZeroTier management network
   - Begins status polling every 30 seconds
6. The device appears in **Devices** with status **Online** once the ZeroTier connection is established

## Prerequisites

Before registering a device:

- The NexappOS router must have internet access and be able to reach `https://<controller>/` on port 443
- The controller must be running and the ZeroTier network ID must be configured (see [Initial Configuration](../02-installation/initial-config.md))
- The router must be running NexappOS 10.01 or later (registration agent is included)

## Configuring the Router to Register

On the NexappOS router, navigate to **System > Controller** in the router web UI and fill in:

| Field | Value |
|---|---|
| **Controller URL** | `https://<controller>/` (include trailing slash) |
| **Organization** | Leave blank — the admin assigns the organization on approval |

Click **Save and Register**. The router contacts the controller within 30 seconds.

!!! note "Firewall Consideration"
    The router only needs outbound HTTPS (port 443) access to the controller URL. No inbound ports need to be opened on the router — all ongoing management communication goes through the ZeroTier overlay after registration.

## Approving Devices in the Controller

Navigate to **Devices > Devices** to see all devices awaiting approval. Each entry shows:

| Column | Description |
|---|---|
| **Name** | Hostname set on the router |
| **Model** | Hardware model (e.g., NexappOS IRX400-GE) |
| **MAC Address** | Primary interface MAC |
| **First Seen** | Timestamp of the registration request |
| **Last Contact** | Most recent heartbeat from the device |

To approve a device:

1. Click the device row to open its detail panel
2. Verify the hardware details match the device you intended to register
3. Select the **Organization** to assign this device to
4. Optionally set a **Name** and **Location** for the device
5. Click **Approve**

The device moves to the active device list. The controller immediately provisions the ZeroTier membership and the device's status changes to **Online** within 30–60 seconds.

To reject a device (e.g., an unauthorized registration attempt):

1. Click the device row
2. Click **Reject**
3. The device is removed from the pending list and cannot re-register with the same hardware identity without administrator intervention

## Auto-Approval

For trusted deployments (e.g., factory-provisioned routers at known sites), auto-approval eliminates the manual approval step.

Navigate to **Settings** and configure:

| Setting | Description |
|---|---|
| **Auto-Approve** | Enable automatic approval for new devices |
| **Default Organization** | Organization assigned to auto-approved devices |
| **Allow Subnet** | Only auto-approve devices registering from this IP range (e.g., `198.51.100.0/24`) |

!!! warning "Security Note"
    Auto-approval with no subnet restriction means any device that knows the controller URL and has internet access can self-register and join the management network. Enable auto-approval only when the controller URL is not publicly known, or restrict it to a known IP range.

## Device Key

After approval, each device has a unique **device key** — a long random string used to authenticate all API calls between the router and controller. You can view (but not change) the device key from **Devices > [device-name] > Advanced**.

If a device key is compromised, regenerate it from the same page. The router will automatically receive the new key via the management plane on its next heartbeat.

## ZeroTier Management Plane

After approval, the controller adds the device to the ZeroTier network (network ID configured in **Settings**). The device receives a ZeroTier IP address in the `10.0.0.0/24` subnet. The controller uses this ZeroTier IP for:

- Status polling every 30 seconds
- Configuration push (topology deployment, policy updates)
- Remote terminal access
- DPI data ingestion (device-initiated)

The ZeroTier join is automatic and transparent to the user.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Device does not appear in Pending | Router cannot reach controller URL | Verify port 443 is reachable from the router's WAN: `curl -k https://<controller>/api/v1/` |
| Device stuck in Pending indefinitely | Admin has not approved | Navigate to **Devices > Devices** and approve the device |
| Device approved but shows Offline | ZeroTier not joined | Check ZeroTier network ID in **Settings** and verify the device received a ZT IP |
| Wrong device approved by mistake | Human error during approval | Navigate to **Devices > [device-name]**, click **Deregister**, and re-approve the correct device |

!!! info "See Also"
    - [Device Configuration](configuration.md) — Push configuration templates to registered devices
    - [Device Monitoring](monitoring.md) — Status polling, alerts, and health graphs
    - [Initial Configuration](../02-installation/initial-config.md) — ZeroTier network setup
