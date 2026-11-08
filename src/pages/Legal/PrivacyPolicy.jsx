import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SEO from "../../components/common/SEO";
import ContactCTA from "../../components/sections/home/ContactCTA";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Read RCC Infrastructure's privacy policy. Learn how we collect, protect, and handle your data and enquiry information."
      />
      <PageHero
        eyebrow="Legal & Transparency"
        title="Privacy Policy"
        description="We respect your privacy and are committed to protecting personal data collected through our website and services."
        image="/images/impact.webp"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <section className="section legal-page">
        <Container>
          <div className="legal-content-card">
            <p className="legal-updated">Last Updated: November 2026</p>

            <article className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to RCC Infrastructure ("we", "our", or "us"). We respect
                your personal privacy and are dedicated to processing your
                personal data in a lawful, fair, and transparent manner in
                compliance with applicable privacy and data protection laws.
              </p>
            </article>

            <article className="legal-section">
              <h2>2. Information We Collect</h2>
              <p>When you interact with our website, we may collect the following information:</p>
              <ul>
                <li>
                  <strong>Contact Inquiries:</strong> Full name, email address, phone
                  number, project requirements, and any message details you submit
                  through our contact or quotation request forms.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type and version,
                  operating system, referring URLs, and device identifiers collected
                  automatically via server logs.
                </li>
                <li>
                  <strong>Cookies & Usage Data:</strong> Pages visited, time spent on pages,
                  navigation pathways, and cookie consent preferences.
                </li>
              </ul>
            </article>

            <article className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>Your information is used strictly for legitimate business purposes:</p>
              <ul>
                <li>To respond to your inquiries, consultation requests, and project briefs.</li>
                <li>To provide accurate cost estimates, quotation proposals, and project timelines.</li>
                <li>To operate, protect, and optimize our website's performance and security.</li>
                <li>To comply with legal obligations and safeguard against fraudulent activities.</li>
              </ul>
            </article>

            <article className="legal-section">
              <h2>4. Data Storage & Security</h2>
              <p>
                We implement industry-standard technical and organizational security
                measures, including encrypted data transmissions (HTTPS), parameterized
                database queries, rate limiting, and restricted admin access controls to
                prevent unauthorized disclosure or destruction of your personal information.
              </p>
            </article>

            <article className="legal-section">
              <h2>5. Third-Party Services</h2>
              <p>
                We may use trusted third-party service providers (such as Cloudinary for
                secure media storage and Sentry for error logging). These partners are
                contractually bound to maintain strict confidentiality and safeguard your data.
              </p>
            </article>

            <article className="legal-section">
              <h2>6. Your Rights</h2>
              <p>
                You have the right to request access to the personal data we hold about
                you, ask for corrections, or request deletion of your contact records.
                To exercise any of these rights, please reach out to us at{" "}
                <a href="mailto:info@rccinfrastructure.com" className="text-red">
                  info@rccinfrastructure.com
                </a>
                .
              </p>
            </article>

            <article className="legal-section">
              <h2>7. Contact Information</h2>
              <p>
                If you have questions about this Privacy Policy or our data protection
                practices, please contact:
              </p>
              <div className="legal-contact-box">
                <p><strong>RCC Infrastructure</strong></p>
                <p>Mangalore, Karnataka, India</p>
                <p>Email: <a href="mailto:info@rccinfrastructure.com">info@rccinfrastructure.com</a></p>
                <p>Phone: <a href="tel:+919876543210">+91 98765 43210</a></p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
