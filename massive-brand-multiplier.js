// MASSIVE BRAND MULTIPLIER - Parse individual brands correctly from HTML
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import ws from "ws";
import fs from 'fs';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors } });

// EXTRACT ALL INDIVIDUAL BRANDS from HTML - no concatenated names
function parseIndividualBrands() {
  const htmlContent = fs.readFileSync('attached_assets/Pasted--Global-Data-Definitions-const-sectorList-agriculture-Agr-1753226847412_1753226847414.txt', 'utf8');
  
  // Define sector mapping
  const sectorMapping = {
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
    'ailogic': '🧠 AI, Logic & Grid',
    'packaging': '📦 Packaging & Materials',
    'quantum': '✴️ Quantum Protocols',
    'ritualCulture': '☯ Ritual & Culture',
    'foodChain': '✿ Nutrition & Food Chain',
    'zeroWaste': '♻️ Zero Waste',
    'saasLicensing': '🔑 SaaS & Licensing',
    'nftOwnership': '🔁 NFT & Ownership',
    'trade': '🧺 Trade Systems',
    'utilities': '🔋 Utilities & Energy',
    'voice': '🎙️ Voice & Audio',
    'payrollMining': '🪙 Payroll Mining & Accounting',
    'mining': '⛏️ Mining & Resources',
    'wildlife': '🦁 Wildlife & Habitat'
  };

  const extractedData = {};

  // Extract brand arrays with proper parsing
  const brandRegex = /const (\w+)Brands = \[(.*?)\];/gs;
  let match;
  while ((match = brandRegex.exec(htmlContent)) !== null) {
    const sectorKey = match[1];
    const brandString = match[2];
    
    // Parse individual brand names - handle quotes and commas properly  
    const individualBrands = [];
    const cleanString = brandString.replace(/'/g, '"'); // normalize quotes
    
    // Split by commas but respect quoted strings
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < cleanString.length; i++) {
      const char = cleanString[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        if (current.trim()) {
          const brandName = current.replace(/["']/g, '').trim();
          if (brandName && brandName.length > 1) {
            individualBrands.push(brandName);
          }
        }
        current = '';
      } else {
        current += char;
      }
    }
    
    // Handle last brand
    if (current.trim()) {
      const brandName = current.replace(/["']/g, '').trim();
      if (brandName && brandName.length > 1) {
        individualBrands.push(brandName);
      }
    }
    
    extractedData[sectorKey] = {
      sectorName: sectorMapping[sectorKey],
      brands: individualBrands
    };
  }

  return extractedData;
}

async function multiplyBrands() {
  console.log('🔥 MASSIVE BRAND MULTIPLICATION - INDIVIDUAL BRANDS ONLY');

  try {
    const extractedData = parseIndividualBrands();
    console.log(`📊 Extracted ${Object.keys(extractedData).length} sectors`);
    
    // Get sector map
    const allSectors = await db.select().from(sectors);
    const sectorMap = {};
    allSectors.forEach(s => sectorMap[s.name] = s.id);

    // CLEAR ALL EXISTING BRANDS
    await db.delete(brands);
    console.log('🗑️ CLEARED ALL EXISTING BRANDS');

    let totalBrands = 0;

    // Process each sector with individual brands
    for (const [sectorKey, data] of Object.entries(extractedData)) {
      const sectorId = data.sectorName ? sectorMap[data.sectorName] : null;
      
      if (!sectorId) {
        console.log(`⚠️ Sector not found: ${sectorKey} -> ${data.sectorName}`);
        continue;
      }

      console.log(`✅ ${data.sectorName}: ${data.brands.length} individual brands`);

      // Create each individual brand
      for (const brandName of data.brands) {
        if (!brandName || brandName.length < 2) continue;

        await db.insert(brands).values({
          name: brandName + (brandName.includes('™') ? '' : '™'),
          description: `Authentic ${brandName} from admin panel data for ${data.sectorName}`,
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
        });

        totalBrands++;
      }
    }

    // Update sector counts
    const finalBrands = await db.select().from(brands);
    const sectorCounts = {};
    
    for (const brand of finalBrands) {
      if (!sectorCounts[brand.sectorId]) {
        sectorCounts[brand.sectorId] = 0;
      }
      sectorCounts[brand.sectorId]++;
    }

    for (const [sectorId, count] of Object.entries(sectorCounts)) {
      await db.update(sectors)
        .set({ brandCount: count })
        .where(eq(sectors.id, parseInt(sectorId)));
    }

    console.log('🎉 MASSIVE BRAND MULTIPLICATION COMPLETED!');
    console.log(`✅ Total Individual Brands: ${totalBrands}`);
    console.log('🚫 NO MORE CONCATENATED NAMES!');
    console.log('✅ EVERY BRAND IS INDIVIDUAL FROM HTML DATA!');

  } catch (error) {
    console.error('❌ Brand multiplication failed:', error);
    throw error;
  }
}

multiplyBrands().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });