import { z } from 'zod';

export const IntegrationRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  brandId: z.string().uuid('Invalid brand ID format'),
  integrationType: z.enum(['brand_license', 'sector_integration', 'api_access']),
  targetDomain: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const DeploymentStatusSchema = z.object({
  deploymentId: z.string(),
  userId: z.string(),
  brandName: z.string(),
  status: z.enum(['pending', 'building', 'deploying', 'success', 'failed']),
  errorMessage: z.string().optional(),
  deploymentUrl: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  steps: z.array(z.object({
    name: z.string(),
    completed: z.boolean(),
  })),
});

export type IntegrationRequest = z.infer<typeof IntegrationRequestSchema>;
export type DeploymentStatus = z.infer<typeof DeploymentStatusSchema>;
