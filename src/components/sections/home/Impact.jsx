import Container from "../../common/Container";
import AnimatedNumber from "../../common/AnimatedNumber";
import useReveal from "../../../hooks/useReveal";
import { useStats } from "../../../hooks/useStats";

const defaultIcons = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M9 11h2M9 15h2M14 7h1M14 11h1M14 15h1M9 21v-3h6v3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2M9 11h2M9 15h2M14 7h1M14 11h1M14 15h1" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
];

export default function Impact() {
  const { stats } = useStats();
  const { ref, isVisible } = useReveal();

  return (
    <section
      ref={ref}
      className={`impact ${isVisible ? "is-visible" : ""}`}
      style={{ backgroundImage: "url('/images/impact.webp')" }}
    >
      <div className="impact-overlay" />

      <Container className="impact-container">
        <div className="impact-intro">
          <p className="eyebrow">Our Impact</p>

          <h2 className="heading reveal-item">
            Building
            <br />
            Progress
            <br />
            <span className="text-red">Together.</span>
          </h2>
        </div>

        <div className="impact-stats">
          {stats.map((stat, idx) => {
            const displayValue = stat.suffix ? `${stat.value}${stat.suffix}` : stat.value;
            return (
              <div className="impact-stat reveal-item" key={stat.id || stat.label || idx} style={{ "--reveal-index": idx }}>
                <div className="impact-stat-icon">
                  {defaultIcons[idx % defaultIcons.length]}
                </div>

                <span className="impact-stat-value"><AnimatedNumber value={displayValue} /></span>

                <p className="impact-stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
