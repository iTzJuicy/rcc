
import { Link } from "react-router-dom";
import Icon from "../common/Icon";

const services = [
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
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo" aria-label="RCC Infrastructure home">
            <img src="/images/logo.png" alt="RCC Infrastructure" loading="lazy" />
          </Link>

          <p className="site-footer-description">
            Building with quality, integrity and commitment. RCC Infrastructure
            delivers dependable construction and development solutions designed
            to stand the test of time.
          </p>

          <div className="site-footer-socials">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Icon name="facebook" size={17} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" size={17} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" size={17} />
            </a>
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

          <a href="tel:+91XXXXXXXXXX" className="site-footer-contact-item">
            <Icon name="phone" size={17} />
            <span>+91 XXXXX XXXXX</span>
          </a>

          <a href="mailto:info@yourdomain.com" className="site-footer-contact-item">
            <Icon name="mail" size={17} />
            <span>info@yourdomain.com</span>
          </a>

          <div className="site-footer-contact-item">
            <Icon name="mapPin" size={18} />
            <span>Mangaluru, Karnataka, India</span>
          </div>

          <Link to="/contact" className="site-footer-cta">
            Let's Talk
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>
          © {new Date().getFullYear()} RCC Infrastructure. All rights reserved.
        </p>

        <div className="site-footer-legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
