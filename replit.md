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
- ✅ API Key Extraction & Management: Comprehensive extraction of 8 API keys from legal documentation (PayPal, Firebase, Spotify, Xero)
- ✅ Global API Integration System: Created centralized API configuration management with environment-based settings
- ✅ Integration Manager Service: Built comprehensive service health monitoring and OAuth URL generation
- ✅ Unified Document Viewer: All legal documents render within portal interface with VaultMesh™ branding
- ✅ Complete Ecosystem Integration: All extracted API keys integrated into global portal ecosystem with proper security masking
- ✅ Replit Auth Integration: Migrated from custom authentication to secure Replit Auth with email-based user management
- ✅ Document Viewer Fixes: Resolved JavaScript errors and implemented functional SecureSign portal integration
- ✅ Omnilevel AI Logic Integration: Complete integration of AI logic from ai-logic.seedwave.faa.zone with comprehensive sector selection functionality
- ✅ Advanced Sector Selection: AI-powered completion logic with all 31 sectors, intelligent recommendations, and cross-sector relationship mapping
- ✅ OmnilevelSelector Component: Complete component with search, AI mode, multi-select, and sector completion functionality
- ✅ AI-Powered Recommendation Engine: Built comprehensive recommendation engine with behavioral tracking, synergy analysis, and strategic scoring
- ✅ Fruitful Smart Toys™ Complete Integration: Full integration of toynest.seedwave.faa.zone ecosystem with products dashboard, downloadable templates, and user activation capabilities
- ✅ Smart Toys Service Layer: Enhanced service with real download functionality, product activation, SDK downloads, and ecosystem status monitoring
- ✅ Comprehensive Products Dashboard: 5 Smart Toys products (AI Companion, Emotional Storyteller, Speech Processor, Parental Dashboard, OmniScroll Ledger) with full activation and configuration
- ✅ Development Templates & SDKs: Complete downloadable template system with 5 professional-grade templates, documentation, and development resources
- ✅ User Activation System: Full user activation workflow with unique activation keys, real-time feedback, and comprehensive getting started guide
- ✅ OmniGrid™ FAA.zone™ Complete Integration: Full integration of comprehensive FAA.zone ecosystem with PulseTrade™ System Override Grid, VaultMesh™ infrastructure, and Atom-Level Engines
- ✅ PulseTrade™ System Override Grid: 13 core sectors with MONSTER OMNI™ Node, 1,481+ total brands, 7,038+ total nodes, tier-based pricing structure with A+ through B tier classifications
- ✅ Atom-Level Engines Integration: 9 core processing engines (Corethink™, TruthWeight™, EchoSynth™, AutoSigil™, PulseIndex™, OmniTrace™, LiftHalo™, MirrorLoop™, FireRatio™) with real-time metrics
- ✅ Vault Terminal Access System: 9 specialized terminals including VaultMaster, Cube Lattice GPT, Global View GPT, and complete FAA Brands terminal access
- ✅ Comprehensive Admin Portal: Seedwave™ Admin Portal with brand management, sector grid navigation, FAA.ZONE INDEX table structure, and multi-tier access controls
- ✅ Real-time System Monitoring: Live performance metrics with security, efficiency, and uptime tracking across entire OmniGrid™ infrastructure
- ✅ Global Footer Integration: Assigned www.banimal.co.za globally to all portal footers with WordPress finalization notice for banimal giving loop across entire ecosystem
- Database is now fully operational with complete brand ecosystem data, VaultMesh™ infrastructure, legal documentation system, integrated API management, secure authentication, omnilevel AI logic, comprehensive Smart Toys ecosystem, complete OmniGrid™ FAA.zone™ integration, and global banimal.co.za footer deployment ready for immediate user activation

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
- **OmniGrid™ FAA.zone™ Infrastructure**:
  - **PulseTrade™ Sectors**: 13 core sectors with complete brand, node, and pricing data
  - **Atom-Level Engines**: 9 processing engines with real-time performance metrics
  - **Vault Terminals**: 9 specialized terminals for secure system access
  - **Admin Portal**: Comprehensive brand management and system administration
  - **Real-time Monitoring**: Live system metrics and performance tracking
- **System Status**: Service health monitoring
- **SecureSign™ Infrastructure**:
  - **Legal Documents**: Complete document management system
  - **NDA Records**: Non-disclosure agreement processing and tracking
  - **API Keys**: Secure API key management for external integrations
  - **Document Templates**: Reusable legal document templates
  - **Audit Trail**: Complete security and compliance logging
- **API Integration System**:
  - **Global API Configuration**: Centralized management of all service credentials
  - **Integration Manager**: Service health monitoring and OAuth URL generation
  - **Environment-based Settings**: Production/sandbox configuration switching
  - **Service Status Tracking**: Real-time monitoring of PayPal, Firebase, Spotify, Xero integrations

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
- **Fruitful Smart Toys™ Ecosystem**: Complete integration with 5 Smart Toys products, downloadable templates, SDK packages, and user activation system
- **OmniGrid™ FAA.zone™ Ecosystem**: Universal Interconnected Network with PulseTrade™ System Override Grid, 9 Atom-Level Engines, Vault Terminal access, and comprehensive admin portal
- **ToyNest™ Platform Integration**: Full project management, deployment pipelines, and real-time monitoring for Smart Toys development
- **AI-Powered Recommendation Engine**: Intelligent sector recommendations with behavioral tracking, synergy analysis, and strategic value assessment
- **SecureSign™ VIP Portal**: Enterprise-grade legal document management and NDA processing
- **King Price Partnership Integration**: Comprehensive sponsorship management system
- **Global API Integration Ecosystem**: Complete integration of PayPal, Firebase, Spotify, and Xero APIs
- **Comprehensive API Key Management**: Secure storage, masking, and management of 8+ extracted credentials
- **Service Health Monitoring**: Real-time status tracking for all integrated services
- **OAuth URL Generation**: Automated OAuth flow management for external service authentication
- **Environment Configuration**: Production/sandbox switching with proper credential management
- **VaultMint™ Blockchain Certification**: Immutable learning records and cognitive growth tracking for Smart Toys
- **OmniScroll + Infinite Ledger**: Comprehensive blockchain integration for lifetime achievement portfolios
- Search functionality across all brand ecosystems
- Sector-based filtering and brand categorization
- Real-time system status monitoring
- Complete deployment infrastructure management
- Theme switching (light/dark/hyper modes)
- Legal compliance and audit trail management
- Unified document viewing within portal interface
- Professional development templates and SDK downloads
- User activation workflows with unique activation keys

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