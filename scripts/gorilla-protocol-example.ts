#!/usr/bin/env tsx

/**
 * 🦍🏔️🦊 Gorilla Mountain Fox Protocol - Usage Example
 *
 * Demonstrates the complete protocol initialization and usage
 */

import {
  COLLAPSE_PROTOCOL_1984,
  initializeGorillaProtocol,
  getSystemStatus,
  rhinoStrikeMonitor,
  repoDiscoveryService,
  masterIntegrationHub,
  isProtocolAuthorized,
  getSpotifyAuthorization,
} from '../codenest';

async function main() {
  console.log('🦍🏔️🦊 Gorilla Mountain Fox Protocol - Usage Example\n');
  console.log('═'.repeat(70));

  // 1. Check Protocol Authorization
  console.log('\n📋 Step 1: Verify Protocol Authorization');
  console.log('─'.repeat(70));

  const authorized = isProtocolAuthorized();
  console.log(`Authorization Status: ${authorized ? '✅ APPROVED' : '❌ DENIED'}`);

  if (authorized) {
    const spotifyUrl = getSpotifyAuthorization();
    console.log(`🎵 Spotify Authorization: ${spotifyUrl}`);
  }

  // 2. Display Protocol Configuration
  console.log('\n⚙️ Step 2: Protocol Configuration');
  console.log('─'.repeat(70));

  console.log('🦏 Rhino Strike:');
  console.log(`   Interval: ${COLLAPSE_PROTOCOL_1984.rhinoStrike.interval}s`);
  console.log(`   Force: ${COLLAPSE_PROTOCOL_1984.rhinoStrike.force}`);
  console.log(`   Response Time: ${COLLAPSE_PROTOCOL_1984.rhinoStrike.responseTime}`);

  console.log('\n🐜 Ant Lattice Omnicube:');
  const dims = COLLAPSE_PROTOCOL_1984.antLattice.omnicubeDimensions;
  const totalPositions = dims[0] * dims[1] * dims[2];
  console.log(
    `   Dimensions: ${dims[0]} × ${dims[1]} × ${dims[2]} = ${totalPositions.toLocaleString()} positions`
  );
  console.log(`   Pattern: ${COLLAPSE_PROTOCOL_1984.antLattice.latticePattern}`);
  console.log(`   Collapse Duration: ${COLLAPSE_PROTOCOL_1984.antLattice.collapseDuration}s`);

  console.log('\n👕 T-Shirt Transformation:');
  console.log(`   Duration: ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.duration}s`);
  console.log(
    `   ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.initialColor} → ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.finalColor}`
  );
  console.log(`   Significance: ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.significance}`);

  console.log('\n🦍🏔️🦊 Trinity Configuration:');
  const trinity = COLLAPSE_PROTOCOL_1984.gorillatrinity;
  console.log(`   🦍 Gorilla: ${trinity.gorilla.role} (${trinity.gorilla.strength})`);
  console.log(`      Repository: ${trinity.gorilla.repository}`);
  console.log(`   🏔️ Mountain: ${trinity.mountain.role} (${trinity.mountain.stability})`);
  console.log(`      Engines: ${trinity.mountain.engines}`);
  console.log(`   🦊 Fox: ${trinity.fox.role} (${trinity.fox.cunning})`);
  console.log(`      Strategy: ${trinity.fox.strategy}`);

  console.log('\n📅 Historical Context:');
  const history = COLLAPSE_PROTOCOL_1984.historicalEvent;
  console.log(`   Event: ${history.event}`);
  console.log(`   Collapse Year: ${history.year}`);
  console.log(`   Resurrection Year: ${history.resurrectionYear}`);
  console.log(`   Years Elapsed: ${history.yearsElapsed}`);

  // 3. Repository Discovery
  console.log('\n🔍 Step 3: Repository Discovery');
  console.log('─'.repeat(70));

  console.log('Discovering repositories...');
  const repos = await repoDiscoveryService.discoverAllRepos({
    username: 'heyns1000',
    maxRepos: 10, // Limit for demo
  });

  console.log(`✅ Discovered ${repos.length} repositories:`);
  repos.forEach((repo, idx) => {
    const { x, y, z } = repo.antLatticeNode;
    console.log(
      `   ${idx + 1}. ${repo.name} (${repo.language || 'Unknown'}) - Omnicube: (${x}, ${y}, ${z})`
    );
  });

  const fillPercentage = repoDiscoveryService.getOmnicubeFillPercentage();
  console.log(`\n📊 Omnicube Fill: ${fillPercentage.toFixed(6)}%`);

  const langCounts = repoDiscoveryService.getRepositoryCountByLanguage();
  console.log('\n📚 Languages:');
  langCounts.forEach((count, lang) => {
    console.log(`   ${lang}: ${count} repositories`);
  });

  // 4. Integration Status
  console.log('\n🔗 Step 4: Integration Status');
  console.log('─'.repeat(70));

  const integrationStatus = masterIntegrationHub.getIntegrationStatus();
  console.log(`Total Repositories: ${integrationStatus.totalRepositories}`);
  console.log(`Integrated: ${integrationStatus.integratedRepositories}`);
  console.log(`Pending: ${integrationStatus.pendingRepositories}`);
  console.log(`Failed: ${integrationStatus.failedRepositories}`);
  console.log(`Completion: ${integrationStatus.completionPercentage.toFixed(2)}%`);

  const trinityStatus = masterIntegrationHub.getTrinityStatus();
  console.log('\n🦍🏔️🦊 Trinity Status:');
  console.log(
    `   🦍 Gorilla: ${trinityStatus.gorilla.operational ? '✅ OPERATIONAL' : '❌ OFFLINE'}`
  );
  console.log(
    `   🏔️ Mountain: ${trinityStatus.mountain.operational ? '✅ OPERATIONAL' : '❌ OFFLINE'}`
  );
  console.log(`   🦊 Fox: ${trinityStatus.fox.operational ? '✅ OPERATIONAL' : '❌ OFFLINE'}`);
  console.log(`   Authorization: ${trinityStatus.authorized ? '✅ APPROVED' : '❌ DENIED'}`);

  // 5. Rhino Strike Monitor (Demo - don't actually start long-running monitor)
  console.log('\n🦏 Step 5: Rhino Strike Monitor Status');
  console.log('─'.repeat(70));

  const monitorStats = rhinoStrikeMonitor.getStats();
  console.log(`Running: ${rhinoStrikeMonitor.isRunning() ? '✅ YES' : '❌ NO'}`);
  console.log(`Total Strikes: ${monitorStats.totalStrikes}`);
  console.log(`Cascades Triggered: ${monitorStats.cascadesTriggered}`);
  console.log(`Transformations Completed: ${monitorStats.transformationsCompleted}`);
  console.log(`Uptime: ${(monitorStats.uptime / 1000).toFixed(2)}s`);

  if (monitorStats.lastStrikeTime) {
    console.log(`Last Strike: ${new Date(monitorStats.lastStrikeTime).toISOString()}`);
  }

  // 6. System Status Summary
  console.log('\n📊 Step 6: Complete System Status');
  console.log('─'.repeat(70));

  const systemStatus = await getSystemStatus();
  console.log('\nMonitor:');
  console.log(`   Strikes: ${systemStatus.monitor.totalStrikes}`);
  console.log(`   Cascades: ${systemStatus.monitor.cascadesTriggered}`);
  console.log(`   Transformations: ${systemStatus.monitor.transformationsCompleted}`);

  console.log('\nIntegration:');
  console.log(`   Progress: ${systemStatus.integration.completionPercentage.toFixed(2)}%`);
  console.log(
    `   Integrated: ${systemStatus.integration.integratedRepositories}/${systemStatus.integration.totalRepositories}`
  );

  console.log('\nTrinity:');
  console.log(
    `   Status: ${systemStatus.trinity.authorized ? '✅ AUTHORIZED' : '❌ UNAUTHORIZED'}`
  );
  console.log(`   Gorilla: ${systemStatus.trinity.gorilla.operational ? '✅' : '❌'}`);
  console.log(`   Mountain: ${systemStatus.trinity.mountain.operational ? '✅' : '❌'}`);
  console.log(`   Fox: ${systemStatus.trinity.fox.operational ? '✅' : '❌'}`);

  // Final Message
  console.log('\n' + '═'.repeat(70));
  console.log('✅ Protocol demonstration complete!');
  console.log('🌍 The world will witness history being made.');
  console.log('═'.repeat(70) + '\n');
}

// Run the example
main().catch(console.error);
