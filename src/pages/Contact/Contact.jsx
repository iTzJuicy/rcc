import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import SEO from "../../components/common/SEO";
import api from "../../services/api";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import "../../styles/contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const settings = useSiteSettings();

  const phone = settings.phone || "+91 98765 43210";
  const phoneClean = phone.replace(/[^0-9+]/g, "");
  const email = settings.email || "info@rccinfrastructure.com";
  const address = settings.address || "Mangaluru, Karnataka, India";
  const whatsappUrl =
    settings.socialLinks?.whatsapp || `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
  const mapEmbedUrl =
    settings.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124442.27439162986!2d74.78201948956942!3d12.922983196901844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0x827bbc7a74fcfe15!2sMangaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    _gotcha: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check honeypot
    if (formData._gotcha) {
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      await api.submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || "Website General Enquiry",
        message: formData.message,
        _gotcha: formData._gotcha,
      });

      navigate("/thank-you", {
        state: {
          title: "Thank You for Contacting Us",
          message:
            "Your enquiry has been recorded successfully. Our team will review your project requirements and reach out to you within 24 to 48 hours.",
        },
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: `Unable to submit enquiry: ${err.message || "Network error"}. Please reach us directly at ${phone} or via WhatsApp.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <SEO
        title="Contact Us"
        description={`Get in touch with RCC Infrastructure in ${address}. Send us an inquiry for your residential, commercial, or civil construction project.`}
      />

      {/* Page Hero */}
      <PageHero
        eyebrow="Let's Connect"
        title="Contact Us"
        description="Tell us about your project. We'd love to hear your ideas and discuss how we can help."
        image="/images/contact.webp"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Contact" },
        ]}
      />

      {/* Contact Section */}
      <section className="section contact-page-section">
        <Container>
          <div className="contact-page-grid">
            {/* Contact Information */}
            <div className="contact-page-info">
              <p className="eyebrow">Get in Touch</p>

              <h2 className="heading">
                Let's Start a
                <br />
                <span className="text-red">Conversation.</span>
              </h2>

              <p className="contact-page-description">
                Whether you have a new construction project, a renovation
                requirement, or a question about our services, get in touch
                with our team. We would be happy to understand your
                requirements and help you take the next step.
              </p>

              {/* Contact Details */}
              <div className="contact-info-list">
                {/* Location */}
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Icon name="mapPin" size={20} />
                  </div>

                  <div className="contact-info-content">
                    <h3>Our Location</h3>
                    <p>{address}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Icon name="mail" size={20} />
                  </div>

                  <div className="contact-info-content">
                    <h3>Email Us</h3>
                    <a href={`mailto:${email}`}>
                      {email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Icon name="phone" size={20} />
                  </div>

                  <div className="contact-info-content">
                    <h3>Call Us</h3>
                    <a href={`tel:${phoneClean}`}>{phone}</a>
                  </div>
                </div>
              </div>

              {/* Separate WhatsApp Button */}
              <div className="contact-whatsapp-wrapper">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp-btn"
                >
                  <Icon name="whatsapp" size={20} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <span className="eyebrow">Get in Touch</span>
                <h2>Send Us a Message</h2>
                <p>
                  Have a question or something in mind? We'd love to hear
                  from you.
                </p>
              </div>

              {statusMessage.text && (
                <div className={`alert alert-${statusMessage.type}`} style={{
                  padding: "12px 16px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  backgroundColor: statusMessage.type === "error" ? "rgba(220, 38, 38, 0.1)" : "rgba(34, 197, 94, 0.1)",
                  color: statusMessage.type === "error" ? "#dc2626" : "#16a34a",
                  border: `1px solid ${statusMessage.type === "error" ? "#dc2626" : "#16a34a"}`
                }}>
                  {statusMessage.text}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Honeypot field for anti-spam */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex="-1"
                    autoComplete="off"
                    value={formData._gotcha}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn contact-form-submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Enquiry"}
                  <Icon name="arrowUpRight" size={18} />
                </button>

                <p className="contact-form-note">
                  Submitting directly sends your message to our project
                  management team for a prompt response.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="section contact-map-section">
        <Container>
          <div className="contact-map-header">
            <p className="eyebrow">Our Location</p>
            <h2 className="heading">
              Find Us in <span className="text-red">Mangalore.</span>
            </h2>
            <p className="contact-page-description">
              Conveniently located to serve projects across Mangalore and the
              coastal Karnataka region.
            </p>
          </div>

          <div className="contact-map-frame">
            <iframe
              title="RCC Infrastructure Location Map"
              src={mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "6px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
