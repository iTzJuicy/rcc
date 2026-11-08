import { Link } from "react-router-dom";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function AdminHeader({ title = "Dashboard", onToggleMobile = () => {} }) {
  const settings = useSiteSettings();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <i className="fa-solid fa-bars" />
        </button>

        <img
          src={settings?.logoUrl || "/images/logo.webp"}
          alt="RCC Logo"
          className="admin-topbar-logo"
        />

        <h1 className="admin-topbar-title">{title}</h1>
      </div>

      <div className="admin-topbar-actions">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar-link"
          title="Open live public website in new tab"
        >
          <i className="fa-solid fa-arrow-up-right-from-square" />
          <span>View Website</span>
        </Link>
        <Link to="/admin/help" className="admin-topbar-link">
          <i className="fa-solid fa-circle-question" />
          <span>Help</span>
        </Link>
      </div>
    </header>
  );
}
