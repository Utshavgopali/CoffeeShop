"use client";

import { useEffect, useState } from "react";
import { adminListOrders, adminCancelOrder, type AdminOrder } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";
import type { Order } from "@/lib/api/orders";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "border-gold-dim/40 bg-gold/10 text-gold-dim",
  paid: "border-moss/40 bg-moss/10 text-moss-bright",
  failed: "border-clay/40 bg-clay/10 text-clay",
  cancelled: "border-roast-600 bg-roast-800 text-ivory-dim",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    adminListOrders({ page, limit: 20 })
      .then((res) => {
        setOrders(res.data);
        setMeta(res.meta);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- page-change reload
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this order? Stock will be restored if it was already paid.")) return;
    setError("");
    setBusyId(id);
    try {
      await adminCancelOrder(id);
      load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not cancel order"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Admin</span>
      <h1 className="mt-2 font-display text-3xl text-ivory">Orders</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-roast-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-roast-700 bg-roast-900">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Order</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Customer</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Items</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Total</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Status</th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center font-body text-sm text-ivory-dim">No orders yet.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-roast-800 bg-roast-950 last:border-0 hover:bg-roast-900/60">
                  <td className="px-4 py-3 font-mono text-xs text-ivory">#{order._id.slice(-6)}</td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm text-ivory">{order.user?.name}</p>
                    <p className="font-mono text-xs text-ivory-dim">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ivory-dim">{order.items.length}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ivory">Rs {order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`w-fit rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ivory-dim">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(order.status === "pending" || order.status === "paid") && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={busyId === order._id}
                        className="font-mono text-[11px] uppercase tracking-wide text-clay hover:text-clay/80 disabled:opacity-40"
                      >
                        {busyId === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
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
