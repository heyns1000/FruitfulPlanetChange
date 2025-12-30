/**
 * Health Check Routes
 *
 * Provides liveness and readiness probes for Kubernetes and monitoring
 */

import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { createLogger } from '../middleware/logging';

const router = Router();
const logger = createLogger('health');

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp?: string;
}

interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  checks: {
    database?: HealthCheck;
    memory?: HealthCheck;
    disk?: HealthCheck;
  };
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheck> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    return {
      status: 'healthy',
      message: 'Database connection successful',
    };
  } catch (error: any) {
    logger.error('Database health check failed', error);
    return {
      status: 'unhealthy',
      message: error.message || 'Database connection failed',
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): HealthCheck {
  const memUsage = process.memoryUsage();
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  if (heapUsedPercent > 90) {
    return {
      status: 'unhealthy',
      message: `High memory usage: ${heapUsedPercent.toFixed(1)}%`,
    };
  } else if (heapUsedPercent > 75) {
    return {
      status: 'degraded',
      message: `Elevated memory usage: ${heapUsedPercent.toFixed(1)}%`,
    };
  }

  return {
    status: 'healthy',
    message: `Memory usage: ${heapUsedPercent.toFixed(1)}%`,
  };
}

/**
 * Liveness probe - checks if application is running
 * Returns 200 if the application is alive (can be restarted if this fails)
 */
router.get('/liveness', (_req: Request, res: Response) => {
  // Simple check - if we can respond, we're alive
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Readiness probe - checks if application can serve traffic
 * Returns 200 if ready, 503 if not ready
 */
router.get('/readiness', async (_req: Request, res: Response) => {
  try {
    const checks: HealthCheckResult['checks'] = {};
    let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

    // Check database
    checks.database = await checkDatabase();
    if (checks.database.status === 'unhealthy') {
      overallStatus = 'error';
    } else if (checks.database.status === 'degraded') {
      overallStatus = 'degraded';
    }

    // Check memory
    checks.memory = checkMemory();
    if (checks.memory.status === 'unhealthy') {
      overallStatus = 'error';
    } else if (checks.memory.status === 'degraded' && overallStatus === 'ok') {
      overallStatus = 'degraded';
    }

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };

    // Return 503 if not ready, 200 if ready (even if degraded)
    const statusCode = overallStatus === 'error' ? 503 : 200;
    res.status(statusCode).json(result);
  } catch (error: any) {
    logger.error('Readiness check failed', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: error.message,
    });
  }
});

/**
 * Detailed health check - provides comprehensive health information
 * This is not used by Kubernetes but can be useful for monitoring dashboards
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  try {
    const checks: HealthCheckResult['checks'] = {};
    let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

    // Database check
    checks.database = await checkDatabase();
    if (checks.database.status === 'unhealthy') {
      overallStatus = 'error';
    } else if (checks.database.status === 'degraded') {
      overallStatus = 'degraded';
    }

    // Memory check
    checks.memory = checkMemory();
    if (checks.memory.status === 'unhealthy') {
      overallStatus = 'error';
    } else if (checks.memory.status === 'degraded' && overallStatus === 'ok') {
      overallStatus = 'degraded';
    }

    const memUsage = process.memoryUsage();
    const result = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || 'unknown',
      node: process.version,
      environment: process.env.NODE_ENV || 'development',
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        rss: memUsage.rss,
        external: memUsage.external,
      },
      checks,
    };

    const statusCode = overallStatus === 'error' ? 503 : 200;
    res.status(statusCode).json(result);
  } catch (error: any) {
    logger.error('Detailed health check failed', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

export default router;
