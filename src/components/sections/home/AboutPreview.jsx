
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

const aboutFeatures = [
  {
    title: "Quality",
    subtitle: "Assurance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.3 2.3 4.7-4.8" />
      </svg>
    ),
  },
  {
    title: "On-Time",
    subtitle: "Delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="13" r="8.5" />
        <path d="M12 8v5l3.5 2" />
        <path d="M9 2h6M12 2v2.5" />
      </svg>
    ),
  },
  {
    title: "Modern",
    subtitle: "Infrastructure",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18M5 21V9l7-6 7 6v12" />
        <path d="M9 12h2v3H9zM14 12h2v3h-2zM10 21v-4h4v4" />
      </svg>
    ),
  },
  {
    title: "Sustainable",
    subtitle: "Development",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 3.5C12 3.5 6 6.5 6 13a5 5 0 0 0 5 5c6.5 0 9.5-6 9.5-14.5Z" />
        <path d="M3 21c2-5 6-8 12-11" />
      </svg>
    ),
  },
];

export default function AboutPreview() {
  return (
    <section className="about-preview" id="about">
      <div className="about-preview-image">
        <img
          src="/images/about.png"
          alt="Modern architectural construction by RCC Infrastructure"
          loading="lazy"
        />
      </div>

      <Container className="about-preview-container">
        <div className="about-preview-content">
          <p className="eyebrow">About Us</p>

          <h2 className="about-preview-title">
            A Trusted Name
            <br />
            in Construction.
          </h2>

          <p className="about-preview-description">
            RCC Infrastructure is a trusted name in the construction and real
            estate sector, known for delivering high-quality projects in
            residential, commercial and infrastructure development in
            Mangaluru, Karnataka.
          </p>

          <Link to="/about" className="about-preview-button">
            <span>Learn More</span>
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="about-preview-features">
          {aboutFeatures.map((feature) => (
            <div className="about-preview-feature" key={feature.title}>
              <span className="about-preview-feature-icon">
                {feature.icon}
              </span>

              <span className="about-preview-feature-text">
                <span>{feature.title}</span>
                <span>{feature.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
