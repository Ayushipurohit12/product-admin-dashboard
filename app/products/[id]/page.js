"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import Loader from "@/components/Loader";
import api from "@/lib/axios";
import { deleteProduct } from "@/lib/products";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      const localProduct = getLocalProduct(id);
      if (localProduct) {
        removeLocalProduct(id);
      } else {
        await deleteProduct(id);
      }
      router.replace("/products");
    } catch (requestError) {
      setDeleteError(requestError.message || "Could not delete this product.");
      setDeleting(false);
    }
  }

  useEffect(() => {
    let active = true;
    startTransition(() => setLoading(true));

    const localProduct = getLocalProduct(id);
    if (localProduct) {
      startTransition(() => {
        setProduct(localProduct);
        setLoading(false);
      });
      return () => { active = false; };
    }

    api.get(`/products/${id}`)
      .then(({ data }) => {
        if (active) setProduct(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  return <ProtectedShell>{loading ? <div className="flex min-h-72 items-center justify-center"><Loader label="Loading product" /></div> : notFound || !product ? <NotFound /> : <><ProductDetails product={product} onDelete={() => setConfirmDelete(true)} />{confirmDelete ? <DeleteDialog deleting={deleting} error={deleteError} onCancel={() => setConfirmDelete(false)} onConfirm={handleDelete} /> : null}</>}</ProtectedShell>;
}

function ProductDetails({ product, onDelete }) {
  const images = (product.images?.length ? product.images : [product.thumbnail]).filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return <article className="space-y-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/products" className="text-sm font-semibold text-[#2F5D50] hover:text-[#1C2321]">← Back to products</Link><h1 className="mt-4 text-4xl font-semibold tracking-tight">{product.title}</h1><p className="mt-2 text-sm capitalize text-[#7A817F]">{product.category} · Product ID #{product.id}</p></div><div className="flex gap-3"><Link href={`/products/edit?id=${product.id}`} className="rounded-xl bg-[#2F5D50] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244B40]">Edit product</Link><button type="button" onClick={onDelete} className="rounded-xl border border-[#E7B7AC] px-4 py-2.5 text-sm font-semibold text-[#A24C3B] hover:bg-[#FFF1EE]">Delete</button></div></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"><section className="rounded-3xl border border-[#E5E0D5] bg-white p-5 sm:p-7"><div className="overflow-hidden rounded-2xl bg-[#F2F0EA]"><img src={selectedImage} alt={product.title} className="aspect-[4/3] w-full object-contain" /></div><div className="mt-4 flex gap-3 overflow-x-auto">{images.map((image) => <button key={image} type="button" onClick={() => setSelectedImage(image)} className={`shrink-0 overflow-hidden rounded-xl border-2 ${selectedImage === image ? "border-[#2F5D50]" : "border-transparent"}`}><img src={image} alt="" className="h-16 w-16 object-cover" /></button>)}</div></section><aside className="rounded-3xl border border-[#E5E0D5] bg-white p-6"><p className="text-sm text-[#7A817F]">Price</p><p className="mt-2 text-4xl font-semibold">${Number(product.price).toFixed(2)}</p><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="Rating" value={`${product.rating} / 5`} /><Stat label="Stock" value={`${product.stock} units`} /></div><div className="mt-6 border-t border-[#EEE9E0] pt-6"><p className="text-xs uppercase tracking-[0.14em] text-[#89918D]">Brand</p><p className="mt-2 font-semibold">{product.brand || "Independent"}</p></div></aside></div><section className="rounded-3xl border border-[#E5E0D5] bg-white p-6 sm:p-8"><h2 className="text-xl font-semibold">Description</h2><p className="mt-3 max-w-3xl leading-7 text-[#65716C]">{product.description || "No description provided."}</p></section><Reviews reviews={product.reviews || []} rating={product.rating} /></article>;
}

function DeleteDialog({ deleting, error, onCancel, onConfirm }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"><div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 id="delete-title" className="text-xl font-semibold text-[#1C2321]">Delete product?</h2><p className="mt-3 text-sm leading-6 text-[#65716C]">This action will remove the product from the catalog. Are you sure you want to continue?</p>{error ? <p role="alert" className="mt-4 rounded-xl bg-[#FFF1EE] px-3 py-2 text-sm text-[#A24C3B]">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={onCancel} className="rounded-xl border border-[#D8D1C4] px-4 py-2.5 text-sm font-semibold text-[#33403C]">Cancel</button><button type="button" disabled={deleting} onClick={onConfirm} className="rounded-xl bg-[#A24C3B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{deleting ? "Deleting..." : "Delete product"}</button></div></div></div>;
}

function Reviews({ reviews, rating }) {
  return <section className="rounded-3xl border border-[#E5E0D5] bg-white p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold">Customer reviews</h2><p className="mt-1 text-sm text-[#7A817F]">{reviews.length ? `${reviews.length} reviews` : "No reviews yet"}</p></div><span className="text-lg text-[#B07A16]">★ {rating}</span></div>{reviews.length ? <div className="mt-6 divide-y divide-[#EEE9E0]">{reviews.map((review, index) => <div key={`${review.reviewerEmail || review.reviewerName}-${index}`} className="py-5 first:pt-0 last:pb-0"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{review.reviewerName}</p><span className="text-sm text-[#B07A16]">★ {review.rating} / 5</span></div><p className="mt-2 leading-6 text-[#65716C]">{review.comment}</p><p className="mt-2 text-xs text-[#89918D]">{new Date(review.date).toLocaleDateString()}</p></div>)}</div> : <p className="mt-6 text-sm text-[#65716C]">Be the first to review this product.</p>}</section>;
}

function NotFound() {
  return <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-3xl border border-[#E5E0D5] bg-white p-8 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A817F]">404</p><h1 className="mt-3 text-3xl font-semibold">Product not found</h1><p className="mt-3 max-w-md text-[#65716C]">This product does not exist or is no longer available.</p><Link href="/products" className="mt-6 rounded-xl bg-[#1C2321] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2F5D50]">Back to products</Link></div>;
}

function Stat({ label, value }) { return <div className="rounded-2xl bg-[#F7F5F0] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#89918D]">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>; }

function getLocalProduct(id) {
  try {
    return JSON.parse(localStorage.getItem("pad_local_products") || "[]").find((product) => String(product.id) === String(id));
  } catch {
    return null;
  }
}

function removeLocalProduct(id) {
  const products = JSON.parse(localStorage.getItem("pad_local_products") || "[]");
  localStorage.setItem("pad_local_products", JSON.stringify(products.filter((product) => String(product.id) !== String(id))));
}
