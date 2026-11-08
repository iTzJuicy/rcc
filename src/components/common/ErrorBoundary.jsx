import React from "react";
import { captureException } from "../../services/sentry";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    captureException(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-card">
            <span className="eyebrow text-red">System Notice</span>
            <h2>Something went wrong</h2>
            <p>
              We encountered an unexpected error while loading this page. Please
              refresh the page or return to the home page.
            </p>
            <div className="error-boundary-actions">
              <button
                type="button"
                className="btn"
                onClick={this.handleReload}
              >
                Reload Page
              </button>
              <a href="/" className="btn btn-outline" onClick={() => this.setState({ hasError: false })}>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
