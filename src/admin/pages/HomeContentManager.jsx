import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

export default function HomeContentManager() {
  const [form, setForm] = useState({
    heroHeading: "",
    heroDescription: "",
    heroButtonText: "",
    aboutTitle: "",
    aboutDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/home");
        if (res?.data) {
          setForm({
            heroHeading: res.data.heroHeading || "",
            heroDescription: res.data.heroDescription || "",
            heroButtonText: res.data.heroButtonText || "",
            aboutTitle: res.data.aboutTitle || "",
            aboutDescription: res.data.aboutDescription || "",
          });
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load Home content" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      const res = await api.put("/admin/content/home", form);
      if (res?.success) {
        setToast({ type: "success", message: "Home page content saved successfully!" });
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
    return <div className="admin-loading-state">Loading Home Page Content...</div>;
  }

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to edit Home Page content"
        tips={[
          "Keep headings concise so they remain readable on mobile screens.",
          "Use the character counters to keep hero and About text within the recommended limits.",
          "Save changes to publish them on the public home page.",
        ]}
      />
      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* HERO SECTION CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Hero Banner Section</h3>
              <p className="admin-card-subtitle">
                The first thing visitors see at the very top of the home page.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-form-group">
              <label htmlFor="heroHeading">
                Hero Heading <span className="admin-required">*</span>
              </label>
              <input
                id="heroHeading"
                name="heroHeading"
                type="text"
                value={form.heroHeading}
                onChange={handleChange}
                maxLength={55}
                required
              />
              <CharCounter current={form.heroHeading.length} max={55} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="heroDescription">
                Hero Description <span className="admin-required">*</span>
              </label>
              <textarea
                id="heroDescription"
                name="heroDescription"
                rows={3}
                value={form.heroDescription}
                onChange={handleChange}
                maxLength={160}
                required
              />
              <CharCounter current={form.heroDescription.length} max={160} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="heroButtonText">
                Hero Button Text <span className="admin-required">*</span>
              </label>
              <input
                id="heroButtonText"
                name="heroButtonText"
                type="text"
                value={form.heroButtonText}
                onChange={handleChange}
                maxLength={22}
                required
              />
              <CharCounter current={form.heroButtonText.length} max={22} />
            </div>
          </div>
        </div>

        {/* ABOUT US PREVIEW CARD */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Home "About Us" Section</h3>
              <p className="admin-card-subtitle">
                Brief introductory section on the home page linking to the full About page.
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            <div className="admin-form-group">
              <label htmlFor="aboutTitle">
                Section Title <span className="admin-required">*</span>
              </label>
              <input
                id="aboutTitle"
                name="aboutTitle"
                type="text"
                value={form.aboutTitle}
                onChange={handleChange}
                maxLength={45}
                required
              />
              <CharCounter current={form.aboutTitle.length} max={45} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="aboutDescription">
                Section Description <span className="admin-required">*</span>
              </label>
              <textarea
                id="aboutDescription"
                name="aboutDescription"
                rows={4}
                value={form.aboutDescription}
                onChange={handleChange}
                maxLength={300}
                required
              />
              <CharCounter current={form.aboutDescription.length} max={300} />
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
