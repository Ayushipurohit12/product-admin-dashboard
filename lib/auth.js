import api from "@/lib/axios";

export async function login(username, password) {
  const res = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return res.data; // { id, username, email, token, ... }
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me");
  return res.data;
}
