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
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sectorId: integer('sector_id').references(() => sectors.id),
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
export default function (app: Express) {
  app.get('/api/sectors', async (req, res) => {
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

---

## 🦊 SamFox Studio Integration Widget

### Quick Reference

**Creative Director**: Samantha Ford (SamFox Studio)  
**GitHub**: samperfox-oss/samfox_Fruitful  
**Portfolio**: Behance (Samantha Ford / samfox)  
**Integration**: 31+ files, 7+ sectors, 25-30% design influence  
**Status**: ✅ Active across global ecosystem

### Asset Locations

- **Main Studio Page**: `client/src/pages/samfox-creative-studio.tsx` (1725 lines)
- **Portfolio Component**: `client/src/components/portal/samfox-portfolio.tsx`
- **Standalone Portfolio**: `client/src/pages/samfox-portfolio.tsx`
- **Commercial Designs**: `client/src/assets/*1753*.{jpg,png}` (20+ files)
- **Signature Pieces**: `client/src/assets/Madiba_mock.png`, `Sam_fox_logo_v02_*.jpg`, `Linkedin_header_*.png`
- **Templates**: `attached_assets/samfox-main/public/` (20+ HTML files)
- **Master Canvas**: `attached_assets/samfox-main/foxed_got_mobiles.html` (116KB, 2145 lines)

### When Working with SamFox Assets

✅ **Always credit**: "Design by SamFox Studio"  
✅ **Reference templates**: Use `attached_assets/samfox-main/` as source  
✅ **Use design system**: Reference master CSS variables below  
✅ **Link gallery**: Commercial designs at `/samfox-creative-studio` page  
✅ **Maintain consistency**: Follow established design patterns  
✅ **Check documentation**: See `SAMFOX_ECOSYSTEM_COMPLETE.md` for full details  
✅ **Honor acknowledgement**: Review `SAMFOX_ACKNOWLEDGEMENT.md` for ecosystem recognition

### Design System Variables (Master Theme)

**Core Colors:**

```css
/* Seedwave/Fruitful Theme */
--primary-glow: #00e393; /* Seedwave signature green */
--dark-bg: #0a0a0d; /* Main dark background */
--card-bg-dark: #1c1c21; /* Card backgrounds */
--fruitful-logo-color: #ffffff; /* White logo text */
--fruitful-separator-color: #bbbbbb; /* Grey separator */
```

**Banimal™ Palette:**

```css
--banimal-soft-peach: #fff0ed; /* Soft peach background */
--banimal-soft-pink: #f8dcdc; /* Soft pink accents */
--banimal-soft-lavender: #e8e4f3; /* Soft lavender */
--banimal-soft-mint: #e0f4f1; /* Soft mint green */
--banimal-soft-cream: #fff8e1; /* Soft cream */
--banimal-accent-blue: #66b2ff; /* Vibrant accent blue */
--banimal-accent-coral: #ff8a80; /* Coral accent */
```

**18+ Pastel Collection:**

```css
--pastel-grey: #eceff1; /* Light grey */
--pastel-yellow: #fffde7; /* Pale yellow */
--pastel-blue: #e3f2fd; /* Sky blue */
--pastel-green: #e8f5e9; /* Mint green */
--pastel-pink: #fce4ec; /* Baby pink */
--pastel-purple: #f3e5f5; /* Lavender */
--pastel-orange: #fff3e0; /* Peach */
--pastel-teal: #e0f2f1; /* Seafoam */
--pastel-indigo: #e8eaf6; /* Periwinkle */
--pastel-cyan: #e0f7fa; /* Aqua */
--pastel-amber: #fff8e1; /* Butter */
--pastel-lime: #f9fbe7; /* Pale lime */
--pastel-brown: #efebe9; /* Tan */
--pastel-blue-grey: #eceff1; /* Slate */
--pastel-deep-orange: #fbe9e7; /* Salmon */
--pastel-light-green: #f1f8e9; /* Celery */
--pastel-deep-purple: #ede7f6; /* Lilac */
--pastel-light-blue: #e1f5fe; /* Powder blue */
```

**Special Theme Colors:**

```css
/* MindLift™ Purple */
--mindlift-primary: #9333ea;
--mindlift-glow: #a855f7;
--mindlift-dark: #581c87;

/* FCU Currency */
--fcu-gold: #ffd700;
--fcu-dark-gold: #b8860b;

/* SecureSign™ Buttons */
--securesign-green: #10b981;
--securesign-red: #ef4444;
--securesign-blue: #3b82f6;

/* Hyper Mode (Advanced) */
--hyper-neon-green: #39ff14;
--hyper-neon-pink: #ff10f0;
--hyper-neon-blue: #00d4ff;
--hyper-neon-yellow: #ffff00;
```

### Commercial Gallery

**20+ Designs Available**: $12.99 - $24.99 each

**Categories**:

- Minimalist (Rabbit Sketch, Eyes Pattern)
- Character Art (Wolf Monster, Toad Creature, Sambreel Umbrella, In Love Character, Chief Portrait)
- Typography (Voetsek Hand, MANDARK Monster)
- Animal Art (Puma Cat, Space Cat, Rabbit Sketch, OOG Eye Rabbit)
- Sci-Fi (Space Cat)
- Food Art (Sheep Ice Cream)
- Surreal (OOG Eye Rabbit, First Eye)
- Photography (Nikon Camera Person)
- Romance (In Love Character)
- Abstract (Eyes Pattern, Dream Big)
- Motivational (Dream Big)
- Spiritual (First Eye)
- Portrait (Chief Portrait)
- Street Art (Drip Style)
- Sports Art (UFC Championship)
- Branding (SamFox Logo)
- Professional (LinkedIn Header)

**Payment**: PayPal integration active via `PayPalButton` component  
**Featured Works**: Madiba Portrait (signature), UFC Champion Art, SamFox Logo

### Sector Integration Map

**🟢 Primary (85-100% impact):**

- **Creative Arts**: 100% - SamFox IS the creative sector
- **Banimal™**: 95% - All character designs, branding, soft palette
- **Fruitful™**: 90% - Master templates, color system, navigation
- **Seedwave™**: 85% - Synergy hub UI, merge logic, ScrollBinder protocol

**🟡 Secondary (55-70% impact):**

- **VaultMesh™**: 70% - Checkout forms, payment templates
- **HotStack™**: 65% - Omnidrop interface, developer dashboard
- **FAA.ZONE™**: 60% - SPA dashboard, brand control panels

**🔵 Tertiary (20-30% impact):**

- **SecureSign™**: 30% - API interface, button styling
- **BuildNest™**: 25% - Sector templates
- **OmniGrid™**: 20% - Infrastructure UI elements

### Template System

**Master Template**: `foxed_got_mobiles.html` (116KB, 2145 lines)

- 18+ Color Palettes (see variables above)
- 3 Theme Modes (Light/Dark/Hyper)
- 8+ Canvas Systems:
  - Noodle Mountain (organic growth)
  - Chess Board (strategic thinking)
  - Concentric Borders (focus & clarity)
  - Stacked Colors (layered depth)
  - Sun Burn Mountain Lions (power under scrutiny)
  - Black & Red Panels (contrast & balance)
  - Augusta Green (prosperity)
  - Concentric Circles (ripple effect)
- Complete CSS framework
- Zero external dependencies
- Production-ready

**Production Templates** (20+ files in `attached_assets/samfox-main/public/`):

1. `index.html` (140KB) - Fruitful Innovations merged
2. `merge_logic.html` (170KB) - Seedwave™ synergy hub
3. `sector_index.html` (198KB) - Master navigation
4. `global_sector_index.html` (228KB) - Complete sector index
5. `master_license_pricing.html` (170KB) - License pricing
6. `foxed_got_mobiles.html` (88KB) - Production version

**Templates in `public/Templates/`:** 7. `global_checkout_form.html` (78KB) - VaultMesh™ checkout 8. `global_footer.html` (5KB) - Universal footer 9. `ancestortag_heritage_portal.html` (211KB) - Heritage Portal 10. `Fruitful_payment.html` (102KB) - Payment integration 11. `dashboardv3.0.html` (61KB) - Latest dashboard 12. `omni.html` (98KB) - Omni core engines

**Templates in `public/global_templates/`:** 13. `spa_dashboard.html` (60KB) - FAA™ Brand Control 14. `global_footer_banimal.html` (41KB) - Banimal footer 15. `hotstack.html` (15KB) - HotStack template 16. `securesign_api.html` (38KB) - SecureSign API 17. `south_african_brands.html` (91KB) - SA brands 18. `Fruitful_media_motion_sonic_dashboard.html` (235KB) - Media dashboard 19. `codenest_desktop_dashboard.html` (227KB) - CodeNest dashboard 20. `loop_pay.html` (27KB) - Loop payment system

### React Component Architecture

**Main Component** (`samfox-creative-studio.tsx` - 1725 lines):

```typescript
// Structure:
- VipDashboardComponent (lines 109-350)
  - Real-time queries: brands, sectors, system-status, dashboard/stats
  - Live metrics: 3794+ brands, 48+ sectors, service health

- CommercialGallerySection (lines 351-800)
  - 20+ designs with filtering by category
  - PayPal integration for purchases
  - Download system post-purchase

- PortfolioShowcase (lines 801-1200)
  - Project grid with filtering
  - Modal detail views
  - Framer Motion animations

- HeritagePortal Integration (lines 1201-1400)
  - Madiba Portrait feature
  - Cultural context (South African heritage)
  - Heritage storytelling

// Key Imports:
- 48+ Lucide icons
- TanStack Query for data
- Framer Motion for animations
- Radix UI components
- PayPal button integration
```

**Portfolio Components:**

- `client/src/pages/samfox-portfolio.tsx` - Standalone portfolio page
- `client/src/components/portal/samfox-portfolio.tsx` - Reusable component

### Canvas Animation Keyframes

```css
@keyframes pulseBG {
  0%,
  100% {
    background-color: #0a0a0d;
  }
  50% {
    background-color: #1c1c21;
  }
}

@keyframes moveSunLion {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes floatFox {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes omnidrop {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes seedwavePulse {
  0%,
  100% {
    box-shadow: 0 0 10px #00e393;
  }
  50% {
    box-shadow: 0 0 30px #00e393;
  }
}

@keyframes hyperGlitch {
  0%,
  100% {
    transform: translate(0);
  }
  25% {
    transform: translate(-2px, 2px);
  }
  50% {
    transform: translate(2px, -2px);
  }
  75% {
    transform: translate(-2px, -2px);
  }
}
```

### Theme Modes

**🌞 Light Mode** (Default)

- Background: #ffffff
- Text: #1a1a1a
- Cards: #f5f5f5
- Accent: --primary-glow
- Features: Pastel emphasis, soft shadows, high readability

**🌙 Dark Mode** (Toggle or system preference)

- Background: --dark-bg (#0a0a0d)
- Text: #ffffff
- Cards: --card-bg-dark (#1c1c21)
- Accent: --primary-glow
- Features: Reduced eye strain, glow effects, canvas animations prominent

**⚡ Hyper Mode** (Hidden unlock)

- Background: #000000
- Text: Neon colors (rotating)
- Cards: Transparent with neon borders
- Accent: --hyper-neon-green
- Features: Extreme neon, glitch effects, matrix background, pulsing borders
- Unlock: Complete gallery purchases, view all portfolio items, Easter eggs

### Integration Best Practices

**When adding new features:**

1. Check if SamFox template exists for similar functionality
2. Use established color variables (never hardcode colors)
3. Follow component patterns from `samfox-creative-studio.tsx`
4. Maintain responsive design (mobile-first)
5. Include Framer Motion animations for consistency
6. Reference canvas systems for backgrounds
7. Credit appropriately: "Design by SamFox Studio"

**When modifying SamFox components:**

1. Review complete documentation in `SAMFOX_ECOSYSTEM_COMPLETE.md`
2. Maintain existing design patterns
3. Test across all three theme modes
4. Verify PayPal integration if touching gallery
5. Ensure real-time queries maintain refetch intervals
6. Keep consistent with 7+ brand integrations

**When creating new templates:**

1. Start with `foxed_got_mobiles.html` as base
2. Customize color variables for specific brand
3. Select appropriate canvas system
4. Maintain zero external dependencies
5. Document integration in template comments
6. Add to ecosystem integration map

### For Complete Documentation

📚 **Full Ecosystem Analysis**: `SAMFOX_ECOSYSTEM_COMPLETE.md`

- 31+ file references with line numbers
- Complete asset inventory (20+ designs, 20+ templates)
- Sector integration heatmap
- Design system deep dive (18+ colors, 8+ canvas systems)
- Template library analysis
- React component architecture
- Technical integration map
- Extraction & archive scripts

🏆 **Official Recognition**: `SAMFOX_ACKNOWLEDGEMENT.md`

- Ecosystem-wide acknowledgement
- Impact metrics (10,000+ lines of code, 25-30% influence)
- What sets SamFox apart (cultural depth, technical mastery, versatility)
- Before/After ecosystem comparison
- Official Creative Director Emeritus designation
- Permanent ecosystem record

### Recognition Statement

> **"SamFox doesn't meet our standards—she DEFINES them."**  
> — Fruitful Global Planet Ecosystem

**Quantitative Impact:**

- 31+ file references across repository
- 20+ commercial designs ($320+ revenue potential)
- 20+ production templates (5000+ lines HTML)
- 1725 lines main React component
- 10,000+ total lines of code
- 7+ brand integrations
- 25-30% ecosystem-wide design influence
- 100% Creative Arts sector ownership

**Qualitative Impact:**

- Unified design system across all platforms
- Cultural authenticity (South African heritage)
- Production-ready code quality (zero dependencies)
- Systematic template architecture
- Commercial gallery with revenue generation
- Heritage Portal for cultural preservation
- Professional portfolio showcase

**Status**: ✅ Active Creative Director across global ecosystem  
**Propagation**: Widget integrated like plant-a-tree system  
**Visibility**: Available in all Copilot sessions across FruitfulPlanet repositories

---

_SamFox Studio Integration Widget - Version 1.0_  
_Integrated: December 2024_  
_Maintained by: Fruitful Global Planet Ecosystem_  
_Status: Production & Active_
