"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Trash2, User as UserIcon, X } from "lucide-react";
import { adminListUsers, adminCreateUser, adminDeleteUser, type AdminUser } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    adminListUsers({ page, limit: 10, search: search || undefined })
      .then((res) => {
        setUsers(res.data);
        setMeta(res.meta);
      })
      .catch(() => setUsers([]))
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

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as "user" | "admin",
    };
    setCreating(true);
    try {
      await adminCreateUser(data);
      setShowCreate(false);
      setPage(1);
      load();
    } catch (err) {
      setCreateError(getApiErrorMessage(err, "Could not create user"));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await adminDeleteUser(id);
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
          <h1 className="mt-2 font-display text-3xl text-ivory">Users</h1>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright"
        >
          {showCreate ? <X size={15} /> : <Plus size={15} />} {showCreate ? "Cancel" : "Add user"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-roast-700 bg-roast-900 p-6 sm:grid-cols-2">
          {createError && (
            <div className="sm:col-span-2 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{createError}</div>
          )}
          <input name="name" required placeholder="Name" className="rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold" />
          <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold" />
          <input name="password" type="password" required placeholder="Password" className="rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold" />
          <select name="role" defaultValue="user" className="rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 w-fit rounded-lg bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create user"}
          </button>
        </form>
      )}

      <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-roast-600 bg-roast-950 py-2.5 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-roast-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-roast-700 bg-roast-900">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">User</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Role</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Provider</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-roast-800 bg-roast-950 last:border-0 hover:bg-roast-900/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u._id}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-roast-800 text-gold">
                        {u.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon size={15} />
                        )}
                      </span>
                      <div>
                        <p className="font-body text-sm text-ivory hover:text-gold">{u.name}</p>
                        <p className="font-mono text-xs text-ivory-dim">{u.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${
                      u.role === "admin" ? "border-gold-dim/40 bg-gold/10 text-gold-dim" : "border-roast-600 text-ivory-dim"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ivory-dim">{u.provider}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ivory-dim">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={busyId === u._id}
                      className="text-ivory-dim/60 hover:text-clay disabled:opacity-40"
                      aria-label="Delete user"
                    >
                      <Trash2 size={15} />
                    </button>
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
