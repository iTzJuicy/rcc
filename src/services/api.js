/**
 * API Service for RCC Infrastructure
 * Handles both public endpoints and admin endpoints with JWT authentication.
 * Includes graceful fallback to local data when backend is starting or offline.
 */

import fallbackProjects from "../data/projects";
import fallbackServices from "../data/services";
import fallbackStats from "../data/statistics";
import fallbackTestimonials from "../data/testimonials";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

function normalizeMediaRecord(record) {
  if (!record || typeof record !== "object") return record;
  const normalized = { ...record };
  for (const field of ["image", "coverImage"]) {
    if (typeof normalized[field] === "string") {
      normalized[field] = normalized[field].replace(/^\/images\/(.+)\.png$/, "/images/$1.webp");
    }
  }
  if (Array.isArray(normalized.gallery)) {
    normalized.gallery = normalized.gallery.map((url) =>
      typeof url === "string" ? url.replace(/^\/images\/(.+)\.png$/, "/images/$1.webp") : url
    );
  }
  return normalized;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // If sending FormData (file uploads), let the browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const config = {
    credentials: "include",
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && endpoint.startsWith("/admin")) {
      localStorage.removeItem("rcc_admin_user");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Generic HTTP helpers
  async get(endpoint, options = {}) {
    return request(endpoint, { method: "GET", ...options });
  },

  async post(endpoint, body, options = {}) {
    return request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  async put(endpoint, body, options = {}) {
    return request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  async delete(endpoint, options = {}) {
    return request(endpoint, { method: "DELETE", ...options });
  },

  // ==========================================
  // PUBLIC ENDPOINTS (fallback only on network error)
  // ==========================================

  async getServices() {
    try {
      const res = await request("/public/services");
      return Array.isArray(res.data) ? res.data.map(normalizeMediaRecord) : fallbackServices;
    } catch (e) {
      console.warn("Using fallback services data:", e.message);
      return fallbackServices;
    }
  },

  async getServiceBySlug(slug) {
    try {
      const res = await request(`/public/services/${slug}`);
      return normalizeMediaRecord(res.data);
    } catch (e) {
      console.warn("Using fallback service lookup for slug:", slug);
      return fallbackServices.find((s) => s.slug === slug || String(s.id) === String(slug));
    }
  },

  async getProjects(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await request(`/public/projects${query ? `?${query}` : ""}`);
      return { ...res, data: Array.isArray(res.data) ? res.data.map(normalizeMediaRecord) : res.data };
    } catch (e) {
      console.warn("Using fallback projects data:", e.message);
      let list = [...fallbackProjects];
      if (params.category && params.category !== "All") {
        list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.status && params.status !== "All") {
        list = list.filter((p) => (p.status || "Completed").toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.location && p.location.toLowerCase().includes(q))
        );
      }
      return {
        success: true,
        data: list,
        total: list.length,
        page: 1,
        pages: 1,
      };
    }
  },

  async getProjectBySlug(slug) {
    try {
      const res = await request(`/public/projects/${slug}`);
      return normalizeMediaRecord(res.data);
    } catch (e) {
      console.warn("Using fallback project lookup for slug:", slug);
      return fallbackProjects.find((p) => p.slug === slug || String(p.id) === String(slug));
    }
  },

  async getCategories(type = "project") {
    try {
      const res = await request(`/public/categories?type=${type}`);
      return res.data;
    } catch (e) {
      if (type === "project") {
        const unique = Array.from(new Set(fallbackProjects.map((p) => p.category).filter(Boolean)));
        return unique.map((c) => ({ name: c, slug: c.toLowerCase().replace(/\s+/g, "-") }));
      }
      return [];
    }
  },

  async getStats() {
    try {
      const res = await request("/public/stats");
      return Array.isArray(res.data) ? res.data : fallbackStats;
    } catch (e) {
      return fallbackStats;
    }
  },

  async getTestimonials() {
    try {
      const res = await request("/public/testimonials");
      return Array.isArray(res.data) ? res.data : fallbackTestimonials;
    } catch (e) {
      return fallbackTestimonials;
    }
  },

  async getSiteSettings() {
    try {
      const res = await request("/public/settings");
      return res.data;
    } catch (e) {
      return {
        siteName: "RCC Infrastructure",
        phone: "+91 98765 43210",
        email: "info@rccinfrastructure.com",
        address: "Mangalore, Karnataka, India",
        heroHeadline: "Designing & Building Spaces that Inspire",
        heroSubtext: "Over 15+ years of excellence in architectural design, residential construction, commercial spaces, and infrastructure development in Mangaluru.",
        heroButtonLabel: "Explore Projects",
        contactCtaTitle: "Ready to Build Your Dream Project?",
        contactCtaDescription: "Let's bring your vision to reality with RCC Infrastructure's proven expertise, transparent process, and premium craftsmanship.",
        mapEmbedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124442.27439162986!2d74.78201948956942!3d12.922983196901844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe15!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        socialLinks: {
          facebook: "https://www.facebook.com/",
          instagram: "https://www.instagram.com/",
          linkedin: "https://www.linkedin.com/",
          whatsapp: "https://wa.me/919876543210",
        },
      };
    }
  },

  async submitEnquiry(enquiryData) {
    return request("/public/enquiries", {
      method: "POST",
      body: JSON.stringify(enquiryData),
    });
  },

  // ==========================================
  // ADMIN AUTH ENDPOINTS
  // ==========================================

  async adminLogin(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async adminLogout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem("rcc_admin_user");
    }
  },

  async adminGetProfile() {
    return request("/auth/profile");
  },

  async adminChangePassword(currentPassword, newPassword) {
    return request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // ==========================================
  // ADMIN USERS (RBAC)
  // ==========================================

  async adminGetUsers() {
    return request("/auth/users");
  },

  async adminCreateUser(data) {
    return request("/auth/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateUser(id, data) {
    return request(`/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteUser(id) {
    return request(`/auth/users/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  async adminGetDashboard() {
    return request("/admin/dashboard");
  },

  // ==========================================
  // ADMIN SERVICES CRUD
  // ==========================================

  async adminGetServices() {
    const res = await request("/admin/services");
    return { ...res, data: Array.isArray(res.data) ? res.data.map(normalizeMediaRecord) : res.data };
  },

  async adminCreateService(data) {
    return request("/admin/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateService(id, data) {
    return request(`/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteService(id) {
    return request(`/admin/services/${id}`, {
      method: "DELETE",
    });
  },

  async adminReorderServices(orderedIds) {
    return request("/admin/services/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    });
  },

  // ==========================================
  // ADMIN PROJECTS CRUD
  // ==========================================

  async adminGetProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/projects${query ? `?${query}` : ""}`);
    return { ...res, data: Array.isArray(res.data) ? res.data.map(normalizeMediaRecord) : res.data };
  },

  async adminCreateProject(data) {
    return request("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateProject(id, data) {
    return request(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteProject(id) {
    return request(`/admin/projects/${id}`, {
      method: "DELETE",
    });
  },

  async adminReorderProjects(orderedIds) {
    return request("/admin/projects/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    });
  },

  // ==========================================
  // ADMIN CATEGORIES CRUD
  // ==========================================

  async adminGetCategories(type = "project") {
    return request(`/admin/categories?type=${type}`);
  },

  async adminCreateCategory(data) {
    return request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateCategory(id, data) {
    return request(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteCategory(id) {
    return request(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // ADMIN TESTIMONIALS CRUD
  // ==========================================

  async adminGetTestimonials() {
    return request("/admin/testimonials");
  },

  async adminCreateTestimonial(data) {
    return request("/admin/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateTestimonial(id, data) {
    return request(`/admin/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteTestimonial(id) {
    return request(`/admin/testimonials/${id}`, {
      method: "DELETE",
    });
  },

  async adminReorderTestimonials(orderedIds) {
    return request("/admin/testimonials/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    });
  },

  // ==========================================
  // ADMIN STATS CRUD
  // ==========================================

  async adminGetStats() {
    return request("/admin/stats");
  },

  async adminCreateStat(data) {
    return request("/admin/stats", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async adminUpdateStat(id, data) {
    return request(`/admin/stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async adminDeleteStat(id) {
    return request(`/admin/stats/${id}`, {
      method: "DELETE",
    });
  },

  async adminReorderStats(orderedIds) {
    return request("/admin/stats/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    });
  },

  // ==========================================
  // ADMIN ENQUIRIES
  // ==========================================

  async adminGetEnquiries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/enquiries${query ? `?${query}` : ""}`);
  },

  async adminUpdateEnquiryStatus(id, status, notes = "") {
    return request(`/admin/enquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  },

  async adminDeleteEnquiry(id) {
    return request(`/admin/enquiries/${id}`, {
      method: "DELETE",
    });
  },

  async adminExportEnquiries(format = "csv") {
    const response = await fetch(`${API_BASE}/admin/enquiries/export?format=${format}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Export failed");
    const blob = await response.blob();
    const ext = format === "xlsx" || format === "excel" ? "xls" : "csv";
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries_${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // ==========================================
  // ADMIN MEDIA LIBRARY
  // ==========================================

  async adminGetMedia() {
    return request("/admin/media");
  },

  async adminUploadMedia(file, metadata = {}) {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata.title) formData.append("title", metadata.title);
    if (metadata.altText) formData.append("altText", metadata.altText);

    return request("/admin/media/upload", {
      method: "POST",
      body: formData,
    });
  },

  async adminDeleteMedia(id) {
    return request(`/admin/media/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // ADMIN SITE SETTINGS
  // ==========================================

  async adminGetSettings() {
    return request("/admin/settings");
  },

  async adminUpdateSettings(settingsData) {
    return request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    });
  },
};

export default api;
