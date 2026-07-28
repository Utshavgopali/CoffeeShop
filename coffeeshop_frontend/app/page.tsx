"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Coffee, Flame, ShieldCheck, Truck } from "lucide-react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import BeanCard from "./_components/bean-card";
import BeanIllustration from "./_components/bean-illustration";
import { listBeans, type Bean } from "@/lib/api/beans";
import { BEAN_CATEGORIES } from "@/lib/constants";

const TRUST_POINTS = [
  { icon: Coffee, label: "Roasted within 48 hours" },
  { icon: Truck, label: "Free shipping, nationwide" },
  { icon: ShieldCheck, label: "Secure checkout via Khalti" },
];

function ShowcaseTile({ bean, className = "" }: { bean: Bean; className?: string }) {
  const image = bean.images?.[0];
  return (
    <Link
      href={`/beans/${bean._id}`}
      className={`group relative block overflow-hidden rounded-2xl border border-roast-700 bg-roast-800 focus-ring ${className}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={bean.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <BeanIllustration roastLevel={bean.roastLevel} category={bean.category} className="h-full w-full" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-gold-bright">{bean.origin}</span>
        <h3 className="font-display text-base leading-snug text-roast-950">{bean.name}</h3>
      </div>
    </Link>
  );
}

function ShowcaseSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-roast-800 ${className}`} />;
}

export default function HomePage() {
  const [heroBeans, setHeroBeans] = useState<Bean[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);

  const [favorites, setFavorites] = useState<Bean[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const [espressoBeans, setEspressoBeans] = useState<Bean[]>([]);
  const [espressoLoading, setEspressoLoading] = useState(true);

  useEffect(() => {
    listBeans({ featured: true, limit: 3 })
      .then((res) => (res.data.length ? res.data : listBeans({ limit: 3 }).then((r) => r.data)))
      .then(setHeroBeans)
      .catch(() => setHeroBeans([]))
      .finally(() => setHeroLoading(false));

    listBeans({ featured: true, limit: 4 })
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setFavoritesLoading(false));

    listBeans({ category: "espresso", limit: 3, sort: "-createdAt" })
      .then((res) => setEspressoBeans(res.data))
      .catch(() => setEspressoBeans([]))
      .finally(() => setEspressoLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-roast-700">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--color-roast-800) 0%, transparent 45%), radial-gradient(circle at 80% 10%, var(--color-roast-800) 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-dim">
                Small-batch · Fresh-roasted
              </span>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] text-ivory sm:text-6xl">
                Roast <span className="italic text-gold">&amp;</span> Origin
              </h1>
              <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ivory-dim">
                Single-origin and blended coffee beans, roasted to order and shipped fresh to your door.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright"
                >
                  Shop beans <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center justify-center gap-2 rounded-full border border-gold-dim px-8 py-3.5 font-body text-sm text-gold transition hover:bg-gold hover:text-ink"
                >
                  Our story
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
              {heroLoading ? (
                <>
                  <ShowcaseSkeleton className="aspect-square sm:aspect-auto sm:row-span-2" />
                  <ShowcaseSkeleton className="aspect-[4/3]" />
                  <ShowcaseSkeleton className="aspect-[4/3]" />
                </>
              ) : heroBeans.length > 0 ? (
                <>
                  <ShowcaseTile bean={heroBeans[0]} className="aspect-square sm:aspect-auto sm:row-span-2" />
                  {heroBeans[1] && <ShowcaseTile bean={heroBeans[1]} className="aspect-[4/3]" />}
                  {heroBeans[2] && <ShowcaseTile bean={heroBeans[2]} className="aspect-[4/3]" />}
                </>
              ) : (
                <div className="col-span-full flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-roast-700">
                  <p className="font-body text-sm text-ivory-dim">Beans coming soon.</p>
                </div>
              )}
            </div>
          </div>

          <div className="relative border-t border-roast-700 bg-roast-900/60">
            <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-roast-700 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {TRUST_POINTS.map((point) => (
                <div key={point.label} className="flex items-center justify-center gap-3 px-6 py-5">
                  <point.icon size={18} className="shrink-0 text-gold-dim" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-wide text-ivory-dim">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop CTA */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-roast-700 bg-roast-900/60 p-8 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">The full catalog</span>
              <h2 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
                Every bean we roast, in one place
              </h2>
              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ivory-dim">
                Filter by origin, roast level, or process — every listing ships within 48 hours of roasting.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {BEAN_CATEGORIES.map((c) => (
                  <Link
                    key={c.value}
                    href={`/shop?category=${c.value}`}
                    className="rounded-full border border-roast-600 px-4 py-1.5 font-body text-xs text-ivory-dim transition hover:border-gold-dim hover:text-gold"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/shop"
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright lg:w-auto"
            >
              Shop all beans <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Fan favorites */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Fan favorites</span>
              <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">Featured beans</h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1.5 font-mono text-xs text-gold-dim transition hover:text-gold sm:flex"
            >
              Shop all <ArrowRight size={14} />
            </Link>
          </div>

          {favoritesLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-roast-800" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <p className="mt-8 font-body text-sm text-ivory-dim">Check back soon for featured beans.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {favorites.map((bean) => (
                <BeanCard key={bean._id} bean={bean} />
              ))}
            </div>
          )}
        </section>

        {/* About Us */}
        <section className="border-y border-roast-700 bg-roast-900/60 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-roast-700 bg-roast-800 lg:order-1">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, var(--color-roast-700) 0%, transparent 55%), radial-gradient(circle at 75% 70%, var(--color-gold-dim) 0%, transparent 45%)",
                }}
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <Coffee size={40} className="text-gold" aria-hidden="true" />
                <p className="max-w-xs font-display text-lg italic text-ivory">
                  &ldquo;Fair to the grower, honest to the drinker.&rdquo;
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">About us</span>
              <h2 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
                A roastery built around one order at a time
              </h2>
              <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-ivory-dim">
                We started Roast &amp; Origin because &ldquo;fresh coffee&rdquo; so rarely means fresh. We roast against
                real orders, trace every bag back to the farm it came from, and pay growers a fair,
                transparent price.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-dim px-7 py-3 font-body text-sm text-gold transition hover:bg-gold hover:text-ink"
              >
                Read our story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Espresso */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">
                <Flame size={14} /> Espresso
              </span>
              <h2 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">Espresso, dialed in</h2>
              <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-ivory-dim">
                Dense, syrupy roasts built for the machine — balanced for crema and body whether you pull
                ristretto or lungo.
              </p>
            </div>
            <Link
              href="/shop?category=espresso"
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright"
            >
              Shop espresso <ArrowRight size={16} />
            </Link>
          </div>

          {espressoLoading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-roast-800" />
              ))}
            </div>
          ) : espressoBeans.length === 0 ? (
            <p className="mt-8 font-body text-sm text-ivory-dim">
              New espresso roasts are on the way — see the full catalog in the meantime.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {espressoBeans.map((bean) => (
                <BeanCard key={bean._id} bean={bean} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
