"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import RoastDial from "@/app/_components/roast-dial";
import BeanIllustration from "@/app/_components/bean-illustration";
import ReviewsSection from "@/app/_components/reviews-section";
import { getBean, type Bean } from "@/lib/api/beans";
import { addToCart } from "@/lib/api/cart";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PROCESS_METHODS } from "@/lib/constants";

export default function BeanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { refreshCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [bean, setBean] = useState<Bean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getBean(params.id)
      .then((data) => {
        if (active) setBean(data);
      })
      .catch(() => {
        if (active) setBean(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleAddToCart() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!bean) return;
    setBusy(true);
    setMessage("");
    try {
      await addToCart(bean._id, quantity);
      await refreshCart();
      setMessage("Added to cart");
    } catch {
      setMessage("Could not add to cart");
    } finally {
      setBusy(false);
    }
  }

  async function handleWishlist() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!bean) return;
    const wasWishlisted = isWishlisted(bean._id);
    setWishlistBusy(true);
    try {
      await toggleWishlist(bean._id);
      setMessage(wasWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setMessage("Could not update wishlist");
    } finally {
      setWishlistBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <Link href="/shop" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
          <ArrowLeft size={14} /> Back to shop
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-roast-900" />
            <div className="space-y-4">
              <div className="h-6 w-1/3 animate-pulse rounded bg-roast-900" />
              <div className="h-10 w-2/3 animate-pulse rounded bg-roast-900" />
              <div className="h-24 animate-pulse rounded bg-roast-900" />
            </div>
          </div>
        ) : !bean ? (
          <div className="rounded-xl border border-dashed border-roast-700 py-20 text-center">
            <p className="font-body text-sm text-ivory-dim">This bean could not be found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-roast-700 bg-roast-900">
                {bean.images?.[activeImage] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bean.images[activeImage]} alt={bean.name} className="h-full w-full object-cover" />
                ) : (
                  <BeanIllustration roastLevel={bean.roastLevel} category={bean.category} />
                )}
              </div>
              {bean.images && bean.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {bean.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border ${
                        idx === activeImage ? "border-gold" : "border-roast-700"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gold-dim">{bean.origin}</span>
              <h1 className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{bean.name}</h1>
              <p className="mt-4 font-body text-sm leading-relaxed text-ivory-dim">{bean.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {bean.tastingNotes.map((note) => (
                  <span key={note} className="rounded-full border border-roast-600 px-3 py-1 font-mono text-[11px] text-ivory-dim">
                    {note}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-roast-700 bg-roast-900 p-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">Roast</span>
                  <div className="mt-1"><RoastDial level={bean.roastLevel} /></div>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">Process</span>
                  <p className="mt-1 font-body text-sm text-ivory">
                    {PROCESS_METHODS.find((p) => p.value === bean.process)?.label || bean.process}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">Weight</span>
                  <p className="mt-1 font-body text-sm text-ivory">{bean.weightGrams}g</p>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">Stock</span>
                  <p className="mt-1 font-body text-sm text-ivory">{bean.stock > 0 ? `${bean.stock} available` : "Sold out"}</p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold text-ivory">Rs {bean.price}</span>
                <span className="font-mono text-sm text-ivory-dim">/ {bean.weightGrams}g</span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-roast-600">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-ivory-dim hover:text-gold"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-ivory">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(bean.stock || 1, q + 1))}
                    className="p-3 text-ivory-dim hover:text-gold"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={busy || bean.stock === 0}
                  className="flex-1 rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-40"
                >
                  {bean.stock === 0 ? "Sold out" : busy ? "Adding..." : "Add to cart"}
                </button>

                <button
                  onClick={handleWishlist}
                  disabled={wishlistBusy}
                  className={`rounded-lg border p-3 transition disabled:opacity-60 ${
                    isWishlisted(bean._id)
                      ? "border-clay/40 text-clay"
                      : "border-roast-600 text-ivory-dim hover:border-gold-dim hover:text-gold"
                  }`}
                  aria-label={isWishlisted(bean._id) ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={isWishlisted(bean._id)}
                >
                  <Heart size={18} fill={isWishlisted(bean._id) ? "currentColor" : "none"} />
                </button>
              </div>

              {message && <p className="mt-3 font-mono text-xs text-moss-bright">{message}</p>}
            </div>
          </div>
        )}

        {bean && <ReviewsSection beanId={bean._id} />}
      </main>

      <Footer />
    </div>
  );
}
