
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import useReveal from "../../../hooks/useReveal";

const highlights = [
  {
    title: "Quality",
    subtitle: "Assurance",
    iconName: "award",
  },
  {
    title: "On-Time",
    subtitle: "Delivery",
    iconName: "clock",
  },
  {
    title: "Modern",
    subtitle: "Infrastructure",
    iconName: "city",
  },
  {
    title: "Sustainable",
    subtitle: "Development",
    iconName: "leaf",
  },
];

export default function WhyChooseUs() {
  const { ref, isVisible } = useReveal();
  return (
    <section ref={ref} className={`why-choose-us ${isVisible ? "is-visible" : ""}`} id="why-choose-us">
      <div className="why-choose-us-image">
        <img
          src="/images/card4.webp"
          alt="Construction professionals working on a project"
          loading="lazy"
        />
      </div>

      <Container className="why-choose-us-container">
        <div className="why-choose-us-content reveal-item">
          <p className="eyebrow">Why Choose RCC</p>

          <h2 className="why-choose-us-title">
            Building Trust.
            <br />
            Creating the
            <br />
            <span>Future.</span>
          </h2>

          <p className="why-choose-us-description">
            We combine quality workmanship, dependable project execution and
            thoughtful planning to create spaces that stand the test of time.
          </p>

          <Link to="/about" className="why-choose-us-button">
            <span>Discover RCC</span>
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <div className="why-choose-us-highlights">
          {highlights.map((item, idx) => (
            <div className="why-choose-us-highlight reveal-item" style={{ "--reveal-index": idx }} key={item.subtitle}>
              <span className="why-choose-us-icon">
                <Icon name={item.iconName} size={32} />
              </span>

              <span className="why-choose-us-highlight-text">
                <span>{item.title}</span>
                <span>{item.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
