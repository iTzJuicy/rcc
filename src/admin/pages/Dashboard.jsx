import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import HowToUse from "../components/HowToUse";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.adminGetDashboard();
      if (res?.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await api.adminUpdateEnquiryStatus(enquiryId, newStatus);
      loadDashboard();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading && !data) {
    return <div className="admin-card"><div className="admin-card-body">Loading dashboard overview...</div></div>;
  }

  const stats = data?.stats || {
    totalProjects: 0,
    totalServices: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  };
  const recentEnquiries = data?.recentEnquiries || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div>
      <HowToUse
        title="How to use the Admin Dashboard"
        tips={[
          "Use the summary cards to monitor projects, services, and new enquiries.",
          "Quick actions open the most common content management pages.",
          "Update enquiry status directly from the Recent Enquiries table.",
        ]}
      />
      {error && <div className="admin-toast-banner error"><i className="fa-solid fa-triangle-exclamation" /><span>{error}</span></div>}

      {/* KPI Cards */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Total Projects</div>
            <div className="admin-stat-number">{stats.totalProjects}</div>
          </div>
          <div className="admin-stat-icon-wrap admin-stat-icon-blue">
            <i className="fa-solid fa-building" style={{ fontSize: "20px" }} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Total Services</div>
            <div className="admin-stat-number">{stats.totalServices}</div>
          </div>
          <div className="admin-stat-icon-wrap admin-stat-icon-indigo">
            <i className="fa-solid fa-helmet-safety" style={{ fontSize: "20px" }} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">New Enquiries</div>
            <div className="admin-stat-number" style={{ color: "var(--admin-primary)" }}>
              {stats.newEnquiries}
            </div>
          </div>
          <div className="admin-stat-icon-wrap admin-stat-icon-amber">
            <i className="fa-solid fa-envelope" style={{ fontSize: "20px" }} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Total Enquiries</div>
            <div className="admin-stat-number">{stats.totalEnquiries}</div>
          </div>
          <div className="admin-stat-icon-wrap admin-stat-icon-green">
            <i className="fa-solid fa-circle-check" style={{ fontSize: "20px" }} />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="admin-quick-actions">
        <Link to="/admin/projects" className="admin-action-btn">
          <i className="fa-solid fa-building" /> Manage Projects
        </Link>
        <Link to="/admin/services" className="admin-action-btn">
          <i className="fa-solid fa-helmet-safety" /> Manage Services
        </Link>
        <Link to="/admin/enquiries" className="admin-action-btn">
          <i className="fa-solid fa-envelope" /> View Enquiries
          {stats.newEnquiries > 0 && (
            <span className="admin-nav-badge" style={{ marginLeft: "4px" }}>{stats.newEnquiries}</span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => api.adminExportEnquiries()}
          className="admin-action-btn"
        >
          <i className="fa-solid fa-download" /> Export CSV
        </button>
      </div>

      <div className="admin-dashboard-grid">
        {/* Recent Enquiries Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Recent Enquiries</h3>
              <p>Latest contact inquiries and project quotation requests</p>
            </div>
            <Link to="/admin/enquiries" className="admin-topbar-link">
              View all
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Regarding</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>
                        <strong>{enq.name}</strong>
                        <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                          {enq.email}
                        </div>
                      </td>
                      <td>
                        {enq.projectTitle ? (
                          <span style={{ color: "var(--admin-primary)", fontWeight: 500 }}>
                            Quote: {enq.projectTitle}
                          </span>
                        ) : (
                          enq.subject || "General Enquiry"
                        )}
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                        {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : ""}
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge-${enq.status}`}>
                          {(enq.status || "new").replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <select
                          value={enq.status || "new"}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className="admin-select-inline"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", color: "var(--admin-text-muted)" }}>
                      No enquiries received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Activity Feed</h3>
              <p>System events &amp; notifications</p>
            </div>
          </div>
          <div className="admin-card-body">
            {recentActivity.length > 0 ? (
              <ul className="admin-activity-list">
                {recentActivity.map((act) => (
                  <li key={act.id} className="admin-activity-item">
                    <div className="admin-activity-dot" />
                    <div className="admin-activity-content">
                      <div className="admin-activity-title">{act.title}</div>
                      <div className="admin-activity-sub">{act.subtitle}</div>
                      <div className="admin-activity-date">
                        {new Date(act.date).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "13px", color: "var(--admin-text-muted)" }}>
                No recent activity recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
