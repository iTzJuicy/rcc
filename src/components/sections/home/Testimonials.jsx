
import { useState } from "react";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

const testimonials = [
  {
    quote:
      "RCC Infrastructure delivered our dream home on time with excellent quality. Their team was professional, responsive and easy to work with. Highly recommended!",
    name: "Client, Mangaluru",
    rating: 5,
  },
  {
    quote:
      "The entire construction process was handled professionally. The team maintained good communication and paid attention to quality at every stage.",
    name: "Residential Client, Mangaluru",
    rating: 5,
  },
  {
    quote:
      "We appreciated the team's commitment, timely updates and quality workmanship. The project was managed with care from start to finish.",
    name: "Project Client, Mangaluru",
    rating: 5,
  },
];

export default function TestimonialsPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];

  const previousTestimonial = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const nextTestimonial = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section className="testimonials-preview" id="testimonials">
      <div className="testimonials-preview-image">
        <img
          src="/images/card1.png"
          alt="Completed residential project by RCC Infrastructure"
          loading="lazy"
        />
      </div>

      <Container className="testimonials-preview-container">
        <div className="testimonials-preview-heading">
          <p className="eyebrow">
            Client Testimonials
          </p>

          <h2>
            What Our
            <br />
            Clients Say.
          </h2>
        </div>

        <article className="testimonial-card">
          <div className="testimonial-quote-mark" aria-hidden="true">
            “
          </div>

          <div className="testimonial-card-content">
            <p className="testimonial-quote">{testimonial.quote}</p>

            <div className="testimonial-card-footer">
              <div className="testimonial-avatar" aria-hidden="true">
                <svg viewBox="0 0 40 40" fill="none">
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
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              <div className="testimonial-controls">
                <button
                  type="button"
                  className="testimonial-control"
                  onClick={previousTestimonial}
                  aria-label="Previous testimonial"
                >
                 <Icon name="arrowLeft" size={17} />
                </button>

                <button
                  type="button"
                  className="testimonial-control"
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                >
                  <Icon name="arrowRight" size={17} />
                </button>
              </div>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}
