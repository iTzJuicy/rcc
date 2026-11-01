
import Container from "../../common/Container";

const impactStats = [
  {
    value: "10+",
    label: "Years of Experience",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 7h2M9 11h2M9 15h2M14 7h1M14 11h1M14 15h1M9 21v-3h6v3" />
      </svg>
    ),
  },
  {
    value: "50+",
    label: "Projects Completed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 7h2M9 11h2M9 15h2M14 7h1M14 11h1M14 15h1" />
      </svg>
    ),
  },
  {
    value: "30+",
    label: "Happy Clients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Commitment to Quality",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export default function Impact() {
  return (
    <section
      className="impact"
      style={{ backgroundImage: "url('/images/impact.png')" }}
    >
      <div className="impact-overlay" />

      <Container className="impact-container">
        <div className="impact-intro">
          <p className="eyebrow">Our Impact</p>

          <h2 className="heading">
  Building
  <br />
  Progress
  <br />
  <span className="text-red">Together.</span>
</h2>
        </div>

        <div className="impact-stats">
          {impactStats.map((stat) => (
            <div className="impact-stat" key={stat.label}>
              <div className="impact-stat-icon">
                {stat.icon}
              </div>

              <span className="impact-stat-value">
                {stat.value}
              </span>

              <p className="impact-stat-label">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
