/**
 * Application Configuration
 * 
 * Centralized configuration with environment variable validation
 */

import { z } from 'zod';

const configSchema = z.object({
  // Environment
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(5000),

  // Database
  databaseUrl: z.string().url(),

  // Redis (optional)
  redisUrl: z.string().url().optional(),

  // Session
  sessionSecret: z.string().min(32).optional(),

  // Features
  enableMetrics: z.coerce.boolean().default(true),
  enableCache: z.coerce.boolean().default(false),
  
  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Security
  allowedOrigins: z.string().optional(),
  
  // External Services
  stripeSecretKey: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalClientSecret: z.string().optional(),
  openaiApiKey: z.string().optional(),
  sentryDsn: z.string().optional(),
});

export type AppConfig = z.infer<typeof configSchema>;

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): AppConfig {
  try {
    const config = configSchema.parse({
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      databaseUrl: process.env.DATABASE_URL,
      redisUrl: process.env.REDIS_URL,
      sessionSecret: process.env.SESSION_SECRET,
      enableMetrics: process.env.ENABLE_METRICS,
      enableCache: process.env.ENABLE_CACHE,
      logLevel: process.env.LOG_LEVEL,
      allowedOrigins: process.env.ALLOWED_ORIGINS,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      paypalClientId: process.env.PAYPAL_CLIENT_ID,
      paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
      openaiApiKey: process.env.OPENAI_API_KEY,
      sentryDsn: process.env.SENTRY_DSN,
    });

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid configuration');
    }
    throw error;
  }
}

/**
 * Get current configuration
 */
export const config = loadConfig();

/**
 * Check if running in production
 */
export const isProduction = config.nodeEnv === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = config.nodeEnv === 'development';

/**
 * Check if running in test
 */
export const isTest = config.nodeEnv === 'test';
