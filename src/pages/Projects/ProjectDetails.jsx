
import { Link, useParams, Navigate } from "react-router-dom";

import PageHero from "../../components/common/PageHero";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";
import ContactCTA from "../../components/sections/home/ContactCTA";

import projects from "../../data/projects";
import "../../styles/project-details.css";

export default function ProjectDetails() {
  const { slug } = useParams();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.description}
        image={project.image}
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

              <p className="project-description">
                {project.description}
              </p>

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
                  <strong>
                    {project.location || "Not specified"}
                  </strong>
                </div>

                {project.year && (
                  <div>
                    <span>Year</span>
                    <strong>{project.year}</strong>
                  </div>
                )}

                {project.status && (
                  <div>
                    <span>Status</span>
                    <strong>{project.status}</strong>
                  </div>
                )}
              </div>

              <Link to="/contact" className="btn">
                Discuss a Similar Project
                <Icon name="arrowUpRight" size={18} />
              </Link>

            </div>
          </div>

          <div className="project-details-image">
            <img
              src={project.image}
              alt={project.title}
            />
          </div>

        </div>
      </section>

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

            <Link
              to="/projects"
              className="project-details-view-all"
            >
              View All Projects
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>

          <div className="projects-grid">
            {relatedProjects.map((item) => (
              <article
                className="project-card"
                key={item.id}
              >
                <Link
                  to={`/projects/${item.slug}`}
                  className="project-card-image"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                </Link>

                <div className="project-card-content">
                  <h3>
                    <Link to={`/projects/${item.slug}`}>
                      {item.title}
                    </Link>
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
