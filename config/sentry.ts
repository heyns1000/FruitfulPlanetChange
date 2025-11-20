/**
 * Sentry Configuration
 * 
 * Error tracking and performance monitoring
 */

interface SentryConfig {
  dsn?: string;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  debug: boolean;
}

/**
 * Load Sentry configuration
 */
export function getSentryConfig(): SentryConfig {
  return {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV === 'production',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    debug: process.env.NODE_ENV === 'development',
  };
}

/**
 * Initialize Sentry (stub - would use @sentry/node package)
 */
export function initSentry(): void {
  const config = getSentryConfig();

  if (!config.enabled) {
    console.log('Sentry is disabled');
    return;
  }

  console.log('Sentry initialized', {
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
  });

  // In a real implementation:
  // import * as Sentry from '@sentry/node';
  // 
  // Sentry.init({
  //   dsn: config.dsn,
  //   environment: config.environment,
  //   tracesSampleRate: config.tracesSampleRate,
  //   debug: config.debug,
  // });
}

/**
 * Capture exception (stub)
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  const config = getSentryConfig();

  if (!config.enabled) {
    console.error('Error:', error, context);
    return;
  }

  // In a real implementation:
  // Sentry.captureException(error, { extra: context });
  console.error('Sentry would capture:', error, context);
}

/**
 * Capture message (stub)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  const config = getSentryConfig();

  if (!config.enabled) {
    console.log(`[${level}] ${message}`);
    return;
  }

  // In a real implementation:
  // Sentry.captureMessage(message, level);
  console.log(`Sentry would capture message [${level}]:`, message);
}

/**
 * Set user context (stub)
 */
export function setUser(user: { id: string; email?: string; username?: string }): void {
  const config = getSentryConfig();

  if (!config.enabled) {
    return;
  }

  // In a real implementation:
  // Sentry.setUser(user);
}

/**
 * Express error handler middleware
 */
export function sentryErrorHandler() {
  return (err: Error, req: any, res: any, next: any) => {
    captureException(err, {
      method: req.method,
      path: req.path,
      query: req.query,
    });
    next(err);
  };
}
