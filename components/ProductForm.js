"use client";

import { startTransition, useEffect, useState } from "react";

const emptyProduct = { title: "", price: "", stock: "", category: "", brand: "", description: "", thumbnail: "" };

export default function ProductForm({ initialProduct, mode = "add", onSave, saving = false }) {
	const [form, setForm] = useState(emptyProduct);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!initialProduct) return;
		startTransition(() => setForm({
			title: initialProduct.title || "",
			price: initialProduct.price ?? "",
			stock: initialProduct.stock ?? "",
			category: initialProduct.category || "",
			brand: initialProduct.brand || "",
			description: initialProduct.description || "",
			thumbnail: initialProduct.thumbnail || "",
		}));
	}, [initialProduct]);

	function updateField(event) {
		setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (saving) return;
		if (!form.title.trim()) {
			setError("Product title is required.");
			return;
		}
		if (!form.price || Number(form.price) <= 0) {
			setError("Price must be greater than zero.");
			return;
		}
		if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
			setError("Stock must be a whole number zero or greater.");
			return;
		}
		setError("");
		await onSave({ ...form, title: form.title.trim(), price: Number(form.price), stock: Number(form.stock) });
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
				<Field label="Product title" name="title" value={form.title} onChange={updateField} required />
				<Field label="Category" name="category" value={form.category} onChange={updateField} placeholder="e.g. smartphones" />
				<Field label="Price" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} required />
				<Field label="Stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={updateField} required />
				<Field label="Brand" name="brand" value={form.brand} onChange={updateField} />
				<Field label="Image URL" name="thumbnail" type="url" value={form.thumbnail} onChange={updateField} placeholder="https://..." />
			</div>
			<div><label htmlFor="description" className="mb-2 block text-sm font-semibold">Description</label><textarea id="description" name="description" rows="5" value={form.description} onChange={updateField} className="w-full rounded-xl border border-[#D8D1C4] px-4 py-3" /></div>
			{error ? <p role="alert" className="text-sm text-[#A24C3B]">{error}</p> : null}
			<button type="submit" disabled={saving} className="w-full rounded-xl bg-[#1C2321] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto">{saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create product"}</button>
		</form>
	);
}

function Field({ label, name, type = "text", ...props }) {
	return <div><label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label><input id={name} name={name} type={type} {...props} className="w-full rounded-xl border border-[#D8D1C4] px-4 py-3" /></div>;
}
