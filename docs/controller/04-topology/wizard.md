# Topology Wizard

## Overview

The Topology Wizard is a guided 6-step workflow that creates and deploys a complete SD-WAN topology from start to finish. It collects all required settings — hub selection, spoke devices, overlay parameters, and WAN interface assignments — and then pushes the configuration to every device in one operation. Using the wizard ensures all required fields are filled in the correct order and reduces the chance of configuration errors.

## Starting the Wizard

Navigate to **SD-WAN Fabric > Topologies** and click **Use Wizard**. You can also start the wizard from **SD-WAN Fabric > Topologies > Add**.

The wizard opens in a full-page view with a step indicator at the top showing your progress through all six steps.

---

## Step 1: Basic Info

Enter the core topology parameters:

| Field | Description | Example |
|---|---|---|
| **Topology Name** | A unique, descriptive name for this fabric | `HQ-India-Branches` |
| **Description** | Optional notes about the topology's purpose | `Hub at Mumbai DC, 12 branch spokes` |
| **Type** | Hub-Spoke, Mesh, or Hub-Spoke with ADVPN | Hub-Spoke |

**When to choose each type:**
- **Hub-Spoke**: Central hub at DC or HQ; branches connect to hub only
- **Mesh**: All devices connect to each other (best for 2–10 sites)
- **Hub-Spoke with ADVPN**: Hub-spoke base with automatic direct spoke-to-spoke tunnels when spoke-to-spoke traffic is detected

Click **Next** to proceed.

---

## Step 2: Select Hub

Choose the registered NexappOS device that will serve as the hub for this topology.

- The dropdown shows all devices registered in your organization that are not currently assigned to another topology
- The hub must have a fixed public IP address and adequate upstream bandwidth for all spoke traffic
- For Hub-Spoke with ADVPN, the hub handles the initial tunnel handshake for spoke-to-spoke sessions

Select the hub device and click **Next**.

!!! note "Hub Requirements"
    The hub device must have at least one WAN interface with a publicly reachable IP address. Spoke devices can be behind NAT. See [Hub & Spoke Setup](hub-spoke.md) for detailed hub requirements.

---

## Step 3: Add Spokes

Select the devices that will connect as spokes in this topology.

- Use the search box to find devices by name or location
- Click a device to add it to the spoke list; click again to remove it
- The spoke list on the right shows all selected devices
- A topology requires at least one spoke to be deployed

You can add more spokes after deployment by returning to the topology settings. Adding new spokes triggers a delta deployment that only pushes configuration to the new devices.

Click **Next** when your spoke list is complete.

---

## Step 4: Overlay Settings

Configure the tunnel parameters that apply to the entire topology:

| Field | Description | Example |
|---|---|---|
| **Tunnel Address Range** | Private IP range for tunnel interfaces | `10.100.0.0/24` |
| **Bonding Port** | UDP port for SD-WAN tunnel traffic | `5511` (default) |
| **Pre-Shared Key (PSK)** | IPsec encryption key for the overlay | Auto-generated (click **Generate**) |
| **Encryption** | IPsec cipher suite for tunnel encryption | AES-128-GCM (recommended) |
| **ADVPN** | Enable direct spoke-to-spoke tunnels (Hub-Spoke with ADVPN only) | On / Off |

**Tunnel Address Range**: The controller automatically assigns tunnel interface IPs from this range — hub gets the first address (e.g., `10.100.0.1`), and spokes receive sequential addresses (`10.100.0.2`, `10.100.0.3`, etc.).

**PSK**: Click **Generate** to create a cryptographically random key. You can also enter your own. The PSK must be the same on all devices in the topology — the controller ensures this by pushing the same value to every device.

**Encryption options:**

| Option | Description | Recommended For |
|---|---|---|
| AES-128-GCM | Fast, hardware-accelerated on modern x86 | Standard deployments |
| AES-256-GCM | Higher security, slightly slower | High-compliance environments |
| ChaCha20-Poly1305 | Software-efficient (good for low-power devices) | ARM-based routers |
| None | No IPsec (performance only — not recommended) | Internal lab testing only |

Click **Next** to proceed.

---

## Step 5: WAN Members

For each device in the topology (hub and all spokes), specify which WAN interfaces will carry SD-WAN traffic.

The wizard presents a card for each device. Click a card to expand it and configure that device's WAN members:

| Field | Description | Example |
|---|---|---|
| **Interface** | The WAN interface name as configured on the router | `wan`, `WAN2` |
| **Port** | Override the default bonding port for this member (optional) | Leave blank for default |
| **Weight** | Relative traffic weight for load balancing | `100` (higher = more traffic) |
| **Priority** | Failover priority (lower = preferred) | `1` for primary, `2` for backup |
| **Link Type** | Internet or MPLS (for MPLS hybrid mode) | Internet |

**Minimum requirement**: each device must have at least one WAN member. A device with no members configured will be skipped in deployment and shown as a warning.

Click **Next** when all devices have at least one WAN member configured.

---

## Step 6: Review & Deploy

The final step presents a complete summary of all settings:

- Topology name, type, and overlay parameters
- Hub device name and selected WAN interfaces
- All spoke devices with their WAN member configurations
- Total device count and estimated deployment time

Review the summary carefully. If anything needs correction, click **Back** to return to the relevant step.

When everything looks correct, click **Deploy**.

---

## What Happens on Deploy

The controller immediately queues deployment jobs for all devices in the topology:

1. One deployment job is created per device (hub + all spokes)
2. Each job pushes the overlay configuration (role, hub IP, tunnel address, PSK, encryption) and WAN member configuration to the device
3. On the device, the SD-WAN daemon receives the configuration and starts the tunnel
4. The tunnel establishment takes approximately 45 seconds per device after configuration is received

## Monitoring Deployment Progress

After clicking **Deploy**, the wizard transitions to the deployment status view at **SD-WAN Fabric > [topology-name] > Deployment Status**. Each device shows its deployment job status:

| Status | Meaning |
|---|---|
| **Queued** | Job is waiting for a worker to pick it up |
| **Deploying** | Configuration is being pushed to this device |
| **Success** | Configuration pushed; device is starting the tunnel |
| **Error** | Push failed — click the device row for the error detail |

Once all devices show **Success** and the topology status changes to **Active**, your SD-WAN fabric is operational.

!!! tip
    If one device fails to deploy, the other devices in the topology are not affected. Fix the error on the failing device and use **SD-WAN Fabric > [name] > Redeploy** to retry the failed device only.

## Editing a Topology After Deployment

Navigate to **SD-WAN Fabric > [topology-name] > Settings** to change overlay parameters or add/remove devices. Saving a change triggers a new deployment job for the affected devices.

!!! info "See Also"
    - [Topology Overview](overview.md) — Topology types and status model
    - [Hub & Spoke Setup](hub-spoke.md) — Hub requirements, ADVPN, and traffic flow
    - [Mesh Topology](mesh.md) — Full-mesh configuration for small deployments
    - [Deployment Pipeline](../05-deployment/pipeline.md) — Detailed deployment monitoring and retry
