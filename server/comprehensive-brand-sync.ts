import { db } from "./db";
import { brands, sectors } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Complete sector and brand data from user's uploaded files
const COMPREHENSIVE_SECTOR_BRAND_DATA = {
  banking: {
    name: "🏦 Banking & Finance",
    emoji: "🏦",
    coreBrands: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subNodeArrays: [['Ledger Mesh','Arbitrage Core','Token Router','Tax Engine','Vault Lock','Compliance Matrix','Logistics Fin','Currency Glyph','Forecast Engine','Signal Tracker'],['Zeno Mesh','Crux Bridge','Hive Monitor','Wire Reconciler','Bit Locker','Credit Splice','Score Vector','Zentry Core','Drift Trace','Alpha Ledger'],['Lumen Pulse','Delta Secure','Fractal Trace','Torus Signal','Mint Bridge','Tally Stream','Bank Depth','Kite Path','Bond Engine','Echo Stack'],['Ark Model','Node Gate','Veritas Sync','Cage Mapper','Core Trace','Sky Sweep','Mint Grid','Orbit Channel','Hash Clear','Micro Chain'],['Anchor Lock','Fleet Sync','Zoom Channel','Beacon Path','Crate Vault','Numen Index','Spark Flow','Meta Signal','Aether Drift','Custody Map'],['Neutron Signal','Cash Stream','Jet Grid','Pulse Map','Sync Grid','Tangent Vector','Nova Route','Glide Core','Trace Engine','Root Node'],['Bank Shift','Pillar Core','Axon Thread','Monet Route','Layer Core','Verge Node','Stack Tally','Crown Core','Prism Gate','Halo Grid'],['Clearance Vector','Forge Sync','Bank Mesh','Nano Token','Lattice Path','Noble Curve','Chain Vector','Mint Grid','Bridge Path','Chrono Index'],['Unity Sync','Trust Matrix','Vault Score','Lucid Gate','Mint Route','Flight Signal','Teller Index','Custody Trace','Flare Lock','Dark Stream'],['Origin Pulse','Shard Bank','Pay Score','Altimeter Path','Clearing Core','Frame Lock','Zenith Route','Score Helix','Meta Stack','Crux Trace'],['Pulse Engine','Balance Tally','Gold Trace','Stack Mesh','Quantum Sync','Script Pulse','Vault Stack','Trust Model','Hyper Lock','Tone Gate'],['Grid Index','Line Mesh','Alpha Signal','Logic Gate','Yield Route','Ratio Core','Ledger Path','Prime Helix','Amp Signal','Lattice Node'],['Credit Curve','Vault Pulse','Data Mesh','Ring Gate','Glyph Stack','Bank Channel','Zen Gate','Loop Vault','Axial Index','Loop Stack'],['Pulse Vector','Bank Curve','Helix Gate','Teller Pulse','Tally Signal','Mint Vault']]
  },
  agriculture: {
    name: "🌱 Agriculture & Biotech",
    emoji: "🌱",
    coreBrands: ['CropLink','SoilPulse','RootYield','AquaFarm','AgriMesh','GrowNode','GrainCast','SoilBank','CropID','AgriVault','PulseHarvest','MarketSoil','DroneFarm','RuralOps','SeedGrid','FarmChain','AgriScore','SoilNet','CropDoc','TerraVault','AgriID','SproutFlow','GrainSafe','FieldSync','AgriDepot','DroneCrop','CropTrace','PulseSoil','SeedRoot','RuralFlow','MarketGrow','AgriRank','SoilLogic','AgriSync','NutrientGrid','FieldCast','CropSource','YieldStack','FarmPulse','SoilTech','GreenTrace','CropVault','AgriCast','TerraPulse','SoilTrace','PulseAg','GrowVault','FieldNet','DroneSoil','SoilGrid','HarvestLoop','RuralMesh','FarmFlag','AgriFlow','SoilVault','FieldProof','DroneTrace','MarketRoots','NutrientPath','CropPulse','AgriPulse','EcoSeed','AgriMetrics','DroneGrid','GreenNode','RootVault','FieldToken','AgriPlan','SoilYield','SeedVault','MarketLink','CropFlow','RuralCast','AgriSyncPro','SoilLine','EcoAgri','HarvestNode','TerraSoil','CropMesh','AgriSignal','RuralVault','PulseGrow','MarketSoilX','AgriOmni'],
    subNodeArrays: [['CropLink ID™', 'CropLink Vault™', 'CropLink Field™', 'CropLink Yield™'],['SoilPulse Trace™', 'SoilPulse Data™', 'SoilPulse Alert™'],['RootYield Base™', 'RootYield Chain™', 'RootYield X™'],['AquaFarm Sync™', 'AquaFarm Logi™', 'AquaFarm Vault™'],['AgriMesh Route™', 'AgriMesh Pulse™', 'AgriMesh View™'],['GrowNode Basic™', 'GrowNode Trade™', 'GrowNode Vault™'],['GrainCast Forecast™', 'GrainCast Scroll™'],['SoilBank Ledger™', 'SoilBank Pay™'],['CropID Scanner™', 'CropID Trust™'],['AgriVault Lock™', 'AgriVault Chain™', 'AgriVault Seed™'],['PulseHarvest Sync™', 'PulseHarvest Drop™', 'PulseHarvest Vault™'],['MarketSoil Rate™', 'MarketSoil Feed™', 'MarketSoil UI™'],['DroneFarm View™', 'DroneFarm Grid™', 'DroneFarm Trace™'],['RuralOps Node™', 'RuralOps Pulse™', 'RuralOps Chain™'],['SeedGrid Vault™', 'SeedGrid Scan™', 'SeedGrid Growth™']]
  },
  creative: {
    name: "🖋️ Creative Tech",
    emoji: "🖋️",
    coreBrands: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit','GhostTrace', 'TalentMap', 'SignalVerse', 'ScrollPlay', 'FXStream'],
    subNodeArrays: [['SceneLink™', 'FXLayer™', 'ClipVault™'],['StudioSync™', 'StagePulse™', 'RenderMesh™'],['AudioTrace™', 'VoiceVault™', 'WaveLoop™'],['CutChain™', 'TimelineScroll™', 'FXSnap™'],['VectorNode™', 'AnimCast™', 'ScrollFX™'],['TraceBlock™', 'ScreenShield™', 'CloneLock™'],['LedgerID™', 'Royaltix™', 'PayoutTag™'],['FreqCast™', 'GridWave™', 'AudioMesh™'],['PlayNode™', 'FrameTrigger™', 'RenderSync™'],['FXRender™', 'ScrollVision™', 'LoopFrame™']]
  },
  logistics: {
    name: "📦 Logistics & Packaging",
    emoji: "📦",
    coreBrands: ['CrateLogic', 'PackChain', 'SortFleet', 'RouteMesh', 'LogiStack', 'DeliveryX', 'CargoVault', 'PalletPath', 'LabelFlow', 'DropLoop','ScrollRoute', 'ShipLedger', 'FreightCore', 'PackSphere', 'GridDrop', 'AutoTrack', 'ChainWrap', 'BinLogicX', 'PouchNode', 'ColdFleet','TrackStack', 'NodeRoute', 'PackOS', 'ZipCrate', 'TagLogic', 'ScrollTruck', 'FlowVault', 'SortStack', 'DockGrid', 'RollFleet','VendSort', 'GridCrate', 'LogiLift', 'CrateX', 'QuickLabel', 'DropLedger', 'FleetTrace', 'BoxSync', 'ChainGate', 'ColdRoute','PalletCore', 'FreightLine', 'PackSignal', 'ChainVault', 'CrateThread', 'ForkYield', 'DockLogic', 'LoadCast', 'TrayTrack', 'ScrollDrop','LoopXpress', 'PackSyncPro', 'VendorWrap', 'CrateLedger', 'BoxNodeX', 'AutoRoute', 'VaultBin', 'LabelTrack', 'PathLock', 'DispatchLoop','ChainPulse', 'FastTag', 'VendorFleet', 'ParcelSync', 'SmartCrate', 'AutoLabel', 'FreightGrid', 'DockFlow', 'CrateBox', 'ColdTrack','SecureMesh', 'LoopDispatch', 'AutoLift', 'ClaimBoard', 'ParcelChain', 'LabelMesh', 'BoxSignal', 'LoadFrame', 'VaultRoute', 'DockYield','CrateSecure', 'LabelFlowX', 'DockMaster', 'PackNet', 'RouteGuard', 'BinLogicPro', 'ColdChainX', 'AutoPack', 'ShipTrack', 'LoadManager','CrateManager', 'LabelSecure', 'DockFlowX', 'PackMaster', 'RouteManager', 'BinSecure', 'ColdManager', 'AutoLabelX', 'ShipManager', 'LoadSecure','CrateManager'],
    subNodeArrays: [['BoxNode™', 'CrateMap™', 'PackSync™', 'CrateSync™'],['VendorPack™', 'LabelTrace™', 'ShipGrid™', 'ScrollWrap™'],['SortPulse™', 'BinLogic™', 'FleetTrack™', 'ScrollSort™'],['NodeMap™', 'GeoSignal™', 'DropLink™', 'RouteFlow™'],['ScrollStack™', 'YieldSync™', 'PayoutRoute™', 'StackNode™']]
  },
  mining: {
    name: "⛏️ Mining & Resources",
    emoji: "⛏️",
    coreBrands: ["MineSync™", "NestTrack™", "VaultDrill™", "OreCore™", "GlamOrb™", "DrillCore™", "CoreDigs™", "PowePush™", "DrilTrek™", "DrigVan™", "DreSynk™", "SyncBlock™", "MineCore™", "DrillNest™", "CoreVault™", "OreTrack™", "VaultCore™", "DrillSync™", "MineVault™", "CoreDrill™", "OreNest™", "VaultTrack™", "DrillOrb™", "CoreSync™", "MineOrb™", "OreVault™", "DrillCore™", "VaultOrb™", "CoreTrack™", "MineSync™"],
    subNodeArrays: [["Mining Operations", "Resource Management", "Equipment Tracking", "Safety Protocols"], ["Environmental Compliance", "Supply Chain", "Quality Control", "Data Analytics"], ["Maintenance Systems", "Inventory Management", "Cost Analysis", "Production Planning"], ["Worker Safety", "Equipment Optimization", "Resource Planning", "Site Management"]]
  }
};

export async function syncComprehensiveBrandData() {
  console.log("🔄 Starting comprehensive brand data synchronization...");
  
  try {
    let totalCoreAdded = 0;
    let totalSubnodesAdded = 0;
    
    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_SECTOR_BRAND_DATA)) {
      console.log(`\n📂 Processing sector: ${sectorData.name}`);
      
      // Get sector from database
      const sector = await db
        .select()
        .from(sectors)
        .where(eq(sectors.name, sectorData.name))
        .limit(1);
      
      if (sector.length === 0) {
        console.log(`❌ Sector ${sectorData.name} not found in database`);
        continue;
      }
      
      const sectorId = sector[0].id;
      console.log(`✅ Found sector ${sectorData.name} with ID: ${sectorId}`);
      
      // Check existing brands for this sector
      const existingBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.sectorId, sectorId));
      
      console.log(`📊 Existing brands in ${sectorData.name}: ${existingBrands.length}`);
      
      // Add core brands
      const coreBrands = sectorData.coreBrands;
      let coreAdded = 0;
      
      for (let i = 0; i < coreBrands.length; i++) {
        const brandName = coreBrands[i];
        
        // Check if brand already exists
        const existingBrand = existingBrands.find(b => b.name === brandName);
        if (existingBrand) {
          console.log(`⏭️  Core brand ${brandName} already exists`);
          continue;
        }
        
        // Add core brand
        await db.insert(brands).values({
          name: brandName,
          description: `Advanced ${brandName} ${sectorKey} solution with comprehensive VaultMesh™ integration for the Fruitful Global ecosystem.`,
          sectorId: sectorId,
          integration: "VaultMesh™",
          status: "active",
          isCore: true,
          parentId: null,
          metadata: {
            sector: sectorKey,
            tier: "enterprise",
            featured: true,
            pricing: {
              monthly: 299.99,
              annual: 2999.99,
              currency: "USD"
            }
          }
        });
        
        coreAdded++;
        totalCoreAdded++;
        console.log(`✅ Added core brand: ${brandName}`);
      }
      
      // Add subnodes for each core brand
      let subnodesAdded = 0;
      const subNodeArrays = sectorData.subNodeArrays;
      
      for (let brandIndex = 0; brandIndex < Math.min(coreBrands.length, subNodeArrays.length); brandIndex++) {
        const parentBrandName = coreBrands[brandIndex];
        const subnodes = subNodeArrays[brandIndex];
        
        // Get parent brand from database
        const parentBrand = await db
          .select()
          .from(brands)
          .where(and(
            eq(brands.name, parentBrandName),
            eq(brands.sectorId, sectorId),
            eq(brands.isCore, true)
          ))
          .limit(1);
        
        if (parentBrand.length === 0) {
          console.log(`❌ Parent brand ${parentBrandName} not found`);
          continue;
        }
        
        const parentId = parentBrand[0].id;
        
        // Add subnodes
        for (const subnodeName of subnodes) {
          // Check if subnode already exists
          const existingSubnode = existingBrands.find(b => 
            b.name === subnodeName && b.parentId === parentId
          );
          
          if (existingSubnode) {
            console.log(`⏭️  Subnode ${subnodeName} already exists`);
            continue;
          }
          
          await db.insert(brands).values({
            name: subnodeName,
            description: `Specialized ${subnodeName} system integrated with ${parentBrandName} for advanced ${sectorKey} operations.`,
            sectorId: sectorId,
            integration: "VaultMesh™",
            status: "active",
            isCore: false,
            parentId: parentId,
            metadata: {
              sector: sectorKey,
              parentBrand: parentBrandName,
              level: "subnode",
              pricing: {
                monthly: 29.99 + (subnodesAdded * 2),
                currency: "USD"
              }
            }
          });
          
          subnodesAdded++;
          totalSubnodesAdded++;
          console.log(`✅ Added subnode: ${subnodeName} (parent: ${parentBrandName})`);
        }
      }
      
      console.log(`📊 Sector ${sectorData.name} summary:`);
      console.log(`  - Core brands added: ${coreAdded}`);
      console.log(`  - Subnodes added: ${subnodesAdded}`);
    }
    
    console.log(`\n🎉 Comprehensive sync completed!`);
    console.log(`📊 Total summary:`);
    console.log(`  - Total core brands added: ${totalCoreAdded}`);
    console.log(`  - Total subnodes added: ${totalSubnodesAdded}`);
    
    return {
      success: true,
      coreAdded: totalCoreAdded,
      subnodesAdded: totalSubnodesAdded
    };
    
  } catch (error) {
    console.error("❌ Error during comprehensive brand sync:", error);
    return {
      success: false,
      error: error
    };
  }
}