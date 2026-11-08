import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ type: "", message: "" });
  const tableBodyRef = useRef(null);
  const sortableInstance = useRef(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.adminGetProjects();
      } catch (err) {
        console.warn("Falling back to public projects API:", err.message);
        res = await api.get("/public/projects?limit=100");
      }
      if (res?.data) {
        setProjects(res.data);
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  // SortableJS drag-and-drop
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
          const current = [...projectsRef.current];
          if (evt.oldIndex === evt.newIndex) return;
          const [movedItem] = current.splice(evt.oldIndex, 1);
          current.splice(evt.newIndex, 0, movedItem);
          setProjects(current);

          try {
            const orderedIds = current.map((p) => p._id);
            await api.post("/admin/projects/reorder", { orderedIds });
            setToast({ type: "success", message: "Project order saved automatically!" });
          } catch (err) {
            setToast({ type: "error", message: "Failed to persist project order." });
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
  }, [loading]);

  const handleToggleFeatured = async (project) => {
    const newVal = !project.isFeatured;
    try {
      await api.adminUpdateProject(project._id, { isFeatured: newVal });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, isFeatured: newVal } : p))
      );
      setToast({
        type: "success",
        message: newVal
          ? `"${project.title}" marked as Featured on Home Page.`
          : `"${project.title}" unfeatured.`,
      });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update featured flag." });
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"? This cannot be undone.`)) return;
    try {
      await api.adminDeleteProject(id);
      setToast({ type: "success", message: "Project deleted successfully." });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete project." });
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = categoryFilter === "All" || p.category?.toLowerCase() === categoryFilter.toLowerCase();
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [projects, categoryFilter, searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);

  return (
    <div className="admin-page-container">
      <HowToUse
        title="How to manage Projects"
        tips={[
          "Drag the handle (⠿) to change project display order on the public website.",
          "Use the 'Featured' toggle to highlight special showcase builds on the home page.",
          "Filter by category, search by keywords, and navigate through pages using pagination controls.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-list-actions-bar">
        <div>
          <h3>All Projects ({projects.length})</h3>
          <p className="admin-card-subtitle">
            Portfolio of completed, ongoing, and planned construction developments.
          </p>
        </div>
        <Link to="/admin/projects/new" className="admin-btn-primary">
          <i className="fa-solid fa-plus" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="admin-card admin-filters-card">
        <div className="admin-filter-row">
          <div className="admin-search-input-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search projects by title, location, category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div className="admin-filter-group">
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-filter-group">
            <label>Per Page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROJECTS TABLE */}
      <div className="admin-card">
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Order</th>
                <th style={{ width: "50px" }}>Sl No.</th>
                <th>Image</th>
                <th>Project Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {paginatedProjects.map((proj, idx) => (
                <tr key={proj._id} className="admin-sortable-row">
                  <td>
                    <span className="admin-drag-handle" title="Drag to reorder">
                      <i className="fa-solid fa-grip-vertical" />
                    </span>
                  </td>
                  <td>
                    <span className="admin-sl-badge">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-thumb">
                      <img
                        src={proj.image || proj.coverImage || "/images/card1.webp"}
                        alt={proj.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/card1.webp";
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <strong className="admin-table-title">{proj.title}</strong>
                    <div className="admin-table-location">
                      <i className="fa-solid fa-location-dot" style={{ marginRight: "4px" }} />
                      {proj.location || "Mangaluru, Karnataka"}
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge-category">{proj.category}</span>
                  </td>
                  <td>
                    <span className={`admin-badge-status ${proj.status?.toLowerCase()}`}>
                      {proj.status || "Completed"}
                    </span>
                  </td>
                  <td>
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={Boolean(proj.isFeatured)}
                        onChange={() => handleToggleFeatured(proj)}
                      />
                      <span className="admin-slider round"></span>
                    </label>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-action-btn edit"
                        onClick={() => navigate(`/admin/projects/edit/${proj._id}`)}
                        title="Edit Project"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(proj._id, proj.title)}
                        title="Delete Project"
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

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="admin-pagination-bar">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredProjects.length)} of{" "}
              {filteredProjects.length} projects
            </span>
            <div className="admin-pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="admin-empty-card">
            <i className="fa-solid fa-building" />
            <h4>No Projects Found</h4>
            <p>Try adjusting your search criteria or click 'Add New Project' to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
