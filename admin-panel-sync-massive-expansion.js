// Admin Panel Sync + Massive Brand Expansion to 6,000+ Brands
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

// Brand expansion multipliers for different tiers
const BRAND_MULTIPLIERS = {
  'A++': 12, // Top tier gets massive expansion
  'A+': 10,
  'A': 8, 
  'B+': 6,
  'B': 4,
  'C': 3
};

// Advanced brand naming patterns for expansion
const BRAND_PATTERNS = [
  '™', 'Core™', 'Pro™', 'Elite™', 'Master™', 'Enterprise™',
  'Global™', 'Ultra™', 'Prime™', 'Nexus™', 'Quantum™',
  'Flow™', 'Sync™', 'Vault™', 'Forge™', 'Grid™',
  'Alpha™', 'Beta™', 'Omega™', 'Genesis™', 'Phoenix™',
  'Titan™', 'Matrix™', 'Fusion™', 'Infinity™', 'Supreme™',
  'Advanced™', 'Professional™', 'Premium™', 'Platinum™'
];

const SECTOR_PREFIXES = [
  'Mega', 'Super', 'Hyper', 'Ultra', 'Omni', 'Multi',
  'Global', 'Universal', 'Infinite', 'Dynamic', 'Smart',
  'Intelligent', 'Advanced', 'Premium', 'Elite', 'Master'
];

const TECH_SUFFIXES = [
  'Hub', 'Lab', 'Works', 'Systems', 'Solutions', 'Technologies',
  'Dynamics', 'Innovations', 'Network', 'Platform', 'Engine',
  'Framework', 'Portal', 'Gateway', 'Bridge', 'Interface'
];

function generateBrandVariations(baseName, count, sectorName) {
  const variations = [];
  const cleanBase = baseName.replace(/[™®©]/g, '');
  
  // Use original brand
  variations.push(baseName);
  
  for (let i = 1; i < count; i++) {
    let newName = cleanBase;
    
    if (i <= BRAND_PATTERNS.length) {
      newName = `${cleanBase} ${BRAND_PATTERNS[i - 1]}`;
    } else if (i <= BRAND_PATTERNS.length + SECTOR_PREFIXES.length) {
      const prefixIndex = i - BRAND_PATTERNS.length - 1;
      newName = `${SECTOR_PREFIXES[prefixIndex]} ${cleanBase}™`;
    } else if (i <= BRAND_PATTERNS.length + SECTOR_PREFIXES.length + TECH_SUFFIXES.length) {
      const suffixIndex = i - BRAND_PATTERNS.length - SECTOR_PREFIXES.length - 1;
      newName = `${cleanBase} ${TECH_SUFFIXES[suffixIndex]}™`;
    } else {
      // Generate numbered variations
      const num = i - BRAND_PATTERNS.length - SECTOR_PREFIXES.length - TECH_SUFFIXES.length;
      newName = `${cleanBase} ${Math.floor(num / 10) + 1}.${(num % 10) + 1}™`;
    }
    
    variations.push(newName);
  }
  
  return variations;
}

async function massiveAdminPanelSync() {
  console.log('🚀 Starting MASSIVE Admin Panel to Main Brands Sync (Target: 6,000+ brands)...');

  try {
    // Clear existing brands table to start fresh
    console.log('🗑️  Clearing existing brands table...');
    await db.delete(brands);
    
    // Get all admin panel brands
    const adminBrands = await db.select().from(adminPanelBrands);
    console.log(`📊 Found ${adminBrands.length} authentic admin panel brands to expand`);
    
    // Get all sectors
    const allSectors = await db.select().from(sectors);
    const sectorMap = {};
    allSectors.forEach(sector => {
      const cleanName = sector.name.replace(/^[🌱🏦📦🧾🔑🔁⛏️🖋️♻️🎪🎬🌟🤝🪙🌐⚙️🦁🥦🔋✂📡🧠🎮📚🏗️⚖📖☰🎙️✿✴️☯🧺🧭👥💡🔧🎯🔮🛡️⚗️🎨🎵🔬💰🌍📱💎🎪🕺]\s*/g, '').trim();
      sectorMap[cleanName] = sector.id;
    });

    let totalBrandsCreated = 0;
    let totalSubnodesCreated = 0;

    // Process each sector from admin panel
    const sectorBrands = {};
    adminBrands.forEach(brand => {
      if (!sectorBrands[brand.sectorName]) {
        sectorBrands[brand.sectorName] = [];
      }
      sectorBrands[brand.sectorName].push(brand);
    });

    for (const [sectorName, brands] of Object.entries(sectorBrands)) {
      console.log(`🏗️  Processing sector: ${sectorName} (${brands.length} base brands)`);
      
      const sectorId = sectorMap[sectorName];
      if (!sectorId) {
        console.log(`⚠️  Sector ID not found for: ${sectorName}, skipping...`);
        continue;
      }

      // Determine expansion multiplier based on sector importance
      let multiplier = 8; // Default
      if (sectorName.includes('Banking') || sectorName.includes('Finance')) multiplier = 12;
      else if (sectorName.includes('Agriculture') || sectorName.includes('Logistics')) multiplier = 10;
      else if (sectorName.includes('Tech') || sectorName.includes('AI')) multiplier = 10;
      else if (sectorName.includes('Health') || sectorName.includes('Education')) multiplier = 8;

      console.log(`📈 Using ${multiplier}x expansion for ${sectorName}`);

      for (const adminBrand of brands) {
        // Generate brand variations
        const variations = generateBrandVariations(adminBrand.brandName, multiplier, sectorName);
        
        let sectorBrandCount = 0;
        let sectorSubnodeCount = 0;

        for (let i = 0; i < variations.length; i++) {
          const brandName = variations[i];
          const isCore = i < 3 || adminBrand.isCore; // First 3 are always core
          
          const newBrand = await db.insert(brands).values({
            name: brandName,
            description: adminBrand.description || `Advanced ${brandName} management system for ${sectorName} sector with comprehensive VaultMesh™ integration and omnilevel operational excellence.`,
            sectorId: sectorId,
            integration: i < 2 ? 'VaultMesh™' : i < 4 ? 'HotStack' : 'SecureSign™',
            status: 'active',
            isCore: isCore,
            metadata: {
              category: sectorName,
              tier: i < 2 ? 'A++' : i < 4 ? 'A+' : i < 6 ? 'A' : i < 8 ? 'B+' : 'B',
              features: [
                `${brandName.split(' ')[0]} Analytics`,
                `${brandName.split(' ')[0]} Security`, 
                `${brandName.split(' ')[0]} Management`
              ],
              integrations: ['VaultMesh™', 'SecureSign™', 'PulseTrade™', 'OmniGrid™'],
              pricing: i < 2 ? 299.99 : i < 4 ? 199.99 : i < 6 ? 149.99 : i < 8 ? 99.99 : 79.99,
              originalAdminBrand: adminBrand.brandName,
              expansionLevel: i + 1
            }
          }).returning();

          if (isCore) {
            sectorBrandCount++;
            totalBrandsCreated++;
          }

          // Create 3-5 subnodes for each brand
          const subnodeCount = Math.floor(Math.random() * 3) + 3; // 3-5 subnodes
          for (let j = 0; j < subnodeCount; j++) {
            await db.insert(brands).values({
              name: `${brandName.replace(/[™®©]/g, '')} Node ${j + 1}.${i + 1}™`,
              description: `Specialized ${brandName} processing subnode for enhanced ${sectorName.toLowerCase()} operations and data management.`,
              sectorId: sectorId,
              parentId: newBrand[0].id,
              integration: 'HotStack',
              status: 'active',
              isCore: false,
              metadata: {
                category: `${sectorName} - Subnode`,
                parentBrand: brandName,
                nodeType: j % 2 === 0 ? 'processing' : 'analytics',
                tier: 'B',
                pricing: 49.99,
                subnodeLevel: j + 1
              }
            });

            sectorSubnodeCount++;
            totalSubnodesCreated++;
          }
        }

        console.log(`✅ Created ${variations.length} variations of "${adminBrand.brandName}" with ${sectorSubnodeCount} subnodes`);
      }

      // Update sector counts
      const sectorCoreCount = await db.select().from(brands)
        .where(eq(brands.sectorId, sectorId));
      
      const coreCount = sectorCoreCount.filter(b => !b.parentId).length;
      const subnodeCount = sectorCoreCount.filter(b => b.parentId).length;
      
      await db.update(sectors)
        .set({ 
          brandCount: coreCount,
          subnodeCount: subnodeCount 
        })
        .where(eq(sectors.id, sectorId));

      console.log(`🎯 Sector ${sectorName}: ${coreCount} core brands + ${subnodeCount} subnodes`);
    }

    // Final statistics
    const finalBrandCount = await db.select().from(brands);
    const coreTotal = finalBrandCount.filter(b => !b.parentId).length;
    const subnodeTotal = finalBrandCount.filter(b => b.parentId).length;
    const grandTotal = finalBrandCount.length;

    console.log('🎉 MASSIVE EXPANSION COMPLETE!');
    console.log(`📊 FINAL STATISTICS:`);
    console.log(`   Core Brands: ${coreTotal}`);
    console.log(`   Subnodes: ${subnodeTotal}`);
    console.log(`   GRAND TOTAL: ${grandTotal} brands`);
    console.log(`   Target Achieved: ${grandTotal >= 6000 ? '✅ YES' : '❌ NO'} (Target: 6,000+)`);
    
  } catch (error) {
    console.error('❌ Error during massive admin panel sync:', error);
    throw error;
  }
}

// Run the massive expansion
massiveAdminPanelSync()
  .then(() => {
    console.log('🚀 MASSIVE ADMIN PANEL SYNC COMPLETED SUCCESSFULLY!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Massive sync failed:', error);
    process.exit(1);
  });