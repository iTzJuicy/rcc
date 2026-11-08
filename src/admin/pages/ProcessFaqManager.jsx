import { useState, useEffect, useRef } from "react";
import HowToUse from "../components/HowToUse";
import CharCounter from "../components/CharCounter";
import api from "../../services/api";

export default function ProcessFaqManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const listRef = useRef(null);
  const sortableInstance = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/content/faqs");
        if (res?.data && Array.isArray(res.data)) {
          setFaqs(res.data);
        }
      } catch (err) {
        setToast({ type: "error", message: "Failed to load FAQs" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Initialize SortableJS drag handle from CDN
  useEffect(() => {
    if (!listRef.current || typeof window.Sortable === "undefined") return;

    try {
      if (sortableInstance.current) {
        sortableInstance.current.destroy();
        sortableInstance.current = null;
      }
    } catch {
      sortableInstance.current = null;
    }

    try {
      sortableInstance.current = new window.Sortable(listRef.current, {
        handle: ".admin-drag-handle",
        animation: 150,
        ghostClass: "sortable-ghost",
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return;
          setFaqs((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(evt.oldIndex, 1);
            updated.splice(evt.newIndex, 0, movedItem);
            return updated;
          });
        },
      });
    } catch {
      // ignore init error
    }

    return () => {
      try {
        if (sortableInstance.current) {
          sortableInstance.current.destroy();
          sortableInstance.current = null;
        }
      } catch {
        sortableInstance.current = null;
      }
    };
  }, [loading]);

  const handleFaqChange = (index, field, value) => {
    setFaqs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddFaq = () => {
    if (faqs.length >= 8) {
      setToast({ type: "error", message: "Maximum limit reached. Only up to 8 FAQs are allowed." });
      return;
    }
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleDeleteFaq = (index) => {
    if (window.confirm("Are you sure you want to delete this FAQ question?")) {
      setFaqs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      const res = await api.put("/admin/content/faqs", faqs);
      if (res?.success) {
        setToast({ type: "success", message: "Process FAQs saved successfully!" });
      } else {
        setToast({ type: "error", message: res?.message || "Failed to save FAQs" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save FAQs" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading Process FAQs...</div>;
  }

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage Process FAQs"
        tips={[
          "Up to 8 FAQs can be shown on the Our Process page.",
          "Use the drag handle (⠿) to change the question display order on the website.",
          "Keep answers concise and helpful (up to 280 characters).",
        ]}
      />

      <div className="admin-list-actions-bar">
        <div>
          <h3>Frequently Asked Questions ({faqs.length}/8)</h3>
          <p className="admin-card-subtitle">
            Customer inquiries and answers displayed on the Process page.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleAddFaq}
          disabled={faqs.length >= 8}
        >
          <i className="fa-solid fa-plus" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-faqs-drag-list" ref={listRef}>
          {faqs.map((faq, idx) => (
            <div className="admin-card admin-faq-card-item" key={faq.id || idx}>
              <div className="admin-faq-item-header">
                <div className="admin-faq-item-drag-left">
                  <span className="admin-drag-handle" title="Drag to reorder FAQ">
                    <i className="fa-solid fa-grip-vertical" />
                  </span>
                  <span className="admin-sl-badge">Sl No. {idx + 1}</span>
                </div>
                <button
                  type="button"
                  className="admin-action-btn delete"
                  onClick={() => handleDeleteFaq(idx)}
                  title="Delete this FAQ"
                >
                  <i className="fa-solid fa-trash" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="admin-card-body">
                <div className="admin-form-group">
                  <label>Question <span className="admin-required">*</span></label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                    maxLength={90}
                    placeholder="e.g. What types of construction projects does RCC handle?"
                    required
                  />
                  <CharCounter current={faq.question.length} max={90} />
                </div>

                <div className="admin-form-group">
                  <label>Answer <span className="admin-required">*</span></label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                    maxLength={280}
                    placeholder="Write a clear, reassuring answer for prospective clients..."
                    required
                  />
                  <CharCounter current={faq.answer.length} max={280} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="admin-empty-card">
            <i className="fa-solid fa-circle-question" />
            <h4>No FAQs Created Yet</h4>
            <p>Click 'Add New FAQ' above to create your first question and answer.</p>
          </div>
        )}

        <div className="admin-sticky-actions">
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{saving ? "Saving Changes..." : "Save FAQs Order & Content"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
