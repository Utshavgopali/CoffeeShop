"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Bean } from "@/lib/api/beans";
import RoastDial from "./roast-dial";
import BeanIllustration from "./bean-illustration";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { addToCart } from "@/lib/api/cart";
import { useState } from "react";

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const NOW = Date.now();

export default function BeanCard({ bean }: { bean: Bean }) {
  const { user } = useUser();
  const { refreshCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const wishlisted = isWishlisted(bean._id);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusy(true);
    try {
      await addToCart(bean._id, 1);
      await refreshCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setWishlistBusy(true);
    try {
      await toggleWishlist(bean._id);
    } finally {
      setWishlistBusy(false);
    }
  }

  const image = bean.images?.[0];
  const isNew = NOW - new Date(bean.createdAt).getTime() < NEW_WINDOW_MS;

  return (
    <Link
      href={`/beans/${bean._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-roast-700 bg-roast-900 transition-transform hover:-translate-y-1 hover:border-gold-dim focus-ring"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-roast-800">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={bean.name} className="h-full w-full object-cover" />
        ) : (
          <BeanIllustration roastLevel={bean.roastLevel} category={bean.category} />
        )}
        {(bean.featured || isNew) && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {bean.featured && (
              <span className="rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
                Best seller
              </span>
            )}
            {isNew && (
              <span className="rounded-full bg-moss px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ivory">
                New
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleWishlist}
          disabled={wishlistBusy}
          className={`absolute right-3 top-3 rounded-full bg-roast-950/70 p-2 backdrop-blur transition-colors disabled:opacity-60 ${
            wishlisted ? "text-clay" : "text-ivory-dim hover:text-gold"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        {bean.stock === 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-clay px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ivory">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-gold-dim">{bean.origin}</span>
        <h3 className="font-display text-lg leading-snug text-ivory">{bean.name}</h3>
        <p className="line-clamp-1 font-body text-xs text-ivory-dim">{bean.tastingNotes.join(" · ")}</p>
        <RoastDial level={bean.roastLevel} />

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div>
            <span className="font-mono text-base font-semibold text-ivory">Rs {bean.price}</span>
            <span className="ml-1 font-mono text-[11px] text-ivory-dim">/ {bean.weightGrams}g</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={busy || bean.stock === 0}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-body text-xs font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-40"
          >
            <Plus size={14} /> {busy ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        {added && <span className="font-mono text-[11px] text-moss-bright">Added to cart</span>}
      </div>
    </Link>
  );
}