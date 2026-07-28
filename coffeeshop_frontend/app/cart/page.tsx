"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BeanIllustration from "@/app/_components/bean-illustration";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { updateCartItem, removeFromCart } from "@/lib/api/cart";

export default function CartPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { cart, refreshCart } = useCart();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleQuantity(beanId: string, quantity: number) {
    setBusyId(beanId);
    try {
      if (quantity <= 0) await removeFromCart(beanId);
      else await updateCartItem(beanId, quantity);
      await refreshCart();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(beanId: string) {
    setBusyId(beanId);
    try {
      await removeFromCart(beanId);
      await refreshCart();
    } finally {
      setBusyId(null);
    }
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.bean.price * i.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl text-ivory">Your cart</h1>

        {!userLoading && !user ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <ShoppingBag size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">Sign in to view your cart.</p>
            <Link href="/login" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Sign in
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <ShoppingBag size={32} className="mx-auto text-ivory-dim/40" />
            <p className="mt-4 font-body text-sm text-ivory-dim">Your cart is empty.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Browse beans
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map(({ bean, quantity }) => (
                <div key={bean._id} className="flex gap-4 rounded-xl border border-roast-700 bg-roast-900 p-4">
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
                      <div>
                        <Link href={`/beans/${bean._id}`} className="font-display text-base text-ivory hover:text-gold">
                          {bean.name}
                        </Link>
                        <p className="font-mono text-xs text-ivory-dim">Rs {bean.price} / {bean.weightGrams}g</p>
                      </div>
                      <button
                        onClick={() => handleRemove(bean._id)}
                        disabled={busyId === bean._id}
                        className="text-ivory-dim/60 hover:text-clay disabled:opacity-40"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-roast-600">
                        <button
                          onClick={() => handleQuantity(bean._id, quantity - 1)}
                          disabled={busyId === bean._id}
                          className="p-2 text-ivory-dim hover:text-gold disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center font-mono text-xs text-ivory">{quantity}</span>
                        <button
                          onClick={() => handleQuantity(bean._id, quantity + 1)}
                          disabled={busyId === bean._id || quantity >= bean.stock}
                          className="p-2 text-ivory-dim hover:text-gold disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-semibold text-ivory">Rs {bean.price * quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-roast-700 bg-roast-900 p-6">
              <h2 className="font-display text-lg text-ivory">Order summary</h2>
              <div className="mt-4 flex items-center justify-between font-body text-sm text-ivory-dim">
                <span>Subtotal</span>
                <span className="text-ivory">Rs {total}</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-ivory-dim/60">Shipping calculated at checkout.</p>
              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright"
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
