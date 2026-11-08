import { useState, useEffect } from "react";
import api from "../../services/api";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "", type: "project", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadCategories = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.adminGetCategories();
      } catch (err) {
        console.warn("Falling back to public categories:", err.message);
        res = await api.get("/public/categories");
      }
      if (res?.data) setCategories(res.data);
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to load categories" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / pageSize) || 1;
  const visibleCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", type: "project", description: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      type: cat.type || "project",
      description: cat.description || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.adminDeleteCategory(id);
      setAlert({ type: "success", text: "Category deleted." });
      loadCategories();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to delete" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ type: "", text: "" });

    try {
      if (editingId) {
        await api.adminUpdateCategory(editingId, formData);
        setAlert({ type: "success", text: "Category updated." });
      } else {
        await api.adminCreateCategory(formData);
        setAlert({ type: "success", text: "Category created." });
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Save failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse title="How to manage Categories" tips={["Use categories to keep projects and services organized.", "Edit a category to update its name, slug, type, or description.", "Delete categories only after confirming they are no longer in use."]} />
      {alert.text && (
        <div className={`admin-toast-banner ${alert.type}`} style={{ marginBottom: "20px" }}>
          <i className={`fa-solid ${alert.type === "error" ? "fa-triangle-exclamation" : "fa-circle-check"}`} />
          <span>{alert.text}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Categories ({categories.length})</h3>
            <p>Manage project and service categorization tags</p>
          </div>
          <button type="button" className="admin-btn-primary" onClick={handleOpenCreate}>
            <i className="fa-solid fa-plus" /> Add Category
          </button>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Type</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((cat) => (
                <tr key={cat._id}>
                  <td><strong>{cat.name}</strong></td>
                  <td><span className="admin-table-slug">{cat.slug}</span></td>
                  <td>
                    <span className="admin-badge-category">
                      {cat.type}
                    </span>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: "13px" }}>{cat.description || "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="admin-table-actions">
                      <button type="button" className="admin-action-btn" onClick={() => handleOpenEdit(cat)}>
                        <i className="fa-solid fa-pen-to-square" /> Edit
                      </button>
                      <button type="button" className="admin-action-btn delete" onClick={() => handleDelete(cat._id, cat.name)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={categories.length} />
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">{editingId ? "Edit Category" : "New Category"}</h3>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="admin-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      ...(!editingId && { slug: autoSlug }),
                    }));
                  }}
                  placeholder="e.g. Infrastructure"
                />
              </div>

              <div className="admin-form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="project">Project Category</option>
                  <option value="service">Service Category</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
