// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment

import express from 'express';
import { registerRoutes } from '../server/routes';
import session from 'express-session';
import {
  apiLimiter,
  corsOptions,
  securityHeaders,
  requestLogger,
  errorLogger
} from '../server/security-middleware';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(requestLogger);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate limiting
app.use('/api/', apiLimiter);

// Initialize routes
let routesRegistered = false;
const initPromise = registerRoutes(app).then(() => {
  routesRegistered = true;
  app.use(errorLogger);
});

// Export for Vercel
export default async function handler(req: any, res: any) {
  // Ensure routes are registered
  if (!routesRegistered) {
    await initPromise;
  }

  // Handle the request
  return app(req, res);
}
