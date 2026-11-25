import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { protectAdmin, requirePermission } from "../middleware/auth.js";
import { upload, processUpload } from "../middleware/upload.js";
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
  adminGetSettings,
  adminUpdateSettings,
} from "../controllers/settingController.js";

import {
  getContentByKey,
  updateContentByKey,
} from "../controllers/contentController.js";

const router = express.Router();

// ── 3D Model Upload (local storage, GLB/GLTF only) ──────────────────────────
const model3dUploadDir = path.resolve("public/uploads/models");
if (!fs.existsSync(model3dUploadDir)) {
  fs.mkdirSync(model3dUploadDir, { recursive: true });
}

const model3dStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, model3dUploadDir),
  filename: (_req, _file, cb) => {
    const ext = path.extname(_file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const MODEL_MIME_TYPES = [
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream", // GLB is often sent as this
];

const upload3dModel = multer({
  storage: model3dStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".glb" || ext === ".gltf" || MODEL_MIME_TYPES.includes(file.mimetype)) {
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

// 3D Model Upload (GLB/GLTF, local disk only, max 50 MB)
router.post(
  "/media/upload-model",
  requirePermission("projects"),
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
      const url = `/uploads/models/${req.file.filename}`;
      return res.json({ success: true, url, filename: req.file.originalname, bytes: req.file.size });
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rcc_infrastructure/models",
            public_id: req.file.filename,
            resource_type: "raw",
            use_filename: false,
            unique_filename: false,
          },
          (error, uploaded) => {
            if (error) return reject(error);
            resolve(uploaded);
          }
        );
        const source = fs.createReadStream(req.file.path);
        source.on("error", reject);
        source.pipe(stream);
      });

      await fs.promises.unlink(req.file.path);
      return res.json({
        success: true,
        url: result.secure_url,
        filename: req.file.originalname,
        bytes: req.file.size,
      });
    } catch (error) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          return next(cleanupError);
        }
      }
      return next(error);
    }
  }
);

// Image-to-3D Preparation (stores image for 3D depth-extruded viewer; ready for external AI 3D API if configured)
router.post(
  "/projects/image-to-3d",
  requirePermission("projects"),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image uploaded." });
      }
      const uploaded = await processUpload(req.file.buffer, req.file.originalname, req.file.mimetype);
      return res.json({
        success: true,
        mode: "image_relief",
        model3dImage: uploaded.url,
        message: "3D architectural depth model generated from image.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Site Settings
router.get("/settings", requirePermission("settings"), adminGetSettings);
router.put("/settings", requirePermission("settings"), adminUpdateSettings);

// Editable Content Sections (Home, About, Expertise, FAQs, Page Banners)
router.get("/content/:key", getContentByKey);
router.put("/content/:key", updateContentByKey);

export default router;
