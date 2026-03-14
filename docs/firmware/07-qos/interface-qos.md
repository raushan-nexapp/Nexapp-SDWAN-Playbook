# Interface QoS

!!! note "Standalone & Controller-Managed"
    Interface QoS can be configured locally on the router or pushed from the controller.
    When controller-managed, local changes may be overwritten by the next deployment.

## Overview

Interface QoS lets you set upload and download bandwidth limits on individual network interfaces. These limits tell the QoS engine the actual capacity of each link so it can enforce fair scheduling across priority classes. Without accurate bandwidth limits, the QoS engine cannot shape traffic effectively.

Navigate to **Policy Engine > QoS > Interfaces** to access this feature.

## Prerequisites

- The QoS service is enabled (see [QoS Overview](overview.md)).
- You know the actual upload and download speeds of each WAN link in Mbps.

## Configuration

### Adding an Interface

1. Navigate to **Policy Engine > QoS > Interfaces**.
2. Click **Add Interface**.
3. Fill in the configuration form:

| Field | Description | Required |
|-------|-------------|----------|
| **Interface** | Select the network interface to apply QoS limits to (e.g., `wan`, `WAN2`). SD-WAN bonding interfaces also appear in the list. | Yes |
| **Download Speed (Mbps)** | The maximum download bandwidth for this interface in megabits per second. Enter the actual speed provided by your ISP. | Yes |
| **Upload Speed (Mbps)** | The maximum upload bandwidth for this interface in megabits per second. Enter the actual speed provided by your ISP. | Yes |
| **Status** | Enable or disable QoS on this interface. Disabled interfaces retain their settings but are not actively shaped. | Yes |

4. Click **Add Interface** (or **Save** when editing).

!!! tip
    Set bandwidth limits to approximately 90-95% of your actual link speed. This gives the QoS engine headroom to shape traffic before the ISP's own queuing takes effect.

### Editing an Interface

1. Locate the interface in the table.
2. Click the **Edit** button.
3. Update the download or upload speed values.
4. Click **Save**.

### Disabling or Deleting an Interface

- To temporarily disable QoS on an interface without removing it, click the kebab menu (three dots) and select **Disable**.
- To permanently remove QoS settings for an interface, click the kebab menu and select **Delete**.

## SD-WAN QoS

If your router is part of an SD-WAN fabric, you can also configure QoS on the SD-WAN bonding tunnel. Navigate to **Network > SD-WAN Fabric > QoS** to access SD-WAN-specific QoS settings, which apply bandwidth management to the overlay tunnel.

## Verification

1. Navigate to **Policy Engine > QoS > Interfaces**.
2. Confirm each configured interface shows a green **Enabled** status.
3. Verify the download and upload speeds match your ISP plan.
4. Navigate to the **Overview** tab and confirm the interface appears in the **Active Interfaces** table with ingress and egress DSCP marking enabled.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Bandwidth limits are not applied | The interface entry is disabled | Click the kebab menu and select **Enable** to activate QoS on the interface |
| Actual speed is lower than the configured limit | The limit is set higher than the physical link speed | Set the bandwidth to 90-95% of the actual ISP speed, not the advertised maximum |
| QoS only shapes traffic in one direction | Only download or upload was configured | Ensure both **Download Speed** and **Upload Speed** are set to non-zero values |
| Interface does not appear in the dropdown | The interface is already configured or is not recognized | Check that the interface exists under **Network > Interfaces and Devices** |

!!! info "See Also"
    - [QoS Overview](overview.md) -- Enable the QoS service and view priority classes
    - [QoS Rules](rules.md) -- Classify traffic into priority queues
    - [Interfaces and Devices](../04-network/interfaces.md) -- Manage network interfaces
