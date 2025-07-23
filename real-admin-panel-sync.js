// REAL ADMIN PANEL SYNC - Extract ALL authentic data from HTML file
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import ws from "ws";
import fs from 'fs';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors } });

// Read the HTML file and extract ALL authentic brand data
function extractAuthenticData() {
  const htmlContent = fs.readFileSync('attached_assets/Pasted--Global-Data-Definitions-const-sectorList-agriculture-Agr-1753226176038_1753226176040.txt', 'utf8');
  
  // Extract all brand arrays
  const brandArrays = {};
  const subnodeArrays = {};
  
  // Match all brand arrays
  const brandMatches = htmlContent.match(/const (\w+)Brands = \[(.*?)\];/gs);
  if (brandMatches) {
    brandMatches.forEach(match => {
      const arrayMatch = match.match(/const (\w+)Brands = \[(.*?)\];/s);
      if (arrayMatch) {
        const sectorKey = arrayMatch[1];
        const brandList = arrayMatch[2]
          .split("','")
          .map(b => b.replace(/['"]/g, '').trim())
          .filter(b => b.length > 0);
        brandArrays[sectorKey] = brandList;
      }
    });
  }
  
  // Match all subnode arrays
  const subnodeMatches = htmlContent.match(/const (\w+)SubNodes = \[(.*?)\];/gs);
  if (subnodeMatches) {
    subnodeMatches.forEach(match => {
      const arrayMatch = match.match(/const (\w+)SubNodes = \[(.*?)\];/s);
      if (arrayMatch) {
        const sectorKey = arrayMatch[1];
        const subnodeData = arrayMatch[2];
        // Parse nested arrays
        const subnodeArrayMatch = subnodeData.match(/\[([^\]]*)\]/g);
        if (subnodeArrayMatch) {
          subnodeArrays[sectorKey] = subnodeArrayMatch.map(arr => 
            arr.replace(/[\[\]]/g, '')
              .split("','")
              .map(s => s.replace(/['"]/g, '').trim())
              .filter(s => s.length > 0)
          );
        }
      }
    });
  }

  return { brandArrays, subnodeArrays };
}

// Map sector keys to database names
const SECTOR_MAPPING = {
  'banking': '🏦 Banking & Finance',
  'agri': '🌱 Agriculture & Biotech',
  'creative': '🖋️ Creative Tech',
  'logistics': '📦 Logistics & Packaging',
  'fsf': '🥦 Food, Soil & Farming',
  'educationIp': '📚 Education & IP',
  'educationYouth': '🎓 Education & Youth',
  'webless': '📡 Webless Tech & Nodes',
  'health': '🧠 Health & Hygiene',
  'housing': '🏗️ Housing & Infrastructure',
  'media': '🎬 Motion, Media & Sonic',
  'fashion': '✂ Fashion & Identity',
  'gaming': '🎮 Gaming & Simulation',
  'knowledge': '📖 Knowledge & Archives',
  'micromesh': '☰ Micro-Mesh Logistics',
  'nutrition': '✿ Nutrition & Food Chain',
  'ailogic': '🧠 AI, Logic & Grid',
  'packaging': '📦 Packaging & Materials',
  'quantum': '✴️ Quantum Protocols',
  'ritual': '☯ Ritual & Culture',
  'saas': '🔑 SaaS & Licensing',
  'trade': '🧺 Trade Systems',
  'utilities': '🔋 Utilities & Energy',
  'voice': '🎙️ Voice & Audio',
  'nft': '🔁 NFT & Ownership',
  'zerowaste': '♻️ Zero Waste',
  'professional': '🧾 Professional Services',
  'payrollmining': '🪙 Payroll Mining & Accounting',
  'mining': '⛏️ Mining & Resources',
  'wildlife': '🦁 Wildlife & Habitat',
  'adminpanel': '⚙️ Admin Panel',
  'globalindex': '🌐 Global Brand Index'
};

async function syncRealAdminPanel() {
  console.log('🔥 SYNCING WITH REAL ADMIN PANEL HTML DATA');
  
  try {
    // Extract authentic data from HTML
    const { brandArrays, subnodeArrays } = extractAuthenticData();
    console.log(`📊 Found ${Object.keys(brandArrays).length} brand arrays`);
    console.log(`📊 Found ${Object.keys(subnodeArrays).length} subnode arrays`);
    
    // Get sector mapping
    const allSectors = await db.select().from(sectors);
    const sectorMap = {};
    allSectors.forEach(s => sectorMap[s.name] = s.id);

    // Clear ALL existing brands
    await db.delete(brands);
    console.log('🗑️ CLEARED ALL EXISTING BRANDS');

    let totalCore = 0;
    let totalSubs = 0;

    // Process each sector
    for (const [sectorKey, brandList] of Object.entries(brandArrays)) {
      const sectorName = SECTOR_MAPPING[sectorKey];
      const sectorId = sectorName ? sectorMap[sectorName] : null;
      
      if (!sectorId) {
        console.log(`⚠️ Sector not found: ${sectorKey} -> ${sectorName}`);
        continue;
      }

      console.log(`✅ ${sectorName}: ${brandList.length} authentic brands`);

      // Create each authentic brand
      for (let i = 0; i < brandList.length; i++) {
        const brandName = brandList[i];
        if (!brandName || brandName.length < 2) continue;

        const brand = await db.insert(brands).values({
          name: brandName + (brandName.includes('™') ? '' : '™'),
          description: `Authentic ${brandName} from admin panel HTML data for ${sectorName}`,
          sectorId,
          integration: 'VaultMesh™',
          status: 'active',
          isCore: true,
          metadata: {
            authentic: true,
            htmlSource: true,
            sectorKey,
            pricing: 149.99
          }
        }).returning();

        totalCore++;

        // Add authentic subnodes if available
        const subnodes = subnodeArrays[sectorKey];
        if (subnodes && subnodes[i]) {
          for (const subnodeName of subnodes[i]) {
            if (!subnodeName || subnodeName.length < 2) continue;
            
            await db.insert(brands).values({
              name: subnodeName + (subnodeName.includes('™') ? '' : '™'),
              description: `Authentic ${subnodeName} subnode from admin panel HTML data`,
              sectorId,
              parentId: brand[0].id,
              integration: 'HotStack',
              status: 'active',
              isCore: false,
              metadata: {
                authentic: true,
                htmlSource: true,
                parentBrand: brandName,
                pricing: 79.99
              }
            });
            totalSubs++;
          }
        }
      }
    }

    // Update sector counts
    const finalBrands = await db.select().from(brands);
    const sectorCounts = {};
    
    for (const brand of finalBrands) {
      if (!brand.parentId) {
        if (!sectorCounts[brand.sectorId]) {
          sectorCounts[brand.sectorId] = { core: 0, subnodes: 0 };
        }
        sectorCounts[brand.sectorId].core++;
      } else {
        if (!sectorCounts[brand.sectorId]) {
          sectorCounts[brand.sectorId] = { core: 0, subnodes: 0 };
        }
        sectorCounts[brand.sectorId].subnodes++;
      }
    }

    for (const [sectorId, counts] of Object.entries(sectorCounts)) {
      await db.update(sectors)
        .set({ 
          brandCount: counts.core,
          subnodeCount: counts.subnodes 
        })
        .where(eq(sectors.id, parseInt(sectorId)));
    }

    console.log('🎉 REAL ADMIN PANEL SYNC COMPLETED!');
    console.log(`✅ Authentic Core: ${totalCore}`);
    console.log(`✅ Authentic Subnodes: ${totalSubs}`);
    console.log(`✅ Total: ${totalCore + totalSubs}`);
    console.log('🚫 NO MORE GENERIC NAMES!');
    console.log('✅ ALL BRANDS FROM REAL HTML ADMIN PANEL!');

  } catch (error) {
    console.error('❌ Admin panel sync failed:', error);
    throw error;
  }
}

syncRealAdminPanel().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });