// MISSING BRANDS RECONCILER - Only add what's missing from HTML data
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors } from './shared/schema.ts';
import { eq, and } from 'drizzle-orm';
import ws from "ws";
import fs from 'fs';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors } });

// Extract all authentic brand data from HTML file
function extractAllAuthenticBrands() {
  const htmlContent = fs.readFileSync('attached_assets/Pasted--Global-Data-Definitions-const-sectorList-agriculture-Agr-1753226176038_1753226176040.txt', 'utf8');
  
  const sectorBrands = {};
  const sectorSubnodes = {};
  
  // Extract all brand arrays with better regex
  const brandMatches = htmlContent.match(/const (\w+)Brands = \[(.*?)\];/gs);
  if (brandMatches) {
    brandMatches.forEach(match => {
      const arrayMatch = match.match(/const (\w+)Brands = \[(.*?)\];/s);
      if (arrayMatch) {
        const sectorKey = arrayMatch[1];
        let brandString = arrayMatch[2];
        
        // Clean and parse brand list
        const brandList = brandString
          .replace(/'/g, '')
          .split(',')
          .map(b => b.trim())
          .filter(b => b.length > 2 && !b.includes('...'));
        
        sectorBrands[sectorKey] = brandList;
      }
    });
  }
  
  // Extract all subnode arrays
  const subnodeMatches = htmlContent.match(/const (\w+)SubNodes = \[(.*?)\];/gs);
  if (subnodeMatches) {
    subnodeMatches.forEach(match => {
      const arrayMatch = match.match(/const (\w+)SubNodes = \[(.*?)\];/s);
      if (arrayMatch) {
        const sectorKey = arrayMatch[1];
        const subnodeString = arrayMatch[2];
        
        // Parse nested subnode arrays
        const subnodeArrays = [];
        const nestedMatches = subnodeString.match(/\[([^\]]*)\]/g);
        if (nestedMatches) {
          nestedMatches.forEach(nestedMatch => {
            const cleanMatch = nestedMatch.replace(/[\[\]']/g, '');
            const subnodes = cleanMatch.split(',').map(s => s.trim()).filter(s => s.length > 1);
            if (subnodes.length > 0) {
              subnodeArrays.push(subnodes);
            }
          });
        }
        sectorSubnodes[sectorKey] = subnodeArrays;
      }
    });
  }
  
  return { sectorBrands, sectorSubnodes };
}

// Sector mapping
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
  'justice': '⚖ Justice & Ethics',
  'knowledge': '📖 Knowledge & Archives',
  'micromesh': '☰ Micro-Mesh Logistics',
  'nutrition': '✿ Nutrition & Food Chain',
  'packaging': '📦 Packaging & Materials',
  'quantum': '✴️ Quantum Protocols',
  'ritualCulture': '☯ Ritual & Culture',
  'foodChain': '✿ Nutrition & Food Chain',
  'zeroWaste': '♻️ Zero Waste',
  'mining': '⛏️ Mining & Resources',
  'saasLicensing': '🔑 SaaS & Licensing',
  'nftOwnership': '🔁 NFT & Ownership',
  'trade': '🧺 Trade Systems',
  'utilities': '🔋 Utilities & Energy',
  'voice': '🎙️ Voice & Audio',
  'payrollMining': '🪙 Payroll Mining & Accounting',
  'wildlife': '🦁 Wildlife & Habitat',
  'professional': '🧾 Professional Services',
  'ailogic': '🧠 AI, Logic & Grid'
};

async function reconcileMissingBrands() {
  console.log('🔍 RECONCILING MISSING BRANDS FROM HTML DATA');
  
  try {
    // Extract authentic data
    const { sectorBrands, sectorSubnodes } = extractAllAuthenticBrands();
    console.log(`📊 Found ${Object.keys(sectorBrands).length} sectors in HTML`);
    
    // Get current database state
    const existingBrands = await db.select().from(brands);
    const existingBrandNames = new Set(existingBrands.map(b => b.name.replace('™', '')));
    
    const allSectors = await db.select().from(sectors);
    const sectorMap = {};
    allSectors.forEach(s => sectorMap[s.name] = s.id);
    
    let addedCore = 0;
    let addedSubs = 0;
    let skippedExisting = 0;
    
    // Process each sector from HTML
    for (const [sectorKey, brandList] of Object.entries(sectorBrands)) {
      const sectorName = SECTOR_MAPPING[sectorKey];
      const sectorId = sectorName ? sectorMap[sectorName] : null;
      
      if (!sectorId) {
        console.log(`⚠️ Sector mapping missing: ${sectorKey}`);
        continue;
      }
      
      console.log(`🔍 Checking ${sectorName}: ${brandList.length} brands from HTML`);
      
      // Add missing core brands
      for (let i = 0; i < brandList.length; i++) {
        const brandName = brandList[i];
        if (!brandName || brandName.length < 2) continue;
        
        const cleanBrandName = brandName.replace('™', '');
        
        if (existingBrandNames.has(cleanBrandName)) {
          skippedExisting++;
          continue;
        }
        
        // Add missing brand
        const newBrand = await db.insert(brands).values({
          name: brandName + (brandName.includes('™') ? '' : '™'),
          description: `Authentic ${brandName} from HTML admin panel data for ${sectorName}`,
          sectorId,
          integration: 'VaultMesh™',
          status: 'active',
          isCore: true,
          metadata: {
            authentic: true,
            htmlSource: true,
            reconciled: true,
            pricing: 149.99
          }
        }).returning();
        
        addedCore++;
        existingBrandNames.add(cleanBrandName);
        
        // Add missing subnodes
        const subnodeArrays = sectorSubnodes[sectorKey];
        if (subnodeArrays && subnodeArrays[i % subnodeArrays.length]) {
          const subnodes = subnodeArrays[i % subnodeArrays.length];
          for (const subnodeName of subnodes) {
            if (!subnodeName || subnodeName.length < 2) continue;
            
            const cleanSubnodeName = subnodeName.replace('™', '');
            if (existingBrandNames.has(cleanSubnodeName)) continue;
            
            await db.insert(brands).values({
              name: subnodeName + (subnodeName.includes('™') ? '' : '™'),
              description: `Authentic ${subnodeName} subnode from HTML data`,
              sectorId,
              parentId: newBrand[0].id,
              integration: 'HotStack',
              status: 'active',
              isCore: false,
              metadata: {
                authentic: true,
                htmlSource: true,
                reconciled: true,
                parentBrand: brandName,
                pricing: 79.99
              }
            });
            
            addedSubs++;
            existingBrandNames.add(cleanSubnodeName);
          }
        }
      }
    }
    
    // Update sector counts
    const finalBrands = await db.select().from(brands);
    const sectorCounts = {};
    
    for (const brand of finalBrands) {
      if (!brand.parentId) {
        if (!sectorCounts[brand.sectorId]) sectorCounts[brand.sectorId] = { core: 0, subnodes: 0 };
        sectorCounts[brand.sectorId].core++;
      } else {
        if (!sectorCounts[brand.sectorId]) sectorCounts[brand.sectorId] = { core: 0, subnodes: 0 };
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
    
    console.log('🎉 MISSING BRANDS RECONCILIATION COMPLETED!');
    console.log(`✅ Added Core: ${addedCore}`);
    console.log(`✅ Added Subnodes: ${addedSubs}`);  
    console.log(`⏭️ Skipped Existing: ${skippedExisting}`);
    console.log(`✅ Total Brands Now: ${finalBrands.length}`);
    console.log('🚫 NO DUPLICATES, ONLY MISSING BRANDS ADDED!');
    
  } catch (error) {
    console.error('❌ Reconciliation failed:', error);
    throw error;
  }
}

reconcileMissingBrands().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });