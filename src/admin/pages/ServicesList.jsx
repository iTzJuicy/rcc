import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";
import Pagination from "../components/Pagination";

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableBodyRef = useRef(null);
  const sortableInstance = useRef(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.adminGetServices();
      } catch (err) {
        console.warn("Falling back to public services API:", err.message);
        res = await api.get("/public/services");
      }
      if (res?.data) {
        setServices(res.data);
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load services" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const servicesRef = useRef(services);
  servicesRef.current = services;

  // Initialize SortableJS drag-and-drop from CDN
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
          const current = [...servicesRef.current];
          if (evt.oldIndex === evt.newIndex) return;
          const offset = (currentPage - 1) * pageSize;
          const [movedItem] = current.splice(offset + evt.oldIndex, 1);
          current.splice(offset + evt.newIndex, 0, movedItem);
          setServices(current);

          // Auto-save new order to backend
          try {
            const orderedIds = current.map((s) => s._id);
            await api.post("/admin/services/reorder", { orderedIds });
            setToast({ type: "success", message: "Services reorder saved automatically!" });
          } catch (err) {
            setToast({ type: "error", message: "Failed to persist new order" });
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

  const handleToggleHome = async (service) => {
    const newVal = !service.showOnHome;
    try {
      await api.adminUpdateService(service._id, { showOnHome: newVal });
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, showOnHome: newVal } : s))
      );
      setToast({
        type: "success",
        message: newVal
          ? `"${service.title}" will appear on the home page (first 4 displayed).`
          : `"${service.title}" hidden from home page.`,
      });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update home visibility." });
    }
  };

  const handleToggleActive = async (service) => {
    const newVal = !service.isActive;
    try {
      await api.adminUpdateService(service._id, { isActive: newVal });
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, isActive: newVal } : s))
      );
      setToast({
        type: "success",
        message: newVal ? "Service marked Active." : "Service marked Inactive.",
      });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update status." });
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"? This cannot be undone.`)) return;
    try {
      await api.adminDeleteService(id);
      setToast({ type: "success", message: "Service deleted successfully." });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete service." });
    }
  };

  const homeCount = services.filter((s) => s.showOnHome && s.isActive).length;
  const totalPages = Math.ceil(services.length / pageSize) || 1;
  const visibleServices = services.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage Services"
        tips={[
          "Drag the rows using the handle (⠿) to change their display order on the site.",
          "Use the 'Home' switch to show or hide a service on the home page (maximum first 4 appear on home).",
          "Click '+ Add New Service' to open the full service creation form.",
        ]}
      />

      {homeCount > 4 && (
        <div className="admin-alert-banner warning">
          <i className="fa-solid fa-triangle-exclamation" />
          <span>
            You have marked {homeCount} services for the home page. <strong>Only the first 4 appear on the home page</strong> according to display order.
          </span>
        </div>
      )}

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-list-actions-bar">
        <div>
          <h3>All Services ({services.length})</h3>
          <p className="admin-card-subtitle">
            Manage your construction offerings, details, and gallery photos.
          </p>
        </div>
        <Link to="/admin/services/new" className="admin-btn-primary">
          <i className="fa-solid fa-plus" />
          <span>Add New Service</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "60px" }}>Sl No.</th>
                <th>Image</th>
                <th>Service Title</th>
                <th>Home Page</th>
                <th>Active</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {visibleServices.map((svc, idx) => (
                <tr key={svc._id} className="admin-sortable-row">
                  <td>
                    <span className="admin-drag-handle" title="Drag to reorder">
                      <i className="fa-solid fa-grip-vertical" />
                    </span>
                  </td>
                  <td>
                    <span className="admin-sl-badge">{(currentPage - 1) * pageSize + idx + 1}</span>
                  </td>
                  <td>
                    <div className="admin-table-thumb">
                      <img
                        src={svc.image || "/images/card1.webp"}
                        alt={svc.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/card1.webp";
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong className="admin-table-title">{svc.title}</strong>
                    <div className="admin-table-slug">/services/{svc.slug}</div>
                  </td>
                  <td>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={Boolean(svc.showOnHome)}
                        onChange={() => handleToggleHome(svc)}
                      />
                      <span className="admin-slider round"></span>
                    </label>
                  </td>
                  <td>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={Boolean(svc.isActive)}
                        onChange={() => handleToggleActive(svc)}
                      />
                      <span className="admin-slider round"></span>
                    </label>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-action-btn edit"
                        onClick={() => navigate(`/admin/services/edit/${svc._id}`)}
                        title="Edit Service"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(svc._id, svc.title)}
                        title="Delete Service"
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

        {services.length === 0 && !loading && (
          <div className="admin-empty-card">
            <i className="fa-solid fa-helmet-safety" />
            <h4>No Services Added Yet</h4>
            <p>Click 'Add New Service' above to add your first construction service offering.</p>
          </div>
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={services.length} />
    </div>
  );
}
