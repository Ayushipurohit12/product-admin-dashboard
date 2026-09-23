"use client";
import { createContext, useContext, useEffect, useState, useCallback, startTransition } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/lib/auth";
import { getToken, setToken } from "@/lib/axios";

const AuthContext = createContext(null);

const USER_KEY = "pad_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const rawUser = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (token && rawUser) {
      try {
        startTransition(() => setUser(JSON.parse(rawUser)));
      } catch {
        startTransition(() => setUser(null));
      }
    }
    startTransition(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    const { token, ...profile } = data;
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
