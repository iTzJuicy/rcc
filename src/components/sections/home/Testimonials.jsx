import { useState, useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import api from "../../../services/api";
import useReveal from "../../../hooks/useReveal";

export default function TestimonialsPreview() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { ref, isVisible } = useReveal();
  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api.getTestimonials();
        if (data && active) {
          const normalized = data.map((t) => ({
            ...t,
            quote: t.quote || t.text,
            name: t.name + (t.location ? `, ${t.location}` : t.role ? `, ${t.role}` : ""),
            rating: t.rating || 5,
            photo: t.photo || "",
          }));
          setItems(normalized);
        }
      } catch (error) {
        if (active) {
          setLoadError(true);
          console.error("Failed to load testimonials.", error);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Initialize Swiper when testimonial content is ready.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (loading || !containerEl?.querySelector(".swiper-wrapper")) return;

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    swiperRef.current = new Swiper(containerEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: items.length > 1,
      speed: 450,
      preventClicks: true,
      preventClicksPropagation: true,
      autoHeight: false,
      watchOverflow: true,
    });

    const handleContainerClick = (e) => {
      const prevBtn = e.target.closest('[data-control="prev"]');
      const nextBtn = e.target.closest('[data-control="next"]');
      if (prevBtn) {
        e.preventDefault();
        e.stopPropagation();
        swiperRef.current?.slidePrev();
      } else if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();
        swiperRef.current?.slideNext();
      }
    };

    containerEl.addEventListener("click", handleContainerClick);

    return () => {
      containerEl.removeEventListener("click", handleContainerClick);
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [items, loading]);

  const handlePrev = (e) => {
    e?.preventDefault?.();
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section ref={ref} className={`testimonials-preview ${isVisible ? "is-visible" : ""}`} id="testimonials">
      <div className="testimonials-preview-image">
        <img
          src="/images/card1.webp"
          alt="Completed residential project by RCC Infrastructure"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/card1.webp";
          }}
        />
      </div>

      <Container className="testimonials-preview-container">
        <div className="testimonials-preview-heading reveal-item">
          <p className="eyebrow">
            Client Testimonials
          </p>

          <h2>
            What Our
            <br />
            Clients Say.
          </h2>
        </div>

        {/* Swiper Slider Wrapper (Design unchanged) */}
        <div className="swiper testimonials-swiper" ref={containerRef}>
          {loadError ? (
            <p role="alert">Testimonials are temporarily unavailable.</p>
          ) : loading ? (
            <div className="testimonial-loading-card" role="status" aria-label="Loading testimonials">
              <span className="testimonial-loading-mark" />
              <div className="testimonial-loading-content">
                <span className="testimonial-loading-line" />
                <span className="testimonial-loading-line" />
                <span className="testimonial-loading-line short" />
                <div className="testimonial-loading-footer">
                  <span className="testimonial-loading-avatar" />
                  <span className="testimonial-loading-name" />
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <p>No testimonials are currently available.</p>
          ) : (
          <div className="swiper-wrapper">
            {items.map((testimonial, idx) => (
              <div className="swiper-slide" key={testimonial._id || idx}>
                <article className="testimonial-card">
                  <div className="testimonial-quote-mark" aria-hidden="true">
                    “
                  </div>

                  <div className="testimonial-card-content">
                    <p className="testimonial-quote">{testimonial.quote}</p>

                    <div className="testimonial-card-footer">
                      <div className="testimonial-avatar" aria-hidden="true">
                        {testimonial.photo ? (
                          <img
                            src={testimonial.photo}
                            alt={testimonial.name}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              if (e.target.nextElementSibling) {
                                e.target.nextElementSibling.style.display = "block";
                              }
                            }}
                          />
                        ) : null}
                        <svg
                          viewBox="0 0 40 40"
                          fill="none"
                          style={{ display: testimonial.photo ? "none" : "block" }}
                        >
                          <circle cx="20" cy="20" r="20" fill="#DCE0E2" />
                          <circle cx="20" cy="14" r="7" fill="#182A34" />
                          <path
                            d="M7 36c0-8 5.8-13 13-13s13 5 13 13"
                            fill="#182A34"
                          />
                        </svg>
                      </div>

                      <div className="testimonial-client">
                        <h3>{testimonial.name}</h3>

                        <div
                          className="testimonial-stars"
                          aria-label={`${testimonial.rating} out of 5 stars`}
                        >
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>

                      <div className="testimonial-controls">
                        <button
                          type="button"
                          className="testimonial-control"
                          data-control="prev"
                          onClick={handlePrev}
                          aria-label="Previous testimonial"
                        >
                          <Icon name="arrowLeft" size={17} />
                        </button>

                        <button
                          type="button"
                          className="testimonial-control"
                          data-control="next"
                          onClick={handleNext}
                          aria-label="Next testimonial"
                        >
                          <Icon name="arrowRight" size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
          )}
        </div>
      </Container>
    </section>
  );
}
