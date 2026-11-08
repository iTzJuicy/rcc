import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const defaultSettings = {
  siteName: "RCC Infrastructure",
  tagline: "Building Dreams, Constructing Futures",
  phone: "+91 98765 43210",
  email: "info@rccinfrastructure.com",
  address: "Mangaluru, Karnataka, India",
  logoUrl: "/images/logo.webp",
  heroHeadline: "Designing & Building Spaces that Inspire",
  heroSubtext:
    "Over 15+ years of excellence in architectural design, residential construction, commercial spaces, and infrastructure development in Mangaluru.",
  heroButtonLabel: "Explore Projects",
  contactCtaTitle: "Let's Build Something\nGreat Together.",
  contactCtaDescription:
    "Get in touch with us for your next project.\nWe're here to turn your vision into reality.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124442.27439162986!2d74.78201948956942!3d12.922983196901844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe15!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  socialLinks: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    whatsapp: "https://wa.me/919876543210",
  },
};

const SiteSettingsContext = createContext(defaultSettings);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSiteSettings();
      if (data && typeof data === "object") {
        setSettings((prev) => ({
          ...prev,
          ...data,
          socialLinks: {
            ...prev.socialLinks,
            ...(data.socialLinks || {}),
          },
        }));
      }
    } catch (err) {
      // Keep defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  return ctx?.settings || defaultSettings;
}

export default SiteSettingsContext;
