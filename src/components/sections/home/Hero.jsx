
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-visual">
        <picture className="hero-picture">
          <source
            media="(max-width: 820px)"
            srcSet="/images/hero_mobile.png"
          />
          <img
            src="/images/hero.png"
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
          <p className="eyebrow hero-eyebrow">
            RCC INFRASTRUCTURE
          </p>

          <h1>
            Shaping Spaces for a Brighter{" "}
            <span className="hero-headline-highlight">
              Tomorrow.
            </span>
          </h1>

          <p className="hero-description">
            We deliver high-quality construction, development and
            contracting solutions that create lasting value for
            communities.
          </p>

          <div className="hero-services">
            <span>Construction</span>
            <span className="hero-services-divider">|</span>
            <span>Development</span>
            <span className="hero-services-divider">|</span>
            <span>Contracting</span>
          </div>

          <Link to="/projects" className="hero-explore">
            <span className="hero-explore-icon">
              <Icon name="arrowRight" size={19} />
            </span>
            <span className="hero-explore-text">
              Explore Our Work
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
