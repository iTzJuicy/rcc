
import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";

const projects = [
  {
    id: 1,
    title: "Residential Apartments",
    category: "Residential",
    status: "Completed",
    location: "Mangaluru",
    image: "/images/card1.png",
    slug: "residential-apartments",
  },
  {
    id: 2,
    title: "Commercial Complex",
    category: "Commercial",
    status: "Ongoing",
    location: "Mangaluru",
    image: "/images/card2.png",
    slug: "commercial-complex",
  },
  {
    id: 3,
    title: "Infrastructure Project",
    category: "Infrastructure",
    status: "Ongoing",
    location: "Mangaluru",
    image: "/images/impact.png",
    slug: "infrastructure-project",
  },
  {
    id: 4,
    title: "Villa Project",
    category: "Residential",
    status: "Upcoming",
    location: "Mangaluru",
    image: "/images/card4.png",
    slug: "villa-project",
  },
];

const filters = ["All", "Residential", "Commercial", "Infrastructure", "Ongoing"];

export default function FeaturedProjects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Ongoing") return project.status === "Ongoing";
    return project.category === activeFilter;
  });

  return (
    <section className="featured-projects">
      <Container className="featured-projects-container">
        <div className="featured-projects-intro">
          <p className="eyebrow">
            Featured Projects
            <span className="featured-projects-eyebrow-line" />
          </p>

          <h2 className="featured-projects-title">
            Real
            <br />
            Projects.
            <br />
            <span>Stronger</span>
            <br />
            <span>Communities.</span>
          </h2>

          <p className="featured-projects-description">
            A showcase of our commitment to quality and excellence across
            residential, commercial and infrastructure development in Mangaluru.
          </p>

          <Link to="/projects" className="featured-projects-all">
            <span>View All Projects</span>
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div className="featured-projects-content">
          <div className="featured-projects-filters" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`featured-project-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="featured-projects-grid">
            {filteredProjects.map((project) => (
              <article className="featured-project-card" key={project.id}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="featured-project-image"
                  aria-label={`View ${project.title}`}
                >
                  <img src={project.image} alt={project.title} loading="lazy" />

                  <span
                    className={`featured-project-status status-${project.status.toLowerCase()}`}
                  >
                    {project.status}
                  </span>
                </Link>

                <div className="featured-project-info">
                  <div className="featured-project-details">
                    <h3>{project.title}</h3>

                    <p>
                      <span className="featured-project-location-dot" />
                      {project.location}
                    </p>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="featured-project-arrow"
                    aria-label={`View ${project.title}`}
                  >
                    <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
