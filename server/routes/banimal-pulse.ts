import type { Express } from 'express';
import { db } from '../db';
import {
  ecosystemPulses,
  pulseHistory,
  codeNestRepositories,
  vaultTraceNetwork,
} from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import signalData from '@shared/Signal_To_Chuck.json';

/**
 * Banimal Ecosystem Pulse Routes
 * Handles 9-second pulse integration from WordPress connector
 */
export function registerBanimalPulseRoutes(app: Express) {
  /**
   * POST /api/banimal/pulse
   * Receive and process ecosystem pulse from Banimal WordPress connector
   */
  app.post('/api/banimal/pulse', async (req, res) => {
    try {
      const pulseData = req.body;

      // Validate required fields
      if (!pulseData.timestamp) {
        return res.status(400).json({
          error: 'Missing required field: timestamp',
          status: 'error',
        });
      }

      // Generate unique pulse ID using crypto
      const pulseId = `PULSE-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;

      // Store pulse in database
      const [pulse] = await db
        .insert(ecosystemPulses)
        .values({
          pulseId,
          timestamp: new Date(pulseData.timestamp),
          vaultIds: pulseData.vault_ids || [],
          activeSectors: pulseData.active_sectors || [],
          brandHealth: pulseData.brand_health || [],
          codenestDigest: pulseData.codenest_digest || [],
          signalStrength: pulseData.signal_strength || 100,
          seedwaveMetadata: pulseData.seedwave_metadata || {},
          networkGraphData: pulseData.network_graph_data || {},
          pulseSource: pulseData.source || 'banimal-connector',
          status: 'active',
          forwardedToGithub: false,
          metadata: pulseData.metadata || {},
        })
        .returning();

      // Log pulse receipt in history
      await db.insert(pulseHistory).values({
        pulseId: pulse.pulseId,
        eventType: 'received',
        eventTimestamp: new Date(),
        eventData: { source: pulseData.source || 'banimal-connector' },
        processingTimeMs: 0,
      });

      // Return success response
      res.json({
        status: 'received',
        pulse_id: pulse.pulseId,
        forwarded_to: 'https://github.com/heyns1000',
        timestamp: pulse.timestamp,
        signal_strength: pulse.signalStrength,
        message: 'Pulse received and stored successfully',
      });

      // Asynchronously process pulse (don't wait for this)
      processPulseAsync(pulse.pulseId).catch((err) => {
        console.error('Error processing pulse:', err);
      });
    } catch (error) {
      console.error('Error receiving pulse:', error);
      res.status(500).json({
        error: 'Failed to receive pulse',
        status: 'error',
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * GET /api/banimal/pulse/latest
   * Get the latest ecosystem pulse
   */
  app.get('/api/banimal/pulse/latest', async (req, res) => {
    try {
      const [latestPulse] = await db
        .select()
        .from(ecosystemPulses)
        .orderBy(desc(ecosystemPulses.timestamp))
        .limit(1);

      if (!latestPulse) {
        return res.status(404).json({
          error: 'No pulses found',
          status: 'not_found',
        });
      }

      res.json({
        pulse_id: latestPulse.pulseId,
        timestamp: latestPulse.timestamp,
        vault_ids: latestPulse.vaultIds,
        active_sectors: latestPulse.activeSectors,
        brand_health: latestPulse.brandHealth,
        codenest_digest: latestPulse.codenestDigest,
        signal_strength: latestPulse.signalStrength,
        seedwave_metadata: latestPulse.seedwaveMetadata,
        network_graph_data: latestPulse.networkGraphData,
        status: latestPulse.status,
      });
    } catch (error) {
      console.error('Error fetching latest pulse:', error);
      res.status(500).json({
        error: 'Failed to fetch latest pulse',
        status: 'error',
      });
    }
  });

  /**
   * GET /api/banimal/pulse/history
   * Get pulse history with optional limit
   */
  app.get('/api/banimal/pulse/history', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;

      const pulses = await db
        .select()
        .from(ecosystemPulses)
        .orderBy(desc(ecosystemPulses.timestamp))
        .limit(Math.min(limit, 1000));

      res.json({
        pulses,
        count: pulses.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching pulse history:', error);
      res.status(500).json({
        error: 'Failed to fetch pulse history',
        status: 'error',
      });
    }
  });

  /**
   * GET /api/banimal/pulse/status
   * Get pulse system status (for badges)
   */
  app.get('/api/banimal/pulse/status', async (req, res) => {
    try {
      const [latestPulse] = await db
        .select()
        .from(ecosystemPulses)
        .orderBy(desc(ecosystemPulses.timestamp))
        .limit(1);

      if (!latestPulse) {
        return res.json({
          status: 'no_pulse',
          message: 'No pulses received yet',
          color: 'inactive',
        });
      }

      // Calculate time since last pulse
      const timeSince = Date.now() - new Date(latestPulse.timestamp).getTime();
      const secondsSince = Math.floor(timeSince / 1000);

      let status = 'active';
      let color = 'brightgreen';

      if (secondsSince > 30) {
        status = 'delayed';
        color = 'yellow';
      }
      if (secondsSince > 60) {
        status = 'offline';
        color = 'red';
      }

      res.json({
        status,
        color,
        last_pulse: latestPulse.timestamp,
        seconds_since: secondsSince,
        signal_strength: latestPulse.signalStrength,
        message: `Last pulse ${secondsSince}s ago`,
      });
    } catch (error) {
      console.error('Error checking pulse status:', error);
      res.status(500).json({
        status: 'error',
        color: 'critical',
        message: 'Failed to check pulse status',
      });
    }
  });

  /**
   * GET /api/banimal/signal
   * Get Signal_To_Chuck declaration
   */
  app.get('/api/banimal/signal', async (req, res) => {
    res.json(signalData);
  });

  /**
   * GET /api/banimal/vault-network
   * Get VaultTrace network graph data
   */
  app.get('/api/banimal/vault-network', async (req, res) => {
    try {
      const networkNodes = await db
        .select()
        .from(vaultTraceNetwork)
        .where(eq(vaultTraceNetwork.isActive, true));

      res.json({
        nodes: networkNodes,
        total_nodes: networkNodes.length,
        active_layers: [...new Set(networkNodes.map((n) => n.traceLayer))],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching vault network:', error);
      res.status(500).json({
        error: 'Failed to fetch vault network',
        status: 'error',
      });
    }
  });

  /**
   * GET /api/banimal/codenest/repositories
   * Get all CodeNest repositories metadata
   */
  app.get('/api/banimal/codenest/repositories', async (req, res) => {
    try {
      const repos = await db
        .select()
        .from(codeNestRepositories)
        .orderBy(desc(codeNestRepositories.lastSyncAt));

      const stats = {
        total_repositories: repos.length,
        active_repositories: repos.filter((r) => r.status === 'active').length,
        total_commits: repos.reduce((sum, r) => sum + (r.commitCount || 0), 0),
        total_stars: repos.reduce((sum, r) => sum + (r.starCount || 0), 0),
        total_forks: repos.reduce((sum, r) => sum + (r.forksCount || 0), 0),
      };

      res.json({
        repositories: repos,
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching CodeNest repositories:', error);
      res.status(500).json({
        error: 'Failed to fetch CodeNest repositories',
        status: 'error',
      });
    }
  });
}

/**
 * Asynchronously process pulse (e.g., forward to GitHub, update caches, etc.)
 */
async function processPulseAsync(pulseId: string) {
  const startTime = Date.now();

  try {
    // Log processing start
    await db.insert(pulseHistory).values({
      pulseId,
      eventType: 'processed',
      eventTimestamp: new Date(),
      eventData: { processing: 'started' },
    });

    // Here you would:
    // 1. Forward to GitHub API
    // 2. Update ecosystem-explorer caches
    // 3. Trigger any downstream notifications

    // For now, just mark as processed
    const processingTime = Date.now() - startTime;

    await db.insert(pulseHistory).values({
      pulseId,
      eventType: 'processed',
      eventTimestamp: new Date(),
      eventData: { processing: 'completed' },
      processingTimeMs: processingTime,
    });

    console.log(`✅ Pulse ${pulseId} processed in ${processingTime}ms`);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    await db.insert(pulseHistory).values({
      pulseId,
      eventType: 'processed',
      eventTimestamp: new Date(),
      eventData: { processing: 'failed' },
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      processingTimeMs: processingTime,
    });

    console.error(`❌ Failed to process pulse ${pulseId}:`, error);
  }
}
