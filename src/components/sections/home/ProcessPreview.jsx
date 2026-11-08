
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import useReveal from "../../../hooks/useReveal";

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description: "Understanding your needs",
  },
  {
    number: "02",
    title: "Planning",
    description: "Design & approvals",
  },
  {
    number: "03",
    title: "Execution",
    description: "Quality construction",
  },
  {
    number: "04",
    title: "Handover",
    description: "On-time delivery",
  },
];

export default function ProcessPreview() {
  const { ref, isVisible } = useReveal();
  return (
    <section ref={ref} className={`process-preview ${isVisible ? "is-visible" : ""}`} id="process">
      <Container className="process-preview-container">
        <div className="process-preview-header">
          <div className="process-preview-heading">
            <p className="eyebrow">
              Our Process
              <span className="process-eyebrow-line" />
            </p>

            <h2 className="process-preview-title">
              From Vision
              <br />
              to Reality.
            </h2>
          </div>

          <div className="process-preview-summary">
            <p>
              We follow a structured and transparent process to ensure quality
              construction and timely delivery in every project we undertake.
            </p>
          </div>

          <Link to="/process" className="process-preview-button">
            <span>Our Process</span>
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="process-timeline">
          <div className="process-timeline-track" />

          {processSteps.map((step, index) => (
            <div className="process-step reveal-item" style={{ "--reveal-index": index }} key={step.number}>
              <span
                className={`process-step-number ${
                  index === 0 ? "active" : ""
                }`}
              >
                {step.number}
              </span>

              <div className="process-step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
