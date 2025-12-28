-- Migration: Add integration_deployments table
-- Created: 2025-12-13
-- Phase 1: Integration Webhook Foundation

CREATE TABLE IF NOT EXISTS integration_deployments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  integration_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  deployment_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_integration_deployments_user_id ON integration_deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_deployments_brand_id ON integration_deployments(brand_id);
CREATE INDEX IF NOT EXISTS idx_integration_deployments_status ON integration_deployments(status);
CREATE INDEX IF NOT EXISTS idx_integration_deployments_created_at ON integration_deployments(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE integration_deployments IS 'Tracks integration deployments through FruitfulPlanetChange → LicenseVault → CodeNest → Production pipeline';
COMMENT ON COLUMN integration_deployments.integration_type IS 'Type of integration: brand_license, sector_integration, or api_access';
COMMENT ON COLUMN integration_deployments.status IS 'Deployment status: pending, building, deploying, success, or failed';
