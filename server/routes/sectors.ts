import type { Express } from "express"
import { storage } from "../storage"
import { isAuthenticated } from "../replitAuth"
import { FallbackDataManager } from "../services/fallback-data-manager"

export function registerSectorRoutes(app: Express) {
  // Get all sectors with intelligent fallback
  app.get('/api/sectors', async (req, res) => {
    try {
      const sectors = await storage.getAllSectors()
      res.json(sectors)
    } catch (error) {
      console.error("Database error, using fallback sector data:", error)
      const fallbackSectors = FallbackDataManager.getSectors()
      res.json(fallbackSectors)
    }
  })

  // Get specific sector by ID or slug
  app.get('/api/sectors/:sectorId', async (req, res) => {
    try {
      const { sectorId } = req.params
      
      // Try to find by ID first, then by slug
      let sector = await storage.getSector(parseInt(sectorId))
      if (!sector) {
        // Try finding by slug (name converted to URL-friendly format)
        const sectors = await storage.getAllSectors()
        sector = sectors.find(s => 
          s.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') === sectorId ||
          s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === sectorId
        )
      }
      
      if (!sector) {
        return res.status(404).json({ message: "Sector not found" })
      }
      
      res.json(sector)
    } catch (error) {
      console.error("Error fetching sector:", error)
      res.status(500).json({ message: "Failed to fetch sector" })
    }
  })

  // Get brands for a specific sector with fallback
  app.get('/api/brands', async (req, res) => {
    try {
      const { sectorId } = req.query
      
      if (sectorId) {
        const brands = await storage.getBrandsBySector(parseInt(sectorId as string))
        res.json(brands)
      } else {
        const brands = await storage.getAllBrands()
        res.json(brands)
      }
    } catch (error) {
      console.error("Database error, using fallback brand data:", error)
      const fallbackBrands = FallbackDataManager.getBrands()
      res.json(fallbackBrands)
    }
  })
}