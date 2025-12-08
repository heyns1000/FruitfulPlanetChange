# FruitfulPlanet Development Guide

## Architecture Overview

**Stack**: React 18 + Express.js monorepo with TypeScript, PostgreSQL (Neon), Drizzle ORM, and Vite.

**Key Directories**:
- `client/src/` - React frontend with Wouter routing, TanStack Query, Radix UI components
- `server/` - Express backend with API routes, middleware, seeding scripts
- `shared/` - Common schemas (Drizzle tables, Zod validators) shared between client/server
- `db/migrations/` - Drizzle database migration files

**Module Resolution**: Uses path aliases `@/` → `client/src/`, `@shared/` → `shared/`

## Database & ORM Patterns

**Schema Definition**: All tables defined in `shared/schema.ts` using Drizzle ORM:
```typescript
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sectorId: integer("sector_id").references(() => sectors.id)
});
```

**Data Access**: Centralized through `server/storage.ts` singleton service with methods like:
- `storage.getBrands()`, `storage.createBrand()`, `storage.seedBanimalData()`
- All database operations go through this layer - never import `db` directly in routes

**Migrations**: Run `pnpm db:generate` after schema changes, then `pnpm db:migrate` to apply

## Development Workflow

**Local Dev**: `pnpm dev` (runs `tsx server/index.ts` which auto-seeds DB in development mode)

**Build**: `pnpm build` - builds client with Vite, server with esbuild to `dist/`

**Database Seeding**: On dev startup, `server/index.ts` automatically runs:
- `seedDatabase()` for core sectors/brands
- `seedLegalDocuments()`, `updateSectorPricing()`, `storage.seedBanimalData()`, etc.
- Check `server/seed-*.ts` files for seeding patterns

**Port**: Server runs on port 5000 (only unfirewalled port in Replit environment)

## API Route Patterns

**Registration**: Routes registered in `server/routes.ts` via `registerRoutes(app)`

**Structure**: Individual route files in `server/routes/` export default functions:
```typescript
// server/routes/sectors.ts
export default function(app: Express) {
  app.get("/api/sectors", async (req, res) => {
    const sectors = await storage.getSectors();
    res.json(sectors);
  });
}
```

**Common Routes**: `/api/sectors`, `/api/brands`, `/api/ecosystem/*`, `/api/sidebar/items`

## Frontend Architecture

**Routing**: Uses Wouter (lightweight) - routes defined in `client/src/App.tsx`:
```tsx
<Route path="/sectors" component={SectorsPage} />
```

**State Management**: TanStack Query for server state, React Context for global state (theme, auth)

**UI Components**: 
- Design system in `client/src/components/ui/` (Radix-based, Tailwind styled)
- Portal components in `client/src/components/portal/` (feature-specific like `FruitfulMarketplace`, `SectorRelationshipMapping`)

**Styling**: Tailwind CSS 4 with custom config in `tailwind.config.ts`, uses `class-variance-authority` for component variants

## HSOMNI9000 Ecosystem Concepts

**Sector System**: 48+ hierarchical business sectors (agriculture, banking, creative, etc.) with relationship mapping
- Sectors stored in DB with tiers: Enterprise, Infrastructure, Professional, Standard
- Complex inter-sector relationships tracked in `sector_relationships` table (710+ connections)

**Distributed Apps**: FruitfulPlanet is main hub connected to 7 other apps:
- SamFox (creative studio), Banimal (charitable toys), VaultMesh (trading), HotStack (code hosting), SecureSign (legal), OmniGrid/FAA.Zone (infrastructure), BuildNest (construction)
- Shared API keys managed via `shared/api-config.ts`

**"Seedwave" Philosophy**: Continuous data seeding/syncing paradigm with "water the seed 24/7" mission
- ScrollBinder protocol for real-time 3-second sync intervals
- Global sync indicator shows ecosystem health

## Testing & Deployment

**Tests**: `pnpm test` runs Vitest - test files in `tests/unit/` and `tests/integration/`

**Docker**: Multi-stage `Dockerfile` + `docker-compose.yml` for local PostgreSQL/Redis stack

**Kubernetes**: Full k8s manifests in `k8s/` directory with HPA, secrets, ingress

**CI/CD**: GitHub Actions workflows in `.github/workflows/` for linting, testing, Docker builds

## Project-Specific Conventions

- **Environment**: Development auto-seeds, production requires manual `DATABASE_URL` in `.env`
- **Error Handling**: Express error middleware catches all errors, returns JSON with status/message
- **Logging**: Request logging middleware logs API calls with timing: `GET /api/sectors 200 in 45ms`
- **Security**: No `.env` in version control - use `.env.example` template
- **Payment Integration**: PayPal SDK configured via `server/paypal.ts` for VaultMesh checkout flows
