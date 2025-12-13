import type { Express } from 'express';
import { storage } from '../storage';
import fs from 'fs';
import path from 'path';

export default function registerMarketplacePackagesRoutes(app: Express) {
  
  /**
   * GET /api/marketplace/packages
   * Browse all marketplace packages with optional filters
   */
  app.get('/api/marketplace/packages', async (req, res) => {
    try {
      const { tier, brandId, search } = req.query;

      let packages;

      if (tier && typeof tier === 'string') {
        packages = await storage.getMarketplacePackagesByTier(tier);
      } else if (brandId) {
        const brandIdNum = parseInt(brandId as string);
        packages = await storage.getMarketplacePackagesByBrand(brandIdNum);
      } else {
        packages = await storage.getAllMarketplacePackages();
      }

      // Apply search filter if provided
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        packages = packages.filter(pkg => 
          pkg.packageName.toLowerCase().includes(searchLower) ||
          pkg.description?.toLowerCase().includes(searchLower)
        );
      }

      res.json(packages);
    } catch (error) {
      console.error('Error fetching marketplace packages:', error);
      res.status(500).json({ 
        error: 'Failed to fetch marketplace packages',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/marketplace/packages/:id
   * Get detailed information about a specific package
   */
  app.get('/api/marketplace/packages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid package ID' });
      }

      const pkg = await storage.getMarketplacePackage(id);

      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }

      // Get associated brand information
      const brand = await storage.getBrand(pkg.brandId);

      // Get package versions
      const versions = await storage.getPackageVersions(id);

      res.json({
        ...pkg,
        brand,
        versions,
      });
    } catch (error) {
      console.error('Error fetching package details:', error);
      res.status(500).json({ 
        error: 'Failed to fetch package details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/marketplace/packages/:id/download
   * Download a package ZIP file
   */
  app.get('/api/marketplace/packages/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid package ID' });
      }

      const pkg = await storage.getMarketplacePackage(id);

      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }

      if (!pkg.filePath || !fs.existsSync(pkg.filePath)) {
        return res.status(404).json({ error: 'Package file not found on server' });
      }

      // Create download tracking record
      const downloadRecord = await storage.createPackageDownload({
        packageId: pkg.id,
        userId: (req.user as any)?.id || null, // Use authenticated user if available
        ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        completed: false,
      });

      // Increment download count
      await storage.incrementPackageDownloadCount(pkg.id);

      // Set response headers for file download
      const fileName = path.basename(pkg.filePath);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pkg.fileSize || 0);
      res.setHeader('X-Package-Name', pkg.packageName);
      res.setHeader('X-Package-Version', pkg.version);

      // Stream the file
      const fileStream = fs.createReadStream(pkg.filePath);
      
      fileStream.on('error', async (error) => {
        console.error('Error streaming package file:', error);
        res.status(500).json({ 
          error: 'Failed to download package',
          message: 'Error reading package file'
        });
      });

      fileStream.on('end', async () => {
        // Mark download as completed
        await storage.updatePackageDownloadCompleted(downloadRecord.id, true);
      });

      fileStream.pipe(res);

    } catch (error) {
      console.error('Error downloading package:', error);
      res.status(500).json({ 
        error: 'Failed to download package',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/marketplace/packages/stats
   * Get statistics about marketplace packages
   */
  app.get('/api/marketplace/packages/stats', async (req, res) => {
    try {
      const allPackages = await storage.getAllMarketplacePackages();

      // Calculate statistics
      const totalPackages = allPackages.length;
      const totalDownloads = allPackages.reduce((sum, pkg) => sum + (pkg.downloadCount || 0), 0);
      const tierDistribution = allPackages.reduce((acc, pkg) => {
        acc[pkg.themeTier] = (acc[pkg.themeTier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const appStoreCompatibility = {
        apple: allPackages.filter(pkg => pkg.appleStoreCompatible).length,
        google: allPackages.filter(pkg => pkg.googleStoreCompatible).length,
        microsoft: allPackages.filter(pkg => pkg.microsoftStoreCompatible).length,
        web: allPackages.filter(pkg => pkg.webCompatible).length,
      };

      res.json({
        totalPackages,
        totalDownloads,
        tierDistribution,
        appStoreCompatibility,
        glimpseEnabled: allPackages.filter(pkg => pkg.glimpseEnabled).length,
      });
    } catch (error) {
      console.error('Error fetching package stats:', error);
      res.status(500).json({ 
        error: 'Failed to fetch package statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  console.log('✅ Marketplace packages routes registered');
}
