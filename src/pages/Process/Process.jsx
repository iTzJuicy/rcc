import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import ContactCTA from "../../components/sections/home/ContactCTA";
import SEO from "../../components/common/SEO";
import { CONTENT_FALLBACKS, useSiteContent } from "../../hooks/useSiteContent";
import "../../styles/process.css";

export default function Process() {
  const { content } = useSiteContent();
  const defaults = CONTENT_FALLBACKS.process;
  const saved = content?.process || {};
  const process = {
    ...defaults,
    ...saved,
    hero: { ...defaults.hero, ...saved.hero },
    overview: { ...defaults.overview, ...saved.overview },
    support: { ...defaults.support, ...saved.support },
    promise: { ...defaults.promise, ...saved.promise },
    faq: { ...defaults.faq, ...saved.faq },
  };
  const steps = Array.isArray(process.steps) ? process.steps : [];
  const supportItems = Array.isArray(process.support.items) ? process.support.items : [];
  const promiseItems = Array.isArray(process.promise.items) ? process.promise.items : [];
  const faqs = Array.isArray(content?.faqs) && content.faqs.length > 0
    ? content.faqs.map((item) => ({ q: item.question, a: item.answer }))
    : [];

  return (
    <>
      <SEO title="Our Process" description="Learn how RCC Infrastructure plans, manages, and delivers construction projects." />
      <PageHero
        pageKey="process"
        eyebrow={process.hero.eyebrow}
        title={process.hero.title}
        description={process.hero.description}
        breadcrumb={[{ label: "Home", to: "/" }, { label: process.hero.title }]}
      />

      <section className="prc-overview">
        <Container>
          <header className="prc-heading">
            <p className="prc-eyebrow">{process.overview.eyebrow}</p>
            <h2 className="prc-title">{process.overview.title}</h2>
            <p className="prc-lead">{process.overview.description}</p>
          </header>
          <ol className="prc-timeline">
            {steps.map((step, index) => {
              const number = String(index + 1).padStart(2, "0");
              return (
                <li className="prc-timeline-item" key={step.id || index}>
                  <a href={`#step-${number}`}>
                    <span className="prc-timeline-number">{number}</span>
                    <strong>{step.title}</strong>
                    <span>{step.summary}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="prc-steps">
        <Container>
          {steps.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");
            return (
              <article
                className={`prc-step ${index % 2 === 1 ? "prc-step-reverse" : ""}`}
                id={`step-${number}`}
                key={step.id || index}
              >
                <div className="prc-step-image">
                  <img src={step.image} alt={step.title} loading="lazy" />
                </div>
                <div className="prc-step-content">
                  <p className="prc-step-label">Step {number}</p>
                  <h3>{step.title}</h3>
                  <p className="prc-step-text">{step.description}</p>
                  <div className="prc-step-lists">
                    <div>
                      <h4>What we need from you</h4>
                      <ul>
                        {(step.provide || []).map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`}><i className="fa-solid fa-check" aria-hidden="true" />{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>What you receive</h4>
                      <ul>
                        {(step.receive || []).map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`}><i className="fa-solid fa-check" aria-hidden="true" />{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="prc-step-time"><i className="fa-regular fa-clock" aria-hidden="true" />{step.timeframe}</p>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <section className="prc-support">
        <Container>
          <header className="prc-heading">
            <p className="prc-eyebrow">{process.support.eyebrow}</p>
            <h2 className="prc-title">{process.support.title}</h2>
          </header>
          <div className="prc-support-grid">
            {supportItems.map((item, index) => (
              <article className="prc-support-card" key={item.id || index}>
                <div className="prc-support-top">
                  <span className="prc-support-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="prc-support-line" />
                </div>
                <h3>{item.title}</h3>
                <p className="prc-support-description">{item.description}</p>
                <ul className="prc-support-points">
                  {(item.points || []).map((point, pointIndex) => (
                    <li key={`${point}-${pointIndex}`}><i className="fa-solid fa-check" aria-hidden="true" />{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="prc-expect">
        <Container>
          <header className="prc-heading prc-heading-light">
            <p className="prc-eyebrow">{process.promise.eyebrow}</p>
            <h2 className="prc-title">{process.promise.title}</h2>
          </header>
          <ul className="prc-expect-grid">
            {promiseItems.map((item, index) => (
              <li className="prc-expect-item" key={item.id || index}>
                <span className="prc-expect-icon"><i className={`fa-solid ${item.icon}`} aria-hidden="true" /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="prc-faq">
        <Container className="prc-faq-container">
          <header className="prc-faq-intro">
            <p className="prc-eyebrow">{process.faq.eyebrow}</p>
            <h2 className="prc-title">{process.faq.title}</h2>
            <p className="prc-lead">{process.faq.description}</p>
            <Link to="/contact" className="btn">
              {process.faq.buttonText}<i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </header>
          <div className="prc-faq-list">
            {faqs.map((item, index) => (
              <details className="prc-faq-item" key={item.q || index}>
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
