import { useState, useEffect, useRef } from "react";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";
import Pagination from "../components/Pagination";

const DEFAULT_TESTIMONIAL = {
  name: "",
  location: "Mangaluru",
  role: "Client",
  rating: 5,
  text: "",
  photo: "",
  isApproved: true,
};

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_TESTIMONIAL);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableBodyRef = useRef(null);
  const sortableInstance = useRef(null);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.adminGetTestimonials();
      } catch (err) {
        console.warn("Falling back to public testimonials API:", err.message);
        res = await api.get("/public/testimonials");
      }
      if (res?.data) setItems(res.data);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load testimonials" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // SortableJS Drag & Drop
  useEffect(() => {
    if (!tableBodyRef.current || typeof window.Sortable === "undefined") return;

    try {
      if (sortableInstance.current) {
        sortableInstance.current.destroy();
        sortableInstance.current = null;
      }
    } catch {
      sortableInstance.current = null;
    }

    try {
      sortableInstance.current = new window.Sortable(tableBodyRef.current, {
        handle: ".admin-drag-handle",
        animation: 150,
        ghostClass: "sortable-ghost",
        onEnd: async (evt) => {
          const current = [...itemsRef.current];
          if (evt.oldIndex === evt.newIndex) return;
          const offset = (currentPage - 1) * pageSize;
          const [movedItem] = current.splice(offset + evt.oldIndex, 1);
          current.splice(offset + evt.newIndex, 0, movedItem);
          setItems(current);

          try {
            const orderedIds = current.map((t) => t._id);
            await api.post("/admin/testimonials/reorder", { orderedIds });
            setToast({ type: "success", message: "Testimonial order saved automatically!" });
          } catch (err) {
            setToast({ type: "error", message: "Failed to save order." });
          }
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
  }, [loading, currentPage, pageSize]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(DEFAULT_TESTIMONIAL);
    setFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name || "",
      location: item.location || "Mangaluru",
      role: item.role || "Client",
      rating: item.rating || 5,
      text: item.text || item.quote || "",
      photo: item.photo || "",
      isApproved: item.isApproved ?? true,
    });
    setFormOpen(true);
  };

  const handleToggleApprove = async (item) => {
    const newVal = !item.isApproved;
    try {
      await api.adminUpdateTestimonial(item._id, { isApproved: newVal });
      setItems((prev) =>
        prev.map((t) => (t._id === item._id ? { ...t, isApproved: newVal } : t))
      );
      setToast({
        type: "success",
        message: newVal ? "Testimonial approved and visible on site." : "Testimonial hidden.",
      });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update approval status." });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete testimonial from "${name}"?`)) return;
    try {
      await api.adminDeleteTestimonial(id);
      setToast({ type: "success", message: "Testimonial deleted successfully." });
      setItems((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete testimonial." });
    }
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/admin/media/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, photo: res.data.url }));
        setToast({ type: "success", message: "Client avatar photo uploaded!" });
      }
    } catch (err) {
      setToast({ type: "error", message: "Failed to upload photo" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      if (editingId) {
        await api.adminUpdateTestimonial(editingId, {
          ...formData,
          quote: formData.text,
        });
        setToast({ type: "success", message: "Testimonial updated successfully!" });
      } else {
        await api.adminCreateTestimonial({
          ...formData,
          quote: formData.text,
          order: items.length + 1,
        });
        setToast({ type: "success", message: "Testimonial created successfully!" });
      }
      setFormOpen(false);
      loadTestimonials();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save testimonial." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage Client Testimonials"
        tips={[
          "Drag the handle (⠿) to change display sequence in the home page swipeable slider.",
          "Upload a client photo or avatar. If left blank, a default avatar icon will be displayed automatically.",
          "Use the 'Approved' switch to quickly show or hide reviews without deleting them.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* FORM CARD (ADD / EDIT) */}
      {formOpen ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
              <p className="admin-card-subtitle">
                Client feedback and review card shown on the Home page.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSaveForm}>
              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label htmlFor="clientName">Client Name <span className="admin-required">*</span></label>
                  <input
                    id="clientName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="clientLocation">Location / City</label>
                  <input
                    id="clientLocation"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Mangaluru"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="clientRole">Role / Project Type</label>
                  <input
                    id="clientRole"
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Villa Owner / Commercial Client"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="rating">Rating (Stars)</label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="testimonialText">
                  Testimonial Review Text <span className="admin-required">*</span>
                </label>
                <textarea
                  id="testimonialText"
                  rows={4}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="What did the client say about RCC Infrastructure's service and delivery?"
                  required
                />
              </div>

              {/* PHOTO UPLOADER */}
              <div className="admin-form-group">
                <label>Client Photo / Avatar (optional)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px" }}>
                  <div className="admin-table-avatar-preview">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Avatar" />
                    ) : (
                      <i className="fa-solid fa-user" />
                    )}
                  </div>
                  <label className="admin-file-upload-btn">
                    <i className="fa-solid fa-camera" />
                    <span>{uploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: "none" }}
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                      disabled={uploadingPhoto}
                    />
                  </label>
                  {formData.photo && (
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      onClick={() => setFormData({ ...formData, photo: "" })}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-form-row-toggles" style={{ marginTop: "16px" }}>
                <label className="admin-toggle-label">
                  <input
                    type="checkbox"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  />
                  <span>Approved for display on website</span>
                </label>
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={saving}
                >
                  <i className="fa-solid fa-floppy-disk" />
                  <span>{saving ? "Saving..." : editingId ? "Update Testimonial" : "Save Testimonial"}</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-list-actions-bar">
            <div>
              <h3>Client Reviews ({items.length})</h3>
              <p className="admin-card-subtitle">
                Testimonials carousel displayed on the home page.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleOpenCreate}
            >
              <i className="fa-solid fa-plus" />
              <span>Add New Testimonial</span>
            </button>
          </div>

          <div className="admin-card">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>Order</th>
                    <th style={{ width: "50px" }}>Sl No.</th>
                    <th>Photo</th>
                    <th>Client Name</th>
                    <th>Rating</th>
                    <th>Quote Preview</th>
                    <th>Approved</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableBodyRef}>
                  {visibleItems.map((item, idx) => (
                    <tr key={item._id} className="admin-sortable-row">
                      <td>
                        <span className="admin-drag-handle" title="Drag to reorder">
                          <i className="fa-solid fa-grip-vertical" />
                        </span>
                      </td>
                      <td>
                        <span className="admin-sl-badge">{idx + 1}</span>
                      </td>
                      <td>
                        <div className="admin-table-avatar-preview">
                          {item.photo ? (
                            <img
                              src={item.photo}
                              alt={item.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <i className="fa-solid fa-user" />
                          )}
                        </div>
                      </td>
                      <td>
                        <strong className="admin-table-title">{item.name}</strong>
                        <div className="admin-table-location">
                          {item.role || "Client"} • {item.location || "Mangaluru"}
                        </div>
                      </td>
                      <td>
                        <div style={{ color: "#d97706", fontSize: "14px" }}>
                          {"★".repeat(item.rating || 5)}
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-excerpt" style={{ maxWidth: "340px" }}>
                          "{item.text || item.quote}"
                        </div>
                      </td>
                      <td>
                        <label className="admin-switch">
                          <input
                            type="checkbox"
                            checked={Boolean(item.isApproved)}
                            onChange={() => handleToggleApprove(item)}
                          />
                          <span className="admin-slider round"></span>
                        </label>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-action-btn edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            onClick={() => handleDelete(item._id, item.name)}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={items.length} />
            </div>

            {items.length === 0 && !loading && (
              <div className="admin-empty-card">
                <i className="fa-solid fa-comment-dots" />
                <h4>No Testimonials Yet</h4>
                <p>Click 'Add New Testimonial' above to create client reviews for your home page.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
