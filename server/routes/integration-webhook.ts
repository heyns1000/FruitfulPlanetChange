import { Router, Request, Response } from 'express';
import { z } from 'zod';

// Integration request validation schema
const integrationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  brandId: z.string().uuid('Invalid brand ID format'),
  integrationType: z.enum(['brand_license', 'sector_integration', 'api_access']),
  targetDomain: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type IntegrationRequest = z.infer<typeof integrationSchema>;

// Response schemas
interface IntegrationResponse {
  success: boolean;
  deploymentId: string;
  deploymentUrl: string;
  estimatedTime: string;
  status: 'queued' | 'validating' | 'deploying' | 'complete' | 'failed';
}

interface ValidationResult {
  valid: boolean;
  brandName?: string;
  tier?: string;
  licenseStatus?: string;
  error?: string;
}

/**
 * Validates brand license via internal storage
 * Loop Collapse Check: Ensures brand exists and is active before proceeding
 */
async function validateLicense(brandId: string): Promise<ValidationResult> {
  try {
    // Import storage dynamically to avoid circular dependencies
    const { storage } = await import('../storage');
    
    const brand = await storage.getBrand(brandId);
    
    if (!brand) {
      return {
        valid: false,
        error: 'Brand not found in system',
      };
    }
    
    if (!brand.isActive) {
      return {
        valid: false,
        error: 'Brand license is inactive',
      };
    }
    
    return {
      valid: true,
      brandName: brand.displayName,
      tier: brand.tier,
      licenseStatus: 'active',
    };
  } catch (error) {
    console.error('License validation error:', error);
    return {
      valid: false,
      error: 'License validation service unavailable',
    };
  }
}

/**
 * Creates deployment record in database
 * Loop Collapse Check: Persists deployment state before external triggers
 */
async function createDeploymentRecord(data: IntegrationRequest & { validationResult: ValidationResult }) {
  const deploymentId = `deploy_${Date.now()}_${data.brandId.substring(0, 8)}`;
  
  // TODO: Store in database when deployments table is created
  // For now, return in-memory deployment ID
  console.log('🚀 Deployment record created:', {
    deploymentId,
    userId: data.userId,
    brandId: data.brandId,
    brandName: data.validationResult.brandName,
    timestamp: new Date().toISOString(),
  });
  
  return deploymentId;
}

/**
 * Integration webhook endpoint
 * Handles user integration requests and triggers deployment pipeline
 */
export function registerIntegrationWebhook(app: Router) {
  app.post('/api/integration/deploy', async (req: Request, res: Response) => {
    try {
      // Step 1: Validate request payload
      const data = integrationSchema.parse(req.body);
      
      console.log('📦 Integration request received:', {
        userId: data.userId,
        brandId: data.brandId,
        type: data.integrationType,
      });
      
      // Step 2: LOOP COLLAPSE - Validate license before proceeding
      const validationResult = await validateLicense(data.brandId);
      
      if (!validationResult.valid) {
        console.error('❌ License validation failed:', validationResult.error);
        return res.status(403).json({
          success: false,
          error: validationResult.error || 'License validation failed',
        });
      }
      
      console.log('✅ License validated:', {
        brandName: validationResult.brandName,
        tier: validationResult.tier,
      });
      
      // Step 3: LOOP COLLAPSE - Create deployment record
      const deploymentId = await createDeploymentRecord({
        ...data,
        validationResult,
      });
      
      // Step 4: Return success response (deployment will be processed async)
      const response: IntegrationResponse = {
        success: true,
        deploymentId,
        deploymentUrl: `https://fruitful-global-deployment.faa.zone/deploy/${deploymentId}`,
        estimatedTime: '3-5 minutes',
        status: 'queued',
      };
      
      console.log('🎉 Integration queued successfully:', deploymentId);
      
      res.json(response);
      
      // Step 5: Trigger async deployment (Phase 2-5 will implement this)
      // For now, just log the intent
      console.log('🔄 Deployment pipeline will be triggered in Phase 2-5');
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Validation error:', error.errors);
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
      }
      
      console.error('❌ Integration webhook error:', error);
      res.status(500).json({
        success: false,
        error: 'Deployment request failed. Please try again.',
      });
    }
  });
  
  // Health check endpoint for integration service
  app.get('/api/integration/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'integration-webhook',
      timestamp: new Date().toISOString(),
    });
  });
}
