
import { Link } from "react-router-dom";
import Container from "../../components/common/Container";
import Icon from "../../components/common/Icon";

export default function NotFound() {
  return (
    <section className="not-found">
      <Container className="not-found-container">
        <span className="not-found-code">404</span>

        <p className="eyebrow">Page Not Found</p>

        <h1 className="heading">
          Looks Like This
          <br />
          <span className="text-red">Page Is Missing.</span>
        </h1>

        <p className="not-found-description">
          The page you are looking for may have been moved, removed, or is
          temporarily unavailable.
        </p>

        <Link to="/" className="btn">
          Back to Home
          <Icon name="arrowRight" size={18} />
        </Link>
      </Container>
    </section>
  );
}
