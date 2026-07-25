"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Bean } from "@/lib/api/beans";
import RoastDial from "./roast-dial";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/lib/api/cart";
import { addToWishlist } from "@/lib/api/wishlist";
import { useState } from "react";

export default function BeanCard({ bean }: { bean: Bean }) {
  const { user } = useUser();
  const { refreshCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

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
    await addToWishlist(bean._id);
  }

  const image = bean.images?.[0];

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
          <BeanBagIllustration />
        )}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 rounded-full bg-roast-950/70 p-2 text-ivory-dim backdrop-blur transition-colors hover:text-gold"
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
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

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-mono text-base font-semibold text-ivory">Rs {bean.price}</span>
            <span className="ml-1 font-mono text-[11px] text-ivory-dim">/ {bean.weightGrams}g</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={busy || bean.stock === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-roast-950 transition-transform hover:scale-105 disabled:opacity-40"
            aria-label="Add to cart"
          >
            <Plus size={16} />
          </button>
        </div>
        {added && <span className="font-mono text-[11px] text-moss-bright">Added to cart</span>}
      </div>
    </Link>
  );
}

function BeanBagIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 20c0-6 6-10 14-10s14 4 14 10l3 30c.5 5-3.5 9-8.5 9H23.5c-5 0-9-4-8.5-9l3-30Z" stroke="var(--color-gold-dim)" strokeWidth="1.5" />
      <path d="M25 12c-1-2-1-4 .5-6M32 10c0-2.2.6-3.8 2-5.2M39 12c1-2 1-4-.5-6" stroke="var(--color-gold-dim)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="34" r="6" stroke="var(--color-gold-dim)" strokeWidth="1.2" />
    </svg>
  );
}