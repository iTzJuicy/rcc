
import { Link } from "react-router-dom";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumb = [],
  className = "",
}) {
  return (
    <section
      className={`page-hero ${className}`.trim()}
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
    >
      <div className="page-hero-overlay" />

      <div className="container page-hero-container">
        {breadcrumb.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`}>
                {index > 0 && <span className="breadcrumb-separator"> / </span>}

                {item.to && index !== breadcrumb.length - 1 ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span aria-current="page">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h1>{title}</h1>

        {description && <p className="page-hero-description">{description}</p>}
      </div>
    </section>
  );
}
