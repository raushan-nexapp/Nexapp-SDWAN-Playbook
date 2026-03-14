---
title: Nexapp SD-WAN Documentation
hide:
  - navigation
  - toc
---

<div class="nx-hero">
  <div class="nx-hero-content">
    <img src="assets/images/nexapp-logo-white.png" alt="Nexapp" class="nx-hero-logo">
    <h1>SD-WAN Documentation</h1>
    <p>Deploy, configure, and manage your enterprise SD-WAN infrastructure with NexappOS routers and the centralized SDWAN Controller.</p>
    <div class="nx-hero-badges">
      <span class="nx-badge">NexappOS 10.01</span>
      <span class="nx-badge">Controller v2.0</span>
    </div>
  </div>
</div>

<div class="nx-cards-grid" markdown>

<div class="nx-card" onclick="window.location='firmware/'" markdown>

<span class="nx-card-icon" markdown>:material-router-wireless:</span>

### NexappOS Firmware

<span class="nx-card-audience">For: Network Administrators</span>

Configure and manage SD-WAN routers — networking, overlay tunnels, routing, QoS, security, VPN, and high availability.

- Interface & WAN configuration
- SD-WAN fabric & IPsec encryption
- BGP, OSPF, VRF routing
- Firewall, DPI, threat shield
- HA failover & DC/DR recovery

[View Firmware Manual &rarr;](firmware/){ .nx-card-link }

</div>

<div class="nx-card" onclick="window.location='controller/'" markdown>

<span class="nx-card-icon" markdown>:material-server-network:</span>

### SDWAN Controller

<span class="nx-card-audience">For: IT Managers &amp; NOC Operators</span>

Manage your device fleet at scale — topology, global policies, DPI analytics, reporting, multi-tenancy, and REST API.

- Device registration & groups
- Topology wizard & deployment
- Global policy engine (BGP/OSPF/QoS/SLA)
- DPI analytics & data usage
- REST API & multi-tenancy

[View Controller Manual &rarr;](controller/){ .nx-card-link }

</div>

</div>

<div class="nx-section">
  <div class="nx-section-header">
    <h2>Getting Started</h2>
    <p class="nx-section-subtitle">Go from zero to a fully operational SD-WAN in four steps</p>
  </div>
  <div class="nx-timeline">
    <div class="nx-timeline-step">
      <div class="nx-timeline-marker">
        <span class="nx-step-num">1</span>
        <div class="nx-timeline-line"></div>
      </div>
      <div class="nx-timeline-content">
        <h4>Install NexappOS</h4>
        <p>Download the firmware image and install on your x86 hardware or virtual machine.</p>
        <a href="firmware/02-installation/download-install/">Download &amp; Install &rarr;</a>
      </div>
    </div>
    <div class="nx-timeline-step">
      <div class="nx-timeline-marker">
        <span class="nx-step-num">2</span>
        <div class="nx-timeline-line"></div>
      </div>
      <div class="nx-timeline-content">
        <h4>Configure Network</h4>
        <p>Set up WAN and LAN interfaces, firewall zones, and basic connectivity.</p>
        <a href="firmware/02-installation/initial-setup/">Initial Setup &rarr;</a>
      </div>
    </div>
    <div class="nx-timeline-step">
      <div class="nx-timeline-marker">
        <span class="nx-step-num">3</span>
        <div class="nx-timeline-line"></div>
      </div>
      <div class="nx-timeline-content">
        <h4>Register with Controller</h4>
        <p>Connect your router to the centralized SDWAN Controller for fleet management.</p>
        <a href="firmware/02-installation/controller-registration/">Register Device &rarr;</a>
      </div>
    </div>
    <div class="nx-timeline-step">
      <div class="nx-timeline-marker">
        <span class="nx-step-num">4</span>
      </div>
      <div class="nx-timeline-content">
        <h4>Build SD-WAN Topology</h4>
        <p>Create hub-spoke or mesh topologies and deploy SD-WAN overlays across sites.</p>
        <a href="controller/04-topology/wizard/">Topology Wizard &rarr;</a>
      </div>
    </div>
  </div>
</div>

<div class="nx-section">
  <div class="nx-section-header">
    <h2>Explore by Topic</h2>
    <p class="nx-section-subtitle">Jump directly to the documentation you need</p>
  </div>
  <div class="nx-topics-grid">

  <a href="firmware/05-sdwan/overview/" class="nx-topic">
    <strong>SD-WAN Fabric</strong>
    <small>Overlay tunnels, WAN members, IPsec encryption</small>
  </a>

  <a href="firmware/08-routing/bgp/" class="nx-topic">
    <strong>BGP Routing</strong>
    <small>Dynamic routing, route reflector, VRF</small>
  </a>

  <a href="firmware/06-sla/health-dashboard/" class="nx-topic">
    <strong>Performance SLA</strong>
    <small>Path monitoring, quality tiers, steering</small>
  </a>

  <a href="controller/06-policies/overview/" class="nx-topic">
    <strong>Global Policies</strong>
    <small>Centralized BGP, OSPF, QoS, SLA policies</small>
  </a>

  <a href="controller/09-dpi/overview/" class="nx-topic">
    <strong>DPI Analytics</strong>
    <small>Traffic analysis, app intelligence, alerts</small>
  </a>

  <a href="firmware/09-ha/overview/" class="nx-topic">
    <strong>High Availability</strong>
    <small>VRRP failover, DC/DR disaster recovery</small>
  </a>

  <a href="controller/14-api/authentication/" class="nx-topic">
    <strong>REST API</strong>
    <small>Authentication, 20 endpoints, examples</small>
  </a>

  <a href="firmware/10-firewall/zones-policies/" class="nx-topic">
    <strong>Firewall &amp; Security</strong>
    <small>Zones, rules, NAT, threat shield, DPI</small>
  </a>

  </div>
</div>

<div class="nx-footer-bar">
  <div class="nx-footer-grid">
    <div>
      <strong>Nexapp Technologies Pvt. Ltd.</strong>
      <p>Enterprise SD-WAN Solutions</p>
    </div>
    <div>
      <strong>Resources</strong>
      <p><a href="firmware/glossary/">Firmware Glossary</a> &middot; <a href="controller/glossary/">Controller Glossary</a></p>
    </div>
    <div>
      <strong>Support</strong>
      <p>Contact your Nexapp account team or visit the <a href="#">support portal</a></p>
    </div>
  </div>
</div>
