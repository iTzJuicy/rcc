import { useState, useEffect } from "react";
import api from "../../services/api";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.adminGetEnquiries({ status: statusFilter, search });
      if (res?.data) {
        setEnquiries(res.data);
      }
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to load enquiries" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadEnquiries();
  }, [statusFilter, search]);

  const totalPages = Math.ceil(enquiries.length / pageSize) || 1;
  const visibleEnquiries = enquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusChange = async (id, status, notes = undefined) => {
    try {
      await api.adminUpdateEnquiryStatus(id, status, notes);
      setAlert({ type: "success", text: "Enquiry status updated." });
      loadEnquiries();
      if (activeModalItem && activeModalItem._id === id) {
        setActiveModalItem((prev) => ({ ...prev, status, ...(notes !== undefined && { notes }) }));
      }
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Update failed" });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;
    try {
      await api.adminDeleteEnquiry(id);
      setAlert({ type: "success", text: "Enquiry deleted." });
      if (activeModalItem?._id === id) setActiveModalItem(null);
      loadEnquiries();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Delete failed" });
    }
  };

  const handleOpenDetail = (item) => {
    setActiveModalItem(item);
    setAdminNotes(item.notes || "");
  };

  const handleSaveNotes = async () => {
    if (!activeModalItem) return;
    await handleStatusChange(activeModalItem._id, activeModalItem.status, adminNotes);
  };

  return (
    <div className="admin-page-container">
      <HowToUse title="How to manage Enquiries" tips={["Use status filters to focus on new or active leads.", "Open a row to review details and save internal notes.", "Export enquiries for reporting, and avoid sharing confidential client data."]} />
      {alert.text && (
        <div className={`admin-toast-banner ${alert.type}`} style={{ marginBottom: "20px" }}>
          <i className={`fa-solid ${alert.type === "error" ? "fa-triangle-exclamation" : "fa-circle-check"}`} />
          <span>{alert.text}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Client Enquiries &amp; Quotation Requests ({enquiries.length})</h3>
            <p>Confidential lead database — accessible exclusively to authorized administrators</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => api.adminExportEnquiries("csv")}
            >
              <Icon name="download" size={15} /> Export CSV
            </button>
            <button
              type="button"
              className="admin-action-btn"
              style={{ borderColor: "#16a34a", color: "#16a34a" }}
              onClick={() => api.adminExportEnquiries("xlsx")}
            >
              <Icon name="download" size={15} /> Export Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-filter-row">
          <div className="admin-search-input-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="search"
              placeholder="Search by name, email, phone, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div className="admin-filter-tabs">
            {["All", "New", "Contacted", "In_Progress", "Closed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`admin-filter-tab ${statusFilter === st ? "active" : ""}`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Name</th>
                <th>Contact</th>
                <th>Subject / Project</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length > 0 ? (
                visibleEnquiries.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontSize: "12px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <div><a href={`mailto:${item.email}`} style={{ color: "var(--admin-primary)" }}>{item.email}</a></div>
                      {item.phone && <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>{item.phone}</div>}
                    </td>
                    <td>
                      {item.projectTitle ? (
                        <div>
                          <span style={{ color: "var(--admin-primary)", fontWeight: 600 }}>Quote:</span> {item.projectTitle}
                        </div>
                      ) : (
                        item.subject || "General Enquiry"
                      )}
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="admin-select-inline"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => handleOpenDetail(item)}
                        >
                          <i className="fa-solid fa-eye" /> View
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(item._id, item.name)}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--admin-text-muted)", padding: "32px" }}>
                    No enquiries found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={enquiries.length} />
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {activeModalItem && (
        <div className="admin-modal-backdrop" onClick={() => setActiveModalItem(null)}>
          <div className="admin-modal-card" style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <div className="admin-modal-label">Enquiry Record</div>
                <h3 className="admin-modal-title">{activeModalItem.name}</h3>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setActiveModalItem(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-info-grid">
                <div><strong>Email:</strong> <a href={`mailto:${activeModalItem.email}`} style={{ color: "var(--admin-primary)" }}>{activeModalItem.email}</a></div>
                <div><strong>Phone:</strong> {activeModalItem.phone || "Not provided"}</div>
                <div><strong>Date:</strong> {new Date(activeModalItem.createdAt).toLocaleString()}</div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`admin-badge admin-badge-${activeModalItem.status}`}>
                    {activeModalItem.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {activeModalItem.projectTitle && (
                <div className="admin-modal-highlight">
                  <strong>Quotation Request Project:</strong> {activeModalItem.projectTitle}
                </div>
              )}

              <div>
                <strong style={{ display: "block", marginBottom: "6px" }}>Message / Scope:</strong>
                <div className="admin-modal-message">
                  {activeModalItem.message}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Internal Follow-up Notes (Admin Only)</label>
                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record customer discussion notes, quotes sent, follow-up dates..."
                />
                <button
                  type="button"
                  className="admin-btn-outline"
                  style={{ marginTop: "8px" }}
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>

              <div className="admin-modal-actions">
                <a
                  href={`mailto:${activeModalItem.email}?subject=RE: ${encodeURIComponent(activeModalItem.subject || "RCC Infrastructure Enquiry")}`}
                  className="admin-btn-primary"
                >
                  <i className="fa-solid fa-envelope" /> Reply via Email
                </a>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setActiveModalItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
