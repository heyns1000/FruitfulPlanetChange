// Real Admin Panel Sync - Use ONLY authentic data from admin_panel_brands
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

async function syncRealAdminPanelData() {
  console.log('🔄 Syncing REAL Admin Panel Data (no fake multiplication)...');

  try {
    // Get all authentic admin panel brands
    const adminBrands = await db.select().from(adminPanelBrands);
    console.log(`📊 Found ${adminBrands.length} authentic admin panel brands`);
    
    // Get sectors mapping
    const allSectors = await db.select().from(sectors);
    const sectorMap = {};
    allSectors.forEach(sector => {
      // Remove emoji and clean sector name for matching
      const cleanName = sector.name.replace(/^[🌱🏦📦🧾🔑🔁⛏️🖋️♻️🎪🎬🌟🤝🪙🌐⚙️🦁🥦🔋✂📡🧠🎮📚🏗️⚖📖☰🎙️✿✴️☯🧺🧭👥💡🔧🎯🔮🛡️⚗️🎨🎵🔬💰🌍📱💎🎪🕺]\s*/g, '').trim();
      sectorMap[cleanName] = sector.id;
      sectorMap[sector.name] = sector.id;
      
      // Add specific mappings for known mismatches
      if (cleanName.includes('Motion')) sectorMap['Motion, Media & Sonic'] = sector.id;
      if (cleanName.includes('Food')) sectorMap['Food, Soil & Farming'] = sector.id;
      if (cleanName.includes('Banking')) sectorMap['Banking & Finance'] = sector.id;
      if (cleanName.includes('Logistics')) sectorMap['Logistics & Packaging'] = sector.id;
      if (cleanName.includes('Agriculture')) sectorMap['Agriculture & Biotech'] = sector.id;
      if (cleanName.includes('Health')) sectorMap['Health & Hygiene'] = sector.id;
      if (cleanName.includes('Education')) sectorMap['Education & IP'] = sector.id;
      if (cleanName.includes('Creative')) sectorMap['Creative Tech'] = sector.id;
    });

    console.log('🗺️  Sector mapping completed');

    // Clear brands table and start fresh with real data
    await db.delete(brands);
    console.log('🗑️  Cleared existing brands table');

    let totalSynced = 0;
    const sectorCounts = {};

    // Sync each admin panel brand directly
    for (const adminBrand of adminBrands) {
      const sectorId = sectorMap[adminBrand.sectorName];
      
      if (!sectorId) {
        console.log(`⚠️  No sector found for: "${adminBrand.sectorName}", skipping...`);
        continue;
      }

      try {
        // Extract pricing from metadata if available
        let pricing = 79.99; // default
        if (adminBrand.metadata && typeof adminBrand.metadata === 'object') {
          const pricingStr = adminBrand.metadata.pricing || '';
          const priceMatch = pricingStr.match(/\$(\d+)/);
          if (priceMatch) {
            pricing = parseFloat(priceMatch[1]);
          }
        }

        // Insert the authentic brand
        await db.insert(brands).values({
          name: adminBrand.brandName,
          description: `Authentic ${adminBrand.brandName} from admin panel for ${adminBrand.sectorName} sector with comprehensive operational capabilities.`,
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
            sectorKey: adminBrand.sectorKey
          }
        });

        totalSynced++;
        
        // Count by sector
        if (!sectorCounts[adminBrand.sectorName]) {
          sectorCounts[adminBrand.sectorName] = 0;
        }
        sectorCounts[adminBrand.sectorName]++;

      } catch (error) {
        console.log(`⚠️  Error syncing brand ${adminBrand.brandName}:`, error.message);
      }
    }

    // Update sector brand counts with real data
    for (const [sectorName, count] of Object.entries(sectorCounts)) {
      const sectorId = sectorMap[sectorName];
      if (sectorId) {
        await db.update(sectors)
          .set({ brandCount: count, subnodeCount: 0 })
          .where(eq(sectors.id, sectorId));
        
        console.log(`✅ ${sectorName}: ${count} authentic brands`);
      }
    }

    console.log('🎉 REAL ADMIN PANEL SYNC COMPLETE!');
    console.log(`📊 Total authentic brands synced: ${totalSynced}`);
    console.log(`📊 Sectors with data: ${Object.keys(sectorCounts).length}`);
    
  } catch (error) {
    console.error('❌ Error during real admin panel sync:', error);
    throw error;
  }
}

// Run the sync
syncRealAdminPanelData()
  .then(() => {
    console.log('🚀 REAL ADMIN PANEL SYNC COMPLETED!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Real sync failed:', error);
    process.exit(1);
  });