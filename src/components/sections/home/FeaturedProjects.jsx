import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import api from "../../../services/api";
import useReveal from "../../../hooks/useReveal";

const initialProjects = [
  {
    id: 1,
    title: "Residential Apartments",
    category: "Residential",
    status: "Completed",
    location: "Mangaluru",
    image: "/images/card1.webp",
    slug: "residential-apartments",
  },
  {
    id: 2,
    title: "Commercial Complex",
    category: "Commercial",
    status: "Ongoing",
    location: "Mangaluru",
    image: "/images/card2.webp",
    slug: "commercial-complex",
  },
  {
    id: 3,
    title: "Infrastructure Project",
    category: "Infrastructure",
    status: "Ongoing",
    location: "Mangaluru",
    image: "/images/impact.webp",
    slug: "infrastructure-project",
  },
  {
    id: 4,
    title: "Villa Project",
    category: "Residential",
    status: "Upcoming",
    location: "Mangaluru",
    image: "/images/card4.webp",
    slug: "villa-project",
  },
];

const filters = ["All", "Residential", "Commercial", "Renovation", "Construction"];
const projectStatusOrder = { upcoming: 0, planned: 0, ongoing: 1, completed: 2 };

export default function FeaturedProjects() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterChanging, setFilterChanging] = useState(false);
  const { ref, isVisible } = useReveal();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProjects({ limit: 12 });
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((p) => ({
            id: p.id || p._id,
            title: p.title,
            category: p.category || "Residential",
            status: p.status || "Completed",
            location: p.location || "Mangaluru",
            image: p.coverImage || p.image || "/images/card1.webp",
            slug: p.slug || String(p.id || p._id),
            featured: p.featured,
          }));
          setProjectList(normalized);
        }
      } catch {
        // Fallback already initialized
      }
    }
    load();
  }, []);

  const filteredProjects = [...projectList]
    .sort((a, b) => {
      const aOrder = projectStatusOrder[a.status?.toLowerCase()] ?? 3;
      const bOrder = projectStatusOrder[b.status?.toLowerCase()] ?? 3;
      return aOrder - bOrder;
    })
    .filter((project) => {
      if (activeFilter === "All") return true;
      return project.category.toLowerCase() === activeFilter.toLowerCase();
    })
    .slice(0, 4);

  const changeFilter = (filter) => {
    setFilterChanging(true);
    setActiveFilter(filter);
    window.setTimeout(() => setFilterChanging(false), 80);
  };

  return (
    <section ref={ref} className={`featured-projects ${isVisible ? "is-visible" : ""}`}>
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
                onClick={() => changeFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className={`featured-projects-grid ${filterChanging ? "filter-changing" : ""}`}>
            {filteredProjects.map((project, idx) => (
              <article className="featured-project-card reveal-item" style={{ "--reveal-index": idx }} key={`${activeFilter}-${project.id}`}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="featured-project-image"
                  aria-label={`View ${project.title}`}
                >
                  <img src={project.image} alt={project.title} loading="lazy" />

                  <span
                    className={`featured-project-status status-${(project.status || "completed").toLowerCase()}`}
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
