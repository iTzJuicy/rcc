
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

export default function ContactBanner() {
  return (
    <section className="contact-banner" id="contact-banner">
      <div className="contact-banner-overlay" />

      <Container className="contact-banner-container">
        <div className="contact-banner-content">
          <p className="eyebrow">Let's Build Together</p>

          <h2 className="contact-banner-title">
            Let's Build Something
            <br />
            Great Together.
          </h2>

          <p className="contact-banner-description">
            Get in touch with us for your next project.
            <br />
            We're here to turn your vision into reality.
          </p>
        </div>

        <div className="contact-banner-details">
          <a
            href="tel:+91XXXXXXXXXX"
            className="contact-banner-detail"
          >
            <Icon name="phone" size={18} />
            <span>+91 XXXXX XXXXX</span>
          </a>

          <a
            href="mailto:info@yourdomain.com"
            className="contact-banner-detail"
          >
            <Icon name="mail" size={18} />
            <span>info@yourdomain.com</span>
          </a>

          <div className="contact-banner-detail">
            <Icon name="mapPin" size={19} />
            <span>Mangaluru, Karnataka</span>
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
