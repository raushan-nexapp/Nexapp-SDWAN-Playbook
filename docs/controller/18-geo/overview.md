# Geographic Info

## Overview

The Geographic Info section lets you assign physical locations to managed devices and visualize your network on an interactive map. Location data powers topology maps in the dashboard and helps operators understand the geographic distribution of their SD-WAN deployment.

Navigate to **Geographic Info** in the controller sidebar.

---

## Features

| Feature | Description |
|---------|-------------|
| **Location Map** | Interactive map showing all devices with coordinates |
| **Location Assignment** | Assign GPS coordinates or address to a device |
| **Floor Plans** | Upload building floor plans and pin devices to indoor maps |
| **Location Groups** | Cluster devices by physical site or building |

---

## Assigning a Location to a Device

1. Navigate to **Devices** → select a device
2. Click the **Location** inline (visible in the device detail page)
3. Either:
   - Search for an address — the map geocodes it automatically
   - Click on the map to set coordinates manually
4. Click **Save**

Alternatively, assign locations in bulk from **Geographic Info > Locations** using the inline map interface.

---

## Location Fields

| Field | Description |
|-------|-------------|
| **Name** | Human-readable site name (e.g., `Mumbai-Branch-01`) |
| **Address** | Street address for geocoding |
| **Latitude / Longitude** | Exact GPS coordinates |
| **Altitude** | Optional elevation in meters |
| **Floor Plan** | Linked floor plan for indoor mapping |

---

## Floor Plans

Floor plans allow you to upload a building image and pin access points or routers to specific positions within the building.

1. **Geographic Info > Floor Plans > Add Floor Plan**
2. Upload a JPEG or PNG image of the floor plan
3. Set the bounding box coordinates (NW/SE corners) to geo-reference the image
4. Navigate to a device → assign to the floor plan and click its position

---

## Map Dashboard

The **Geographic Info > Locations Map** shows a global map with:

- Device pins colored by online/offline status (green/red)
- Cluster bubbles for dense areas — click to zoom in
- Site names as labels
- Click any pin to jump to the device detail page

---

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Device not showing on map | No location assigned | Assign location to device |
| Wrong pin position | Geocoding error | Set coordinates manually |
| Floor plan not aligned | Incorrect bounding box | Re-enter NW/SE corners |

---

## See Also

- [Device Registration](../03-devices/registration.md)
- [Device Monitoring](../03-devices/monitoring.md)
