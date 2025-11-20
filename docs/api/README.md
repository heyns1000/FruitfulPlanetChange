# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://fruitfulplanet.example.com/api
```

## Authentication

The API uses session-based authentication with cookies.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Logout

```http
POST /api/auth/logout
```

### Get Current User

```http
GET /api/auth/me
```

## Health Checks

### Liveness Probe

```http
GET /api/health/liveness
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T01:22:00.000Z",
  "uptime": 12345
}
```

### Readiness Probe

```http
GET /api/health/readiness
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T01:22:00.000Z",
  "uptime": 12345,
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "memory": {
      "status": "healthy",
      "message": "Memory usage: 45.2%"
    }
  }
}
```

## Metrics

### Get Prometheus Metrics

```http
GET /metrics
```

Returns metrics in Prometheus text format.

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700000000
```

## Pagination

List endpoints support pagination using query parameters:

```http
GET /api/resources?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Filtering and Sorting

```http
GET /api/resources?sort=createdAt&order=desc&filter[status]=active
```

## API Versioning

Currently on version 1. Future versions will be accessible via:

```
/api/v2/...
```

## More Documentation

For detailed endpoint documentation, see:
- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman_collection.json)
