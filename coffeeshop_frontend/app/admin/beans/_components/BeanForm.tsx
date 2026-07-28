"use client";

import { useState } from "react";
import type { Bean } from "@/lib/api/beans";
import { BEAN_CATEGORIES, ROAST_LEVELS, PROCESS_METHODS } from "@/lib/constants";

export default function BeanForm({
  bean,
  onSubmit,
  submitting,
  submitLabel,
}: {
  bean?: Bean;
  onSubmit: (formData: FormData) => void;
  submitting: boolean;
  submitLabel: string;
}) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [featured, setFeatured] = useState(bean?.featured ?? false);

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  }

  const previews = imagePreviews.length > 0 ? imagePreviews : bean?.images || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-roast-700 bg-roast-900 p-6">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Name</label>
        <input
          name="name"
          required
          minLength={2}
          defaultValue={bean?.name}
          className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Description</label>
        <textarea
          name="description"
          required
          minLength={10}
          rows={4}
          defaultValue={bean?.description}
          className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Origin</label>
          <input
            name="origin"
            required
            defaultValue={bean?.origin}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Tasting notes (comma separated)</label>
          <input
            name="tastingNotes"
            defaultValue={bean?.tastingNotes?.join(", ")}
            placeholder="citrus, honey, floral"
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Roast level</label>
          <select
            name="roastLevel"
            required
            defaultValue={bean?.roastLevel || "medium"}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          >
            {ROAST_LEVELS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Process</label>
          <select
            name="process"
            defaultValue={bean?.process || "washed"}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          >
            {PROCESS_METHODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Category</label>
          <select
            name="category"
            defaultValue={bean?.category || "single-origin"}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          >
            {BEAN_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Weight (g)</label>
          <input
            name="weightGrams"
            type="number"
            min={1}
            defaultValue={bean?.weightGrams ?? 250}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Price (Rs)</label>
          <input
            name="price"
            type="number"
            min={0}
            required
            defaultValue={bean?.price}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Stock</label>
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={bean?.stock ?? 0}
            className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 font-body text-sm text-ivory-dim">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-roast-600 accent-gold"
        />
        Featured
      </label>
      <input type="hidden" name="featured" value={featured ? "true" : "false"} />

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Images (up to 5)</label>
        <input
          name="images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImagesChange}
          className="w-full rounded-lg border border-dashed border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory-dim outline-none file:mr-3 file:rounded-md file:border-0 file:bg-roast-800 file:px-3 file:py-1.5 file:text-xs file:text-ivory"
        />
        {previews.length > 0 && (
          <div className="mt-3 flex gap-2">
            {previews.map((src, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={src} alt="" className="h-16 w-16 rounded-lg border border-roast-700 object-cover" />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
