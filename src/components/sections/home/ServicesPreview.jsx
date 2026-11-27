import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import ServiceCard from "../shared/ServiceCard";
import api from "../../../services/api";
import useReveal from "../../../hooks/useReveal";

export default function ServicesPreview() {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { ref, isVisible } = useReveal();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/public/services?homeOnly=true");
        if (Array.isArray(res?.data)) setServicesList(res.data.slice(0, 4));
      } catch (error) {
        setLoadError(true);
        console.error("Failed to load homepage services.", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featuredServices = servicesList.slice(0, 4);

  return (
    <section ref={ref} className={`section services-preview ${isVisible ? "is-visible" : ""}`} id="services">
      <Container className="services-preview-container">
        <div className="services-preview-intro reveal-item">
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

          <Link to="/services" className="services-view-all reveal-item">
            <span>View All Services</span>
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <div className="services-preview-content">
          <div className="services-grid">
            {loadError ? (
              <p role="alert">Services are temporarily unavailable.</p>
            ) : loading ? (
              <p role="status" aria-live="polite">Loading services...</p>
            ) : featuredServices.map((service, idx) => (
              <div className="reveal-item" style={{ "--reveal-index": idx }} key={service.id || service._id || service.slug}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
