import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("rcc_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("rcc_cookie_consent", "accepted");
    window.dispatchEvent(new Event("rcc_cookie_consent_updated"));
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("rcc_cookie_consent", "essential_only");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-banner"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-content">
          <div className="cookie-banner-icon">
            <Icon name="shield" size={20} />
          </div>
          <div className="cookie-banner-text">
            <h4>We value your privacy</h4>
            <p>
              We use cookies to enhance your browsing experience, analyze site
              traffic, and serve personalized content. Learn more in our{" "}
              <Link to="/privacy-policy" className="cookie-banner-link">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-outline"
            onClick={handleDecline}
          >
            Essential Only
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-primary"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
