
import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Icon from "../common/Icon";

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Our Expertise", to: "/expertise" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  // Close the menu when the route changes, including browser navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock page scrolling and close the menu with Escape or desktop resize.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth > 1100) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          aria-label="RCC Infrastructure Home"
          onClick={closeMenu}
        >
          <img
            src="/images/logo.png"
            alt="RCC Infrastructure"
            width="100"
            height="80"
          />
        </Link>

        <nav
          id="primary-navigation"
          className={`navbar-links ${menuOpen ? "open" : ""}`}
          aria-label="Main navigation"
          aria-hidden={!menuOpen && window.innerWidth <= 1100}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              tabIndex={
                !menuOpen && window.innerWidth <= 1100 ? -1 : undefined
              }
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="btn menu-cta"
            onClick={closeMenu}
            tabIndex={
              !menuOpen && window.innerWidth <= 1100 ? -1 : undefined
            }
          >
            <span>Get in Touch</span>
            <Icon name="arrowRight" size={16} />
          </Link>
        </nav>

        <Link
          to="/contact"
          className="btn navbar-cta"
          onClick={closeMenu}
        >
          <span>Get in Touch</span>
          <Icon name="arrowRight" size={16} />
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={22} />
        </button>
      </div>
    </header>
  );
}
