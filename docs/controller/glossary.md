# Glossary

Common terms used throughout the Nexapp SDWAN Controller documentation. For router-specific terms, see the [NexappOS Firmware Glossary](../firmware/glossary.md).

---

## A

**API Token**
:   A 40-character authentication key used to access the Nexapp SDWAN REST API. Generated per user via the admin interface. Passed in the `Authorization: Token <key>` header.

**ASN (Autonomous System Number)**
:   A unique number assigned to a network for BGP routing. The controller uses private ASNs (64512-65534) for SD-WAN topology routing.

**Audit Log**
:   A record of user actions (login, logout, configuration changes) tracked by the controller's `accesslog` app. Used for compliance and security monitoring.

## B

**BGP (Border Gateway Protocol)**
:   The primary dynamic routing protocol used for SD-WAN route distribution. The controller runs a BGP Route Reflector that peers with all routers in the topology.

**Batch Deploy**
:   A deployment method that pushes configuration to multiple devices simultaneously using Celery worker groups. Supports up to 500 devices per wave.

## C

**Celery**
:   The distributed task queue used by the controller for background operations: deployment, status polling, DPI data collection, and report generation.

**Configuration Template**
:   A reusable configuration block in the controller that can be pushed to one or more NexappOS devices. Templates define network settings, routing policies, and security configurations.

## D

**DC/DR (Data Center / Disaster Recovery)**
:   A failover architecture with a primary controller (DC) and backup controller (DR). Routers automatically switch to DR if DC becomes unreachable. See [DC/DR Failover](12-ha/dcdr-failover.md).

**Deploy Pipeline**
:   The sequence of operations for pushing configuration to a device: validate configuration, generate device-specific config, push via RPCD, verify application. See [Deployment Pipeline](05-deployment/pipeline.md).

**Device Group**
:   A logical grouping of NexappOS devices in the controller for applying shared configuration templates and policies.

**Application Intelligence**
:   The controller's deep packet inspection analytics system. Collects application traffic data from routers and provides dashboards, reports, and alerting. See [DPI Analytics](09-dpi/overview.md).

## G

**Global Policy**
:   A configuration template that applies to all devices in a topology. Available for BGP, OSPF, QoS, SLA, and steering policies. Created once, deployed everywhere. See [Global Policies](06-policies/overview.md).

## H

**Health Endpoint**
:   The controller's `/api/v1/health/` endpoint that reports system status including database connectivity, Redis availability, Celery worker health, and topology statistics.

**Hub-Spoke Topology**
:   An SD-WAN network design where branch offices (spokes) connect to a central location (hub) through encrypted overlay tunnels. The most common deployment pattern.

## M

**Mesh Topology**
:   An SD-WAN network design where every device has direct tunnels to every other device. Provides lowest latency but increases tunnel count quadratically.

**Users**
:   The controller's ability to isolate data and configuration between organizations. Each organization sees only its own devices, topologies, and analytics.

## N

**NsBond API**
:   The controller's REST API for SD-WAN management. Provides 20 viewsets at `/api/v1/nsbond/` covering topology, devices, WAN members, path monitors, quality tiers, steering policies, BGP, OSPF, QoS, and deployment.

## O

**Organization**
:   The top-level tenant unit in the controller. All devices, topologies, users, and configurations are scoped to an organization. Multi-organization deployments enable managed service provider (MSP) scenarios.

## P

**Policy Engine**
:   The controller component that manages global and per-device policies for BGP, OSPF, QoS, SLA, and traffic steering. Policies are defined in the controller and deployed to devices.

## R

**REST API**
:   The controller's programmatic interface for all management operations. Uses Token or Session authentication. Full reference at [REST API](14-api/authentication.md).

**Route Reflector (RR)**
:   A BGP service running on the controller (via FRR) that distributes routes between all routers in the topology. Eliminates the need for full-mesh iBGP peering. See [BGP Route Reflector](07-bgp-rr/overview.md).

## S

**Status Polling**
:   The controller's periodic (30-second) check of device health, tunnel status, and SLA metrics via the ZeroTier management plane.

## T

**Topology**
:   A logical SD-WAN network managed by the controller. Contains devices (hub + spokes), overlay tunnels, routing policies, and SLA configurations. See [Topology Overview](04-topology/overview.md).

**Topology Wizard**
:   A 6-step guided setup for creating SD-WAN topologies: name topology, assign hub, assign spokes, configure overlay, set routing policies, deploy. See [Topology Wizard](04-topology/wizard.md).

## V

**VRF Multi-Tenancy**
:   The controller's feature for creating per-tenant routing isolation using VRF and MP-BGP VPNv4. Each tenant gets isolated routing tables across the SD-WAN fabric. See [VRF Multi-Tenancy](08-vrf/overview.md).

## Z

**ZeroTier Management Plane**
:   The out-of-band network (10.0.0.0/24) connecting the controller to all managed routers. Used for device communication, status polling, and configuration push. Independent of the SD-WAN data plane.

---

## Additional Terms (Phase 18 additions)

**DC/DR (Data Center / Disaster Recovery)**
:   Two controller instances configured for automatic failover. Routers monitor the primary controller (DC) and automatically reconnect to the backup controller (DR) if the primary becomes unreachable for more than 90 seconds.

**Device Access Zone**
:   A controller construct that restricts which users within an organization can view or manage a specific subset of devices. A user in a zone sees only the devices assigned to that zone. Users in multiple zones see the union of all zone devices. Organization admins and superusers bypass zone restrictions.

**DPI Snapshot**
:   An hourly summary of application traffic statistics collected from a NexappOS router and stored by the controller. Snapshots record per-application byte counts and are the source data for the Data Usage dashboard and DPI analytics reports.

**MP-BGP (Multiprotocol BGP)**
:   An extension of BGP that carries routing information for multiple address families, including IPv4, IPv6, and VPNv4. The controller uses MP-BGP to distribute per-tenant VRF routes across the SD-WAN fabric, enabling VRF-based multi-tenancy.

**Route Reflector**
:   A BGP speaker configured on the controller that receives routes from all router peers and re-advertises them, eliminating the need for a full mesh of BGP sessions between every pair of routers. The controller's built-in route reflector uses FRR (Free Range Routing). See [BGP Route Reflector](07-bgp-rr/overview.md).

**VRF (Virtual Routing and Forwarding)**
:   A routing table instance that provides network-layer traffic isolation. Each VRF operates independently, so packets in one VRF cannot reach destinations in another without explicit policy. The controller uses VRFs to isolate tenant routing tables in multi-tenant SD-WAN deployments.

**Topology Wizard**
:   A 6-step guided interface in the controller for creating and deploying a complete SD-WAN topology: (1) name and organization, (2) assign hub, (3) assign spokes, (4) configure overlay settings, (5) set routing and QoS policies, (6) deploy. See [Topology Wizard](04-topology/wizard.md).

**Global Policy**
:   A configuration template in the controller that applies uniformly to all devices in a topology, as opposed to a per-device policy. Global policies exist for BGP, OSPF, QoS, SLA thresholds, and traffic steering. Created once, applied to every device when the topology is deployed.
