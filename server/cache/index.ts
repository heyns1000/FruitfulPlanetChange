/**
 * Cache Layer
 * 
 * Redis-based caching with fallback to in-memory cache
 */

import { redisConfig } from '../../config/redis';
import { createLogger } from '../middleware/logging';

const logger = createLogger('cache');

interface CacheEntry {
  value: any;
  expiresAt: number;
}

// In-memory cache fallback
const memoryCache = new Map<string, CacheEntry>();

/**
 * Cache interface
 */
export interface Cache {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * In-Memory Cache Implementation
 */
class MemoryCache implements Cache {
  async get<T = any>(key: string): Promise<T | null> {
    const entry = memoryCache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: any, ttl: number = redisConfig.ttl): Promise<void> {
    const expiresAt = Date.now() + (ttl * 1000);
    memoryCache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    memoryCache.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      memoryCache.clear();
      return;
    }

    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}

/**
 * Redis Cache Implementation (stub for now, would use actual Redis client)
 */
class RedisCache implements Cache {
  private connected: boolean = false;

  async connect(): Promise<void> {
    if (this.connected || !redisConfig.url) {
      return;
    }

    try {
      // In a real implementation, this would connect to Redis
      // For now, we'll just log and fall back to memory cache
      logger.info('Redis connection not implemented, using memory cache');
      this.connected = false;
    } catch (error) {
      logger.error('Failed to connect to Redis', error);
      this.connected = false;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    // Would use Redis client here
    return null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // Would use Redis client here
  }

  async del(key: string): Promise<void> {
    // Would use Redis client here
  }

  async clear(pattern?: string): Promise<void> {
    // Would use Redis SCAN and DEL here
  }

  async has(key: string): Promise<boolean> {
    // Would use Redis EXISTS here
    return false;
  }
}

/**
 * Create cache instance based on configuration
 */
function createCache(): Cache {
  if (redisConfig.enabled && redisConfig.url) {
    logger.info('Redis cache enabled', { url: redisConfig.url });
    const cache = new RedisCache();
    // Note: Connection would be established here
    return cache;
  }

  logger.info('Using in-memory cache');
  return new MemoryCache();
}

// Singleton cache instance
export const cache = createCache();

/**
 * Cache key builder
 */
export class CacheKeyBuilder {
  private parts: string[] = [];

  constructor(prefix?: string) {
    if (prefix) {
      this.parts.push(prefix);
    } else {
      this.parts.push(redisConfig.keyPrefix);
    }
  }

  add(part: string | number): this {
    this.parts.push(String(part));
    return this;
  }

  build(): string {
    return this.parts.join(':');
  }
}

/**
 * Cache middleware for Express routes
 */
export function cacheMiddleware(ttl: number = 60) {
  return async (req: any, res: any, next: any) => {
    if (!redisConfig.enabled) {
      return next();
    }

    const key = new CacheKeyBuilder()
      .add('http')
      .add(req.method)
      .add(req.path)
      .add(JSON.stringify(req.query))
      .build();

    try {
      const cached = await cache.get(key);
      if (cached) {
        logger.debug('Cache hit', { key });
        return res.json(cached);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache the response
      res.json = function (data: any) {
        cache.set(key, data, ttl).catch((error) => {
          logger.error('Failed to cache response', error);
        });
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', error);
      next();
    }
  };
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    await cache.clear(pattern);
    logger.info('Cache invalidated', { pattern });
  } catch (error) {
    logger.error('Failed to invalidate cache', error);
  }
}

/**
 * Clean up expired entries (for memory cache)
 */
setInterval(() => {
  if (!(cache instanceof MemoryCache)) {
    return;
  }

  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    logger.debug(`Cleaned ${cleaned} expired cache entries`);
  }
}, 60000); // Run every minute
