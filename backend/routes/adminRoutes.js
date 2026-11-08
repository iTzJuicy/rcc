import express from "express";
import { protectAdmin, requirePermission } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

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

// Site Settings
router.get("/settings", requirePermission("settings"), adminGetSettings);
router.put("/settings", requirePermission("settings"), adminUpdateSettings);

// Editable Content Sections (Home, About, Expertise, FAQs, Page Banners)
router.get("/content/:key", getContentByKey);
router.put("/content/:key", updateContentByKey);

export default router;
