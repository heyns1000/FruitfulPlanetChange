/**
 * Security Middleware Collection
 * Implements rate limiting, CSRF protection, CORS, and security headers
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import cors from 'cors';
import helmet from 'helmet';

/* Environment Configuration */

function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/* Rate Limiting Configuration */

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from counting (only count errors)
  skip: (req, res) => res.statusCode < 400,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Payment endpoint rate limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment attempts per hour
  message: 'Too many payment attempts, please try again later.',
});

// Create/modify rate limiter
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 create/update operations per minute
  message: 'Too many operations, please slow down.',
});

/* CSRF Protection */

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }
});

// CSRF error handler
export function csrfErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  res.status(403).json({
    error: 'Invalid CSRF token',
    message: 'Form submission rejected. Please refresh and try again.'
  });
}

/* CORS Configuration */

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5000', 'http://localhost:3000'];

export const corsOptions = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400, // 24 hours
});

/* Security Headers */

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.paypal.com", "https://api.sandbox.paypal.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["https://www.paypal.com", "https://www.sandbox.paypal.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
});

/* Input Validation Middleware */

export function validateAmount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }

  const maxAmount = parseFloat(process.env.MAX_TRANSACTION_AMOUNT || '10000');
  if (numAmount > maxAmount) {
    return res.status(400).json({
      error: `Amount exceeds maximum allowed (${maxAmount})`
    });
  }

  // Sanitize amount to 2 decimal places
  req.body.amount = numAmount.toFixed(2);
  next();
}

export function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Sanitize email (lowercase, trim)
  req.body.email = email.toLowerCase().trim();
  next();
}

export function validatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Password requirements
  if (password.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters'
    });
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      error: 'Password must contain at least one uppercase letter'
    });
  }

  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      error: 'Password must contain at least one lowercase letter'
    });
  }

  if (!/[0-9]/.test(password)) {
    return res.status(400).json({
      error: 'Password must contain at least one number'
    });
  }

  next();
}

/* Sanitization Helpers */

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
}

export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/* Error Logging Middleware */

export function errorLogger(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Structured error logging
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
  };

  console.error('ERROR:', JSON.stringify(errorLog, null, 2));

  // Don't expose internal errors to client
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
}

/* Request Logger */

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    console.log('REQUEST:', JSON.stringify(log));
  });

  next();
}

/* Security Audit Logger */

export function auditLogger(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const audit = {
      timestamp: new Date().toISOString(),
      action,
      userId: (req as any).user?.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      path: req.path,
      method: req.method,
    };

    console.log('AUDIT:', JSON.stringify(audit));
    next();
  };
}

/* Authentication Middleware */

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(req as any).user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(req as any).user || (req as any).user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
      message: 'You do not have permission to access this resource'
    });
  }
  next();
}
