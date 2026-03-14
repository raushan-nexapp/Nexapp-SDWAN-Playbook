# Glossary

Common terms used throughout the NexappOS and Nexapp SDWAN documentation.

---

## A

**ADVPN (Auto Discovery VPN)**
:   A technology that automatically creates direct VPN tunnels between spoke routers when they need to communicate, bypassing the hub. Reduces latency for spoke-to-spoke traffic.

**ASN (Autonomous System Number)**
:   A unique number assigned to a network for BGP routing. NexappOS uses private ASNs (64512-65534) for internal SD-WAN routing.

## B

**BFD (Bidirectional Forwarding Detection)**
:   A protocol that detects link failures in sub-second timeframes, enabling faster failover than relying on BGP or OSPF hold timers alone.

**BGP (Border Gateway Protocol)**
:   The primary dynamic routing protocol used by NexappOS for SD-WAN route distribution. Routers peer with the controller's Route Reflector and with each other to exchange routes.

**Bonding**
:   The process of combining multiple WAN links into a single logical connection for increased bandwidth and reliability. NexappOS uses the NSB4 bonding protocol.

## C

**Controller**
:   See **Nexapp SDWAN Controller**.

**Controller-Managed Mode**
:   An operating mode where the NexappOS router is registered with and managed by a Nexapp SDWAN Controller. Configuration can be pushed from the controller. See also: **Standalone Mode**.

## D

**DC/DR (Data Center / Disaster Recovery)**
:   A failover architecture where a primary controller (DC) and backup controller (DR) provide redundancy. Routers automatically switch to DR if DC becomes unreachable.

**DDNS (Dynamic DNS)**
:   A service that automatically updates DNS records when a router's WAN IP address changes, ensuring the router remains reachable by hostname.

**DPI (Deep Packet Inspection)**
:   A technology that identifies applications and protocols in network traffic beyond simple port/IP analysis. NexappOS uses DPI for application-aware traffic steering and analytics.

## F

**FEC (Forward Error Correction)**
:   A technique used by the NSB4 bonding protocol to add redundant data to transmissions, allowing the receiver to correct errors without retransmission. Improves reliability over lossy links.

**Firewall Zone**
:   A logical grouping of network interfaces that share the same security policy. NexappOS uses zones (LAN, WAN, Guest, etc.) to control traffic flow between segments.

**FRR (Free Range Routing)**
:   The open-source routing suite used by NexappOS for BGP and OSPF. The controller runs FRR as a BGP Route Reflector.

## G

**Global Policy**
:   A configuration template in the Nexapp SDWAN Controller that applies to all devices in a topology. Supports BGP, OSPF, QoS, SLA, and steering policies. Created once, applied everywhere.

## H

**HA (High Availability)**
:   A deployment configuration using two NexappOS routers (primary and backup) with VRRP to provide automatic failover. The backup router monitors the primary and takes over if it fails.

**Hub**
:   A central NexappOS router in a hub-spoke SD-WAN topology. The hub terminates overlay tunnels from all spoke routers and typically connects to the data center or main office.

## I

**IPsec (Internet Protocol Security)**
:   A protocol suite for encrypting and authenticating network traffic. NexappOS uses IPsec to secure SD-WAN overlay tunnels between routers.

**IPS (Intrusion Prevention System)**
:   A security feature that monitors network traffic for known attack patterns and automatically blocks malicious traffic.

## L

**L2TP (Layer 2 Tunneling Protocol)**
:   A tunneling protocol used for VPN connections, often combined with IPsec for encryption. NexappOS supports L2TP for legacy VPN compatibility.

## M

**MP-BGP (Multiprotocol BGP)**
:   An extension of BGP that supports multiple address families (IPv4, IPv6, VPNv4). Used by NexappOS for VRF multi-tenancy route distribution.

**Multi-WAN**
:   A configuration using multiple WAN connections on a single router for load balancing, failover, or SD-WAN bonding.

## N

**Nexapp SDWAN Controller**
:   The centralized orchestration platform that manages a fleet of NexappOS routers. Provides topology management, global policy engine, DPI analytics, reporting, and REST API access. See the [Controller Manual](../controller/index.md).

**NexappOS**
:   The network operating system (firmware) running on SD-WAN routers. Built on OpenWrt, it provides a web-based management interface for configuring networking, security, SD-WAN, and VPN features.

**NSB4 (NexappOS Secure Bonding Protocol v4)**
:   The proprietary bonding protocol used by NexappOS for combining multiple WAN links. Provides packet-level load balancing, FEC, and SLA-aware traffic steering.

## O

**OSPF (Open Shortest Path First)**
:   A link-state routing protocol used for internal network route distribution. NexappOS supports OSPF alongside BGP for hybrid routing deployments.

**Overlay**
:   A virtual network built on top of the physical (underlay) network. NexappOS SD-WAN creates encrypted overlay tunnels between routers using IPsec.

## P

**Path Monitor**
:   A component that continuously measures the quality (latency, jitter, packet loss) of each WAN link. Used by the SLA engine to make traffic steering decisions.

**PSK (Pre-Shared Key)**
:   A shared secret used for IPsec tunnel authentication between NexappOS routers. Configured during SD-WAN overlay setup.

## Q

**QoS (Quality of Service)**
:   Traffic management features that prioritize certain types of network traffic. NexappOS QoS supports per-interface bandwidth limits and traffic classification rules.

**Quality Tier**
:   A named SLA threshold profile (e.g., "Real-time Voice", "Business Critical") that defines acceptable latency, jitter, and packet loss values. Used by steering policies to route traffic over the best available path.

## R

**RD (Route Distinguisher)**
:   A value prepended to routes in VRF multi-tenancy to make them globally unique. NexappOS auto-calculates RD from `ASN:tenant_id`.

**Route Reflector (RR)**
:   A BGP router that re-distributes routes between iBGP peers, eliminating the need for a full mesh of BGP sessions. The Nexapp SDWAN Controller runs as a Route Reflector using FRR. See the [BGP Route Reflector](../controller/07-bgp-rr/overview.md) section.

**RT (Route Target)**
:   A BGP extended community used to control VRF route import/export. Determines which routes are shared between tenants.

## S

**SLA (Service Level Agreement)**
:   Performance thresholds (latency, jitter, packet loss) that define acceptable link quality. NexappOS monitors SLA compliance and steers traffic accordingly.

**Spoke**
:   A branch-office NexappOS router in a hub-spoke SD-WAN topology. Spokes connect to the hub via encrypted overlay tunnels.

**Standalone Mode**
:   An operating mode where the NexappOS router operates independently with full local configuration through the web UI. No controller connection required. See also: **Controller-Managed Mode**.

**Steering Policy**
:   A rule that maps traffic classes (identified by DPI or manual classification) to quality tiers, determining which WAN path carries the traffic based on real-time SLA measurements.

## T

**Tenant**
:   An isolated entity in a multi-tenant SD-WAN deployment. Each tenant gets its own VRF routing table, preventing traffic leakage between organizations sharing the same infrastructure.

**Threat Shield**
:   A security feature that blocks known malicious IP addresses (Threat Shield IP) or DNS domains (Threat Shield DNS) using community-maintained blocklists.

**Topology**
:   The logical arrangement of SD-WAN devices. NexappOS supports hub-spoke (one hub, many spokes) and mesh (every device connects to every other) topologies.

**Topology Wizard**
:   A 6-step guided setup in the Nexapp SDWAN Controller for creating SD-WAN topologies. Automates device assignment, overlay configuration, and initial deployment. See the [Topology Wizard](../controller/04-topology/wizard.md) section.

## U

**Underlay**
:   The physical network (WAN links) over which the SD-WAN overlay is built. Each WAN connection (Ethernet, cellular, broadband) is an underlay member.

## V

**VRF (Virtual Routing and Forwarding)**
:   A technology that creates multiple independent routing tables on a single router. Used for multi-tenancy to isolate tenant traffic at the network layer. See [VRF Multi-Tenancy](08-routing/vrf.md).

**VRRP (Virtual Router Redundancy Protocol)**
:   The protocol used by NexappOS HA to provide automatic failover between primary and backup routers. The backup monitors the primary via VRRP advertisements and takes over if the primary fails.

## W

**WAN Member**
:   A physical WAN interface (Ethernet, cellular) added to the SD-WAN bonding configuration. Each member is monitored for SLA compliance and participates in traffic steering.

**WireGuard**
:   A modern VPN protocol known for simplicity and performance. NexappOS supports WireGuard for site-to-site and remote access VPN connections.

## Z

**ZeroTier**
:   A peer-to-peer virtual network used by NexappOS for the management plane. Provides out-of-band connectivity between routers and the controller, independent of SD-WAN data plane tunnels.
