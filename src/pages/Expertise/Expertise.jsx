
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import ContactCTA from "../../components/sections/home/ContactCTA";
import SEO from "../../components/common/SEO";
import { CONTENT_FALLBACKS, useSiteContent } from "../../hooks/useSiteContent";
import "../../styles/expertise.css";

export default function Expertise() {
  const { content } = useSiteContent();
  const savedExpertise = content?.expertise;
  const expertise = Array.isArray(savedExpertise)
    ? { ...CONTENT_FALLBACKS.expertise, items: savedExpertise }
    : {
        ...CONTENT_FALLBACKS.expertise,
        ...(savedExpertise || {}),
        hero: { ...CONTENT_FALLBACKS.expertise.hero, ...savedExpertise?.hero },
        intro: { ...CONTENT_FALLBACKS.expertise.intro, ...savedExpertise?.intro },
        areas: { ...CONTENT_FALLBACKS.expertise.areas, ...savedExpertise?.areas },
        approach: { ...CONTENT_FALLBACKS.expertise.approach, ...savedExpertise?.approach },
      };
  const expertiseAreas = Array.isArray(expertise.items) ? expertise.items : [];

  return (
    <main className="expertise-page">
      <SEO title="Our Expertise" description="Explore RCC Infrastructure's expertise in construction, development, and project delivery." />
      <PageHero
        pageKey="expertise"
        eyebrow={expertise.hero.eyebrow}
        title={expertise.hero.title}
        description={expertise.hero.description}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Our Expertise" },
        ]}
      />

      {/* Expertise Introduction */}
      <section className="expertise-intro">
        <Container>
          <div className="expertise-intro-grid">
            <div className="expertise-intro-heading">
              <span className="expertise-eyebrow">{expertise.intro.eyebrow}</span>

              <h2>{expertise.intro.title}</h2>
            </div>

            <div className="expertise-intro-content">
              {expertise.intro.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}

              <Link to="/services" className="expertise-button">
                {expertise.intro.buttonText}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Expertise Areas */}
      <section className="expertise-areas">
        <Container>
          <div className="expertise-areas-header">
            <SectionHeading
              eyebrow={expertise.areas.eyebrow}
              title={expertise.areas.title}
              description={expertise.areas.description}
              light
            />
          </div>

          <div className="expertise-grid">
            {expertiseAreas.map((area, index) => (
              <article className="expertise-card" key={area.id || index}>
                <div className="expertise-card-top">
                  <span className="expertise-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="expertise-card-content">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="expertise-areas-footer">
            <p>{expertise.areas.footerText}</p>

            <Link to="/contact" className="expertise-footer-link">
              {expertise.areas.footerLinkText}
            </Link>
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="expertise-approach">
        <div className="expertise-approach-image">
          <img
            src={expertise.approach.image}
            alt="Construction project showcasing quality workmanship"
          />
        </div>

        <div className="expertise-approach-content">
          <div className="expertise-approach-inner">
            <span className="expertise-eyebrow">{expertise.approach.eyebrow}</span>

            <h2>{expertise.approach.title}</h2>

            {expertise.approach.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}

            <Link to="/process" className="expertise-button">
              {expertise.approach.buttonText}
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
