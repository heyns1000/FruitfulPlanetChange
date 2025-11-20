/**
 * Test setup file
 * Runs before all tests
 */

import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
  
  // Add any global test setup here
});

afterAll(async () => {
  // Add any global test cleanup here
});
