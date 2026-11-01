
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

const highlights = [
  {
    title: "Quality",
    subtitle: "Assurance",
    icon: "quality",
  },
  {
    title: "On-Time",
    subtitle: "Delivery",
    icon: "delivery",
  },
  {
    title: "Modern",
    subtitle: "Infrastructure",
    icon: "infrastructure",
  },
];

function HighlightIcon({ type }) {
  if (type === "quality") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M24 4 39 10V21C39 31 32.5 39 24 43 15.5 39 9 31 9 21V10L24 4Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="m16 23 5.5 5.5L32 17"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 11h14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "delivery") {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle
          cx="24"
          cy="25"
          r="16"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M24 15V25L31 29"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 4h12M24 4v5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="m17 36 4 4 10-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M5 42h38M9 42V18H21V42M27 42V7H39V42"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M13 23h4M13 29h4M13 35h4M31 13h4M31 20h4M31 27h4M31 34h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m22 12 3-5 3 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="why-choose-us-image">
        <img
          src="/images/card4.png"
          alt="Construction professionals working on a project"
          loading="lazy"
        />
      </div>

      <Container className="why-choose-us-container">
        <div className="why-choose-us-content">
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
          {highlights.map((item) => (
            <div className="why-choose-us-highlight" key={item.icon}>
              <span className="why-choose-us-icon">
                <HighlightIcon type={item.icon} />
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
