"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Coffee, Package, Bell, ArrowLeft } from "lucide-react";
import Logo from "@/app/_components/logo";
import { useUser } from "@/context/UserContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/beans", label: "Beans", icon: Coffee },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-roast-950">
        <p className="font-mono text-xs text-ivory-dim">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-roast-950">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-roast-700 bg-roast-900 p-5 md:flex">
        <Logo />
        <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-body text-sm transition ${
                  active ? "bg-gold text-ink" : "text-ivory-dim hover:bg-roast-800 hover:text-ivory"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="mt-auto flex items-center gap-1.5 pt-6 font-mono text-xs text-ivory-dim hover:text-gold">
          <ArrowLeft size={13} /> Back to store
        </Link>
      </aside>

      <div className="flex-1 px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
