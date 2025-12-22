/**
 * Example Unit Test: Cache
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { cache, CacheKeyBuilder } from '../../server/cache';

describe('Cache', () => {
  beforeEach(async () => {
    await cache.clear();
  });

  it('should set and get values', async () => {
    await cache.set('test_key', 'test_value');
    const value = await cache.get('test_key');
    expect(value).toBe('test_value');
  });

  it('should return null for non-existent keys', async () => {
    const value = await cache.get('non_existent');
    expect(value).toBeNull();
  });

  it('should delete keys', async () => {
    await cache.set('test_key', 'test_value');
    await cache.del('test_key');
    const value = await cache.get('test_key');
    expect(value).toBeNull();
  });

  it('should check key existence', async () => {
    await cache.set('test_key', 'test_value');
    expect(await cache.has('test_key')).toBe(true);
    expect(await cache.has('non_existent')).toBe(false);
  });

  it('should expire keys based on TTL', async () => {
    await cache.set('test_key', 'test_value', 1); // 1 second TTL

    // Should exist immediately
    let value = await cache.get('test_key');
    expect(value).toBe('test_value');

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Should be expired
    value = await cache.get('test_key');
    expect(value).toBeNull();
  });
});

describe('CacheKeyBuilder', () => {
  it('should build cache keys', () => {
    const key = new CacheKeyBuilder('test').add('user').add(123).build();

    expect(key).toBe('test:user:123');
  });

  it('should use default prefix', () => {
    const key = new CacheKeyBuilder().add('session').build();

    expect(key).toContain('fruitfulplanet:');
  });
});
