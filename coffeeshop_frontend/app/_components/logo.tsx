import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 focus-ring rounded-sm ${className}`}
      aria-label="Roast & Origin home"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="var(--color-gold)" strokeWidth="1.5" />
        <path
          d="M10 13.5c0-2 1.6-3.5 3.5-3.5h5c1.9 0 3.5 1.5 3.5 3.5v4a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6v-4Z"
          stroke="var(--color-gold)"
          strokeWidth="1.4"
        />
        <path d="M21 14.5h1.2c1.1 0 2 .9 2 2s-.9 2-2 2H21" stroke="var(--color-gold)" strokeWidth="1.4" />
        <path d="M13.5 8c-.6-.9-.4-1.6.3-2.4M16.3 8c-.6-.9-.4-1.6.3-2.4" stroke="var(--color-gold-dim)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-wide text-ivory">
          Roast <span className="text-gold italic">&amp;</span> Origin
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-gold-dim">
          Soul Coffee
        </span>
      </span>
    </Link>
  );
}