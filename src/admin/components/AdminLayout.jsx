import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import api from "../../services/api";

const PAGE_TITLES = {
  "/admin": "Dashboard Overview",
  "/admin/home-content": "Home Page Content",
  "/admin/about-content": "About Page Content",
  "/admin/services": "Services Catalog",
  "/admin/services/new": "Add New Service",
  "/admin/projects": "Projects Portfolio",
  "/admin/projects/new": "Add New Project",
  "/admin/categories": "Project Categories",
  "/admin/categories/new": "Add New Category",
  "/admin/testimonials": "Client Testimonials",
  "/admin/testimonials/new": "Add New Testimonial",
  "/admin/stats": "Impact Statistics",
  "/admin/stats/new": "Add New Stat",
  "/admin/expertise": "Our Expertise (6 Cards)",
  "/admin/process-faq": "Process FAQs (Max 8)",
  "/admin/page-banners": "Page Banner Images",
  "/admin/media": "Media Library",
  "/admin/enquiries": "Client Enquiries & Quotations",
  "/admin/settings": "Site Settings & Branding",
  "/admin/users": "Team & Access Control",
  "/admin/change-password": "Change Password",
  "/admin/help": "Help & Documentation Guide",
};

export default function AdminLayout() {
  const location = useLocation();
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setStatsError("");
        const res = await api.adminGetDashboard();
        if (res?.data?.stats?.newEnquiries !== undefined) {
          setNewEnquiries(res.data.stats.newEnquiries);
        }
      } catch (err) {
        setStatsError(err.message || "Unable to refresh enquiry notifications.");
      }
    }
    loadStats();
  }, [location.pathname]);

  const currentTitle = PAGE_TITLES[location.pathname] || "Admin Panel";

  return (
    <div className="admin-body">
      <div className="admin-shell">
        <AdminSidebar
          newEnquiriesCount={newEnquiries}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <div className="admin-main">
          <AdminHeader
            title={currentTitle}
            onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main className="admin-content">
            {statsError && (
              <div className="admin-toast-banner error" role="status">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                <span>{statsError}</span>
              </div>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
