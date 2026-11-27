import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import Lightbox from "../../components/common/Lightbox";
import SEO from "../../components/common/SEO";
import ContactCTA from "../../components/sections/home/ContactCTA";
import Model3DViewer from "../../components/common/Model3DViewer";

import api from "../../services/api";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import "../../styles/project-details.css";
import "../../styles/model3d.css";

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const siteSettings = useSiteSettings();

  const [project, setProject] = useState(null);
  const [projectState, setProjectState] = useState("loading");
  const [allProjects, setAllProjects] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Quotation / Booking Modal & Form state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    carpetArea: "",
    budget: "",
    timeline: "1-3 Months",
    scope: "Full Construction",
    message: "",
    _gotcha: "",
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    let active = true;
    setProject(null);
    setProjectState("loading");

    async function fetchProject() {
      try {
        const found = await api.getProjectBySlug(slug);
        if (!active) return;
        setProject(found);
        setProjectState("ready");
        api.getProjects().then((res) => {
          if (active && res?.data) setAllProjects(res.data);
        }).catch((error) => {
          console.error("Failed to load related projects.", error);
        });
      } catch (error) {
        if (!active) return;
        setProjectState(error.status === 404 ? "not-found" : "error");
        if (error.status !== 404) {
          console.error("Failed to load project details.", error);
        }
      }
    }
    fetchProject();
    return () => {
      active = false;
    };
  }, [slug]);

  if (projectState === "loading") {
    return (
      <div className="project-not-found-container" role="status" aria-live="polite">
        <Container>
          <div className="detail-loading-skeleton" aria-label="Loading project details">
            <span className="detail-loading-line title" />
            <span className="detail-loading-line" />
            <span className="detail-loading-line short" />
            <span className="detail-loading-image" />
          </div>
        </Container>
      </div>
    );
  }

  if (projectState === "error") {
    return (
      <div className="project-not-found-container" role="alert">
        <Container>
          <h2>Project temporarily unavailable</h2>
          <p>We could not load this project. Please try again in a moment.</p>
          <button type="button" className="btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </Container>
      </div>
    );
  }

  if (projectState === "not-found" || !project) {
    return (
      <div className="project-not-found-container">
        <Container>
          <h2>Project Not Found</h2>
          <p>The requested project could not be located.</p>
          <Link to="/projects" className="btn">
            Back to Projects
          </Link>
        </Container>
      </div>
    );
  }

  // Related projects
  const relatedProjects = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  // Gallery images array (use gallery or fallback to main image + variants)
  const galleryImages =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [
          project.image,
          "/images/card1.webp",
          "/images/card2.webp",
          "/images/card3.webp",
        ].filter(Boolean);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (quoteForm._gotcha) return;
    setSubmittingQuote(true);
    setQuoteError("");

    try {
      const response = await api.submitEnquiry({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        location: quoteForm.location,
        carpetArea: quoteForm.carpetArea,
        budget: quoteForm.budget,
        timeline: quoteForm.timeline,
        projectType: quoteForm.scope,
        subject: `Quotation Request - ${project.title}`,
        message: quoteForm.message,
        projectTitle: project.title,
        projectSlug: project.slug,
        _gotcha: quoteForm._gotcha,
      });

      navigate("/thank-you", {
        state: {
          title: "Quotation Request Submitted",
          message: response?.notificationSent === false
            ? `Your request for ${project.title} has been recorded, but email confirmation is temporarily unavailable. Please use the contact details on this page if it is urgent.`
            : `Thank you for your interest in ${project.title}. Our estimation team has received your inquiry and will contact you with a preliminary consultation proposal.`,
        },
      });
    } catch (err) {
      setQuoteError(
        err.message || "Failed to submit quote request. Please retry or contact our office directly."
      );
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <>
      <SEO
        title={project.title}
        description={project.description}
        ogImage={project.image}
      />

      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.description}
        image={project.bannerImage || undefined}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Projects", to: "/projects" },
          { label: project.title },
        ]}
      />

      {/* Project Overview */}
      <section className="project-details">
        <div className="project-details-container">
          <div className="project-details-main">
            <div className="project-details-inner">
              <p className="eyebrow">Project Overview</p>

              <h2 className="heading">
                Built With Purpose.
                <br />
                <span className="text-red">Made to Last.</span>
              </h2>

              <p className="project-description">{project.description}</p>

              <p className="project-description">
                Every project requires thoughtful planning, effective
                coordination, and attention to detail. Our approach focuses on
                delivering work that aligns with the project's requirements and
                quality expectations.
              </p>

              <div className="project-details-info">
                <div>
                  <span>Project Category</span>
                  <strong>{project.category}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{project.location || "Mangalore, Karnataka"}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{project.status || "Completed"}</strong>
                </div>

                {project.area && (
                  <div>
                    <span>Built-up Area</span>
                    <strong>{project.area}</strong>
                  </div>
                )}

                {project.client && (
                  <div>
                    <span>Client</span>
                    <strong>{project.client}</strong>
                  </div>
                )}
              </div>

              <div className="project-details-cta-group">
                {project.showQuotationButton !== false && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setQuoteModalOpen(true)}
                  >
                    Request Quotation / Booking
                    <Icon name="arrowUpRight" size={18} />
                  </button>
                )}
                {isHttpUrl(project.mapUrl) && (
                  <a
                    href={project.mapUrl}
                    className="btn btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Maps
                    <Icon name="arrowUpRight" size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div
            className="project-details-image"
            onClick={() => openLightbox(0)}
            title="Click to view full image in lightbox"
            style={{ cursor: "zoom-in" }}
          >
            <img src={project.image} alt={project.title} />
            <div className="project-image-badge">
              <Icon name="eye" size={16} /> Click to expand
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery & Lightbox */}
      {galleryImages.length > 0 && (
        <section className="section project-gallery-section">
          <Container>
            <div className="project-gallery-header">
              <div>
                <p className="eyebrow">Visual Tour</p>
                <h2 className="heading">
                  Project <span className="text-red">Gallery.</span>
                </h2>
              </div>
              <p className="project-gallery-hint">Click any photo to expand.</p>
            </div>

            <div className="project-gallery-slider">
              {galleryImages.map((imgUrl, idx) => {
                const url = typeof imgUrl === "string" ? imgUrl : imgUrl?.url;
                return (
                  <div
                    className="project-gallery-item"
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                        src={url}
                        alt={`${project.title} photo ${idx + 1}`}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/card1.webp";
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

      {/* Lightbox Component */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* 3D Building Model Section */}
      {(project.model3dUrl || project.model3dTemplate) && (() => {
        return (
          <section className="project-model3d-section">
            <div className="project-model3d-viewer-wrap">
              <div className="project-model3d-canvas">
                <Model3DViewer
                  modelUrl={project.model3dUrl || ""}
                  template={project.model3dTemplate || ""}
                  fallbackImageUrl={project.image || ""}
                  projectTitle={project.title}
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* Quotation Request Modal */}
      {quoteModalOpen && project.showQuotationButton !== false && (
        <div
          className="modal-backdrop"
          onClick={() => setQuoteModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow text-red">Quotation & Booking</span>
                <h3>Request Quote for {project.title}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setQuoteModalOpen(false)}
                aria-label="Close modal"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {quoteError && (
              <div
                style={{
                  margin: "12px 0 16px",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  fontSize: "13px",
                }}
              >
                <p style={{ margin: "0 0 6px", fontWeight: "600" }}>{quoteError}</p>
                <p style={{ margin: 0, fontSize: "12px" }}>
                  Or reach us directly at{" "}
                  {siteSettings.phone && <a href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, "")}`} style={{ textDecoration: "underline", color: "#b91c1c" }}>
                    {siteSettings.phone}
                  </a>}
                  {siteSettings.phone && siteSettings.socialLinks?.whatsapp && " / "}
                  {siteSettings.socialLinks?.whatsapp && <a
                    href={siteSettings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline", color: "#16a34a", fontWeight: "600" }}
                  >
                    WhatsApp
                  </a>}
                  {!siteSettings.phone && !siteSettings.socialLinks?.whatsapp && "Please retry submitting your request."}
                </p>
              </div>
            )}

            <form onSubmit={handleQuoteSubmit} className="modal-form">
              {/* Honeypot */}
              <div style={{ display: "none" }} aria-hidden="true">
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex="-1"
                  autoComplete="off"
                  value={quoteForm._gotcha}
                  onChange={handleQuoteChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quote-name">Your Full Name *</label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  value={quoteForm.name}
                  onChange={handleQuoteChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label htmlFor="quote-email">Email Address *</label>
                  <input
                    id="quote-email"
                    type="email"
                    name="email"
                    value={quoteForm.email}
                    onChange={handleQuoteChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quote-phone">Phone Number *</label>
                  <input
                    id="quote-phone"
                    type="tel"
                    name="phone"
                    value={quoteForm.phone}
                    onChange={handleQuoteChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label htmlFor="quote-location">Project Location</label>
                  <input
                    id="quote-location"
                    type="text"
                    name="location"
                    value={quoteForm.location}
                    onChange={handleQuoteChange}
                    placeholder="e.g. Mangaluru, Udupi"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quote-carpet">Approx. Area (Sq.Ft)</label>
                  <input
                    id="quote-carpet"
                    type="text"
                    name="carpetArea"
                    value={quoteForm.carpetArea}
                    onChange={handleQuoteChange}
                    placeholder="e.g. 2,400 sq.ft"
                  />
                </div>
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label htmlFor="quote-scope">Project Scope</label>
                  <select
                    id="quote-scope"
                    name="scope"
                    value={quoteForm.scope}
                    onChange={handleQuoteChange}
                  >
                    <option value="Full Construction">Full Construction & Turnkey</option>
                    <option value="Structural Civil Works">Structural & Civil Works</option>
                    <option value="Renovation & Remodelling">Renovation & Remodelling</option>
                    <option value="Consultation & Planning">Design & Consultation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quote-budget">Estimated Budget</label>
                  <select
                    id="quote-budget"
                    name="budget"
                    value={quoteForm.budget}
                    onChange={handleQuoteChange}
                  >
                    <option value="">Select budget range...</option>
                    <option value="Under ₹25 Lakhs">Under ₹25 Lakhs</option>
                    <option value="₹25 - ₹50 Lakhs">₹25 - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                    <option value="₹1 - ₹3 Crores">₹1 - ₹3 Crores</option>
                    <option value="Above ₹3 Crores">Above ₹3 Crores</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quote-message">Project Notes / Requirements *</label>
                <textarea
                  id="quote-message"
                  name="message"
                  rows="4"
                  value={quoteForm.message}
                  onChange={handleQuoteChange}
                  placeholder="Tell us about your project location, approximate plot/carpet area, and anticipated schedule..."
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setQuoteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={submittingQuote}
                >
                  {submittingQuote ? "Submitting..." : "Submit Quote Request"}
                  <Icon name="arrowUpRight" size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Projects */}
      <section className="section project-details-related">
        <Container>
          <div className="project-details-related-header">
            <div>
              <p className="eyebrow">Discover More</p>
              <h2 className="heading">
                Related <span className="text-red">Projects.</span>
              </h2>
            </div>

            <Link to="/projects" className="project-details-view-all">
              View All Projects
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>

          <div className="projects-grid">
            {relatedProjects.map((item) => (
              <article className="project-card" key={item.id || item.slug}>
                <Link
                  to={`/projects/${item.slug}`}
                  className="project-card-image"
                >
                  <img src={item.image} alt={item.title} loading="lazy" />
                </Link>

                <div className="project-card-content">
                  <h3>
                    <Link to={`/projects/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
