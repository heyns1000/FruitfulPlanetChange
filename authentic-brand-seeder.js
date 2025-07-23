// AUTHENTIC Brand Seeder - Real brand names from HTML data ONLY
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { brands, sectors } from './shared/schema.ts';
import { eq } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { brands, sectors } });

// REAL AUTHENTIC DATA from user's HTML files - exact names from admin panel
const AUTHENTIC_BRANDS = {
  '🌱 Agriculture & Biotech': {
    core: ['CropLink','SoilPulse','RootYield','AquaFarm','AgriMesh','GrowNode','GrainCast','SoilBank','CropID','AgriVault','PulseHarvest','MarketSoil','DroneFarm','RuralOps','SeedGrid','FarmChain','AgriScore','SoilNet','CropDoc','TerraVault','AgriID','SproutFlow','GrainSafe','FieldSync','AgriDepot','DroneCrop','CropTrace','PulseSoil','SeedRoot','RuralFlow','MarketGrow','AgriRank','SoilLogic','AgriSync','NutrientGrid','FieldCast','CropSource','YieldStack','FarmPulse','SoilTech','GreenTrace','CropVault','AgriCast','TerraPulse','SoilTrace','PulseAg','GrowVault','FieldNet','DroneSoil','SoilGrid','HarvestLoop','RuralMesh','FarmFlag','AgriFlow','SoilVault','FieldProof','DroneTrace','MarketRoots','NutrientPath','CropPulse','AgriPulse','EcoSeed','AgriMetrics','DroneGrid','GreenNode','RootVault','FieldToken','AgriPlan','SoilYield','SeedVault','MarketLink','CropFlow','RuralCast','AgriSyncPro','SoilLine','EcoAgri','HarvestNode','TerraSoil','CropMesh','AgriSignal','RuralVault','PulseGrow','MarketSoilX','AgriOmni'],
    subnodes: {
      'CropLink': ['CropLink ID™', 'CropLink Vault™', 'CropLink Field™', 'CropLink Yield™'],
      'SoilPulse': ['SoilPulse Trace™', 'SoilPulse Data™', 'SoilPulse Alert™'],
      'RootYield': ['RootYield Base™', 'RootYield Chain™', 'RootYield X™'],
      'AquaFarm': ['AquaFarm Sync™', 'AquaFarm Logi™', 'AquaFarm Vault™'],
      'AgriMesh': ['AgriMesh Route™', 'AgriMesh Pulse™', 'AgriMesh View™'],
      'GrowNode': ['GrowNode Basic™', 'GrowNode Trade™', 'GrowNode Vault™'],
      'GrainCast': ['GrainCast Forecast™', 'GrainCast Scroll™'],
      'SoilBank': ['SoilBank Ledger™', 'SoilBank Pay™'],
      'CropID': ['CropID Scanner™', 'CropID Trust™'],
      'AgriVault': ['AgriVault Lock™', 'AgriVault Chain™', 'AgriVault Seed™'],
      'SoilLogic': ['SoilLogic Grid™', 'SoilLogic Forecast™'],
      'AgriSync': ['AgriSync UI™', 'AgriSync Chain™'],
      'NutrientGrid': ['NutrientGrid Base™', 'NutrientGrid Flux™']
    }
  },

  '🏦 Banking & Finance': {
    core: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subnodes: {
      'FinGrid': ['Ledger Mesh™', 'Arbitrage Core™', 'Token Router™', 'Tax Engine™'],
      'TradeAmp': ['Vault Lock™', 'Compliance Matrix™', 'Logistics Fin™', 'Currency Glyph™'],
      'ZenoBank': ['Zeno Mesh™', 'Crux Bridge™', 'Hive Monitor™', 'Wire Reconciler™'],
      'PulseHive': ['Bit Locker™', 'Credit Splice™', 'Score Vector™', 'Zentry Core™']
    }
  },

  '🖋️ Creative Tech': {
    core: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit','GhostTrace', 'TalentMap', 'SignalVerse', 'ScrollPlay', 'FXStream'],
    subnodes: {
      'MediaGrid': ['SceneLink™', 'FXLayer™', 'ClipVault™'],
      'StudioPath': ['StudioSync™', 'StagePulse™', 'RenderMesh™'],
      'SoundReel': ['AudioTrace™', 'VoiceVault™', 'WaveLoop™'],
      'EditFrame': ['CutChain™', 'TimelineScroll™', 'FXSnap™']
    }
  },

  '🧾 Professional Services': {
    core: ['LedgerNest™', 'OmniBooks™', 'QCalcX™', 'SiteProof™', 'LawTrace™','ContractCast™', 'Enginuity™', 'StructVault™', 'RegiSync™', 'ScrollAudit™','ClaimDocX™', 'PlanDrop™', 'SurveyGrid™', 'VaultJudge™', 'LoopInspect™','BuildNode™', 'ComplyTrack™', 'LegalSync™', 'BudgetCast™', 'VaultPlans™','FormCert™', 'ProofLayer™', 'ZoneMap™', 'TrackSeal™', 'DocLoop™','AuditCrate™', 'VerifyLine™', 'PlanMesh™', 'FrameBook™', 'LogicPermit™','OmniBrief™', 'ClauseCraft™', 'FormLogic™', 'CheckNode™', 'AssetTrace™','LawPathX™', 'LedgerFlow™', 'BudgetSync™', 'CrateJudge™', 'SpecAudit™','LoopCheck™', 'OmniTender™', 'SignalCompliance™', 'BuildCast™', 'NodeClause™','PermitDrop™', 'AuditMatrix™', 'StructPlan™', 'ClaimBoard™', 'FormDrop™'],
    subnodes: {
      'LedgerNest™': ['Ledger Core™', 'Book Sync™', 'Account Grid™'],
      'LawTrace™': ['Legal Path™', 'Contract Flow™', 'Compliance Grid™'],
      'VaultJudge™': ['Court Sync™', 'Case Flow™', 'Legal Grid™']
    }
  },

  '🔑 SaaS & Licensing': {
    core: ['SaaSChain™', 'LicenseGrid™', 'TokenSaaS™', 'VaultKey™', 'OmniLicense™','ScrollSync™', 'PulseSaaS™', 'ClaimSuite™', 'YieldKey™', 'SaaSBoard™','KeyLoop™', 'VaultPanel™', 'LicenseMap™', 'TokenSync™', 'OmniClaim™','SuiteTrack™', 'LicenseBeam™', 'VaultSync™', 'ClaimEcho™', 'PanelGrid™'],
    subnodes: {
      'SaaSChain™': ['License Core™', 'Token Sync™', 'Key Grid™'],
      'VaultKey™': ['Key Lock™', 'License Flow™', 'Access Grid™']
    }
  },

  '🔁 NFT & Ownership': {
    core: ['ClaimGrid™', 'TokenSync™', 'VaultMint™', 'NFTLoop™', 'ScrollProof™','IPTrace™', 'MintEcho™', 'VaultSeal™', 'ChainLock™', 'PulseDrop™','AssetNest™', 'MintTrack™', 'TokenClaim™', 'ProofMap™', 'ScrollVault™','ClaimPanel™', 'YieldChain™', 'LedgerDrop™', 'NFTBoard™', 'ScrollNest™'],
    subnodes: {
      'ClaimGrid™': ['Claim Core™', 'Token Grid™', 'NFT Flow™'],
      'VaultMint™': ['Mint Lock™', 'Chain Sync™', 'Asset Grid™']
    }
  },

  '✴️ Quantum Protocols': {
    core: ['QuantumMesh™', 'PulseQ™', 'EntanglePath™', 'QubitNest™', 'LogicSpin™','VaultQuantum™', 'WaveSignal™', 'PhaseClaim™', 'GridState™', 'QuantumDrop™','SyncQ™', 'PulseField™', 'QLogic™', 'EntangleProof™', 'SuperposVault™','ClaimLoopQ™', 'QuantumTrace™', 'QubitEcho™', 'ZeroNode™', 'PhaseGrid™'],
    subnodes: {
      'QuantumMesh™': ['Quantum Core™', 'Entangle Grid™', 'Qubit Flow™'],
      'PulseQ™': ['Pulse Lock™', 'Wave Sync™', 'Phase Grid™']
    }
  },

  '☯ Ritual & Culture': {
    core: ['RiteNest™', 'PulseSpirit™', 'ClanScroll™', 'CultureGrid™', 'MythLoop™','AuraDrop™', 'CeremPath™', 'EchoGlyph™', 'TradVault™', 'LineageClaim™','SymbolMap™', 'AncestorSync™', 'SoulPanel™', 'ClanRoot™', 'EchoRitual™','TotemCast™', 'RiteClaim™', 'GlyphVault™', 'CultureNest™', 'SpiritBeam™'],
    subnodes: {
      'RiteNest™': ['Ritual Core™', 'Culture Grid™', 'Spirit Flow™'],
      'ClanScroll™': ['Clan Lock™', 'Scroll Sync™', 'Heritage Grid™']
    }
  },

  '✿ Nutrition & Food Chain': {
    core: ['AgriNest™', 'FreshSync™', 'CropLoop™', 'SoilGrid™', 'FarmDrop™','GrainVault™', 'HarvestClaim™', 'PulseCrop™', 'YieldField™', 'RootMap™','FoodProof™', 'AquaNest™', 'SeedCycle™', 'PlantTrack™', 'CropVault™','SoilEcho™', 'NutritionClaim™', 'LoopFarm™', 'PulseGrain™', 'FieldNest™'],
    subnodes: {
      'AgriNest™': ['Agri Core™', 'Food Grid™', 'Nutrition Flow™'],
      'FreshSync™': ['Fresh Lock™', 'Crop Sync™', 'Harvest Grid™']
    }
  },

  '♻️ Zero Waste': {
    core: ['EcoNest™', 'GreenLoop™', 'CycleSync™', 'ZeroCrate™', 'WasteGrid™','BioDrop™', 'SustainClaim™', 'LoopSort™', 'PulseGreen™', 'YieldTrash™','RecycleMap™', 'CleanTrack™', 'EcoVault™', 'ClaimClean™', 'CompostGrid™','GreenBeam™', 'LoopNest™', 'TrashEcho™', 'SortClaim™', 'VaultCycle™'],
    subnodes: {
      'EcoNest™': ['Eco Core™', 'Green Grid™', 'Recycle Flow™'],
      'ZeroCrate™': ['Zero Lock™', 'Waste Sync™', 'Clean Grid™']
    }
  },

  '⛏️ Mining & Resources': {
    core: ['MineNest™', 'DrillCoreX™', 'OreSync™', 'VaultRock™', 'ClaimMine™','TrackShaft™', 'PulseMine™', 'CoreBeam™', 'DigEcho™', 'RockPath™','YieldDrill™', 'MineProof™', 'OreLine™', 'DrillLink™', 'VaultTunnel™','GeoGrid™', 'SeamSync™', 'ClaimOre™', 'PulseBlast™', 'OreEcho™','DeepCrate™', 'RockLogic™', 'CoreDrill™', 'MineCast™', 'DrillMark™','SignalOre™', 'YieldTrack™', 'VaultSeam™', 'ShaftDrop™', 'GeoNode™'],
    subnodes: {
      'MineNest™': ['Mine Core™', 'Drill Grid™', 'Ore Flow™'],
      'DrillCoreX™': ['Drill Lock™', 'Core Sync™', 'Rock Grid™']
    }
  }
};

async function seedAuthenticBrands() {
  console.log('🔥 REMOVING ALL FAKE BRANDS AND REPLACING WITH AUTHENTIC DATA!');

  try {
    // Get all sectors
    const allSectors = await db.select().from(sectors);
    const sectorIdMap = {};
    allSectors.forEach(sector => {
      sectorIdMap[sector.name] = sector.id;
    });

    // CLEAR ALL EXISTING BRANDS - start fresh with authentic data
    await db.delete(brands);
    console.log('🗑️  CLEARED ALL FAKE BRANDS');

    let totalCoreCreated = 0;
    let totalSubnodesCreated = 0;

    // Seed only authentic brands with real subnodes
    for (const [sectorName, sectorData] of Object.entries(AUTHENTIC_BRANDS)) {
      const sectorId = sectorIdMap[sectorName];
      
      if (!sectorId) {
        console.log(`⚠️  Sector not found: ${sectorName}`);
        continue;
      }

      console.log(`✅ Seeding ${sectorName}: ${sectorData.core.length} AUTHENTIC brands`);

      // Create each authentic core brand
      for (const brandName of sectorData.core) {
        const newBrand = await db.insert(brands).values({
          name: brandName + (brandName.includes('™') ? '' : '™'),
          description: `Authentic ${brandName} from comprehensive HTML admin panel data for ${sectorName.replace(/[🌱🏦🖋️🧾🔑🔁✴️☯✿♻️⛏️]/g, '').trim()} sector with complete operational capabilities.`,
          sectorId: sectorId,
          integration: 'VaultMesh™',
          status: 'active',
          isCore: true,
          metadata: {
            category: sectorName.replace(/[🌱🏦🖋️🧾🔑🔁✴️☯✿♻️⛏️]/g, '').trim(),
            tier: 'A+',
            authentic: true,
            htmlSource: true,
            pricing: 149.99
          }
        }).returning();

        totalCoreCreated++;

        // Create authentic subnodes if they exist for this brand
        const brandKey = brandName.replace('™', '');
        if (sectorData.subnodes && sectorData.subnodes[brandKey]) {
          for (const subnodeName of sectorData.subnodes[brandKey]) {
            await db.insert(brands).values({
              name: subnodeName,
              description: `Authentic ${subnodeName} subnode from HTML admin panel data with specialized ${brandName} operational capabilities.`,
              sectorId: sectorId,
              parentId: newBrand[0].id,
              integration: 'HotStack',
              status: 'active',
              isCore: false,
              metadata: {
                category: `${sectorName.replace(/[🌱🏦🖋️🧾🔑🔁✴️☯✿♻️⛏️]/g, '').trim()} - Subnode`,
                parentBrand: brandName,
                tier: 'B+',
                authentic: true,
                htmlSource: true,
                pricing: 79.99
              }
            });

            totalSubnodesCreated++;
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

    const finalTotal = finalBrands.length;
    console.log('🎉 AUTHENTIC BRAND REPLACEMENT COMPLETED!');
    console.log(`✅ AUTHENTIC Core Brands: ${totalCoreCreated}`);
    console.log(`✅ AUTHENTIC Subnodes: ${totalSubnodesCreated}`);
    console.log(`✅ TOTAL AUTHENTIC BRANDS: ${finalTotal}`);
    console.log('🔥 NO MORE FAKE "Node 1", "Node 3" NAMES!');
    console.log('✅ ALL BRANDS NOW SHOW REAL NAMES FROM YOUR HTML DATA!');
    
  } catch (error) {
    console.error('❌ Error during authentic brand seeding:', error);
    throw error;
  }
}

seedAuthenticBrands()
  .then(() => {
    console.log('🚀 AUTHENTIC BRAND SEEDING COMPLETED!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Authentic brand seeding failed:', error);
    process.exit(1);
  });