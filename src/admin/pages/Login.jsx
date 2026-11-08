import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/common/Icon";
import SEO from "../../components/common/SEO";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <SEO title="Admin Login" description="RCC Infrastructure Admin Panel" />
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img
            src="/images/logo.webp"
            alt="RCC Infrastructure"
            style={{ width: "140px", height: "auto", margin: "0 auto 16px", display: "block" }}
          />
          <p>Sign in to manage RCC Infrastructure</p>
        </div>

        {error && (
          <div className="admin-login-alert error">
            <Icon name="shield" size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Administrator Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@rcc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label htmlFor="admin-password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  color: "var(--red)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
            <Icon name="arrowRight" size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
