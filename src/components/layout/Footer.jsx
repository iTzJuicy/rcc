import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import api from "../../services/api";
import useReveal from "../../hooks/useReveal";

const defaultServices = [
  { label: "Residential Construction", slug: "residential-construction" },
  { label: "Commercial Construction", slug: "commercial-construction" },
  { label: "Renovation & Remodelling", slug: "renovation-remodelling" },
  { label: "Project Management", slug: "project-management" },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "Our Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  const settings = useSiteSettings();
  const [services, setServices] = useState(defaultServices);
  const { ref, isVisible } = useReveal();

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.getServices();
        if (data && data.length > 0) {
          const active = data.filter((s) => s.active !== false).slice(0, 5);
          if (active.length > 0) {
            setServices(
              active.map((s) => ({
                label: s.title || s.name,
                slug: s.slug || String(s.id || s._id),
              }))
            );
          }
        }
      } catch (e) {
        // Fallback already set
      }
    }
    loadServices();
  }, []);

  const phone = settings.phone || "+91 98765 43210";
  const phoneClean = phone.replace(/[^0-9+]/g, "");
  const email = settings.email || "info@rccinfrastructure.com";
  const address = settings.address || "Mangaluru, Karnataka, India";
  const socials = settings.socialLinks || {};

  return (
    <footer ref={ref} className={`site-footer ${isVisible ? "is-visible" : ""}`}>
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo" aria-label="RCC Infrastructure home">
            <img
              src={settings.logoUrl || "/images/logo.webp"}
              alt={settings.siteName || "RCC Infrastructure"}
              loading="lazy"
            />
          </Link>

          <p className="site-footer-description">
            Building with quality, integrity and commitment. RCC Infrastructure
            delivers dependable construction and development solutions designed
            to stand the test of time.
          </p>

          <div className="site-footer-socials">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" aria-hidden="true" style={{ fontSize: "16px" }} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram" aria-hidden="true" style={{ fontSize: "16px" }} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" aria-hidden="true" style={{ fontSize: "16px" }} />
              </a>
            )}
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true" style={{ fontSize: "17px" }} />
              </a>
            )}
          </div>
        </div>

        <div className="site-footer-column">
          <h3>Quick Links</h3>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-column">
          <h3>Our Services</h3>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer-column site-footer-contact">
          <h3>Get in Touch</h3>

          <a href={`tel:${phoneClean}`} className="site-footer-contact-item">
            <Icon name="phone" size={17} />
            <span>{phone}</span>
          </a>

          <a href={`mailto:${email}`} className="site-footer-contact-item">
            <Icon name="mail" size={17} />
            <span>{email}</span>
          </a>

          <div className="site-footer-contact-item">
            <Icon name="mapPin" size={18} />
            <span>{address}</span>
          </div>

          <Link to="/contact" className="site-footer-cta">
            Let's Talk
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>
          © {new Date().getFullYear()} {settings.siteName || "RCC Infrastructure"}. All rights reserved.
        </p>

        <div className="site-footer-legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
