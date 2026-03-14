# Topology Overview

## Overview

A topology is the central organizing concept in the Nexapp SDWAN Controller. It defines a named SD-WAN fabric — a group of NexappOS devices configured to form an overlay network with a specific role assignment, tunnel addressing, encryption policy, and WAN member configuration. All SD-WAN configuration for the devices in a topology is managed and deployed from the topology page.

## What a Topology Represents

A topology maps directly to an SD-WAN deployment at a set of physical sites. For example:

- **Topology: HQ-Branches** — Hub at the headquarters data center, spokes at 20 branch offices
- **Topology: Retail-North** — Hub at the regional distribution center, spokes at 8 retail stores
- **Topology: DC-Mesh** — Four data center routers in a full-mesh configuration

Each topology has its own tunnel address space, PSK, and port assignment, ensuring complete isolation between topologies. A device can belong to only one topology at a time.

## Topology Types

| Type | Architecture | Best For |
|---|---|---|
| **Hub-Spoke** | All spokes connect to a central hub; spoke-to-spoke traffic routes through the hub | Branch office deployments where the hub is the primary data center or HQ |
| **Mesh** | Every device connects directly to every other device | Small deployments (2–10 sites) requiring low latency between all sites |
| **Hub-Spoke with ADVPN** | Spokes connect to hub; ADVPN enables direct spoke-to-spoke tunnels on demand | Deployments needing both central hub control and efficient spoke-to-spoke communication |

## Topology List

Navigate to **SD-WAN Fabric > Topologies** to see all topologies in your organization.

### List Columns

| Column | Description |
|---|---|
| **Name** | Topology name as set during creation |
| **Type** | Hub-Spoke, Mesh, or Hub-Spoke with ADVPN |
| **Hub** | The device assigned as hub (Hub-Spoke only) |
| **Devices** | Total number of devices in the topology |
| **Status** | Active, Degraded, Inactive, or Error |
| **Created** | Creation timestamp |
| **Last Deploy** | Most recent deployment timestamp |

### Opening a Topology

Click any topology name to open its detail page, which shows all member devices with their individual tunnel status and WAN member health.

## Key Topology Fields

### Core Fields

| Field | Description |
|---|---|
| **Name** | Human-readable topology name (e.g., `HQ-Branches`) |
| **Type** | Topology type (Hub-Spoke, Mesh) |
| **Hub Device** | The registered device that will act as the hub (Hub-Spoke only) |
| **Spoke Devices** | List of registered devices that will connect as spokes |

### Network & Security Fields

| Field | Description |
|---|---|
| **Tunnel Address Range** | Private IP range for tunnel interface addresses (e.g., `10.100.0.0/24`) |
| **Bonding Port** | UDP port for SD-WAN traffic (default: 5511) |
| **PSK** | Pre-shared key for IPsec encryption of the overlay |
| **Encryption** | IPsec cipher suite (AES-128-GCM recommended) |

## Topology Status

The topology status reflects the aggregate health of all member devices:

### Status Values

| Status | Meaning |
|---|---|
| **Active** | All devices are online and their tunnels are Connected |
| **Degraded** | One or more devices are Offline or their tunnels are Disconnected |
| **Deploying** | A deployment job is in progress for this topology |
| **Inactive** | Topology created but not yet deployed (configuration not pushed to devices) |
| **Error** | Last deployment failed for one or more devices |

### Degraded vs Error

A **Degraded** topology does not mean connectivity is lost — the remaining online devices continue to communicate. The status indicates that the topology is not operating at full capacity.

An **Error** status means the last deployment job failed for one or more devices. Review the Deployment Log on the topology detail page to see the specific failure reason.

## Topology Detail Page

Navigate to **SD-WAN Fabric > [topology-name]** to open the topology detail page.

### Summary

Displays type, hub device, device count, current status, and last deployment timestamp at a glance.

### Device List

All member devices with individual status badges showing:

- **Online / Offline** — whether the device is reachable by the controller
- **Connected / Disconnected** — tunnel state reported by the device
- **Last Seen** — timestamp of last check-in

### Deployment Log

History of all deployment jobs for this topology. Each entry shows the trigger (manual or auto), the user who triggered it, start/end time, and per-device result.

### WAN Members

Per-device WAN interface configuration. Shows which physical WAN interfaces each device is using as SD-WAN underlay links, with their weights and status.

### Settings

Edit topology configuration — name, tunnel range, encryption, port. Saving triggers a new deployment to all member devices.

## Relationship Between Topologies and Devices

- A device belongs to at most one topology at a time
- Moving a device to a different topology removes it from the current topology and re-deploys the configuration for both topologies
- Deleting a topology does not delete the devices — they are moved back to unassigned status
- Unassigned devices can be added to any topology at any time

## Creating a Topology

The recommended way to create a topology is through the guided wizard. Navigate to **SD-WAN Fabric > Topologies** and click **Use Wizard**.

### Using the Wizard

The wizard walks through role assignment, tunnel addressing, and WAN member selection in a single guided flow. For detailed instructions, see [Topology Wizard](wizard.md).

### Manual Creation

Advanced users can create a topology manually by clicking **Add Topology** and filling all fields directly. Manual creation requires assigning hub and spoke devices separately after creation.

!!! info "See Also"
    - [Topology Wizard](wizard.md) — Step-by-step topology creation guide
    - [Hub & Spoke Setup](hub-spoke.md) — Hub-spoke architecture, traffic flow, and ADVPN
    - [Mesh Topology](mesh.md) — Full-mesh configuration for small deployments
    - [Deployment Pipeline](../05-deployment/pipeline.md) — Monitor and manage configuration deployments
