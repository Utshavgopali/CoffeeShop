"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { useCart } from "@/context/CartContext";
import { checkout } from "@/lib/api/orders";
import { getApiErrorMessage } from "@/lib/api/error";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.bean.price * i.quantity, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      street: formData.get("street") as string,
    };

    setLoading(true);
    try {
      const { paymentUrl } = await checkout(shippingAddress);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not start checkout"));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <Link href="/cart" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
          <ArrowLeft size={14} /> Back to cart
        </Link>
        <h1 className="font-display text-3xl text-ivory">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-roast-700 py-16 text-center">
            <p className="font-body text-sm text-ivory-dim">Your cart is empty.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Browse beans
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-roast-700 bg-roast-900 p-6 lg:col-span-2">
              <h2 className="font-display text-lg text-ivory">Shipping address</h2>

              {error && (
                <div className="rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
              )}

              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Full name</label>
                <input
                  name="fullName"
                  required
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Phone</label>
                <input
                  name="phone"
                  required
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">City</label>
                <input
                  name="city"
                  required
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Street address</label>
                <input
                  name="street"
                  required
                  className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
              >
                {loading ? "Redirecting to Khalti..." : "Pay with Khalti"}
              </button>
            </form>

            <div className="h-fit rounded-xl border border-roast-700 bg-roast-900 p-6">
              <h2 className="font-display text-lg text-ivory">Order summary</h2>
              <div className="mt-4 space-y-2">
                {items.map(({ bean, quantity }) => (
                  <div key={bean._id} className="flex justify-between font-body text-sm text-ivory-dim">
                    <span>{bean.name} × {quantity}</span>
                    <span className="text-ivory">Rs {bean.price * quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-roast-700 pt-4 font-body text-sm">
                <span className="text-ivory-dim">Total</span>
                <span className="font-mono text-lg font-semibold text-ivory">Rs {total}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
