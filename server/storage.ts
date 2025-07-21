import { 
  users, 
  sectors, 
  brands, 
  systemStatus, 
  legalDocuments, 
  repositories, 
  payments,
  banimalTransactions,
  charitableDistributions,
  sonicGridConnections,
  vaultActions,
  mediaProjects,
  processingEngines,
  type User, 
  type InsertUser, 
  type Sector, 
  type InsertSector, 
  type Brand, 
  type InsertBrand, 
  type SystemStatus, 
  type InsertSystemStatus,
  type LegalDocument,
  type InsertLegalDocument,
  type Repository,
  type InsertRepository,
  type Payment,
  type InsertPayment,
  type BanimalTransaction,
  type InsertBanimalTransaction,
  type CharitableDistribution,
  type InsertCharitableDistribution,
  type SonicGridConnection,
  type InsertSonicGridConnection,
  type VaultAction,
  type InsertVaultAction,
  type MediaProject,
  type InsertMediaProject,
  type ProcessingEngine,
  type InsertProcessingEngine,
  COMPREHENSIVE_BRAND_DATA
} from "@shared/schema";
import { FRUITFUL_CRATE_DANCE_SECTORS } from "@shared/fruitful-crate-dance-ecosystem";
import { 
  SECURESIGN_API_KEYS, 
  DOCUMENT_TEMPLATES,
  type NDARecord,
  type InsertNDARecord,
  type SecureSignApiKey,
  type InsertSecureSignApiKey,
  type DocumentTemplate,
  type InsertDocumentTemplate
} from "@shared/securesign-schema";
import { db } from "./db";
import { eq, ilike, or, desc } from "drizzle-orm";
// Remove invalid import - update is not exported from drizzle-orm/pg-core

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Sectors
  getAllSectors(): Promise<Sector[]>;
  getSector(id: number): Promise<Sector | undefined>;
  createSector(sector: InsertSector): Promise<Sector>;
  
  // Brands
  getAllBrands(): Promise<Brand[]>;
  getBrandsBySearch(query: string): Promise<Brand[]>;
  getBrandsBySector(sectorId: number): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // System Status
  getAllSystemStatus(): Promise<SystemStatus[]>;
  getSystemStatus(service: string): Promise<SystemStatus | undefined>;
  updateSystemStatus(service: string, status: string): Promise<SystemStatus>;
  
  // Legal Documents
  getLegalDocuments(): Promise<LegalDocument[]>;
  createLegalDocument(doc: InsertLegalDocument): Promise<LegalDocument>;
  
  // Repositories
  getRepositories(): Promise<Repository[]>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  
  // Payments
  getPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Banimal Integration
  createBanimalTransaction(transaction: InsertBanimalTransaction): Promise<BanimalTransaction>;
  getBanimalTransactions(): Promise<BanimalTransaction[]>;
  updateBanimalTransactionStatus(id: number, status: string): Promise<void>;
  
  createCharitableDistribution(distribution: InsertCharitableDistribution): Promise<CharitableDistribution>;
  getCharitableDistributions(): Promise<CharitableDistribution[]>;
  
  getSonicGridConnections(): Promise<SonicGridConnection[]>;
  updateSonicGridConnection(id: number, data: Partial<SonicGridConnection>): Promise<void>;
  
  createVaultAction(action: InsertVaultAction): Promise<VaultAction>;
  getVaultActions(): Promise<VaultAction[]>;

  // Motion, Media & Sonic Studio operations
  getMediaProjects(): Promise<MediaProject[]>;
  createMediaProject(project: InsertMediaProject): Promise<MediaProject>;
  processMediaProject(projectId: string, settings: any): Promise<{ success: boolean, message: string }>;
  getProcessingEngines(): Promise<ProcessingEngine[]>;
  seedMediaData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Sectors
  async getAllSectors(): Promise<Sector[]> {
    return await db.select().from(sectors);
  }

  async getSector(id: number): Promise<Sector | undefined> {
    const [sector] = await db.select().from(sectors).where(eq(sectors.id, id));
    return sector || undefined;
  }

  async createSector(insertSector: InsertSector): Promise<Sector> {
    const [sector] = await db
      .insert(sectors)
      .values(insertSector)
      .returning();
    return sector;
  }

  // Brands
  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrandsBySearch(query: string): Promise<Brand[]> {
    if (!query) {
      return await db.select().from(brands);
    }
    
    return await db.select().from(brands).where(
      or(
        ilike(brands.name, `%${query}%`),
        ilike(brands.description, `%${query}%`)
      )
    );
  }

  async getBrandsBySector(sectorId: number): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.sectorId, sectorId));
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand || undefined;
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db
      .insert(brands)
      .values(insertBrand)
      .returning();
    return brand;
  }

  // System Status
  async getAllSystemStatus(): Promise<SystemStatus[]> {
    return await db.select().from(systemStatus);
  }

  async getSystemStatus(service: string): Promise<SystemStatus | undefined> {
    const [status] = await db.select().from(systemStatus).where(eq(systemStatus.service, service));
    return status || undefined;
  }

  async updateSystemStatus(service: string, status: string): Promise<SystemStatus> {
    // Try to update first
    const existing = await this.getSystemStatus(service);
    if (existing) {
      const [updated] = await db
        .update(systemStatus)
        .set({ status, lastChecked: new Date().toISOString() })
        .where(eq(systemStatus.service, service))
        .returning();
      return updated;
    } else {
      // Create new if doesn't exist
      const [created] = await db
        .insert(systemStatus)
        .values({ service, status })
        .returning();
      return created;
    }
  }

  // Legal Documents
  async getLegalDocuments(): Promise<LegalDocument[]> {
    return await db.select().from(legalDocuments);
  }

  async createLegalDocument(insertDoc: InsertLegalDocument): Promise<LegalDocument> {
    const docToInsert = {
      ...insertDoc,
      tags: Array.isArray(insertDoc.tags) ? [...insertDoc.tags] : []
    };
    const [doc] = await db
      .insert(legalDocuments)
      .values([docToInsert])
      .returning();
    return doc;
  }

  // Repositories
  async getRepositories(): Promise<Repository[]> {
    return await db.select().from(repositories);
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const [repo] = await db
      .insert(repositories)
      .values(insertRepo)
      .returning();
    return repo;
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  // Banimal Integration Methods
  async createBanimalTransaction(transaction: InsertBanimalTransaction): Promise<BanimalTransaction> {
    const [result] = await db
      .insert(banimalTransactions)
      .values(transaction)
      .returning();
    return result;
  }

  async getBanimalTransactions(): Promise<BanimalTransaction[]> {
    return await db.select().from(banimalTransactions);
  }

  async updateBanimalTransactionStatus(id: number, status: string): Promise<void> {
    await db
      .update(banimalTransactions)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(banimalTransactions.id, id));
  }

  async createCharitableDistribution(distribution: InsertCharitableDistribution): Promise<CharitableDistribution> {
    const [result] = await db
      .insert(charitableDistributions)
      .values(distribution)
      .returning();
    return result;
  }

  async getCharitableDistributions(): Promise<CharitableDistribution[]> {
    return await db.select().from(charitableDistributions);
  }

  async getSonicGridConnections(): Promise<SonicGridConnection[]> {
    return await db.select().from(sonicGridConnections);
  }

  async updateSonicGridConnection(id: number, data: Partial<SonicGridConnection>): Promise<void> {
    await db
      .update(sonicGridConnections)
      .set({ ...data, lastActivity: new Date().toISOString() })
      .where(eq(sonicGridConnections.id, id));
  }

  async createVaultAction(action: InsertVaultAction): Promise<VaultAction> {
    const [result] = await db
      .insert(vaultActions)
      .values(action)
      .returning();
    return result;
  }

  async getVaultActions(): Promise<VaultAction[]> {
    return await db.select().from(vaultActions);
  }

  // Seed initial Banimal data
  async seedBanimalData(): Promise<void> {
    try {
      // Check if data already exists
      const existingTransactions = await this.getBanimalTransactions();
      if (existingTransactions.length > 0) return;

      // Seed SonicGrid connections
      const sonicGridConnections = [
        {
          connectionName: "Affirmative Media Processor",
          connectionType: "media_processing",
          status: "active" as const,
          documentsProcessed: 1247,
          configuration: {
            mediaTypes: ["video", "audio", "images"],
            processingRules: ["affirmative_filter", "child_safety", "content_verification"],
            outputFormats: ["mp4", "mp3", "webp"]
          }
        },
        {
          connectionName: "Charitable Distribution Hub",
          connectionType: "payment_distribution",
          status: "active" as const,
          documentsProcessed: 856,
          configuration: {
            distributionRules: {
              charity: 35,
              developer: 25,
              operations: 20,
              sonicGrid: 10,
              vault: 10
            }
          }
        }
      ];

      for (const connection of sonicGridConnections) {
        await db.insert(sonicGridConnections).values(connection);
      }

      // Seed sample transactions and distributions
      const sampleTransaction = await this.createBanimalTransaction({
        transactionId: `BAN-${Date.now()}`,
        productName: "Banimal Soft Toy - Bear",
        amount: "49.99",
        currency: "USD",
        userId: "demo-user",
        childBeneficiary: "Children's Hospital Trust",
        distributionRules: {
          charity: 35,
          developer: 25,
          operations: 20,
          sonicGrid: 10,
          vault: 10
        },
        status: "completed"
      });

      // Create distributions for the sample transaction
      const distributionRules = {
        charity: 35,
        developer: 25,
        operations: 20,
        sonicGrid: 10,
        vault: 10
      };
      
      const amount = 49.99;
      for (const [type, percentage] of Object.entries(distributionRules)) {
        const distributionAmount = (amount * percentage) / 100;
        await this.createCharitableDistribution({
          transactionId: sampleTransaction.transactionId,
          beneficiaryType: type,
          beneficiaryName: type === "charity" ? "Children's Hospital Trust" : `${type} beneficiary`,
          amount: distributionAmount.toString(),
          percentage,
          status: "completed"
        });
      }

      // Create vault actions
      await this.createVaultAction({
        actionId: `VA-${Date.now()}`,
        actionType: "charitable_distribution",
        beneficiary: "Children's Hospital Trust",
        transactionId: sampleTransaction.transactionId,
        amount: "17.50",
        status: "completed",
        visibility: "transparent",
        metadata: {
          ecosystem: "fruitful_crate_dance",
          integration: "banimal_giving_loop"
        }
      });

      console.log("✅ Banimal ecosystem data seeded successfully");
    } catch (error) {
      console.error("❌ Error seeding Banimal data:", error);
    }
  }

  // Motion, Media & Sonic Studio operations
  async getMediaProjects(): Promise<MediaProject[]> {
    return await db.select().from(mediaProjects).orderBy(desc(mediaProjects.createdAt));
  }

  async createMediaProject(projectData: InsertMediaProject): Promise<MediaProject> {
    const projectId = `MED-${Date.now()}`;
    const [project] = await db
      .insert(mediaProjects)
      .values({ ...projectData, projectId })
      .returning();
    return project;
  }

  async processMediaProject(projectId: string, settings: any): Promise<{ success: boolean, message: string }> {
    await db
      .update(mediaProjects)
      .set({ 
        status: 'processing', 
        processingSettings: settings,
        updatedAt: new Date()
      })
      .where(eq(mediaProjects.projectId, projectId));
    
    // Simulate processing progress
    setTimeout(async () => {
      await db
        .update(mediaProjects)
        .set({ 
          status: 'completed', 
          progress: 100,
          updatedAt: new Date()
        })
        .where(eq(mediaProjects.projectId, projectId));
    }, 5000);

    return { success: true, message: 'Processing started' };
  }

  async getProcessingEngines(): Promise<ProcessingEngine[]> {
    return await db.select().from(processingEngines).orderBy(desc(processingEngines.lastActivity));
  }

  async seedMediaData(): Promise<void> {
    // Check if engines already exist
    const existingEngines = await this.getProcessingEngines();
    if (existingEngines.length > 0) {
      console.log("✅ Media engines already seeded, skipping...");
      return;
    }

    console.log("🎬 Seeding Media processing engines...");

    // Seed processing engines
    const engines = [
      {
        engineId: 'SONIC-CORE-001',
        name: 'SonicCore™ Engine',
        type: 'audio_processing',
        status: 'active' as const,
        usage: 87,
        configuration: {
          maxConcurrentJobs: 50,
          supportedFormats: ['mp3', 'wav', 'flac', 'aac'],
          features: ['noise_reduction', 'eq', 'compression', 'reverb']
        },
        capabilities: {
          realtime: true,
          batch: true,
          aiEnhanced: true
        }
      },
      {
        engineId: 'MOTION-FLOW-001',
        name: 'MotionFlow™ Renderer',
        type: 'video_processing',
        status: 'active' as const,
        usage: 62,
        configuration: {
          maxConcurrentJobs: 25,
          supportedFormats: ['mp4', 'avi', 'mov', 'webm'],
          features: ['color_grading', 'transitions', 'effects', 'encoding']
        },
        capabilities: {
          realtime: true,
          batch: true,
          aiEnhanced: true
        }
      },
      {
        engineId: 'MEDIA-SYNC-001',
        name: 'MediaSync™ Processor',
        type: 'multi_media',
        status: 'active' as const,
        usage: 45,
        configuration: {
          maxConcurrentJobs: 30,
          supportedFormats: ['all'],
          features: ['sync', 'merge', 'split', 'convert']
        },
        capabilities: {
          realtime: false,
          batch: true,
          aiEnhanced: true
        }
      }
    ];

    for (const engine of engines) {
      await db.insert(processingEngines).values(engine);
    }

    console.log("✅ Media processing engines seeded successfully");
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sectors: Map<number, Sector>;
  private brands: Map<number, Brand>;
  private systemStatuses: Map<string, SystemStatus>;
  private legalDocuments: Map<string, LegalDocument>;
  private repositories: Map<string, Repository>;
  private payments: Map<string, Payment>;
  private currentUserId: string;
  private currentSectorId: number;
  private currentBrandId: number;
  private currentDocId: number;
  private currentRepoId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.sectors = new Map();
    this.brands = new Map();
    this.systemStatuses = new Map();
    this.legalDocuments = new Map();
    this.repositories = new Map();
    this.payments = new Map();
    this.currentUserId = "1";
    this.currentSectorId = 1;
    this.currentBrandId = 1;
    this.currentDocId = 1;
    this.currentRepoId = 1;
    this.currentPaymentId = 1;
    
    // Initialize with sample data based on the provided brand counts
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sectors from comprehensive data
    const sectorMappings = [
      { key: "agriculture", name: "Agriculture & Biotech", emoji: "🌱", description: "Advanced biotech solutions for sustainable farming" },
      { key: "food", name: "Food, Soil & Farming", emoji: "🥦", description: "Food production and soil management systems" },
      { key: "banking", name: "Banking & Finance", emoji: "🏦", description: "Secure financial services and banking infrastructure" },
      { key: "creative", name: "Creative Tech", emoji: "🖋️", description: "Creative technology and digital art solutions" },
      { key: "packaging", name: "Logistics & Packaging", emoji: "📦", description: "Supply chain and packaging innovations" },
      { key: "education", name: "Education & IP", emoji: "📚", description: "Educational technology and intellectual property" },
      { key: "fashion", name: "Fashion & Identity", emoji: "✂", description: "Fashion technology and identity solutions" },
      { key: "gaming", name: "Gaming & Simulation", emoji: "🎮", description: "Interactive gaming and simulation platforms" },
      { key: "health", name: "Health & Hygiene", emoji: "🧠", description: "Healthcare and hygiene management systems" },
      { key: "housing", name: "Housing & Infrastructure", emoji: "🏗️", description: "Smart housing and infrastructure solutions" },
      { key: "ai-logic", name: "AI, Logic & Grid", emoji: "🧠", description: "Artificial intelligence and logic systems" },
    ];

    // Create sectors based on actual comprehensive data
    Object.entries(COMPREHENSIVE_BRAND_DATA).forEach(([sectorKey, sectorData]) => {
      const mapping = sectorMappings.find(m => sectorKey.includes(m.key)) || 
                     { key: sectorKey, name: sectorData.name, emoji: "🔧", description: `${sectorData.name} solutions` };
      
      const newSector: Sector = {
        id: this.currentSectorId++,
        name: mapping.name,
        emoji: mapping.emoji,
        description: mapping.description || null,
        brandCount: sectorData.brands.length,
        subnodeCount: sectorData.nodes.length
      };
      this.sectors.set(newSector.id, newSector);

    });

    // Add Fruitful Crate Dance sectors - comprehensive 6,005+ brand ecosystem
    Object.entries(FRUITFUL_CRATE_DANCE_SECTORS).forEach(([sectorKey, sectorData]) => {
      const newSector: Sector = {
        id: this.currentSectorId++,
        name: sectorData.name,
        emoji: sectorData.name.split(' ')[0], // Extract emoji from name
        description: sectorData.description,
        brandCount: sectorData.brands.length,
        subnodeCount: Math.floor(sectorData.brands.length * 0.3) // 30% subnodes per sector
      };
      this.sectors.set(newSector.id, newSector);
    });

    // Initialize system status
    const statusData = [
      { service: "VaultMesh™", status: "online" },
      { service: "HotStack", status: "maintenance" },
      { service: "FAA.ZONE™", status: "online" },
    ];

    statusData.forEach(status => {
      const newStatus: SystemStatus = {
        id: this.currentBrandId++,
        ...status,
        lastChecked: new Date().toISOString()
      };
      this.systemStatuses.set(status.service, newStatus);
    });

    // Initialize authentic brands from comprehensive schema data
    let brandId = 1;
    Object.entries(COMPREHENSIVE_BRAND_DATA).forEach(([sectorKey, sectorData]) => {
      // Find the matching sector
      const sector = Array.from(this.sectors.values()).find(s => 
        s.name.toLowerCase().includes(sectorKey.toLowerCase()) || 
        s.name.toLowerCase().includes(sectorData.name.toLowerCase().replace(/[🔥🌱🏭🧠⚡🏦💊🎨🛡️🌐🏢🚗🎓📱🧪🔬⚖️🏠🌍🍎🌿📊🎯🛒📦🧮💼🔌⚙️🌊💡🎮🔒]/g, '').trim())
      );
      
      if (sector) {
        // Create brands using authentic names
        sectorData.brands.forEach((brandName, index) => {
          const brand: Brand = {
            id: brandId++,
            name: brandName, // Using authentic brand names
            description: `Professional ${sectorData.name.replace(/[🔥🌱🏭🧠⚡🏦💊🎨🛡️🌐🏢🚗🎓📱🧪🔬⚖️🏠🌍🍎🌿📊🎯🛒📦🧮💼🔌⚙️🌊💡🎮🔒]/g, '').trim()} solution powered by ${brandName}`,
            sectorId: sector.id,
            integration: ["VaultMesh™", "HotStack", "FAA.ZONE™"][index % 3],
            status: ["active", "maintenance", "active"][index % 3],
            isCore: true,
            parentId: null,
            metadata: { 
              featured: index < 3,
              sector: sectorKey,
              planVersions: sectorData.planVersions
            },
            createdAt: new Date().toISOString()
          };
          this.brands.set(brand.id, brand);
        });
      }
    });
    this.currentBrandId = brandId;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getAllSectors(): Promise<Sector[]> {
    return Array.from(this.sectors.values());
  }

  async getSector(id: number): Promise<Sector | undefined> {
    return this.sectors.get(id);
  }

  async createSector(insertSector: InsertSector): Promise<Sector> {
    const id = this.currentSectorId++;
    const sector: Sector = { 
      ...insertSector, 
      id,
      description: insertSector.description || null,
      brandCount: insertSector.brandCount || null,
      subnodeCount: insertSector.subnodeCount || null
    };
    this.sectors.set(id, sector);
    return sector;
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrandsBySearch(query: string): Promise<Brand[]> {
    const brands = Array.from(this.brands.values());
    if (!query) return brands;
    
    const lowercaseQuery = query.toLowerCase();
    return brands.filter(brand => 
      brand.name.toLowerCase().includes(lowercaseQuery) ||
      brand.description?.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getBrandsBySector(sectorId: number): Promise<Brand[]> {
    return Array.from(this.brands.values()).filter(brand => brand.sectorId === sectorId);
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.currentBrandId++;
    const brand: Brand = { 
      ...insertBrand, 
      id,
      createdAt: new Date().toISOString(),
      description: insertBrand.description || null,
      sectorId: insertBrand.sectorId || null,
      status: insertBrand.status || "active",
      isCore: insertBrand.isCore || null,
      parentId: insertBrand.parentId || null,
      metadata: insertBrand.metadata || null
    };
    this.brands.set(id, brand);
    return brand;
  }

  async getAllSystemStatus(): Promise<SystemStatus[]> {
    return Array.from(this.systemStatuses.values());
  }

  async getSystemStatus(service: string): Promise<SystemStatus | undefined> {
    return this.systemStatuses.get(service);
  }

  async updateSystemStatus(service: string, status: string): Promise<SystemStatus> {
    const existing = this.systemStatuses.get(service);
    const updated: SystemStatus = {
      id: existing?.id || this.currentBrandId++,
      service,
      status,
      lastChecked: new Date().toISOString()
    };
    this.systemStatuses.set(service, updated);
    return updated;
  }

  // Legal Documents methods
  async getLegalDocuments(): Promise<LegalDocument[]> {
    return Array.from(this.legalDocuments.values());
  }

  async createLegalDocument(insertDoc: InsertLegalDocument): Promise<LegalDocument> {
    const id = this.currentDocId++;
    const doc: LegalDocument = {
      ...insertDoc,
      id,
      createdAt: new Date().toISOString(),
      icon: insertDoc.icon || "📄",
      category: insertDoc.category || "legal",
      tags: Array.isArray(insertDoc.tags) ? [...insertDoc.tags] : []
    };
    this.legalDocuments.set(id.toString(), doc);
    return doc;
  }

  // Repository methods
  async getRepositories(): Promise<Repository[]> {
    return Array.from(this.repositories.values());
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const id = this.currentRepoId++;
    const repo: Repository = {
      ...insertRepo,
      id,
      createdAt: new Date().toISOString(),
      description: insertRepo.description || null,
      category: insertRepo.category || "documentation",
      status: insertRepo.status || "active"
    };
    this.repositories.set(id.toString(), repo);
    return repo;
  }

  // Payment methods
  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date().toISOString(),
      metadata: insertPayment.metadata || null,
      status: insertPayment.status || "pending",
      currency: insertPayment.currency || null,
      userId: insertPayment.userId || null,
      paypalOrderId: insertPayment.paypalOrderId || null
    };
    this.payments.set(id.toString(), payment);
    return payment;
  }
}

export const storage = new DatabaseStorage();
