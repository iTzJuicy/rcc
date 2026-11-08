import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

export default function ExpertiseManager() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/expertise");
        if (res?.data && Array.isArray(res.data)) {
          setCards(res.data);
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load Expertise content" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCardChange = (index, field, value) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      const res = await api.put("/admin/content/expertise", cards);
      if (res?.success) {
        setToast({ type: "success", message: "Our Expertise content updated successfully!" });
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
    return <div className="admin-loading-state">Loading Expertise Cards...</div>;
  }

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage Our Expertise section"
        tips={[
          "There are exactly 6 capabilities shown on the Our Expertise page.",
          "Card numbers (01 to 06) are assigned automatically in sequential order.",
          "Keep descriptions concise (up to 190 characters) so all cards match in visual height.",
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
          {cards.map((card, idx) => (
            <div className="admin-card" key={card.id || idx}>
              <div className="admin-card-header">
                <div>
                  <h3>
                    Card {String(idx + 1).padStart(2, "0")}
                  </h3>
                  <p className="admin-card-subtitle">
                    Position #{idx + 1} in the capabilities grid
                  </p>
                </div>
              </div>

              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label>Card Title <span className="admin-required">*</span></label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                    maxLength={35}
                    required
                  />
                  <CharCounter current={card.title.length} max={35} />
                </div>

                <div className="admin-form-group">
                  <label>Card Description <span className="admin-required">*</span></label>
                  <textarea
                    rows={4}
                    value={card.description}
                    onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                    maxLength={190}
                    required
                  />
                  <CharCounter current={card.description.length} max={190} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-sticky-actions">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving Changes..." : "Save Expertise Cards"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
