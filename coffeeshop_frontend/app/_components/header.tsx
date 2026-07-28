"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Bell, User as UserIcon, Menu, X } from "lucide-react";
import Logo from "./logo";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=espresso", label: "Espresso" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const { user, logout, loading } = useUser();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Both "Shop" and "Espresso" resolve to /shop; reading the ?category=
  // value would require useSearchParams, which forces a Suspense boundary
  // wherever Header is rendered. Keep this pathname-only: "Shop" lights up
  // for the whole /shop section, "Espresso" is a plain link.
  function isActive(href: string) {
    const path = href.split("?")[0];
    if (path !== pathname) return false;
    return !href.includes("category=espresso");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-roast-700 bg-roast-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`border-b-2 pb-1 font-body text-sm transition-colors focus-ring rounded-sm ${
                isActive(link.href) ? "border-gold text-gold" : "border-transparent text-ivory-dim hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <Link href="/wishlist" className="relative hidden text-ivory-dim hover:text-gold sm:block focus-ring rounded-sm" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[10px] font-semibold text-ink">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link href="/notifications" className="hidden text-ivory-dim hover:text-gold sm:block focus-ring rounded-sm" aria-label="Notifications">
              <Bell size={20} />
            </Link>
          )}
          <Link href="/cart" className="relative text-ivory-dim hover:text-gold focus-ring rounded-sm" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-mono text-[10px] font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          {!loading && !user && (
            <Link
              href="/login"
              className="rounded-full border border-gold-dim px-4 py-1.5 font-body text-sm text-gold transition-colors hover:bg-gold hover:text-ink focus-ring"
            >
              Sign in
            </Link>
          )}

          {!loading && user && (
            <div className="group relative">
              <button className="flex items-center gap-2 focus-ring rounded-full" aria-haspopup="true">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-roast-700 text-gold">
                    <UserIcon size={16} />
                  </span>
                )}
              </button>
              <div className="invisible absolute right-0 mt-2 w-44 rounded-lg border border-roast-700 bg-roast-900 py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                <p className="truncate px-4 py-1 font-body text-xs text-ivory-dim">{user.name}</p>
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2 text-sm text-ivory hover:bg-roast-800 hover:text-gold">
                    Admin panel
                  </Link>
                )}
                <Link href="/profile" className="block px-4 py-2 text-sm text-ivory hover:bg-roast-800 hover:text-gold">
                  Profile
                </Link>
                <Link href="/orders" className="block px-4 py-2 text-sm text-ivory hover:bg-roast-800 hover:text-gold">
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-clay hover:bg-roast-800"
                >
                  Log out
                </button>
              </div>
            </div>
          )}

          <button
            className="text-ivory-dim md:hidden focus-ring rounded-sm"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-roast-700 px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm text-ivory-dim hover:text-gold"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}