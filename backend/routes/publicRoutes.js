import express from "express";
import { getPublicServices, getPublicServiceBySlug } from "../controllers/serviceController.js";
import { getPublicProjects, getPublicProjectBySlug } from "../controllers/projectController.js";
import { getCategories } from "../controllers/categoryController.js";
import { getPublicTestimonials } from "../controllers/testimonialController.js";
import { getPublicStats } from "../controllers/statController.js";
import { submitPublicEnquiry } from "../controllers/enquiryController.js";
import { getPublicSettings } from "../controllers/settingController.js";
import { getSitemapXml } from "../controllers/sitemapController.js";
import { getContentByKey, getAllPublicContent } from "../controllers/contentController.js";
import { publicFormLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/content", getAllPublicContent);
router.get("/content/:key", getContentByKey);

router.get("/services", getPublicServices);
router.get("/services/:slug", getPublicServiceBySlug);

router.get("/projects", getPublicProjects);
router.get("/projects/:slug", getPublicProjectBySlug);

router.get("/categories", getCategories);
router.get("/testimonials", getPublicTestimonials);
router.get("/stats", getPublicStats);
router.get("/settings", getPublicSettings);

router.post("/enquiries", publicFormLimiter, submitPublicEnquiry);
router.get("/sitemap.xml", getSitemapXml);

export default router;
