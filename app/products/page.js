"use client";

import { useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";

export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ProtectedShell>
      <div className="min-h-[calc(100vh-180px)] rounded-[2rem] bg-[#050505] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-10 lg:p-14">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#858585]">Admin dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Welcome back.</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#999999]">Your dashboard is ready. Product management will be added here next.</p>
          </div>
          <button type="button" aria-label="Open dashboard menu" onClick={() => setMenuOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#333333] text-[#BDBDBD] transition hover:border-[#777777] hover:text-white">
            <span className="text-xl leading-none">...</span>
          </button>
        </div>

        {menuOpen ? <div className="mt-6 rounded-2xl border border-[#292929] bg-[#111111] px-4 py-3 text-sm text-[#BDBDBD]">Dashboard menu</div> : null}

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <DashboardCard label="Status" value="Ready" />
          <DashboardCard label="Session" value="Active" />
          <DashboardCard label="Next step" value="Products" />
        </div>
      </div>
    </ProtectedShell>
  );
}

function DashboardCard({ label, value }) {
  return <div className="rounded-2xl border border-[#292929] bg-[#101010] p-5"><p className="text-xs uppercase tracking-[0.18em] text-[#777777]">{label}</p><p className="mt-5 text-xl font-medium text-[#F2F2F2]">{value}</p></div>;
}
