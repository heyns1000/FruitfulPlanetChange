import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Basic API routes for testing
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), message: "Server is running!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", data: { test: true } });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
  console.error("Server error:", err);
});

// Catch-all route
app.get("*", (req, res) => {
  res.json({ 
    message: "HSOMNI9000 API Server is running", 
    path: req.path, 
    timestamp: new Date().toISOString(),
    availableEndpoints: ["/api/health", "/api/test"]
  });
});

const server = createServer(app);
const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 HSOMNI9000 Minimal Server running on http://0.0.0.0:${port}`);
  console.log(`📡 API endpoints available at http://0.0.0.0:${port}/api/*`);
  console.log(`🔗 Health check: http://0.0.0.0:${port}/api/health`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});