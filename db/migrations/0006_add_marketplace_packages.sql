-- Migration: Add Marketplace Packages System for Global App Store
-- Creates tables for downloadable brand packages with noodle_nexus themes

-- Main marketplace packages table
CREATE TABLE IF NOT EXISTS marketplace_packages (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  description TEXT,
  
  -- Download and file information
  download_url TEXT,
  file_size INTEGER, -- in bytes
  file_path TEXT, -- server path to ZIP file
  
  -- App store compatibility flags
  apple_store_compatible BOOLEAN DEFAULT true,
  google_store_compatible BOOLEAN DEFAULT true,
  microsoft_store_compatible BOOLEAN DEFAULT true,
  web_compatible BOOLEAN DEFAULT true,
  
  -- Noodle nexus styling configuration
  theme_tier TEXT NOT NULL, -- sovereign, dynastic, operational, market
  theme_config JSONB DEFAULT '{}', -- stores colors, animations, etc.
  glimpse_enabled BOOLEAN DEFAULT true,
  
  -- Package metadata
  dependencies JSONB DEFAULT '{}', -- package.json dependencies
  keywords TEXT[] DEFAULT '{}',
  license TEXT DEFAULT 'MIT',
  
  -- Statistics
  download_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Package versions table for version history
CREATE TABLE IF NOT EXISTS package_versions (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES marketplace_packages(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT,
  file_path TEXT,
  file_size INTEGER,
  published_at TIMESTAMP DEFAULT NOW(),
  deprecated BOOLEAN DEFAULT false
);

-- Package downloads tracking table
CREATE TABLE IF NOT EXISTS package_downloads (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES marketplace_packages(id) ON DELETE CASCADE,
  user_id VARCHAR,
  ip_address TEXT,
  user_agent TEXT,
  download_timestamp TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_packages_brand_id ON marketplace_packages(brand_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_packages_theme_tier ON marketplace_packages(theme_tier);
CREATE INDEX IF NOT EXISTS idx_marketplace_packages_active ON marketplace_packages(active);
CREATE INDEX IF NOT EXISTS idx_package_versions_package_id ON package_versions(package_id);
CREATE INDEX IF NOT EXISTS idx_package_downloads_package_id ON package_downloads(package_id);
CREATE INDEX IF NOT EXISTS idx_package_downloads_timestamp ON package_downloads(download_timestamp);
