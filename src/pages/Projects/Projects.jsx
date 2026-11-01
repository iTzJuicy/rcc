
import { useState } from "react";
import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import ProjectCard from "../../components/sections/shared/ProjectCard";
import ContactCTA from "../../components/sections/home/ContactCTA";
import projects from "../../data/projects";
import "../../styles/projects.css";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category === activeCategory
        );

  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Featured Projects"
        description="Explore our construction work and the principles of quality, planning, and execution behind every project."
        image="/images/impact.png"
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
                  <span className="text-red">
                    Our Commitment.
                  </span>
                </>
              }
              description="Browse our project portfolio by category."
            />
          </div>

          <div
            className="projects-filters"
            aria-label="Filter projects"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`projects-filter ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <div className="projects-empty">
              <h3>
                No projects available in this category.
              </h3>

              <button
                type="button"
                className="btn"
                onClick={() => setActiveCategory("All")}
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
