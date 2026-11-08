import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), ".env"),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: false });
  }
}

import User from "../models/User.js";
import Service from "../models/Service.js";
import Project from "../models/Project.js";
import Category from "../models/Category.js";
import Testimonial from "../models/Testimonial.js";
import Stat from "../models/Stat.js";
import SiteSetting from "../models/SiteSetting.js";
import ContentBlock from "../models/ContentBlock.js";
import { DEFAULT_CONTENT } from "../controllers/contentController.js";

import { connectDB } from "../config/db.js";

async function seed() {
  try {
    await connectDB();
    console.log("[Seed] Connected.");

    // 1. Create default admin user
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || "admin@rcc.com").toLowerCase().trim();
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "adminpassword123";

    const allPermissions = {
      services: true,
      projects: true,
      categories: true,
      testimonials: true,
      stats: true,
      enquiries: true,
      media: true,
      settings: true,
      users: true,
    };

    let admin = await User.findOne({ email: defaultEmail });
    if (!admin) {
      admin = new User({
        name: "RCC Super Admin",
        email: defaultEmail,
        password: defaultPassword,
        role: "superadmin",
        permissions: allPermissions,
      });
      await admin.save();
      console.log(`[Seed] Default superadmin created: ${defaultEmail}`);
    } else {
      admin.role = "superadmin";
      admin.permissions = allPermissions;
      await admin.save();
      console.log(`[Seed] Superadmin permissions verified for: ${defaultEmail}`);
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const initialServices = [
        {
          title: "Residential Building Construction",
          slug: "residential-construction",
          shortDescription: "Thoughtfully designed residential spaces built with quality materials, precision, and lasting durability.",
          longDescription: "Our residential construction services cater to standalone homes, luxury villas, and multi-family residential buildings. We take care of structural integrity, aesthetic finishing, MEP fittings, and strict quality compliance at every phase.",
          image: "/images/card1.webp",
          icon: "home",
          order: 1,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Commercial Building Construction",
          slug: "commercial-construction",
          shortDescription: "Functional and modern commercial spaces designed to support business growth and long-term performance.",
          longDescription: "We engineer commercial retail centres, corporate offices, and mixed-use complexes with optimized spatial efficiency, modern facade treatments, and comprehensive fire & safety standards.",
          image: "/images/card2.webp",
          icon: "building",
          order: 2,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Civil & Infrastructure Works",
          slug: "civil-infrastructure-works",
          shortDescription: "Infrastructure and civil engineering solutions delivered with reliable execution and quality workmanship.",
          longDescription: "Heavy civil projects including retaining walls, reinforced concrete pavements, stormwater drainage systems, and foundational earthworks.",
          image: "/images/impact.webp",
          icon: "construction",
          order: 3,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Apartment & Residential Development",
          slug: "apartment-residential-development",
          shortDescription: "Residential developments designed for functionality, durability, and modern living.",
          longDescription: "End-to-end multi-storey apartment project development with parking structures, amenities, and robust structural safety.",
          image: "/images/card1.webp",
          icon: "building",
          order: 4,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Renovation & Remodelling",
          slug: "renovation-remodelling",
          shortDescription: "Transforming existing spaces through careful planning, skilled workmanship, and quality execution.",
          longDescription: "Modernizing aging structures, structural retrofitting, interior redesign, and exterior facade upgrades.",
          image: "/images/card3.webp",
          icon: "hammer",
          order: 5,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Structural & Civil Engineering Works",
          slug: "structural-civil-engineering",
          shortDescription: "Reliable structural construction focused on strength, stability, safety, and long-term performance.",
          longDescription: "Specialized reinforced concrete works, load-bearing frames, columns, and structural inspection services.",
          image: "/images/impact.webp",
          icon: "construction",
          order: 6,
          showOnHome: true,
          isActive: true,
        },
        {
          title: "Project Management & Turnkey Construction",
          slug: "project-management-turnkey-construction",
          shortDescription: "End-to-end project management ensuring on-time delivery, cost control, and uncompromising quality.",
          longDescription: "Comprehensive turnkey delivery from architectural drawings and municipal approvals to turnkey key handover.",
          image: "/images/card4.webp",
          icon: "shield",
          order: 7,
          showOnHome: true,
          isActive: true,
        },
      ];

      await Service.insertMany(initialServices);
      console.log(`[Seed] Seeded ${initialServices.length} initial services.`);
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const initialProjects = [
        {
          slug: "residential-development",
          title: "Residential Development",
          category: "Residential",
          status: "Completed",
          location: "Mangalore, Karnataka",
          year: "2024",
          area: "4,500 sq ft",
          client: "Private Client",
          description: "A thoughtfully planned residential project focused on quality construction, functional spaces, and lasting durability.",
          coverImage: "/images/card1.webp",
          image: "/images/card1.webp",
          gallery: ["/images/card1.webp", "/images/card2.webp", "/images/card3.webp"],
          isFeatured: true,
          order: 1,
        },
        {
          slug: "commercial-complex",
          title: "Commercial Complex",
          category: "Commercial",
          status: "Completed",
          location: "Mangalore, Karnataka",
          year: "2023",
          area: "12,000 sq ft",
          client: "Retail Enterprise",
          description: "A modern commercial development designed around efficient space utilisation and dependable construction.",
          coverImage: "/images/card2.webp",
          image: "/images/card2.webp",
          gallery: ["/images/card2.webp", "/images/card1.webp", "/images/impact.webp"],
          isFeatured: true,
          order: 2,
        },
        {
          slug: "building-renovation",
          title: "Building Renovation",
          category: "Renovation",
          status: "Completed",
          location: "Mangalore, Karnataka",
          year: "2024",
          area: "3,200 sq ft",
          client: "Commercial Partner",
          description: "A renovation project focused on improving functionality, refreshing existing spaces, and maintaining structural integrity.",
          coverImage: "/images/card3.webp",
          image: "/images/card3.webp",
          gallery: ["/images/card3.webp", "/images/card4.webp", "/images/card1.webp"],
          isFeatured: true,
          order: 3,
        },
        {
          slug: "modern-building-project",
          title: "Modern Building Project",
          category: "Construction",
          status: "Ongoing",
          location: "Mangalore, Karnataka",
          year: "2025",
          area: "8,500 sq ft",
          client: "Developer Group",
          description: "A construction project emphasising practical design, careful execution, and attention to detail.",
          coverImage: "/images/card4.webp",
          image: "/images/card4.webp",
          gallery: ["/images/card4.webp", "/images/card2.webp", "/images/card3.webp"],
          isFeatured: true,
          order: 4,
        },
      ];

      await Project.insertMany(initialProjects);
      console.log(`[Seed] Seeded ${initialProjects.length} initial projects.`);
    }

    // 4. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const initialCategories = [
        { name: "Residential", slug: "residential", type: "project", order: 1 },
        { name: "Commercial", slug: "commercial", type: "project", order: 2 },
        { name: "Renovation", slug: "renovation", type: "project", order: 3 },
        { name: "Construction", slug: "construction", type: "project", order: 4 },
      ];
      await Category.insertMany(initialCategories);
      console.log(`[Seed] Seeded ${initialCategories.length} categories.`);
    }

    // 5. Seed Stats
    const statCount = await Stat.countDocuments();
    if (statCount === 0) {
      const initialStats = [
        { value: "10", suffix: "+", label: "Years of Experience", icon: "shield", order: 1 },
        { value: "50", suffix: "+", label: "Projects Completed", icon: "building", order: 2 },
        { value: "30", suffix: "+", label: "Happy Clients", icon: "users", order: 3 },
        { value: "100", suffix: "%", label: "Commitment to Quality", icon: "check", order: 4 },
      ];
      await Stat.insertMany(initialStats);
      console.log(`[Seed] Seeded ${initialStats.length} impact stats.`);
    }

    // 6. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const initialTestimonials = [
        {
          name: "Client, Mangaluru",
          role: "Residential Client",
          location: "Mangaluru",
          rating: 5,
          text: "RCC Infrastructure delivered our dream home on time with excellent quality. Their team was professional, responsive and easy to work with. Highly recommended!",
          quote: "RCC Infrastructure delivered our dream home on time with excellent quality. Their team was professional, responsive and easy to work with. Highly recommended!",
          isApproved: true,
          order: 1,
        },
        {
          name: "Residential Client, Mangaluru",
          role: "Commercial Client",
          location: "Mangaluru",
          rating: 5,
          text: "The entire construction process was handled professionally. The team maintained good communication and paid attention to quality at every stage.",
          quote: "The entire construction process was handled professionally. The team maintained good communication and paid attention to quality at every stage.",
          isApproved: true,
          order: 2,
        },
        {
          name: "Project Client, Mangaluru",
          role: "Project Partner",
          location: "Mangaluru",
          rating: 5,
          text: "We appreciated the team's commitment, timely updates and quality workmanship. The project was managed with care from start to finish.",
          quote: "We appreciated the team's commitment, timely updates and quality workmanship. The project was managed with care from start to finish.",
          isApproved: true,
          order: 3,
        },
      ];
      await Testimonial.insertMany(initialTestimonials);
      console.log(`[Seed] Seeded ${initialTestimonials.length} testimonials.`);
    }

    // 7. Seed Site Settings
    const settingsCount = await SiteSetting.countDocuments();
    if (settingsCount === 0) {
      await SiteSetting.create({
        siteName: "RCC Infrastructure",
        tagline: "Quality Construction & Development",
        logo: "/images/logo.webp",
        favicon: "/images/logo.webp",
        phone: "+91 98765 43210",
        email: "info@rccinfrastructure.com",
        address: "Mangalore, Karnataka, India",
        mapEmbedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124442.27439162986!2d74.78201948956942!3d12.922983196901844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe15!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        socialLinks: {
          facebook: "https://www.facebook.com/",
          instagram: "https://www.instagram.com/",
          linkedin: "https://www.linkedin.com/",
          whatsapp: "https://wa.me/919876543210",
        },
      });
      console.log("[Seed] Seeded default site settings.");
    }

    // 8. Seed Content Blocks (Home, About, Expertise, FAQs, Page Banners)
    for (const [key, val] of Object.entries(DEFAULT_CONTENT)) {
      const existing = await ContentBlock.findOne({ key });
      if (!existing) {
        await ContentBlock.create({ key, data: val });
        console.log(`[Seed] Seeded content block: ${key}`);
      }
    }

    console.log("[Seed] Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err);
    process.exit(1);
  }
}

seed();
