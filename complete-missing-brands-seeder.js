// Complete Missing Brands Seeder - Map all 817 admin panel brands correctly
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors, adminPanelBrands } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors, adminPanelBrands } });

// Exact sector mapping from admin panel to sectors table
const SECTOR_MAPPING = {
  'AI, Logic & Grid': '🧠 AI, Logic & Grid',
  'Packaging & Materials': '📦 Packaging & Materials',
  'Quantum Protocols': '✴️ Quantum Protocols',
  'SaaS & Licensing': '🔑 SaaS & Licensing',
  'Trade Systems': '🧺 Trade Systems',
  'Utilities & Energy': '🔋 Utilities & Energy',
  'Voice & Audio': '🎙️ Voice & Audio',
  'Housing & Infrastructure': '🏗️ Housing & Infrastructure',
  'Knowledge & Archives': '📖 Knowledge & Archives',
  'Webless Tech & Nodes': '📡 Webless Tech & Nodes',
  'Gaming & Simulation': '🎮 Gaming & Simulation',
  'Education & Youth': '🎓 Education & Youth',
  'Motion, Media & Sonic': '🎬 Motion, Media & Sonic',
  'Logistics & Packaging': '📦 Logistics & Packaging',
  'Banking & Finance': '🏦 Banking & Finance',
  'Agriculture & Biotech': '🌱 Agriculture & Biotech',
  'Food, Soil & Farming': '🥦 Food, Soil & Farming',
  'Education & IP': '📚 Education & IP',
  'Creative Tech': '🖋️ Creative Tech',
  'Health & Hygiene': '🧠 Health & Hygiene',
  'Justice & Ethics': '⚖ Justice & Ethics',
  'Micro-Mesh Logistics': '☰ Micro-Mesh Logistics',
  'Fashion & Identity': '✂ Fashion & Identity',
  'Nutrition & Food Chain': '✿ Nutrition & Food Chain',
  'Ritual & Culture': '☯ Ritual & Culture',
  'NFT & Ownership': '🔁 NFT & Ownership',
  'Zero Waste': '♻️ Zero Waste',
  'Professional Services': '🧾 Professional Services',
  'Payroll Mining & Accounting': '🪙 Payroll Mining & Accounting',
  'Mining & Resources': '⛏️ Mining & Resources',
  'Wildlife & Habitat': '🦁 Wildlife & Habitat'
};

async function seedMissingBrands() {
  console.log('🔄 Seeding ALL missing admin panel brands...');

  try {
    // Get all admin panel brands
    const adminBrands = await db.select().from(adminPanelBrands);
    console.log(`📊 Found ${adminBrands.length} admin panel brands`);
    
    // Get all sectors
    const allSectors = await db.select().from(sectors);
    const sectorIdMap = {};
    allSectors.forEach(sector => {
      sectorIdMap[sector.name] = sector.id;
    });

    console.log('🗺️  Sector mapping ready');

    // Get existing brands to avoid duplicates
    const existingBrands = await db.select().from(brands);
    const existingBrandNames = new Set(existingBrands.map(b => b.name));
    
    let totalSeeded = 0;
    let skippedCount = 0;

    for (const adminBrand of adminBrands) {
      // Skip if brand already exists
      if (existingBrandNames.has(adminBrand.brandName)) {
        skippedCount++;
        continue;
      }

      // Map sector name
      const mappedSectorName = SECTOR_MAPPING[adminBrand.sectorName] || adminBrand.sectorName;
      const sectorId = sectorIdMap[mappedSectorName];
      
      if (!sectorId) {
        console.log(`⚠️  No sector mapping for: "${adminBrand.sectorName}" -> "${mappedSectorName}"`);
        continue;
      }

      try {
        // Extract pricing from metadata
        let pricing = 79.99;
        if (adminBrand.metadata && typeof adminBrand.metadata === 'object') {
          const pricingStr = adminBrand.metadata.pricing || '';
          const priceMatch = pricingStr.match(/\$(\d+)/);
          if (priceMatch) {
            pricing = parseFloat(priceMatch[1]);
          }
        }

        // Insert the brand
        await db.insert(brands).values({
          name: adminBrand.brandName,
          description: `Authentic ${adminBrand.brandName} from admin panel for ${adminBrand.sectorName} sector with comprehensive VaultMesh™ integration and operational excellence.`,
          sectorId: sectorId,
          integration: adminBrand.isCore ? 'VaultMesh™' : 'HotStack',
          status: adminBrand.status || 'active',
          isCore: adminBrand.isCore || false,
          metadata: {
            category: adminBrand.sectorName,
            tier: adminBrand.metadata?.tier || 'B+',
            subNodes: adminBrand.subNodes || [],
            originalAdminId: adminBrand.id,
            authentic: true,
            pricing: pricing,
            sectorKey: adminBrand.sectorKey,
            mappedSector: mappedSectorName
          }
        });

        totalSeeded++;
        existingBrandNames.add(adminBrand.brandName);

      } catch (error) {
        console.log(`⚠️  Error seeding ${adminBrand.brandName}:`, error.message);
      }
    }

    // Update sector brand counts
    const sectorCounts = {};
    const allBrands = await db.select().from(brands);
    
    for (const brand of allBrands) {
      if (!brand.parentId) { // Only count core brands
        if (!sectorCounts[brand.sectorId]) {
          sectorCounts[brand.sectorId] = 0;
        }
        sectorCounts[brand.sectorId]++;
      }
    }

    for (const [sectorId, count] of Object.entries(sectorCounts)) {
      await db.update(sectors)
        .set({ brandCount: count })
        .where(eq(sectors.id, parseInt(sectorId)));
    }

    // Final count
    const finalBrands = await db.select().from(brands);
    const finalCoreCount = finalBrands.filter(b => !b.parentId).length;
    const finalTotal = finalBrands.length;

    console.log('🎉 MISSING BRANDS SEEDING COMPLETE!');
    console.log(`📊 Brands seeded this run: ${totalSeeded}`);
    console.log(`📊 Brands skipped (existing): ${skippedCount}`);
    console.log(`📊 Total core brands in database: ${finalCoreCount}`);
    console.log(`📊 Total brands in database: ${finalTotal}`);
    
  } catch (error) {
    console.error('❌ Error during missing brands seeding:', error);
    throw error;
  }
}

// Run the seeder
seedMissingBrands()
  .then(() => {
    console.log('🚀 MISSING BRANDS SEEDING COMPLETED!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });