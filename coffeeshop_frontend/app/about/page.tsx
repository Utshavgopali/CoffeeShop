import Link from "next/link";
import { ArrowRight, Flame, Handshake, Leaf, MapPin, Package, Sprout } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

const VALUES = [
  {
    icon: MapPin,
    title: "Direct-trade sourcing",
    body: "We work straight with growers across Ethiopia, Colombia, and Guatemala, paying above market rate for lots we'd actually want to drink ourselves.",
  },
  {
    icon: Flame,
    title: "Roasted to order",
    body: "Nothing sits on a shelf. Every bag is roasted after you order and shipped within 48 hours, so what arrives is genuinely fresh.",
  },
  {
    icon: Sprout,
    title: "Traceable, honest labeling",
    body: "Origin, process, and roast date are printed on every bag — no vague blends hiding where the coffee actually came from.",
  },
  {
    icon: Leaf,
    title: "Low-waste roasting",
    body: "Chaff is composted, packaging is recyclable kraft, and we roast in small batches to cut down on unsold, wasted stock.",
  },
];

const STATS = [
  { value: "12+", label: "Origin farms partnered" },
  { value: "48 hrs", label: "Roast-to-doorstep" },
  { value: "6", label: "Years roasting" },
  { value: "20k+", label: "Bags shipped" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-roast-700">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--color-roast-800) 0%, transparent 45%), radial-gradient(circle at 80% 10%, var(--color-roast-800) 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-dim">Our story</span>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ivory sm:text-5xl md:text-6xl">
              Coffee, traced back to the <span className="italic text-gold">people</span> who grew it
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ivory-dim">
              Roast &amp; Origin started as a single roaster in a rented kitchen with one question: why does
              &ldquo;fresh coffee&rdquo; so rarely mean fresh? Today we roast every order to spec, in small
              batches, and ship it before the roast has even finished cooling.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">Why we exist</span>
              <h2 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
                Most bags labeled &ldquo;fresh&rdquo; have already sat in a warehouse for months
              </h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-ivory-dim">
                We roast against real orders, not sales forecasts. That means no backstock quietly going stale,
                and it means we can afford to pay growers a fair, transparent price instead of squeezing margin
                out of a commodity market.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ivory-dim">
                Every bean on this site is one we&apos;ve cupped, scored, and would happily brew at home — single
                origin, blend, decaf, or espresso.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright"
              >
                Shop the current roast <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-roast-700 bg-roast-800">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, var(--color-roast-700) 0%, transparent 55%), radial-gradient(circle at 75% 70%, var(--color-gold-dim) 0%, transparent 45%)",
                }}
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <Handshake size={48} className="text-gold" aria-hidden="true" />
                <p className="max-w-xs font-display text-lg italic text-ivory">
                  &ldquo;Fair to the grower, honest to the drinker.&rdquo;
                </p>
                <span className="font-mono text-xs uppercase tracking-widest text-gold-dim">
                  Our sourcing principle, since day one
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-roast-700 bg-roast-900/60 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-dim">What we stand for</span>
              <h2 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">How we run this roastery</h2>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-xl border border-roast-700 bg-roast-950 p-6">
                  <v.icon size={22} className="text-gold" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg text-ivory">{v.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ivory-dim">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl text-gold sm:text-4xl">{s.value}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-ivory-dim">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-roast-700 bg-roast-900/60">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-16 text-center sm:py-20">
            <Package size={30} className="text-gold" aria-hidden="true" />
            <h2 className="font-display text-2xl text-ivory sm:text-3xl">Ready to taste what fresh actually means?</h2>
            <p className="max-w-md font-body text-sm leading-relaxed text-ivory-dim">
              Browse the current roast list — every bag ships within 48 hours of your order.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright"
            >
              Go to shop <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
