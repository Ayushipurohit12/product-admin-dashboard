"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedShell from "@/components/ProtectedShell";
import Loader from "@/components/Loader";
import ProductForm from "@/components/ProductForm";
import { deleteProduct, getProduct, updateProduct } from "@/lib/products";

export default function EditProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (!productId) {
      startTransition(() => setLoading(false));
      return;
    }

    startTransition(() => setId(productId));
    const localProduct = getLocalProduct(productId);
    if (localProduct) {
      startTransition(() => {
        setProduct(localProduct);
        setLoading(false);
      });
      return;
    }

    getProduct(productId)
      .then(setProduct)
      .catch((requestError) => setError(requestError.message || "Could not load this product."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(fields) {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      if (product._local || product._localEdit) {
        const products = getLocalProducts().map((item) => String(item.id) === String(id) ? { ...item, ...fields } : item);
        localStorage.setItem("pad_local_products", JSON.stringify(products));
        setProduct((current) => ({ ...current, ...fields }));
      } else {
        const updated = await updateProduct(id, fields);
        const products = getLocalProducts().filter((item) => String(item.id) !== String(id));
        localStorage.setItem("pad_local_products", JSON.stringify([{ ...updated, ...fields, _localEdit: true }, ...products]));
        setProduct((current) => ({ ...current, ...updated, ...fields }));
      }
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || "Could not update this product.");
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      if (product?._local) {
        localStorage.setItem("pad_local_products", JSON.stringify(getLocalProducts().filter((item) => String(item.id) !== String(id))));
      } else {
        await deleteProduct(id);
      }
      router.replace("/products");
    } catch (requestError) {
      setError(requestError.message || "Could not delete this product.");
      setDeleting(false);
    }
  }

  return <ProtectedShell>{loading ? <div className="flex min-h-72 items-center justify-center"><Loader label="Loading product" /></div> : !product ? <p role="alert" className="rounded-2xl bg-[#FFF1EE] px-4 py-3 text-sm text-[#A24C3B]">{error || "Product not found."}</p> : <><div className="space-y-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5A6D66]">Catalog workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Edit product</h1><p className="mt-2 text-[#65716C]">Update the details customers see in your catalog.</p></div><button type="button" onClick={() => setConfirmDelete(true)} className="rounded-xl border border-[#E7B7AC] px-4 py-2.5 text-sm font-semibold text-[#A24C3B] hover:bg-[#FFF1EE]">Delete product</button></div>{saved ? <p className="rounded-2xl bg-[#E7F3EB] px-4 py-3 text-sm text-[#28704E]">Product updated successfully.</p> : null}{error ? <p role="alert" className="rounded-2xl bg-[#FFF1EE] px-4 py-3 text-sm text-[#A24C3B]">{error}</p> : null}<div className="rounded-3xl border border-[#E5E0D5] bg-white p-6 shadow-[0_12px_40px_rgba(28,35,33,0.05)] sm:p-8"><ProductForm initialProduct={product} mode="edit" onSave={handleSave} saving={saving} /></div></div>{confirmDelete ? <DeleteDialog deleting={deleting} onCancel={() => setConfirmDelete(false)} onConfirm={handleDelete} /> : null}</>}</ProtectedShell>;
}

function DeleteDialog({ deleting, onCancel, onConfirm }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"><div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 id="delete-title" className="text-xl font-semibold text-[#1C2321]">Delete product?</h2><p className="mt-3 text-sm leading-6 text-[#65716C]">This action will remove the product from the catalog. Are you sure you want to continue?</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={onCancel} className="rounded-xl border border-[#D8D1C4] px-4 py-2.5 text-sm font-semibold text-[#33403C]">Cancel</button><button type="button" disabled={deleting} onClick={onConfirm} className="rounded-xl bg-[#A24C3B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{deleting ? "Deleting..." : "Delete product"}</button></div></div></div>;
}

function getLocalProducts() {
  try {
    return JSON.parse(localStorage.getItem("pad_local_products") || "[]");
  } catch {
    return [];
  }
}

function getLocalProduct(id) {
  return getLocalProducts().find((product) => String(product.id) === String(id));
}
