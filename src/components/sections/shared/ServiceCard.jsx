
import { Link } from "react-router-dom";
import Icon from "../../common/Icon";

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <Link
        to={`/services/${service.slug}`}
        className="service-card-image"
        aria-label={`View ${service.title}`}
      >
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
        />
      </Link>

      <div className="service-card-content">
        <h3 className="service-card-title">
          <Link to={`/services/${service.slug}`}>
            {service.title}
          </Link>
        </h3>

        <Link
          to={`/services/${service.slug}`}
          className="service-card-link"
          aria-label={`View ${service.title}`}
        >
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </article>
  );
}
