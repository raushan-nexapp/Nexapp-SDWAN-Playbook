# Join Tokens

!!! note "Controller-Managed Only"
    Join tokens are a controller-managed feature for simplified spoke enrollment. They are not available in standalone mode.

## Overview

Join tokens provide a simplified zero-touch provisioning method for adding spoke routers to an SD-WAN network. Instead of manually configuring each spoke with hub IP, tunnel address, and PSK, you generate a token on the hub (via the controller) and enter it on the spoke. The spoke automatically retrieves all overlay settings from the token and joins the SD-WAN fabric.

This is especially useful for large deployments where configuring each spoke individually would be time-consuming and error-prone.

## Prerequisites

- The hub router is registered with the controller and has an active overlay configuration.
- The spoke router is registered with the controller.
- The spoke router has internet connectivity to reach the hub.
- You have administrator access to the controller web interface.

## Configuration

### Generating a Token (on the Controller)

1. Log in to the controller web interface.
2. Navigate to the SD-WAN topology.
3. Select the hub device and click **Generate Join Token**.
4. The controller creates a token that encodes the hub IP, tunnel subnet, PSK, and other overlay parameters.
5. Copy the token. Tokens are typically valid for a limited time (e.g., 24 hours).

### Applying a Token (on the Spoke)

1. Log in to the spoke router's web UI.
2. Navigate to **Network > SD-WAN Fabric**.
3. Click **Join with Token**.
4. Paste the token into the token field.
5. Click **Apply**. The spoke automatically:
    - Configures the overlay with the correct hub IP and PSK.
    - Assigns a unique tunnel address from the hub's tunnel subnet.
    - Adds WAN members (auto-detected from available WAN interfaces).
    - Starts the SD-WAN bonding daemon.

!!! tip
    For deployments with many spokes, generate the token once and distribute it to all spoke installers. Each spoke that uses the token receives a unique tunnel address from the pool.

## Token Security

- Tokens contain the encrypted PSK and hub connection details. Treat them as sensitive credentials.
- Distribute tokens through secure channels only (not email or chat).
- Tokens expire after their validity period. Expired tokens are rejected.
- Each token can typically be used by multiple spokes (pool-based addressing).

## Verification

1. After applying the token, navigate to **Network > SD-WAN Fabric** on the spoke and verify the overlay shows **Connected**.
2. Confirm the tunnel address was automatically assigned.
3. On the controller, verify the spoke appears in the topology map as connected.

## Troubleshooting

| Symptom | Cause | Resolution |
|---------|-------|------------|
| "Token expired" error | The token has exceeded its validity period | Generate a new token on the controller and try again. |
| "Invalid token" error | Token was copied incorrectly (truncated or corrupted) | Copy the full token string without any extra spaces or line breaks. |
| Token applied but tunnel stays down | Spoke cannot reach the hub IP encoded in the token | Verify the spoke has internet connectivity and can reach the hub's public IP. Check firewall rules on both sides. |
| "Token already used" error | The token's address pool is exhausted | Generate a new token with a larger tunnel subnet, or manually configure the spoke (see [Overlay Tunnels](overlay-tunnels.md)). |

!!! info "See Also"
    - [Overlay Tunnels](overlay-tunnels.md) -- Manual overlay configuration (alternative to tokens)
    - [SD-WAN Fabric Overview](overview.md) -- Architecture and deployment overview
    - [Underlay Members](underlay-members.md) -- WAN link configuration
