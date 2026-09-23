"use client";

import { useState } from "react";

export default function ProductForm({ onSave, saving = false }) {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();
		if (!title.trim() || !price) {
			setError("Title and price are required.");
			return;
		}
		setError("");
		await onSave({ title: title.trim(), price: Number(price) });
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label htmlFor="title" className="mb-2 block text-sm font-semibold">Product title</label>
				<input id="title" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-[#D8D1C4] px-4 py-3" />
			</div>
			<div>
				<label htmlFor="price" className="mb-2 block text-sm font-semibold">Price</label>
				<input id="price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className="w-full rounded-xl border border-[#D8D1C4] px-4 py-3" />
			</div>
			{error ? <p role="alert" className="text-sm text-[#A24C3B]">{error}</p> : null}
			<button type="submit" disabled={saving} className="rounded-xl bg-[#1C2321] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Create product"}</button>
		</form>
	);
}
