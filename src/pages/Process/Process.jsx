
import { Link } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import ContactCTA from "../../components/sections/home/ContactCTA";

import "../../styles/process.css";

const steps = [
  {
    number: "01",
    title: "Consultation",
    summary: "Understanding your needs",
    description:
      "We begin by listening. Through a site visit and a detailed discussion, we understand your requirements, budget and expectations so the project starts on a clear footing.",
    provide: [
      "Your ideas and requirements",
      "Site details and location",
      "Budget range and timeline",
    ],
    receive: [
      "A clear project brief",
      "Initial scope and estimate",
    ],
    timeframe: "Typically 1 to 2 weeks",
    image: "/images/card1.png",
  },
  {
    number: "02",
    title: "Planning & Design",
    summary: "Design and approvals",
    description:
      "We turn the brief into a workable plan with drawings, specifications, a schedule and a cost plan, and we coordinate the approvals the project needs.",
    provide: [
      "Feedback on drawings",
      "Approval of design and budget",
      "Required property documents",
    ],
    receive: [
      "Approved drawings and specifications",
      "Project schedule and cost plan",
    ],
    timeframe: "Typically 3 to 6 weeks",
    image: "/images/card2.png",
  },
  {
    number: "03",
    title: "Execution",
    summary: "Quality construction",
    description:
      "Our team builds with careful supervision, stage-wise quality checks and regular progress updates, so you always know where the project stands.",
    provide: [
      "Timely decisions and approvals",
      "Stage-wise site visits (optional)",
    ],
    receive: [
      "Regular progress updates",
      "Stage-wise quality inspections",
    ],
    timeframe: "Depends on project size",
    image: "/images/card3.png",
  },
  {
    number: "04",
    title: "Handover",
    summary: "On-time delivery",
    description:
      "We complete a final inspection, resolve any snags and hand over the finished project along with the documents you need.",
    provide: ["Final walkthrough and sign-off"],
    receive: [
      "Completed project and snag clearance",
      "Handover documents",
      "Post-handover support",
    ],
    timeframe: "Typically 1 to 2 weeks",
    image: "/images/card4.png",
  },
];

const support = [
  {
    number: "01",
    title: "Approvals & Documentation",
    description:
      "We guide you through site checks, design approvals, permits and agreements so nothing is missed.",
    points: [
      "Site checks and requirements",
      "Design approvals and permits",
      "Agreements and documentation",
    ],
  },
  {
    number: "02",
    title: "Quality & Progress Control",
    description:
      "Site supervision, stage-wise inspections and regular updates keep quality and progress on track.",
    points: [
      "Regular site supervision",
      "Stage-wise quality inspections",
      "Progress updates",
    ],
  },
  {
    number: "03",
    title: "Handover & After-Care",
    description:
      "A final inspection, a snag list and the documents you need, with support after completion.",
    points: [
      "Final inspection and snag list",
      "Project handover documents",
      "Post-completion support",
    ],
  },
];

const principles = [
  {
    icon: "fa-comments",
    title: "Transparent Communication",
    description: "Clear updates at every stage.",
  },
  {
    icon: "fa-calendar-check",
    title: "Timely Milestones",
    description: "Planned stages and realistic timelines.",
  },
  {
    icon: "fa-gem",
    title: "Quality Materials",
    description: "Reliable materials and workmanship.",
  },
  {
    icon: "fa-indian-rupee-sign",
    title: "Clear Costs",
    description: "No surprises in scope or pricing.",
  },
];

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "It depends on the size and type of the project. After the consultation and design stage, we share a realistic schedule for your specific project.",
  },
  {
    q: "Can I make changes during construction?",
    a: "Yes. Changes are possible, and we explain the impact on cost and timeline before anything is changed so you can decide with full information.",
  },
  {
    q: "How are payments scheduled?",
    a: "Payments are linked to project stages. We agree the structure with you in writing before work begins.",
  },
  {
    q: "Who handles approvals and permits?",
    a: "We guide you through the approvals the project requires and coordinate the documentation with you.",
  },
  {
    q: "Will I get regular updates?",
    a: "Yes. We keep you informed throughout execution with progress updates and site visits where needed.",
  },
];

export default function Process() {
  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="Our Process"
        description="A clear, structured path from your first idea to the day we hand over the keys."
        image="/images/impact.png"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Our Process" },
        ]}
      />

      {/* PROCESS OVERVIEW */}
      <section className="prc-overview">
        <Container>
          <header className="prc-heading">
            <p className="prc-eyebrow">Process Overview</p>

            <h2 className="prc-title">
              From Vision <span>to Reality.</span>
            </h2>

            <p className="prc-lead">
              We follow a structured and transparent process to ensure quality
              construction and timely delivery in every project we undertake.
            </p>
          </header>

          <ol className="prc-timeline">
            {steps.map((step) => (
              <li className="prc-timeline-item" key={step.number}>
                <a href={`#step-${step.number}`}>
                  <span className="prc-timeline-number">
                    {step.number}
                  </span>
                  <strong>{step.title}</strong>
                  <span>{step.summary}</span>
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* DETAILED PROCESS STEPS */}
      <section className="prc-steps">
        <Container>
          {steps.map((step, index) => (
            <article
              className={`prc-step ${
                index % 2 === 1 ? "prc-step-reverse" : ""
              }`}
              id={`step-${step.number}`}
              key={step.number}
            >
              <div className="prc-step-image">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                />
              </div>

              <div className="prc-step-content">
                <p className="prc-step-label">
                  Step {step.number}
                </p>

                <h3>{step.title}</h3>

                <p className="prc-step-text">
                  {step.description}
                </p>

                <div className="prc-step-lists">
                  <div>
                    <h4>What we need from you</h4>
                    <ul>
                      {step.provide.map((item) => (
                        <li key={item}>
                          <i
                            className="fa-solid fa-check"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4>What you receive</h4>
                    <ul>
                      {step.receive.map((item) => (
                        <li key={item}>
                          <i
                            className="fa-solid fa-check"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="prc-step-time">
                  <i
                    className="fa-regular fa-clock"
                    aria-hidden="true"
                  />
                  {step.timeframe}
                </p>
              </div>
            </article>
          ))}
        </Container>
      </section>

      {/* SUPPORT THROUGHOUT THE PROCESS */}
      <section className="prc-support">
        <Container>
          <header className="prc-heading">
            <p className="prc-eyebrow">Behind Every Step</p>

            <h2 className="prc-title">
              Support You Can <span>Rely On.</span>
            </h2>
          </header>

          <div className="prc-support-grid">
            {support.map((item) => (
              <article
                className="prc-support-card"
                key={item.number}
              >
                <div className="prc-support-top">
                  <span className="prc-support-number">
                    {item.number}
                  </span>
                  <span className="prc-support-line" />
                </div>

                <h3>{item.title}</h3>

                <p className="prc-support-description">
                  {item.description}
                </p>

                <ul className="prc-support-points">
                  {item.points.map((point) => (
                    <li key={point}>
                      <i
                        className="fa-solid fa-check"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* OUR PROMISE */}
      <section className="prc-expect">
        <Container>
          <header className="prc-heading prc-heading-light">
            <p className="prc-eyebrow">What To Expect</p>

            <h2 className="prc-title">
              Our Promise <span>to You.</span>
            </h2>
          </header>

          <ul className="prc-expect-grid">
            {principles.map((item) => (
              <li
                className="prc-expect-item"
                key={item.title}
              >
                <span className="prc-expect-icon">
                  <i
                    className={`fa-solid ${item.icon}`}
                    aria-hidden="true"
                  />
                </span>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      <section className="prc-faq">
        <Container className="prc-faq-container">
          <header className="prc-faq-intro">
            <p className="prc-eyebrow">FAQ</p>

            <h2 className="prc-title">
              Common <span>Questions.</span>
            </h2>

            <p className="prc-lead">
              Can&apos;t find what you are looking for? We are happy to talk
              it through.
            </p>

            <Link to="/contact" className="btn">
              Ask Us Directly
              <i
                className="fa-solid fa-arrow-right"
                aria-hidden="true"
              />
            </Link>
          </header>

          <div className="prc-faq-list">
            {faqs.map((item) => (
              <details
                className="prc-faq-item"
                key={item.q}
              >
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
