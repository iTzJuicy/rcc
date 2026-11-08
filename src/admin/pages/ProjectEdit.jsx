import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

const DEFAULT_PROJECT = {
  title: "",
  slug: "",
  category: "Residential",
  status: "Completed",
  location: "Mangaluru, Karnataka",
  year: new Date().getFullYear().toString(),
  area: "",
  client: "",
  description: "",
  fullDescription: "",
  coverImage: "/images/card1.webp",
  gallery: [],
  isFeatured: false,
};

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(DEFAULT_PROJECT);
  const [categories, setCategories] = useState(["Residential", "Commercial", "Renovation", "Construction"]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function init() {
      try {
        const catRes = await api.get("/public/categories");
        if (catRes?.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data.map((c) => c.name));
        }

        if (!isNew) {
          const res = await api.adminGetProjects();
          const found = res?.data?.find((p) => p._id === id);
          if (found) {
            setForm({
              title: found.title || "",
              slug: found.slug || "",
              category: found.category || "Residential",
              status: found.status || "Completed",
              location: found.location || "Mangaluru, Karnataka",
              year: found.year || "",
              area: found.area || "",
              client: found.client || "",
              description: found.description || "",
              fullDescription: found.fullDescription || "",
              coverImage: found.coverImage || found.image || "/images/card1.webp",
              gallery: Array.isArray(found.gallery) ? found.gallery : [],
              isFeatured: Boolean(found.isFeatured),
            });
          } else {
            setToast({ type: "error", message: "Project not found" });
          }
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to initialize form data" });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverUpload = async (file) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.url) {
        setForm((prev) => ({ ...prev, coverImage: res.data.url }));
        setToast({ type: "success", message: "Main cover image uploaded successfully!" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload image" });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (file) => {
    if (!file) return;
    if (form.gallery.length >= 12) {
      setToast({ type: "error", message: "Maximum limit reached. Up to 12 gallery photos allowed." });
      return;
    }
    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.url) {
        setForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, res.data.url],
        }));
        setToast({ type: "success", message: "Gallery image added!" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload gallery image" });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      if (isNew) {
        await api.adminCreateProject(form);
        setToast({ type: "success", message: "Project created successfully!" });
      } else {
        await api.adminUpdateProject(id, form);
        setToast({ type: "success", message: "Project updated successfully!" });
      }
      setTimeout(() => navigate("/admin/projects"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save project" });
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading Project Details...</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-top-nav">
        <Link to="/admin/projects" className="admin-back-link">
          <i className="fa-solid fa-arrow-left" />
          <span>Back to Projects List</span>
        </Link>
      </div>

      <HowToUse
        title="Project Editor Instructions"
        tips={[
          "Short description appears on project cards across the website (max 160 chars).",
          "Full description appears on the Project Details page (max 1200 chars).",
          "Upload up to 12 gallery photos for the interactive visual tour carousel.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* BASIC DETAILS */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Basic Project Details</h3>
              <p className="admin-card-subtitle">Title, classification, and status.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-grid-2-col">
              <div className="admin-form-group">
                <label htmlFor="title">
                  Project Title <span className="admin-required">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={60}
                  placeholder="e.g. Skyline Luxury Heights"
                  required
                />
                <CharCounter current={form.title.length} max={60} />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category">Project Category <span className="admin-required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="status">Project Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Kadri, Mangaluru"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="year">Completion / Project Year</label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="e.g. 2025"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="area">Built-up Area</label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. 45,000 sq.ft."
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="description">
                Short Summary (Card Preview) <span className="admin-required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                maxLength={160}
                placeholder="High-level overview displayed on the portfolio and home cards..."
                required
              />
              <CharCounter current={form.description.length} max={160} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="fullDescription">
                Full Description (Detailed Case Study)
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                rows={6}
                value={form.fullDescription}
                onChange={handleChange}
                maxLength={1200}
                placeholder="Full technical brief including structural foundation, architectural finishes, amenities, and delivery..."
              />
              <CharCounter current={form.fullDescription.length} max={1200} />
            </div>

            <div className="admin-form-row-toggles">
              <label className="admin-toggle-label">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                <span>Featured on Home Page (Highlighted showcase build)</span>
              </label>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Main Cover Image</h3>
              <p className="admin-card-subtitle">Displayed as primary visual on all project listings.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-image-upload-zone">
              <div className="admin-image-preview-box">
                <img
                  src={form.coverImage || "/images/card1.webp"}
                  alt="Project Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/card1.webp";
                  }}
                />
              </div>

              <div className="admin-image-upload-actions">
                <label className="admin-file-upload-btn">
                  <i className="fa-solid fa-cloud-arrow-up" />
                  <span>{uploadingCover ? "Uploading..." : "Upload New Cover Photo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                    disabled={uploadingCover}
                  />
                </label>
                <div className="admin-input-hint" style={{ marginTop: "8px" }}>
                  Recommended size: 1200x800px in JPG or WebP format.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GALLERY (MAX 12) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Project Visual Tour: Gallery ({form.gallery.length}/12 images)</h3>
              <p className="admin-card-subtitle">
                Site photos, aerial drone captures, and interior finished angles.
              </p>
            </div>
            {form.gallery.length < 12 && (
              <label className="admin-btn-secondary" style={{ cursor: "pointer" }}>
                <i className="fa-solid fa-plus" />
                <span>{uploadingGallery ? "Uploading..." : "Add Photo"}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => handleGalleryUpload(e.target.files?.[0])}
                  disabled={uploadingGallery}
                />
              </label>
            )}
          </div>

          <div className="admin-card-body">
            <div className="admin-gallery-editor-grid">
              {form.gallery.map((imgUrl, idx) => (
                <div className="admin-gallery-thumb-card" key={idx}>
                  <img src={imgUrl} alt={`Project Gallery ${idx + 1}`} />
                  <button
                    type="button"
                    className="admin-gallery-remove-btn"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    title="Remove this photo"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                  <span className="admin-gallery-index-badge">#{idx + 1}</span>
                </div>
              ))}
            </div>

            {form.gallery.length === 0 && (
              <div className="admin-empty-gallery-hint">
                <i className="fa-solid fa-images" />
                <p>No gallery images uploaded yet. Add photos above to enable the interactive project slider.</p>
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="admin-sticky-actions">
          <Link to="/admin/projects" className="admin-btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving..." : isNew ? "Create Project" : "Save Project Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
