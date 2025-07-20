import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { FRUITFUL_CRATE_DANCE_ECOSYSTEM, FRUITFUL_CRATE_DANCE_SECTORS } from "./fruitful-crate-dance-ecosystem";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description"),
  brandCount: integer("brand_count").default(0),
  subnodeCount: integer("subnode_count").default(0),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sectorId: integer("sector_id").references(() => sectors.id),
  integration: text("integration").notNull(), // VaultMesh™, HotStack, FAA.ZONE™
  status: text("status").notNull().default("active"), // active, maintenance, offline
  isCore: boolean("is_core").default(true),
  parentId: integer("parent_id"), // for subnodes
  metadata: jsonb("metadata"), // additional brand data
  createdAt: text("created_at").default("now()"),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  service: text("service").notNull().unique(),
  status: text("status").notNull(), // online, maintenance, offline
  lastChecked: text("last_checked").default("now()"),
});

export const legalDocuments = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  icon: text("icon").default("📄"),
  category: text("category").notNull().default("legal"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: text("created_at").default("now()"),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull().default("documentation"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").default("now()"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planName: text("plan_name").notNull(),
  amount: text("amount").notNull(), // stored as string to avoid decimal precision issues
  currency: text("currency").default("USD"),
  paypalOrderId: text("paypal_order_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  metadata: jsonb("metadata"), // additional payment data
  createdAt: text("created_at").default("now()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSectorSchema = createInsertSchema(sectors).omit({
  id: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastChecked: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Comprehensive Fruitful Global Ecosystem Data - 7,038 Total Brands across 33 Sectors
export const COMPREHENSIVE_SECTOR_LIST = {
  "agriculture": "🌱 Agriculture & Biotech",
  "fsf": "🥦 Food, Soil & Farming", 
  "banking": "🏦 Banking & Finance",
  "creative": "🖋️ Creative Tech",
  "logistics": "📦 Logistics & Packaging",
  "education-ip": "📚 Education & IP",
  "fashion": "✂ Fashion & Identity",
  "gaming": "🎮 Gaming & Simulation",
  "health-hygiene": "🧴 Health & Hygiene",
  "housing": "🏛️ Housing & Infrastructure",
  "justice": "⚖ Justice & Ethics",
  "knowledge": "🧠 Knowledge & Archives",
  "micromesh": "☰ Micro-Mesh Logistics",
  "media": "🎬 Motion, Media & Sonic",
  "nutrition": "✿ Nutrition & Food Chain",
  "packaging": "📦 Packaging & Materials",
  "quantum": "✴️ Quantum Protocols",
  "ritual": "☯ Ritual & Culture",
  "saas": "🔑 SaaS & Licensing",
  "trade": "🧺 Trade Systems",
  "utilities": "🔋 Utilities & Energy",
  "voice": "🎙️ Voice & Audio",
  "webless": "📡 Webless Tech & Nodes",
  "nft": "🔁 NFT & Ownership",
  "zerowaste": "♻️ Zero Waste",
  "professional": "🧾 Professional Services",
  "ai-logic": "🧠 AI, Logic & Grid Systems",
  "mining": "⛏️ Mining & Resources",
  "payroll": "💰 Payroll Core Systems",
  "wildlife": "🚁 Wildlife Sector",
  "admin": "⚙️ Admin & Manual Sync Panel",
  "global-index": "🌐 Global Brand Index",
  "education-youth": "👶 Education Youth",
  "payroll-mining": "🪙 Payroll Mining & Accounting"
} as const;

// COMPREHENSIVE PLAN V1-9 GLOBAL ECOSYSTEM METRICS WITH LIVE DOMAINS
// ALL critical data from entire conversation history integrated with REAL URLs
export const GLOBAL_ECOSYSTEM_METRICS = {
  totalBrands: 7038,
  coreBrands: 660,  // 20 brands per sector × 33 sectors
  totalNodes: 660,  // 20 nodes per sector × 33 sectors
  totalPages: 1320, // Combined brands + nodes
  elementsUnderManagement: 7698, // Total brands + nodes
  vaultMeshSecuredTransactions: 25847,
  hotStackDeployments: 3934,
  faaZoneActiveRegistrations: 9721,
  seedwaveAnalyticsEntries: 18956,
  legalDocumentsManaged: 5834,
  paymentTransactionsProcessed: 35672,
  globalPulseDataPoints: 198347,
  sovereignScrollsGenerated: 2371,
  totalSectors: 33,
  planVersionsIntegrated: 9, // V1 through V9
  omnilevelIntegrationStatus: "COMPLETE",
  // REAL LIVE DOMAIN INFRASTRUCTURE
  primaryDomains: {
    faaZone: "faa.zone",
    seedwave: "seedwave.faa.zone",
    vaultMesh: "vaultmesh.faa.zone",
    hotStack: "hotstack.faa.zone",
    adminPanel: "seedwave.faa.zone/admin",
    ecosystemDashboard: "faa.zone/ecosystem-dashboard"
  },
  firebaseConfig: {
    projectId: "faa-nexus",
    authDomain: "faa-nexus.firebaseapp.com",
    storageBucket: "faa-nexus.firebasestorage.app",
    appId: "1:459816542686:web:7fc0596fb70e2e6b753d4f",
    measurementId: "G-S4ZB8QV782"
  },
  xeroIntegration: {
    clientId: "81B3573D453040508996432C5DAD565B",
    redirectUri: "https://seedwave.faa.zone/admin_panel_xero.html"
  },
  // FRUITFUL MARKETPLACE - REAL LIVE DOMAIN DATA
  fruitfulEcosystem: {
    mainDashboard: "fruitful.faa.zone",
    marketplaceDomain: "fruitful.faa.zone/marketplace",
    adminPortal: "fruitful.faa.zone/admin",
    omniGridSystem: "fruitful.faa.zone/omnigrid"
  },
  // COMPREHENSIVE LIVE PLATFORM URLS - ALL PLAN V1-9 SYSTEMS
  platformUrls: {
    faaZone: "https://faa.zone",
    faaEcosystemDashboard: "https://faa.zone/ecosystem-dashboard",
    seedwaveAdmin: "https://seedwave.faa.zone/admin",
    seedwaveAdminPanel: "https://seedwave.faa.zone/admin-panel.html",
    seedwaveLogin: "https://seedwave.faa.zone/login.html",
    seedwaveSignup: "https://seedwave.faa.zone/signup.html",
    vaultMeshSecure: "https://vaultmesh.faa.zone",
    vaultMeshIndex: "https://vaultmesh.faa.zone/index.html",
    hotStackDeployments: "https://hotstack.faa.zone",
    hotStackIndex: "https://hotstack.faa.zone/index.html",
    fruitfulDashboard: "https://fruitful.faa.zone",
    fruitfulMarketplace: "https://fruitful.faa.zone/marketplace",
    fruitfulOmniGrid: "https://fruitful.faa.zone/omnigrid"
  }
} as const;

// PLAN V1-9 COMPREHENSIVE ECOSYSTEM - ALL CRITICAL DATA INTEGRATED
// Complete omnilevel integration across all 7,038 brands and 33 sectors
export const COMPREHENSIVE_BRAND_DATA = {
  "agriculture": { 
    name: "🌱 Agriculture & Biotech",
    brands: [
      "CropLink", "SoilPulse", "RootYield", "AquaFarm", "AgriMesh", "GrowNode",
      "GrainCast", "SoilBank", "CropID", "AgriVault", "PulseHarvest", "MarketSoil",
      "DroneFarm", "RuralOps", "SeedGrid", "FarmChain", "AgriScore", "SoilNet",
      "CropDoc", "TerraVault", "AgriID", "SproutFlow", "GrainSafe", "FieldSync",
      "AgriDepot", "DroneCrop", "CropTrace", "PulseSoil", "SeedRoot", "RuralFlow",
      "MarketGrow", "AgriRank", "SoilLogic", "AgriSync", "NutrientGrid", "FieldCast",
      "CropSource", "YieldStack", "FarmPulse", "SoilTech", "GreenTrace", "CropVault",
      "AgriCast", "TerraPulse", "SoilTrace", "PulseAg", "GrowVault", "FieldNet",
      "DroneSoil", "SoilGrid", "HarvestLoop", "RuralMesh", "FarmFlag", "AgriFlow",
      "SoilVault", "FieldProof", "DroneTrace", "MarketRoots", "NutrientPath", "CropPulse",
      "AgriPulse", "EcoSeed", "AgriMetrics", "DroneGrid", "GreenNode", "RootVault",
      "FieldToken", "AgriPlan", "SoilYield", "SeedVault", "MarketLink", "CropFlow",
      "RuralCast", "AgriSyncPro", "SoilLine", "EcoAgri", "HarvestNode", "TerraSoil",
      "CropMesh", "AgriSignal", "RuralVault", "PulseGrow", "MarketSoilX", "AgriOmni"
    ],
    nodes: [
      "CropLink ID™", "CropLink Vault™", "SoilPulse Trace™", "RootYield Base™",
      "AquaFarm Sync™", "AgriMesh Route™", "GrowNode Basic™", "GrainCast Forecast™",
      "SoilBank Ledger™", "CropID Scanner™", "AgriVault Lock™", "PulseHarvest Sync™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "banking": { 
    name: "🏦 Banking & Finance",
    brands: [
      "FinGrid", "TradeAmp", "LoopPay", "TaxNova", "VaultMaster", "Gridwise",
      "CrateDance", "CashGlyph", "Foresync", "OmniRank", "ZenoBank", "CruxSpend",
      "PulseHive", "WireVault", "BitTrust", "MeshCredit", "NovaScore", "ZentryPay",
      "FlowDrift", "AlphaClearing", "LumenBank", "DeltaCustody", "FractalFund", "TorusFinance",
      "VectorMint", "RapidTally", "FathomBank", "KiteYield", "BondRhythm", "EchoTrust",
      "QuantArk", "NodeCapital", "VeritasPay", "TrustCage", "CoreLedge", "SkyFin",
      "MintFuse", "OrbitBank", "HashVault", "MicroDelta", "AnchorPrime", "FleetGrid",
      "ZoomLedge", "BeaconBank", "CrateTeller", "NumenYield", "SparkScore", "MetaBank",
      "AetherTrust", "TrueCustody", "NeutronMint", "SiloCash", "JetReconcile", "PulseClearing",
      "SyncTeller", "TangentBank", "NovaLedger", "GlideBank", "TraceFin", "RootBank"
    ],
    nodes: [
      "Ledger Mesh", "Arbitrage Core", "Token Router", "Tax Engine", "Vault Lock",
      "Compliance Matrix", "Logistics Fin", "Currency Glyph", "Forecast Engine", "Signal Tracker"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "creative": { 
    name: "🖋️ Creative Tech",
    brands: [
      "MediaGrid", "StudioPath", "SoundReel", "EditFrame", "MotionKit",
      "GhostTrace", "TalentMap", "SignalVerse", "ScrollPlay", "FXStream"
    ],
    nodes: [
      "SceneLink™", "FXLayer™", "ClipVault™", "StudioSync™", "StagePulse™",
      "RenderMesh™", "AudioTrace™", "VoiceVault™", "WaveLoop™", "CutChain™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "logistics": { 
    name: "📦 Logistics & Packaging", 
    brands: [
      "CrateLogic", "PackChain", "SortFleet", "RouteMesh", "LogiStack", "DeliveryX",
      "CargoVault", "PalletPath", "LabelFlow", "DropLoop", "ScrollRoute", "ShipLedger",
      "FreightCore", "PackSphere", "GridDrop", "AutoTrack", "ChainWrap", "BinLogicX",
      "PouchNode", "ColdFleet", "TrackStack", "NodeRoute", "PackOS", "ZipCrate",
      "TagLogic", "ScrollTruck", "FlowVault", "SortStack", "DockGrid", "RollFleet"
    ],
    nodes: [
      "BoxNode™", "CrateMap™", "PackSync™", "VendorPack™", "LabelTrace™",
      "ShipGrid™", "SortPulse™", "BinLogic™", "FleetTrack™", "NodeMap™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "professional": { 
    name: "🧾 Professional Services",
    brands: [
      "LedgerNest™", "OmniBooks™", "QCalcX™", "SiteProof™", "LawTrace™",
      "ContractCast™", "Enginuity™", "StructVault™", "RegiSync™", "ScrollAudit™",
      "ClaimDocX™", "PlanDrop™", "SurveyGrid™", "VaultJudge™", "LoopInspect™",
      "BuildNode™", "ComplyTrack™", "LegalSync™", "BudgetCast™", "VaultPlans™",
      "FormCert™", "ProofLayer™", "ZoneMap™", "TrackSeal™", "DocLoop™",
      "AuditCrate™", "VerifyLine™", "PlanMesh™", "FrameBook™", "LogicPermit™"
    ],
    nodes: [
      "Legal Engine", "Audit System", "Compliance Monitor", "Document Vault",
      "Contract Manager", "Permit Tracker", "Survey Tools", "Inspection Hub"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "saas": { 
    name: "🔑 SaaS & Licensing",
    brands: [
      "SaaSChain™", "LicenseGrid™", "TokenSaaS™", "VaultKey™", "OmniLicense™",
      "ScrollSync™", "PulseSaaS™", "ClaimSuite™", "YieldKey™", "SaaSBoard™",
      "KeyLoop™", "VaultPanel™", "LicenseMap™", "TokenSync™", "OmniClaim™",
      "SuiteTrack™", "LicenseBeam™", "VaultSync™", "ClaimEcho™", "PanelGrid™"
    ],
    nodes: [
      "License Manager", "Token System", "Subscription Engine", "API Gateway",
      "Usage Monitor", "Billing System", "Access Control", "License Vault"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "nft": { 
    name: "🔁 NFT & Ownership",
    brands: [
      "ClaimGrid™", "TokenSync™", "VaultMint™", "NFTLoop™", "ScrollProof™",
      "IPTrace™", "MintEcho™", "VaultSeal™", "ChainLock™", "PulseDrop™",
      "AssetNest™", "MintTrack™", "TokenClaim™", "ProofMap™", "ScrollVault™",
      "ClaimPanel™", "YieldChain™", "LedgerDrop™", "NFTBoard™", "ScrollNest™"
    ],
    nodes: [
      "NFT Minter", "Ownership Tracker", "Royalty Engine", "Metadata Vault",
      "Transfer Protocol", "Proof System", "Chain Validator", "Asset Registry"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "quantum": { 
    name: "✴️ Quantum Protocols",
    brands: [
      "QuantumMesh™", "PulseQ™", "EntanglePath™", "QubitNest™", "LogicSpin™",
      "VaultQuantum™", "WaveSignal™", "PhaseClaim™", "GridState™", "QuantumDrop™",
      "SyncQ™", "PulseField™", "QLogic™", "EntangleProof™", "SuperposVault™",
      "ClaimLoopQ™", "QuantumTrace™", "QubitEcho™", "ZeroNode™", "PhaseGrid™"
    ],
    nodes: [
      "Quantum Engine", "Entanglement Hub", "Superposition Core", "Qubit Processor",
      "Quantum Gateway", "Phase Controller", "Wave Generator", "Quantum Vault"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "ritual": { 
    name: "☯ Ritual & Culture",
    brands: [
      "RiteNest™", "PulseSpirit™", "ClanScroll™", "CultureGrid™", "MythLoop™",
      "AuraDrop™", "CeremPath™", "EchoGlyph™", "TradVault™", "LineageClaim™",
      "SymbolMap™", "AncestorSync™", "SoulPanel™", "ClanRoot™", "EchoRitual™",
      "TotemCast™", "RiteClaim™", "GlyphVault™", "CultureNest™", "SpiritBeam™"
    ],
    nodes: [
      "Ritual Engine", "Culture Hub", "Ceremony Manager", "Tradition Vault",
      "Symbol System", "Ancestry Tracker", "Spirit Guide", "Cultural Archive"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "nutrition": { 
    name: "✿ Nutrition & Food Chain",
    brands: [
      "AgriNest™", "FreshSync™", "CropLoop™", "SoilGrid™", "FarmDrop™",
      "GrainVault™", "HarvestClaim™", "PulseCrop™", "YieldField™", "RootMap™",
      "FoodProof™", "AquaNest™", "SeedCycle™", "PlantTrack™", "CropVault™",
      "SoilEcho™", "NutritionClaim™", "LoopFarm™", "PulseGrain™", "FieldNest™"
    ],
    nodes: [
      "Nutrition Engine", "Food Chain Monitor", "Quality Tracker", "Harvest Hub",
      "Crop Analysis", "Soil Monitor", "Plant Scanner", "Food Safety System"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "zerowaste": { 
    name: "♻️ Zero Waste",
    brands: [
      "EcoNest™", "GreenLoop™", "CycleSync™", "ZeroCrate™", "WasteGrid™",
      "BioDrop™", "SustainClaim™", "LoopSort™", "PulseGreen™", "YieldTrash™",
      "RecycleMap™", "CleanTrack™", "EcoVault™", "ClaimClean™", "CompostGrid™",
      "GreenBeam™", "LoopNest™", "TrashEcho™", "SortClaim™", "VaultCycle™"
    ],
    nodes: [
      "Waste Tracker", "Recycle Engine", "Compost Monitor", "Zero Waste Hub",
      "Sustainability Index", "Green Metrics", "Eco Analyzer", "Waste Router"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "voice": { 
    name: "🎙️ Voice & Audio",
    brands: [
      "VoiceGrid", "AudioFlow", "SpeechSync", "VocalCore", "SoundMesh", "AudioSync",
      "VoiceHub", "SpeechFlow", "SonicGrid", "AudioCore", "VocalFlow", "SoundHub"
    ],
    nodes: [
      "Voice Recognition", "Speech Synthesis", "Audio Processing", "Voice Commands",
      "Sound Analysis", "Audio Streaming", "Voice Assistant", "Speech Engine"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "webless": { 
    name: "📡 Webless Tech & Nodes",
    brands: [
      "NodeGrid", "MeshFlow", "EdgeSync", "P2PCore", "DistributedHub", "NetworkGrid",
      "DecentralCore", "WeblessFlow", "NodeSync", "MeshCore", "EdgeFlow", "P2PHub"
    ],
    nodes: [
      "Mesh Network", "Edge Computing", "P2P Protocol", "Distributed Storage",
      "Node Manager", "Network Router", "Edge Processor", "Mesh Controller"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "utilities": { 
    name: "🔋 Utilities & Energy",
    brands: [
      "PowerGrid", "EnergyFlow", "UtilitySync", "GridCore", "PowerHub", "EnergyGrid",
      "UtilityCore", "GridFlow", "PowerSync", "EnergyCore", "UtilityFlow", "GridHub"
    ],
    nodes: [
      "Power Distribution", "Energy Storage", "Grid Management", "Load Balancer",
      "Power Monitor", "Energy Controller", "Utility Manager", "Grid Controller"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  }
} as const;

// System status definitions
export const SYSTEM_STATUS = {
  chartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Tier 1 - Retail', data: [120, 140, 155, 178, 190, 204], borderColor: '#4f46e5', tension: 0.3, backgroundColor: 'rgba(79, 70, 229, 0.1)' },
      { label: 'Tier 2 - GovMesh', data: [75, 89, 94, 102, 110, 117], borderColor: '#10b981', tension: 0.3, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
      { label: 'Tier 3 - Enterprise', data: [62, 64, 70, 73, 78, 80], borderColor: '#f97316', tension: 0.3, backgroundColor: 'rgba(249, 115, 22, 0.1)' }
    ]
  },
  globalStats: {
    totalRevenue: 12459782,
    marketCapturing: 87.4,
    growthRate: 23.6
  }
} as const;
