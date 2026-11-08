import { useState, useEffect } from "react";
import api from "../../services/api";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";

export default function MediaLibrary() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Default images pre-loaded for easy reuse
  const defaultAssets = [
    { _id: "def-1", url: "/images/card1.webp", filename: "card1.png", format: "png", bytes: 145000 },
    { _id: "def-2", url: "/images/card2.webp", filename: "card2.png", format: "png", bytes: 162000 },
    { _id: "def-3", url: "/images/card3.webp", filename: "card3.png", format: "png", bytes: 138000 },
    { _id: "def-4", url: "/images/card4.webp", filename: "card4.png", format: "png", bytes: 154000 },
    { _id: "def-5", url: "/images/impact.webp", filename: "impact.png", format: "png", bytes: 210000 },
    { _id: "def-6", url: "/images/about.webp", filename: "about.png", format: "png", bytes: 198000 },
    { _id: "def-7", url: "/images/contact.webp", filename: "contact.png", format: "png", bytes: 185000 },
    { _id: "def-8", url: "/images/logo.webp", filename: "logo.png", format: "png", bytes: 42000 },
  ];

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await api.adminGetMedia();
      if (res?.data) {
        setMediaList([...res.data, ...defaultAssets]);
      } else {
        setMediaList(defaultAssets);
      }
    } catch (err) {
      setMediaList(defaultAssets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const totalPages = Math.ceil(mediaList.length / pageSize) || 1;
  const visibleMedia = mediaList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, filename) => {
    if (id.startsWith("def-")) {
      alert("System core images cannot be deleted.");
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

  return (
    <div className="admin-page-container">
      <HowToUse title="How to use the Media Library" tips={["Upload optimized images in WebP, JPEG, PNG, AVIF format.", "Use Copy URL to reuse an image in a project, service, or page banner.", "System images are protected and cannot be deleted."]} />
      {alert.text && (
        <div className={`admin-login-alert ${alert.type === "error" ? "error" : ""}`} style={{ marginBottom: "20px" }}>
          {alert.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Media Library ({mediaList.length} assets)</h3>
            <p>Upload, compress to WebP, and copy URLs to reuse across projects and services</p>
          </div>

          <label
            className="admin-btn-primary"
            style={{ width: "auto", cursor: uploading ? "wait" : "pointer" }}
          >
            <Icon name="upload" size={16} />
            <span>{uploading ? "Compressing & Uploading..." : "Upload New Image"}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/avif"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="admin-card-body">
          <div className="admin-media-grid">
            {visibleMedia.map((item) => {
              const kb = item.bytes ? `${(item.bytes / 1024).toFixed(1)} KB` : "";
              const isCopied = copiedId === item._id;

              return (
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
                    <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "8px" }}>
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
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            totalItems={mediaList.length}
          />
        </div>
      </div>
    </div>
  );
}
