import { db } from './db';
import {
  ecosystemPulses,
  codeNestRepositories,
  vaultTraceNetwork,
  type InsertEcosystemPulse,
  type InsertCodeNestRepository,
  type InsertVaultTraceNetwork,
} from '@shared/schema';
import signalData from '@shared/Signal_To_Chuck.json';

/**
 * Seed Ecosystem Pulse Integration Data
 * - Initial pulse
 * - Core 8 repositories from Signal_To_Chuck
 * - VaultTrace network nodes
 */
export async function seedEcosystemPulseData() {
  console.log('🌊 Seeding Ecosystem Pulse integration data...');

  try {
    // Seed Core 8 Repositories from Signal_To_Chuck
    const coreRepos = signalData.ecosystem_metadata.core_repositories;

    for (const repo of coreRepos) {
      const existingRepo = await db
        .select()
        .from(codeNestRepositories)
        .where((repos) => repos.repoId === repo.name)
        .limit(1);

      if (existingRepo.length === 0) {
        await db.insert(codeNestRepositories).values({
          repoId: repo.name,
          repoName: repo.name,
          githubRepoId: String(repo.repo_id),
          subdomain: repo.subdomain,
          status: repo.status,
          lastSyncAt: new Date(),
          metadata: {
            signal_source: 'Signal_To_Chuck',
            core: true,
            declared_by: signalData.declared_by,
          },
          commitCount: 0,
          contributorCount: 0,
          starCount: 0,
          forksCount: 0,
        });
        console.log(`  ✅ Added core repository: ${repo.name}`);
      }
    }

    // Seed VaultTrace Network Nodes
    const vaultNodes: InsertVaultTraceNetwork[] = [
      // NESTVENDOR Layer
      {
        nodeId: 'NEST-CORE-001',
        nodeType: 'NESTVENDOR',
        nodeName: 'CodeNest Core',
        connections: ['VAULT-MESH-001', 'VAULT-TRACE-001'],
        traceLayer: 'VAULT_TRACE',
        claqtneqtEnabled: true,
        position: { x: 100, y: 100 },
        metadata: { role: 'primary', priority: 1 },
        isActive: true,
      },
      {
        nodeId: 'NEST-SEED-001',
        nodeType: 'NESTVENDOR',
        nodeName: 'Seedwave Admin',
        connections: ['VAULT-TRACE-001', 'KAU-001'],
        traceLayer: 'KAU_TRACE',
        claqtneqtEnabled: true,
        position: { x: 200, y: 100 },
        metadata: { role: 'admin', priority: 1 },
        isActive: true,
      },
      // VAULTMESH Layer
      {
        nodeId: 'VAULT-MESH-001',
        nodeType: 'VAULTMESH',
        nodeName: 'VaultMesh Core',
        connections: ['NEST-CORE-001', 'CLAIM-001', 'VAULT-TRACE-001'],
        traceLayer: 'VAULT_TRACE',
        claqtneqtEnabled: true,
        position: { x: 150, y: 200 },
        metadata: { role: 'vault', priority: 1 },
        isActive: true,
      },
      {
        nodeId: 'VAULT-FAA-001',
        nodeType: 'VAULTMESH',
        nodeName: 'FAA.Zone Hub',
        connections: ['VAULT-MESH-001', 'NEST-SEED-001'],
        traceLayer: 'CLAIM_TRACE',
        claqtneqtEnabled: true,
        position: { x: 250, y: 200 },
        metadata: { role: 'hub', priority: 2 },
        isActive: true,
      },
      // TRACE Layers
      {
        nodeId: 'KAU-001',
        nodeType: 'CORE',
        nodeName: 'KAU Trace Node',
        connections: ['NEST-SEED-001', 'CLAIM-001'],
        traceLayer: 'KAU_TRACE',
        claqtneqtEnabled: true,
        position: { x: 300, y: 150 },
        metadata: { role: 'trace', type: 'kau' },
        isActive: true,
      },
      {
        nodeId: 'CLAIM-001',
        nodeType: 'CORE',
        nodeName: 'Claim Trace Node',
        connections: ['KAU-001', 'VAULT-MESH-001', 'VAULT-TRACE-001'],
        traceLayer: 'CLAIM_TRACE',
        claqtneqtEnabled: true,
        position: { x: 200, y: 250 },
        metadata: { role: 'trace', type: 'claim' },
        isActive: true,
      },
      {
        nodeId: 'VAULT-TRACE-001',
        nodeType: 'CORE',
        nodeName: 'Vault Trace Node',
        connections: ['CLAIM-001', 'VAULT-MESH-001', 'NEST-CORE-001', 'NEST-SEED-001'],
        traceLayer: 'VAULT_TRACE',
        claqtneqtEnabled: true,
        position: { x: 100, y: 250 },
        metadata: { role: 'trace', type: 'vault' },
        isActive: true,
      },
      // HotStack Integration
      {
        nodeId: 'HOTSTACK-001',
        nodeType: 'NESTVENDOR',
        nodeName: 'HotStack Deploy',
        connections: ['NEST-CORE-001', 'VAULT-MESH-001'],
        traceLayer: 'VAULT_TRACE',
        claqtneqtEnabled: true,
        position: { x: 50, y: 150 },
        metadata: { role: 'deployment', priority: 2 },
        isActive: true,
      },
      // Fruitful Integration
      {
        nodeId: 'FRUITFUL-001',
        nodeType: 'NESTVENDOR',
        nodeName: 'Fruitful Planet',
        connections: ['NEST-SEED-001', 'VAULT-FAA-001'],
        traceLayer: 'KAU_TRACE',
        claqtneqtEnabled: true,
        position: { x: 300, y: 100 },
        metadata: { role: 'integration', priority: 2 },
        isActive: true,
      },
      // Banimal Integration
      {
        nodeId: 'BANIMAL-001',
        nodeType: 'VAULTMESH',
        nodeName: 'Banimal Charity',
        connections: ['VAULT-MESH-001', 'CLAIM-001'],
        traceLayer: 'CLAIM_TRACE',
        claqtneqtEnabled: true,
        position: { x: 100, y: 300 },
        metadata: { role: 'charitable', priority: 2 },
        isActive: true,
      },
    ];

    for (const node of vaultNodes) {
      const existing = await db
        .select()
        .from(vaultTraceNetwork)
        .where((nodes) => nodes.nodeId === node.nodeId)
        .limit(1);

      if (existing.length === 0) {
        await db.insert(vaultTraceNetwork).values(node);
        console.log(`  ✅ Added vault node: ${node.nodeName} (${node.traceLayer})`);
      }
    }

    // Seed Initial Ecosystem Pulse
    const initialPulse: InsertEcosystemPulse = {
      pulseId: `PULSE-INITIAL-${Date.now()}`,
      timestamp: new Date(),
      vaultIds: ['VAULT-TRACE-001', 'VAULT-MESH-001'],
      activeSectors: [
        { id: 1, name: 'Agriculture & Biotech', status: 'active' },
        { id: 2, name: 'Banking & Finance', status: 'active' },
        { id: 3, name: 'Creative Tech', status: 'active' },
      ],
      brandHealth: [
        { sector: 'Agriculture', health: 95, brands: 84 },
        { sector: 'Banking', health: 92, brands: 60 },
        { sector: 'Creative', health: 98, brands: 10 },
      ],
      codenestDigest: coreRepos.map((repo) => ({
        name: repo.name,
        status: repo.status,
        subdomain: repo.subdomain,
      })),
      signalStrength: 100,
      seedwaveMetadata: {
        signal_id: signalData.signal_id,
        declared_by: signalData.declared_by,
        platform: signalData.platform,
        status: signalData.status,
      },
      networkGraphData: {
        nodes: vaultNodes.length,
        layers: ['KAU_TRACE', 'CLAIM_TRACE', 'VAULT_TRACE'],
        claqtneqt_enabled: true,
      },
      pulseSource: 'system-seed',
      status: 'active',
      forwardedToGithub: false,
      metadata: {
        seeded: true,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };

    const existingPulse = await db
      .select()
      .from(ecosystemPulses)
      .where((pulses) => pulses.pulseSource === 'system-seed')
      .limit(1);

    if (existingPulse.length === 0) {
      await db.insert(ecosystemPulses).values(initialPulse);
      console.log('  ✅ Created initial ecosystem pulse');
    }

    console.log('✅ Ecosystem Pulse integration data seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed ecosystem pulse data:', error);
    throw error;
  }
}
