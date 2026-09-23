"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedShell from "@/components/ProtectedShell";
import Loader from "@/components/Loader";
import api from "@/lib/axios";

export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    api.get("/products/categories")
      .then(({ data }) => setCategories(data.map((item) => typeof item === "string" ? { slug: item, name: item } : item)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    const query = search.trim();
    const timer = setTimeout(() => {
      const path = query
        ? "/products/search"
        : category
          ? `/products/category/${encodeURIComponent(category)}`
          : "/products";

      api.get(path, {
        params: {
          limit: pageSize,
          skip: (page - 1) * pageSize,
          ...(query ? { q: query } : {}),
          ...(sortBy ? { sortBy, order } : {}),
        },
      })
        .then(({ data }) => {
          if (!active) return;
          const localProducts = getLocalProducts().filter((product) => matchesProduct(product, query, category));
          const sortedLocalProducts = sortProducts(localProducts, sortBy, order);
          const pageProducts = page === 1
            ? [...sortedLocalProducts, ...(data.products || [])].slice(0, pageSize)
            : data.products || [];
          setProducts(pageProducts);
          setTotal((data.total || data.products?.length || 0) + sortedLocalProducts.length);
          setError("");
        })
        .catch((requestError) => {
          if (active) setError(requestError.message || "Could not load products.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [page, pageSize, search, category, sortBy, order, retryKey]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  function goToPage(nextPage) {
    setPage(nextPage);
    setLoading(true);
  }

  function changePageSize(event) {
    setPageSize(Number(event.target.value));
    setPage(1);
    setLoading(true);
  }

  function changeCategory(event) {
    setCategory(event.target.value);
    setPage(1);
    setLoading(true);
  }

  function changeSort(event) {
    const [nextSortBy, nextOrder] = event.target.value.split(":");
    setSortBy(nextSortBy);
    setOrder(nextOrder || "asc");
    setPage(1);
    setLoading(true);
  }

  function retryRequest() {
    setError("");
    setLoading(true);
    setRetryKey((current) => current + 1);
  }

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
            <div className="flex items-center gap-3">
              <label htmlFor="product-search" className="sr-only">Search products</label>
              <input id="product-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); setLoading(true); }} placeholder="Search products..." className="w-48 rounded-xl border border-[#333333] bg-[#101010] px-3 py-2 text-sm text-white outline-none placeholder:text-[#777777] focus:border-[#777777] sm:w-64" />
              <span className="hidden text-sm text-[#777777] sm:inline">{total} products</span>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
            <select id="category-filter" value={category} onChange={changeCategory} className="rounded-xl border border-[#333333] bg-[#101010] px-3 py-2.5 text-sm capitalize text-white outline-none focus:border-[#777777]">
              <option value="">All categories</option>
              {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name || item.slug}</option>)}
            </select>
            <label htmlFor="sort-products" className="sr-only">Sort products</label>
            <select id="sort-products" value={sortBy ? `${sortBy}:${order}` : ""} onChange={changeSort} className="rounded-xl border border-[#333333] bg-[#101010] px-3 py-2.5 text-sm text-white outline-none focus:border-[#777777]">
              <option value="">Sort products</option>
              <option value="price:asc">Price: low to high</option>
              <option value="price:desc">Price: high to low</option>
              <option value="rating:desc">Rating: highest first</option>
              <option value="rating:asc">Rating: lowest first</option>
              <option value="title:asc">Title: A to Z</option>
              <option value="title:desc">Title: Z to A</option>
            </select>
          </div>

          {loading ? <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#292929] bg-[#101010]"><Loader label="Loading products" /></div> : null}
          {error ? <div role="alert" className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#6F3838] bg-[#241313] px-4 py-10 text-center"><p className="text-sm text-[#F0A9A0]">{error}</p><button type="button" onClick={retryRequest} className="rounded-xl border border-[#D98A7C] px-4 py-2 text-sm font-semibold text-[#FFD3CC] transition hover:bg-[#51231F]">Retry</button></div> : null}
          {!loading && !error && products.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-[#292929] bg-[#101010] px-4 text-center"><p className="text-lg font-semibold text-white">No products found</p><p className="mt-2 text-sm text-[#888888]">Try a different search or filter.</p></div> : null}
          {!loading && !error && products.length > 0 ? <div className="hidden overflow-hidden rounded-2xl border border-[#292929] bg-[#101010] md:block">
            <table className="w-full text-left">
              <thead className="border-b border-[#292929] text-xs uppercase tracking-[0.14em] text-[#777777]">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Rating</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {products.map((product) => <ProductRow key={product.id} product={product} />)}
              </tbody>
            </table>
          </div> : null}

          {!loading && !error && products.length > 0 ? <div className="grid gap-3 md:hidden">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div> : null}

          {!error ? <div className="mt-8 flex flex-col items-center gap-4 text-sm text-[#999999]">
            <p>Showing {firstItem}–{lastItem} of {total}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex overflow-hidden rounded-2xl border border-[#333333] bg-[#101010]">
                <button type="button" aria-label="Previous page" disabled={page === 1 || loading} onClick={() => goToPage(page - 1)} className="flex h-12 w-12 items-center justify-center border-r border-[#333333] text-2xl text-[#D0D0D0] transition hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40">‹</button>
                {getVisiblePages(page, pageCount).map((pageNumber) => <button key={pageNumber} type="button" disabled={loading} onClick={() => goToPage(pageNumber)} className={`h-12 min-w-12 border-r border-[#333333] px-3 text-base transition ${pageNumber === page ? "bg-white text-black" : "text-[#D0D0D0] hover:bg-[#1A1A1A]"}`}>{pageNumber}</button>)}
                <button type="button" aria-label="Next page" disabled={page === pageCount || loading} onClick={() => goToPage(page + 1)} className="flex h-12 w-12 items-center justify-center text-2xl text-[#D0D0D0] transition hover:bg-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40">›</button>
              </div>
              <label htmlFor="page-size" className="sr-only">Products per page</label>
              <select id="page-size" value={pageSize} onChange={changePageSize} className="h-12 rounded-xl border border-[#333333] bg-[#101010] px-3 text-sm text-white outline-none focus:border-[#777777]">
                {[10, 20, 50].map((size) => <option key={size} value={size}>{size} / page</option>)}
              </select>
            </div>
          </div> : null}
        </div>
      </div>
    </ProtectedShell>
  );
}

function ProductRow({ product }) {
  return <tr className="transition hover:bg-[#161616]"><td className="px-5 py-4"><Link href={`/products/${product.id}`} className="flex items-center gap-3"><ProductImage src={product.thumbnail} size="small" /><span className="font-medium text-[#F2F2F2] hover:text-white">{product.title}</span></Link></td><td className="px-5 py-4 text-sm capitalize text-[#999999]">{product.category}</td><td className="px-5 py-4 text-sm font-medium text-[#E6E6E6]">${Number(product.price).toFixed(2)}</td><td className="px-5 py-4 text-sm text-[#D7B86A]">★ {product.rating}</td><td className="px-5 py-4"><Stock stock={product.stock} /></td><td className="px-5 py-4 text-right"><Link href={`/products/edit?id=${product.id}`} className="text-sm font-semibold text-[#9CC9B0] hover:text-white">Edit</Link></td></tr>;
}

function ProductCard({ product }) {
  return <article className="rounded-2xl border border-[#292929] bg-[#101010] p-4"><div className="flex items-center justify-between gap-4"><Link href={`/products/${product.id}`} className="flex min-w-0 items-center gap-4"><ProductImage src={product.thumbnail} size="large" /><div className="min-w-0"><h3 className="truncate font-medium text-[#F2F2F2]">{product.title}</h3><p className="mt-1 text-sm capitalize text-[#888888]">{product.category}</p></div></Link><Link href={`/products/edit?id=${product.id}`} className="text-sm font-semibold text-[#9CC9B0]">Edit</Link></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#292929] pt-4"><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Price</p><p className="mt-1 text-sm font-medium text-[#E6E6E6]">${Number(product.price).toFixed(2)}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Rating</p><p className="mt-1 text-sm text-[#D7B86A]">★ {product.rating}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-[#777777]">Stock</p><div className="mt-1"><Stock stock={product.stock} /></div></div></div></article>;
}

function ProductImage({ src, size }) {
  const className = size === "large" ? "h-16 w-16" : "h-11 w-11";
  return src ? <img src={src} alt="" className={`${className} rounded-xl object-cover`} /> : <span className={`${className} flex shrink-0 items-center justify-center rounded-xl bg-[#292929] text-[10px] uppercase tracking-wider text-[#777777]`}>No image</span>;
}

function Stock({ stock }) {
  return <span className={stock < 15 ? "text-sm text-[#E99B83]" : "text-sm text-[#A9D7B1]"}>{stock} units</span>;
}

function getVisiblePages(currentPage, totalPages) {
  const visibleCount = Math.min(5, totalPages);
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - visibleCount + 1));
  return Array.from({ length: visibleCount }, (_, index) => start + index);
}

function getLocalProducts() {
  try {
    return JSON.parse(localStorage.getItem("pad_local_products") || "[]");
  } catch {
    return [];
  }
}

function matchesProduct(product, query, category) {
  const searchable = `${product.title} ${product.description || ""} ${product.brand || ""}`.toLowerCase();
  return (!query || searchable.includes(query.toLowerCase())) && (!category || product.category === category);
}

function sortProducts(products, sortBy, order) {
  if (!sortBy) return products;
  return [...products].sort((first, second) => {
    const firstValue = first[sortBy];
    const secondValue = second[sortBy];
    const comparison = typeof firstValue === "string" ? firstValue.localeCompare(secondValue) : Number(firstValue) - Number(secondValue);
    return order === "desc" ? -comparison : comparison;
  });
}
