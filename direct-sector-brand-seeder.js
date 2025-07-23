// Direct Sector Brand Seeder - Use sector IDs to populate missing brands
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors } });

// Brand templates for different sector types
const brandTemplates = {
  creative: ["CreativeForge™", "DesignCore™", "ArtFlow™", "StudioSync™", "CreativeVault™"],
  tech: ["TechForge™", "CodeCore™", "DevFlow™", "TechSync™", "TechVault™"],
  business: ["BizForge™", "ProCore™", "BusinessFlow™", "EnterpriseSync™", "BizVault™"],
  education: ["EduForge™", "LearnCore™", "StudyFlow™", "EduSync™", "KnowledgeVault™"],
  health: ["HealthForge™", "MedCore™", "WellnessFlow™", "HealthSync™", "CareVault™"],
  media: ["MediaForge™", "ContentCore™", "MediaFlow™", "StreamSync™", "MediaVault™"],
  finance: ["FinanceForge™", "MoneyCore™", "FinFlow™", "FinanceSync™", "WealthVault™"],
  energy: ["EnergyForge™", "PowerCore™", "EnergyFlow™", "GridSync™", "PowerVault™"],
  logistics: ["LogiForge™", "ShipCore™", "FlowMaster™", "LogiSync™", "CargoVault™"],
  admin: ["AdminForge™", "ControlCore™", "ManageFlow™", "AdminSync™", "ControlVault™"]
};

// Function to get brands based on sector keywords
function getBrandsForSector(sectorName) {
  const name = sectorName.toLowerCase();
  
  if (name.includes('creative') || name.includes('design') || name.includes('art') || name.includes('fashion')) {
    return brandTemplates.creative;
  } else if (name.includes('tech') || name.includes('ai') || name.includes('quantum') || name.includes('webless')) {
    return brandTemplates.tech;
  } else if (name.includes('business') || name.includes('professional') || name.includes('enterprise')) {
    return brandTemplates.business;
  } else if (name.includes('education') || name.includes('youth') || name.includes('knowledge') || name.includes('learning')) {
    return brandTemplates.education;
  } else if (name.includes('health') || name.includes('medical') || name.includes('wellness') || name.includes('hygiene')) {
    return brandTemplates.health;
  } else if (name.includes('media') || name.includes('content') || name.includes('music') || name.includes('voice') || name.includes('audio') || name.includes('sonic')) {
    return brandTemplates.media;
  } else if (name.includes('finance') || name.includes('banking') || name.includes('payroll') || name.includes('money')) {
    return brandTemplates.finance;
  } else if (name.includes('energy') || name.includes('utilities') || name.includes('power')) {
    return brandTemplates.energy;
  } else if (name.includes('logistics') || name.includes('shipping') || name.includes('packaging') || name.includes('operations')) {
    return brandTemplates.logistics;
  } else if (name.includes('admin') || name.includes('management') || name.includes('control')) {
    return brandTemplates.admin;
  }
  
  // Default generic brands
  return ["GenericForge™", "CoreSystem™", "FlowMaster™", "SyncHub™", "DataVault™"];
}

async function seedAllMissingBrands() {
  console.log('🌱 Starting direct sector brand seeding...');

  try {
    // Get all sectors
    const allSectors = await db.select().from(sectors);
    console.log(`📊 Found ${allSectors.length} sectors to process`);

    for (const sector of allSectors) {
      // Check if sector has any brands
      const existingBrands = await db.select().from(brands)
        .where(eq(brands.sectorId, sector.id));

      if (existingBrands.length > 0) {
        console.log(`✅ Sector "${sector.name}" (ID: ${sector.id}) already has ${existingBrands.length} brands, skipping...`);
        continue;
      }

      console.log(`🏗️  Creating brands for sector: "${sector.name}" (ID: ${sector.id})`);

      // Get appropriate brands for this sector
      const brandNames = getBrandsForSector(sector.name);
      
      // Create core brands
      const corebrands = [];
      for (let i = 0; i < brandNames.length; i++) {
        const brandName = brandNames[i];
        
        const newBrand = await db.insert(brands).values({
          name: brandName,
          description: `Advanced ${brandName} management system for ${sector.name} sector with comprehensive VaultMesh™ integration.`,
          sectorId: sector.id,
          integration: 'VaultMesh™',
          status: 'active',
          isCore: true,
          metadata: {
            category: sector.name,
            features: [`${brandName} Core`, `${brandName} Analytics`, `${brandName} Security`],
            integrations: ['VaultMesh™', 'SecureSign™', 'PulseTrade™'],
            tier: i < 2 ? 'A+' : i < 4 ? 'A' : 'B+',
            pricing: i < 2 ? 199.99 : i < 4 ? 149.99 : 99.99
          }
        }).returning();

        corebrands.push(newBrand[0]);
      }

      // Create 2-3 subnodes for each core brand
      for (const coreBrand of corebrands) {
        const subnodeCount = Math.floor(Math.random() * 2) + 2; // 2-3 subnodes
        for (let j = 0; j < subnodeCount; j++) {
          await db.insert(brands).values({
            name: `${coreBrand.name.replace('™', '')} Node ${j + 1}™`,
            description: `Specialized ${coreBrand.name} subnode for enhanced operations.`,
            sectorId: sector.id,
            parentId: coreBrand.id,
            integration: 'HotStack',
            status: 'active',
            isCore: false,
            metadata: {
              category: `${sector.name} - Subnode`,
              parentBrand: coreBrand.name,
              nodeType: 'processing',
              tier: 'B',
              pricing: 49.99
            }
          });
        }
      }

      // Update sector brand count
      const allBrands = await db.select().from(brands)
        .where(eq(brands.sectorId, sector.id));
      
      const coreCount = allBrands.filter(b => !b.parentId).length;
      const subnodeCount = allBrands.filter(b => b.parentId).length;
      
      await db.update(sectors)
        .set({ 
          brandCount: coreCount,
          subnodeCount: subnodeCount 
        })
        .where(eq(sectors.id, sector.id));

      console.log(`✅ Created ${coreCount} core brands + ${subnodeCount} subnodes for "${sector.name}"`);
    }

    console.log('🎉 Direct sector brand seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during direct seeding:', error);
    throw error;
  }
}

// Run the seeder
seedAllMissingBrands()
  .then(() => {
    console.log('🚀 Direct seeding process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Direct seeding failed:', error);
    process.exit(1);
  });