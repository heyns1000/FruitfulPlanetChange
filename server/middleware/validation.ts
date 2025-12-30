import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware factory for request validation using Zod schemas
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
};

/**
 * Common validation schemas for reuse across routes
 */
export const commonSchemas = {
  /**
   * Validates pagination parameters
   */
  pagination: z.object({
    query: z.object({
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).max(100).optional(),
    }).optional(),
  }),

  /**
   * Validates ID parameter
   */
  idParam: z.object({
    params: z.object({
      id: z.coerce.number().positive(),
    }),
  }),

  /**
   * Validates UUID parameter
   */
  uuidParam: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),

  /**
   * Validates search query
   */
  searchQuery: z.object({
    query: z.object({
      q: z.string().min(1).max(200).optional(),
      search: z.string().min(1).max(200).optional(),
    }).optional(),
  }),
};
