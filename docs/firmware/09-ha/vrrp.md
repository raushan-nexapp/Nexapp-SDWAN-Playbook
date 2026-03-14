# VRRP Setup

!!! note "Standalone & Controller-Managed"
    The HA setup wizard runs locally on the primary router. Once configured, the controller
    can monitor and manage HA status remotely.

## Overview

Setting up High Availability requires running a guided wizard that initializes both the primary and secondary routers, configures the heartbeat link, and establishes configuration synchronization. The wizard validates hardware compatibility, connects to the backup node, and configures virtual IP addresses for seamless failover.

Navigate to **HA > High Availability** and click **Configure** to launch the setup wizard.

## Prerequisites

- Two NexappOS routers with identical hardware (same CPU, network interfaces, storage).
- Both routers connected to the same network switch on the same broadcast domain.
- A dedicated physical LAN interface available for HA heartbeat traffic.
- SSH access from the primary to the secondary router.
- The secondary router's IP address and root password.

## Setup Wizard

The setup wizard guides you through four steps:

### Step 1: Requirements Checklist

Review the requirements before proceeding:

| Requirement | Description |
|-------------|-------------|
| **Identical Hardware** | Both nodes must have the same hardware specifications and network interface layout. |
| **Physical LAN Interface** | A dedicated LAN interface is required for heartbeat communication between nodes. |
| **Network Switch Connection** | Both nodes must be connected through a network switch on the same broadcast domain. |
| **Interface Monitoring** | Network interfaces are monitored to trigger automatic failover on failure. |

Click **Next** after confirming all requirements are met.

### Step 2: Node Configuration

Enter the IP addresses and credentials for both nodes:

| Field | Description | Required |
|-------|-------------|----------|
| **Primary IP** | The management IP address of this (primary) router. | Yes |
| **Secondary IP** | The management IP address of the secondary (backup) router. | Yes |
| **Password** | A shared authentication password for the HA cluster (maximum 32 characters). | Yes |

Click **Next** to proceed.

### Step 3: Interface Configuration

Configure the HA management interface and virtual IP addresses:

| Field | Description | Required |
|-------|-------------|----------|
| **HA Management Interface** | Select the network interface used for heartbeat and synchronization between nodes. | Yes |
| **Primary IP** | The IP address assigned to the primary node on the HA interface. | Yes |
| **Secondary IP** | The IP address assigned to the secondary node on the HA interface. | Yes |
| **SSH Password** | The root password of the secondary router for initial configuration push. | Yes |

Click **Next** to proceed.

### Step 4: Review and Apply

Review all settings on the summary screen. Click **Apply** to:

1. Initialize the local (primary) router with HA settings.
2. Connect to the secondary router via SSH.
3. Push HA configuration to the secondary router.
4. Start the HA service on both nodes.
5. Begin initial configuration synchronization.

!!! note
    The apply step may take 30-60 seconds as it initializes both nodes and performs the first synchronization.

## After Setup

Once the wizard completes:

- A success banner confirms that the HA cluster has been set up.
- The **Overview** tab shows both nodes with their roles (Master/Backup).
- Configuration synchronization begins automatically.

You can now manage HA through the two tabs:

- **Overview** -- Monitor cluster status, force sync, start/stop service.
- **Managed Interfaces** -- Add or remove interfaces from HA management.

## Verification

1. Navigate to **HA > High Availability**.
2. Confirm the setup wizard completed without errors.
3. Verify the **Primary Node** shows **Master** and **Secondary Node** shows **Backup**.
4. Check the **Synchronization** status shows **Up to Date**.
5. Test failover by disconnecting the primary router's WAN cable and verifying the secondary takes over.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Requirements validation fails | Hardware mismatch between the two routers | Ensure both routers have identical hardware specifications and the same number/type of network interfaces |
| "SSH connection failed" during setup | Incorrect SSH password or the secondary router is unreachable | Verify the secondary router's IP address is correct, the router is powered on, and the root password matches |
| Backup router not reachable after setup | The HA management interface or IP addresses are misconfigured | Verify both routers are on the same subnet on the selected HA management interface |
| Split-brain after setup | The heartbeat interface lost connectivity | Restore the physical cable on the dedicated heartbeat interface and click **Force Sync** |
| Setup wizard times out | Network latency or firewall rules blocking SSH between nodes | Check that port 22 (SSH) is open between the primary and secondary routers |

!!! info "See Also"
    - [High Availability Overview](overview.md) -- HA concepts and status dashboard
    - [Failover & Recovery](failover.md) -- Failover behavior, managed interfaces, and manual recovery
