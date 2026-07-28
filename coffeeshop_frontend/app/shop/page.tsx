"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Coffee, Layers, Leaf, MapPin, Sparkles } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BeanCard from "@/app/_components/bean-card";
import PriceRangeSlider from "@/app/_components/price-range-slider";
import { listBeans, getBeanFacets, type Bean, type BeanFacets } from "@/lib/api/beans";
import { BEAN_CATEGORIES, ROAST_LEVELS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const CATEGORY_ICON: Record<string, typeof Coffee> = {
  "single-origin": MapPin,
  blend: Layers,
  espresso: Coffee,
  decaf: Leaf,
};

const PRICE_MIN = 0;
const PRICE_MAX = 2000;

const EMPTY_FACETS: BeanFacets = { roastLevel: {}, origin: {}, weightGrams: {} };

function weightLabel(grams: number) {
  return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [beans, setBeans] = useState<Bean[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [facets, setFacets] = useState<BeanFacets>(EMPTY_FACETS);
  const [showAllCountries, setShowAllCountries] = useState(false);

  const category = searchParams.get("category") || "";
  const roastLevels = (searchParams.get("roastLevel") || "").split(",").filter(Boolean);
  const origins = (searchParams.get("origin") || "").split(",").filter(Boolean);
  const weights = (searchParams.get("weightGrams") || "").split(",").filter(Boolean).map(Number);
  const sort = searchParams.get("sort") || "-createdAt";
  const page = Number(searchParams.get("page") || 1);
  const minPrice = Number(searchParams.get("minPrice") || PRICE_MIN);
  const maxPrice = Number(searchParams.get("maxPrice") || PRICE_MAX);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    });
    if (!("page" in next)) params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function toggleListParam(key: string, current: string[], value: string) {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParams({ [key]: next.join(",") || null });
  }

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- filter/page change reload
    setLoading(true);
    listBeans({
      page,
      limit: 12,
      search: searchParams.get("search") || undefined,
      category: category || undefined,
      roastLevel: roastLevels.length ? roastLevels : undefined,
      origin: origins.length ? origins : undefined,
      weightGrams: weights.length ? weights : undefined,
      minPrice: minPrice > PRICE_MIN ? minPrice : undefined,
      maxPrice: maxPrice < PRICE_MAX ? maxPrice : undefined,
      sort,
    })
      .then((res) => {
        if (!active) return;
        setBeans(res.data);
        setMeta(res.meta);
      })
      .catch(() => {
        if (active) setBeans([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), page]);

  useEffect(() => {
    getBeanFacets(category || undefined)
      .then(setFacets)
      .catch(() => setFacets(EMPTY_FACETS));
  }, [category]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: search || null });
  }

  const activeFilterCount =
    roastLevels.length + origins.length + weights.length + (minPrice > PRICE_MIN || maxPrice < PRICE_MAX ? 1 : 0);

  const originEntries = Object.entries(facets.origin).sort((a, b) => b[1] - a[1]);
  const visibleOrigins = showAllCountries ? originEntries : originEntries.slice(0, 5);

  const weightEntries = Object.entries(facets.weightGrams)
    .map(([grams, count]) => [Number(grams), count] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">The shop</span>
          <h1 className="mt-2 font-display text-3xl text-ivory sm:text-4xl">All beans</h1>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => updateParams({ category: null })}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm transition ${
              !category ? "border-gold bg-gold text-ink" : "border-roast-600 text-ivory-dim hover:border-gold-dim"
            }`}
          >
            <Sparkles size={15} /> All
          </button>
          {BEAN_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c.value] ?? Coffee;
            const active = category === c.value;
            return (
              <button
                key={c.value}
                onClick={() => updateParams({ category: c.value })}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm transition ${
                  active ? "border-gold bg-gold text-ink" : "border-roast-600 text-ivory-dim hover:border-gold-dim"
                }`}
              >
                <Icon size={15} /> {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-72 lg:shrink-0">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="mb-4 flex w-full items-center justify-between gap-2 rounded-lg border border-roast-700 bg-roast-900 px-4 py-3 font-mono text-xs uppercase tracking-wide text-ivory-dim lg:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </button>

            <div
              className={`${filtersOpen ? "block" : "hidden"} space-y-6 rounded-xl border border-roast-700 bg-roast-900 p-5 lg:block`}
            >
              <h2 className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-gold-dim">
                Filters <SlidersHorizontal size={13} />
              </h2>

              <form onSubmit={handleSearchSubmit} className="relative">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search beans..."
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 py-2.5 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </form>

              <div>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-dim">Roast level</h3>
                <div className="space-y-2">
                  {ROAST_LEVELS.map((r) => {
                    const count = facets.roastLevel[r.value] || 0;
                    return (
                      <label key={r.value} className="flex cursor-pointer items-center justify-between gap-2 py-0.5">
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={roastLevels.includes(r.value)}
                            onChange={() => toggleListParam("roastLevel", roastLevels, r.value)}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          <span className="font-body text-sm text-ivory-dim">{r.label}</span>
                        </span>
                        <span className="font-mono text-xs text-ivory-dim/60">{count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-dim">Price range</h3>
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-ivory-dim/70">
                  <span>Rs {PRICE_MIN}</span>
                  <span>Rs {PRICE_MAX}+</span>
                </div>
                <PriceRangeSlider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  value={[minPrice, maxPrice]}
                  onChange={([min, max]) =>
                    updateParams({
                      minPrice: min > PRICE_MIN ? String(min) : null,
                      maxPrice: max < PRICE_MAX ? String(max) : null,
                    })
                  }
                />
                <p className="mt-3 font-mono text-xs text-ivory-dim">
                  Selected: Rs {minPrice} – Rs {maxPrice}
                  {maxPrice >= PRICE_MAX ? "+" : ""}
                </p>
              </div>

              {originEntries.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-dim">Country</h3>
                  <div className="space-y-2">
                    {visibleOrigins.map(([origin, count]) => (
                      <label key={origin} className="flex cursor-pointer items-center justify-between gap-2 py-0.5">
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={origins.includes(origin)}
                            onChange={() => toggleListParam("origin", origins, origin)}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          <span className="font-body text-sm text-ivory-dim">{origin}</span>
                        </span>
                        <span className="font-mono text-xs text-ivory-dim/60">{count}</span>
                      </label>
                    ))}
                  </div>
                  {originEntries.length > 5 && (
                    <button
                      onClick={() => setShowAllCountries((v) => !v)}
                      className="mt-2 font-mono text-xs text-gold-dim hover:text-gold"
                    >
                      {showAllCountries ? "View less" : "View more"}
                    </button>
                  )}
                </div>
              )}

              {weightEntries.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-dim">Weight</h3>
                  <div className="space-y-2">
                    {weightEntries.map(([grams, count]) => (
                      <label key={grams} className="flex cursor-pointer items-center justify-between gap-2 py-0.5">
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={weights.includes(grams)}
                            onChange={() => toggleListParam("weightGrams", weights.map(String), String(grams))}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          <span className="font-body text-sm text-ivory-dim">{weightLabel(grams)}</span>
                        </span>
                        <span className="font-mono text-xs text-ivory-dim/60">{count}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterCount > 0 && (
                <button
                  onClick={() => router.push(category ? `/shop?category=${category}` : "/shop")}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-roast-600 py-2.5 font-mono text-xs uppercase tracking-wide text-ivory-dim transition hover:border-clay hover:text-clay"
                >
                  <X size={13} /> Reset filters
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-body text-sm text-ivory-dim">
                {loading ? "Loading..." : `Showing ${meta.total} product${meta.total === 1 ? "" : "s"}`}
              </p>
              <label className="flex items-center gap-2 font-mono text-xs text-ivory-dim">
                Sort by:
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="rounded-lg border border-roast-600 bg-roast-950 px-3 py-2 font-mono text-xs uppercase tracking-wide text-ivory-dim outline-none focus:border-gold"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-roast-900" />
                ))}
              </div>
            ) : beans.length === 0 ? (
              <div className="rounded-xl border border-dashed border-roast-700 py-20 text-center">
                <p className="font-body text-sm text-ivory-dim">No beans match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {beans.map((bean) => (
                  <BeanCard key={bean._id} bean={bean} />
                ))}
              </div>
            )}

            {meta.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: meta.totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`h-9 w-9 rounded-full font-mono text-xs transition ${
                        p === meta.page ? "bg-gold text-ink" : "border border-roast-600 text-ivory-dim hover:border-gold-dim"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
