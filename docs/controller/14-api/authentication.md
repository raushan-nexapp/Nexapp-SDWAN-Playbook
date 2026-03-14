# API Authentication

## Overview

The Nexapp SDWAN Controller provides a REST API at `https://<controller>/api/v1/`. All API requests require authentication. Two authentication methods are supported: Token authentication (for scripts and integrations) and Session authentication (for browser-based requests).

## Base URL

```
https://<controller>/api/v1/
```

Replace `<controller>` with your controller's hostname or IP address. For the demo server, this is `https://demo.nexapp.co.in/api/v1/`.

## Token Authentication

Token authentication is the recommended method for scripts, automation tools, and third-party integrations.

**Format:** Include an `Authorization` header with every request:

```
Authorization: Token <your-api-token>
```

### Getting Your API Token

1. Log in to the controller web interface.
2. Click your profile avatar in the top-right corner.
3. Select **API Token** from the dropdown menu.
4. Click **Copy** to copy your token to the clipboard.

Alternatively, an administrator can view and manage tokens via the administration panel at `/admin/authtoken/token/`.

### Example Request

```bash
curl -s \
  -H "Authorization: Token 3f20b79ac38be566bdce68f8a1fef374235478bd" \
  https://203.0.113.10/api/v1/health/
```

```bash
# List all topologies
curl -s \
  -H "Authorization: Token 3f20b79ac38be566bdce68f8a1fef374235478bd" \
  https://203.0.113.10/api/v1/nsbond/topology/
```

## Session Authentication

Session authentication is used automatically when you access the API from a browser after logging in to the controller. It requires a CSRF token for state-changing requests (POST, PATCH, PUT, DELETE).

**For browser-based requests:**

Include the CSRF token in the `X-CSRFToken` request header. The CSRF token is available in the `csrftoken` cookie after login.

```javascript
// Browser fetch example
const csrfToken = document.cookie
  .split(';')
  .find(c => c.trim().startsWith('csrftoken='))
  ?.split('=')[1];

fetch('/api/v1/nsbond/topology/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  body: JSON.stringify({ name: 'My Topology' }),
});
```

Session authentication is not recommended for scripts or automation. Use token authentication instead.

## Token Rotation

If your token is compromised or you need to rotate it for security reasons:

1. Go to your profile → **API Token**.
2. Click **Regenerate Token**.
3. Confirm in the dialog.

The old token is invalidated immediately. Update any scripts or integrations with the new token.

!!! warning "Token Invalidation is Immediate"
    Regenerating your token instantly revokes the old one. All API calls using the old token will receive `401 Unauthorized` after regeneration.

## Rate Limits

The API enforces rate limits to protect system stability:

| Limit Type | Rate | Applies To |
|------------|------|------------|
| **Burst** | 60 requests / minute | All authenticated API endpoints |
| **Sustained** | 1,000 requests / hour | All authenticated API endpoints |
| **Deploy actions** | 10 requests / hour | Topology deploy and config push endpoints |

When a rate limit is exceeded, the API returns `429 Too Many Requests`. The response includes a `Retry-After` header indicating how many seconds to wait before retrying.

**Best practice for high-volume integrations:**

- Cache API responses where possible rather than polling repeatedly.
- Use exponential backoff when retrying after `429` responses.
- Batch operations where the API supports it (e.g., bulk device queries).

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `204 No Content` | Delete succeeded |
| `400 Bad Request` | Invalid request body — check the response for field-level errors |
| `401 Unauthorized` | Token missing, invalid, or expired |
| `403 Forbidden` | Token valid but insufficient permissions for this resource |
| `404 Not Found` | Resource does not exist or does not belong to your organization |
| `405 Method Not Allowed` | HTTP method not supported for this endpoint |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error — check server logs |

## Organization Scoping

All API responses are automatically filtered to include only resources belonging to your assigned organizations. A superuser sees all resources across all organizations. A staff user sees only their organizations' resources.

If you receive an empty list from a resource endpoint (e.g., `GET /api/v1/nsbond/topology/` returns `{"results": []}`), the most common cause is that the user account is not assigned to any organization. See [User Management](../13-multi-tenancy/users.md).

## Pagination

All list endpoints are paginated. The default page size is 20 results. Use query parameters to control pagination:

```bash
# Get first 100 results
GET /api/v1/nsbond/device/?page_size=100

# Get second page of results
GET /api/v1/nsbond/device/?page=2&page_size=20
```

The response body includes `count`, `next`, and `previous` fields for navigating pages:

```json
{
  "count": 47,
  "next": "https://203.0.113.10/api/v1/nsbond/device/?page=2",
  "previous": null,
  "results": [...]
}
```

## See Also

- [NsBond API Reference](nsbond.md) — SD-WAN topology and device endpoints
- [DPI API Reference](dpi.md) — DPI snapshot and analytics endpoints
- [HA API Reference](ha.md) — High availability endpoints
- [Health API Reference](health.md) — System health check endpoint
- [API Troubleshooting](../16-troubleshooting/api.md) — Resolving common API errors
