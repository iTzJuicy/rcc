import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

const DEFAULT_SERVICE = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  image: "/images/card1.webp",
  icon: "building",
  gallery: [],
  order: 0,
  showOnHome: true,
  isActive: true,
};

export default function ServiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(DEFAULT_SERVICE);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    if (isNew) return;
    async function load() {
      try {
        const res = await api.adminGetServices();
        const found = res?.data?.find((s) => s._id === id);
        if (found) {
          setForm({
            title: found.title || "",
            slug: found.slug || "",
            shortDescription: found.shortDescription || found.description || "",
            longDescription: found.longDescription || "",
            image: found.image || "/images/card1.webp",
            icon: found.icon || "building",
            gallery: Array.isArray(found.gallery) ? found.gallery : [],
            order: found.order || 0,
            showOnHome: found.showOnHome ?? true,
            isActive: found.isActive ?? true,
          });
        } else {
          setToast({ type: "error", message: "Service not found" });
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load service details" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        setToast({ type: "success", message: "Main cover image uploaded successfully!" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (file) => {
    if (!file) return;
    if (form.gallery.length >= 10) {
      setToast({ type: "error", message: "Maximum limit reached. Up to 10 gallery photos allowed." });
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
        await api.adminCreateService(form);
        setToast({ type: "success", message: "Service created successfully!" });
      } else {
        await api.adminUpdateService(id, form);
        setToast({ type: "success", message: "Service updated successfully!" });
      }
      setTimeout(() => navigate("/admin/services"), 800);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save service" });
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading Service Details...</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-top-nav">
        <Link to="/admin/services" className="admin-back-link">
          <i className="fa-solid fa-arrow-left" />
          <span>Back to Services List</span>
        </Link>
      </div>

      <HowToUse
        title="Service Editor Instructions"
        tips={[
          "Short description appears on service cards (max 160 chars).",
          "Long description appears on the dedicated Service Details page (max 1200 chars).",
          "Upload up to 10 photos in the gallery. On the public site, these render as a swipeable carousel.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* BASIC DETAILS CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Basic Service Details</h3>
              <p className="admin-card-subtitle">Title, descriptions, and URL slug.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-grid-2-col">
              <div className="admin-form-group">
                <label htmlFor="title">
                  Service Title <span className="admin-required">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={60}
                  placeholder="e.g. Residential Building Construction"
                  required
                />
                <CharCounter current={form.title.length} max={60} />
              </div>

              <div className="admin-form-group">
                <label htmlFor="slug">Custom URL Slug (optional)</label>
                <div className="admin-input-hint">Leave blank to generate automatically from title.</div>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. residential-construction"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="shortDescription">
                Short Description (Card Summary) <span className="admin-required">*</span>
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                value={form.shortDescription}
                onChange={handleChange}
                maxLength={160}
                placeholder="Brief summary displayed on the home page and services catalog cards..."
                required
              />
              <CharCounter current={form.shortDescription.length} max={160} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="longDescription">
                Long Description (Service Overview on Details Page)
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                rows={6}
                value={form.longDescription}
                onChange={handleChange}
                maxLength={1200}
                placeholder="In-depth explanation of scope, methodology, structural standards, and client deliverables..."
              />
              <CharCounter current={form.longDescription.length} max={1200} />
            </div>

            <div className="admin-form-row-toggles">
              <label className="admin-toggle-label">
                <input
                  type="checkbox"
                  name="showOnHome"
                  checked={form.showOnHome}
                  onChange={handleChange}
                />
                <span>Show on Home Page Services Preview (Top 4 shown)</span>
              </label>

              <label className="admin-toggle-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <span>Active (Published on public website)</span>
              </label>
            </div>
          </div>
        </div>

        {/* MAIN COVER IMAGE CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Main Cover Image</h3>
              <p className="admin-card-subtitle">
                Shown on catalog cards and the header of the Service Details page.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-image-upload-zone">
              <div className="admin-image-preview-box">
                <img
                  src={form.image || "/images/card1.webp"}
                  alt="Service Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/card1.webp";
                  }}
                />
              </div>

              <div className="admin-image-upload-actions">
                <label className="admin-file-upload-btn">
                  <i className="fa-solid fa-cloud-arrow-up" />
                  <span>{uploadingImage ? "Uploading..." : "Upload New Cover Image"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => handleMainImageUpload(e.target.files?.[0])}
                    disabled={uploadingImage}
                  />
                </label>
                <div className="admin-input-hint" style={{ marginTop: "8px" }}>
                  Recommended size: 800x600px in JPG or WebP format.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WORK IN ACTION: GALLERY CARD (MAX 10) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Work in Action: Gallery ({form.gallery.length}/10 images)</h3>
              <p className="admin-card-subtitle">
                High-resolution photos showcasing actual project execution for this service.
              </p>
            </div>
            {form.gallery.length < 10 && (
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
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
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
                <p>No gallery images uploaded yet. The gallery section is automatically hidden on the website until you add photos.</p>
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="admin-sticky-actions">
          <Link to="/admin/services" className="admin-btn-outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving..." : isNew ? "Create Service" : "Save Service Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
