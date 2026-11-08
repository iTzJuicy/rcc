import { useState } from "react";

export default function HowToUse({
  title = "How to use this page",
  tips = [],
}) {
  const [isOpen, setIsOpen] = useState(true);

  if (!tips.length) return null;

  return (
    <section className="admin-how-to-use-card" aria-label={title}>
      <button
        type="button"
        className="admin-how-to-use-header"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className="admin-how-to-use-title">
          <i className="fa-solid fa-circle-info" aria-hidden="true" />
          {title}
        </span>
        <span className="admin-how-to-use-toggle" aria-hidden="true">
          <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`} />
        </span>
      </button>
      {isOpen && (
        <ul className="admin-how-to-use-list">
          {tips.map((tip, index) => (
            <li key={`${tip}-${index}`}>{tip}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
