/**
 * Logging Middleware - Structured logging with Winston
 *
 * Provides structured JSON logging for:
 * - HTTP requests/responses
 * - Application events
 * - Errors and exceptions
 * - Custom log messages
 */

import { Request, Response, NextFunction } from 'express';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
}

const config: LoggerConfig = {
  level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
};

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Create a structured log entry
 */
function createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
}

/**
 * Check if log level should be logged
 */
function shouldLog(level: LogLevel): boolean {
  return logLevels[level] <= logLevels[config.level];
}

/**
 * Format log entry for console output
 */
function formatForConsole(entry: LogEntry): string {
  const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[90m',
  };
  const reset = '\x1b[0m';

  const levelColor = colors[entry.level];
  const levelStr = entry.level.toUpperCase().padEnd(5);

  let output = `${levelColor}${levelStr}${reset} ${entry.timestamp} ${entry.message}`;

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += `\n${JSON.stringify(entry.context, null, 2)}`;
  }

  return output;
}

/**
 * Write log entry to outputs
 */
function writeLog(entry: LogEntry) {
  if (!shouldLog(entry.level)) {
    return;
  }

  // Console output
  if (config.enableConsole) {
    const formatted = formatForConsole(entry);
    if (entry.level === 'error') {
      console.error(formatted);
    } else if (entry.level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  // File output (in production, this would write to a file)
  if (config.enableFile) {
    // In a real implementation, this would append to a log file
    // For now, we'll just keep it in memory or use a logging service
  }
}

/**
 * Logger class
 */
export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  error(message: string, error?: Error | any, metadata?: Record<string, any>) {
    const context: Record<string, any> = { ...metadata };

    if (this.context) {
      context.component = this.context;
    }

    if (error) {
      context.error = {
        message: error.message,
        stack: error.stack,
        ...error,
      };
    }

    writeLog(createLogEntry('error', message, context));
  }

  warn(message: string, metadata?: Record<string, any>) {
    const context: Record<string, any> = { ...metadata };
    if (this.context) {
      context.component = this.context;
    }
    writeLog(createLogEntry('warn', message, context));
  }

  info(message: string, metadata?: Record<string, any>) {
    const context: Record<string, any> = { ...metadata };
    if (this.context) {
      context.component = this.context;
    }
    writeLog(createLogEntry('info', message, context));
  }

  debug(message: string, metadata?: Record<string, any>) {
    const context: Record<string, any> = { ...metadata };
    if (this.context) {
      context.component = this.context;
    }
    writeLog(createLogEntry('debug', message, context));
  }
}

// Default logger instance
export const logger = new Logger();

/**
 * Create a logger instance with a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Express middleware for request logging
 */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  // Log incoming request
  logger.debug('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level: LogLevel =
      res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    const message = `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`;

    const context = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('content-length'),
    };

    writeLog(createLogEntry(level, message, context));
  });

  next();
}

/**
 * Error logging middleware
 */
export function errorLoggingMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Request error', err, {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
  });

  next(err);
}

/**
 * Set log level at runtime
 */
export function setLogLevel(level: LogLevel) {
  config.level = level;
  logger.info(`Log level changed to ${level}`);
}

/**
 * Get current logger configuration
 */
export function getLogConfig(): LoggerConfig {
  return { ...config };
}
