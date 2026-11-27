import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";
import { CONTENT_FALLBACKS, updateCachedSiteContent } from "../../hooks/useSiteContent";

function normalizeExpertise(value) {
  if (Array.isArray(value)) {
    return { ...CONTENT_FALLBACKS.expertise, items: value };
  }
  return {
    ...CONTENT_FALLBACKS.expertise,
    ...(value || {}),
    hero: { ...CONTENT_FALLBACKS.expertise.hero, ...value?.hero },
    intro: { ...CONTENT_FALLBACKS.expertise.intro, ...value?.intro },
    areas: { ...CONTENT_FALLBACKS.expertise.areas, ...value?.areas },
    approach: { ...CONTENT_FALLBACKS.expertise.approach, ...value?.approach },
  };
}

function paragraphsValue(paragraphs) {
  return (paragraphs || []).join("\n\n");
}

function parseParagraphs(value) {
  return value.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
}

export default function ExpertiseManager() {
  const [form, setForm] = useState(CONTENT_FALLBACKS.expertise);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/expertise");
        if (res?.data) setForm(normalizeExpertise(res.data));
      } catch (err) {
        setToast({ type: "error", message: err.message || "Failed to load Expertise content" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res?.data?.url) throw new Error("Image upload did not return an image URL.");
      updateSection("approach", "image", res.data.url);
      setToast({ type: "success", message: "Approach image uploaded." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload approach image." });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });
    try {
      const res = await api.put("/admin/content/expertise", form);
      if (res?.success) {
        updateCachedSiteContent("expertise", form);
        setToast({ type: "success", message: "Our Expertise page saved successfully." });
      } else {
        setToast({ type: "error", message: res?.message || "Failed to save Expertise content." });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save Expertise content." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading-state">Loading Expertise content...</div>;

  return (
    <div className="admin-page-container">
      <HowToUse
        title="Manage the Our Expertise page"
        tips={[
          "Edit all page headings, descriptions, capability cards, links and the approach image here.",
          "Add, remove or reorder capability cards; their numbers are generated automatically.",
          "Separate paragraphs with a blank line.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`} role="status">
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-card-header"><h3>Page Banner Text</h3></div>
          <div className="admin-card-body admin-grid-2-col">
            {Object.entries(form.hero).map(([field, value]) => (
              <div className="admin-form-group" key={field}>
                <label>{field === "eyebrow" ? "Eyebrow" : field === "title" ? "Page title" : "Description"}</label>
                {field === "description" ? (
                  <textarea rows={3} value={value} onChange={(e) => updateSection("hero", field, e.target.value)} />
                ) : (
                  <input value={value} onChange={(e) => updateSection("hero", field, e.target.value)} required />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><h3>Introduction</h3></div>
          <div className="admin-card-body admin-grid-2-col">
            <div className="admin-form-group">
              <label>Eyebrow</label>
              <input value={form.intro.eyebrow} onChange={(e) => updateSection("intro", "eyebrow", e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Heading</label>
              <input value={form.intro.title} onChange={(e) => updateSection("intro", "title", e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Paragraphs (separate with a blank line)</label>
              <textarea rows={6} value={paragraphsValue(form.intro.paragraphs)} onChange={(e) => updateSection("intro", "paragraphs", parseParagraphs(e.target.value))} />
            </div>
            <div className="admin-form-group">
              <label>Services button label</label>
              <input value={form.intro.buttonText} onChange={(e) => updateSection("intro", "buttonText", e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><h3>Expertise Cards Section</h3></div>
          <div className="admin-card-body admin-grid-2-col">
            {["eyebrow", "title", "description", "footerText", "footerLinkText"].map((field) => (
              <div className="admin-form-group" key={field}>
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                {field === "description" ? (
                  <textarea rows={3} value={form.areas[field]} onChange={(e) => updateSection("areas", field, e.target.value)} />
                ) : (
                  <input value={form.areas[field]} onChange={(e) => updateSection("areas", field, e.target.value)} required />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-list-actions-bar">
          <div>
            <h3>Capability Cards ({form.items.length})</h3>
            <p className="admin-card-subtitle">Card order controls the display order and numbering.</p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => setForm((prev) => ({ ...prev, items: [...prev.items, { id: `exp-${Date.now()}`, title: "", description: "" }] }))}
            disabled={form.items.length >= 20}
          >
            <i className="fa-solid fa-plus" /><span>Add Card</span>
          </button>
        </div>
        <div className="admin-grid-2-col">
          {form.items.map((item, index) => (
            <div className="admin-card" key={item.id || index}>
              <div className="admin-card-header">
                <h3>Card {String(index + 1).padStart(2, "0")}</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="admin-action-btn" disabled={index === 0} onClick={() => setForm((prev) => {
                    const items = [...prev.items]; [items[index - 1], items[index]] = [items[index], items[index - 1]];
                    return { ...prev, items };
                  })} aria-label="Move card up"><i className="fa-solid fa-arrow-up" /></button>
                  <button type="button" className="admin-action-btn" disabled={index === form.items.length - 1} onClick={() => setForm((prev) => {
                    const items = [...prev.items]; [items[index + 1], items[index]] = [items[index], items[index + 1]];
                    return { ...prev, items };
                  })} aria-label="Move card down"><i className="fa-solid fa-arrow-down" /></button>
                  <button type="button" className="admin-action-btn delete" onClick={() => setForm((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }))}>
                    <i className="fa-solid fa-trash" /><span>Remove</span>
                  </button>
                </div>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input value={item.title} maxLength={35} onChange={(e) => updateItem(index, "title", e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea rows={4} value={item.description} maxLength={190} onChange={(e) => updateItem(index, "description", e.target.value)} required />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><h3>Our Approach</h3></div>
          <div className="admin-card-body admin-grid-2-col">
            <div className="admin-form-group">
              <label>Eyebrow</label>
              <input value={form.approach.eyebrow} onChange={(e) => updateSection("approach", "eyebrow", e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Heading</label>
              <input value={form.approach.title} onChange={(e) => updateSection("approach", "title", e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Paragraphs (separate with a blank line)</label>
              <textarea rows={6} value={paragraphsValue(form.approach.paragraphs)} onChange={(e) => updateSection("approach", "paragraphs", parseParagraphs(e.target.value))} />
            </div>
            <div className="admin-form-group">
              <label>Process button label</label>
              <input value={form.approach.buttonText} onChange={(e) => updateSection("approach", "buttonText", e.target.value)} required />
              <label style={{ marginTop: "12px" }}>Image URL</label>
              <input value={form.approach.image} onChange={(e) => updateSection("approach", "image", e.target.value)} required />
              <label className="admin-file-upload-btn" style={{ marginTop: "12px" }}>
                <i className="fa-solid fa-cloud-arrow-up" />
                <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => handleImageUpload(e.target.files?.[0])} disabled={uploadingImage} />
              </label>
              {form.approach.image && <img src={form.approach.image} alt="Approach section preview" style={{ display: "block", width: "100%", maxHeight: "180px", objectFit: "cover", marginTop: "12px", borderRadius: "8px" }} />}
            </div>
          </div>
        </div>

        <div className="admin-sticky-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving || uploadingImage}>
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving Changes..." : "Save Expertise Page"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
