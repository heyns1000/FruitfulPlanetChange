import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBrandSchema, 
  insertSectorSchema, 
  insertLegalDocumentSchema,
  insertRepositorySchema,
  insertPaymentSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sectors API
  app.get("/api/sectors", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sectors" });
    }
  });

  app.get("/api/sectors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sector = await storage.getSector(id);
      if (!sector) {
        return res.status(404).json({ message: "Sector not found" });
      }
      res.json(sector);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sector" });
    }
  });

  // Brands API
  app.get("/api/brands", async (req, res) => {
    try {
      const { search, sectorId } = req.query;
      
      let brands;
      if (search) {
        brands = await storage.getBrandsBySearch(search as string);
      } else if (sectorId) {
        brands = await storage.getBrandsBySector(parseInt(sectorId as string));
      } else {
        brands = await storage.getAllBrands();
      }
      
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await storage.getBrand(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand data" });
    }
  });

  // System Status API
  app.get("/api/system-status", async (req, res) => {
    try {
      const statuses = await storage.getAllSystemStatus();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system status" });
    }
  });

  app.get("/api/system-status/:service", async (req, res) => {
    try {
      const service = req.params.service;
      const status = await storage.getSystemStatus(service);
      if (!status) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service status" });
    }
  });

  // Dashboard stats API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      const sectors = await storage.getAllSectors();
      
      const coreWands = brands.filter(b => b.isCore).length;
      const subnodes = brands.filter(b => !b.isCore).length;
      
      const stats = {
        totalElements: brands.length,
        coreBrands: coreWands,
        subnodes: subnodes,
        sectors: sectors.length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Legal documents endpoints
  app.get("/api/legal-documents", async (req, res) => {
    try {
      const docs = await storage.getLegalDocuments();
      res.json(docs);
    } catch (error: any) {
      console.error("Error fetching legal documents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/legal-documents", async (req, res) => {
    try {
      const result = insertLegalDocumentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.issues });
      }
      
      const doc = await storage.createLegalDocument(result.data);
      res.status(201).json(doc);
    } catch (error: any) {
      console.error("Error creating legal document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Repository endpoints
  app.get("/api/repositories", async (req, res) => {
    try {
      const repos = await storage.getRepositories();
      res.json(repos);
    } catch (error: any) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/repositories", async (req, res) => {
    try {
      const result = insertRepositorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.issues });
      }
      
      const repo = await storage.createRepository(result.data);
      res.status(201).json(repo);
    } catch (error: any) {
      console.error("Error creating repository:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payment endpoints
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/payments/create", async (req, res) => {
    try {
      const result = insertPaymentSchema.safeParse({
        ...req.body,
        userId: 1 // Default user for demo
      });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.issues });
      }
      
      const payment = await storage.createPayment(result.data);
      res.status(201).json(payment);
    } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // VaultMesh checkout endpoint
  app.post("/api/vaultmesh/checkout", async (req, res) => {
    try {
      // Simulate checkout processing
      const { product, customer } = req.body;
      
      // In a real application, this would integrate with PayPal SDK
      const payment = await storage.createPayment({
        userId: 1,
        planName: product.name,
        amount: product.price.toString(),
        currency: product.currency,
        status: "completed"
      });

      res.json({
        success: true,
        paymentId: payment.id,
        orderId: `VM-${Date.now()}`,
        message: "Checkout completed successfully"
      });
    } catch (error: any) {
      console.error("Error processing VaultMesh checkout:", error);
      res.status(500).json({ message: "Checkout processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
