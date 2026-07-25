import { ROAST_LEVELS, type RoastLevel } from "@/lib/constants";

export default function RoastDial({ level }: { level: RoastLevel }) {
  const info = ROAST_LEVELS.find((r) => r.value === level) ?? ROAST_LEVELS[1];
  return (
    <div className="flex items-center gap-2">
      <span className="roast-dial w-16" style={{ ["--dial-fill" as string]: info.dial }} aria-hidden="true" />
      <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim">{info.label}</span>
    </div>
  );
}