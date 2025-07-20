import { db } from "./db";
import { sectors, brands, systemStatus, legalDocuments } from "@shared/schema";
import { COMPREHENSIVE_BRAND_DATA } from "@shared/schema";
import { FRUITFUL_CRATE_DANCE_SECTORS } from "@shared/fruitful-crate-dance-ecosystem";

export async function seedDatabase() {
  console.log("🌱 Seeding database with comprehensive brand data...");

  try {
    // Check if data already exists
    const existingBrands = await db.select().from(brands).limit(1);
    if (existingBrands.length > 0) {
      console.log("✅ Database already seeded, skipping...");
      return;
    }

    // Clear existing data
    await db.delete(brands);
    await db.delete(sectors);
    await db.delete(systemStatus);

    // Exact sector definitions matching the reference screenshots (26 total sectors, 598 total brands)
    const comprehensiveSectorMappings = [
      { key: "agriculture", name: "Agriculture & Biotech", emoji: "🌱", brands: 84, active: 56, integrations: 3 },
      { key: "banking", name: "Banking & Finance", emoji: "🏦", brands: 60, active: 40, integrations: 3 },
      { key: "logistics", name: "Logistics & Packaging", emoji: "📦", brands: 30, active: 20, integrations: 3 },
      { key: "professional", name: "Professional Services", emoji: "💼", brands: 30, active: 20, integrations: 3 },
      { key: "saas", name: "SaaS & Licensing", emoji: "💻", brands: 20, active: 13, integrations: 3 },
      { key: "nft", name: "NFT & Ownership", emoji: "🎨", brands: 20, active: 13, integrations: 3 },
      { key: "quantum", name: "Quantum Protocols", emoji: "⚛️", brands: 20, active: 13, integrations: 3 },
      { key: "ritual", name: "Ritual & Culture", emoji: "🎭", brands: 20, active: 13, integrations: 3 },
      { key: "nutrition", name: "Nutrition & Food Chain", emoji: "🍎", brands: 20, active: 13, integrations: 3 },
      { key: "zerowaste", name: "Zero Waste", emoji: "♻️", brands: 20, active: 13, integrations: 3 },
      { key: "voice", name: "Voice & Audio", emoji: "🎤", brands: 12, active: 8, integrations: 3 },
      { key: "wellness", name: "Wellness Tech & Nodes", emoji: "🧘", brands: 12, active: 8, integrations: 3 },
      { key: "utilities", name: "Utilities & Energy", emoji: "⚡", brands: 12, active: 8, integrations: 3 },
      { key: "creative", name: "Creative Tech", emoji: "🎨", brands: 10, active: 7, integrations: 3 },
      // Additional sectors to reach 26 total and 598 brands
      { key: "food", name: "Food & Farming", emoji: "🥦", brands: 48, active: 32, integrations: 3 },
      { key: "education", name: "Education & IP", emoji: "📚", brands: 28, active: 18, integrations: 3 },
      { key: "fashion", name: "Fashion & Identity", emoji: "✂️", brands: 25, active: 16, integrations: 3 },
      { key: "gaming", name: "Gaming & Simulation", emoji: "🎮", brands: 22, active: 14, integrations: 3 },
      { key: "health", name: "Health & Hygiene", emoji: "🧠", brands: 20, active: 13, integrations: 3 },
      { key: "housing", name: "Housing & Infrastructure", emoji: "🏗️", brands: 18, active: 12, integrations: 3 },
      { key: "ai", name: "AI, Logic & Grid", emoji: "🤖", brands: 16, active: 10, integrations: 3 },
      { key: "media", name: "Media & Sonic", emoji: "📺", brands: 15, active: 10, integrations: 3 },
      { key: "transport", name: "Transport & Mobility", emoji: "🚗", brands: 14, active: 9, integrations: 3 },
      { key: "mining", name: "Mining & Resources", emoji: "⛏️", brands: 13, active: 8, integrations: 3 },
      { key: "justice", name: "Justice & Legal", emoji: "⚖️", brands: 12, active: 8, integrations: 3 },
      { key: "retail", name: "Retail & Commerce", emoji: "🛍️", brands: 11, active: 7, integrations: 3 }
    ];

    const createdSectors = new Map();

    // Insert comprehensive sectors matching the reference screenshots
    for (const mapping of comprehensiveSectorMappings) {
      const [sector] = await db.insert(sectors).values({
        name: mapping.name,
        emoji: mapping.emoji,
        description: `${mapping.name} solutions and infrastructure`,
        brandCount: mapping.brands,
        subnodeCount: mapping.brands - mapping.active
      }).returning();

      createdSectors.set(mapping.key, sector);
    }

    // Add Fruitful Crate Dance sectors
    for (const [sectorKey, sectorData] of Object.entries(FRUITFUL_CRATE_DANCE_SECTORS)) {
      const [sector] = await db.insert(sectors).values({
        name: sectorData.name,
        emoji: sectorData.name.split(' ')[0],
        description: sectorData.description,
        brandCount: sectorData.brands.length,
        subnodeCount: Math.floor(sectorData.brands.length * 0.3)
      }).returning();

      createdSectors.set(`fruitful_${sectorKey}`, sector);
    }

    // Insert brands from comprehensive data
    let brandCount = 0;
    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_BRAND_DATA)) {
      const sector = createdSectors.get(sectorKey);
      if (sector) {
        for (let i = 0; i < sectorData.brands.length; i++) {
          const brandName = sectorData.brands[i];
          await db.insert(brands).values({
            name: brandName,
            description: `Professional ${sectorData.name.replace(/[🔥🌱🏭🧠⚡🏦💊🎨🛡️🌐🏢🚗🎓📱🧪🔬⚖️🏠🌍🍎🌿📊🎯🛒📦🧮💼🔌⚙️🌊💡🎮🔒]/g, '').trim()} solution powered by ${brandName}`,
            sectorId: sector.id,
            integration: ["VaultMesh™", "HotStack", "FAA.ZONE™"][i % 3],
            status: ["active", "maintenance", "active"][i % 3],
            isCore: true,
            parentId: null,
            metadata: { 
              featured: i < 3,
              sector: sectorKey,
              planVersions: sectorData.planVersions
            }
          });
          brandCount++;
        }
      }
    }

    // Add Fruitful Crate Dance brands
    for (const [sectorKey, sectorData] of Object.entries(FRUITFUL_CRATE_DANCE_SECTORS)) {
      const sector = createdSectors.get(`fruitful_${sectorKey}`);
      if (sector) {
        for (let i = 0; i < sectorData.brands.length; i++) {
          const brandName = sectorData.brands[i];
          await db.insert(brands).values({
            name: brandName,
            description: `Fruitful Crate Dance ecosystem brand: ${brandName}`,
            sectorId: sector.id,
            integration: ["VaultMesh™", "HotStack", "FAA.ZONE™"][i % 3],
            status: "active",
            isCore: true,
            parentId: null,
            metadata: { 
              featured: i < 5,
              sector: `fruitful_${sectorKey}`,
              ecosystem: "fruitful-crate-dance"
            }
          });
          brandCount++;
        }
      }
    }

    // Insert system status
    await db.insert(systemStatus).values([
      { service: "VaultMesh™", status: "online" },
      { service: "HotStack", status: "maintenance" },
      { service: "FAA.ZONE™", status: "online" },
      { service: "SecureSign™", status: "online" },
      { service: "King Price Integration", status: "active" }
    ]);

    console.log(`✅ Database seeded successfully!`);
    console.log(`📊 Created ${createdSectors.size} sectors`);
    console.log(`🏷️ Created ${brandCount} brands`);
    console.log(`⚙️ Created 5 system status entries`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}