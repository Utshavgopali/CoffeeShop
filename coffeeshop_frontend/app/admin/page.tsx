"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Coffee, Package, ArrowRight } from "lucide-react";
import { adminListUsers, adminListBeans, adminListOrders } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ users: 0, beans: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminListUsers({ limit: 1 }),
      adminListBeans({ limit: 1 }),
      adminListOrders({ limit: 1 }),
    ])
      .then(([users, beans, orders]) => {
        setCounts({ users: users.meta.total, beans: beans.meta.total, orders: orders.meta.total });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Users", value: counts.users, href: "/admin/users", icon: Users },
    { label: "Beans", value: counts.beans, href: "/admin/beans", icon: Coffee },
    { label: "Orders", value: counts.orders, href: "/admin/orders", icon: Package },
  ];

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Admin</span>
      <h1 className="mt-2 font-display text-3xl text-ivory">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex flex-col gap-4 rounded-xl border border-roast-700 bg-roast-900 p-6 transition hover:border-gold-dim"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-roast-800 text-gold">
                <card.icon size={18} />
              </span>
              <ArrowRight size={16} className="text-ivory-dim/50" />
            </div>
            <div>
              <p className="font-mono text-3xl font-semibold text-ivory">{loading ? "—" : card.value}</p>
              <p className="font-body text-sm text-ivory-dim">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
