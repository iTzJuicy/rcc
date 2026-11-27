import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";
import MODEL_3D_TEMPLATES from "../../data/model3dTemplates";
import "../../styles/model3d.css";

const DEFAULT_PROJECT = {
  title: "",
  slug: "",
  mapUrl: "",
  category: "Residential",
  status: "Completed",
  location: "Mangaluru, Karnataka",
  area: "",
  client: "",
  description: "",
  fullDescription: "",
  coverImage: "/images/card1.webp",
  bannerImage: "",
  gallery: [],
  isFeatured: false,
  showQuotationButton: true,
  model3dUrl: "",
  model3dTemplate: "",
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
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [modelAssets, setModelAssets] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelListError, setModelListError] = useState("");
  const [modelMode, setModelMode] = useState("library");
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function init() {
      try {
        try {
          const modelsRes = await api.adminGetModels();
          setModelAssets(Array.isArray(modelsRes?.data) ? modelsRes.data : []);
        } catch (err) {
          setModelListError(err.message || "Failed to load saved models.");
        } finally {
          setLoadingModels(false);
        }

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
              mapUrl: found.mapUrl || "",
              category: found.category || "Residential",
              status: found.status || "Completed",
              location: found.location || "Mangaluru, Karnataka",
              area: found.area || "",
              client: found.client || "",
              description: found.description || "",
              fullDescription: found.fullDescription || "",
              coverImage: found.coverImage || found.image || "/images/card1.webp",
              bannerImage: found.bannerImage || "",
              gallery: Array.isArray(found.gallery) ? found.gallery : [],
              isFeatured: Boolean(found.isFeatured),
              showQuotationButton: found.showQuotationButton !== false,
              model3dUrl: found.model3dUrl || "",
              model3dTemplate: found.model3dTemplate || "",
            });
            if (found.model3dUrl) {
              setModelMode("library");
            } else if (found.model3dTemplate) {
              setModelMode("template");
            }
          } else {
            setToast({ type: "error", message: "Project not found" });
          }
        }
      } catch (err) {
        setToast({ type: "error", message: err.message || "Failed to initialize form data" });
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

  const handleBannerUpload = async (file) => {
    if (!file) return;
    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res?.data?.url) throw new Error("Banner upload did not return an image URL.");
      setForm((prev) => ({ ...prev, bannerImage: res.data.url }));
      setToast({ type: "success", message: "Project page banner uploaded." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload project banner." });
    } finally {
      setUploadingBanner(false);
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

  const handleModelUpload = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "glb" && ext !== "gltf") {
      setToast({ type: "error", message: "Only .glb and .gltf 3D model formats are accepted." });
      return;
    }
    setUploadingModel(true);
    try {
      const res = await api.adminUploadModel(file);
      if (res?.url) {
        const uploadedModel = {
          url: res.url,
          filename: res.filename || file.name,
        };
        setModelAssets((prev) => [
          uploadedModel,
          ...prev.filter((model) => model.url !== uploadedModel.url),
        ]);
        setForm((prev) => ({
          ...prev,
          model3dUrl: res.url,
          model3dTemplate: "",
        }));
        setModelMode("library");
        setToast({
          type: "success",
          message: res.storage === "local"
            ? "Model saved locally because Cloudinary rejected the file size. It is available only on this development server."
            : "3D building model uploaded successfully!",
        });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload 3D model." });
    } finally {
      setUploadingModel(false);
    }
  };

  const handleSelectModel = (url) => {
    setForm((prev) => ({
      ...prev,
      model3dUrl: url,
      model3dTemplate: "",
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setForm((prev) => ({
      ...prev,
      model3dTemplate: prev.model3dTemplate === templateId ? "" : templateId,
      model3dUrl: "",
    }));
  };

  const handleClearModel = () => {
    setForm((prev) => ({
      ...prev,
      model3dUrl: "",
      model3dTemplate: "",
    }));
    setToast({ type: "success", message: "3D visualization removed from this project." });
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
          "The project detail page uses the Default Site Banner unless you set an optional custom page banner.",
          "Upload up to 12 gallery photos for the interactive visual tour carousel.",
          "Uploaded 3D models are reusable from the Media Library; models assigned to a project must be unassigned before deletion.",
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
                <label htmlFor="slug">Project URL Slug</label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. skyline-luxury-heights"
                />
                <div className="admin-input-hint">
                  Used in the project page URL. Leave blank for a new project to generate it from the title.
                </div>
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
                <label htmlFor="client">Client</label>
                <input
                  id="client"
                  name="client"
                  type="text"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="e.g. Client or organization name"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="mapUrl">Google Maps Link</label>
                <input
                  id="mapUrl"
                  name="mapUrl"
                  type="url"
                  value={form.mapUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
                <div className="admin-input-hint">
                  Optional. This link is used by the View on Maps button on the project page.
                </div>
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
              <label className="admin-toggle-label">
                <input
                  type="checkbox"
                  name="showQuotationButton"
                  checked={form.showQuotationButton}
                  onChange={handleChange}
                />
                <span>Show Request Quotation / Booking button</span>
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

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Project Page Banner</h3>
              <p className="admin-card-subtitle">
                Optional banner at the top of this project detail page. Leave blank to use the Default Site Banner.
              </p>
            </div>
            {form.bannerImage && (
              <button type="button" className="admin-action-btn delete" onClick={() => setForm((prev) => ({ ...prev, bannerImage: "" }))}>
                <i className="fa-solid fa-rotate-left" /><span>Use Default Banner</span>
              </button>
            )}
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label>Banner Image URL</label>
              <input name="bannerImage" value={form.bannerImage} onChange={handleChange} placeholder="Blank uses the Default Site Banner" />
            </div>
            <label className="admin-file-upload-btn" style={{ marginTop: "12px" }}>
              <i className="fa-solid fa-cloud-arrow-up" />
              <span>{uploadingBanner ? "Uploading..." : "Upload / Change Project Banner"}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => handleBannerUpload(e.target.files?.[0])} disabled={uploadingBanner} />
            </label>
            {form.bannerImage && (
              <div className="admin-banner-preview" style={{ marginTop: "16px" }}>
                <img src={form.bannerImage} alt="Project page banner preview" />
              </div>
            )}
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

        {/* 3D BUILDING MODEL (OPTIONAL) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>3D Architectural Visualization (Optional)</h3>
              <p className="admin-card-subtitle">
                Render an interactive 3D model on the project page. Reuse a saved model, upload a new one, or choose a pre-built template.
              </p>
            </div>
            {(form.model3dUrl || form.model3dTemplate) && (
              <button
                type="button"
                className="admin-model3d-clear-btn"
                onClick={handleClearModel}
                title="Remove 3D visualization"
              >
                <i className="fa-solid fa-trash-can" style={{ marginRight: "6px" }} />
                Remove 3D Model
              </button>
            )}
          </div>

          <div className="admin-card-body">
            <div className="admin-model3d-tabs">
              <button
                type="button"
                className={`admin-model3d-tab ${modelMode === "library" ? "active" : ""}`}
                onClick={() => setModelMode("library")}
              >
                <i className="fa-solid fa-cube" style={{ marginRight: "6px" }} />
                Saved Models
              </button>
              <button
                type="button"
                className={`admin-model3d-tab ${modelMode === "template" ? "active" : ""}`}
                onClick={() => setModelMode("template")}
              >
                <i className="fa-solid fa-cubes" style={{ marginRight: "6px" }} />
                3D Templates
              </button>
              <button
                type="button"
                className={`admin-model3d-tab ${modelMode === "upload" ? "active" : ""}`}
                onClick={() => setModelMode("upload")}
              >
                <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: "6px" }} />
                Upload .GLB / .GLTF
              </button>
            </div>

            {modelMode === "library" && (
              <div className="admin-model3d-upload-zone">
                <p className="admin-input-hint">
                  Select a previously uploaded 3D model to reuse it on this project.
                </p>
                {loadingModels ? (
                  <p className="admin-input-hint">Loading saved models...</p>
                ) : (
                  <div className="admin-form-group">
                    <select
                      value={form.model3dUrl}
                      onChange={(e) => handleSelectModel(e.target.value)}
                    >
                      <option value="">Choose a saved model</option>
                      {form.model3dUrl && !modelAssets.some((model) => model.url === form.model3dUrl) && (
                        <option value={form.model3dUrl}>Current project model ({form.model3dUrl.split("/").pop()})</option>
                      )}
                      {modelAssets.map((model) => (
                        <option key={model.url} value={model.url}>
                          {model.filename}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {modelListError && (
                  <p className="admin-input-hint" role="alert">{modelListError}</p>
                )}
                {!loadingModels && !modelListError && modelAssets.length === 0 && !form.model3dUrl && (
                  <p className="admin-input-hint">No saved models yet. Upload a GLB or GLTF model to add it to your reusable model storage.</p>
                )}
              </div>
            )}

            {modelMode === "template" && (
              <div>
                <p className="admin-input-hint" style={{ marginBottom: "14px" }}>
                  Select an architectural archetype. Visitors can rotate, zoom, and explore the 3D structure in real-time.
                </p>
                <div className="admin-model3d-template-grid">
                  {MODEL_3D_TEMPLATES.map((tmpl) => {
                    const isSelected = form.model3dTemplate === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        className={`admin-model3d-template-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div
                          className="admin-model3d-template-icon"
                          dangerouslySetInnerHTML={{ __html: tmpl.icon }}
                        />
                        <div className="admin-model3d-template-label">{tmpl.label}</div>
                        <div className="admin-model3d-template-desc">{tmpl.description}</div>
                        {isSelected && (
                          <div className="admin-model3d-selected-badge">
                            <i className="fa-solid fa-circle-check" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {modelMode === "upload" && (
              <div className="admin-model3d-upload-zone">
                <p className="admin-input-hint">
                  Upload a 3D model in GLB (binary glTF) or glTF format. New uploads are saved for reuse across projects. Recommended format is <strong>.glb</strong> optimized for web (under 25MB).
                </p>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <label className="admin-model3d-upload-label">
                    <i className="fa-solid fa-upload" />
                    <span>{uploadingModel ? "Uploading Model..." : "Choose .GLB / .GLTF File"}</span>
                    <input
                      type="file"
                      accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                      onChange={(e) => handleModelUpload(e.target.files?.[0])}
                      disabled={uploadingModel}
                    />
                  </label>
                  {uploadingModel && (
                    <span style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
                      Uploading & processing 3D asset...
                    </span>
                  )}
                </div>

                {form.model3dUrl && (
                  <div className="admin-model3d-current">
                    <i className="fa-solid fa-cube" />
                    <div>
                      <div className="admin-model3d-current-name">
                        Uploaded Model: {form.model3dUrl.split("/").pop()}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>
                        URL: {form.model3dUrl}
                      </div>
                    </div>
                  </div>
                )}
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
            disabled={saving || uploadingBanner}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving..." : isNew ? "Create Project" : "Save Project Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
