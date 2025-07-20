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

    // Create sectors from comprehensive data
    const sectorMappings = [
      { key: "agriculture", name: "🌱 Agriculture & Biotech", emoji: "🌱", description: "Advanced biotech solutions for sustainable farming" },
      { key: "food", name: "🥦 Food, Soil & Farming", emoji: "🥦", description: "Food production and soil management systems" },
      { key: "banking", name: "🏦 Banking & Finance", emoji: "🏦", description: "Secure financial services and banking infrastructure" },
      { key: "creative", name: "🎨 Creative Tech", emoji: "🎨", description: "Creative technology and digital art solutions" },
      { key: "packaging", name: "📦 Logistics & Packaging", emoji: "📦", description: "Supply chain and packaging innovations" },
      { key: "education", name: "📚 Education & IP", emoji: "📚", description: "Educational technology and intellectual property" },
      { key: "fashion", name: "✂️ Fashion & Identity", emoji: "✂️", description: "Fashion technology and identity solutions" },
      { key: "gaming", name: "🎮 Gaming & Simulation", emoji: "🎮", description: "Interactive gaming and simulation platforms" },
      { key: "health", name: "🧠 Health & Hygiene", emoji: "🧠", description: "Healthcare and hygiene management systems" },
      { key: "housing", name: "🏗️ Housing & Infrastructure", emoji: "🏗️", description: "Smart housing and infrastructure solutions" },
      { key: "ai", name: "🤖 AI, Logic & Grid", emoji: "🤖", description: "Artificial intelligence and logic systems" },
    ];

    const createdSectors = new Map();

    // Insert sectors from comprehensive brand data
    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_BRAND_DATA)) {
      const mapping = sectorMappings.find(m => sectorKey.toLowerCase().includes(m.key)) || 
                     { key: sectorKey, name: sectorData.name, emoji: "🔧", description: `${sectorData.name} solutions` };
      
      const [sector] = await db.insert(sectors).values({
        name: mapping.name,
        emoji: mapping.emoji,
        description: mapping.description,
        brandCount: sectorData.brands.length,
        subnodeCount: sectorData.nodes.length
      }).returning();

      createdSectors.set(sectorKey, sector);
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