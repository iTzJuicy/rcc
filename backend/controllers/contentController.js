import ContentBlock from "../models/ContentBlock.js";
import { DEFAULT_CONTENT } from "../shared/contentDefaults.js";

function normalizePageBanners(data) {
  const banners = { ...DEFAULT_CONTENT.pageBanners, ...(data || {}) };
  if (banners.services === "/images/card2.webp") banners.services = "";
  if (banners.projects === "/images/card1.webp") banners.projects = "";
  if (banners.default === "/images/hero.webp") {
    banners.default = DEFAULT_CONTENT.pageBanners.default;
  }
  return banners;
}

// Character limit rules
export const CONTENT_LIMITS = {
  home: {
    heroHeading: 55,
    heroDescription: 160,
    heroButtonText: 22,
    aboutTitle: 45,
    aboutDescription: 300,
  },
  about: {
    title: 45,
    description: 600,
    vision: 220,
    mission: 220,
    values: {
      title: 28,
      description: 120,
    },
  },
  expertise: {
    title: 35,
    description: 190,
  },
  faqs: {
    maxItems: 8,
    question: 90,
    answer: 280,
  },
  services: {
    title: 60,
    shortDescription: 160,
    longDescription: 1200,
    maxGallery: 10,
  },
  projects: {
    title: 60,
    shortDescription: 160,
    fullDescription: 1200,
    maxGallery: 12,
  },
};

// Validate and clean text limits
export function validateContentSection(key, payload) {
  if (key === "home") {
    const limits = CONTENT_LIMITS.home;
    if (payload.heroHeading && payload.heroHeading.length > limits.heroHeading) {
      return `Hero heading cannot exceed ${limits.heroHeading} characters (currently ${payload.heroHeading.length})`;
    }
    if (payload.heroDescription && payload.heroDescription.length > limits.heroDescription) {
      return `Hero description cannot exceed ${limits.heroDescription} characters (currently ${payload.heroDescription.length})`;
    }
    if (payload.heroButtonText && payload.heroButtonText.length > limits.heroButtonText) {
      return `Hero button text cannot exceed ${limits.heroButtonText} characters (currently ${payload.heroButtonText.length})`;
    }
    if (payload.aboutTitle && payload.aboutTitle.length > limits.aboutTitle) {
      return `Home about title cannot exceed ${limits.aboutTitle} characters (currently ${payload.aboutTitle.length})`;
    }
    if (payload.aboutDescription && payload.aboutDescription.length > limits.aboutDescription) {
      return `Home about description cannot exceed ${limits.aboutDescription} characters (currently ${payload.aboutDescription.length})`;
    }
  }

  if (key === "about") {
    const limits = CONTENT_LIMITS.about;
    if (payload.title && payload.title.length > limits.title) {
      return `About page title cannot exceed ${limits.title} characters (currently ${payload.title.length})`;
    }
    if (payload.description && payload.description.length > limits.description) {
      return `About page description cannot exceed ${limits.description} characters (currently ${payload.description.length})`;
    }
    if (payload.vision && payload.vision.length > limits.vision) {
      return `Vision text cannot exceed ${limits.vision} characters (currently ${payload.vision.length})`;
    }
    if (payload.mission && payload.mission.length > limits.mission) {
      return `Mission text cannot exceed ${limits.mission} characters (currently ${payload.mission.length})`;
    }
    if (Array.isArray(payload.values)) {
      for (let i = 0; i < payload.values.length; i++) {
        const val = payload.values[i];
        if (val.title && val.title.length > limits.values.title) {
          return `Value #${i + 1} title cannot exceed ${limits.values.title} characters`;
        }
        if (val.description && val.description.length > limits.values.description) {
          return `Value #${i + 1} description cannot exceed ${limits.values.description} characters`;
        }
      }
    }
  }

  if (key === "expertise") {
    const limits = CONTENT_LIMITS.expertise;
    const items = Array.isArray(payload) ? payload : payload?.items;
    if (!Array.isArray(items) || items.length > 20) {
      return "Expertise items must be an array with no more than 20 cards";
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item || typeof item.title !== "string" || !item.title.trim()) {
        return `Expertise card #${i + 1} must have a title`;
      }
      if (typeof item.description !== "string") {
        return `Expertise card #${i + 1} description must be text`;
      }
      if (item.title.length > limits.title) {
        return `Expertise card #${i + 1} title cannot exceed ${limits.title} characters`;
      }
      if (item.description && item.description.length > limits.description) {
        return `Expertise card #${i + 1} description cannot exceed ${limits.description} characters`;
      }
    }
    if (!Array.isArray(payload)) {
      for (const [section, fields] of Object.entries({
        hero: ["eyebrow", "title", "description"],
        intro: ["eyebrow", "title", "buttonText"],
        areas: ["eyebrow", "title", "description", "footerText", "footerLinkText"],
        approach: ["eyebrow", "title", "buttonText", "image"],
      })) {
        if (!payload[section] || fields.some((field) => typeof payload[section][field] !== "string")) {
          return `Expertise ${section} content is incomplete`;
        }
      }
      for (const section of ["intro", "approach"]) {
        if (!Array.isArray(payload[section].paragraphs) || payload[section].paragraphs.length > 8) {
          return `Expertise ${section} paragraphs must be an array with no more than 8 items`;
        }
        if (payload[section].paragraphs.some((paragraph) => typeof paragraph !== "string")) {
          return `Expertise ${section} paragraphs must contain text`;
        }
      }
    }
  }

  if (key === "process") {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return "Process content must be an object";
    }
    const sections = ["hero", "overview", "support", "promise", "faq"];
    if (sections.some((section) => !payload[section] || typeof payload[section] !== "object")) {
      return "Process page section content is incomplete";
    }
    for (const [section, fields] of Object.entries({
      hero: ["eyebrow", "title", "description"],
      overview: ["eyebrow", "title", "description"],
      support: ["eyebrow", "title"],
      promise: ["eyebrow", "title"],
      faq: ["eyebrow", "title", "description", "buttonText"],
    })) {
      if (fields.some((field) => typeof payload[section][field] !== "string")) {
        return `Process ${section} content is incomplete`;
      }
    }
    const lists = [
      ["steps", payload.steps, 12],
      ["support items", payload.support.items, 12],
      ["promise items", payload.promise.items, 12],
    ];
    for (const [label, items, max] of lists) {
      if (!Array.isArray(items) || items.length > max) {
        return `Process ${label} must be an array with no more than ${max} items`;
      }
    }
    for (const [index, step] of payload.steps.entries()) {
      if (!step || typeof step !== "object") {
        return `Process step #${index + 1} must be an object`;
      }
      if (typeof step.title !== "string" || !step.title.trim() ||
        typeof step.summary !== "string" || !step.summary.trim() ||
        typeof step.description !== "string" || !step.description.trim() ||
        typeof step.timeframe !== "string" || typeof step.image !== "string") {
        return `Process step #${index + 1} requires a title, summary, and description`;
      }
      if (!Array.isArray(step.provide) || !Array.isArray(step.receive) ||
        step.provide.some((entry) => typeof entry !== "string") ||
        step.receive.some((entry) => typeof entry !== "string")) {
        return `Process step #${index + 1} lists must be arrays`;
      }
    }
    for (const [index, item] of payload.support.items.entries()) {
      if (!item || typeof item.title !== "string" || !item.title.trim() ||
        typeof item.description !== "string" || !item.description.trim() || !Array.isArray(item.points) ||
        item.points.some((entry) => typeof entry !== "string")) {
        return `Process support item #${index + 1} requires a title, description, and points list`;
      }
    }
    for (const [index, item] of payload.promise.items.entries()) {
      if (!item || typeof item.title !== "string" || !item.title.trim() ||
        typeof item.description !== "string" || !item.description.trim() ||
        typeof item.icon !== "string" || !item.icon.trim()) {
        return `Process promise item #${index + 1} requires an icon, title, and description`;
      }
    }
  }

  if (key === "faqs") {
    if (!Array.isArray(payload)) {
      return "FAQs must be an array of questions and answers";
    }
    if (payload.length > CONTENT_LIMITS.faqs.maxItems) {
      return `Maximum of ${CONTENT_LIMITS.faqs.maxItems} FAQs allowed (currently ${payload.length})`;
    }
    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
      if (!item.question || !item.answer) {
        return `FAQ #${i + 1} must have both question and answer`;
      }
      if (item.question.length > CONTENT_LIMITS.faqs.question) {
        return `FAQ #${i + 1} question cannot exceed ${CONTENT_LIMITS.faqs.question} characters`;
      }
      if (item.answer.length > CONTENT_LIMITS.faqs.answer) {
        return `FAQ #${i + 1} answer cannot exceed ${CONTENT_LIMITS.faqs.answer} characters`;
      }
    }
  }

  return null; // Valid
}

// Controller methods
export const getContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const block = await ContentBlock.findOne({ key });
    if (!block) {
      const fallback = DEFAULT_CONTENT[key] || {};
      return res.json({ success: true, key, data: fallback });
    }
    const data = key === "pageBanners" ? normalizePageBanners(block.data) : block.data;
    return res.json({ success: true, key, data });
  } catch (error) {
    console.error("getContentByKey error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch content" });
  }
};

export const updateContentByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const payload = req.body;

    if (!Object.prototype.hasOwnProperty.call(DEFAULT_CONTENT, key)) {
      return res.status(404).json({ success: false, message: "Content section not found." });
    }

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, message: "Content payload must be an object or array." });
    }

    const validationError = validateContentSection(key, payload);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updated = await ContentBlock.findOneAndUpdate(
      { key },
      { key, data: payload },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: `${key.toUpperCase()} content updated successfully`,
      data: updated.data,
    });
  } catch (error) {
    console.error("updateContentByKey error:", error);
    return res.status(500).json({ success: false, message: "Failed to update content" });
  }
};

// Get all content for initial public hydration
export const getAllPublicContent = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
    const blocks = await ContentBlock.find();
    const result = { ...DEFAULT_CONTENT };
    blocks.forEach((b) => {
      result[b.key] = b.key === "pageBanners" ? normalizePageBanners(b.data) : b.data;
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("getAllPublicContent error:", error);
    return res.status(500).json({ success: false, message: "Failed to load site content" });
  }
};
