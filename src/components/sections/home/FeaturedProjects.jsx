import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Icon from "../../common/Icon";
import api from "../../../services/api";
import useReveal from "../../../hooks/useReveal";

const preferredFilterOrder = ["Residential", "Commercial", "Renovation", "Construction"];
const projectStatusOrder = { upcoming: 0, planned: 0, ongoing: 1, completed: 2 };

export default function FeaturedProjects() {
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [filterChanging, setFilterChanging] = useState(false);
  const { ref, isVisible } = useReveal();
  const sliderRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await api.getProjects({ limit: 12 });
        const data = res?.data || res;
        if (active && Array.isArray(data)) {
          const normalized = data.map((p) => ({
            id: p.id || p._id,
            title: p.title,
            category: p.category || "",
            status: p.status || "",
            location: p.location || "",
            image: p.coverImage || p.image || "/images/card1.webp",
            slug: p.slug || String(p.id || p._id),
            featured: p.featured,
          }));
          setProjectList(normalized);
        }
      } catch (error) {
        if (active) {
          setLoadError(true);
          console.error("Failed to load featured projects.", error);
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

  const filters = useMemo(() => {
    const usedCategories = new Map();
    for (const project of projectList) {
      const raw = (project.category || "").trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!usedCategories.has(key)) usedCategories.set(key, raw);
    }

    const ordered = [];
    for (const name of preferredFilterOrder) {
      const key = name.toLowerCase();
      if (usedCategories.has(key)) {
        ordered.push(usedCategories.get(key));
        usedCategories.delete(key);
      }
    }
    for (const remaining of usedCategories.values()) {
      ordered.push(remaining);
    }
    return ["All", ...ordered];
  }, [projectList]);

  useEffect(() => {
    if (activeFilter !== "All" && !filters.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [activeFilter, filters]);

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
    sliderRef.current?.scrollTo({ left: 0, behavior: "auto" });
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

          <div ref={sliderRef} className={`featured-projects-grid ${filterChanging ? "filter-changing" : ""}`}>
            {loadError ? (
              <p role="alert">Featured projects are temporarily unavailable.</p>
            ) : loading ? (
              Array.from({ length: 4 }, (_, idx) => (
                <div className="featured-project-card rcc-skeleton-card" key={`fp-skel-${idx}`} aria-hidden="true">
                  <div className="rcc-skeleton-media rcc-skeleton-shimmer-dark" />
                  <div className="rcc-skeleton-line rcc-skeleton-shimmer-dark" />
                  <div className="rcc-skeleton-line rcc-skeleton-line-short rcc-skeleton-shimmer-dark" />
                </div>
              ))
            ) : filteredProjects.map((project, idx) => (
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

                    {project.location && <p>
                      <span className="featured-project-location-dot" />
                      {project.location}
                    </p>}
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
