"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/products");
  }, [loading, router, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      router.replace("/products");
    } catch (requestError) {
      setError(requestError.message || "We could not sign you in. Check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || user) {
    return <div className="flex min-h-screen items-center justify-center"><Loader label="Checking session" /></div>;
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-8 text-[#1C2321] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[28px] border border-[#E5E0D5] bg-white shadow-[0_22px_60px_rgba(28,35,33,0.08)]">
        <section className="relative hidden w-1/2 overflow-hidden bg-[#1C2321] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(109,175,150,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DDEAE2] text-xl font-bold text-[#1C2321]">
                S
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#D1D9D4]">
                  Stockroom
                </p>
                <h1 className="text-lg font-semibold">Admin Console</h1>
              </div>
            </div>

            <div className="max-w-md space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-[#EAF1EE] backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#7EC6A7]" />
                Secure workspace access
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-semibold leading-tight">
                  Manage your product operations with confidence.
                </h2>
                <p className="max-w-sm text-base text-[#D7DED9]">
                  Track inventory, review performance, and update listings from one streamlined dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:grid-cols-3">
            {[
              { label: "Orders", value: "1.2k" },
              { label: "Inventory", value: "94%" },
              { label: "Revenue", value: "$48k" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#F7F5F0]/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[#C7D2CC]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-[#F9F7F3] p-6 sm:p-8 lg:w-1/2 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#5A6D66]">
                Welcome back
              </p>
              <h3 className="text-3xl font-semibold text-[#1C2321]">Sign in to your account</h3>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-[#33403C]">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  className="w-full rounded-2xl border border-[#D8D1C4] bg-white px-4 py-3.5 text-base text-[#1C2321] shadow-sm transition focus:border-[#2F5D50] focus:outline-none focus:ring-4 focus:ring-[#B9D5C9]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-[#33403C]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-[#2F5D50] transition hover:text-[#244B40]"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-2xl border border-[#D8D1C4] bg-white px-4 py-3.5 pr-12 text-base text-[#1C2321] shadow-sm transition focus:border-[#2F5D50] focus:outline-none focus:ring-4 focus:ring-[#B9D5C9]"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#5A6D66]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                      <path d="M7 10V8a5 5 0 1 1 10 0v2" />
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {error ? (
                <div role="alert" className="rounded-2xl border border-[#E7B7AC] bg-[#FFF1EE] px-4 py-3 text-sm text-[#9A3D2D]">
                  {error}
                </div>
              ) : null}

              <div className="flex items-center gap-2 text-sm text-[#4E5E59]">
                <input id="remember" type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#C8C1B3] bg-white text-[#2F5D50] focus:ring-[#2F5D50]" />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#1C2321] px-4 py-3.5 text-base font-semibold text-white shadow-[0_14px_30px_rgba(28,35,33,0.18)] transition hover:-translate-y-0.5 hover:bg-[#2A3533]"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-[#7A817F]">
              <div className="h-px flex-1 bg-[#D9D2C7]" />
              <span className="text-xs uppercase tracking-[0.2em]">Or continue with</span>
              <div className="h-px flex-1 bg-[#D9D2C7]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8D1C4] bg-white px-4 py-3 text-sm font-medium text-[#1C2321] transition hover:border-[#B7C8BF] hover:bg-[#F4F9F6]"
              >
                <span className="text-base">G</span>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8D1C4] bg-white px-4 py-3 text-sm font-medium text-[#1C2321] transition hover:border-[#B7C8BF] hover:bg-[#F4F9F6]"
              >
                <span className="text-base">◌</span>
                SSO
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-[#53615D]">
              Don&apos;t have an account?{" "}
              <button type="button" className="font-semibold text-[#2F5D50] hover:text-[#244B40]">
                Create one
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
