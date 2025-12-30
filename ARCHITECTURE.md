# System Architecture

## Overview

FruitfulPlanet is a modern, globally-scalable full-stack application designed for high availability, performance, and security. This document provides detailed technical architecture documentation.

## Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **UI Components**: Radix UI, Recharts
- **Forms**: React Hook Form with Zod validation

### Backend

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js
- **WebSocket**: ws library
- **Session Store**: connect-pg-simple / Redis

### Database

- **Primary Database**: PostgreSQL 16 (Neon Serverless)
- **Cache Layer**: Redis 7
- **Schema Management**: Drizzle Kit
- **Migrations**: Drizzle migrations

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Winston logging
- **Load Balancing**: NGINX Ingress Controller

## System Components

### 1. Application Layer

```
┌──────────────────────────────────────────────────────────┐
│                   Application Server                      │
├──────────────────────────────────────────────────────────┤
│  HTTP Server (Express)                                    │
│  ├── Security Middleware (helmet, rate-limit, CORS)      │
│  ├── Session Management (express-session)                │
│  ├── Authentication (Passport.js)                        │
│  ├── API Routes                                          │
│  ├── WebSocket Server                                    │
│  ├── Metrics & Logging                                   │
│  └── Error Handling                                      │
├──────────────────────────────────────────────────────────┤
│  Static File Server (Vite Production Build)              │
└──────────────────────────────────────────────────────────┘
```

### 2. Data Layer

#### Database Schema

The application uses PostgreSQL with the following key entities:

**Core Tables:**

- `users` - User accounts and authentication
- `sessions` - User session data
- `sectors` - Business sectors/categories
- `brands` - Brand information
- `products` - Product catalog
- `orders` - Order management
- `transactions` - Payment transactions

**Relationships:**

- Users have many orders
- Brands belong to sectors
- Products belong to brands
- Orders contain products
- Transactions link to orders

#### Connection Pooling

```typescript
// server/db/index.ts
import { Pool } from '@neondatabase/serverless';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast on connection issues
});
```

### 3. Caching Strategy

#### Redis Cache Architecture

```
Request → Check Cache → Cache Hit?
           ↓              ↓ Yes: Return cached data
           ↓ No           ↓
           ↓              └─────────────────┐
           ↓                                ↓
    Query Database ────→ Store in Cache → Return data
```

**Cache Layers:**

1. **Session Cache**: User sessions stored in Redis
2. **API Response Cache**: Frequently accessed data
3. **Rate Limiting Cache**: Request counters
4. **Feature Flags Cache**: Runtime configuration

**Cache Invalidation:**

- Time-based expiration (TTL)
- Event-based invalidation (on data updates)
- Manual cache busting via admin API

### 4. Security Architecture

#### Security Layers

1. **Network Security**
   - HTTPS/TLS encryption
   - Rate limiting (100 requests/minute)
   - DDoS protection via CDN
   - IP whitelisting for admin endpoints

2. **Application Security**
   - Helmet.js security headers
   - CORS with whitelist
   - Input validation (Zod)
   - SQL injection protection (ORM)
   - XSS protection (React escaping)
   - CSRF tokens

3. **Authentication & Authorization**
   - Passport.js with local strategy
   - Session-based authentication
   - JWT tokens for API access
   - Role-based access control (RBAC)
   - Multi-factor authentication (optional)

4. **Data Security**
   - Password hashing (bcrypt)
   - Encrypted environment variables
   - Database encryption at rest
   - Secure session storage
   - PII data encryption

### 5. API Architecture

#### RESTful API Design

```
/api/
├── /auth/
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /register
│   └── GET /me
├── /users/
│   ├── GET /users
│   ├── GET /users/:id
│   ├── PUT /users/:id
│   └── DELETE /users/:id
├── /sectors/
│   ├── GET /sectors
│   └── GET /sectors/:id
├── /brands/
│   ├── GET /brands
│   ├── POST /brands
│   └── GET /brands/:id
├── /products/
│   ├── GET /products
│   ├── POST /products
│   └── GET /products/:id
├── /orders/
│   ├── GET /orders
│   ├── POST /orders
│   └── GET /orders/:id
└── /health/
    ├── GET /liveness
    └── GET /readiness
```

#### API Standards

- **Status Codes**: Standard HTTP status codes
- **Response Format**: Consistent JSON structure
- **Error Handling**: Structured error responses
- **Versioning**: URL-based versioning (/api/v1/)
- **Pagination**: Cursor-based pagination
- **Filtering**: Query parameters for filtering
- **Sorting**: Sort by multiple fields
- **Rate Limiting**: Per-user and per-IP limits

### 6. Real-Time Architecture

#### WebSocket Server

```
Client ←──WebSocket──→ Server
  ↓                       ↓
  └─── Connection Pool ───┘
         ↓
    Message Router
         ↓
    Event Handlers
```

**Use Cases:**

- Real-time notifications
- Live metrics updates
- Chat functionality
- Collaborative editing
- Order status updates

### 7. Monitoring & Observability

#### Metrics Collection

**Application Metrics:**

- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (errors/second)
- Active connections
- Memory usage
- CPU usage

**Business Metrics:**

- User registrations
- Orders placed
- Revenue
- Active users
- Conversion rates

#### Health Checks

**Liveness Probe**: Checks if application is running

```typescript
GET /api/health/liveness
Response: { status: "ok", timestamp: "..." }
```

**Readiness Probe**: Checks if application can serve traffic

```typescript
GET /api/health/readiness
Response: {
  status: "ready",
  checks: {
    database: "healthy",
    redis: "healthy",
    memory: "healthy"
  }
}
```

#### Logging Strategy

**Log Levels:**

- ERROR: Application errors, exceptions
- WARN: Warning conditions, deprecated features
- INFO: General informational messages
- DEBUG: Detailed debugging information

**Log Format:**

```json
{
  "timestamp": "2025-11-20T01:22:00.000Z",
  "level": "info",
  "message": "Request completed",
  "context": {
    "method": "GET",
    "path": "/api/products",
    "statusCode": 200,
    "duration": 45,
    "userId": "user_123"
  }
}
```

### 8. Scaling Strategy

#### Horizontal Scaling

**Kubernetes HPA Configuration:**

- Min replicas: 3
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

**Scaling Triggers:**

- High CPU utilization
- High memory usage
- Request queue depth
- Custom metrics (requests/second)

#### Database Scaling

**Read Replicas:**

- Master: Write operations
- Replicas: Read operations
- Automatic failover
- Connection pooling

**Partitioning:**

- Horizontal partitioning (sharding)
- Vertical partitioning (column separation)
- Time-based partitioning (archives)

#### Caching Strategy

**Multi-Level Cache:**

1. Browser cache (static assets)
2. CDN cache (global edge locations)
3. Application cache (Redis)
4. Database query cache

### 9. Deployment Architecture

#### Multi-Environment Strategy

```
Development → Staging → Production
    ↓            ↓          ↓
  Local      Kubernetes  Kubernetes
  Docker     (Staging)   (Production)
```

**Environment Separation:**

- Separate databases
- Separate secrets
- Separate domains
- Separate monitoring

#### CI/CD Pipeline

```
Code Push → Tests → Build → Security Scan → Deploy
    ↓         ↓       ↓           ↓            ↓
  Lint    Unit    Docker   Dependency     Kubernetes
          E2E     Image      Audit         Rolling Update
```

### 10. Disaster Recovery

#### Backup Strategy

**Database Backups:**

- Automated daily backups
- Point-in-time recovery (PITR)
- Retention: 30 days
- Off-site backup storage

**Application State:**

- Stateless application design
- Session data in Redis (replicated)
- File uploads in object storage

#### Recovery Procedures

**Database Failure:**

1. Automatic failover to replica
2. Promote replica to master
3. Alert operations team
4. Update DNS/connection strings

**Application Failure:**

1. Kubernetes auto-restart
2. Health check failure detection
3. Traffic rerouting
4. Scale up replacement pods

**Complete Site Failure:**

1. Activate backup region
2. DNS failover (geo-routing)
3. Restore from backups
4. Data synchronization

### 11. Performance Optimization

#### Frontend Optimization

- Code splitting (route-based)
- Lazy loading components
- Image optimization
- Asset compression (gzip, brotli)
- CDN for static assets
- Service worker caching

#### Backend Optimization

- Database query optimization
- Connection pooling
- Response compression
- HTTP/2 support
- Async operations
- Caching frequently accessed data

#### Database Optimization

- Proper indexing
- Query optimization
- Connection pooling
- Read replicas
- Materialized views
- Query result caching

## Best Practices

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier code formatting
- Pre-commit hooks
- Code review process

### Testing

- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)
- Load testing
- Security testing

### Documentation

- Code comments
- API documentation (OpenAPI)
- Architecture diagrams
- Runbooks for operations
- Change logs

## Future Enhancements

- GraphQL API endpoint
- Event-driven architecture
- Message queue (RabbitMQ/Kafka)
- Service mesh (Istio)
- Advanced monitoring (Grafana dashboards)
- Multi-region active-active deployment
- Machine learning integrations
- Advanced analytics platform

## References

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
