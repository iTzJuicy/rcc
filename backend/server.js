import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDB } from "./config/db.js";
import { initSentry } from "./config/sentry.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

function getTrustProxySetting(value) {
  if (!value) return 1;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value.split(",").map((entry) => entry.trim());
}

app.set("trust proxy", getTrustProxySetting(process.env.TRUST_PROXY));

// Initialize Sentry
initSentry();

// Security HTTP headers with strict CSP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com"],
        frameSrc: ["'self'", "https://www.google.com"],
        connectSrc: ["'self'", "https://*.sentry.io", process.env.FRONTEND_URL || "http://localhost:5173"],
      },
    },
  })
);

// Compression for fast API responses (< 500ms)
app.use(compression());

// Strict CORS configuration
const allowedOrigins = [
  ...(process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"]),
  ...(process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use((req, res, next) => {
  // Skip origin-check for static uploads (models, images) so the frontend
  // hosted on a different domain (e.g. Vercel) can fetch them cross-origin.
  if (req.path.startsWith("/uploads/")) return next();

  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: "Origin is not allowed." });
  }
  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body parsers with safe 1MB size limit
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Parse HttpOnly cookies
app.use(cookieParser());

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Middleware to verify database readiness (prevents buffering timeout errors)
app.use((req, res, next) => {
  if (req.path === "/health" || req.path === "/api/uptime") return next();

  // 1 = connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection initializing. Please retry shortly.",
    });
  }
  next();
});

// Serve local uploads folder with strict security headers
const uploadDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(
  "/uploads",
  (req, res, next) => {
    // Allow cross-origin access so the frontend (on Vercel or any allowed domain)
    // can fetch uploaded 3D models and images directly.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", "inline");
    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  },
  express.static(uploadDir)
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    dbReady: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
    service: "RCC Infrastructure Backend",
  });
});

// Detailed uptime & server metrics check
app.get("/api/uptime", async (req, res) => {
  let dbPingMs = null;
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const t0 = Date.now();
    try {
      await mongoose.connection.db.admin().ping();
      dbPingMs = Date.now() - t0;
    } catch (error) {
      console.error("Health check database ping failed.", error);
      dbPingMs = -1;
    }
  }

  res.json({
    status: "healthy",
    database: {
      status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      pingMs: dbPingMs,
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

// Root sitemap.xml route alias
app.get("/sitemap.xml", (req, res) => {
  res.redirect("/api/public/sitemap.xml");
});

// 404 & Global Error Handler
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Ensure DB connects before accepting traffic
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] RCC Infrastructure API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("[Server] Startup failed:", err);
  process.exit(1);
});

export default app;
