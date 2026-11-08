import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "RCC Infrastructure",
    },
    tagline: {
      type: String,
      default: "Quality Construction & Development",
    },
    logo: {
      type: String,
      default: "/images/logo.webp",
    },
    favicon: {
      type: String,
      default: "/images/logo.webp",
    },
    phone: {
      type: String,
      default: "+91 98765 43210",
    },
    email: {
      type: String,
      default: "info@rccinfrastructure.com",
    },
    address: {
      type: String,
      default: "Mangaluru, Karnataka, India",
    },
    mapEmbedUrl: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124442.27439162986!2d74.78201948956942!3d12.922983196901844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe15!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    },
    socialLinks: {
      facebook: { type: String, default: "https://www.facebook.com/" },
      instagram: { type: String, default: "https://www.instagram.com/" },
      linkedin: { type: String, default: "https://www.linkedin.com/" },
      whatsapp: { type: String, default: "https://wa.me/919876543210" },
    },
    heroHeadline: {
      type: String,
      default: "Shaping Spaces for a Brighter Tomorrow.",
    },
    heroSubtext: {
      type: String,
      default:
        "We deliver high-quality construction, development and contracting solutions that create lasting value for communities.",
    },
    heroButtonLabel: {
      type: String,
      default: "Explore Our Work",
    },
    contactCtaTitle: {
      type: String,
      default: "Let's Build Something Great Together.",
    },
    contactCtaDescription: {
      type: String,
      default:
        "Get in touch with us for your next project. We're here to turn your vision into reality.",
    },
    defaultSeo: {
      metaTitle: {
        type: String,
        default: "RCC Infrastructure | Quality Construction & Development",
      },
      metaDescription: {
        type: String,
        default:
          "RCC Infrastructure delivers dependable construction and development solutions in Mangalore, Karnataka. Built with quality, integrity, and precision.",
      },
      ogImage: { type: String, default: "/images/impact.webp" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSetting ||
  mongoose.model("SiteSetting", siteSettingSchema);
