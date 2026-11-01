
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import ContactCTA from "../../components/sections/home/ContactCTA";

export default function About() {
  const stats = [
    { value: "10+", label: "Years of Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
    { value: "100%", label: "Commitment to Quality" },
  ];

  const values = [
    {
      title: "Quality",
      description:
        "We maintain high standards of workmanship, using careful planning and attention to detail to deliver dependable results in every project.",
      icon: "fa-regular fa-gem",
    },
    {
      title: "Trust",
      description:
        "We build lasting relationships through honesty, transparency, accountability, and consistent communication.",
      icon: "fa-solid fa-handshake",
    },
    {
      title: "Innovation",
      description:
        "We welcome better ideas, modern methods, and practical solutions that improve how projects are planned and delivered.",
      icon: "fa-regular fa-lightbulb",
    },
    {
      title: "Sustainability",
      description:
        "We aim to create thoughtful, durable spaces while considering long-term value, responsible development, and the future.",
      icon: "fa-solid fa-leaf",
    },
  ];

  return (
    <>
      {/* PAGE HERO */}
      <PageHero
        eyebrow="Who We Are"
        title="About RCC Infrastructure"
        description="Building with purpose, quality, and a commitment to lasting value."
        image="/images/about.png"
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
            src="/images/about.png"
            alt="RCC Infrastructure building project"
            loading="lazy"
          />
        </div>

        <div className="about-intro-content">
          <div className="about-intro-inner">
            <p className="eyebrow">Our Story</p>

            <h2 className="heading">
              More Than Construction.
              <br />
              <span className="text-red">
                A Lasting Commitment.
              </span>
            </h2>

            <p className="about-intro-description">
              At RCC Infrastructure, we believe construction is
              about more than creating buildings. It is about
              shaping spaces, supporting ambitions, and creating
              something that lasts.
            </p>

            <p className="about-intro-description">
              Every project begins with understanding the people,
              purpose, and vision behind it. We bring together
              thoughtful planning, practical expertise, and a
              commitment to quality to turn those ideas into reality.
            </p>

            <p className="about-intro-description">
              From residential developments to commercial spaces
              and renovation projects, our focus remains on
              dependable execution, clear communication, and
              results our clients can be confident in.
            </p>

            <p className="about-intro-description">
              We approach every opportunity with responsibility
              and attention to detail, building relationships and
              spaces that stand the test of time.
            </p>

            <Link
              to="/services"
              className="btn about-intro-button"
            >
              Explore Our Services
              <Icon name="arrowRight" size={18} />
            </Link>

            {/* STATISTICS */}
            <div className="about-intro-stats">
              {stats.map((stat) => (
                <div
                  className="about-intro-stat"
                  key={stat.label}
                >
                  <strong>{stat.value}</strong>
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
            <p>
              To be a leading infrastructure partner, shaping
              sustainable and modern communities.
            </p>
          </div>
        </div>

        <div className="about-vm-item">
          <div className="about-vm-icon">
            <i className="fa-solid fa-layer-group"></i>
          </div>

          <div className="about-vm-text">
            <h3>Our Mission</h3>
            <p>
              To deliver innovative, high-quality, and reliable
              construction solutions with integrity and excellence.
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

          {/* FOUR VALUES */}
          <div className="about-values-grid">
            {values.map((value) => (
              <article
                className="about-value-item"
                key={value.title}
              >
                <div className="about-value-icon">
                  <i
                    className={value.icon}
                    aria-hidden="true"
                  />
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
