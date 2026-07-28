"use client";

import { Star } from "lucide-react";

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <Star
      size={size}
      className={filled ? "text-gold" : "text-roast-600"}
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    />
  );
}

export function StarRatingDisplay({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.round(value)} size={size} />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  size = 24,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
          className="focus-ring rounded-sm"
        >
          <StarIcon filled={s <= value} size={size} />
        </button>
      ))}
    </div>
  );
}
