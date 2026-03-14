# Network Topology

## Overview

The Network Topology section provides a live network graph that visualizes device connectivity, link states, and traffic flows across your managed network. Nodes represent devices; links represent physical or logical connections. The graph auto-updates as device status changes.

Navigate to **Network Topology** in the controller sidebar.

---

## Topology Objects

| Object | Description |
|--------|-------------|
| **Topology** | Named network graph with type (NetJSON, OLSR, WireGuard) |
| **Node** | A device or network element in the graph |
| **Link** | A connection between two nodes |

---

## Viewing the Network Graph

1. Navigate to **Network Topology > Topologies**
2. Select a topology
3. Click the **Graph** tab to open the interactive visualization

The graph renders an SVG/Canvas view of all nodes and links. Controls:

| Control | Action |
|---------|--------|
| **Scroll wheel** | Zoom in/out |
| **Click + drag** | Pan the canvas |
| **Click a node** | Open node detail |
| **Double-click** | Navigate to device detail |
| **Legend** | Toggle link status colors |

---

## Node Status Colors

| Color | Meaning |
|-------|---------|
| **Green** | Node reachable / online |
| **Red** | Node unreachable / offline |
| **Gray** | Unknown status |

---

## Link Status Colors

| Color | Meaning |
|-------|---------|
| **Green** | Link up, good SLA |
| **Orange** | Link degraded (latency/loss alert) |
| **Red** | Link down |
| **Dashed** | Logical / overlay link |

---

## Creating a Topology

1. Navigate to **Network Topology > Topologies**
2. Click **Add Topology**
3. Fill in:

| Field | Description |
|-------|-------------|
| **Label** | Topology name |
| **Organization** | Owner org |
| **Parser** | Backend parser: `netjsongraph` (generic), `OLSR`, `WireGuard` |
| **URL** | API URL that provides NetJSON graph data (for auto-discovery) |
| **Update Interval** | How often to refresh topology data (seconds) |

---

## Auto-Discovery

For SD-WAN topologies, the controller can auto-populate the graph from the NsBond topology model:

- Each **Topology** in SD-WAN Fabric has a corresponding Network Topology graph
- Nodes are automatically added when spokes join
- Link status reflects real-time tunnel health

---

## Nodes and Links Management

| Section | Description |
|---------|-------------|
| **Network Topology > Nodes** | View/edit all nodes across topologies |
| **Network Topology > Links** | View/edit all links; sort by status or topology |

---

## See Also

- [Topology Overview (SD-WAN Fabric)](../04-topology/overview.md)
- [Device Monitoring](../03-devices/monitoring.md)
- [Geographic Info](../18-geo/overview.md)
