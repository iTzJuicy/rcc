import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

const ICON_OPTIONS = [
  { value: "fa-award", label: "Award / Quality Check" },
  { value: "fa-clock", label: "Clock / On-Time" },
  { value: "fa-city", label: "City / Infrastructure" },
  { value: "fa-leaf", label: "Leaf / Sustainability" },
  { value: "fa-handshake", label: "Handshake / Trust" },
  { value: "fa-gem", label: "Gem / Excellence" },
  { value: "fa-lightbulb", label: "Lightbulb / Innovation" },
  { value: "fa-shield-halved", label: "Shield / Safety" },
  { value: "fa-hammer", label: "Hammer / Craftsmanship" },
  { value: "fa-users", label: "Team / People" },
];

export default function AboutContentManager() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    vision: "",
    mission: "",
    values: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/about");
        if (res?.data) {
          setForm({
            title: res.data.title || "",
            description: res.data.description || "",
            vision: res.data.vision || "",
            mission: res.data.mission || "",
            values: Array.isArray(res.data.values) ? res.data.values : [],
          });
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load About page content" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.values];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, values: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      const res = await api.put("/admin/content/about", form);
      if (res?.success) {
        setToast({ type: "success", message: "About page content saved successfully!" });
      } else {
        setToast({ type: "error", message: res?.message || "Failed to save content" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save content" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading About Page Content...</div>;
  }

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to use About Page editor"
        tips={[
          "Intro title and description represent your firm's story at the top of the About page.",
          "Vision and Mission guide the purpose section (220 characters max each).",
          "Select meaningful Font Awesome icons for each core value from the visual icon picker.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* INTRO CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Page Intro & Story</h3>
              <p className="admin-card-subtitle">
                The main headline and paragraph under 'Our Story'.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-form-group">
              <label htmlFor="title">
                Intro Title <span className="admin-required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                maxLength={45}
                required
              />
              <CharCounter current={form.title.length} max={45} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="description">
                Intro Story Description <span className="admin-required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                maxLength={600}
                required
              />
              <CharCounter current={form.description.length} max={600} />
            </div>
          </div>
        </div>

        {/* VISION & MISSION CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Vision & Mission</h3>
              <p className="admin-card-subtitle">
                The guiding principles of RCC Infrastructure.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-form-group">
              <label htmlFor="vision">
                Vision Statement <span className="admin-required">*</span>
              </label>
              <textarea
                id="vision"
                name="vision"
                rows={3}
                value={form.vision}
                onChange={handleChange}
                maxLength={220}
                required
              />
              <CharCounter current={form.vision.length} max={220} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="mission">
                Mission Statement <span className="admin-required">*</span>
              </label>
              <textarea
                id="mission"
                name="mission"
                rows={3}
                value={form.mission}
                onChange={handleChange}
                maxLength={220}
                required
              />
              <CharCounter current={form.mission.length} max={220} />
            </div>
          </div>
        </div>

        {/* CORE VALUES (FIXED 4 CARDS WITH VISUAL ICON PICKER) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Core Values</h3>
              <p className="admin-card-subtitle">
                The 4 pillars displayed in the 'What Guides Us' section.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-values-grid-editor">
              {form.values.map((val, idx) => (
                <div className="admin-value-card-editor" key={val.id || idx}>
                  <div className="admin-value-editor-header">
                    <strong>Value #{idx + 1}</strong>
                    <div className="admin-value-icon-preview">
                      <i className={`fa-solid ${val.icon}`} />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Icon</label>
                    <select
                      value={val.icon}
                      onChange={(e) => handleValueChange(idx, "icon", e.target.value)}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => handleValueChange(idx, "title", e.target.value)}
                      maxLength={28}
                      required
                    />
                    <CharCounter current={val.title.length} max={28} />
                  </div>

                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      value={val.description}
                      onChange={(e) => handleValueChange(idx, "description", e.target.value)}
                      maxLength={120}
                      required
                    />
                    <CharCounter current={val.description.length} max={120} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="admin-sticky-actions">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
