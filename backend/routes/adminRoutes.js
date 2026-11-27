import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import process from "node:process";
import { protectAdmin, requirePermission } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { cloudinary, isConfigured } from "../config/cloudinary.js";

import {
  adminGetDashboard,
  adminGetEnquiries,
  adminUpdateStatus,
  adminDeleteEnquiry,
  adminExportCSV,
} from "../controllers/enquiryController.js";

import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminReorderServices,
} from "../controllers/serviceController.js";

import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminReorderProjects,
} from "../controllers/projectController.js";

import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../controllers/categoryController.js";

import {
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
  adminReorderTestimonials,
} from "../controllers/testimonialController.js";

import {
  adminGetStats,
  adminCreateStat,
  adminUpdateStat,
  adminDeleteStat,
  adminReorderStats,
} from "../controllers/statController.js";

import {
  adminGetMedia,
  adminUploadMedia,
  adminDeleteMedia,
} from "../controllers/mediaController.js";
import {
  adminDeleteModelAsset,
  adminGetModelAssets,
} from "../controllers/modelAssetController.js";
import ModelAsset from "../models/ModelAsset.js";

import {
  adminGetSettings,
  adminUpdateSettings,
} from "../controllers/settingController.js";

import {
  getContentByKey,
  updateContentByKey,
} from "../controllers/contentController.js";

const router = express.Router();

function requireMediaOrProjectPermission(req, res, next) {
  const role = req.user?.role;
  const permissions = req.user?.permissions || {};
  if (role === "admin" || role === "superadmin") return next();

  const canManage = ["media", "projects"].some((key) => (
    (role === "editor" && permissions[key] === undefined) || permissions[key] === true
  ));
  if (canManage) return next();

  return res.status(403).json({
    success: false,
    message: "Access denied. You need media or project management permission.",
  });
}

// ── 3D Model Upload (local storage, GLB/GLTF only) ──────────────────────────
const model3dUploadDir = path.resolve("public/uploads/models");
if (!fs.existsSync(model3dUploadDir)) {
  fs.mkdirSync(model3dUploadDir, { recursive: true });
}

const model3dStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, model3dUploadDir),
  filename: (_req, _file, cb) => {
    const ext = path.extname(_file.originalname).toLowerCase() === ".gltf" ? ".gltf" : ".glb";
    const originalBase = path.basename(_file.originalname, ext)
      .normalize("NFKC")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "model";
    cb(null, `${crypto.randomUUID()}-${originalBase}${ext}`);
  },
});

const MODEL_MIME_TYPES_BY_EXTENSION = {
  ".glb": ["model/gltf-binary", "application/octet-stream"],
  ".gltf": ["model/gltf+json", "application/json"],
};

const upload3dModel = multer({
  storage: model3dStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (MODEL_MIME_TYPES_BY_EXTENSION[ext]?.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("Only .glb and .gltf files are allowed.");
      err.status = 400;
      cb(err, false);
    }
  },
});

// Require admin authentication for all routes
router.use(protectAdmin);

// Dashboard (accessible to any authenticated admin)
router.get("/dashboard", adminGetDashboard);

// Services
router.get("/services", requirePermission("services"), adminGetServices);
router.post("/services", requirePermission("services"), adminCreateService);
router.post("/services/reorder", requirePermission("services"), adminReorderServices);
router.put("/services/:id", requirePermission("services"), adminUpdateService);
router.delete("/services/:id", requirePermission("services"), adminDeleteService);

// Projects
router.get("/projects", requirePermission("projects"), adminGetProjects);
router.post("/projects", requirePermission("projects"), adminCreateProject);
router.post("/projects/reorder", requirePermission("projects"), adminReorderProjects);
router.put("/projects/:id", requirePermission("projects"), adminUpdateProject);
router.delete("/projects/:id", requirePermission("projects"), adminDeleteProject);

// Categories
router.get("/categories", requirePermission("categories"), adminGetCategories);
router.post("/categories", requirePermission("categories"), adminCreateCategory);
router.put("/categories/:id", requirePermission("categories"), adminUpdateCategory);
router.delete("/categories/:id", requirePermission("categories"), adminDeleteCategory);

// Testimonials
router.get("/testimonials", requirePermission("testimonials"), adminGetTestimonials);
router.post("/testimonials", requirePermission("testimonials"), adminCreateTestimonial);
router.post("/testimonials/reorder", requirePermission("testimonials"), adminReorderTestimonials);
router.put("/testimonials/:id", requirePermission("testimonials"), adminUpdateTestimonial);
router.delete("/testimonials/:id", requirePermission("testimonials"), adminDeleteTestimonial);

// Impact Stats
router.get("/stats", requirePermission("stats"), adminGetStats);
router.post("/stats", requirePermission("stats"), adminCreateStat);
router.post("/stats/reorder", requirePermission("stats"), adminReorderStats);
router.put("/stats/:id", requirePermission("stats"), adminUpdateStat);
router.delete("/stats/:id", requirePermission("stats"), adminDeleteStat);

// Enquiries
router.get("/enquiries/export", requirePermission("enquiries"), adminExportCSV);
router.get("/enquiries", requirePermission("enquiries"), adminGetEnquiries);
router.put("/enquiries/:id", requirePermission("enquiries"), adminUpdateStatus);
router.delete("/enquiries/:id", requirePermission("enquiries"), adminDeleteEnquiry);

// Media Library
router.get("/media", requirePermission("media"), adminGetMedia);
router.post("/media/upload", requirePermission("media"), upload.single("file"), adminUploadMedia);
router.delete("/media/:id", requirePermission("media"), adminDeleteMedia);

// 3D Model Upload (GLB/GLTF, max 50 MB)
router.get("/media/models", requireMediaOrProjectPermission, adminGetModelAssets);
router.delete("/media/models/:id", requireMediaOrProjectPermission, adminDeleteModelAsset);

router.post(
  "/media/upload-model",
  requireMediaOrProjectPermission,
  (req, res, next) => {
    if (process.env.NODE_ENV === "production" && !isConfigured) {
      return res.status(503).json({
        success: false,
        message: "3D model uploads require persistent Cloudinary storage in production.",
      });
    }
    next();
  },
  upload3dModel.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    if (!isConfigured) {
      try {
        const url = `/uploads/models/${req.file.filename}`;
        const asset = await ModelAsset.create({
          url,
          filename: req.file.originalname,
          storage: "local",
          bytes: req.file.size,
        });
        return res.status(201).json({ success: true, data: asset, url, filename: asset.filename, bytes: asset.bytes });
      } catch (error) {
        return next(error);
      }
    }

    let result;
    try {
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          req.file.path,
          {
            folder: "rcc_infrastructure/models",
            public_id: req.file.filename,
            resource_type: "raw",
            chunk_size: 6 * 1024 * 1024,
            use_filename: false,
            unique_filename: false,
          },
          (error, uploaded) => {
            if (error) return reject(error);
            resolve(uploaded);
          }
        );
      });

    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Storage] Cloudinary model upload failed (${error.http_code || error.message}); using local development storage.`
        );
        try {
          const url = `/uploads/models/${req.file.filename}`;
          const asset = await ModelAsset.create({
            url,
            filename: req.file.originalname,
            storage: "local",
            bytes: req.file.size,
          });
          return res.status(201).json({
            success: true,
            data: asset,
            url: asset.url,
            filename: asset.filename,
            bytes: asset.bytes,
            storage: "local",
          });
        } catch (storageError) {
          return next(storageError);
        }
      }

      try {
        await fs.promises.unlink(req.file.path);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          return next(cleanupError);
        }
      }
      return next(error);
    }

    try {
      await fs.promises.unlink(req.file.path);
      const asset = await ModelAsset.create({
        url: result.secure_url,
        filename: req.file.originalname,
        public_id: result.public_id,
        storage: "cloudinary",
        bytes: req.file.size,
      });
      return res.status(201).json({
        success: true,
        data: asset,
        url: asset.url,
        filename: asset.filename,
        bytes: asset.bytes,
      });
    } catch (error) {
      try {
        await cloudinary.uploader.destroy(result.public_id, { resource_type: "raw" });
      } catch (cleanupError) {
        console.error("Failed to remove a model from Cloudinary after metadata persistence failed.", cleanupError);
      }
      return next(error);
    }
  }
);

// Site Settings
router.get("/settings", requirePermission("settings"), adminGetSettings);
router.put("/settings", requirePermission("settings"), adminUpdateSettings);

// Editable Content Sections (Home, About, Expertise, FAQs, Page Banners)
router.get("/content/:key", getContentByKey);
router.put("/content/:key", requirePermission("settings"), updateContentByKey);

export default router;
