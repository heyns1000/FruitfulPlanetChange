/**
 * Example Unit Test: Metrics Middleware
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getMetrics, resetMetrics, recordMetric } from '../../server/middleware/metrics';

describe('Metrics Middleware', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('should initialize with zero metrics', () => {
    const metrics = getMetrics();
    expect(metrics.requests.total).toBe(0);
    expect(metrics.errors.total).toBe(0);
    expect(metrics.connections.active).toBe(0);
  });

  it('should record custom metrics', () => {
    recordMetric('test_metric', 5);
    const metrics = getMetrics();
    expect(metrics.business.get('test_metric')).toBe(5);
  });

  it('should increment metrics', () => {
    recordMetric('test_counter', 1);
    recordMetric('test_counter', 1);
    recordMetric('test_counter', 1);
    
    const metrics = getMetrics();
    expect(metrics.business.get('test_counter')).toBe(3);
  });

  it('should reset all metrics', () => {
    recordMetric('test_metric', 100);
    resetMetrics();
    
    const metrics = getMetrics();
    expect(metrics.business.get('test_metric')).toBeUndefined();
  });
});
