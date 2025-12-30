#!/usr/bin/env tsx

/**
 * Bulk Package Generation Script
 * Generates downloadable packages for all active brands in the marketplace
 */

import { storage } from '../storage';
import { PackageGenerator } from '../services/package-generator';
import fs from 'fs';
import path from 'path';

const TEMP_DIR = '/tmp/fruitful-packages';

async function generateAllPackages() {
  console.log('🌟 Starting bulk package generation for Global App Store...\n');

  const generator = new PackageGenerator();
  let successCount = 0;
  let failureCount = 0;
  const failures: Array<{ brandId: number; brandName: string; error: string }> = [];

  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      console.log(`📁 Created temp directory: ${TEMP_DIR}\n`);
    }

    // Fetch all active brands from database
    console.log('📊 Fetching brands from database...');
    const brands = await storage.getAllBrands();
    const activeBrands = brands.filter((brand) => brand.status === 'active');

    console.log(`\n✅ Found ${activeBrands.length} active brands to package`);
    console.log(`📦 Total brands in database: ${brands.length}\n`);
    console.log('─'.repeat(60));

    // Process each brand
    for (let i = 0; i < activeBrands.length; i++) {
      const brand = activeBrands[i];

      try {
        // Progress logging every 100 brands
        if ((i + 1) % 100 === 0) {
          console.log(
            `\n📈 Progress: ${i + 1}/${activeBrands.length} brands processed (${Math.round(((i + 1) / activeBrands.length) * 100)}%)`
          );
          console.log(`✅ Success: ${successCount} | ❌ Failures: ${failureCount}`);
          console.log('─'.repeat(60));
        }

        // Generate package ZIP
        const zipBuffer = await generator.generatePackage(brand);

        // Determine tier for theme configuration
        const tier = determineTier(brand);
        const themeConfig = getThemeConfig(tier);

        // Save ZIP file to temp directory
        const sanitizedName = brand.name
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const fileName = `${sanitizedName}-v1.0.0.zip`;
        const filePath = path.join(TEMP_DIR, fileName);

        fs.writeFileSync(filePath, zipBuffer);

        // Create database record
        const packageRecord = await storage.createMarketplacePackage({
          brandId: brand.id,
          packageName: `@fruitfulplanet/${sanitizedName}`,
          version: '1.0.0',
          description:
            brand.description || `${brand.name} - Powered by FruitfulPlanet Global Marketplace`,
          downloadUrl: `/api/marketplace/packages/${brand.id}/download`,
          fileSize: zipBuffer.length,
          filePath,
          appleStoreCompatible: true,
          googleStoreCompatible: true,
          microsoftStoreCompatible: true,
          webCompatible: true,
          themeTier: tier,
          themeConfig,
          glimpseEnabled: true,
          dependencies: {
            react: '^18.3.1',
            'react-dom': '^18.3.1',
            'framer-motion': '^11.18.2',
            tailwindcss: '^4.1.13',
          },
          keywords: [
            'fruitfulplanet',
            brand.name.toLowerCase(),
            'noodle-nexus',
            'glimpse-of-hope',
            tier,
          ],
          license: 'MIT',
          downloadCount: 0,
          active: true,
        });

        successCount++;

        // Log occasional success details
        if ((i + 1) % 500 === 0 || i < 10) {
          console.log(`✓ Generated: ${brand.name} (ID: ${brand.id}) - Tier: ${tier}`);
        }
      } catch (error) {
        failureCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        failures.push({
          brandId: brand.id,
          brandName: brand.name,
          error: errorMessage,
        });
        console.error(`✗ Failed: ${brand.name} (ID: ${brand.id}) - ${errorMessage}`);
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BULK PACKAGE GENERATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`\n✅ Successfully generated: ${successCount} packages`);
    console.log(`❌ Failed: ${failureCount} packages`);
    console.log(`📁 Package location: ${TEMP_DIR}`);
    console.log(`💾 Total disk space used: ${calculateDiskUsage(TEMP_DIR)}`);

    if (failures.length > 0) {
      console.log(`\n⚠️  Failures (${failures.length}):`);
      failures.forEach((failure, idx) => {
        console.log(
          `   ${idx + 1}. ${failure.brandName} (ID: ${failure.brandId}): ${failure.error}`
        );
      });
    }

    console.log('\n🎉 All packages are ready for global app store distribution!');
    console.log('🌐 Compatible with: Apple Store, Google Play, Microsoft Store, PWA\n');
  } catch (error) {
    console.error('\n❌ CRITICAL ERROR during bulk generation:', error);
    process.exit(1);
  }
}

/**
 * Determine tier from brand metadata
 */
function determineTier(brand: any): string {
  if (brand.metadata && typeof brand.metadata === 'object') {
    const tier = (brand.metadata as any).tier?.toLowerCase();
    if (['sovereign', 'dynastic', 'operational', 'market'].includes(tier)) {
      return tier;
    }
  }
  return 'market'; // default tier
}

/**
 * Get theme configuration for a tier
 */
function getThemeConfig(tier: string): any {
  const themes: Record<string, any> = {
    sovereign: {
      primary: '#9333ea',
      secondary: '#fbbf24',
      accent: '#f59e0b',
      gradient: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)',
      glow: '0 0 20px rgba(147, 51, 234, 0.6)',
    },
    dynastic: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#059669',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
      glow: '0 0 20px rgba(59, 130, 246, 0.6)',
    },
    operational: {
      primary: '#10b981',
      secondary: '#fbbf24',
      accent: '#f59e0b',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      glow: '0 0 20px rgba(16, 185, 129, 0.6)',
    },
    market: {
      primary: '#6b7280',
      secondary: '#14b8a6',
      accent: '#0d9488',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
      glow: '0 0 20px rgba(107, 114, 128, 0.6)',
    },
  };
  return themes[tier] || themes.market;
}

/**
 * Calculate total disk usage of directory
 */
function calculateDiskUsage(dirPath: string): string {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return '0 MB';
  }

  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  });

  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  return `${sizeMB} MB`;
}

// Run the script
if (require.main === module) {
  generateAllPackages()
    .then(() => {
      console.log('✨ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { generateAllPackages };
