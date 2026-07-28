"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Search, Send, Users, User as UserIcon } from "lucide-react";
import { adminListUsers, adminBroadcastNotification, type AdminUser } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";

type Mode = "all" | "choose";

export default function AdminNotificationsPage() {
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [allTotal, setAllTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>("all");
  const [search, setSearch] = useState("");
  const [listUsers, setListUsers] = useState<AdminUser[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    setLoading(true);
    adminListUsers({ limit: 500 })
      .then((res) => {
        setAllUsers(res.data);
        setAllTotal(res.meta.total);
        setListUsers(res.data);
      })
      .catch(() => setAllUsers([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) {
      setListUsers(allUsers);
      return;
    }
    setListLoading(true);
    adminListUsers({ limit: 500, search })
      .then((res) => setListUsers(res.data))
      .catch(() => setListUsers([]))
      .finally(() => setListLoading(false));
  }

  function toggleUser(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === listUsers.length ? new Set() : new Set(listUsers.map((u) => u._id))));
  }

  const recipientCount = mode === "all" ? allUsers.length : selected.size;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userIds = mode === "all" ? allUsers.map((u) => u._id) : Array.from(selected);
    if (userIds.length === 0) {
      setError(mode === "all" ? "No users to send to yet" : "Pick at least one recipient");
      return;
    }

    setSending(true);
    try {
      await adminBroadcastNotification({ userIds, title, message });
      setSuccess(`Sent to ${userIds.length} user${userIds.length === 1 ? "" : "s"}`);
      setTitle("");
      setMessage("");
      setSelected(new Set());
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send notification"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Admin</span>
      <h1 className="mt-2 font-display text-3xl text-ivory">Notifications</h1>
      <p className="mt-2 max-w-lg font-body text-sm text-ivory-dim">
        Send a system notification to your customers. It shows up in their notifications bell.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="inline-flex rounded-lg border border-roast-600 bg-roast-950 p-1">
            <button
              type="button"
              onClick={() => setMode("all")}
              className={`rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
                mode === "all" ? "bg-gold text-ink" : "text-ivory-dim hover:text-ivory"
              }`}
            >
              Everyone
            </button>
            <button
              type="button"
              onClick={() => setMode("choose")}
              className={`rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
                mode === "choose" ? "bg-gold text-ink" : "text-ivory-dim hover:text-ivory"
              }`}
            >
              Choose people
            </button>
          </div>

          {mode === "all" ? (
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-roast-700 bg-roast-900 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Users size={20} />
              </span>
              <div>
                <p className="font-body text-sm text-ivory">Every registered user will get this notification</p>
                <p className="mt-0.5 font-mono text-xs text-ivory-dim">
                  {loading ? "Loading..." : `${allTotal} user${allTotal === 1 ? "" : "s"} total`}
                </p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSearchSubmit} className="relative mt-4 max-w-sm">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 py-2.5 pl-10 pr-4 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </form>

              <div className="mt-4 overflow-hidden rounded-xl border border-roast-700">
                <div className="flex items-center justify-between border-b border-roast-700 bg-roast-900 px-4 py-3">
                  <label className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">
                    <input
                      type="checkbox"
                      checked={listUsers.length > 0 && selected.size === listUsers.length}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 accent-gold"
                    />
                    Select all
                  </label>
                  <span className="font-mono text-[11px] text-ivory-dim">{selected.size} selected</span>
                </div>

                <div className="max-h-[26rem] divide-y divide-roast-800 overflow-y-auto">
                  {loading || listLoading ? (
                    <p className="px-4 py-8 text-center font-body text-sm text-ivory-dim">Loading...</p>
                  ) : listUsers.length === 0 ? (
                    <p className="px-4 py-8 text-center font-body text-sm text-ivory-dim">No users found.</p>
                  ) : (
                    listUsers.map((u) => {
                      const isSelected = selected.has(u._id);
                      return (
                        <label
                          key={u._id}
                          className={`flex cursor-pointer items-center gap-3 border-l-2 px-4 py-3 transition ${
                            isSelected ? "border-gold bg-gold/5" : "border-transparent bg-roast-950 hover:bg-roast-900/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleUser(u._id)}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-roast-800 text-gold">
                            {u.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <UserIcon size={14} />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-body text-sm text-ivory">{u.name}</p>
                            <p className="truncate font-mono text-xs text-ivory-dim">{u.email}</p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSend} className="h-fit rounded-xl border border-roast-700 bg-roast-900 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">Compose</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">
              <CheckCircle2 size={15} className="shrink-0" /> {success}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. New espresso roast just dropped"
                className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wide text-ivory-dim">Message</label>
                <span className="font-mono text-[11px] text-ivory-dim/60">{message.length} chars</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Write the notification body..."
                className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
          </div>

          {(title || message) && (
            <div className="mt-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ivory-dim">Preview</p>
              <div className="flex items-start gap-3 rounded-xl border border-gold-dim/40 bg-roast-850/60 p-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-roast-800 text-gold-dim">
                  <Info size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-body text-sm text-ivory">{title || "Notification title"}</p>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  </div>
                  <p className="mt-0.5 font-body text-xs text-ivory-dim">{message || "Your message will appear here."}</p>
                  <p className="mt-1 font-mono text-[11px] text-ivory-dim/50">Just now</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={sending || loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
          >
            <Send size={15} />
            {sending ? "Sending..." : `Send to ${recipientCount} user${recipientCount === 1 ? "" : "s"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
