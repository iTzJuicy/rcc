import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";

const DEFAULT_IMAGE_ASSETS = [
  { _id: "def-1", url: "/images/card1.webp", filename: "card1.webp", format: "webp", bytes: 145000 },
  { _id: "def-2", url: "/images/card2.webp", filename: "card2.webp", format: "webp", bytes: 162000 },
  { _id: "def-3", url: "/images/card3.webp", filename: "card3.webp", format: "webp", bytes: 138000 },
  { _id: "def-4", url: "/images/card4.webp", filename: "card4.webp", format: "webp", bytes: 154000 },
  { _id: "def-5", url: "/images/impact.webp", filename: "impact.webp", format: "webp", bytes: 210000 },
  { _id: "def-6", url: "/images/about.webp", filename: "about.webp", format: "webp", bytes: 198000 },
  { _id: "def-7", url: "/images/contact.webp", filename: "contact.webp", format: "webp", bytes: 185000 },
  { _id: "def-8", url: "/images/logo.webp", filename: "logo.webp", format: "webp", bytes: 42000 },
];

export default function MediaLibrary() {
  const [mediaList, setMediaList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModels, setLoadingModels] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState("images");
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.adminGetMedia();
      setMediaList([...(res?.data || []), ...DEFAULT_IMAGE_ASSETS]);
    } catch (err) {
      setMediaList(DEFAULT_IMAGE_ASSETS);
      setAlert({ type: "error", text: err.message || "Unable to load uploaded images." });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadModels = useCallback(async () => {
    try {
      setLoadingModels(true);
      const res = await api.adminGetModels();
      setModelList(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Unable to load saved 3D models." });
    } finally {
      setLoadingModels(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
    loadModels();
  }, [loadMedia, loadModels]);

  const activeItems = activeTab === "images" ? mediaList : modelList;
  const totalPages = Math.ceil(activeItems.length / pageSize) || 1;
  const visibleMedia = activeItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAlert({ type: "", text: "" });

    try {
      await api.adminUploadMedia(file, { title: file.name });
      setAlert({ type: "success", text: "Image uploaded and compressed successfully." });
      loadMedia();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to upload image." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleModelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setAlert({ type: "", text: "" });

    try {
      const res = await api.adminUploadModel(file);
      if (!res?.url || !res?.filename) throw new Error("Upload did not return the saved model details.");
      setAlert({ type: "success", text: `${res.filename} was saved to the 3D model library.` });
      await loadModels();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to upload 3D model." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Unable to copy the media URL." });
    }
  };

  const handleDelete = async (id, filename) => {
    if (id.startsWith("def-")) {
      setAlert({ type: "error", text: "System core images cannot be deleted." });
      return;
    }
    if (!window.confirm(`Delete ${filename}?`)) return;

    try {
      await api.adminDeleteMedia(id);
      setAlert({ type: "success", text: "Media file deleted." });
      loadMedia();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Delete failed" });
    }
  };

  const handleDeleteModel = async (id, filename) => {
    if (!window.confirm(`Delete "${filename}" from the 3D model library?`)) return;
    try {
      await api.adminDeleteModel(id);
      setAlert({ type: "success", text: `${filename} was deleted.` });
      await loadModels();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to delete 3D model." });
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to use the Media Library"
        tips={
          activeTab === "images"
            ? ["Upload optimized images in WebP, JPEG, PNG, AVIF format.", "Use Copy URL to reuse an image in a project, service, or page banner.", "System images are protected and cannot be deleted."]
            : ["Upload GLB or GLTF models and reuse them in project editors.", "Original filenames are kept visible to help identify models.", "Models assigned to a project must be unassigned before deletion."]
        }
      />
      {alert.text && (
        <div className={`admin-toast-banner ${alert.type === "error" ? "error" : "success"}`} style={{ marginBottom: "20px" }}>
          {alert.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>{activeTab === "images" ? `Image Library (${mediaList.length} assets)` : `3D Model Library (${modelList.length} models)`}</h3>
            <p>{activeTab === "images" ? "Upload, optimize, and reuse images across your website." : "Manage saved GLB and GLTF files for reuse in project pages."}</p>
          </div>
          <label className="admin-btn-primary admin-media-upload-button">
            <Icon name="upload" size={16} />
            <span>
              {uploading
                ? "Uploading..."
                : activeTab === "images"
                  ? "Upload Image"
                  : "Upload 3D Model"}
            </span>
            <input
              type="file"
              accept={activeTab === "images" ? "image/png, image/jpeg, image/webp, image/avif" : ".glb,.gltf,model/gltf-binary,model/gltf+json"}
              onChange={activeTab === "images" ? handleFileUpload : handleModelUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="admin-card-body">
          <div className="admin-media-tabs" role="tablist" aria-label="Media types">
            <button type="button" role="tab" aria-selected={activeTab === "images"} className={activeTab === "images" ? "active" : ""} onClick={() => { setActiveTab("images"); setCurrentPage(1); }}>
              <i className="fa-solid fa-images" aria-hidden="true" /> Images
            </button>
            <button type="button" role="tab" aria-selected={activeTab === "models"} className={activeTab === "models" ? "active" : ""} onClick={() => { setActiveTab("models"); setCurrentPage(1); }}>
              <i className="fa-solid fa-cubes" aria-hidden="true" /> 3D Models
            </button>
          </div>

          {(activeTab === "images" ? loading : loadingModels) ? (
            <div className="admin-media-empty" role="status">Loading {activeTab === "images" ? "images" : "3D models"}…</div>
          ) : activeItems.length === 0 ? (
            <div className="admin-media-empty">
              <i className={`fa-solid ${activeTab === "images" ? "fa-image" : "fa-cube"}`} aria-hidden="true" />
              <p>{activeTab === "images" ? "No images uploaded yet." : "No saved 3D models yet. Upload a GLB or GLTF file to add one."}</p>
            </div>
          ) : (
          <div className={`admin-media-grid ${activeTab === "models" ? "admin-model-library-grid" : ""}`}>
            {visibleMedia.map((item) => {
              const kb = item.bytes ? `${(item.bytes / 1024).toFixed(1)} KB` : "";
              const isCopied = copiedId === item._id;

              return activeTab === "images" ? (
                <div key={item._id} className="admin-media-item">
                  <img
                    src={item.url}
                    alt={item.title || item.filename}
                    className="admin-media-thumb"
                    loading="lazy"
                  />
                  <div className="admin-media-meta">
                    <div className="admin-media-title" title={item.filename}>
                      {item.filename}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginBottom: "8px" }}>
                      {item.format?.toUpperCase()} {kb && `• ${kb}`}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.url, item._id)}
                        className="admin-action-btn"
                        style={{ flex: 1, justifyContent: "center", fontSize: "11px" }}
                      >
                        {isCopied ? "✓ Copied" : "Copy URL"}
                      </button>

                      {!item._id.startsWith("def-") && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.filename)}
                          className="admin-action-btn delete"
                          style={{ padding: "6px" }}
                          title="Delete media"
                        >
                          <Icon name="trash" size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <article key={item._id} className="admin-model-library-item">
                  <div className="admin-model-library-icon" aria-hidden="true">
                    <i className="fa-solid fa-cube" />
                    <span>{item.format || item.filename?.split(".").pop() || "3D"}</span>
                  </div>
                  <div className="admin-model-library-meta">
                    <h4 title={item.filename}>{item.filename}</h4>
                    <p>{item.storage === "cloudinary" ? "Cloud storage" : "Local storage"}{kb ? ` · ${kb}` : ""}</p>
                    <div className="admin-model-library-actions">
                      <button type="button" className="admin-action-btn" onClick={() => handleCopy(item.url, item._id)}>
                        {isCopied ? "Copied" : "Copy URL"}
                      </button>
                      <button type="button" className="admin-action-btn delete" onClick={() => handleDeleteModel(item._id, item.filename)} aria-label={`Delete ${item.filename}`}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            totalItems={activeItems.length}
          />
        </div>
      </div>
    </div>
  );
}
