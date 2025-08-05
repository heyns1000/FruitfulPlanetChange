import type { Brand, Sector } from "@shared/schema";

// Fallback data for development/testing when database is unavailable
export const FALLBACK_SECTORS: Sector[] = [
  { id: 1, name: "🌱 Agriculture & Biotech", emoji: "🌱", description: "Agricultural innovation and biotechnology", brandCount: 120, subnodeCount: 45 },
  { id: 2, name: "🏦 Banking & Finance", emoji: "🏦", description: "Financial services and banking", brandCount: 89, subnodeCount: 32 },
  { id: 3, name: "⛏️ Mining & Resources", emoji: "⛏️", description: "Mining operations and resource extraction", brandCount: 156, subnodeCount: 67 },
  { id: 4, name: "🎬 Motion, Media & Sonic", emoji: "🎬", description: "Media production and audio technology", brandCount: 98, subnodeCount: 41 },
  { id: 5, name: "🔋 Utilities & Energy", emoji: "🔋", description: "Energy infrastructure and utilities", brandCount: 134, subnodeCount: 52 }
];

export const FALLBACK_BRANDS: Brand[] = [
  { id: 1, name: "VaultMesh Core", description: "Central infrastructure management", sectorId: 1, integration: "VaultMesh™", status: "active", isCore: true },
  { id: 2, name: "AgriTech Solutions", description: "Smart farming technology", sectorId: 1, integration: "VaultMesh™", status: "active", isCore: true },
  { id: 3, name: "FinanceFlow", description: "Payment processing system", sectorId: 2, integration: "FAA.ZONE™", status: "active", isCore: true },
  { id: 4, name: "MineTrace Analytics", description: "Mining operation analytics", sectorId: 3, integration: "HotStack", status: "active", isCore: true },
  { id: 5, name: "SonicGrid", description: "Audio processing engine", sectorId: 4, integration: "VaultMesh™", status: "active", isCore: true },
  { id: 6, name: "PowerNode", description: "Energy distribution network", sectorId: 5, integration: "FAA.ZONE™", status: "active", isCore: true },
  { id: 7, name: "AgriSub-Alpha", description: "Crop monitoring sensors", sectorId: 1, integration: "VaultMesh™", status: "active", isCore: false, parentId: 2 },
  { id: 8, name: "FinSub-Beta", description: "Credit scoring module", sectorId: 2, integration: "FAA.ZONE™", status: "active", isCore: false, parentId: 3 }
];

export class FallbackDataManager {
  static getSectors(): Sector[] {
    return FALLBACK_SECTORS;
  }

  static getBrands(): Brand[] {
    return FALLBACK_BRANDS;
  }

  static getBrandsBySector(sectorId: number): Brand[] {
    return FALLBACK_BRANDS.filter(brand => brand.sectorId === sectorId);
  }

  static getSystemStatus() {
    return [
      { id: 1, service: "database", status: "fallback", lastChecked: new Date().toISOString() },
      { id: 2, service: "sync-manager", status: "online", lastChecked: new Date().toISOString() },
      { id: 3, service: "cross-reference", status: "online", lastChecked: new Date().toISOString() }
    ];
  }

  static getDashboardStats() {
    return {
      totalElements: FALLBACK_BRANDS.length,
      coreBrands: FALLBACK_BRANDS.filter(b => b.isCore).length,
      subNodes: FALLBACK_BRANDS.filter(b => !b.isCore).length,
      sectors: FALLBACK_SECTORS.length,
      integrationTiers: {
        tier1: FALLBACK_BRANDS.filter(b => b.integration === "VaultMesh™").length,
        tier2: FALLBACK_BRANDS.filter(b => b.integration === "FAA.ZONE™").length,
        tier3: FALLBACK_BRANDS.filter(b => b.integration === "HotStack").length
      },
      activeBrands: FALLBACK_BRANDS.filter(b => b.status === "active").length,
      marketPenetration: 95.2,
      revenueGrowth: 12.5
    };
  }
}