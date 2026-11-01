
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import ServiceCard from "../shared/ServiceCard";
import services from "../../../data/services";

export default function ServicesPreview() {
  const featuredServices = services.slice(0, 7);

  return (
    <section className="section services-preview" id="services">
      <Container className="services-preview-container">
        <div className="services-preview-intro">
          <p className="eyebrow">
            Our Services
            <span className="services-eyebrow-line" />
          </p>

          <h2 className="services-preview-title">
            Comprehensive
            <br />
            Construction &
            <br />
            Development Solutions.
          </h2>

          <p className="services-preview-description">
            From residential spaces to large-scale infrastructure, we deliver
            end-to-end construction solutions with expertise, innovation and
            reliability.
          </p>

          <Link to="/services" className="services-view-all">
            <span>View All Services</span>
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <div className="services-preview-content">
          <div className="services-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
