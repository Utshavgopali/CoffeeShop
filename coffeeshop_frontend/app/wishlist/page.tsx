"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus, X } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BeanIllustration from "@/app/_components/bean-illustration";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";

export default function WishlistPage() {
  const { loading: userLoading, user } = useUser();
  const { refreshCart } = useCart();
  const { items, toggleWishlist } = useWishlist();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleRemove(beanId: string) {
    setBusyId(beanId);
    try {
      await toggleWishlist(beanId);
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddToCart(beanId: string) {
    setBusyId(beanId);
    try {
      await addToCart(beanId, 1);
      await refreshCart();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl text-ivory">Wishlist</h1>

        {!userLoading && !user ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <Heart size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">Sign in to view your wishlist.</p>
            <Link href="/login" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Sign in
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <Heart size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">Your wishlist is empty.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Browse beans
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map(({ _id, bean }) => (
              <div key={_id} className="flex gap-4 rounded-xl border border-roast-700 bg-roast-900 p-4">
                <Link href={`/beans/${bean._id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-roast-800">
                  {bean.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bean.images[0]} alt={bean.name} className="h-full w-full object-cover" />
                  ) : (
                    <BeanIllustration roastLevel={bean.roastLevel} category={bean.category} />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/beans/${bean._id}`} className="font-display text-base text-ivory hover:text-gold">
                      {bean.name}
                    </Link>
                    <button
                      onClick={() => handleRemove(bean._id)}
                      disabled={busyId === bean._id}
                      className="text-ivory-dim/60 hover:text-clay disabled:opacity-40"
                      aria-label="Remove from wishlist"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="font-mono text-xs text-ivory-dim">Rs {bean.price} / {bean.weightGrams}g</p>
                  <button
                    onClick={() => handleAddToCart(bean._id)}
                    disabled={busyId === bean._id || bean.stock === 0}
                    className="mt-auto flex w-fit items-center gap-1.5 rounded-full border border-gold-dim px-3 py-1.5 font-mono text-[11px] text-gold transition hover:bg-gold hover:text-ink disabled:opacity-40"
                  >
                    <Plus size={12} /> {bean.stock === 0 ? "Sold out" : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
