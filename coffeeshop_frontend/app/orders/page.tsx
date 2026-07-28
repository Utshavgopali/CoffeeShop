"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { myOrders, type Order } from "@/lib/api/orders";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "border-gold-dim/40 bg-gold/10 text-gold-dim",
  paid: "border-moss/40 bg-moss/10 text-moss-bright",
  failed: "border-clay/40 bg-clay/10 text-clay",
  cancelled: "border-roast-600 bg-roast-800 text-ivory-dim",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl text-ivory">Order history</h1>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-roast-900" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <Package size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Browse beans
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="flex flex-col gap-3 rounded-xl border border-roast-700 bg-roast-900 p-5 transition hover:border-gold-dim sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-ivory-dim">Order #{order._id.slice(-6)}</p>
                  <p className="mt-1 font-body text-sm text-ivory">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} · Rs {order.totalAmount}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-ivory-dim/60">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
