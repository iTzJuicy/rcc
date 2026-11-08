import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";
import Pagination from "../components/Pagination";

const DEFAULT_PERMISSIONS = {
  services: true,
  projects: true,
  categories: true,
  testimonials: true,
  stats: true,
  enquiries: true,
  media: true,
  settings: false,
  users: false,
};

const PERMISSION_LABELS = [
  { key: "services", label: "Services Management", desc: "Add, edit, reorder construction & development services" },
  { key: "projects", label: "Projects Portfolio", desc: "Manage project listings, cover photos, and galleries" },
  { key: "categories", label: "Categories Tags", desc: "Create and edit project/service categories" },
  { key: "testimonials", label: "Client Testimonials", desc: "Approve, edit and hide client reviews" },
  { key: "stats", label: "Impact Statistics", desc: "Edit homepage counters and numbers" },
  { key: "enquiries", label: "Client Enquiries & Leads", desc: "View confidential contact & quote submissions" },
  { key: "media", label: "Media Library", desc: "Upload and compress images to Cloudinary" },
  { key: "settings", label: "Site Configuration", desc: "Edit phone, email, map, social links, and hero copy" },
  { key: "users", label: "User Access Control", desc: "Create users and assign access permissions" },
];

export default function UsersManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    permissions: DEFAULT_PERMISSIONS,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.adminGetUsers();
      if (res?.data) {
        setUsers(res.data);
      }
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to load team users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const visibleUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      permissions: { ...DEFAULT_PERMISSIONS },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingId(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank to keep existing
      role: user.role || "admin",
      permissions: { ...DEFAULT_PERMISSIONS, ...(user.permissions || {}) },
    });
    setModalOpen(true);
  };

  const handleTogglePermission = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleDelete = async (id, name) => {
    if (String(currentUser?._id || currentUser?.id) === String(id)) {
      alert("You cannot delete your own logged-in account.");
      return;
    }

    if (!window.confirm(`Permanently revoke access and remove user "${name}"?`)) return;

    try {
      await api.adminDeleteUser(id);
      setAlert({ type: "success", text: "User account deleted." });
      loadUsers();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to delete user." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ type: "", text: "" });

    if (!editingId && (!formData.password || formData.password.length < 8)) {
      setAlert({ type: "error", text: "Password must be at least 8 characters long." });
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await api.adminUpdateUser(editingId, formData);
        setAlert({ type: "success", text: "User permissions updated successfully." });
      } else {
        await api.adminCreateUser(formData);
        setAlert({ type: "success", text: "New user account created successfully." });
      }
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to save user." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse title="How to manage Team & Permissions" tips={["Create editors with only the permissions they need.", "Use Edit to update access; leave the password blank to keep it unchanged.", "Never delete your own active account."]} />
      {alert.text && (
        <div
          className={`admin-toast-banner ${alert.type === "error" ? "error" : ""}`}
          style={{
            background: alert.type === "error" ? "#fde8e8" : "#def7ec",
            color: alert.type === "error" ? "#9b1c1c" : "#03543f",
            marginBottom: "20px",
          }}
        >
          {alert.text}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>User & Team Management ({users.length})</h3>
            <p>Control who has access to the admin panel and customize individual section permissions</p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            style={{ width: "auto" }}
            onClick={handleOpenCreate}
          >
            <Icon name="plus" size={16} /> Create User Account
          </button>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Allowed Permissions</th>
                <th>Last Login</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u) => {
                const perms = u.permissions || {};
                const activePermsCount = Object.values(perms).filter(Boolean).length;
                const isSuper = u.role === "superadmin";

                return (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>{u.email}</div>
                    </td>
                    <td>
                      <span
                        className="admin-badge"
                        style={{
                          background: isSuper ? "#fef3c7" : "#e0e7ff",
                          color: isSuper ? "#92400e" : "#3730a3",
                          fontWeight: 700,
                        }}
                      >
                        {isSuper ? "Super Admin" : u.role}
                      </span>
                    </td>
                    <td>
                      {isSuper ? (
                        <span style={{ fontSize: "12px", color: "var(--admin-success)", fontWeight: 600 }}>
                          Full Access (All Sections)
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "340px" }}>
                          {Object.entries(perms)
                            .filter(([, v]) => v)
                            .map(([k]) => (
                              <span
                                key={k}
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  background: "#f3f4f6",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "4px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {k}
                              </span>
                            ))}
                          {activePermsCount === 0 && (
                            <span style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>No sections allowed</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => handleOpenEdit(u)}
                      >
                        <Icon name="edit" size={14} /> Permissions
                      </button>
                      {String(currentUser?._id || currentUser?.id) !== String(u._id) && (
                        <button
                          type="button"
                          className="admin-action-btn delete"
                          onClick={() => handleDelete(u._id, u.name)}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={users.length} />
      </div>

      {/* User Create / Edit Permissions Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: "620px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-label">Team Access Control</span>
                <h3>{editingId ? `Edit Access: ${formData.name}` : "Create New Admin User"}</h3>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@rccinfrastructure.com"
                  />
                </div>
              </div>

              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="admin">Admin / Staff</option>
                    <option value="editor">Editor</option>
                    {currentUser?.role === "superadmin" && (
                      <option value="superadmin">Super Admin (All Access)</option>
                    )}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>{editingId ? "Reset Password (leave blank to keep)" : "Password *"}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>

              {/* Permissions Toggle Grid */}
              <div style={{ marginTop: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--admin-text-main)", marginBottom: "4px" }}>
                  Section Access Permissions
                </strong>
                <p style={{ fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "16px" }}>
                  Toggle the switches below to grant or restrict access to specific parts of the admin panel.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {PERMISSION_LABELS.map((item) => {
                    const isChecked = Boolean(formData.permissions[item.key]);

                    return (
                      <div
                        key={item.key}
                        onClick={() => handleTogglePermission(item.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: isChecked ? "rgba(229, 36, 43, 0.3)" : "#e5e7eb",
                          background: isChecked ? "#fffafa" : "#f9fafb",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--admin-text-main)" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>
                            {item.desc}
                          </div>
                        </div>

                        {/* Toggle switch visual */}
                        <div
                          style={{
                            width: "44px",
                            height: "24px",
                            background: isChecked ? "var(--admin-primary)" : "#d1d5db",
                            borderRadius: "99px",
                            position: "relative",
                            transition: "background 0.2s",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              background: "#ffffff",
                              borderRadius: "50%",
                              position: "absolute",
                              top: "3px",
                              left: isChecked ? "23px" : "3px",
                              transition: "left 0.2s",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-modal-actions" style={{ marginTop: "20px" }}>
                <button type="button" className="admin-btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" style={{ width: "auto" }} disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Save Permissions" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
