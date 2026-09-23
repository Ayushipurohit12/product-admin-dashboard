"use client";

import { useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import Loader from "@/components/Loader";
import api from "@/lib/axios";

export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/products", { params: { limit: 0 } })
      .then(({ data }) => {
        if (!active) return;
        setProducts(data.products || []);
        setTotal(data.total || data.products?.length || 0);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Could not load products.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <ProtectedShell>
      <div className="min-h-[calc(100vh-180px)] rounded-[2rem] bg-[#050505] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-10 lg:p-14">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#858585]">Admin dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Welcome back.</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#999999]">A clear view of your catalog, ready for the next update.</p>
          </div>
          <button type="button" aria-label="Open dashboard menu" onClick={() => setMenuOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#333333] text-[#BDBDBD] transition hover:border-[#777777] hover:text-white">
            <span className="text-xl leading-none">...</span>
          </button>
        </div>

        {menuOpen ? <div className="mt-6 rounded-2xl border border-[#292929] bg-[#111111] px-4 py-3 text-sm text-[#BDBDBD]">Dashboard menu</div> : null}

        <div className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Catalog</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Product list</h2>
            </div>
            <span className="text-sm text-[#777777]">{total} products</span>
          </div>

          {loading ? <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#292929] bg-[#101010]"><Loader label="Loading products" /></div> : null}
          {error ? <div role="alert" className="rounded-2xl border border-[#6F3838] bg-[#241313] px-4 py-3 text-sm text-[#F0A9A0]">{error}</div> : null}
          {!loading && !error ? <div className="hidden overflow-hidden rounded-2xl border border-[#292929] bg-[#101010] md:block">
            <table className="w-full text-left">
              <thead className="border-b border-[#292929] text-xs uppercase tracking-[0.14em] text-[#777777]">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Rating</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {products.map((product) => <ProductRow key={product.id} product={product} />)}
              </tbody>
            </table>
          </div> : null}

          {!loading && !error ? <div className="grid gap-3 md:hidden">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div> : null}
        </div>
      </div>
    </ProtectedShell>
  );
}

function ProductRow({ product }) {
  return <tr className="transition hover:bg-[#161616]"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.thumbnail} alt="" className="h-11 w-11 rounded-xl object-cover" /><span className="font-medium text-[#F2F2F2]">{product.title}</span></div></td><td className="px-5 py-4 text-sm capitalize text-[#999999]">{product.category}</td><td className="px-5 py-4 text-sm font-medium text-[#E6E6E6]">${Number(product.price).toFixed(2)}</td><td className="px-5 py-4 text-sm text-[#D7B86A]">★ {product.rating}</td><td className="px-5 py-4"><Stock stock={product.stock} /></td></tr>;
}

function ProductCard({ product }) {
  return <article className="rounded-2xl border border-[#292929] bg-[#101010] p-4"><div className="flex items-center gap-4"><img src={product.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0"><h3 className="truncate font-medium text-[#F2F2F2]">{product.title}</h3><p className="mt-1 text-sm capitalize text-[#888888]">{product.category}</p></div></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#292929] pt-4"><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Price</p><p className="mt-1 text-sm font-medium text-[#E6E6E6]">${Number(product.price).toFixed(2)}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Rating</p><p className="mt-1 text-sm text-[#D7B86A]">★ {product.rating}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Stock</p><div className="mt-1"><Stock stock={product.stock} /></div></div></div></article>;
}

function Stock({ stock }) {
  return <span className={stock < 15 ? "text-sm text-[#E99B83]" : "text-sm text-[#A9D7B1]"}>{stock} units</span>;
}
