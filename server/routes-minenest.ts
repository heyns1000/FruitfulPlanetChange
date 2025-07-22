import type { Express } from "express";
import { storage } from "./storage";

export function registerMineNestRoutes(app: Express) {
  // MineNest comprehensive mining dashboard API
  app.get("/api/mining/dashboard", async (req, res) => {
    try {
      // Get mining sector
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      // Get mining brands only
      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const parentBrands = miningBrands.filter(brand => !brand.parentId);
      const subnodes = miningBrands.filter(brand => brand.parentId);

      // Calculate mining-specific metrics
      const totalActiveRigs = parentBrands.reduce((sum, brand) => 
        sum + (brand.metadata?.activeRigs || 0), 0
      );
      
      const totalMonthlyYield = parentBrands.reduce((sum, brand) => 
        sum + (brand.metadata?.monthlyYield || 0), 0
      );

      const avgPerformance = Math.round(
        parentBrands.reduce((sum, brand) => sum + (brand.metadata?.performance || 90), 0) / parentBrands.length
      );

      // Core systems count (A+ and A tier brands)
      const coreSystems = parentBrands.filter(brand => 
        brand.metadata?.tier === "A+" || brand.metadata?.tier === "A"
      ).length;

      const dashboardData = {
        sector: miningSector,
        totalBrands: parentBrands.length,
        totalSubnodes: subnodes.length,
        totalElements: miningBrands.length,
        parentBrands,
        subnodes,
        metrics: {
          totalActiveRigs,
          totalMonthlyYield,
          avgPerformance,
          coreSystems,
          integrationTier: "100%", // All mining brands have integration
          activeBrands: parentBrands.filter(b => b.status === "active").length
        },
        recentActivities: [
          { action: "Ore Extraction", brand: "MineNest™", timestamp: "2 min ago", status: "active" },
          { action: "Quality Control", brand: "DrillCoreX™", timestamp: "5 min ago", status: "completed" },
          { action: "Vault Sync", brand: "VaultRock™", timestamp: "8 min ago", status: "active" },
          { action: "Performance Check", brand: "OreSync™", timestamp: "12 min ago", status: "completed" }
        ]
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching mining dashboard:", error);
      res.status(500).json({ message: "Failed to fetch mining dashboard data" });
    }
  });

  // MineCore™ brands API
  app.get("/api/mining/minecore-brands", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const minecoreBrands = miningBrands.filter(brand => 
        brand.integration === "MineCore™" || brand.name?.includes("MineCore")
      );

      res.json(minecoreBrands);
    } catch (error) {
      console.error("Error fetching MineCore brands:", error);
      res.status(500).json({ message: "Failed to fetch MineCore brands" });
    }
  });

  // Mining performance metrics API
  app.get("/api/mining/metrics", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const parentBrands = miningBrands.filter(brand => !brand.parentId);

      // Generate performance trends (6 months)
      const performanceTrends = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      let baseValue = 4000;
      
      for (let i = 0; i < months.length; i++) {
        baseValue += Math.floor(Math.random() * 800) + 200;
        performanceTrends.push({
          month: months[i],
          value: baseValue
        });
      }

      // Brand status distribution
      const activeCount = parentBrands.filter(b => b.status === "active").length;
      const developmentCount = parentBrands.filter(b => b.status === "development").length;
      const coreCount = parentBrands.filter(b => b.metadata?.tier === "A+" || b.metadata?.tier === "A").length;

      const metricsData = {
        performanceTrends,
        statusDistribution: {
          active: Math.round((activeCount / parentBrands.length) * 100),
          core: Math.round((coreCount / parentBrands.length) * 100),
          development: Math.round((developmentCount / parentBrands.length) * 100)
        },
        realTimeStats: {
          totalElements: miningBrands.length,
          activeBrands: activeCount,
          coreSystems: coreCount,
          integration: "100%"
        }
      };

      res.json(metricsData);
    } catch (error) {
      console.error("Error fetching mining metrics:", error);
      res.status(500).json({ message: "Failed to fetch mining metrics" });
    }
  });
}