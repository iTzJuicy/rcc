import { Link, useLocation } from "react-router-dom";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import SEO from "../../components/common/SEO";

export default function ThankYou() {
  const location = useLocation();
  const state = location.state || {};
  const { title = "Thank You for Reaching Out", message = "We have received your enquiry. Our team will review the details and get back to you within 24 to 48 business hours." } = state;

  return (
    <>
      <SEO
        title="Thank You"
        description="Thank you for submitting your enquiry to RCC Infrastructure. We look forward to connecting with you."
      />
      <main className="thank-you-page">
        <Container>
          <div className="thank-you-card">
            <div className="thank-you-badge">
              <Icon name="check" size={32} />
            </div>

            <p className="eyebrow text-red">Request Received</p>
            <h1 className="thank-you-title">{title}</h1>
            <p className="thank-you-text">{message}</p>

            <div className="thank-you-details">
              <div className="thank-you-info-item">
                <Icon name="phone" size={18} />
                <span>Quick assistance: +91 98765 43210</span>
              </div>
              <div className="thank-you-info-item">
                <Icon name="mail" size={18} />
                <span>info@rccinfrastructure.com</span>
              </div>
            </div>

            <div className="thank-you-actions">
              <Link to="/" className="btn">
                Return to Home
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/projects" className="btn btn-outline">
                Explore Projects
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
