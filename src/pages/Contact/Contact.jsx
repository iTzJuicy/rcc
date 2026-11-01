
import { useState } from "react";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import "../../styles/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      formData.subject || `Website Enquiry - ${formData.name}`
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || "Not provided"}\n\n` +
      `Message:\n${formData.message}`
    );

    window.location.href =
      `mailto:info@rccinfrastructure.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="contact-page">

      {/* Page Hero */}
      <PageHero
        eyebrow="Let's Connect"
        title="Contact Us"
        description="Tell us about your project. We'd love to hear your ideas and discuss how we can help."
        image="/images/contact.png"
        breadcrumb={[
          { label: "Home", path: "/" },
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
                    <p>Mangalore, Karnataka, India</p>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Icon name="mail" size={20} />
                  </div>

                  <div className="contact-info-content">
                    <h3>Email Us</h3>
                    <a href="mailto:info@rccinfrastructure.com">
                      info@rccinfrastructure.com
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
                    <a href="tel:+919876543210">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

              </div>

              {/* Separate WhatsApp Button */}
              <div className="contact-whatsapp-wrapper">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp-btn"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  Chat on WhatsApp
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

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

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
                >
                  Send Enquiry
                  <Icon name="arrowUpRight" size={18} />
                </button>

                <p className="contact-form-note">
                  Submitting opens your default email application with
                  your enquiry details.
                </p>

              </form>
            </div>

          </div>
        </Container>
      </section>

    </main>
  );
}
