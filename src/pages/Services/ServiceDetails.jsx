import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import Lightbox from "../../components/common/Lightbox";
import SEO from "../../components/common/SEO";
import ContactCTA from "../../components/sections/home/ContactCTA";

import staticServices from "../../data/services";
import api from "../../services/api";
import "../../styles/service-details.css";

function ServiceOverview({ service, onOpenLightbox }) {
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

            <p className="service-description">{service.description}</p>

            {service.longDescription && (
              <p className="service-description">{service.longDescription}</p>
            )}

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

        <div
          className="service-details-image"
          onClick={() => onOpenLightbox(0)}
          style={{ cursor: "zoom-in" }}
          title="Click to view full image in lightbox"
        >
          <img src={service.image} alt={service.title} />
          <div className="project-image-badge">
            <Icon name="eye" size={16} /> Click to expand
          </div>
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
              to={`/services/${item.slug || item.id}`}
              className="service-details-related-card"
              key={item.id || item.slug}
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
  const [service, setService] = useState(() =>
    staticServices.find((item) => item.slug === slug || String(item.id) === String(slug))
  );
  const [allServices, setAllServices] = useState(staticServices);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const found = await api.getServiceBySlug(slug);
        if (found) setService(found);
        const list = await api.getServices();
        if (list) setAllServices(list);
      } catch (e) {
        console.warn("Using fallback service lookup:", e.message);
      }
    }
    load();
  }, [slug]);

  if (!service) return <Navigate to="/services" replace />;

  const otherServices = allServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  // Gallery array
  const galleryImages =
    service.gallery && service.gallery.length > 0
      ? service.gallery
      : [
          service.image,
          "/images/card1.webp",
          "/images/card2.webp",
          "/images/impact.webp",
        ].filter(Boolean);

  return (
    <>
      <SEO
        title={service.title}
        description={service.description}
        ogImage={service.image}
      />

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

      <ServiceOverview
        service={service}
        onOpenLightbox={(idx) => {
          setLightboxIndex(idx);
          setLightboxOpen(true);
        }}
      />

      {/* Service Gallery */}
      {galleryImages.length > 0 && (
        <section className="section project-gallery-section">
          <Container>
            <div className="project-gallery-header">
              <div>
                <p className="eyebrow text-red" style={{ color: "var(--red)", fontWeight: 700 }}>
                  Work in Action
                </p>
                <h2 className="heading">
                  Service <span className="text-red">Gallery.</span>
                </h2>
              </div>
              <p className="project-gallery-hint">Click any photo to expand.</p>
            </div>

            <div className="project-gallery-grid">
              {galleryImages.map((imgUrl, idx) => {
                const url = typeof imgUrl === "string" ? imgUrl : imgUrl?.url;
                return (
                  <div
                    className="project-gallery-item"
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                      src={url}
                      alt={`${service.title} photo ${idx + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/card2.webp";
                      }}
                    />
                    <div className="project-gallery-hover">
                      <Icon name="eye" size={24} />
                      <span>View Photo</span>
                      </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      <RelatedServices services={otherServices} />

      <ContactCTA />
    </>
  );
}
