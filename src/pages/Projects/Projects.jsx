import { useState, useEffect, useMemo } from "react";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import ProjectCard from "../../components/sections/shared/ProjectCard";
import ContactCTA from "../../components/sections/home/ContactCTA";
import Icon from "../../components/common/Icon";
import SEO from "../../components/common/SEO";
import api from "../../services/api";
import staticProjects from "../../data/projects";
import "../../styles/projects.css";

const PAGE_SIZE = 6;
const STATUS_OPTIONS = ["All", "Completed", "Ongoing", "Upcoming"];

export default function Projects() {
  const [projectList, setProjectList] = useState(staticProjects);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [categoryChips, setCategoryChips] = useState(["All"]);

  useEffect(() => {
    async function load() {
      try {
        const [resProjects, resCats] = await Promise.all([
          api.getProjects(),
          api.get("/public/categories?activeOnly=true"),
        ]);

        if (resProjects?.data && resProjects.data.length > 0) {
          setProjectList(resProjects.data);
        }

        if (resCats?.data && Array.isArray(resCats.data)) {
          const names = resCats.data.map((c) => c.name);
          setCategoryChips(["All", ...names]);
        }
      } catch (err) {
        console.warn("Using local project list:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(() => {
    if (categoryChips.length > 1) return categoryChips;
    const set = new Set(projectList.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [categoryChips, projectList]);

  const filteredProjects = useMemo(() => {
    return projectList.filter((project) => {
      const matchCat =
        activeCategory === "All" ||
        project.category?.toLowerCase() === activeCategory.toLowerCase();

      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        project.title?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.location?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [projectList, activeCategory, searchTerm]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchTerm("");
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <>
      <SEO
        title="Our Projects"
        description="Browse RCC Infrastructure's portfolio of residential, commercial, renovation, and civil construction projects across Mangalore and Karnataka."
      />

      <PageHero
        pageKey="projects"
        eyebrow="Our Portfolio"
        title="Featured Projects"
        description="Explore our construction work and the principles of quality, planning, and execution behind every project."
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Projects" },
        ]}
      />

      <section className="section projects-page">
        <Container>
          <div className="projects-page-header">
            <SectionHeading
              eyebrow="Our Work"
              title={
                <>
                  Projects That Reflect
                  <br />
                  <span className="text-red">Our Commitment.</span>
                </>
              }
              description="Browse our project portfolio by category or search."
            />
          </div>

          {/* Centered Search Bar with Pill Corners */}
          <div className="projects-search-wrapper projects-search-centered">
            <div className="projects-search-box projects-search-pill">
              <Icon name="search" size={18} className="projects-search-icon" />
              <input
                type="text"
                placeholder="Search projects by title, location, or keyword..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label="Search projects"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="projects-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Category Filter Chips (Only categories with projects + All) */}
          <div className="projects-category-chips" aria-label="Filter by project category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`projects-cat-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count indicator */}
          <div className="projects-results-meta">
            <span>
              Showing {displayedProjects.length} of {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </span>
            {(activeCategory !== "All" || searchTerm) && (
              <button
                type="button"
                className="projects-reset-link"
                onClick={handleResetFilters}
              >
                Clear all filters
              </button>
            )}
          </div>

          {displayedProjects.length > 0 ? (
            <>
              <div className="projects-grid">
                {displayedProjects.map((project) => (
                  <ProjectCard key={project.id || project.slug} project={project} />
                ))}
              </div>

              {visibleCount < filteredProjects.length && (
                <div className="projects-load-more">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleLoadMore}
                  >
                    Load More Projects ({filteredProjects.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="projects-empty">
              <h3>No projects match your current filters.</h3>
              <p>Try adjusting your search query, status, or category selection.</p>
              <button
                type="button"
                className="btn"
                onClick={handleResetFilters}
              >
                View All Projects
              </button>
            </div>
          )}
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
