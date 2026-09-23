"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => null,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = window.sessionStorage.getItem("stockroom-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to read user session", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const nextUser = {
      email,
      name: email.split("@")[0] || "Admin",
      role: password ? "admin" : "guest",
    };

    setUser(nextUser);
    window.sessionStorage.setItem("stockroom-user", JSON.stringify(nextUser));
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    window.sessionStorage.removeItem("stockroom-user");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
