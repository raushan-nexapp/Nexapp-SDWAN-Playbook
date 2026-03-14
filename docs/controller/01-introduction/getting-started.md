# Getting Started

## Overview

This guide walks you through the minimum steps to go from a fresh controller installation to a deployed SD-WAN topology. You will access the controller, register your first device, and push an initial configuration — all within a few minutes.

## Prerequisites

Before you begin, confirm the following:

- The controller server is running and reachable at `https://<controller>/`
- You have admin credentials (username and password)
- At least one NexappOS router is powered on and has internet access
- The router has the `openwisp_config` package installed (included in NexappOS 10.01 and later)
- The router can reach the controller URL over the internet or your management network

## Step 1: Access the Controller Web UI

Open a browser and navigate to `https://<controller>/`. You will be redirected to the login page.

Enter your admin username and password and click **Sign In**. If this is a fresh installation, use the superuser credentials you created during setup. If you need to create a superuser, see [Manual Installation](../02-installation/manual.md).

After logging in, you will see the main dashboard with device status, topology overview, and recent activity.

## Step 2: Get Your API Token

The API token is used by CLI tools, scripts, and integrations to authenticate with the controller REST API.

1. Click your username in the top-right corner of the navigation bar
2. Select **Profile** from the dropdown menu
3. Scroll to the **API Token** section
4. Click **Generate Token** if no token exists, or copy the existing token
5. Store the token securely — treat it like a password

You can test the token immediately:

```bash
curl -s -H "Authorization: Token <your-token>" \
  https://<controller>/api/v1/health/ | python3 -m json.tool
```

A successful response shows `"status": "ok"` along with database and worker health.

## Step 3: Register Your First Device

Registration is automatic once the router is configured to contact the controller.

**On the NexappOS router**, navigate to **System > Controller** in the router web UI and set:

- **Controller URL**: `https://<controller>/`
- **Organization**: leave blank for auto-assignment (admin can set it after approval)

Save the settings. The router will contact the controller within 30 seconds.

**On the controller**, navigate to **Devices > Devices**. The router appears here with its hostname, hardware model, and the time it registered. Click **Approve** to accept the device.

After approval, the controller:
- Assigns a device key to the router
- Adds the router to the ZeroTier management network
- Begins polling device status every 30 seconds

The device moves from **Pending** to **Devices** with status **Online** (green) once the management connection is established.

## Step 4: Create Your First Topology

Navigate to **SD-WAN Fabric > Topologies** and click **Use Wizard** to launch the guided 6-step wizard.

| Step | What You Do |
|---|---|
| **1. Basic Info** | Enter topology name (e.g., `HQ-Branches`), select type: Hub-Spoke |
| **2. Select Hub** | Choose the device that will act as the central hub |
| **3. Add Spokes** | Select one or more spoke devices from the registered device list |
| **4. Overlay Settings** | Set the PSK, tunnel address range (e.g., `10.100.0.0/24`), bonding port, and encryption |
| **5. WAN Members** | For each device, choose which WAN interfaces carry SD-WAN traffic |
| **6. Review & Deploy** | Review all settings and click **Deploy** |

For detailed wizard instructions, see [Topology Wizard](../04-topology/wizard.md).

## Step 5: Monitor Deployment Progress

After clicking **Deploy**, the controller queues configuration jobs for each device in the topology. Navigate to **SD-WAN Fabric > [topology-name] > Deployment Status** to watch progress in real time.

Each device shows one of these states:

| Status | Meaning |
|---|---|
| Queued | Job is waiting for a worker |
| Deploying | Configuration is being pushed to the device |
| Success | Device accepted the configuration; tunnel is starting |
| Error | Push failed — click the device row for the error message |

The SD-WAN tunnel takes approximately 45 seconds to establish after configuration is pushed. Once all devices show **Success** and the tunnel status is **Connected**, your topology is active.

## Step 6: Verify the Deployment

1. Navigate to **SD-WAN Fabric > [topology-name]** and confirm all devices show **Connected**
2. Navigate to **Devices** and verify all registered devices are **Online**
3. From a spoke site, ping a subnet behind the hub to verify end-to-end connectivity
4. Check **Policy Engine > Performance SLA** for real-time WAN link health metrics

## Next Steps

| Goal | Where to Go |
|---|---|
| Add more devices | [Device Registration](../03-devices/registration.md) |
| Configure BGP routing | [Global Policies > BGP](../06-policies/bgp.md) |
| Set up QoS | [Global Policies > QoS](../06-policies/qos.md) |
| Enable DPI analytics | [DPI Analytics](../09-dpi/overview.md) |
| Set up HA redundancy | [High Availability](../12-ha/overview.md) |
| Use the REST API | [API Reference](../14-api/authentication.md) |

!!! tip
    For a more detailed installation walkthrough, see [Docker Deployment](../02-installation/docker.md) or [Manual Installation](../02-installation/manual.md).

!!! info "See Also"
    - [About Nexapp SDWAN Controller](about.md) — What the controller does and who it is for
    - [Architecture Overview](architecture.md) — How the components connect
    - [Topology Wizard](../04-topology/wizard.md) — Detailed 6-step wizard reference
