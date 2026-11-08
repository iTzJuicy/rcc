import { useState, useEffect, useRef } from "react";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";
import api from "../../services/api";

export default function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ value: "", suffix: "+", label: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableBodyRef = useRef(null);
  const sortableInstance = useRef(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.adminGetStats();
      } catch (err) {
        console.warn("Falling back to public stats API:", err.message);
        res = await api.get("/public/stats");
      }
      if (res?.data) setStats(res.data);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load stats" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statsRef = useRef(stats);
  statsRef.current = stats;
  const totalPages = Math.ceil(stats.length / pageSize) || 1;
  const visibleStats = stats.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          const current = [...statsRef.current];
          if (evt.oldIndex === evt.newIndex) return;
          const offset = (currentPage - 1) * pageSize;
          const [movedItem] = current.splice(offset + evt.oldIndex, 1);
          current.splice(offset + evt.newIndex, 0, movedItem);
          setStats(current);

          try {
            const orderedIds = current.map((s) => s._id);
            await api.adminReorderStats(orderedIds);
            setToast({ type: "success", message: "Stats order updated everywhere!" });
          } catch (err) {
            setToast({ type: "error", message: "Failed to persist order" });
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
    setFormData({ value: "", suffix: "+", label: "" });
    setFormOpen(true);
  };

  const handleOpenEdit = (stat) => {
    setEditingId(stat._id);
    setFormData({
      value: stat.value,
      suffix: stat.suffix || "",
      label: stat.label,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete stat "${label}"?`)) return;
    try {
      await api.adminDeleteStat(id);
      setToast({ type: "success", message: "Stat deleted." });
      setStats((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setToast({ type: "error", message: "Delete failed" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", message: "" });

    try {
      if (editingId) {
        await api.adminUpdateStat(editingId, formData);
        setToast({ type: "success", message: "Stat updated successfully!" });
      } else {
        await api.adminCreateStat({ ...formData, order: stats.length + 1 });
        setToast({ type: "success", message: "Stat created successfully!" });
      }
      setFormOpen(false);
      loadStats();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to save stat." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse
        title="Single Shared Stats Source"
        tips={[
          "All statistics on this page serve as the single shared source for the entire website.",
          "Updating or reordering numbers here automatically synchronizes the Home page and About page.",
          "Drag the handle (⠿) to change display position across all site banners.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {formOpen ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>{editingId ? "Edit Metric Stat" : "Add Metric Stat"}</h3>
              <p className="admin-card-subtitle">Number and label reflected across Home and About pages.</p>
            </div>
            <button type="button" className="admin-btn-outline" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSave}>
              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label htmlFor="statVal">Metric Value / Number <span className="admin-required">*</span></label>
                  <input
                    id="statVal"
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 15, 250, 100"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="statSuffix">Suffix (e.g. +, %)</label>
                  <input
                    id="statSuffix"
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="e.g. +, %"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="statLabel">Metric Label <span className="admin-required">*</span></label>
                <input
                  id="statLabel"
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Years of Experience, Projects Completed"
                  required
                />
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  <i className="fa-solid fa-floppy-disk" />
                  <span>{saving ? "Saving..." : editingId ? "Update Stat" : "Save Stat"}</span>
                </button>
                <button type="button" className="admin-btn-outline" onClick={() => setFormOpen(false)}>
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
              <h3>Impact Statistics ({stats.length})</h3>
              <p className="admin-card-subtitle">
                Unified counters displayed on Home ('Our Impact') and About ('Our Story').
              </p>
            </div>
            <button type="button" className="admin-btn-primary" onClick={handleOpenCreate}>
              <i className="fa-solid fa-plus" />
              <span>Add New Stat</span>
            </button>
          </div>

          <div className="admin-card">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>Order</th>
                    <th style={{ width: "50px" }}>Sl No.</th>
                    <th>Displayed Number</th>
                    <th>Metric Description</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody ref={tableBodyRef}>
                  {visibleStats.map((st, idx) => (
                    <tr key={st._id} className="admin-sortable-row">
                      <td>
                        <span className="admin-drag-handle" title="Drag to reorder">
                          <i className="fa-solid fa-grip-vertical" />
                        </span>
                      </td>
                      <td>
                        <span className="admin-sl-badge">{(currentPage - 1) * pageSize + idx + 1}</span>
                      </td>
                      <td>
                        <strong className="admin-table-title" style={{ fontSize: "16px", color: "var(--red)" }}>
                          {st.value}{st.suffix || ""}
                        </strong>
                      </td>
                      <td>
                        <strong>{st.label}</strong>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-action-btn edit"
                            onClick={() => handleOpenEdit(st)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn delete"
                            onClick={() => handleDelete(st._id, st.label)}
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
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={stats.length} />
          </div>
        </>
      )}
    </div>
  );
}
