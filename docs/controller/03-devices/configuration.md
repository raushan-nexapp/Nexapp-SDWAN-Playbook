# Device Configuration

## Overview

The controller manages device configuration through a template-based system. Configuration templates define shared settings (interface config, routing policies, firewall rules) that are applied to one or more devices. Per-device variables allow template values to be customized for each device without duplicating the template. This page covers the device configuration workflow, template assignment, and manual configuration pushes.

## How Configuration Works

When you save a configuration change on the controller, the change is not applied to the device immediately. Instead:

1. The new configuration is stored in the controller database
2. A deployment job is queued
3. A background worker connects to the device via the ZeroTier management plane
4. The worker pushes the configuration to the device's configuration API endpoint
5. The device validates and applies the configuration
6. The controller records the push result (success or error) and timestamps the configuration history

This asynchronous approach ensures the UI remains responsive even for large fleet-wide deployments.

## Device Detail Page

Navigate to **Devices > [device-name]** to open the device detail page. It is organized into tabs:

| Tab | Contents |
|---|---|
| **Info** | Device name, organization, model, ZeroTier IP, last seen, status |
| **Configuration** | Active configuration, template assignments, variable overrides |
| **Advanced** | Raw configuration editor, device key, registration details |
| **History** | Log of all configuration changes pushed to this device |
| **Terminal** | Browser-based remote terminal (see [Remote Terminal](terminal.md)) |

## Assigning Configuration Templates

Configuration templates are reusable blocks of configuration that can be applied to multiple devices. Templates are defined under **Configuration > Templates**.

To assign a template to a device:

1. Navigate to **Devices > [device] > Configuration**
2. Click **Add Template**
3. Select one or more templates from the list
4. Click **Save**
5. Click **Push Configuration** to deploy immediately, or let the next scheduled sync apply it

Templates are merged in priority order when a device has multiple templates assigned. Higher-priority templates override lower-priority ones for conflicting keys.

## Configuration Variables

Templates can include variables (placeholder values that are filled in per device). This allows a single template to work across many devices with different IP addresses, site names, or WAN interfaces.

Variables are defined in a template using `{{ variable_name }}` syntax. Per-device values are set in the device's **Variables** section:

1. Navigate to **Devices > [device] > Configuration**
2. Click **Variables**
3. Add key-value pairs for any variables the assigned templates require

| Variable | Example Value | Used In |
|---|---|---|
| `site_name` | `Branch-Mumbai` | Device identification labels |
| `wan1_ip` | `203.0.113.10` | Interface configuration templates |
| `bgp_as` | `65001` | BGP policy templates |
| `snmp_community` | `public` | Monitoring configuration templates |

Variables set at the device level override variables set at the group level (see [Device Groups](groups.md)).

## Manual Configuration Push

To push the current configuration to a specific device without waiting for the next sync:

1. Navigate to **Devices > [device] > Configuration**
2. Review the configuration that will be applied (shown in the preview panel)
3. Click **Push Configuration**
4. A notification shows when the push completes. For errors, the error message from the device is shown inline.

You can also trigger a push for all devices in a group or topology from those respective management pages.

## Configuration Validation

Before pushing, the controller validates the configuration against the device's known capabilities:

- Required fields must be present
- IP addresses must be valid
- Referenced templates and policies must exist
- Variable placeholders must all have values assigned

If validation fails, the push is blocked and the validation error is shown with the specific field and reason. Fix the error in the configuration or variable assignments, then retry.

## Configuration History

Every successful configuration push is recorded in the device's history log. Navigate to **Devices > [device-name] > History** to see:

| Column | Description |
|---|---|
| **Timestamp** | When the push was completed |
| **Pushed By** | Username or "System" for automatic deployments |
| **Status** | Success or Error |
| **Summary** | Brief description of what changed |
| **Diff** | Click to view the exact changes compared to the previous push |

History is retained according to the audit log retention policy (default 30 days, configurable in **Settings**).

## Advanced: Raw Configuration Editor

For expert users who need to make changes not covered by templates, the **Advanced** tab provides a raw configuration editor. Changes made here are applied on top of any template-based configuration.

!!! warning
    Changes in the raw editor can conflict with template-generated configuration. Use this only when templates cannot express the required settings, and document any manual changes in the device notes field.

## Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| Push returns "Device unreachable" | ZeroTier not connected | Verify device shows **Online** in the device list before pushing |
| "Validation failed: missing variable" | Template variable has no value for this device | Add the required variable value in **Devices > [device-name] > Configuration > Variables** |
| Configuration applied but not taking effect | Device needs a service restart | Check **Devices > [device] > Terminal** and inspect device logs |
| History shows no entries | Device was recently registered | History is populated after the first successful push |

!!! info "See Also"
    - [Device Groups](groups.md) — Apply templates to multiple devices simultaneously
    - [Deployment Pipeline](../05-deployment/pipeline.md) — Full deployment workflow and monitoring
    - [Device Registration](registration.md) — Register new devices before configuring them
