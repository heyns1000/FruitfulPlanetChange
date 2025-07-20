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

  app.get("/api/brands/:param", async (req, res) => {
    try {
      const param = req.params.param;
      
      // Check if param is a sector filter like "sectorId=1"
      if (param.startsWith("sectorId=")) {
        const sectorId = parseInt(param.split("=")[1]);
        const brands = await storage.getBrandsBySector(sectorId);
        return res.json(brands);
      }
      
      // Otherwise treat as regular brand ID
      const id = parseInt(param);
      const brand = await storage.getBrand(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
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

  // Legal document viewing and download endpoints
  app.get("/api/legal-documents/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Map document IDs to actual file paths from your legal repository
      const documentPaths: Record<string, string> = {
        'fruitful-holdings-nda': 'attached_assets/legal-main/public/fruitful_holdings_nda.pdf',
        'securesign-portal': 'attached_assets/legal-main/public/securesign_portal.html',
        'seedwave-deployment': 'attached_assets/legal-main/public/fruitful_seedwave_deployment_manual.html',
        'faa-zone-minutes': 'attached_assets/legal-main/public/respitories/faa_zone_minutes_of_meeting.html',
        'firebase-integration': 'attached_assets/legal-main/public/firebase_core_minutes.html',
        'paypal-setup': 'attached_assets/legal-main/public/paypal_setup.html',
        'repository-index': 'attached_assets/legal-main/public/respitories/index.html',
        'codenest-settings': 'attached_assets/legal-main/public/respitories/codenest_settings.html'
      };

      const filePath = documentPaths[id];
      if (!filePath) {
        return res.status(404).json({ error: "Document file not found" });
      }

      const fs = require('fs');
      const path = require('path');
      
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "Document file not found on disk" });
      }

      const fileName = path.basename(fullPath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.sendFile(fullPath);
    } catch (error: any) {
      console.error("Error downloading legal document:", error);
      res.status(500).json({ error: "Failed to download legal document" });
    }
  });

  // Serve legal document for viewing
  app.get("/legal-docs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Map document IDs to actual file paths from your legal repository
      const documentPaths: Record<string, string> = {
        'fruitful-holdings-nda': 'attached_assets/legal-main/public/fruitful_holdings_nda.pdf',
        'securesign-portal': 'attached_assets/legal-main/public/securesign_portal.html',
        'seedwave-deployment': 'attached_assets/legal-main/public/fruitful_seedwave_deployment_manual.html',
        'faa-zone-minutes': 'attached_assets/legal-main/public/respitories/faa_zone_minutes_of_meeting.html',
        'firebase-integration': 'attached_assets/legal-main/public/firebase_core_minutes.html',
        'paypal-setup': 'attached_assets/legal-main/public/paypal_setup.html',
        'repository-index': 'attached_assets/legal-main/public/respitories/index.html',
        'codenest-settings': 'attached_assets/legal-main/public/respitories/codenest_settings.html'
      };

      const filePath = documentPaths[id];
      if (!filePath) {
        return res.status(404).send("<h1>Document not found</h1>");
      }

      const fs = require('fs');
      const path = require('path');
      
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).send("<h1>Document file not found</h1>");
      }

      // Set appropriate content type
      const ext = path.extname(fullPath).toLowerCase();
      if (ext === '.html') {
        res.setHeader('Content-Type', 'text/html');
      } else if (ext === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
      }

      res.sendFile(fullPath);
    } catch (error: any) {
      console.error("Error serving legal document:", error);
      res.status(500).send("<h1>Error loading document</h1>");
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

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      const sectors = await storage.getAllSectors();
      
      // Calculate real stats from data
      const totalElements = brands.length;
      const coreBrands = brands.filter(b => b.isCore).length;
      const subNodes = brands.filter(b => b.parentId).length;
      const sectorsCount = sectors.length;
      
      // Integration tier distribution
      const tier1 = brands.filter(b => b.integration === "VaultMesh™").length;
      const tier2 = brands.filter(b => b.integration === "HotStack").length; 
      const tier3 = brands.filter(b => b.integration === "FAA.ZONE™").length;
      
      res.json({
        totalElements,
        coreBrands,
        subNodes,
        sectors: sectorsCount,
        integrationTiers: {
          tier1,
          tier2,
          tier3
        },
        globalRevenue: 12459782,
        marketShare: 87.4,
        growthRate: 23.6
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
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
