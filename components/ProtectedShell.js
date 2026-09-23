"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

export default function ProtectedShell({ children }) {
	const { user, loading, logout } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) router.replace("/login");
	}, [loading, router, user]);

	if (loading || !user) {
		return <div className="flex min-h-screen items-center justify-center"><Loader label="Loading workspace" /></div>;
	}

	return (
		<div className="min-h-screen bg-[#F7F5F0] text-[#1C2321]">
			<header className="border-b border-[#E5E0D5] bg-[#1C2321] text-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
					<Link href="/products" className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDEAE2] text-lg font-bold text-[#1C2321]">S</span>
						<span>
							<span className="block text-[10px] uppercase tracking-[0.22em] text-[#B9CEC1]">Stockroom</span>
							<span className="block text-sm font-semibold">Admin Console</span>
						</span>
					</Link>
					<div className="flex items-center gap-3 sm:gap-5">
						<div className="hidden text-right sm:block">
							<p className="text-sm font-medium">{user.firstName || user.username}</p>
							<p className="text-xs text-[#B9CEC1]">Catalog manager</p>
						</div>
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7EC6A7] font-semibold text-[#1C2321]">
							{(user.firstName || user.username || "U").slice(0, 1).toUpperCase()}
						</span>
						<button onClick={logout} className="rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-[#E5EEE9] transition hover:bg-white/10">
							Log out
						</button>
					</div>
				</div>
			</header>
			<nav className="border-b border-[#E5E0D5] bg-white">
				<div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 sm:px-8">
					<Link href="/products" className={`border-b-2 px-1 py-4 text-sm font-semibold ${pathname === "/products" ? "border-[#2F5D50] text-[#2F5D50]" : "border-transparent text-[#6A756F] hover:text-[#1C2321]"}`}>
						Dashboard
					</Link>
				</div>
			</nav>
			<main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">{children}</main>
		</div>
	);
}
