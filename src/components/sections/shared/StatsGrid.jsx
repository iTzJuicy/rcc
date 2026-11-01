
export default function StatsGrid({ statistics = [], className = "" }) {
  return (
    <div className={`stats-grid ${className}`.trim()}>
      {statistics.map((stat, index) => (
        <div className="stats-grid-item" key={`${stat.label}-${index}`}>
          <span className="stats-grid-value">{stat.value}</span>
          <p className="stats-grid-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
