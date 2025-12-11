import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "https://smartbin-backend-gptt.onrender.com/api/users";

  const tryAutoLogin = async () => {
    const sessionRefreshToken = sessionStorage.getItem("refreshToken");
    const localRefreshToken = localStorage.getItem("refreshToken");

    // highest priority if session has one (normal login)
    const refreshToken = sessionRefreshToken || localRefreshToken;

    if (!refreshToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/refresh-token`, { refreshToken });
      sessionStorage.setItem("accessToken", res.data.accessToken);

      // Load user from session or localStorage
      const savedUser =
        sessionStorage.getItem("userData") ||
        localStorage.getItem("userData");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({ loggedIn: true });
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tryAutoLogin();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const body = password ? { email, password, rememberMe } : { email, rememberMe };
      const res = await axios.post(`${API}/login`, body);

      const { accessToken, refreshToken, user } = res.data;

      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("userData", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));
      }

      setUser(user);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const completeOtpLogin = (accessToken, refreshToken, userData, rememberMe = false) => {
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("userData", JSON.stringify(userData));

    if (rememberMe) {
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    setUser(userData);
  };
    
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/signup`, { name, email, password });

      const { accessToken, refreshToken, user } = res.data;

      // 🔥 Store tokens exactly like login()
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("userData", JSON.stringify(user));

      // 🔥 Auto-login user
      setUser(user);

      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, completeOtpLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
