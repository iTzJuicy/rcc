import ContentBlock from "../models/ContentBlock.js";

// Default content for fallback & seeding
export const DEFAULT_CONTENT = {
  home: {
    heroHeading: "Building Spaces. Creating Legacies.",
    heroDescription:
      "Delivering exceptional residential, commercial, and infrastructure solutions across Mangaluru with a relentless commitment to quality and architectural integrity.",
    heroButtonText: "Explore Projects",
    aboutTitle: "Constructing Trust, Crafting Value",
    aboutDescription:
      "With over 15 years of excellence in the construction landscape of Mangaluru, RCC Infrastructure brings together skilled engineering, sustainable construction practices, and reliable project management.",
  },
  about: {
    title: "Building Spaces That Stand the Test of Time",
    description:
      "Founded with a vision to redefine civil construction in coastal Karnataka, RCC Infrastructure has evolved from a boutique contractor into a trusted multi-disciplinary engineering and construction firm.",
    vision:
      "To be the premier construction partner recognized for engineering excellence, timely delivery, and transformative architectural quality that enriches communities.",
    mission:
      "To deliver superior residential, commercial, and industrial infrastructure with uncompromising safety, environmental sustainability, and authentic client trust.",
    values: [
      {
        id: "v1",
        icon: "fa-award",
        title: "Quality Assurance",
        description: "Rigorous ISO-certified quality benchmarks applied across all construction stages.",
      },
      {
        id: "v2",
        icon: "fa-clock",
        title: "On-Time Delivery",
        description: "Disciplined project scheduling and transparent milestone tracking on every build.",
      },
      {
        id: "v3",
        icon: "fa-city",
        title: "Modern Infrastructure",
        description: "Advanced engineering methods and contemporary architectural aesthetics.",
      },
      {
        id: "v4",
        icon: "fa-leaf",
        title: "Sustainable Development",
        description: "Eco-friendly materials, energy conservation, and responsible resource stewardship.",
      },
    ],
  },
  expertise: [
    {
      id: "exp-1",
      number: "01",
      title: "Residential Construction",
      description: "Custom premium villas, luxury apartments, and sustainable private residences.",
    },
    {
      id: "exp-2",
      number: "02",
      title: "Commercial Construction",
      description: "Modern retail hubs, corporate headquarters, and multi-tenant office complexes.",
    },
    {
      id: "exp-3",
      number: "03",
      title: "Planning & Coordination",
      description: "Comprehensive blueprint development, municipal sanctions, and structural audits.",
    },
    {
      id: "exp-4",
      number: "04",
      title: "Renovation & Remodelling",
      description: "Heritage restoration, structural retrofits, and high-end modern interior makeovers.",
    },
    {
      id: "exp-5",
      number: "05",
      title: "Interior Works",
      description: "Precision turnkey interior execution, acoustic ceilings, and bespoke cabinetry.",
    },
    {
      id: "exp-6",
      number: "06",
      title: "Project Management",
      description: "End-to-end site supervision, supply chain optimization, and cost governance.",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What types of construction projects does RCC Infrastructure handle?",
      answer: "We specialize in residential villas, apartments, commercial complexes, interior turnkey renovations, and civil infrastructure projects across Mangaluru and coastal Karnataka.",
    },
    {
      id: "faq-2",
      question: "How do you ensure projects are completed on schedule?",
      answer: "We establish detailed Gantt milestone schedules, dedicated on-site project managers, and digital daily logs to identify and resolve dependencies ahead of critical path bottlenecks.",
    },
    {
      id: "faq-3",
      question: "Can I customize the architectural plans during the construction process?",
      answer: "Yes, our engineering team works directly with clients through controlled revision phases before structural milestones are finalized.",
    },
    {
      id: "faq-4",
      question: "What quality control standards and certifications do you follow?",
      answer: "All materials undergo rigorous lab batch testing (IS standard cubes, steel tensile verification, certified waterproofing compounds) with third-party QA validation.",
    },
    {
      id: "faq-5",
      question: "How do you handle project budgets and cost overruns?",
      answer: "We provide itemized, transparent Bill of Quantities (BOQ) with fixed-price contractual bounds so there are zero surprise escalations during construction.",
    },
    {
      id: "faq-6",
      question: "Do you assist with municipal sanctions and utility approvals?",
      answer: "Yes, our liaison desk coordinates with local town planning authorities, MUDA/MESCOM/water boards to secure building sanctions and completion certificates.",
    },
    {
      id: "faq-7",
      question: "What warranties and post-handover support do you provide?",
      answer: "We offer comprehensive structural warranties and a 12-month defect liability period with scheduled post-occupancy inspections.",
    },
    {
      id: "faq-8",
      question: "How do we get started with a site consultation or quotation?",
      answer: "You can submit an enquiry via our Contact or Quote form, call us directly, or visit our Mangaluru office to arrange a free feasibility assessment.",
    },
  ],
  pageBanners: {
    default: "/images/banner.webp",
    about: "/images/about.webp",
    services: "/images/card2.webp",
    projects: "/images/card1.webp",
    expertise: "/images/card3.webp",
    process: "/images/card4.webp",
    contact: "/images/contact.webp",
    privacy: "/images/banner.webp",
    terms: "/images/banner.webp",
  },
};

function normalizePageBanners(data) {
  const banners = { ...DEFAULT_CONTENT.pageBanners, ...(data || {}) };
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
    if (!Array.isArray(payload) || payload.length !== 6) {
      return "Expertise must have exactly 6 cards";
    }
    const limits = CONTENT_LIMITS.expertise;
    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
      if (!item.title || item.title.trim().length === 0) {
        return `Expertise card #${i + 1} must have a title`;
      }
      if (item.title.length > limits.title) {
        return `Expertise card #${i + 1} title cannot exceed ${limits.title} characters`;
      }
      if (item.description && item.description.length > limits.description) {
        return `Expertise card #${i + 1} description cannot exceed ${limits.description} characters`;
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
