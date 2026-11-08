import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("rcc_admin_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("rcc_admin_token");

    async function verify() {
      try {
        const res = await api.adminGetProfile();
        if (res?.data) {
          setUser(res.data);
          setAuthenticated(true);
          localStorage.setItem("rcc_admin_user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn("Session check failed or expired:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  const login = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (res?.user) {
      setUser(res.user);
      setAuthenticated(true);
      localStorage.setItem("rcc_admin_user", JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch {
      // Ignore network errors during logout
    }
    setAuthenticated(false);
    setUser(null);
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
