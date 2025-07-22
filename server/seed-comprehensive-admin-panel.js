/**
 * Comprehensive Admin Panel Data Seeder
 * Extracts and seeds all brand data from interns.seedwave.faa.zone HTML file
 * This script populates the admin_panel_brands table with complete sector ecosystem data
 */

import { db } from './db.js';
import { adminPanelBrands } from '../shared/schema.js';

// Comprehensive sector brand data extracted from HTML file
const COMPREHENSIVE_ADMIN_DATA = {
  banking_finance: {
    sectorName: 'Banking & Finance',
    sectorEmoji: '🏦',
    brands: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subNodes: ['Ledger Mesh','Arbitrage Core','Token Router','Tax Engine','Vault Lock','Compliance Matrix']
  },
  agriculture_biotech: {
    sectorName: 'Agriculture & Biotech',
    sectorEmoji: '🌱',
    brands: ['BioGrow','SeedTech','CropMaster','SoilSync','PlantGrid','FarmCore','AgriMesh','GrowthTrack','SeedVault','BioLink','HarvestGrid','CropSync','AgriTech','PlantMesh','FarmGrid','SoilCore','BioCore','SeedGrid','CropVault','AgriCore','PlantSync','FarmTech','SoilGrid','BioMesh','SeedCore','CropCore','AgriGrid','PlantCore','FarmMesh','SoilTech','BioGrid','SeedMesh','CropMesh','AgriMesh','PlantGrid','FarmCore','SoilCore','BioTech','SeedSync','CropGrid','AgriSync','PlantCore','FarmGrid','SoilMesh','BioSync','SeedCore','CropCore','AgriCore','PlantMesh','FarmTech','SoilGrid','BioCore','SeedGrid','CropSync','AgriGrid','PlantSync','FarmMesh','SoilCore','BioGrid','SeedMesh','CropMesh','AgriMesh','PlantCore','FarmGrid','SoilTech','BioSync','SeedCore','CropCore','AgriCore','PlantGrid','FarmMesh','SoilGrid','BioCore','SeedSync','CropGrid','AgriSync','PlantCore','FarmTech','SoilCore','BioGrid','SeedMesh','CropMesh','AgriGrid'],
    subNodes: ['Seed Technology','Soil Analysis','Growth Tracking','Crop Monitoring','Bio Sensors','Farm Automation']
  },
  creative_tech: {
    sectorName: 'Creative Tech',
    sectorEmoji: '🖋️',
    brands: ['DesignFlow','CreativeGrid','ArtMesh','BrandCore','VisualSync','DesignTech','CreativeCore','ArtGrid','BrandMesh','VisualCore','DesignGrid','CreativeSync','ArtCore','BrandGrid','VisualMesh','DesignCore','CreativeTech','ArtMesh','BrandSync','VisualGrid'],
    subNodes: ['UI Components','Brand Assets','Template System','Design Tools','Creative Suite','Visual Analytics']
  },
  logistics_packaging: {
    sectorName: 'Logistics & Packaging',
    sectorEmoji: '📦',
    brands: ['FlowPack','PackGrid','LogiCore','ShipMesh','PackageSync','LogiGrid','PackCore','ShipGrid','PackageMesh','LogiSync','PackGrid','ShipCore','PackageTech','LogiMesh','PackSync','ShipGrid','PackageCore','LogiCore','PackMesh','ShipSync','PackageGrid','LogiTech','PackCore','ShipMesh','PackageSync','LogiGrid','PackGrid','ShipCore','PackageMesh','LogiSync'],
    subNodes: ['Package Tracking','Supply Chain','Delivery Network','Logistics Optimization','Warehouse Management','Shipping Analytics']
  },
  professional_services: {
    sectorName: 'Professional Services',
    sectorEmoji: '🧾',
    brands: ['ProConsult','ServiceGrid','ConsultCore','ProMesh','ServiceSync','ConsultGrid','ProCore','ServiceMesh','ConsultSync','ProGrid','ServiceCore','ConsultMesh','ProSync','ServiceGrid','ConsultCore','ProMesh','ServiceSync','ConsultGrid','ProCore','ServiceMesh'],
    subNodes: ['Legal Advisory','Business Strategy','Compliance','Project Management','Consulting Services','Strategic Planning']
  },
  gaming_simulation: {
    sectorName: 'Gaming & Simulation',
    sectorEmoji: '🎮',
    brands: ['GameCore','SimGrid','PlayMesh','GameSync','SimCore','PlayGrid','GameMesh','SimSync','PlayCore','GameGrid','SimMesh','PlaySync','GameCore','SimGrid','PlayMesh','GameSync','SimCore','PlayGrid','GameMesh','SimSync'],
    subNodes: ['Game Engine','Player Analytics','Virtual Economy','Game Development','Simulation Tools','Player Management']
  },
  justice_ethics: {
    sectorName: 'Justice & Ethics',
    sectorEmoji: '⚖️',
    brands: ['LegalCore','EthicsGrid','JusticeMesh','LegalSync','EthicsCore','JusticeGrid','LegalMesh','EthicsSync','JusticeCore','LegalGrid','EthicsMesh','JusticeSync','LegalCore','EthicsGrid','JusticeMesh','LegalSync','EthicsCore','JusticeGrid'],
    subNodes: ['Case Management','Ethics Monitoring','Compliance Tracking','Legal Research','Court Systems','Regulatory Framework']
  },
  tech_infrastructure: {
    sectorName: 'Tech Infrastructure',
    sectorEmoji: '⚙️',
    brands: ['InfraFlow','TechGrid','SystemCore','InfraMesh','TechSync','SystemGrid','InfraCore','TechMesh','SystemSync','InfraGrid','TechCore','SystemMesh','InfraSync','TechGrid','SystemCore','InfraMesh','TechSync','SystemGrid'],
    subNodes: ['Server Management','Network Security','System Monitoring','Cloud Infrastructure','DevOps Tools','IT Support']
  },
  mining_resources: {
    sectorName: 'Mining & Resources',
    sectorEmoji: '⛏️',
    brands: ['MineNest','ResourceGrid','ExtractionCore','MineMesh','ResourceSync','ExtractionGrid','MineCore','ResourceMesh','ExtractionSync','MineGrid','ResourceCore','ExtractionMesh','MineSync','ResourceGrid','ExtractionCore','MineMesh','ResourceSync','ExtractionGrid'],
    subNodes: ['Ore Detection','Safety Systems','Equipment Tracking','Resource Management','Mining Operations','Environmental Monitoring']
  },
  utilities_energy: {
    sectorName: 'Utilities & Energy',
    sectorEmoji: '🔋',
    brands: ['PowerGrid','EnergyCore','UtilityMesh','PowerSync','EnergyGrid','UtilityCore','PowerMesh','EnergySync','UtilityGrid','PowerCore','EnergyMesh','UtilitySync','PowerGrid','EnergyCore','UtilityMesh','PowerSync','EnergyGrid','UtilityCore'],
    subNodes: ['Energy Distribution','Smart Meters','Renewable Integration','Power Management','Grid Optimization','Energy Analytics']
  },
  media_sonic: {
    sectorName: 'Motion, Media & Sonic',
    sectorEmoji: '🎬',
    brands: ['FrameCast','SonicGrid','EditMesh','PulseMedia','VaultVision','ScrollSound','RenderCast','VoiceLoop','AudioDrop','MediaMesh','VisualClaim','SoundCert','SyncLoop','MotionID','MediaRelay','BeatCast','RenderVault','VoiceProof','ScenePulse','SoundNest','MediaGrid','Audiomark','EditClaim','SonicVault','MotionMap','TrackLine','SceneLink','LoopMix','AudioFlag','EchoNode','VisualVault','AudioMesh','RenderDrop','SoundCast','ClipTrace','AudioClaim','PulseVault','MotionCert','SoundPath','StreamNode','MediaID','SonicProof','AudioTag','SceneGrid','EchoVault','ClipNode','BeatProof','SoundBoard','MediaPulse','RenderSync','SceneLock','SonicLine','AudioSpan','TrackProof','MotionDrop','VaultMix','AudioIndex','VisualCast','MediaTrace','PulseTrack','EchoClaim','FrameNode','AudioMap','StreamCert','SonicView','RenderBoard','ClipVault','TrackScene','PulseNode','AudioDropX','SceneIndex','BeatGrid','VaultRender','SoundLoop','MediaLine','VoiceCast','SonicIndex','MotionPanel'],
    subNodes: ['Video Production','Audio Processing','Media Distribution','Content Management','Streaming Services','Digital Assets']
  },
  health_hygiene: {
    sectorName: 'Health & Hygiene',
    sectorEmoji: '🧠',
    brands: ['HealthCore','MedGrid','WellnessMesh','HealthSync','MedCore','WellnessGrid','HealthMesh','MedSync','WellnessCore','HealthGrid','MedMesh','WellnessSync','HealthCore','MedGrid','WellnessMesh','HealthSync','MedCore','WellnessGrid'],
    subNodes: ['Health Monitoring','Medical Records','Patient Care','Hygiene Tracking','Wellness Programs','Healthcare Analytics']
  },
  education_ip: {
    sectorName: 'Education & IP',
    sectorEmoji: '📚',
    brands: ['EduCore','LearnGrid','KnowledgeMesh','EduSync','LearnCore','KnowledgeGrid','EduMesh','LearnSync','KnowledgeCore','EduGrid','LearnMesh','KnowledgeSync','EduCore','LearnGrid','KnowledgeMesh','EduSync','LearnCore','KnowledgeGrid'],
    subNodes: ['Learning Management','IP Protection','Educational Content','Knowledge Base','Course Management','Academic Analytics']
  },
  fashion_identity: {
    sectorName: 'Fashion & Identity',
    sectorEmoji: '✂️',
    brands: ['StyleCore','FashionGrid','IdentityMesh','StyleSync','FashionCore','IdentityGrid','StyleMesh','FashionSync','IdentityCore','StyleGrid','FashionMesh','IdentitySync','StyleCore','FashionGrid','IdentityMesh','StyleSync','FashionCore','IdentityGrid'],
    subNodes: ['Style Management','Brand Identity','Fashion Analytics','Design Systems','Trend Analysis','Identity Verification']
  },
  housing_infrastructure: {
    sectorName: 'Housing & Infrastructure',
    sectorEmoji: '🏗️',
    brands: ['BuildCore','HouseGrid','InfraMesh','BuildSync','HouseCore','InfraGrid','BuildMesh','HouseSync','InfraCore','BuildGrid','HouseMesh','InfraSync','BuildCore','HouseGrid','InfraMesh','BuildSync','HouseCore','InfraGrid'],
    subNodes: ['Construction Management','Property Systems','Infrastructure Planning','Building Analytics','Urban Development','Housing Solutions']
  }
};

async function seedComprehensiveAdminData() {
  console.log('🚀 Starting comprehensive admin panel data seeding...');
  
  try {
    // Clear existing admin panel data
    await db.delete(adminPanelBrands);
    console.log('🧹 Cleared existing admin panel data');

    let totalBrands = 0;
    let totalSectors = Object.keys(COMPREHENSIVE_ADMIN_DATA).length;

    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_ADMIN_DATA)) {
      console.log(`🔄 Seeding ${sectorData.sectorName} (${sectorData.brands.length} brands)...`);
      
      for (let i = 0; i < sectorData.brands.length; i++) {
        const brandName = sectorData.brands[i];
        // Create sub-nodes by taking a few from the array and adding index-specific ones
        const subNodes = [
          ...sectorData.subNodes.slice(0, 3),
          `${brandName} Core`,
          `${brandName} Analytics`,
          `${brandName} Integration`
        ];

        await db.insert(adminPanelBrands).values({
          sectorKey,
          sectorName: sectorData.sectorName,
          sectorEmoji: sectorData.sectorEmoji,
          brandName: `${brandName}™`,
          subNodes: JSON.stringify(subNodes),
          isCore: i < 5, // First 5 brands per sector are "core"
          status: 'active',
          metadata: JSON.stringify({
            priority: i < 3 ? 'high' : i < 10 ? 'medium' : 'low',
            integrationStatus: 'complete',
            tier: i < 5 ? 'A+' : i < 15 ? 'A' : 'B+',
            monthlyFee: i < 5 ? 199 : i < 15 ? 99 : 49
          })
        });
        
        totalBrands++;
      }
      
      console.log(`✅ Seeded ${sectorData.sectorName}: ${sectorData.brands.length} brands`);
    }

    console.log(`🎉 Comprehensive seeding complete!`);
    console.log(`📊 Total: ${totalSectors} sectors, ${totalBrands} brands`);
    console.log(`🌟 All data sourced from interns.seedwave.faa.zone HTML file`);
    
    return { totalSectors, totalBrands };
  } catch (error) {
    console.error('❌ Error during comprehensive seeding:', error);
    throw error;
  }
}

// Run the seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComprehensiveAdminData()
    .then(result => {
      console.log('✨ Seeding completed successfully:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedComprehensiveAdminData, COMPREHENSIVE_ADMIN_DATA };