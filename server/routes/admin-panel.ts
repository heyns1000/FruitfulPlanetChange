import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Get comprehensive admin panel statistics
router.get('/stats', async (req, res) => {
  try {
    const sectors = await storage.getAllSectors();
    const brands = await storage.getAllBrands();
    
    // Calculate real statistics from database
    const totalSectors = sectors.length;
    const totalBrands = brands.length;
    const coreBrands = brands.filter(b => b.isCore).length;
    const subnodeBrands = brands.filter(b => !b.isCore).length;
    
    // Calculate monthly revenue from real pricing data
    let totalMonthlyRevenue = 0;
    let totalAnnualRevenue = 0;
    
    brands.forEach(brand => {
      if (brand.metadata?.pricing?.monthly) {
        totalMonthlyRevenue += brand.metadata.pricing.monthly;
      }
      if (brand.metadata?.pricing?.annual) {
        totalAnnualRevenue += brand.metadata.pricing.annual;
      }
    });
    
    // Group brands by sector for FAA.ZONE INDEX table
    const sectorStats = {};
    sectors.forEach(sector => {
      const sectorBrands = brands.filter(b => b.sectorId === sector.id);
      const coreCount = sectorBrands.filter(b => b.isCore).length;
      const totalNodes = sectorBrands.length;
      
      // Calculate average monthly fee for sector
      const sectorBrandsWithPricing = sectorBrands.filter(b => b.metadata?.pricing?.monthly);
      const avgMonthlyFee = sectorBrandsWithPricing.length > 0 
        ? sectorBrandsWithPricing.reduce((sum, b) => sum + b.metadata.pricing.monthly, 0) / sectorBrandsWithPricing.length
        : 79.99;
      
      // Determine tier based on pricing
      let tier = 'A';
      if (avgMonthlyFee >= 300) tier = 'A++';
      else if (avgMonthlyFee >= 200) tier = 'A+';
      else if (avgMonthlyFee >= 150) tier = 'A+';
      else if (avgMonthlyFee >= 100) tier = 'A';
      else tier = 'B+';
      
      sectorStats[sector.name] = {
        coreBrands: coreCount,
        totalNodes,
        monthlyFee: Math.round(avgMonthlyFee),
        tier,
        isActive: totalNodes > 0
      };
    });
    
    res.json({
      totalSectors,
      totalBrands,
      coreBrands,
      subnodeBrands,
      totalMonthlyRevenue: Math.round(totalMonthlyRevenue),
      totalAnnualRevenue: Math.round(totalAnnualRevenue),
      avgRevenuePerBrand: Math.round(totalMonthlyRevenue / totalBrands),
      sectorStats,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching admin panel stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin panel statistics' });
  }
});

// Get brands grouped by sector for admin panel
router.get('/brands', async (req, res) => {
  try {
    const sectors = await storage.getAllSectors();
    const brands = await storage.getAllBrands();
    
    const brandsBySector = {};
    
    sectors.forEach(sector => {
      const sectorBrands = brands.filter(b => b.sectorId === sector.id);
      brandsBySector[sector.name] = {
        sector: {
          id: sector.id,
          name: sector.name,
          emoji: sector.emoji
        },
        brands: sectorBrands.map(brand => ({
          id: brand.id,
          name: brand.name,
          description: brand.description,
          isCore: brand.isCore,
          tier: brand.tier,
          status: brand.status,
          pricing: brand.metadata?.pricing || {
            monthly: 79.99,
            annual: 799.99,
            tier: 'standard'
          },
          displayPrice: brand.metadata?.displayPrice || '$79.99'
        }))
      };
    });
    
    res.json(brandsBySector);
    
  } catch (error) {
    console.error('Error fetching admin panel brands:', error);
    res.status(500).json({ error: 'Failed to fetch admin panel brands' });
  }
});

// Get sector breakdown for FAA.ZONE INDEX
router.get('/sector-breakdown', async (req, res) => {
  try {
    const sectors = await storage.getAllSectors();
    const brands = await storage.getAllBrands();
    
    const sectorBreakdown = sectors.map(sector => {
      const sectorBrands = brands.filter(b => b.sectorId === sector.id);
      const coreBrands = sectorBrands.filter(b => b.isCore).length;
      const totalNodes = sectorBrands.length;
      
      // Calculate average pricing
      const brandsWithPricing = sectorBrands.filter(b => b.metadata?.pricing?.monthly);
      const avgMonthlyFee = brandsWithPricing.length > 0 
        ? Math.round(brandsWithPricing.reduce((sum, b) => sum + b.metadata.pricing.monthly, 0) / brandsWithPricing.length)
        : 79;
      
      // Determine tier
      let tier = 'A';
      if (avgMonthlyFee >= 300) tier = 'A++';
      else if (avgMonthlyFee >= 200) tier = 'A+';
      else if (avgMonthlyFee >= 150) tier = 'A+';
      else if (avgMonthlyFee >= 100) tier = 'A';
      else tier = 'B+';
      
      return {
        sector: sector.name,
        coreBrands,
        totalNodes,
        monthlyFee: avgMonthlyFee,
        tier,
        isActive: totalNodes > 0
      };
    }).filter(s => s.isActive);
    
    res.json(sectorBreakdown);
    
  } catch (error) {
    console.error('Error fetching sector breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch sector breakdown' });
  }
});

export default router;