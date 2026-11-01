
import { Link, Navigate, useParams } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import ContactCTA from "../../components/sections/home/ContactCTA";

import services from "../../data/services";
import "../../styles/service-details.css";

function ServiceOverview({ service }) {
  return (
    <section className="service-details">
      <div className="service-details-container">
        <div className="service-details-main">
          <div className="service-details-inner">
            <p className="eyebrow">Service Overview</p>

            <h2 className="heading">
              Quality in Every
              <br />
              <span className="text-red">Detail.</span>
            </h2>

            <p className="service-description">
              {service.description}
            </p>

            <p className="service-description">
              We approach each project with careful planning, attention to
              workmanship, and a focus on meeting the specific requirements of
              our clients.
            </p>

            <div className="service-details-features">
              <div>
                <Icon name="check" size={18} />
                <span>Detailed project planning</span>
              </div>

              <div>
                <Icon name="check" size={18} />
                <span>Focus on quality and durability</span>
              </div>

              <div>
                <Icon name="check" size={18} />
                <span>Careful execution and coordination</span>
              </div>

              <div>
                <Icon name="check" size={18} />
                <span>Client-focused approach</span>
              </div>
            </div>

            <Link to="/contact" className="btn">
              Enquire About This Service
              <Icon name="arrowUpRight" size={18} />
            </Link>
          </div>
        </div>

        <div className="service-details-image">
          <img src={service.image} alt={service.title} />
        </div>
      </div>
    </section>
  );
}

function RelatedServices({ services }) {
  return (
    <section className="section service-details-related">
      <Container>
        <div className="service-details-related-header">
          <div>
            <p className="eyebrow">Explore More</p>

            <h2 className="heading">
              Related <span className="text-red">Services.</span>
            </h2>
          </div>

          <Link to="/services" className="service-details-back">
            All Services
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <div className="service-details-related-grid">
          {services.map((item) => (
            <Link
              to={`/services/${item.slug}`}
              className="service-details-related-card"
              key={item.id}
            >
              <img src={item.image} alt={item.title} loading="lazy" />

              <div>
                <h3>{item.title}</h3>
                <Icon name="arrowUpRight" size={18} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function ServiceDetails() {
  const { slug } = useParams();

  const service = services.find((item) => item.slug === slug);

  if (!service) return <Navigate to="/services" replace />;

  const otherServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={service.title}
        description={service.description}
        image={service.image}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.title },
        ]}
      />

      <ServiceOverview service={service} />

      <RelatedServices services={otherServices} />

      <ContactCTA />
    </>
  );
}
