# Replit.md

## Overview

This is a full-stack TypeScript application built with React frontend and Express backend, designed as a comprehensive brand management portal for the "Fruitful Global" ecosystem. The application provides a complete dashboard interface for managing 6,005+ brands across multiple sectors, featuring advanced legal document management through SecureSign™ VIP, King Price insurance partnership integration, and complete deployment infrastructure for www.fruitfulcratedance.com.

## Recent Changes

**July 20, 2025**
- ✅ PostgreSQL Database Integration: Successfully migrated from in-memory storage to PostgreSQL database
- ✅ Drizzle ORM Implementation: Created comprehensive DatabaseStorage class with all CRUD operations
- ✅ Schema Migration: Pushed complete database schema including users, sectors, brands, system status, legal documents, repositories, and payments
- ✅ Connection Setup: Configured Neon PostgreSQL serverless connection with WebSocket support
- ✅ Global Dashboard Implementation: Built comprehensive dashboard matching HTML reference with all 14+ sectors
- ✅ Comprehensive Sector Integration: Added all sectors from reference (Agriculture & Biotech, Banking & Finance, Logistics & Packaging, Professional Services, SaaS & Licensing, NFT & Ownership, Quantum Protocols, Ritual & Culture, Nutrition & Food Chain, Zero Waste, Voice & Audio, Wellness Tech & Nodes, Utilities & Energy, Creative Tech)
- ✅ Database Seeding: Automated seeding with comprehensive brand and sector data
- ✅ VaultMesh™ Complete Integration: Full VaultMesh™ infrastructure with navigation (Dashboard, About, Products, Brand Packages)
- ✅ Real-time Data Access: Live metrics updating every 5 seconds, protocol management, ecosystem connections
- ✅ Repository/Project Setup Methodology: User has systematic approach to organizing repositories/projects within ecosystem
- ✅ Legal Documentation Integration: Complete integration of legal repository structure with document viewing and download functionality
- ✅ Final Development Phase: Comprehensive Seedwave™ Portal powered by VaultMesh™ with full ecosystem integration
- Database is now fully operational with complete brand ecosystem data, VaultMesh™ infrastructure, and legal documentation system

## User Preferences

Preferred communication style: Simple, everyday language.
Repository/Project Organization: User maintains systematic repository setup for ecosystem projects with limited scope focused on core ecosystem data (prime time data for comprehensive vision consolidation).

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js with TypeScript for API layer
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle with PostgreSQL
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions (configured for PostgreSQL storage)
- **Environment**: Development/production modes with appropriate middleware

### Database Schema
The application uses comprehensive entities including:
- **Users**: Authentication and user management
- **Sectors**: Business sector categorization (45+ sectors total including Fruitful Crate Dance)
- **Brands**: Brand entities with metadata (6,005+ brand elements across all ecosystems)
- **System Status**: Service health monitoring
- **SecureSign™ Infrastructure**:
  - **Legal Documents**: Complete document management system
  - **NDA Records**: Non-disclosure agreement processing and tracking
  - **API Keys**: Secure API key management for external integrations
  - **Document Templates**: Reusable legal document templates
  - **Audit Trail**: Complete security and compliance logging

Key relationships:
- Brands belong to sectors (one-to-many)
- Brands can have parent/child relationships for subnodes
- NDA records link to legal documents and participants
- API keys support role-based permissions and audit trails
- Flexible JSON metadata storage for all entities

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Data Access**: DatabaseStorage class with PostgreSQL backend via Drizzle ORM
4. **Response**: JSON data flows back through the query system to React components

The application supports:
- **Fruitful Crate Dance Management**: Complete 6,005+ brand ecosystem for www.fruitfulcratedance.com
- **SecureSign™ VIP Portal**: Enterprise-grade legal document management and NDA processing
- **King Price Partnership Integration**: Comprehensive sponsorship management system
- Search functionality across all brand ecosystems
- Sector-based filtering and brand categorization
- Real-time system status monitoring
- Complete deployment infrastructure management
- Theme switching (light/dark/hyper modes)
- Legal compliance and audit trail management

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (serverless)
- **UI Framework**: Radix UI primitives for accessibility
- **Validation**: Zod for schema validation
- **Build Tools**: Vite, esbuild for production builds

### Development Dependencies
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

The application is configured for multiple deployment scenarios:

### Development
- Vite dev server with HMR
- Express API server with auto-reload
- Database migrations via Drizzle Kit

### Production
- **Frontend**: Vite build output served as static files
- **Backend**: Bundled Express server with esbuild
- **Database**: PostgreSQL with connection pooling
- **Environment**: NODE_ENV-based configuration switching

### Database Management
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared TypeScript definitions between client/server
- **Connection**: Environment-based DATABASE_URL configuration

The application architecture supports horizontal scaling and can be deployed to various platforms including Replit, Vercel, or traditional hosting providers.