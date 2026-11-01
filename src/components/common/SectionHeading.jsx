
import Container from "./Container";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}) {
  return (
    <div
      className={`section-heading section-heading-${align} ${
        light ? "section-heading-light" : ""
      } ${className}`.trim()}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h2 className="heading">{title}</h2>

      {description && <p className="section-heading-description">{description}</p>}
    </div>
  );
}
