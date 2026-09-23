"use client";

import { useState } from "react";
import ProtectedShell from "@/components/ProtectedShell";
import ProductForm from "@/components/ProductForm";
import { addProduct } from "@/lib/products";


export default function AddProductPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState(null);

  async function handleSave(product) {
    setSaving(true);
    setError("");
    try {
      const created = await addProduct(product);
      const savedProducts = JSON.parse(localStorage.getItem("pad_local_products") || "[]");
      localStorage.setItem("pad_local_products", JSON.stringify([{ ...created, ...product, _local: true }, ...savedProducts]));
      setCreatedId(created.id);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message || "Could not create this product.");
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  return <ProtectedShell><div className="space-y-8"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5A6D66]">Catalog workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Add product</h1><p className="mt-2 text-[#65716C]">Create a new listing for your product catalog.</p></div>{saved ? <p className="rounded-2xl bg-[#E7F3EB] px-4 py-3 text-sm text-[#28704E]">Product created successfully. API product ID: {createdId}</p> : null}{error ? <p role="alert" className="rounded-2xl bg-[#FFF1EE] px-4 py-3 text-sm text-[#A24C3B]">{error}</p> : null}<div className="rounded-3xl border border-[#E5E0D5] bg-white p-6 shadow-[0_12px_40px_rgba(28,35,33,0.05)] sm:p-8"><ProductForm onSave={handleSave} saving={saving} /></div></div></ProtectedShell>;
}
