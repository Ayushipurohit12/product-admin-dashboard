"use client";

import Link from "next/link";
import { useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";

export default function ProductDetailsPage() {
  const [deleted, setDeleted] = useState(false);
  const product = { id: "preview", title: "Sample product", category: "demo", price: 49.99, stock: 24, rating: 4.8, brand: "Stockroom", description: "A static product preview for the dashboard UI.", thumbnail: "" };

  return <ProtectedShell><article className="space-y-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/products" className="text-sm font-semibold text-[#2F5D50] hover:text-[#1C2321]">← Back to products</Link><h1 className="mt-4 text-4xl font-semibold tracking-tight">{product.title}</h1><p className="mt-2 text-sm text-[#7A817F]">Product ID #{product.id} · <span className="capitalize">{product.category}</span></p></div><div className="flex gap-3"><Link href={`/products/edit?id=${product.id}`} className="rounded-xl bg-[#2F5D50] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244B40]">Edit product</Link><button onClick={() => setDeleted(true)} className="rounded-xl border border-[#E7B7AC] px-4 py-2.5 text-sm font-semibold text-[#A24C3B] hover:bg-[#FFF1EE]">Delete</button></div></div>{deleted ? <p className="rounded-2xl bg-[#FFF1EE] px-4 py-3 text-sm text-[#A24C3B]">Delete is disabled in UI-only mode.</p> : null}<div className="rounded-3xl border border-[#E5E0D5] bg-white p-6"><h2 className="text-lg font-semibold">About this product</h2><p className="mt-3 leading-7 text-[#65716C]">{product.description}</p><div className="mt-6 grid gap-4 sm:grid-cols-3"><Stat label="Price" value={`$${product.price.toFixed(2)}`} /><Stat label="Stock" value={product.stock} /><Stat label="Rating" value={`${product.rating} / 5`} /></div></div></article></ProtectedShell>;
}

function Stat({ label, value }) { return <div className="rounded-2xl bg-[#F7F5F0] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#89918D]">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>; }
