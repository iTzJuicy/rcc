
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import ContactCTA from "../../components/sections/home/ContactCTA";
import SEO from "../../components/common/SEO";

import api from "../../services/api";

const reasons = [
  { icon: "fa-shield-halved", title: "Quality Construction", description: "Built to last with the highest standards." },
  { icon: "fa-users", title: "Experienced Team", description: "A skilled and dedicated project team." },
  { icon: "fa-layer-group", title: "End-to-End Solutions", description: "From planning to handover." },
  { icon: "fa-leaf", title: "Sustainable Approach", description: "Responsible building for a better tomorrow." },
];

const processSteps = [
  { number: "01", icon: "fa-comments", title: "Consultation", description: "We understand your requirements, ideas, project goals and expectations." },
  { number: "02", icon: "fa-compass-drafting", title: "Planning & Design", description: "We develop a clear project approach with thoughtful planning and coordination." },
  { number: "03", icon: "fa-helmet-safety", title: "Execution", description: "Our team focuses on quality workmanship, coordination and project progress." },
  { number: "04", icon: "fa-flag-checkered", title: "Handover", description: "We complete the project with attention to detail and a focus on your satisfaction." },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.getServices().then((items) => {
      if (active) setServices(items);
    }).catch((loadError) => {
      if (!active) return;
      console.error("Failed to load services.", loadError);
      setError("Services are temporarily unavailable. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <>
      <SEO title="Our Services" description="Explore RCC Infrastructure's construction and development services in Mangaluru." />
      <PageHero
        pageKey="services"
        eyebrow="What We Do"
        title="Our Services"
        description="Comprehensive construction solutions delivered with quality, precision, and care."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />

      {/* ===== SERVICES LIST ===== */}
      <section className="svc-list" id="all-services">
        <Container>
          <header className="svc-heading">
            <p className="svc-eyebrow"><span className="svc-eyebrow-line" />What We Offer</p>
            <h2 className="svc-title">
              Construction &amp; Development <span>Solutions.</span>
            </h2>
            <p className="svc-lead">
              From residential spaces to large-scale infrastructure, we deliver
              end-to-end construction solutions with expertise, innovation and
              reliability.
            </p>
          </header>

          {loading ? (
            <p role="status" aria-live="polite">Loading services...</p>
          ) : error ? (
            <div role="alert">
              <p>{error}</p>
              <button type="button" className="btn" onClick={() => setReloadKey((key) => key + 1)}>Try Again</button>
            </div>
          ) : services.length === 0 ? (
            <p>No services are currently available.</p>
          ) : (
            <div className="svc-grid">
              {services.map((service, index) => {
                const path = `/services/${service.slug ?? service.id}`;
                const text = service.shortDescription ?? service.description;

                return (
                  <article className="svc-card" key={service.id ?? service.slug ?? index}>
                    <Link to={path} className="svc-card-image" aria-label={service.title}>
                      <img src={service.image} alt={service.title} loading="lazy" />
                      <span className="svc-card-number">{String(index + 1).padStart(2, "0")}</span>
                    </Link>

                    <div className="svc-card-body">
                      <h3><Link to={path}>{service.title}</Link></h3>
                      {text && <p>{text}</p>}
                      <Link to={path} className="svc-card-link">
                        Learn More <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="svc-why">
        <Container>
          <header className="svc-heading svc-heading-light">
            <p className="svc-eyebrow"><span className="svc-eyebrow-line" />Why RCC Infrastructure</p>
            <h2 className="svc-title">
              Built on Trust. <span>Driven by Quality.</span>
            </h2>
          </header>

          <ul className="svc-why-grid">
            {reasons.map((item) => (
              <li className="svc-why-item" key={item.title}>
                <span className="svc-why-icon"><i className={`fa-solid ${item.icon}`} aria-hidden="true" /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="svc-process">
        <Container>
          <header className="svc-heading">
            <p className="svc-eyebrow"><span className="svc-eyebrow-line" />How We Work</p>
            <h2 className="svc-title">
              From Vision <span>to Reality.</span>
            </h2>
            <p className="svc-lead">
              A clear and transparent process that keeps every project on track.
            </p>
          </header>

          <ol className="svc-steps">
            {processSteps.map((step) => (
              <li className="svc-step" key={step.number}>
                <span className="svc-step-number">{step.number}</span>
                <span className="svc-step-icon"><i className={`fa-solid ${step.icon}`} aria-hidden="true" /></span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
