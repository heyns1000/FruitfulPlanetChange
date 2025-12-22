/**
 * Database Configuration
 *
 * Database connection pooling and configuration
 */

import { z } from 'zod';

const dbConfigSchema = z.object({
  url: z.string().url(),
  poolSize: z.number().default(20),
  idleTimeout: z.number().default(30000),
  connectionTimeout: z.number().default(2000),
  ssl: z.boolean().default(true),
});

export type DatabaseConfig = z.infer<typeof dbConfigSchema>;

/**
 * Load database configuration
 */
export function loadDatabaseConfig(): DatabaseConfig {
  const config = dbConfigSchema.parse({
    url: process.env.DATABASE_URL,
    poolSize: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : undefined,
    idleTimeout: process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : undefined,
    connectionTimeout: process.env.DB_CONNECTION_TIMEOUT
      ? parseInt(process.env.DB_CONNECTION_TIMEOUT)
      : undefined,
    ssl: process.env.DB_SSL !== 'false',
  });

  return config;
}

export const databaseConfig = loadDatabaseConfig();
