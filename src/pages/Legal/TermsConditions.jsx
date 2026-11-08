import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SEO from "../../components/common/SEO";
import ContactCTA from "../../components/sections/home/ContactCTA";

export default function TermsConditions() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Terms and conditions governing the use of RCC Infrastructure's website, architectural consulting, and construction services."
      />
      <PageHero
        eyebrow="Terms of Service"
        title="Terms & Conditions"
        description="Please review our terms and conditions governing the use of this website and engagement with our construction services."
        image="/images/impact.webp"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Terms & Conditions" },
        ]}
      />

      <section className="section legal-page">
        <Container>
          <div className="legal-content-card">
            <p className="legal-updated">Last Updated: November 2026</p>

            <article className="legal-section">
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using the website of RCC Infrastructure ("Company", "we",
                "us"), you acknowledge that you have read, understood, and agree to be bound
                by these Terms & Conditions. If you do not agree, please discontinue using this site.
              </p>
            </article>

            <article className="legal-section">
              <h2>2. Services & Project Proposals</h2>
              <p>
                All information, service descriptions, project portfolios, and architectural
                previews displayed on this website are provided for informational and showcase
                purposes only. Formal construction contracts, quotation estimates, warranties,
                and schedules are governed exclusively by signed commercial agreements.
              </p>
            </article>

            <article className="legal-section">
              <h2>3. Intellectual Property</h2>
              <p>
                All architectural imagery, plans, text, photography, trademarks, logos, and
                software code present on this website are the proprietary property of RCC
                Infrastructure or its licensors and are protected by applicable intellectual
                property laws. Unauthorized reproduction or redistribution is strictly prohibited.
              </p>
            </article>

            <article className="legal-section">
              <h2>4. Inquiries & Booking Requests</h2>
              <p>
                Submitting a quotation request or contact enquiry does not constitute a
                binding contract for construction services. Quotations remain subject to site
                feasibility inspections, material costs, and mutual contractual execution.
              </p>
            </article>

            <article className="legal-section">
              <h2>5. Limitation of Liability</h2>
              <p>
                While RCC Infrastructure strives to keep the website information accurate and
                up to date, we do not warrant that all content is free from inadvertent typographical
                errors. We shall not be liable for any indirect, incidental, or consequential
                damages resulting from reliance on website materials.
              </p>
            </article>

            <article className="legal-section">
              <h2>6. Governing Law & Jurisdiction</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance
                with the laws of India. Any disputes arising out of the website or business
                engagements shall fall under the jurisdiction of the competent courts in
                Mangaluru, Karnataka, India.
              </p>
            </article>

            <article className="legal-section">
              <h2>7. Inquiries & Contact</h2>
              <p>
                For any clarifications or legal inquiries regarding these terms, reach us at{" "}
                <a href="mailto:info@rccinfrastructure.com" className="text-red">
                  info@rccinfrastructure.com
                </a>
                .
              </p>
            </article>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
