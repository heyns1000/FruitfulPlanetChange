import { 
  users, 
  sectors, 
  brands, 
  systemStatus, 
  legalDocuments, 
  repositories, 
  payments,
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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sectors: Map<number, Sector>;
  private brands: Map<number, Brand>;
  private systemStatuses: Map<string, SystemStatus>;
  private legalDocuments: Map<string, LegalDocument>;
  private repositories: Map<string, Repository>;
  private payments: Map<string, Payment>;
  private currentUserId: number;
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
    this.currentUserId = 1;
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

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
    const sector: Sector = { ...insertSector, id };
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
      createdAt: new Date().toISOString()
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
      tags: insertDoc.tags || []
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
      metadata: insertPayment.metadata || {},
      status: insertPayment.status || "pending",
      currency: insertPayment.currency || "USD"
    };
    this.payments.set(id.toString(), payment);
    return payment;
  }
}

export const storage = new MemStorage();
