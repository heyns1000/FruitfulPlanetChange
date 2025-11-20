/**
 * Metrics Middleware - Prometheus-compatible metrics
 * 
 * Collects and exposes application metrics for monitoring:
 * - HTTP request duration
 * - Request count by status code
 * - Error rates
 * - Active connections
 * - Custom business metrics
 */

import { Request, Response, NextFunction } from 'express';

interface Metrics {
  requests: {
    total: number;
    byStatusCode: Map<number, number>;
    byMethod: Map<string, number>;
    byPath: Map<string, number>;
  };
  responses: {
    duration: {
      sum: number;
      count: number;
      histogram: Map<string, number>; // Buckets: <100ms, <500ms, <1000ms, <5000ms, >5000ms
    };
  };
  errors: {
    total: number;
    byType: Map<string, number>;
  };
  connections: {
    active: number;
    total: number;
  };
  business: Map<string, number>;
}

const metrics: Metrics = {
  requests: {
    total: 0,
    byStatusCode: new Map(),
    byMethod: new Map(),
    byPath: new Map(),
  },
  responses: {
    duration: {
      sum: 0,
      count: 0,
      histogram: new Map([
        ['100', 0],
        ['500', 0],
        ['1000', 0],
        ['5000', 0],
        ['inf', 0],
      ]),
    },
  },
  errors: {
    total: 0,
    byType: new Map(),
  },
  connections: {
    active: 0,
    total: 0,
  },
  business: new Map(),
};

/**
 * Middleware to track request metrics
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Increment active connections
  metrics.connections.active++;
  metrics.connections.total++;

  // Track request
  metrics.requests.total++;
  metrics.requests.byMethod.set(
    req.method,
    (metrics.requests.byMethod.get(req.method) || 0) + 1
  );

  // Normalize path for tracking (remove IDs)
  const normalizedPath = req.path.replace(/\/\d+/g, '/:id');
  metrics.requests.byPath.set(
    normalizedPath,
    (metrics.requests.byPath.get(normalizedPath) || 0) + 1
  );

  // Track response
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Track status code
    metrics.requests.byStatusCode.set(
      res.statusCode,
      (metrics.requests.byStatusCode.get(res.statusCode) || 0) + 1
    );

    // Track duration
    metrics.responses.duration.sum += duration;
    metrics.responses.duration.count++;

    // Update histogram
    if (duration < 100) {
      metrics.responses.duration.histogram.set('100', 
        (metrics.responses.duration.histogram.get('100') || 0) + 1);
    } else if (duration < 500) {
      metrics.responses.duration.histogram.set('500', 
        (metrics.responses.duration.histogram.get('500') || 0) + 1);
    } else if (duration < 1000) {
      metrics.responses.duration.histogram.set('1000', 
        (metrics.responses.duration.histogram.get('1000') || 0) + 1);
    } else if (duration < 5000) {
      metrics.responses.duration.histogram.set('5000', 
        (metrics.responses.duration.histogram.get('5000') || 0) + 1);
    } else {
      metrics.responses.duration.histogram.set('inf', 
        (metrics.responses.duration.histogram.get('inf') || 0) + 1);
    }

    // Track errors
    if (res.statusCode >= 400) {
      metrics.errors.total++;
      const errorType = res.statusCode >= 500 ? '5xx' : '4xx';
      metrics.errors.byType.set(errorType, (metrics.errors.byType.get(errorType) || 0) + 1);
    }

    // Decrement active connections
    metrics.connections.active--;
  });

  next();
}

/**
 * Record a custom business metric
 */
export function recordMetric(name: string, value: number = 1) {
  metrics.business.set(name, (metrics.business.get(name) || 0) + value);
}

/**
 * Increment a counter metric
 */
export function incrementCounter(name: string) {
  recordMetric(name, 1);
}

/**
 * Get current metrics snapshot
 */
export function getMetrics(): Metrics {
  return metrics;
}

/**
 * Format metrics in Prometheus text format
 */
export function formatPrometheusMetrics(): string {
  const lines: string[] = [];

  // Request metrics
  lines.push('# HELP http_requests_total Total number of HTTP requests');
  lines.push('# TYPE http_requests_total counter');
  lines.push(`http_requests_total ${metrics.requests.total}`);
  lines.push('');

  lines.push('# HELP http_requests_by_status HTTP requests by status code');
  lines.push('# TYPE http_requests_by_status counter');
  metrics.requests.byStatusCode.forEach((count, statusCode) => {
    lines.push(`http_requests_by_status{status_code="${statusCode}"} ${count}`);
  });
  lines.push('');

  lines.push('# HELP http_requests_by_method HTTP requests by method');
  lines.push('# TYPE http_requests_by_method counter');
  metrics.requests.byMethod.forEach((count, method) => {
    lines.push(`http_requests_by_method{method="${method}"} ${count}`);
  });
  lines.push('');

  // Response duration
  lines.push('# HELP http_response_duration_ms HTTP response duration in milliseconds');
  lines.push('# TYPE http_response_duration_ms summary');
  const avgDuration = metrics.responses.duration.count > 0
    ? metrics.responses.duration.sum / metrics.responses.duration.count
    : 0;
  lines.push(`http_response_duration_ms_sum ${metrics.responses.duration.sum}`);
  lines.push(`http_response_duration_ms_count ${metrics.responses.duration.count}`);
  lines.push(`http_response_duration_ms_avg ${avgDuration.toFixed(2)}`);
  lines.push('');

  lines.push('# HELP http_response_duration_histogram HTTP response duration histogram');
  lines.push('# TYPE http_response_duration_histogram histogram');
  metrics.responses.duration.histogram.forEach((count, bucket) => {
    lines.push(`http_response_duration_histogram{le="${bucket}"} ${count}`);
  });
  lines.push('');

  // Error metrics
  lines.push('# HELP http_errors_total Total number of HTTP errors');
  lines.push('# TYPE http_errors_total counter');
  lines.push(`http_errors_total ${metrics.errors.total}`);
  lines.push('');

  lines.push('# HELP http_errors_by_type HTTP errors by type');
  lines.push('# TYPE http_errors_by_type counter');
  metrics.errors.byType.forEach((count, type) => {
    lines.push(`http_errors_by_type{type="${type}"} ${count}`);
  });
  lines.push('');

  // Connection metrics
  lines.push('# HELP http_connections_active Currently active HTTP connections');
  lines.push('# TYPE http_connections_active gauge');
  lines.push(`http_connections_active ${metrics.connections.active}`);
  lines.push('');

  lines.push('# HELP http_connections_total Total number of HTTP connections');
  lines.push('# TYPE http_connections_total counter');
  lines.push(`http_connections_total ${metrics.connections.total}`);
  lines.push('');

  // Business metrics
  if (metrics.business.size > 0) {
    lines.push('# Business metrics');
    metrics.business.forEach((value, name) => {
      lines.push(`# HELP ${name} Business metric: ${name}`);
      lines.push(`# TYPE ${name} counter`);
      lines.push(`${name} ${value}`);
      lines.push('');
    });
  }

  // Process metrics
  const memUsage = process.memoryUsage();
  lines.push('# HELP process_memory_heap_bytes Process memory heap usage in bytes');
  lines.push('# TYPE process_memory_heap_bytes gauge');
  lines.push(`process_memory_heap_bytes ${memUsage.heapUsed}`);
  lines.push('');

  lines.push('# HELP process_memory_rss_bytes Process memory RSS in bytes');
  lines.push('# TYPE process_memory_rss_bytes gauge');
  lines.push(`process_memory_rss_bytes ${memUsage.rss}`);
  lines.push('');

  lines.push('# HELP process_uptime_seconds Process uptime in seconds');
  lines.push('# TYPE process_uptime_seconds gauge');
  lines.push(`process_uptime_seconds ${process.uptime().toFixed(2)}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Express route handler for /metrics endpoint
 */
export function metricsHandler(_req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(formatPrometheusMetrics());
}

/**
 * Reset all metrics (useful for testing)
 */
export function resetMetrics() {
  metrics.requests.total = 0;
  metrics.requests.byStatusCode.clear();
  metrics.requests.byMethod.clear();
  metrics.requests.byPath.clear();
  metrics.responses.duration.sum = 0;
  metrics.responses.duration.count = 0;
  metrics.responses.duration.histogram.forEach((_, key) => {
    metrics.responses.duration.histogram.set(key, 0);
  });
  metrics.errors.total = 0;
  metrics.errors.byType.clear();
  metrics.connections.active = 0;
  metrics.connections.total = 0;
  metrics.business.clear();
}
