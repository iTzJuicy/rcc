import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import ContactCTA from "../../components/sections/home/ContactCTA";
import { useStats } from "../../hooks/useStats";
import { useSiteContent } from "../../hooks/useSiteContent";

function getValueIconName(value, idx) {
  const iconStr = (value?.icon || "").toLowerCase();
  const titleStr = (value?.title || "").toLowerCase();

  if (iconStr.includes("award") || iconStr.includes("shield") || iconStr.includes("gem") || titleStr.includes("quality")) {
    return "award";
  }
  if (iconStr.includes("clock") || iconStr.includes("time") || titleStr.includes("time") || titleStr.includes("delivery") || titleStr.includes("trust")) {
    return "clock";
  }
  if (iconStr.includes("city") || iconStr.includes("building") || iconStr.includes("lightbulb") || titleStr.includes("infrastructure") || titleStr.includes("modern") || titleStr.includes("innovation")) {
    return "city";
  }
  if (iconStr.includes("leaf") || titleStr.includes("sustain")) {
    return "leaf";
  }

  const defaultOrder = ["award", "clock", "city", "leaf"];
  return defaultOrder[idx % defaultOrder.length];
}

export default function About() {
  const { stats } = useStats();
  const { content } = useSiteContent();
  const aboutData = content?.about || {};

  const title = aboutData.title || "More Than Construction. A Lasting Commitment.";
  const description =
    aboutData.description ||
    "At RCC Infrastructure, we believe construction is about more than creating buildings. It is about shaping spaces, supporting ambitions, and creating something that lasts.";

  const vision =
    aboutData.vision ||
    "To be a leading infrastructure partner, shaping sustainable and modern communities.";
  const mission =
    aboutData.mission ||
    "To deliver innovative, high-quality, and reliable construction solutions with integrity and excellence.";

  const values =
    Array.isArray(aboutData.values) && aboutData.values.length > 0
      ? aboutData.values
      : [
          {
            title: "Quality Assurance",
            description:
              "We maintain high standards of workmanship, using careful planning and attention to detail to deliver dependable results in every project.",
            icon: "award",
          },
          {
            title: "On-Time Delivery",
            description:
              "We build lasting relationships through disciplined milestone tracking and dependable execution.",
            icon: "clock",
          },
          {
            title: "Modern Infrastructure",
            description:
              "We welcome modern methods, engineering excellence, and practical solutions that stand the test of time.",
            icon: "city",
          },
          {
            title: "Sustainable Development",
            description:
              "We aim to create thoughtful, durable spaces while considering long-term value and responsible resource stewardship.",
            icon: "leaf",
          },
        ];

  return (
    <>
      {/* PAGE HERO */}
      <PageHero
        eyebrow="Who We Are"
        title="About RCC Infrastructure"
        description="Building with purpose, quality, and a commitment to lasting value."
        image={content?.pageBanners?.about || "/images/about.webp"}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "About Us" },
        ]}
      />

      {/* =================================
          OUR STORY
      ================================= */}

      <section className="about-intro">
        <div className="about-intro-image">
          <img
            src="/images/about.webp"
            alt="RCC Infrastructure building project"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/about.webp";
            }}
          />
        </div>

        <div className="about-intro-content">
          <div className="about-intro-inner">
            <p className="eyebrow">Our Story</p>

            <h2 className="heading about-safe-title">
              {title}
            </h2>

            <p className="about-intro-description about-safe-desc">
              {description}
            </p>

            <Link
              to="/services"
              className="btn about-intro-button"
            >
              Explore Our Services
              <Icon name="arrowRight" size={18} />
            </Link>

            {/* STATISTICS (From single shared useStats hook) */}
            <div className="about-intro-stats">
              {stats.map((stat, idx) => (
                <div
                  className="about-intro-stat"
                  key={stat.label || idx}
                >
                  <strong>{stat.value}{stat.suffix || ""}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          VISION & MISSION
      ================================= */}

      <section className="about-vision-mission">
        <div className="about-vm-bg-pattern"></div>

        <Container>
          <div className="about-vm-inner">

            {/* LEFT: HEADING */}
            <div className="about-vm-heading">
              <p className="about-vm-eyebrow">
                <span></span>
                OUR PURPOSE
              </p>

              <h2>Vision & Mission</h2>

              <p className="about-vm-intro">
                Guided by a strong purpose, we aim to build
                sustainable spaces and lasting relationships.
              </p>
            </div>

            {/* MIDDLE: DIVIDER */}
            <div className="about-vm-divider"></div>

            {/* RIGHT: VISION & MISSION */}
            <div className="about-vm-content">

              <div className="about-vm-item">
                <div className="about-vm-icon">
                  <i className="fa-solid fa-bullseye"></i>
                </div>

                <div className="about-vm-text">
                  <h3>Our Vision</h3>
                  <p className="about-safe-vm-text">
                    {vision}
                  </p>
                </div>
              </div>

              <div className="about-vm-item">
                <div className="about-vm-icon">
                  <i className="fa-solid fa-layer-group"></i>
                </div>

                <div className="about-vm-text">
                  <h3>Our Mission</h3>
                  <p className="about-safe-vm-text">
                    {mission}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* =================================
          OUR VALUES
      ================================= */}

      <section className="about-values">
        <Container className="about-values-container">

          {/* CENTERED HEADING */}
          <div className="about-values-heading">
            <p className="eyebrow">What Guides Us</p>

            <h2 className="heading">
              The Values Behind
              <br />
              <span className="text-red">Our Work.</span>
            </h2>

            <p>
              The principles that shape how we plan, build,
              and work with our clients.
            </p>
          </div>

          {/* VALUES */}
          <div className="about-values-grid">
            {values.map((value, idx) => (
              <article
                className="about-value-item"
                key={value.title || idx}
              >
                <div className="about-value-icon">
                  <Icon name={getValueIconName(value, idx)} size={32} />
                </div>

                <h3>{value.title}</h3>

                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTACT CTA */}
      <ContactCTA />
    </>
  );
}
