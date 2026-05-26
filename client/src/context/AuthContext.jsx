import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/authService";

const AuthContext = createContext(null);

const storedUser = () => {
  const rawUser = localStorage.getItem("ragify_user");
  return rawUser ? JSON.parse(rawUser) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem("ragify_token"));

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    localStorage.setItem("ragify_token", response.token);
    localStorage.setItem("ragify_user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    localStorage.setItem("ragify_token", response.token);
    localStorage.setItem("ragify_user", JSON.stringify(response.user));
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem("ragify_token");
    localStorage.removeItem("ragify_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
