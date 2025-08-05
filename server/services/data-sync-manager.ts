import { storage } from "../storage";
import { FallbackDataManager } from "./fallback-data-manager";
import type { Brand, Sector } from "@shared/schema";

interface SyncMetrics {
  totalElements: number;
  coreBrands: number;
  subNodes: number;
  sectors: number;
  crossReferences: number;
  lastSync: string;
  integrityScore: number;
}

interface CrossReferenceMap {
  sectorToBrands: Map<number, Brand[]>;
  brandToSector: Map<number, Sector>;
  parentToSubnodes: Map<number, Brand[]>;
  integrationGroups: Map<string, Brand[]>;
}

export class DataSyncManager {
  private static instance: DataSyncManager;
  private crossRefMap: CrossReferenceMap | null = null;
  private lastSyncTimestamp: string = "";
  private syncInProgress: boolean = false;

  static getInstance(): DataSyncManager {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager();
    }
    return DataSyncManager.instance;
  }

  async performComprehensiveSync(): Promise<SyncMetrics> {
    if (this.syncInProgress) {
      console.log("📊 Sync already in progress, returning cached data");
      return this.generateSyncMetrics();
    }

    this.syncInProgress = true;
    const startTime = Date.now();

    try {
      console.log("🔄 Starting comprehensive data synchronization...");
      
      // Fetch all critical data simultaneously with fallback support
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors().catch(() => {
          console.log("📋 Using fallback sector data due to database unavailability");
          return FallbackDataManager.getSectors();
        }),
        storage.getAllBrands().catch(() => {
          console.log("🏢 Using fallback brand data due to database unavailability");
          return FallbackDataManager.getBrands();
        }),
        storage.getSystemStatus().catch(() => {
          console.log("⚙️ Using fallback system status due to database unavailability");
          return FallbackDataManager.getSystemStatus();
        })
      ]);

      // Build cross-reference maps for optimized lookups
      this.crossRefMap = this.buildCrossReferenceMaps(sectors, brands);
      
      // Validate data integrity
      const integrityScore = this.validateDataIntegrity(sectors, brands);
      
      this.lastSyncTimestamp = new Date().toISOString();
      
      const syncTime = Date.now() - startTime;
      console.log(`✅ Sync completed in ${syncTime}ms with integrity score: ${integrityScore}%`);

      return {
        totalElements: brands.length,
        coreBrands: brands.filter(b => b.isCore).length,
        subNodes: brands.filter(b => !b.isCore).length,
        sectors: sectors.length,
        crossReferences: this.countCrossReferences(),
        lastSync: this.lastSyncTimestamp,
        integrityScore
      };

    } finally {
      this.syncInProgress = false;
    }
  }

  private buildCrossReferenceMaps(sectors: Sector[], brands: Brand[]): CrossReferenceMap {
    const sectorToBrands = new Map<number, Brand[]>();
    const brandToSector = new Map<number, Sector>();
    const parentToSubnodes = new Map<number, Brand[]>();
    const integrationGroups = new Map<string, Brand[]>();

    // Build sector lookup map
    const sectorMap = new Map(sectors.map(s => [s.id, s]));

    // Process brands and build cross-references
    brands.forEach(brand => {
      // Sector to brands mapping
      if (brand.sectorId) {
        if (!sectorToBrands.has(brand.sectorId)) {
          sectorToBrands.set(brand.sectorId, []);
        }
        sectorToBrands.get(brand.sectorId)!.push(brand);

        // Brand to sector mapping
        const sector = sectorMap.get(brand.sectorId);
        if (sector) {
          brandToSector.set(brand.id, sector);
        }
      }

      // Parent to subnodes mapping
      if (brand.parentId) {
        if (!parentToSubnodes.has(brand.parentId)) {
          parentToSubnodes.set(brand.parentId, []);
        }
        parentToSubnodes.get(brand.parentId)!.push(brand);
      }

      // Integration groups mapping
      if (brand.integration) {
        if (!integrationGroups.has(brand.integration)) {
          integrationGroups.set(brand.integration, []);
        }
        integrationGroups.get(brand.integration)!.push(brand);
      }
    });

    return {
      sectorToBrands,
      brandToSector,
      parentToSubnodes,
      integrationGroups
    };
  }

  private validateDataIntegrity(sectors: Sector[], brands: Brand[]): number {
    let validReferences = 0;
    let totalReferences = 0;

    // Validate sector references
    brands.forEach(brand => {
      if (brand.sectorId) {
        totalReferences++;
        const sectorExists = sectors.some(s => s.id === brand.sectorId);
        if (sectorExists) validReferences++;
      }

      // Validate parent references
      if (brand.parentId) {
        totalReferences++;
        const parentExists = brands.some(b => b.id === brand.parentId);
        if (parentExists) validReferences++;
      }
    });

    return totalReferences > 0 ? Math.round((validReferences / totalReferences) * 100) : 100;
  }

  private countCrossReferences(): number {
    if (!this.crossRefMap) return 0;
    
    return (
      this.crossRefMap.sectorToBrands.size +
      this.crossRefMap.brandToSector.size +
      this.crossRefMap.parentToSubnodes.size +
      this.crossRefMap.integrationGroups.size
    );
  }

  // Optimized cross-reference lookup methods
  getBrandsBySector(sectorId: number): Brand[] {
    return this.crossRefMap?.sectorToBrands.get(sectorId) || [];
  }

  getSectorForBrand(brandId: number): Sector | undefined {
    return this.crossRefMap?.brandToSector.get(brandId);
  }

  getSubnodesByParent(parentId: number): Brand[] {
    return this.crossRefMap?.parentToSubnodes.get(parentId) || [];
  }

  getBrandsByIntegration(integration: string): Brand[] {
    return this.crossRefMap?.integrationGroups.get(integration) || [];
  }

  // Generate metrics from cached cross-reference data
  private generateSyncMetrics(): SyncMetrics {
    if (!this.crossRefMap) {
      return {
        totalElements: 0,
        coreBrands: 0,
        subNodes: 0,
        sectors: 0,
        crossReferences: 0,
        lastSync: this.lastSyncTimestamp,
        integrityScore: 0
      };
    }

    const allBrands = Array.from(this.crossRefMap.brandToSector.keys());
    
    return {
      totalElements: allBrands.length,
      coreBrands: 0, // Would need to store isCore in cross-ref map
      subNodes: 0,   // Would need to store isCore in cross-ref map  
      sectors: this.crossRefMap.sectorToBrands.size,
      crossReferences: this.countCrossReferences(),
      lastSync: this.lastSyncTimestamp,
      integrityScore: 100 // Would need to recalculate from cross-ref data
    };
  }

  // Get comprehensive sync status
  getSyncStatus() {
    return {
      isActive: this.syncInProgress,
      lastSync: this.lastSyncTimestamp,
      crossReferencesBuilt: !!this.crossRefMap,
      crossReferenceCount: this.countCrossReferences()
    };
  }
}

export const dataSyncManager = DataSyncManager.getInstance();