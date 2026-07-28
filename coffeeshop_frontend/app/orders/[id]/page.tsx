"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { getOrder, type Order } from "@/lib/api/orders";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "border-gold-dim/40 bg-gold/10 text-gold-dim",
  paid: "border-moss/40 bg-moss/10 text-moss-bright",
  failed: "border-clay/40 bg-clay/10 text-clay",
  cancelled: "border-roast-600 bg-roast-800 text-ivory-dim",
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(params.id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <Link href="/orders" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
          <ArrowLeft size={14} /> Back to orders
        </Link>

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl bg-roast-900" />
        ) : !order ? (
          <div className="rounded-xl border border-dashed border-roast-700 py-20 text-center">
            <p className="font-body text-sm text-ivory-dim">This order could not be found.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-roast-700 bg-roast-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl text-ivory">Order #{order._id.slice(-6)}</h1>
                <p className="mt-1 font-mono text-xs text-ivory-dim/60">
                  Placed {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-6 divide-y divide-roast-700 border-y border-roast-700">
              {order.items.map((item) => (
                <div key={item.bean} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-body text-sm text-ivory">{item.name}</p>
                    <p className="font-mono text-xs text-ivory-dim">{item.weightGrams}g × {item.quantity}</p>
                  </div>
                  <span className="font-mono text-sm text-ivory">Rs {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-body text-sm text-ivory-dim">Total</span>
              <span className="font-mono text-lg font-semibold text-ivory">Rs {order.totalAmount}</span>
            </div>

            <div className="mt-6 rounded-lg border border-roast-700 bg-roast-950 p-4">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-gold-dim">Shipping address</h2>
              <p className="mt-2 font-body text-sm text-ivory">{order.shippingAddress.fullName}</p>
              <p className="font-body text-sm text-ivory-dim">{order.shippingAddress.phone}</p>
              <p className="font-body text-sm text-ivory-dim">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
