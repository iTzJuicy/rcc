import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const loading = isAdminRoute && !authChecked;

  useEffect(() => {
    localStorage.removeItem("rcc_admin_token");
    const handleSessionExpired = () => {
      setAuthenticated(false);
      setUser(null);
      localStorage.removeItem("rcc_admin_token");
      localStorage.removeItem("rcc_admin_user");
      navigate("/admin/login", { replace: true });
    };

    window.addEventListener("rcc:session-expired", handleSessionExpired);
    return () => window.removeEventListener("rcc:session-expired", handleSessionExpired);
  }, [navigate]);

  useEffect(() => {
    if (!isAdminRoute || authChecked) return undefined;
    let active = true;

    async function verify() {
      try {
        const res = await api.adminGetProfile();
        if (active && res?.data) {
          setUser(res.data);
          setAuthenticated(true);
        }
      } catch (err) {
        if (active) {
          console.warn("Session check failed or expired:", err.message);
          setUser(null);
          setAuthenticated(false);
          localStorage.removeItem("rcc_admin_user");
        }
      } finally {
        if (active) setAuthChecked(true);
      }
    }
    verify();
    return () => {
      active = false;
    };
  }, [authChecked, isAdminRoute]);

  const login = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (!res?.user) {
      throw new Error("Sign-in response was incomplete. Please try again.");
    }

    setUser(res.user);
    setAuthenticated(true);
    return res;
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch (error) {
      console.error("Could not confirm server logout.", error);
    }
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem("rcc_admin_token");
    localStorage.removeItem("rcc_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authenticated && !!user,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
