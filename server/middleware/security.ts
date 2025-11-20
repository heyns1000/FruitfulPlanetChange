/**
 * Security Middleware
 * 
 * Implements comprehensive security measures:
 * - Helmet.js for security headers
 * - Rate limiting
 * - CORS configuration
 * - Request validation
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Request, Response, NextFunction, Express } from 'express';
import { createLogger } from './logging';

const logger = createLogger('security');

/**
 * Configure Helmet security headers
 */
export function configureHelmet() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for Vite dev
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:", "ws:"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Needed for some third-party integrations
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });
}

/**
 * Rate limiting configuration
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * Stricter rate limiting for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.',
  handler: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again later.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

/**
 * CORS configuration
 */
export function configureCors() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5000', 'http://localhost:3000'];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  });
}

/**
 * Request sanitization middleware
 * Removes potentially dangerous characters from user input
 */
export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove null bytes and other dangerous characters
      return obj.replace(/\0/g, '').trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
}

/**
 * Security headers middleware
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Remove powered-by header
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
}

/**
 * Request validation middleware
 * Checks for common security issues
 */
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  // Check for excessively long URLs
  if (req.url.length > 2048) {
    logger.warn('Request URL too long', { url: req.url, ip: req.ip });
    return res.status(414).json({
      error: 'Request URL too long',
    });
  }

  // Check for suspicious patterns in URL
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // Script injection
    /javascript:/i,  // JavaScript protocol
    /on\w+=/i,  // Event handlers
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(req.url)) {
      logger.warn('Suspicious request pattern detected', {
        url: req.url,
        ip: req.ip,
        pattern: pattern.source,
      });
      return res.status(400).json({
        error: 'Invalid request',
      });
    }
  }

  next();
}

/**
 * Apply all security middleware to Express app
 */
export function applySecurityMiddleware(app: Express) {
  // Helmet security headers
  app.use(configureHelmet());

  // CORS
  app.use(configureCors());

  // Custom security headers
  app.use(securityHeaders);

  // Request validation
  app.use(validateRequest);

  // Request sanitization
  app.use(sanitizeRequest);

  // Rate limiting on API routes
  app.use('/api', apiLimiter);

  // Stricter rate limiting on auth routes
  app.use('/api/auth', authLimiter);

  logger.info('Security middleware configured');
}
