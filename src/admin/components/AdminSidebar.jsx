import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function AdminSidebar({
  newEnquiriesCount = 0,
  mobileOpen = false,
  onCloseMobile = () => {},
}) {
  const { user, logout } = useAuth();
  const settings = useSiteSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const isSuper = !user?.role || user?.role === "superadmin" || user?.role === "admin";
  const perms = user?.permissions || {};

  // Grouped Navigation matching Part B6 specification
  const groups = [
    {
      heading: "Overview",
      items: [
        { to: "/admin", label: "Dashboard", icon: "fa-solid fa-chart-pie", end: true, show: true },
      ],
    },
    {
      heading: "Content",
      items: [
        { to: "/admin/home-content", label: "Home Page", icon: "fa-solid fa-house", show: isSuper || perms.settings },
        { to: "/admin/about-content", label: "About Page", icon: "fa-solid fa-address-card", show: isSuper || perms.settings },
        { to: "/admin/services", label: "Services", icon: "fa-solid fa-helmet-safety", show: isSuper || perms.services !== false },
        { to: "/admin/projects", label: "Projects", icon: "fa-solid fa-building", show: isSuper || perms.projects !== false },
        { to: "/admin/categories", label: "Categories", icon: "fa-solid fa-tags", show: isSuper || perms.categories !== false },
        { to: "/admin/testimonials", label: "Testimonials", icon: "fa-solid fa-comment-dots", show: isSuper || perms.testimonials !== false },
        { to: "/admin/stats", label: "Stats", icon: "fa-solid fa-calculator", show: isSuper || perms.stats !== false },
        { to: "/admin/expertise", label: "Our Expertise", icon: "fa-solid fa-award", show: isSuper || perms.settings },
        { to: "/admin/process-faq", label: "Process FAQ", icon: "fa-solid fa-circle-question", show: isSuper || perms.settings },
      ],
    },
    {
      heading: "Media",
      items: [
        { to: "/admin/page-banners", label: "Page Banners", icon: "fa-solid fa-image", show: isSuper || perms.settings },
        { to: "/admin/media", label: "Media Library", icon: "fa-solid fa-images", show: isSuper || perms.media !== false },
      ],
    },
    {
      heading: "Messages",
      items: [
        {
          to: "/admin/enquiries",
          label: "Enquiries",
          icon: "fa-solid fa-envelope",
          badge: newEnquiriesCount > 0 ? newEnquiriesCount : null,
          show: isSuper || perms.enquiries !== false,
        },
      ],
    },
    {
      heading: "Settings",
      items: [
        { to: "/admin/settings", label: "Site Settings", icon: "fa-solid fa-sliders", show: isSuper || perms.settings },
        { to: "/admin/users", label: "Team & Permissions", icon: "fa-solid fa-users-gear", show: isSuper || perms.users },
        { to: "/admin/change-password", label: "Change Password", icon: "fa-solid fa-key", show: true },
        { to: "/admin/help", label: "Help & Guide", icon: "fa-solid fa-book", show: true },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand-link" onClick={onCloseMobile}>
            <img
              src={settings?.logoUrl || "/images/logo.webp"}
              alt="RCC Infrastructure"
              className="admin-sidebar-logo"
            />
            <span className="admin-brand-badge">ADMIN PANEL</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {groups.map((group) => {
            const visibleItems = group.items.filter((item) => item.show);
            if (visibleItems.length === 0) return null;

            return (
              <div className="admin-nav-group" key={group.heading}>
                <div className="admin-nav-heading">{group.heading}</div>
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? "active" : ""}`
                    }
                  >
                    <div className="admin-nav-left">
                      <i className={item.icon} aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-user-details">
              <div className="admin-user-name">{user?.name || "Administrator"}</div>
              <div className="admin-user-role">
                {isSuper ? "Super Admin" : user?.role || "Staff"}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Sign out of Admin"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
