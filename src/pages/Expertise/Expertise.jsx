
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import ContactCTA from "../../components/sections/home/ContactCTA";
import { useSiteContent } from "../../hooks/useSiteContent";
import "../../styles/expertise.css";

export default function Expertise() {
  const { content } = useSiteContent();

  const expertiseAreas =
    Array.isArray(content?.expertise) && content.expertise.length === 6
      ? content.expertise
      : [
          {
            number: "01",
            title: "Residential Construction",
            description:
              "We create thoughtfully planned homes that balance functionality, comfort, and lasting quality. Every detail is considered to make each space practical and welcoming.",
          },
          {
            number: "02",
            title: "Commercial Construction",
            description:
              "From commercial buildings to workspaces, we deliver dependable construction solutions designed around operational needs, usability, and long-term value.",
          },
          {
            number: "03",
            title: "Planning & Coordination",
            description:
              "Careful planning and coordination help keep every project organised. We work closely with clients, consultants, and teams to ensure each stage moves forward smoothly.",
          },
          {
            number: "04",
            title: "Renovation & Remodelling",
            description:
              "We transform existing spaces through considered improvements, practical upgrades, and quality workmanship while respecting the purpose and character of each property.",
          },
          {
            number: "05",
            title: "Interior Works",
            description:
              "We focus on the details that bring interiors together, delivering well-finished spaces that reflect the requirements, preferences, and everyday needs of our clients.",
          },
          {
            number: "06",
            title: "Project Management",
            description:
              "From initial planning to final delivery, we maintain clear communication, coordinate resources, and monitor progress to keep projects aligned with their objectives.",
          },
        ];

  return (
    <main className="expertise-page">
      <PageHero
        pageKey="expertise"
        eyebrow="Our Capabilities"
        title="Our Expertise"
        description="Practical construction solutions, thoughtful planning, and quality execution at every stage."
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
              <span className="expertise-eyebrow">What We Bring</span>

              <h2>
                Practical Solutions.
                <br />
                Quality Execution.
              </h2>
            </div>

            <div className="expertise-intro-content">
              <p>
                Every construction project begins with a different vision,
                purpose, and set of requirements. We take the time to
                understand what matters to each client and turn those
                requirements into a clear, considered plan.
              </p>

              <p>
                Through careful coordination, dependable workmanship, and
                attention to detail, we work to deliver spaces that are
                functional, well-built, and made to serve their purpose for
                years to come.
              </p>

              <Link to="/services" className="expertise-button">
                Explore Our Services
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
              eyebrow="Our Expertise"
              title={
                <>
                  Built Around
                  <br />
                  Your Requirements.
                </>
              }
              description="Explore the key areas that shape our construction and project delivery approach."
              light
            />
          </div>

          <div className="expertise-grid">
            {expertiseAreas.map((area) => (
              <article className="expertise-card" key={area.number}>
                <div className="expertise-card-top">
                  <span className="expertise-card-number">
                    {area.number}
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
            <p>Have a project in mind?</p>

            <Link to="/contact" className="expertise-footer-link">
              Discuss Your Project
            </Link>
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="expertise-approach">
        <div className="expertise-approach-image">
          <img
            src="/images/about.webp"
            alt="Construction project showcasing quality workmanship"
          />
        </div>

        <div className="expertise-approach-content">
          <div className="expertise-approach-inner">
            <span className="expertise-eyebrow">Our Approach</span>

            <h2>
              Quality at
              <br />
              Every Stage.
            </h2>

            <p>
              Quality is not limited to the finished structure. It is part
              of every decision, every detail, and every stage of the
              construction process.
            </p>

            <p>
              We believe in a hands-on approach built on clear communication,
              responsible execution, and consistent attention to detail.
              By working closely with our clients and project teams, we aim
              to make the entire experience reliable and straightforward.
            </p>

            <Link to="/process" className="expertise-button">
              Discover Our Process
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
