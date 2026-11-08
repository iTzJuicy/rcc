import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import useReveal from "../../../hooks/useReveal";

export default function ContactBanner() {
  const settings = useSiteSettings();
  const { ref, isVisible } = useReveal();
  const phone = settings.phone || "+91 98765 43210";
  const email = settings.email || "info@rccinfrastructure.com";
  const address = settings.address || "Mangaluru, Karnataka";
  const title = settings.contactCtaTitle || "Let's Build Something\nGreat Together.";
  const description =
    settings.contactCtaDescription ||
    "Get in touch with us for your next project.\nWe're here to turn your vision into reality.";
  const phoneClean = phone.replace(/[^0-9+]/g, "");

  return (
    <section ref={ref} className={`contact-banner ${isVisible ? "is-visible" : ""}`} id="contact-banner">
      <div className="contact-banner-overlay" />

      <Container className="contact-banner-container">
        <div className="contact-banner-content reveal-item">
          <p className="eyebrow">Let's Build Together</p>

          <h2 className="contact-banner-title">
            {title.includes("\n") ? (
              title.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < title.split("\n").length - 1 && <br />}
                </span>
              ))
            ) : (
              title
            )}
          </h2>

          <p className="contact-banner-description">
            {description.includes("\n") ? (
              description.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < description.split("\n").length - 1 && <br />}
                </span>
              ))
            ) : (
              description
            )}
          </p>
        </div>

        <div className="contact-banner-details reveal-item">
          <a href={`tel:${phoneClean}`} className="contact-banner-detail">
            <Icon name="phone" size={18} />
            <span>{phone}</span>
          </a>

          <a href={`mailto:${email}`} className="contact-banner-detail">
            <Icon name="mail" size={18} />
            <span>{email}</span>
          </a>

          <div className="contact-banner-detail">
            <Icon name="mapPin" size={19} />
            <span>{address}</span>
          </div>

          <Link to="/contact" className="contact-banner-button">
            <span>Get in Touch</span>
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
