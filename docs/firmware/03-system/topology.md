# Topology View

!!! note "Standalone & Controller-Managed"
    Available in both standalone and controller-managed deployments. In controller mode, configuration may be pushed centrally.


## Overview

The Topology page manages overlay network rules that connect your NexappOS router to the SD-WAN controller. Each topology rule defines an overlay connection using either IPsec or ZeroTier as the transport, along with the credentials needed to join the overlay network.

In controller-managed mode, topology rules are typically pushed from the controller. In standalone mode, you can add them manually.

## Configuration

Navigate to **System > Topology**.

### Adding a Topology Rule

1. Click **Add** to open the topology rule drawer.
2. Fill in the following fields:

| Field | Description |
|---|---|
| **Service** | Toggle to enable or disable this rule. |
| **Name** | A unique name for the topology rule, e.g., `hq-overlay`. |
| **Topology Type** | Select **IPSEC** or **ZEROTIER**. |
| **UUID** | The unique identifier assigned by the controller for this device. |
| **Key** | The authentication key or pre-shared key for joining the overlay. |

3. Click **Add Rule** to save.

### Editing a Rule

1. Click **Edit** next to the rule you want to modify.
2. Update the desired fields (the rule name cannot be changed).
3. Click **Save Changes**.

### Deleting a Rule

1. Click **Delete** next to the rule.
2. Confirm the deletion in the dialog that appears.

!!! warning
    Deleting a topology rule disconnects the router from the associated overlay network. If the router is controller-managed, the controller may push the rule again on the next deployment cycle.

## Verification

1. After adding a rule, confirm it appears in the **Topology Rules** table with the correct type and status.
2. For ZeroTier rules, verify the router appears as an authorized member in your ZeroTier network.
3. For IPsec rules, check the VPN status page to confirm the tunnel is established.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Rule shows "Disabled" status | The service toggle is off. | Edit the rule and enable the service. |
| "Failed to load topology rules" error | The controller backend is not reachable or not configured. | Verify the router has network connectivity. In standalone mode, confirm the controller URL is configured in **System > Settings**. |
| ZeroTier overlay not connecting | The UUID or key is incorrect, or the ZeroTier network does not have this device authorized. | Verify the UUID and key match the values on the controller. Check that the device is authorized in the ZeroTier network. |

## See Also

- [Settings](settings.md)
- [SD-WAN Overview](../05-sdwan/overview.md)
