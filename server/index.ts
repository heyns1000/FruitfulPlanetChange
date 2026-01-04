import express, { type Request, Response, NextFunction } from "express";
import { z } from "zod";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-data";
import { seedLegalDocuments } from "./seed-legal";
import { seedAllMiningBrands } from "./mining-brands-seeder";
import { updateSectorPricing } from "./update-sector-pricing";
import { seedComprehensiveBrands } from "./comprehensive-brand-seeder";
import { seedMineNestComprehensive } from "./minenest-comprehensive-seeder";
import { seedEcosystemPulseData } from "./seed-ecosystem-pulse";
import { storage } from "./storage";
import { createLogger } from "./middleware/logging";
import {
  apiLimiter,
  corsOptions,
  securityHeaders,
  requestLogger,
  errorLogger
} from "./security-middleware";

const logger = createLogger('server');

// Environment variable validation schema
const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(5000),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters').optional(),
  REPL_ID: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  ISSUER_URL: z.string().url().optional(),
}).refine((data) => {
  // In production, SESSION_SECRET is required
  if (data.NODE_ENV === 'production' && !data.SESSION_SECRET) {
    return false;
  }
  return true;
}, {
  message: 'SESSION_SECRET is required in production environment',
  path: ['SESSION_SECRET'],
});

// Validate environment variables at startup
try {
  const validatedEnv = envSchema.parse(process.env);
  logger.info('✅ Environment validation passed', {
    nodeEnv: validatedEnv.NODE_ENV,
    port: validatedEnv.PORT,
    hasSessionSecret: !!validatedEnv.SESSION_SECRET,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error('❌ Environment validation failed', {
      errors: error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    console.error('\n🔴 CRITICAL: Environment validation failed!');
    console.error('Missing or invalid environment variables:\n');
    error.errors.forEach(e => {
      console.error(`  - ${e.path.join('.')}: ${e.message}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  throw error;
}

const app = express();

// Security middleware - apply early in the middleware chain
app.use(securityHeaders);
app.use(corsOptions);
app.use(requestLogger);

// Session configuration for cart (guest and user)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Seed database with comprehensive brand data in development
  if (app.get('env') === 'development') {
    try {
      await seedDatabase();
      await seedLegalDocuments();
      console.log('💰 Updating sector pricing structure...');
      await updateSectorPricing();

      console.log('🐻 Seeding Banimal ecosystem for charitable giving...');
      await storage.seedBanimalData();
      console.log('🎬 Seeding Motion, Media & Sonic engines...');
      await storage.seedMediaData();
      console.log('🚀 Seeding Omnilevel Interstellar operations...');
      await storage.seedInterstellarData();
      console.log('🌊 Seeding Ecosystem Pulse integration...');
      await seedEcosystemPulseData();
    } catch (error) {
      console.error('Failed to seed database:', error);
    }
  }

  // Error handling middleware - must be last
  app.use(errorLogger);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get('env') === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);

  // Add error handling for port conflicts
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Server startup failed.`);
      console.log('💡 To fix this:');
      console.log('   1. Stop any other Node.js processes running on this port');
      console.log('   2. Wait a few seconds and try again');
      console.log('   3. Or restart the Replit environment');
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  server.listen(
    {
      port,
      host: '0.0.0.0',
    },
    () => {
      log(`🚀 Server successfully started on port ${port}`);
    }
  );
})();
