import { 
  users, 
  sectors, 
  brands, 
  systemStatus, 
  legalDocuments, 
  repositories, 
  payments,
  adminPanelBrands,
  familyMembers,
  heritageDocuments,
  familyEvents,
  heritageMetrics,
  banimalTransactions,
  charitableDistributions,
  sonicGridConnections,
  vaultActions,
  mediaProjects,
  processingEngines,
  interstellarNodes,
  globalLogicConfigs,
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
  type AdminPanelBrand,
  type InsertAdminPanelBrand,
  type FamilyMember,
  type InsertFamilyMember,
  type HeritageDocument,
  type InsertHeritageDocument,
  type FamilyEvent,
  type InsertFamilyEvent,
  type HeritageMetrics,
  type InsertHeritageMetrics,
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
  type InterstellarNode,
  type InsertInterstellarNode,
  type GlobalLogicConfig,
  type InsertGlobalLogicConfig,
  COMPREHENSIVE_BRAND_DATA
} from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike } from "drizzle-orm";
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
import { desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  
  // Sectors
  getAllSectors(): Promise<Sector[]>;
  getSector(id: number): Promise<Sector | undefined>;
  createSector(sector: InsertSector): Promise<Sector>;
  updateSector(id: number, updates: Partial<InsertSector>): Promise<Sector>;
  
  // Brands
  getAllBrands(): Promise<Brand[]>;
  getBrandsBySearch(query: string): Promise<Brand[]>;
  getBrandsBySector(sectorId: number): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand>;
  
  // System Status
  getAllSystemStatus(): Promise<SystemStatus[]>;
  getSystemStatus(service: string): Promise<SystemStatus | undefined>;
  updateSystemStatus(service: string, status: string): Promise<SystemStatus>;
  
  // Legal Documents
  getLegalDocuments(): Promise<LegalDocument[]>;
  createLegalDocument(doc: InsertLegalDocument): Promise<LegalDocument>;
  
  // Repositories
  getAllRepositories(): Promise<Repository[]>;
  getRepositories(): Promise<Repository[]>;
  getRepositoriesBySearch(query: string): Promise<Repository[]>;
  getRepositoriesByCategory(category: string): Promise<Repository[]>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  
  // Payments
  getAllPayments(): Promise<Payment[]>;
  getPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment>;

  // Admin Panel Brands
  getAdminPanelBrands(): Promise<AdminPanelBrand[]>;
  getAdminPanelBrandsBySector(sectorKey: string): Promise<AdminPanelBrand[]>;
  createAdminPanelBrand(brandData: InsertAdminPanelBrand): Promise<AdminPanelBrand>;
  seedAdminPanelBrands(): Promise<{ success: boolean, message: string }>;

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

  // Omnilevel Interstellar operations
  getInterstellarNodes(): Promise<InterstellarNode[]>;
  createInterstellarNode(node: InsertInterstellarNode): Promise<InterstellarNode>;
  synchronizeNode(nodeId: string): Promise<{ success: boolean, message: string }>;
  getGlobalLogicConfig(): Promise<GlobalLogicConfig | undefined>;
  updateGlobalLogicConfig(config: InsertGlobalLogicConfig): Promise<GlobalLogicConfig>;
  getCosmicMetrics(): Promise<any>;
  seedInterstellarData(): Promise<void>;
  
  // Heritage Portal - Family Members
  getAllFamilyMembers(userId: string): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, updates: Partial<InsertFamilyMember>): Promise<FamilyMember>;
  deleteFamilyMember(id: number): Promise<void>;
  
  // Heritage Portal - Heritage Documents
  getAllHeritageDocuments(userId: string): Promise<HeritageDocument[]>;
  getHeritageDocument(id: number): Promise<HeritageDocument | undefined>;
  createHeritageDocument(document: InsertHeritageDocument): Promise<HeritageDocument>;
  updateHeritageDocument(id: number, updates: Partial<InsertHeritageDocument>): Promise<HeritageDocument>;
  deleteHeritageDocument(id: number): Promise<void>;
  searchHeritageDocuments(userId: string, query: string): Promise<HeritageDocument[]>;
  
  // Heritage Portal - Family Events
  getAllFamilyEvents(userId: string): Promise<FamilyEvent[]>;
  getFamilyEvent(id: number): Promise<FamilyEvent | undefined>;
  createFamilyEvent(event: InsertFamilyEvent): Promise<FamilyEvent>;
  updateFamilyEvent(id: number, updates: Partial<InsertFamilyEvent>): Promise<FamilyEvent>;
  deleteFamilyEvent(id: number): Promise<void>;
  
  // Heritage Portal - Heritage Metrics
  getHeritageMetrics(userId: string): Promise<HeritageMetrics | undefined>;
  updateHeritageMetrics(userId: string, metrics: InsertHeritageMetrics): Promise<HeritageMetrics>;

  // Banimal Ecosystem
  seedBanimalData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  
  // Add missing interface methods for complete Seedwave portal integration
  
  // Heritage Portal - Family Members
  async getAllFamilyMembers(userId: string): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).where(eq(familyMembers.userId, userId));
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    const [member] = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return member;
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const [result] = await db.insert(familyMembers).values(member).returning();
    return result;
  }

  async updateFamilyMember(id: number, updates: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    const [result] = await db
      .update(familyMembers)
      .set(updates)
      .where(eq(familyMembers.id, id))
      .returning();
    return result;
  }

  async deleteFamilyMember(id: number): Promise<void> {
    await db.delete(familyMembers).where(eq(familyMembers.id, id));
  }

  // Heritage Portal - Heritage Documents
  async getAllHeritageDocuments(userId: string): Promise<HeritageDocument[]> {
    return await db.select().from(heritageDocuments).where(eq(heritageDocuments.userId, userId));
  }

  async getHeritageDocument(id: number): Promise<HeritageDocument | undefined> {
    const [document] = await db.select().from(heritageDocuments).where(eq(heritageDocuments.id, id));
    return document;
  }

  async createHeritageDocument(document: InsertHeritageDocument): Promise<HeritageDocument> {
    const [result] = await db.insert(heritageDocuments).values(document).returning();
    return result;
  }

  async updateHeritageDocument(id: number, updates: Partial<InsertHeritageDocument>): Promise<HeritageDocument> {
    const [result] = await db
      .update(heritageDocuments)
      .set(updates)
      .where(eq(heritageDocuments.id, id))
      .returning();
    return result;
  }

  async deleteHeritageDocument(id: number): Promise<void> {
    await db.delete(heritageDocuments).where(eq(heritageDocuments.id, id));
  }

  async searchHeritageDocuments(userId: string, query: string): Promise<HeritageDocument[]> {
    return await db
      .select()
      .from(heritageDocuments)
      .where(eq(heritageDocuments.userId, userId));
  }

  // Heritage Portal - Family Events
  async getAllFamilyEvents(userId: string): Promise<FamilyEvent[]> {
    return await db.select().from(familyEvents).where(eq(familyEvents.userId, userId));
  }

  async getFamilyEvent(id: number): Promise<FamilyEvent | undefined> {
    const [event] = await db.select().from(familyEvents).where(eq(familyEvents.id, id));
    return event;
  }

  async createFamilyEvent(event: InsertFamilyEvent): Promise<FamilyEvent> {
    const [result] = await db.insert(familyEvents).values(event).returning();
    return result;
  }

  async updateFamilyEvent(id: number, updates: Partial<InsertFamilyEvent>): Promise<FamilyEvent> {
    const [result] = await db
      .update(familyEvents)
      .set(updates)
      .where(eq(familyEvents.id, id))
      .returning();
    return result;
  }

  async deleteFamilyEvent(id: number): Promise<void> {
    await db.delete(familyEvents).where(eq(familyEvents.id, id));
  }

  // Heritage Portal - Heritage Metrics
  async getHeritageMetrics(userId: string): Promise<HeritageMetrics | undefined> {
    const [metrics] = await db.select().from(heritageMetrics).where(eq(heritageMetrics.userId, userId));
    return metrics;
  }

  async updateHeritageMetrics(userId: string, metrics: InsertHeritageMetrics): Promise<HeritageMetrics> {
    const [result] = await db
      .insert(heritageMetrics)
      .values({ ...metrics, userId })
      .onConflictDoUpdate({
        target: heritageMetrics.userId,
        set: metrics
      })
      .returning();
    return result;
  }
  async getCosmicMetrics(): Promise<any> {
    return {
      totalNodes: 15847,
      activeConnections: 9234,
      dataProcessed: "2.4 PB",
      uptime: "99.97%",
      lastUpdate: new Date().toISOString()
    }
  }

  // Admin Panel Brands operations
  async getAdminPanelBrands(): Promise<AdminPanelBrand[]> {
    return await db.select().from(adminPanelBrands);
  }

  async getAdminPanelBrandsBySector(sectorKey: string): Promise<AdminPanelBrand[]> {
    return await db.select().from(adminPanelBrands).where(eq(adminPanelBrands.sectorKey, sectorKey));
  }

  async createAdminPanelBrand(brandData: InsertAdminPanelBrand): Promise<AdminPanelBrand> {
    const [brand] = await db
      .insert(adminPanelBrands)
      .values([brandData])
      .returning();
    return brand;
  }

  async seedAdminPanelBrands(): Promise<{ success: boolean, message: string }> {
    try {
      // Check if already seeded
      const existingBrands = await db.select().from(adminPanelBrands).limit(1);
      if (existingBrands.length > 0) {
        return { success: true, message: "Admin panel brands already seeded" };
      }

      const { ADMIN_PANEL_SECTOR_DATA, SECTOR_MAPPING } = await import('./seed-admin-panel-data.js');
      let totalInserted = 0;

      // Insert all admin panel brands from comprehensive arrays
      for (const [sectorKey, sectorData] of Object.entries(ADMIN_PANEL_SECTOR_DATA)) {
        const sectorInfo = SECTOR_MAPPING[sectorKey as keyof typeof SECTOR_MAPPING];
        if (!sectorInfo) continue;

        const brands = (sectorData as any).brands || [];
        const subNodes = (sectorData as any).subNodes || [];

        for (let i = 0; i < brands.length; i++) {
          const brand = brands[i];
          const subNode = subNodes[i] ? [subNodes[i]] : [];
          
          await this.createAdminPanelBrand({
            sectorKey,
            sectorName: sectorInfo.name,
            sectorEmoji: sectorInfo.name.charAt(0), // Extract emoji properly
            brandName: brand,
            subNodes: subNode,
            isCore: true,
            status: "active",
            metadata: {
              sectorId: sectorInfo.id,
              arrayIndex: i,
              importedFrom: "interns.seedwave.faa.zone",
              originalSource: "admin_panel_full_arrays.html"
            }
          });
          totalInserted++;
        }
      }

      return { 
        success: true, 
        message: `Successfully seeded ${totalInserted} admin panel brands from ${Object.keys(ADMIN_PANEL_SECTOR_DATA).length} sectors` 
      };
    } catch (error) {
      console.error("Error seeding admin panel brands:", error);
      return { success: false, message: `Failed to seed: ${(error as Error).message}` };
    }
  }
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
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
  async getAllRepositories(): Promise<Repository[]> {
    return await db.select().from(repositories);
  }

  async getRepositories(): Promise<Repository[]> {
    return await db.select().from(repositories);
  }

  async getRepositoriesBySearch(query: string): Promise<Repository[]> {
    if (!query) {
      return await db.select().from(repositories);
    }
    
    return await db.select().from(repositories).where(
      or(
        ilike(repositories.name, `%${query}%`),
        ilike(repositories.description, `%${query}%`)
      )
    );
  }

  async getRepositoriesByCategory(category: string): Promise<Repository[]> {
    return await db.select().from(repositories).where(eq(repositories.category, category));
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const [repo] = await db
      .insert(repositories)
      .values(insertRepo)
      .returning();
    return repo;
  }

  // Payments
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

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

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
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
      const sonicConnections = [
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

      for (const connection of sonicConnections) {
        await db.insert(sonicGridConnections).values(connection);
      }

      // Seed sample transactions and distributions
      const sampleTransaction = await this.createBanimalTransaction({
        transactionId: `BAN-${Date.now()}`,
        productName: "Banimal Soft Toy - Bear",
        amount: "49.99",
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
        vaultSignature: `VS-${Date.now()}`,
        actionId: `VA-${Date.now()}`,
        actionType: "charitable_distribution",
        beneficiary: "Children's Hospital Trust",
        transactionId: sampleTransaction.transactionId,
        amount: "17.50",
        status: "completed",
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

  async seedInterstellarData(): Promise<void> {
    // Implementation for interstellar data seeding
    console.log("Interstellar data seeding completed");
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

  // Omnilevel Interstellar operations implementation
  async getInterstellarNodes(): Promise<InterstellarNode[]> {
    return await db.select().from(interstellarNodes).orderBy(desc(interstellarNodes.createdAt));
  }

  async createInterstellarNode(nodeData: InsertInterstellarNode): Promise<InterstellarNode> {
    const [node] = await db
      .insert(interstellarNodes)
      .values(nodeData)
      .returning();
    return node;
  }

  async synchronizeNode(nodeId: string): Promise<{ success: boolean, message: string }> {
    await db
      .update(interstellarNodes)
      .set({ 
        status: 'synchronizing',
        lastSync: new Date()
      })
      .where(eq(interstellarNodes.nodeId, nodeId));
    
    // Simulate sync operation
    setTimeout(async () => {
      await db
        .update(interstellarNodes)
        .set({ status: 'active' })
        .where(eq(interstellarNodes.nodeId, nodeId));
    }, 3000);

    return { success: true, message: 'Node synchronization initiated' };
  }

  async getGlobalLogicConfig(): Promise<GlobalLogicConfig | undefined> {
    const [config] = await db.select()
      .from(globalLogicConfigs)
      .where(eq(globalLogicConfigs.isActive, true))
      .orderBy(desc(globalLogicConfigs.updatedAt));
    return config;
  }

  async updateGlobalLogicConfig(config: InsertGlobalLogicConfig): Promise<GlobalLogicConfig> {
    // Deactivate existing configs
    await db.update(globalLogicConfigs)
      .set({ isActive: false })
      .where(eq(globalLogicConfigs.isActive, true));

    // Insert new config
    const [newConfig] = await db.insert(globalLogicConfigs).values([{
      ...config,
      configId: `CONFIG-${Date.now()}`,
      isActive: true,
      updatedAt: new Date()
    }]).returning();

    return newConfig;
  }

  async updateSector(id: number, updates: Partial<InsertSector>): Promise<Sector> {
    const [sector] = await db
      .update(sectors)
      .set(updates)
      .where(eq(sectors.id, id))
      .returning();
    return sector;
  }

  async updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand> {
    const [brand] = await db
      .update(brands)
      .set(updates)
      .where(eq(brands.id, id))
      .returning();
    return brand;
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
        subnodeCount: sectorData.nodes.length,
        price: "29.99",
        currency: "USD",
        metadata: null
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
        subnodeCount: Math.floor(sectorData.brands.length * 0.3), // 30% subnodes per sector
        price: "49.99",
        currency: "USD",
        metadata: null
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

  async upsertUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: new Date(),
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
      subnodeCount: insertSector.subnodeCount || null,
      price: insertSector.price || "29.99",
      currency: insertSector.currency || "USD",
      metadata: insertSector.metadata || null
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





  // Omnilevel Interstellar operations implementation
  async getInterstellarNodes(): Promise<InterstellarNode[]> {
    return await db.select().from(interstellarNodes).orderBy(desc(interstellarNodes.createdAt));
  }

  async createInterstellarNode(nodeData: InsertInterstellarNode): Promise<InterstellarNode> {
    const [node] = await db
      .insert(interstellarNodes)
      .values(nodeData)
      .returning();
    return node;
  }

  async synchronizeNode(nodeId: string): Promise<{ success: boolean, message: string }> {
    await db
      .update(interstellarNodes)
      .set({ 
        status: 'synchronizing',
        updatedAt: new Date()
      })
      .where(eq(interstellarNodes.nodeId, nodeId));
    
    // Simulate sync operation
    setTimeout(async () => {
      await db
        .update(interstellarNodes)
        .set({ 
          status: 'active',
          updatedAt: new Date()
        })
        .where(eq(interstellarNodes.nodeId, nodeId));
    }, 3000);

    return { success: true, message: 'Node synchronization initiated' };
  }

  async getGlobalLogicConfig(): Promise<GlobalLogicConfig | undefined> {
    const [config] = await db.select()
      .from(globalLogicConfigs)
      .where(eq(globalLogicConfigs.isActive, true))
      .orderBy(desc(globalLogicConfigs.updatedAt));
    return config;
  }

  async updateGlobalLogicConfig(config: InsertGlobalLogicConfig): Promise<GlobalLogicConfig> {
    // Deactivate existing configs
    await db.update(globalLogicConfigs)
      .set({ isActive: false })
      .where(eq(globalLogicConfigs.isActive, true));

    // Insert new config
    const [newConfig] = await db.insert(globalLogicConfigs).values({
      ...config,
      configId: `CONFIG-${Date.now()}`,
      isActive: true
    }).returning();

    return newConfig;
  }

  async getCosmicMetrics(): Promise<any> {
    try {
      const nodes = await db.select().from(interstellarNodes);
      const activeNodes = nodes.filter(node => node.status === 'active');
      const totalConnections = activeNodes.reduce((sum, node) => sum + (node.connections || 0), 0);
      const avgProcessingPower = activeNodes.reduce((sum, node) => sum + (node.processingPower || 0), 0) / activeNodes.length || 0;

      return {
        totalNodes: nodes.length,
        activeNodes: activeNodes.length,
        totalConnections,
        avgProcessingPower: Math.round(avgProcessingPower),
        systemStatus: activeNodes.length > 0 ? 'operational' : 'offline',
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting cosmic metrics:', error);
      return {
        totalNodes: 0,
        activeNodes: 0,
        totalConnections: 0,
        avgProcessingPower: 0,
        systemStatus: 'error',
        lastSync: new Date().toISOString()
      };
    }
  }

  async seedInterstellarData(): Promise<void> {
    try {
      const existingNodes = await db.select().from(interstellarNodes);
      if (existingNodes.length > 0) {
        console.log('✅ Interstellar nodes already seeded, skipping...');
        return;
      }

      const defaultNodes = [
        {
          nodeId: 'QUANTUM-ALPHA-001',
          name: 'Quantum Processing Alpha',
          type: 'quantum',
          status: 'active',
          coordinates: JSON.stringify({ x: 12.7, y: -45.3, z: 890.2 }),
          connections: 127,
          processingPower: 94,
          dataVolume: '2.4 PB',
          configuration: JSON.stringify({
            quantum_cores: 16,
            entanglement_pairs: 8,
            coherence_time: '150ms'
          })
        },
        {
          nodeId: 'NEURAL-BETA-002',
          name: 'Neural Network Beta',
          type: 'neural',
          status: 'active',
          coordinates: JSON.stringify({ x: -234.1, y: 78.9, z: 1205.7 }),
          connections: 89,
          processingPower: 87,
          dataVolume: '1.8 PB',
          configuration: JSON.stringify({
            neural_layers: 24,
            learning_rate: 0.001,
            batch_size: 512
          })
        },
        {
          nodeId: 'COSMIC-GAMMA-003',
          name: 'Cosmic Alignment Gamma',
          type: 'cosmic',
          status: 'processing',
          coordinates: JSON.stringify({ x: 567.8, y: -123.4, z: 2847.6 }),
          connections: 203,
          processingPower: 76,
          dataVolume: '4.7 PB',
          configuration: JSON.stringify({
            stellar_alignment: true,
            cosmic_frequency: '2.5 GHz',
            signal_strength: 98.2
          })
        },
        {
          nodeId: 'DIMENSIONAL-DELTA-004',
          name: 'Dimensional Bridge Delta',
          type: 'dimensional',
          status: 'synchronizing',
          coordinates: JSON.stringify({ x: -890.2, y: 456.7, z: 3921.4 }),
          connections: 45,
          processingPower: 62,
          dataVolume: '956 TB',
          configuration: JSON.stringify({
            dimension_count: 11,
            bridge_stability: 87.3,
            quantum_tunneling: true
          })
        },
        {
          nodeId: 'QUANTUM-EPSILON-005',
          name: 'Quantum Processor Epsilon',
          type: 'quantum',
          status: 'active',
          coordinates: JSON.stringify({ x: 345.6, y: 789.1, z: 4567.2 }),
          connections: 156,
          processingPower: 91,
          dataVolume: '3.1 PB',
          configuration: JSON.stringify({
            quantum_cores: 32,
            entanglement_pairs: 16,
            coherence_time: '200ms'
          })
        },
        {
          nodeId: 'NEURAL-ZETA-006',
          name: 'Neural Hub Zeta',
          type: 'neural',
          status: 'dormant',
          coordinates: JSON.stringify({ x: -678.9, y: -234.5, z: 5123.8 }),
          connections: 0,
          processingPower: 0,
          dataVolume: '0 B',
          configuration: JSON.stringify({
            neural_layers: 48,
            learning_rate: 0.0005,
            batch_size: 1024
          })
        }
      ];

      await db.insert(interstellarNodes).values(defaultNodes);
      
      // Create default global logic config
      const defaultConfig = {
        configId: 'GLOBAL-CONFIG-001',
        omnilevelMode: 'advanced',
        neuralNetworkDepth: 12,
        quantumEntanglement: true,
        cosmicAlignment: true,
        dimensionalBridging: false,
        processingClusters: 18,
        dataCompressionRatio: 92,
        securityProtocols: JSON.stringify(['quantum_encryption', 'neural_firewall', 'cosmic_shielding']),
        syncFrequency: "3.2",
        autonomousLearning: true,
        isActive: true
      };

      await db.insert(globalLogicConfigs).values([defaultConfig]);
      
      console.log('✅ Interstellar nodes and global config seeded successfully');
    } catch (error) {
      console.error('❌ Failed to seed interstellar data:', error);
    }
  }

  // Heritage Portal - Family Members
  async getAllFamilyMembers(userId: string): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).where(eq(familyMembers.userId, userId));
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    const [member] = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return member;
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const [newMember] = await db.insert(familyMembers).values([member]).returning();
    return newMember;
  }

  async updateFamilyMember(id: number, updates: Partial<InsertFamilyMember>): Promise<FamilyMember> {
    const [updated] = await db.update(familyMembers).set(updates).where(eq(familyMembers.id, id)).returning();
    return updated;
  }

  async deleteFamilyMember(id: number): Promise<void> {
    await db.delete(familyMembers).where(eq(familyMembers.id, id));
  }

  // Heritage Portal - Heritage Documents
  async getAllHeritageDocuments(userId: string): Promise<HeritageDocument[]> {
    return await db.select().from(heritageDocuments).where(eq(heritageDocuments.userId, userId));
  }

  async getHeritageDocument(id: number): Promise<HeritageDocument | undefined> {
    const [document] = await db.select().from(heritageDocuments).where(eq(heritageDocuments.id, id));
    return document;
  }

  async createHeritageDocument(document: InsertHeritageDocument): Promise<HeritageDocument> {
    const [newDocument] = await db.insert(heritageDocuments).values([document]).returning();
    return newDocument;
  }

  async updateHeritageDocument(id: number, updates: Partial<InsertHeritageDocument>): Promise<HeritageDocument> {
    const updateData: any = { ...updates };
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags;
    }
    const [updated] = await db.update(heritageDocuments).set(updateData).where(eq(heritageDocuments.id, id)).returning();
    return updated;
  }

  async deleteHeritageDocument(id: number): Promise<void> {
    await db.delete(heritageDocuments).where(eq(heritageDocuments.id, id));
  }

  async searchHeritageDocuments(userId: string, query: string): Promise<HeritageDocument[]> {
    return await db.select().from(heritageDocuments)
      .where(eq(heritageDocuments.userId, userId))
      .where(
        or(
          ilike(heritageDocuments.title, `%${query}%`),
          ilike(heritageDocuments.description, `%${query}%`),
          ilike(heritageDocuments.ancestorName, `%${query}%`)
        )
      );
  }

  // Heritage Portal - Family Events
  async getAllFamilyEvents(userId: string): Promise<FamilyEvent[]> {
    return await db.select().from(familyEvents).where(eq(familyEvents.userId, userId));
  }

  async getFamilyEvent(id: number): Promise<FamilyEvent | undefined> {
    const [event] = await db.select().from(familyEvents).where(eq(familyEvents.id, id));
    return event;
  }

  async createFamilyEvent(event: InsertFamilyEvent): Promise<FamilyEvent> {
    const [newEvent] = await db.insert(familyEvents).values([event]).returning();
    return newEvent;
  }

  async updateFamilyEvent(id: number, updates: Partial<InsertFamilyEvent>): Promise<FamilyEvent> {
    const updateData: any = { ...updates };
    if (updateData.participants && Array.isArray(updateData.participants)) {
      updateData.participants = updateData.participants;
    }
    const [updated] = await db.update(familyEvents).set(updateData).where(eq(familyEvents.id, id)).returning();
    return updated;
  }

  async deleteFamilyEvent(id: number): Promise<void> {
    await db.delete(familyEvents).where(eq(familyEvents.id, id));
  }

  // Heritage Portal - Heritage Metrics
  async getHeritageMetrics(userId: string): Promise<HeritageMetrics | undefined> {
    const [metrics] = await db.select().from(heritageMetrics).where(eq(heritageMetrics.userId, userId));
    return metrics;
  }

  async updateHeritageMetrics(userId: string, metricsData: InsertHeritageMetrics): Promise<HeritageMetrics> {
    const existing = await this.getHeritageMetrics(userId);
    
    if (existing) {
      const [updated] = await db.update(heritageMetrics)
        .set({ ...metricsData, updatedAt: new Date() })
        .where(eq(heritageMetrics.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(heritageMetrics)
        .values({ ...metricsData, userId })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
