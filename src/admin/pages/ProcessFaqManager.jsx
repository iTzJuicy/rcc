import { useState, useEffect } from "react";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";
import { CONTENT_FALLBACKS, updateCachedSiteContent } from "../../hooks/useSiteContent";

function normalizeProcess(value) {
  const defaults = CONTENT_FALLBACKS.process;
  return {
    ...defaults,
    ...(value || {}),
    hero: { ...defaults.hero, ...value?.hero },
    overview: { ...defaults.overview, ...value?.overview },
    support: { ...defaults.support, ...value?.support },
    promise: { ...defaults.promise, ...value?.promise },
    faq: { ...defaults.faq, ...value?.faq },
  };
}

function lineValue(items) {
  return (items || []).join("\n");
}

function parseLines(value) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function swapItems(items, index, direction) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function ProcessFaqManager() {
  const [form, setForm] = useState(CONTENT_FALLBACKS.process);
  const [faqs, setFaqs] = useState(CONTENT_FALLBACKS.faqs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingStep, setUploadingStep] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const [processRes, faqRes] = await Promise.all([
          api.get("/public/content/process"),
          api.get("/public/content/faqs"),
        ]);
        if (processRes?.data) setForm(normalizeProcess(processRes.data));
        if (Array.isArray(faqRes?.data)) setFaqs(faqRes.data);
      } catch (err) {
        setToast({ type: "error", message: err.message || "Failed to load Process page content." });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [section === "steps" ? section : "items"]: prev[section][section === "steps" ? section : "items"]
          .map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
      },
    }));
  };

  const updateNestedItem = (section, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
      },
    }));
  };

  const updateStepImage = async (index, file) => {
    if (!file) return;
    setUploadingStep(index);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/admin/media/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res?.data?.url) throw new Error("Image upload did not return an image URL.");
      updateArrayItem("steps", index, "image", res.data.url);
      setToast({ type: "success", message: "Process step image uploaded." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to upload process image." });
    } finally {
      setUploadingStep(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });
    try {
      const processRes = await api.put("/admin/content/process", form);
      if (!processRes?.success) throw new Error(processRes?.message || "Failed to save Process page content.");
      const faqRes = await api.put("/admin/content/faqs", faqs);
      if (!faqRes?.success) throw new Error(faqRes?.message || "Process content saved, but FAQs failed to save.");
      updateCachedSiteContent("process", form);
      updateCachedSiteContent("faqs", faqs);
      setToast({ type: "success", message: "Process page and FAQs saved successfully." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save Process page content." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading-state">Loading Process page content...</div>;

  const renderSimpleItems = (section, title, defaults) => (
    <>
      <div className="admin-list-actions-bar">
        <div><h3>{title} ({form[section].items.length})</h3></div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setForm((prev) => ({ ...prev, [section]: { ...prev[section], items: [...prev[section].items, { id: `${section}-${Date.now()}`, ...defaults }] } }))}
          disabled={form[section].items.length >= 12}
        >
          <i className="fa-solid fa-plus" /><span>Add Item</span>
        </button>
      </div>
      <div className="admin-grid-2-col">
        {form[section].items.map((item, index) => (
          <div className="admin-card" key={item.id || index}>
            <div className="admin-card-header">
              <h3>{title} {String(index + 1).padStart(2, "0")}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="admin-action-btn" disabled={index === 0} onClick={() => setForm((prev) => ({ ...prev, [section]: { ...prev[section], items: swapItems(prev[section].items, index, -1) } }))} aria-label="Move item up"><i className="fa-solid fa-arrow-up" /></button>
                <button type="button" className="admin-action-btn" disabled={index === form[section].items.length - 1} onClick={() => setForm((prev) => ({ ...prev, [section]: { ...prev[section], items: swapItems(prev[section].items, index, 1) } }))} aria-label="Move item down"><i className="fa-solid fa-arrow-down" /></button>
                <button type="button" className="admin-action-btn delete" onClick={() => setForm((prev) => ({ ...prev, [section]: { ...prev[section], items: prev[section].items.filter((_, itemIndex) => itemIndex !== index) } }))}><i className="fa-solid fa-trash" /><span>Remove</span></button>
              </div>
            </div>
            <div className="admin-card-body">
              {Object.entries(item).filter(([field]) => field !== "id" && field !== "points").map(([field, value]) => (
                <div className="admin-form-group" key={field}>
                  <label>{field === "icon" ? "Font Awesome icon class" : field.replace(/([A-Z])/g, " $1")}</label>
                  {field === "description" ? (
                    <textarea rows={3} value={value} onChange={(e) => updateNestedItem(section, index, field, e.target.value)} required />
                  ) : (
                    <input value={value} onChange={(e) => updateNestedItem(section, index, field, e.target.value)} required />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="admin-page-container">
      <HowToUse
        title="Manage the Our Process page"
        tips={[
          "Edit every page heading, process step, supporting card, promise and FAQ.",
          "Add, remove and reorder items. Process step numbers are generated automatically.",
          "Enter one item per line in checklist fields.",
        ]}
      />
      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`} role="status">
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          ["hero", "Page Banner Text", ["eyebrow", "title", "description"]],
          ["overview", "Process Overview", ["eyebrow", "title", "description"]],
          ["support", "Support Section Heading", ["eyebrow", "title"]],
          ["promise", "Promise Section Heading", ["eyebrow", "title"]],
          ["faq", "FAQ Section Heading", ["eyebrow", "title", "description", "buttonText"]],
        ].map(([section, title, fields]) => (
          <div className="admin-card" key={section}>
            <div className="admin-card-header"><h3>{title}</h3></div>
            <div className="admin-card-body admin-grid-2-col">
              {fields.map((field) => (
                <div className="admin-form-group" key={field}>
                  <label>{field === "eyebrow" ? "Eyebrow" : field === "title" ? "Heading" : field === "buttonText" ? "Button label" : "Description"}</label>
                  {field === "description" ? (
                    <textarea rows={3} value={form[section][field]} onChange={(e) => updateSection(section, field, e.target.value)} required />
                  ) : (
                    <input value={form[section][field]} onChange={(e) => updateSection(section, field, e.target.value)} required />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="admin-list-actions-bar">
          <div><h3>Process Steps ({form.steps.length})</h3><p className="admin-card-subtitle">These are displayed in order on the public Process page.</p></div>
          <button type="button" className="admin-btn-primary" onClick={() => setForm((prev) => ({ ...prev, steps: [...prev.steps, { id: `step-${Date.now()}`, title: "", summary: "", description: "", provide: [], receive: [], timeframe: "", image: "" }] }))} disabled={form.steps.length >= 12}>
            <i className="fa-solid fa-plus" /><span>Add Step</span>
          </button>
        </div>
        {form.steps.map((step, index) => (
          <div className="admin-card" key={step.id || index}>
            <div className="admin-card-header">
              <h3>Step {String(index + 1).padStart(2, "0")}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="admin-action-btn" disabled={index === 0} onClick={() => setForm((prev) => ({ ...prev, steps: swapItems(prev.steps, index, -1) }))} aria-label="Move step up"><i className="fa-solid fa-arrow-up" /></button>
                <button type="button" className="admin-action-btn" disabled={index === form.steps.length - 1} onClick={() => setForm((prev) => ({ ...prev, steps: swapItems(prev.steps, index, 1) }))} aria-label="Move step down"><i className="fa-solid fa-arrow-down" /></button>
                <button type="button" className="admin-action-btn delete" onClick={() => setForm((prev) => ({ ...prev, steps: prev.steps.filter((_, stepIndex) => stepIndex !== index) }))}><i className="fa-solid fa-trash" /><span>Remove</span></button>
              </div>
            </div>
            <div className="admin-card-body admin-grid-2-col">
              {["title", "summary", "description", "timeframe"].map((field) => (
                <div className="admin-form-group" key={field}>
                  <label>{field.replace(/([A-Z])/g, " $1")}</label>
                  {field === "description" ? (
                    <textarea rows={4} value={step[field]} onChange={(e) => updateArrayItem("steps", index, field, e.target.value)} required />
                  ) : (
                    <input value={step[field]} onChange={(e) => updateArrayItem("steps", index, field, e.target.value)} required />
                  )}
                </div>
              ))}
              {["provide", "receive"].map((field) => (
                <div className="admin-form-group" key={field}>
                  <label>{field === "provide" ? "What we need from the client (one per line)" : "What the client receives (one per line)"}</label>
                  <textarea rows={4} value={lineValue(step[field])} onChange={(e) => updateArrayItem("steps", index, field, parseLines(e.target.value))} />
                </div>
              ))}
              <div className="admin-form-group">
                <label>Step image URL</label>
                <input value={step.image} onChange={(e) => updateArrayItem("steps", index, "image", e.target.value)} />
                <label className="admin-file-upload-btn" style={{ marginTop: "10px" }}>
                  <i className="fa-solid fa-cloud-arrow-up" />
                  <span>{uploadingStep === index ? "Uploading..." : "Upload Image"}</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => updateStepImage(index, e.target.files?.[0])} disabled={uploadingStep === index} />
                </label>
                {step.image && <img src={step.image} alt="" style={{ display: "block", width: "100%", maxHeight: "180px", objectFit: "cover", marginTop: "12px", borderRadius: "8px" }} />}
              </div>
            </div>
          </div>
        ))}

        {renderSimpleItems("support", "Support Cards", { title: "", description: "", points: [] })}
        {form.support.items.map((item, index) => (
          <div className="admin-card" key={`support-points-${item.id || index}`}>
            <div className="admin-card-header"><h3>{item.title || `Support Card ${index + 1}`} Checklist</h3></div>
            <div className="admin-card-body">
              <div className="admin-form-group">
                <label>Points (one per line)</label>
                <textarea rows={4} value={lineValue(item.points)} onChange={(e) => updateNestedItem("support", index, "points", parseLines(e.target.value))} />
              </div>
            </div>
          </div>
        ))}

        {renderSimpleItems("promise", "Promise Items", { icon: "fa-check", title: "", description: "" })}

        <div className="admin-list-actions-bar">
          <div><h3>Process FAQs ({faqs.length}/8)</h3></div>
          <button type="button" className="admin-btn-primary" onClick={() => setFaqs((prev) => [...prev, { id: `faq-${Date.now()}`, question: "", answer: "" }])} disabled={faqs.length >= 8}>
            <i className="fa-solid fa-plus" /><span>Add FAQ</span>
          </button>
        </div>
        {faqs.map((faq, index) => (
          <div className="admin-card" key={faq.id || index}>
            <div className="admin-card-header">
              <h3>FAQ {index + 1}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="admin-action-btn" disabled={index === 0} onClick={() => setFaqs((prev) => swapItems(prev, index, -1))} aria-label="Move FAQ up"><i className="fa-solid fa-arrow-up" /></button>
                <button type="button" className="admin-action-btn" disabled={index === faqs.length - 1} onClick={() => setFaqs((prev) => swapItems(prev, index, 1))} aria-label="Move FAQ down"><i className="fa-solid fa-arrow-down" /></button>
                <button type="button" className="admin-action-btn delete" onClick={() => setFaqs((prev) => prev.filter((_, faqIndex) => faqIndex !== index))}><i className="fa-solid fa-trash" /><span>Remove</span></button>
              </div>
            </div>
            <div className="admin-card-body admin-grid-2-col">
              <div className="admin-form-group">
                <label>Question</label>
                <input value={faq.question} maxLength={90} onChange={(e) => setFaqs((prev) => prev.map((item, faqIndex) => faqIndex === index ? { ...item, question: e.target.value } : item))} required />
              </div>
              <div className="admin-form-group">
                <label>Answer</label>
                <textarea rows={3} value={faq.answer} maxLength={280} onChange={(e) => setFaqs((prev) => prev.map((item, faqIndex) => faqIndex === index ? { ...item, answer: e.target.value } : item))} required />
              </div>
            </div>
          </div>
        ))}

        <div className="admin-sticky-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving || uploadingStep !== null}>
            <i className="fa-solid fa-floppy-disk" /><span>{saving ? "Saving Changes..." : "Save Process Page"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
