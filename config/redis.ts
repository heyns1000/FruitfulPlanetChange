/**
 * Redis Configuration
 * 
 * Redis cache configuration and connection settings
 */

import { z } from 'zod';

const redisConfigSchema = z.object({
  url: z.string().url().optional(),
  enabled: z.boolean().default(false),
  ttl: z.number().default(3600), // Default TTL: 1 hour
  keyPrefix: z.string().default('fruitfulplanet:'),
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;

/**
 * Load Redis configuration
 */
export function loadRedisConfig(): RedisConfig {
  const config = redisConfigSchema.parse({
    url: process.env.REDIS_URL,
    enabled: process.env.ENABLE_CACHE === 'true' && !!process.env.REDIS_URL,
    ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL) : undefined,
    keyPrefix: process.env.REDIS_KEY_PREFIX,
  });

  return config;
}

export const redisConfig = loadRedisConfig();
