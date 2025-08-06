import { Router } from "express";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { storage } from "../storage";
import "../types/session";

const router = Router();

// Schema for access portal registration
const accessRegistrationSchema = z.object({
  type: z.enum(['loyalty', 'shareholder', 'service', 'family']),
  formData: z.record(z.any()),
});

// Schema for access portal login
const accessLoginSchema = z.object({
  type: z.enum(['loyalty', 'shareholder', 'service', 'family']),
  email: z.string().email(),
  password: z.string().optional(),
});

// Register for access portal
router.post("/register", async (req, res) => {
  try {
    const { type, formData } = accessRegistrationSchema.parse(req.body);
    
    // Extract email from formData (different field names for different access types)
    const email = formData.email || formData.officialEmail || formData.contactEmail;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    console.log("📧 Extracted email:", email);
    console.log("📝 Registration data:", { type, email, data: formData, status: 'pending' });
    
    // Store the registration in the database
    const registration = await storage.createAccessRegistration({
      type,
      email: email as string,
      data: formData,
      status: 'pending',
    });

    // For demo purposes, auto-approve the registration
    await storage.approveAccessRegistration(registration.id);

    res.json({ 
      success: true, 
      message: "Registration submitted successfully. You can now log in.",
      registrationId: registration.id 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login to access portal
router.post("/login", async (req, res) => {
  try {
    const { type, email, password } = accessLoginSchema.parse(req.body);
    
    console.log("🔍 Login attempt:", { type, email });
    
    // Find the user registration
    const registration = await storage.findAccessRegistration(type, email);
    
    console.log("👤 Found registration:", registration);
    
    if (!registration || registration.status !== 'approved') {
      console.log("❌ Login failed - no registration or not approved");
      return res.status(401).json({ error: "Invalid credentials or registration not approved" });
    }

    // For family access, verify password
    if (type === 'family' && password) {
      const storedPassword = registration.data.password;
      if (storedPassword !== password) {
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    // Create session
    req.session.accessUser = {
      id: registration.id,
      type,
      email,
      data: registration.data,
    };

    res.json({ 
      success: true, 
      user: {
        id: registration.id,
        type,
        email,
        name: registration.data.fullName || registration.data.representativeName || registration.data.companyName,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Login failed" });
  }
});

// Get current access user
router.get("/user", (req, res) => {
  if (req.session.accessUser) {
    res.json(req.session.accessUser);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.accessUser = null;
  res.json({ success: true });
});

export default router;