# API Troubleshooting

## Overview

This page covers troubleshooting for the Nexapp SDWAN Controller REST API. It includes an HTTP status code reference, common error patterns, and debugging techniques. For general troubleshooting, see [Common Issues](common-issues.md). For deployment-specific issues triggered via the API, see [Deployment Issues](deployment.md).

## HTTP Status Code Reference

| Code | Meaning | What to Check |
|------|---------|---------------|
| `200 OK` | Request succeeded | — |
| `201 Created` | Resource created successfully | Check the response body for the new resource's `id` and URL |
| `204 No Content` | Delete succeeded | — |
| `400 Bad Request` | Invalid request body or query parameters | Read the response body — it contains field-level error details |
| `401 Unauthorized` | Token missing, invalid, or expired | Include `Authorization: Token <key>` header; regenerate token if expired |
| `403 Forbidden` | Authenticated but insufficient permissions | Check user role and organization membership |
| `404 Not Found` | Resource does not exist or belongs to another org | Verify the ID is correct and belongs to your organization |
| `405 Method Not Allowed` | HTTP method not supported on this endpoint | Check the API reference for allowed methods on this endpoint |
| `429 Too Many Requests` | Rate limit exceeded | Wait for limit to reset; see rate limit details below |
| `500 Internal Server Error` | Unexpected server error | Check server logs; contact support with the request details |
| `503 Service Unavailable` | Controller is degraded or down | Check `GET /api/v1/health/` to identify the failing component |

## Interpreting 400 Errors

A `400 Bad Request` response always includes a JSON body with field-level error details:

```json
{
  "name": ["This field is required."],
  "organization": ["Invalid organization slug 'unknown-org'."],
  "wan_port": ["Ensure this value is between 1024 and 65535."]
}
```

Each key is a field name; the value is a list of error messages. Fix each identified field and retry.

**Common 400 causes:**

- Missing required field in POST body
- Field value out of range (e.g., port number, ASN range)
- Duplicate unique value (e.g., device name already exists in organization)
- Invalid UUID or integer format for ID fields
- JSON syntax error in request body

## Common API Issues

| Issue | Symptom | Resolution |
|-------|---------|-----------|
| **Empty results list** | `GET /topology/` returns `{"count": 0, "results": []}` | User is not assigned to any organization. Go to **Users & Organizations > User Management** and assign the user to an organization. |
| **Cannot see a specific resource** | `GET /topology/5/` returns `404` | The resource either does not exist or belongs to a different organization. Verify the ID and your org assignment. |
| **Cannot create a device** | `POST /device/` returns `400` with `name already exists` | Device names must be unique within an organization. Use a different name. |
| **API list cut off at 20 results** | Expected 50 devices but only 20 returned | Default `page_size` is 20. Add `?page_size=100` to the request URL. Navigate pages using the `next` URL in the response. |
| **Rate limit hit on deployments** | Deploy API returns `429` | Deploy endpoints are limited to 10 requests/hour per token. Wait for the limit to reset. |
| **Session cookie expired mid-operation** | Browser-based request gets `403` after inactivity | Log in again. For long-running scripts, use token authentication instead of session authentication. |
| **PATCH returns 200 but data unchanged** | Sending wrong field name in PATCH body | Field names are case-sensitive and use underscore format (e.g., `hub_device`, not `hubDevice`). Check the API reference for exact field names. |
| **Topology deploy via API returns `accepted` but no deployment appears** | Rate limit on deploy action | Each topology has a deploy rate limit. Wait 1 hour and check the deployment queue. |

## Rate Limits

| Limit Type | Rate | HTTP Status on Exceed | Retry Strategy |
|------------|------|----------------------|----------------|
| Burst | 60 requests / minute | `429` | Wait 60 seconds |
| Sustained | 1,000 requests / hour | `429` | Wait for hourly window to reset |
| Deploy action | 10 requests / hour per topology | `429` | Wait 1 hour |

When `429` is returned, check the `Retry-After` response header for the exact number of seconds to wait:

```bash
curl -I -H "Authorization: Token <key>" https://203.0.113.10/api/v1/nsbond/topology/1/deploy/
# Look for: Retry-After: 3543
```

## Debugging Tips

### View Raw JSON in Browser

Append `?format=json` to any API URL to force a JSON response when browsing from a web browser:

```
https://203.0.113.10/api/v1/nsbond/topology/?format=json
```

### Verbose curl Output

Use `curl -v` to see request and response headers for debugging authentication or header issues:

```bash
curl -v \
  -H "Authorization: Token <key>" \
  https://203.0.113.10/api/v1/nsbond/topology/
```

Look for the `< HTTP/1.1 <status>` line and the response headers for clues.

### Check Pagination

Always check the `count` field in list responses — it shows the total number of matching records, even if the current page shows fewer:

```json
{
  "count": 47,
  "next": "https://203.0.113.10/api/v1/nsbond/device/?page=2",
  "previous": null,
  "results": [...]
}
```

If `count` is 47 but you see only 20 results, use the `next` URL to fetch subsequent pages.

### Validate Request Body Format

Ensure the request body is valid JSON and includes the `Content-Type: application/json` header:

```bash
curl -s -X POST \
  -H "Authorization: Token <key>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Topology", "type": "hub-spoke"}' \
  https://203.0.113.10/api/v1/nsbond/topology/
```

Missing `Content-Type` causes the server to reject the body as form data rather than JSON.

## See Also

- [API Authentication](../14-api/authentication.md) — Token setup, rate limits, status codes
- [NsBond API Reference](../14-api/nsbond.md) — SD-WAN endpoints
- [DPI API Reference](../14-api/dpi.md) — DPI analytics endpoints
- [Common Issues](common-issues.md) — General troubleshooting
- [Deployment Issues](deployment.md) — Deployment pipeline troubleshooting
