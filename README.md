# FruitfulPlanet - Global Scale Full-Stack Application

A comprehensive, production-ready full-stack application built with modern technologies and designed for global scale deployment.

## 🌟 Features

- **Full-Stack TypeScript**: End-to-end type safety with TypeScript
- **Modern React Frontend**: Built with React 18, Vite, and Tailwind CSS
- **Express Backend**: Node.js/Express server with comprehensive middleware
- **PostgreSQL Database**: Robust relational database with Drizzle ORM
- **Redis Caching**: High-performance caching layer
- **Real-time Updates**: WebSocket support for live data
- **Production Ready**: Docker, Kubernetes, and CI/CD configured
- **Security Hardened**: Multiple security layers and best practices
- **Monitoring & Metrics**: Prometheus metrics and health checks
- **Global Scaling**: HPA, load balancing, and multi-region support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer / CDN                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Ingress                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Pods (Auto-scaling 3-10)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Frontend (React + Vite)                              │  │
│  │  Backend (Express + Node.js)                          │  │
│  │  - Security Middleware                                │  │
│  │  - Authentication & Authorization                     │  │
│  │  - API Routes                                         │  │
│  │  - WebSocket Server                                   │  │
│  │  - Metrics & Logging                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                │                         │
                ▼                         ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   PostgreSQL Database    │   │     Redis Cache         │
│   (Persistent Storage)   │   │   (Session & Cache)     │
└─────────────────────────┘   └─────────────────────────┘
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 16+
- Redis 7+ (optional, for caching)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fruitful-Global-Planet/FruitfulPlanetChange.git
   cd FruitfulPlanetChange
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm run dev
   ```

   The application will be available at `http://localhost:5000`

### Docker Development

```bash
# Start all services (app, PostgreSQL, Redis)
docker-compose up

# Stop all services
docker-compose down
```

## 📦 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t fruitfulplanet-app .

# Run the container
docker run -p 5000:5000 \
  -e DATABASE_URL=your_database_url \
  -e SESSION_SECRET=your_session_secret \
  fruitfulplanet-app
```

### Kubernetes Deployment

See the [k8s/README.md](./k8s/README.md) for detailed Kubernetes deployment instructions.

```bash
# Quick deploy
kubectl apply -f k8s/
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

#### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption
- `NODE_ENV`: Environment (development, production)

#### Optional Variables

- `REDIS_URL`: Redis connection string (for caching)
- `PORT`: Application port (default: 5000)
- `STRIPE_SECRET_KEY`: Stripe API key for payments
- `OPENAI_API_KEY`: OpenAI API key
- `SENTRY_DSN`: Sentry error tracking DSN

## 📚 Scripts

```bash
# Development
pnpm run dev          # Start development server with hot reload

# Building
pnpm run build        # Build for production
pnpm run check        # Type check without building

# Production
pnpm run start        # Start production server

# Database
pnpm run db:push      # Push schema changes to database
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e
```

## 🔒 Security

### Security Features

- ✅ Environment variables for sensitive data
- ✅ Helmet.js for security headers
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure session management

### Reporting Security Issues

Please report security vulnerabilities to security@fruitfulplanet.com

## 📊 Monitoring & Metrics

### Health Checks

- **Liveness**: `GET /api/health/liveness`
- **Readiness**: `GET /api/health/readiness`

### Metrics

Prometheus metrics available at `/metrics` endpoint.

### Logging

Structured JSON logs with Winston. Log levels: error, warn, info, debug.

## 🌍 Global Scaling

### Features for Global Scale

- **Horizontal Pod Autoscaling**: Automatically scales from 3 to 10 pods based on CPU/memory
- **Database Connection Pooling**: Efficient database connection management
- **Redis Caching**: Reduces database load and improves response times
- **CDN Integration**: Static asset delivery via CDN
- **Multi-Region Support**: Geo-routing and data replication strategies
- **Load Balancing**: NGINX-based load balancing configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Run `pnpm run check` before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

FruitfulPlanet Development Team

## 🔗 Links

- [Documentation](./docs/)
- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./docs/api/)
- [Kubernetes Guide](./k8s/README.md)

## 📞 Support

- Email: support@fruitfulplanet.com
- Issues: [GitHub Issues](https://github.com/Fruitful-Global-Planet/FruitfulPlanetChange/issues)

## 🙏 Acknowledgments

Built with modern technologies:
- React, TypeScript, Vite
- Express, Node.js
- PostgreSQL, Drizzle ORM
- Redis, Docker, Kubernetes
- And many other amazing open-source projects
