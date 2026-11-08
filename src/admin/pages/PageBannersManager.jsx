import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";

const PAGES_LIST = [
  { key: "default", label: "Default Site Banner (Used when no specific banner is set)" },
  { key: "about", label: "About Us Page" },
  { key: "services", label: "Services Page" },
  { key: "projects", label: "Projects Page" },
  { key: "expertise", label: "Our Expertise Page" },
  { key: "process", label: "Our Process Page" },
  { key: "contact", label: "Contact Us Page" },
  { key: "privacy", label: "Privacy Policy Page" },
  { key: "terms", label: "Terms & Conditions Page" },
];

export default function PageBannersManager() {
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/pageBanners");
        if (res?.data) {
          setBanners(res.data);
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load page banners" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUrlChange = (key, url) => {
    setBanners((prev) => ({ ...prev, [key]: url }));
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.url) {
        handleUrlChange(key, res.data.url);
        setToast({ type: "success", message: `Uploaded banner image for ${key}!` });
      } else {
        setToast({ type: "error", message: "Failed to upload image" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Upload failed" });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      const res = await api.put("/admin/content/pageBanners", banners);
      if (res?.success) {
        setToast({ type: "success", message: "Page banners updated successfully!" });
      } else {
        setToast({ type: "error", message: res?.message || "Failed to save banners" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save banners" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading Page Banners...</div>;
  }

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage page banners"
        tips={[
          "Each inner page can have its own customized hero banner image.",
          "If a page has no specific banner image set, it will automatically fall back to the Default Site Banner.",
          "Recommended image dimensions: 1920x600px in JPG or WebP format for optimal loading speed.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-2-col">
          {PAGES_LIST.map((page) => {
            const currentImg = banners[page.key] || (page.key !== "default" ? banners.default : "/images/banner.webp");
            const isCustom = Boolean(banners[page.key]);

            return (
              <div className="admin-card admin-banner-card" key={page.key}>
                <div className="admin-card-header">
                  <div>
                    <h3>{page.label}</h3>
                    <p className="admin-card-subtitle">
                      {isCustom ? "Custom banner configured" : "Inheriting from default"}
                    </p>
                  </div>
                </div>

                <div className="admin-card-body">
                  <div className="admin-banner-preview">
                    <img
                      src={currentImg}
                      alt={page.label}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/banner.webp";
                      }}
                    />
                  </div>

                  <div className="admin-banner-controls">
                    <label className="admin-file-upload-btn">
                      <i className="fa-solid fa-cloud-arrow-up" />
                      <span>{uploadingKey === page.key ? "Uploading..." : "Upload New Image"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileUpload(page.key, e.target.files?.[0])}
                        disabled={uploadingKey === page.key}
                      />
                    </label>

                    {page.key !== "default" && isCustom && (
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => handleUrlChange(page.key, "")}
                      >
                        <i className="fa-solid fa-rotate-left" />
                        <span>Revert to Default</span>
                      </button>
                    )}
                  </div>

                  <div className="admin-form-group" style={{ marginTop: "12px" }}>
                    <label>Image URL Path</label>
                    <input
                      type="text"
                      value={banners[page.key] || ""}
                      onChange={(e) => handleUrlChange(page.key, e.target.value)}
                      placeholder="/images/banner.webp"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="admin-sticky-actions">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving Banners..." : "Save All Banners"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
