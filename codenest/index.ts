/**
 * 🦍🏔️🦊 CodeNest - Gorilla Mountain Fox Protocol
 * 
 * Main entry point for the 84-repository integration system
 * Resurrection of the 1984 Noodle Juice Gorilla Comb collapse
 */

// Configuration
export {
  COLLAPSE_PROTOCOL_1984,
  calculateOmnicubePosition,
  getNextRhinoStrike,
  getTShirtTransformationProgress,
  isProtocolAuthorized,
  getSpotifyAuthorization,
  type CollapseProtocol1984,
  type RhinoStrikeConfig,
  type AntLatticeConfig,
  type TShirtTransformationConfig,
  type GorillaTrinityConfig,
  type HistoricalEventConfig,
} from './config/collapse-protocol-1984';

// Services
export {
  RepoDiscoveryService,
  repoDiscoveryService,
  type Repository,
  type DiscoveryOptions,
} from './services/repo-discovery-service';

// Monitors
export {
  RhinoStrikeMonitor,
  rhinoStrikeMonitor,
  type RhinoStrikeEvent,
  type MonitoringStats,
} from './monitors/rhino-strike-monitor';

// Hub
export {
  MasterIntegrationHub,
  masterIntegrationHub,
  type IntegrationStatus,
  type TrinityStatus,
} from './hub/master-integration';

/**
 * Quick start function to initialize the entire protocol
 * @param username GitHub username (default: heyns1000)
 * @returns Integration status
 */
export async function initializeGorillaProtocol(username: string = 'heyns1000') {
  const { masterIntegrationHub } = await import('./hub/master-integration');
  return await masterIntegrationHub.integrateAll84Repos(username);
}

/**
 * Get current system status
 * @returns Complete system status
 */
export function getSystemStatus() {
  const { rhinoStrikeMonitor } = require('./monitors/rhino-strike-monitor');
  const { masterIntegrationHub } = require('./hub/master-integration');
  
  return {
    monitor: rhinoStrikeMonitor.getStats(),
    integration: masterIntegrationHub.getIntegrationStatus(),
    trinity: masterIntegrationHub.getTrinityStatus(),
  };
}
