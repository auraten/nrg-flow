import { cn } from "@/lib/utils";
import { ConditionLevel } from "@/types/conditions";

const levelStyles: Record<ConditionLevel, string> = {
  great: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  good: "bg-green-500/20 text-green-300 border-green-500/40",
  caution: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  poor: "bg-red-500/20 text-red-400 border-red-500/40",
  unknown: "bg-stone-500/20 text-stone-400 border-stone-500/40",
};

const dotStyles: Record<ConditionLevel, string> = {
  great: "bg-emerald-400",
  good: "bg-green-400",
  caution: "bg-amber-400",
  poor: "bg-red-400",
  unknown: "bg-stone-500",
};

interface Props {
  level: ConditionLevel;
  label: string;
}

export function ConditionBadge({ level, label }: Props) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap",
        levelStyles[level]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[level])} />
      {label}
    </span>
  );
}
