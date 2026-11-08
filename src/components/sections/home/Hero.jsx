import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import { useSiteContent } from "../../../hooks/useSiteContent";

export default function Hero() {
  const { content } = useSiteContent();
  const homeData = content?.home || {};

  const rawHeading =
    homeData.heroHeading || "Shaping Spaces for a Brighter Tomorrow.";
  const description =
    homeData.heroDescription ||
    "Delivering exceptional residential, commercial, and infrastructure solutions across Mangaluru with a relentless commitment to quality and architectural integrity.";
  const buttonText = homeData.heroButtonText || "Explore Projects";

  // Automatically wrap the last word of the heading in the accent color
  const renderFormattedHeading = (text) => {
    if (!text || typeof text !== "string") {
      return (
        <>
          Shaping Spaces for a Brighter{" "}
          <span className="hero-headline-highlight">Tomorrow.</span>
        </>
      );
    }
    const words = text.trim().split(/\s+/);
    if (words.length === 1) {
      return <span className="hero-headline-highlight">{words[0]}</span>;
    }
    const lastWord = words.pop();
    const leadingWords = words.join(" ");
    return (
      <>
        {leadingWords}{" "}
        <span className="hero-headline-highlight">{lastWord}</span>
      </>
    );
  };

  return (
    <section className="hero">
      <div className="hero-visual">
        <picture className="hero-picture">
          <source
            type="image/webp"
            media="(max-width: 820px)"
            srcSet="/images/hero_mobile.webp"
          />
          <source
            media="(max-width: 820px)"
            srcSet="/images/hero_mobile.webp"
          />
          <source
            type="image/webp"
            srcSet="/images/hero.webp"
          />
          <img
            src="/images/hero.webp"
            alt="Modern architectural project by RCC Infrastructure"
            className="hero-image"
            fetchPriority="high"
          />
        </picture>

        <div className="hero-image-overlay" />

        <p className="hero-image-message">
          <span>QUALITY</span>
          <span>CONSTRUCTION</span>
          <span>BUILDS LASTING</span>
          <span>RELATIONSHIPS</span>
        </p>

        <a
          href="#services"
          className="hero-scroll"
          aria-label="Scroll down to the next section"
        >
          <span className="hero-scroll-line" />
          <span className="hero-scroll-bottom">
            <span className="hero-scroll-circle">
              <Icon name="arrowDown" size={18} />
            </span>
            <span className="hero-scroll-text">Scroll</span>
          </span>
        </a>
      </div>

      <Container className="hero-container">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow hero-load-item">
            RCC INFRASTRUCTURE
          </p>

          <h1 className="hero-safe-heading hero-load-item">
            {renderFormattedHeading(rawHeading)}
          </h1>

          <p className="hero-description hero-safe-desc hero-load-item">
            {description}
          </p>

          <div className="hero-services hero-load-item">
            <span>Construction</span>
            <span className="hero-services-divider">|</span>
            <span>Development</span>
            <span className="hero-services-divider">|</span>
            <span>Contracting</span>
          </div>

          <Link to="/projects" className="hero-explore hero-load-item">
            <span className="hero-explore-icon">
              <Icon name="arrowRight" size={19} />
            </span>
            <span className="hero-explore-text">
              {buttonText}
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
