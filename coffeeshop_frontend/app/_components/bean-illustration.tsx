import { Coffee, Layers, Leaf, MapPin } from "lucide-react";
import { ROAST_LEVELS, type RoastLevel, type BeanCategory } from "@/lib/constants";

const CATEGORY_ICON: Record<BeanCategory, typeof Coffee> = {
  "single-origin": MapPin,
  blend: Layers,
  espresso: Coffee,
  decaf: Leaf,
};

export default function BeanIllustration({
  roastLevel,
  category,
  className = "",
}: {
  roastLevel: RoastLevel;
  category: BeanCategory;
  className?: string;
}) {
  const wash = ROAST_LEVELS.find((r) => r.value === roastLevel)?.wash ?? ROAST_LEVELS[1].wash;
  const Icon = CATEGORY_ICON[category] ?? MapPin;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ring-1 ring-inset ring-ink/10 ${className}`}
      style={{ backgroundColor: wash }}
      aria-hidden="true"
    >
      <svg width="60%" height="60%" viewBox="0 0 64 64" fill="none" className="max-h-24 max-w-24">
        <path
          d="M18 20c0-6 6-10 14-10s14 4 14 10l3 30c.5 5-3.5 9-8.5 9H23.5c-5 0-9-4-8.5-9l3-30Z"
          stroke="var(--color-ink)"
          strokeOpacity="0.75"
          strokeWidth="1.75"
        />
        <path
          d="M25 12c-1-2-1-4 .5-6M32 10c0-2.2.6-3.8 2-5.2M39 12c1-2 1-4-.5-6"
          stroke="var(--color-ink)"
          strokeOpacity="0.65"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="32" cy="34" r="6" stroke="var(--color-ink)" strokeOpacity="0.75" strokeWidth="1.4" />
      </svg>
      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-roast-900/85 text-ink shadow-sm backdrop-blur">
        <Icon size={15} />
      </span>
    </div>
  );
}
