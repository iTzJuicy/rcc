
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import { useSiteContent } from "../../../hooks/useSiteContent";
import useReveal from "../../../hooks/useReveal";

const aboutFeatures = [
  {
    title: "Quality",
    subtitle: "Assurance",
    iconName: "award",
  },
  {
    title: "On-Time",
    subtitle: "Delivery",
    iconName: "clock",
  },
  {
    title: "Modern",
    subtitle: "Infrastructure",
    iconName: "city",
  },
  {
    title: "Sustainable",
    subtitle: "Development",
    iconName: "leaf",
  },
];

export default function AboutPreview() {
  const { content } = useSiteContent();
  const homeData = content?.home || {};
  const { ref, isVisible } = useReveal();

  const title = homeData.aboutTitle || "A Trusted Name in Construction.";
  const description =
    homeData.aboutDescription ||
    "RCC Infrastructure is a trusted name in the construction and real estate sector, known for delivering high-quality projects in residential, commercial and infrastructure development in Mangaluru, Karnataka.";

  return (
    <section ref={ref} className={`about-preview ${isVisible ? "is-visible" : ""}`} id="about">
      <div className="about-preview-image reveal-item">
        <img
          src="/images/about.webp"
          alt="Modern architectural construction by RCC Infrastructure"
          loading="lazy"
        />
      </div>

      <Container className="about-preview-container">
        <div className="about-preview-content reveal-item">
          <p className="eyebrow">About Us</p>

          <h2 className="about-preview-title home-safe-title">
            {title}
          </h2>

          <p className="about-preview-description home-safe-desc">
            {description}
          </p>

          <Link to="/about" className="about-preview-button">
            <span>Learn More</span>
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="about-preview-features">
          {aboutFeatures.map((feature, idx) => (
            <div className="about-preview-feature reveal-item" style={{ "--reveal-index": idx }} key={feature.title}>
              <span className="about-preview-feature-icon">
                <Icon name={feature.iconName} size={32} />
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
