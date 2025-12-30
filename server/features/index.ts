/**
 * Feature Flags System
 *
 * Runtime feature toggling for gradual rollouts and A/B testing
 */

import { createLogger } from '../middleware/logging';

const logger = createLogger('features');

interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number; // For gradual rollouts (0-100)
}

const defaultFeatures: Record<string, FeatureFlag> = {
  metrics: {
    name: 'metrics',
    enabled: process.env.ENABLE_METRICS === 'true',
    description: 'Enable Prometheus metrics collection',
  },
  cache: {
    name: 'cache',
    enabled: process.env.ENABLE_CACHE === 'true',
    description: 'Enable Redis caching',
  },
  newDashboard: {
    name: 'newDashboard',
    enabled: false,
    description: 'New metrics dashboard design',
    rolloutPercentage: 10, // 10% rollout
  },
  enhancedSearch: {
    name: 'enhancedSearch',
    enabled: false,
    description: 'Enhanced search with full-text capabilities',
    rolloutPercentage: 0,
  },
  aiRecommendations: {
    name: 'aiRecommendations',
    enabled: !!process.env.OPENAI_API_KEY,
    description: 'AI-powered product recommendations',
  },
};

// In-memory feature flag store
let features: Record<string, FeatureFlag> = { ...defaultFeatures };

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: string, userId?: string): boolean {
  const feature = features[featureName];

  if (!feature) {
    logger.warn(`Unknown feature flag: ${featureName}`);
    return false;
  }

  if (!feature.enabled) {
    return false;
  }

  // Gradual rollout based on user ID
  if (feature.rolloutPercentage !== undefined && feature.rolloutPercentage < 100) {
    if (!userId) {
      return false;
    }

    // Use consistent hashing to determine if user is in rollout
    const hash = simpleHash(userId);
    const bucket = hash % 100;
    return bucket < feature.rolloutPercentage;
  }

  return true;
}

/**
 * Get all feature flags
 */
export function getAllFeatures(): Record<string, FeatureFlag> {
  return { ...features };
}

/**
 * Get a specific feature flag
 */
export function getFeature(featureName: string): FeatureFlag | undefined {
  return features[featureName];
}

/**
 * Update a feature flag (runtime configuration)
 */
export function updateFeature(featureName: string, updates: Partial<FeatureFlag>): boolean {
  if (!features[featureName]) {
    logger.error(`Cannot update unknown feature: ${featureName}`);
    return false;
  }

  features[featureName] = {
    ...features[featureName],
    ...updates,
  };

  logger.info('Feature flag updated', {
    feature: featureName,
    updates,
  });

  return true;
}

/**
 * Add a new feature flag
 */
export function addFeature(feature: FeatureFlag): void {
  features[feature.name] = feature;
  logger.info('Feature flag added', { feature: feature.name });
}

/**
 * Remove a feature flag
 */
export function removeFeature(featureName: string): boolean {
  if (!features[featureName]) {
    return false;
  }

  delete features[featureName];
  logger.info('Feature flag removed', { feature: featureName });
  return true;
}

/**
 * Reset features to default
 */
export function resetFeatures(): void {
  features = { ...defaultFeatures };
  logger.info('Feature flags reset to default');
}

/**
 * Simple hash function for consistent rollout
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Express middleware to add feature flags to request
 */
export function featureFlagsMiddleware(req: any, _res: any, next: any) {
  req.features = {
    isEnabled: (featureName: string) => {
      const userId = req.user?.id?.toString();
      return isFeatureEnabled(featureName, userId);
    },
    getAll: getAllFeatures,
  };
  next();
}

// Log initial feature flag state
logger.info('Feature flags initialized', {
  features: Object.keys(features).reduce(
    (acc, key) => {
      acc[key] = features[key].enabled;
      return acc;
    },
    {} as Record<string, boolean>
  ),
});
