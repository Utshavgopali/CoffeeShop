"use client";

import { useEffect, useState } from "react";
import { Bell, Package, User as UserIcon, Info, CheckCheck } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { getMyNotifications, markNotificationRead, markAllRead, type Notification } from "@/lib/api/notifications";

const TYPE_ICON: Record<Notification["type"], typeof Package> = {
  order: Package,
  account: UserIcon,
  system: Info,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  function load() {
    getMyNotifications()
      .then((data) => {
        setNotifications(data.notifications);
        setUnread(data.unread);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    await markAllRead();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-ivory">Notifications</h1>
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 font-mono text-xs text-gold-dim hover:text-gold"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-roast-900" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <Bell size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">You&apos;re all caught up.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] || Info;
              return (
                <button
                  key={n._id}
                  onClick={() => !n.read && handleMarkRead(n._id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                    n.read ? "border-roast-700 bg-roast-900" : "border-gold-dim/40 bg-roast-850/60"
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-roast-800 text-gold-dim">
                    <Icon size={15} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm text-ivory">{n.title}</p>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                    </div>
                    <p className="mt-0.5 font-body text-xs text-ivory-dim">{n.message}</p>
                    <p className="mt-1 font-mono text-[11px] text-ivory-dim/50">
                      {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
