import { useState, useEffect, useRef } from "react";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import api from "../../../services/api";
import useReveal from "../../../hooks/useReveal";

const fallbackTestimonials = [
  {
    quote:
      "RCC Infrastructure delivered our dream home on time with excellent quality. Their team was professional, responsive and easy to work with. Highly recommended!",
    name: "Client, Mangaluru",
    rating: 5,
    photo: "",
  },
  {
    quote:
      "The entire construction process was handled professionally. The team maintained good communication and paid attention to quality at every stage.",
    name: "Residential Client, Mangaluru",
    rating: 5,
    photo: "",
  },
  {
    quote:
      "We appreciated the team's commitment, timely updates and quality workmanship. The project was managed with care from start to finish.",
    name: "Project Client, Mangaluru",
    rating: 5,
    photo: "",
  },
];

export default function TestimonialsPreview() {
  const [items, setItems] = useState(fallbackTestimonials);
  const { ref, isVisible } = useReveal();
  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getTestimonials();
        if (data && data.length > 0) {
          const normalized = data.map((t) => ({
            ...t,
            quote: t.quote || t.text,
            name: t.name + (t.location ? `, ${t.location}` : t.role ? `, ${t.role}` : ""),
            rating: t.rating || 5,
            photo: t.photo || "",
          }));
          setItems(normalized);
        }
      } catch {
        // Fallback already in place
      }
    }
    load();
  }, []);

  // Initialize Swiper from CDN when items are ready
  useEffect(() => {
    if (!containerRef.current || typeof window.Swiper === "undefined") return;

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    swiperRef.current = new window.Swiper(containerRef.current, {
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

    const containerEl = containerRef.current;
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
  }, [items]);

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
        </div>
      </Container>
    </section>
  );
}
