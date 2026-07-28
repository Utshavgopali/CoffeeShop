"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, Pencil, Coffee } from "lucide-react";
import { adminListBeans, adminDeleteBean } from "@/lib/api/admin";
import type { Bean } from "@/lib/api/beans";

export default function AdminBeansPage() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    adminListBeans({ page, limit: 20, search: search || undefined })
      .then((res) => {
        setBeans(res.data);
        setMeta(res.meta);
      })
      .catch(() => setBeans([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- page-change reload
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bean? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await adminDeleteBean(id);
      load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Admin</span>
          <h1 className="mt-2 font-display text-3xl text-ivory">Beans</h1>
        </div>
        <Link
          href="/admin/beans/new"
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright"
        >
          <Plus size={15} /> Add bean
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search beans..."
          className="w-full rounded-lg border border-roast-600 bg-roast-950 py-2.5 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-roast-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-roast-700 bg-roast-900">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Bean</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Category</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Price</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">Loading...</td></tr>
            ) : beans.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">No beans found.</td></tr>
            ) : (
              beans.map((b) => (
                <tr key={b._id} className="border-b border-roast-800 bg-roast-950 last:border-0 hover:bg-roast-900/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/beans/${b._id}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-roast-800 text-gold">
                        {b.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Coffee size={15} />
                        )}
                      </span>
                      <div>
                        <p className="font-body text-sm text-ivory hover:text-gold">{b.name}</p>
                        <p className="font-mono text-xs text-ivory-dim">{b.origin}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ivory-dim capitalize">{b.category.replace("-", " ")}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ivory">Rs {b.price}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ivory-dim">{b.stock === 0 ? <span className="text-clay">Sold out</span> : b.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/beans/${b._id}`} className="text-ivory-dim/60 hover:text-gold" aria-label="Edit bean">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={busyId === b._id}
                        className="text-ivory-dim/60 hover:text-clay disabled:opacity-40"
                        aria-label="Delete bean"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: meta.totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
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
  );
}
