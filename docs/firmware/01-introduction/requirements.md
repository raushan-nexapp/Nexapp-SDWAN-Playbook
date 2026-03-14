# System Requirements

Before installing NexappOS, verify that your hardware and network environment meet the requirements below.

## Hardware Requirements

NexappOS runs on **x86_64** hardware. It does not support ARM, MIPS, or other architectures.

### Minimum Specifications

| Component | Minimum | Recommended |
|---|---|---|
| **CPU** | x86_64, dual-core, 1.0 GHz | Intel Celeron N3700 / N3710 / J4125 or better |
| **RAM** | 2 GB | 4 GB or more |
| **Storage** | 4 GB (eMMC, SSD, or USB flash) | 16 GB SSD or larger |
| **Network Interfaces** | 2 (one WAN, one LAN) | 4 or more (for Multi-WAN and HA) |
| **USB** | 1 port (for installation) | — |

!!! tip
    For SD-WAN deployments with DPI, IPS, and QoS enabled simultaneously, use hardware with at least a quad-core CPU and 4 GB RAM. Encryption-heavy workloads (IPsec, WireGuard) benefit from AES-NI instruction support.

### Tested Hardware Platforms

The following hardware models have been validated with NexappOS 10.01:

| Model | CPU | NICs | Role |
|---|---|---|---|
| Nexapp IRX400-GE | Intel Celeron N3710, quad-core | 4x GbE | Hub or Spoke |
| Generic x86_64 mini-PC | Intel Celeron N3700, quad-core | 4x GbE | Hub or Spoke |
| Generic x86_64 mini-PC | Intel Celeron J4125, quad-core | 4x GbE | Spoke |
| Virtual machine (KVM/VMware/VirtualBox) | 2+ vCPUs | 2+ vNICs | Lab / Testing |

!!! note
    NexappOS works on most x86_64 systems with standard Intel or Realtek Ethernet adapters. If your hardware is not listed above, you can still install NexappOS — verify that the Ethernet chipset has upstream Linux kernel 6.6 driver support.

## Network Requirements

### Connectivity

| Requirement | Details |
|---|---|
| **WAN connection** | At least one Internet-connected interface (DHCP, static IP, or PPPoE) |
| **LAN connection** | At least one interface for local network devices |
| **Controller access** (optional) | HTTPS (TCP 443) outbound to your Nexapp SDWAN Controller |
| **Management access** | Outbound UDP 9993 for the management VPN (used in controller-managed mode) |

### Firewall / NAT Considerations

If your NexappOS router sits behind an upstream firewall or NAT device, ensure the following outbound traffic is permitted:

| Protocol | Port | Purpose |
|---|---|---|
| TCP | 443 | Controller API communication |
| UDP | 9993 | Management VPN |
| UDP | 4500, 500 | IPsec SD-WAN tunnels (NAT-T and IKE) |
| TCP | 179 | BGP (if using dynamic routing through the overlay) |

!!! note
    Inbound port forwarding is **not** required. NexappOS initiates all connections to the controller and to SD-WAN hub devices.

## Software Requirements

### Client Workstation

To access the NexappOS web UI, you need:

- A modern web browser (Chrome, Firefox, Edge, or Safari — latest two major versions)
- JavaScript enabled
- A network connection to the router's LAN interface

### Firmware Image

Download the NexappOS firmware image from your Nexapp Technologies representative or the Nexapp support portal. The image file is approximately 300 MB and uses the `.img.gz` format.

!!! info "See Also"
    For download and installation instructions, see
    [Download & Install](../02-installation/download-install.md).
