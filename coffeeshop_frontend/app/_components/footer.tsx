import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-roast-700 bg-roast-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ivory-dim">
            Small-batch beans, roasted weekly and shipped within 48 hours of order.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold-dim">Shop</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-ivory-dim">
            <li><Link href="/shop" className="hover:text-gold">All beans</Link></li>
            <li><Link href="/shop?category=single-origin" className="hover:text-gold">Single origin</Link></li>
            <li><Link href="/shop?category=espresso" className="hover:text-gold">Espresso</Link></li>
            <li><Link href="/shop?category=decaf" className="hover:text-gold">Decaf</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold-dim">Company</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-ivory-dim">
            <li><Link href="/about" className="hover:text-gold">About us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold-dim">Account</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-ivory-dim">
            <li><Link href="/orders" className="hover:text-gold">Order history</Link></li>
            <li><Link href="/wishlist" className="hover:text-gold">Wishlist</Link></li>
            <li><Link href="/profile" className="hover:text-gold">Profile settings</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold-dim">Payments</h3>
          <p className="mt-4 font-body text-sm text-ivory-dim">
            Secure checkout powered by Khalti.
          </p>
        </div>
      </div>
      <div className="border-t border-roast-800 px-5 py-6 text-center font-mono text-xs text-ivory-dim/60">
        © {new Date().getFullYear()} Roast &amp; Origin. All beans, no filler.
      </div>
    </footer>
  );
}