
import { Link } from "react-router-dom";
import Icon from "../../common/Icon";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <Link
        to={`/projects/${project.slug}`}
        className="project-card-image"
        aria-label={`View ${project.title}`}
      >
        <img src={project.image} alt={project.title} loading="lazy" />

        {project.category && (
          <span className="project-card-category">
            {project.category}
          </span>
        )}
      </Link>

      <div className="project-card-content">
        <div className="project-card-meta">
          {project.location && <span>{project.location}</span>}
          {project.year && <span>{project.year}</span>}
        </div>

        <h3>
          <Link to={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        <p>{project.description}</p>

        <Link
          to={`/projects/${project.slug}`}
          className="project-card-link"
          aria-label={`View project ${project.title}`}
        >
          View Project
          <Icon name="arrowUpRight" size={18} />
        </Link>
      </div>
    </article>
  );
}
