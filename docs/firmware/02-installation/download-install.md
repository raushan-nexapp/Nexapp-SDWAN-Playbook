# Download & Install

This page covers how to obtain the NexappOS firmware image and install it on your hardware.

## Download the Firmware

1. Contact your Nexapp Technologies representative or visit the Nexapp support portal to obtain the firmware image.
2. The file is named in the format: `nexappos-10.01-x86-64-generic-ext4-combined.img.gz`
3. Verify the file integrity using the SHA-256 checksum provided with the download.

```bash
sha256sum nexappos-10.01-x86-64-generic-ext4-combined.img.gz
```

Compare the output with the checksum on the download page.

## Installation Methods

### Method 1 — USB Flash Drive (Recommended)

Use this method for physical x86_64 hardware.

**What you need:** A USB flash drive (1 GB or larger) and a Linux or macOS workstation.

1. **Write the image to the USB drive:**

    ```bash
    gunzip nexappos-10.01-x86-64-generic-ext4-combined.img.gz
    sudo dd if=nexappos-10.01-x86-64-generic-ext4-combined.img \
       of=/dev/sdX bs=4M status=progress
    sync
    ```

    Replace `/dev/sdX` with your USB drive's device path. Use `lsblk` to identify the correct device.

    !!! warning "Data Loss Risk"
        Double-check the target device before running `dd`. Writing to the wrong
        device will destroy all data on it.

2. **Boot from USB:** Insert the USB drive into the target hardware, power on, and select USB boot from the BIOS/UEFI menu (usually by pressing F12 or Del during startup).

3. **Install to internal storage:** NexappOS writes directly to the boot media. To install onto the device's internal SSD or eMMC, write the image to the internal drive instead of a USB stick, or use the built-in install utility during first boot.

### Method 2 — Virtual Machine

Use this method for lab testing or evaluation.

**VMware / VirtualBox:**

1. Create a new virtual machine with these settings:
    - **Type:** Linux, 64-bit
    - **CPU:** 2 cores minimum
    - **RAM:** 2 GB minimum (4 GB recommended)
    - **Disk:** 4 GB minimum (16 GB recommended)
    - **Network:** 2 adapters — Adapter 1 as Bridged or NAT (WAN), Adapter 2 as Host-Only or Internal (LAN)

2. Convert the firmware image to a virtual disk:

    ```bash
    gunzip nexappos-10.01-x86-64-generic-ext4-combined.img.gz
    qemu-img convert -f raw -O vmdk \
       nexappos-10.01-x86-64-generic-ext4-combined.img nexappos.vmdk
    ```

3. Attach `nexappos.vmdk` as the primary disk and boot the VM.

**KVM / QEMU:**

```bash
gunzip nexappos-10.01-x86-64-generic-ext4-combined.img.gz
qemu-system-x86_64 -m 2048 -smp 2 -enable-kvm \
   -drive file=nexappos-10.01-x86-64-generic-ext4-combined.img,format=raw \
   -netdev user,id=wan -device e1000,netdev=wan \
   -netdev tap,id=lan,ifname=tap0,script=no -device e1000,netdev=lan
```

### Method 3 — PXE Network Boot

For large-scale deployments, you can serve the firmware image over PXE:

1. Place the firmware image on your PXE/TFTP server.
2. Configure the DHCP server to point to the image.
3. Boot the target device via PXE and select the NexappOS image.

!!! tip
    PXE installation is ideal when deploying many routers in a staging environment.
    Contact Nexapp support for PXE boot configuration templates.

## First Boot

After installation, the router boots with the following defaults:

| Setting | Default Value |
|---|---|
| LAN IP address | `192.168.1.1` |
| LAN subnet | `192.168.1.0/24` |
| DHCP server | Enabled on LAN (range `192.168.1.100` - `192.168.1.249`) |
| WAN interface | DHCP client (obtains IP automatically) |
| Web UI | `https://192.168.1.1:9090` |
| Username | `root` |
| Password | `Admin@123` |
| SSH | Enabled on LAN (port 22) |

The first boot takes approximately 30-60 seconds. Once complete, connect to a LAN port and open the web UI.

!!! info "See Also"
    Proceed to [Initial Setup](initial-setup.md) to change the default password
    and configure basic system settings.
