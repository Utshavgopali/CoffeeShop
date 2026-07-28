"use client";

export default function PriceRangeSlider({
  min,
  max,
  step = 50,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const [minVal, maxVal] = value;
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="relative h-4 w-full">
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-roast-800" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => onChange([Math.min(Number(e.target.value), maxVal - step), maxVal])}
        className="range-thumb pointer-events-none absolute inset-0 top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => onChange([minVal, Math.max(Number(e.target.value), minVal + step)])}
        className="range-thumb pointer-events-none absolute inset-0 top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
        aria-label="Maximum price"
      />
    </div>
  );
}
