import { ActivityCondition, ConditionLevel } from "@/types/conditions";
import { ConditionBadge } from "./ConditionBadge";
import { TrendSparkline } from "./TrendSparkline";
import { cn } from "@/lib/utils";

const trendIcon: Record<string, string> = {
  rising: "↑",
  falling: "↓",
  steady: "→",
  unknown: "",
};

const trendColor: Record<string, string> = {
  rising: "text-amber-400",
  falling: "text-sky-400",
  steady: "text-stone-400",
  unknown: "text-stone-500",
};

const sparklineColor: Record<ConditionLevel, string> = {
  great: "#34d399",
  good: "#86efac",
  caution: "#fbbf24",
  poor: "#f87171",
  unknown: "#78716c",
};

const cardBorder: Record<ConditionLevel, string> = {
  great: "border-emerald-800/50",
  good: "border-green-800/50",
  caution: "border-amber-800/50",
  poor: "border-red-900/50",
  unknown: "border-stone-700/50",
};

interface Props {
  activity: ActivityCondition;
}

export function ActivityCard({ activity }: Props) {
  const { label, icon, level, headline, detail, reading, trend, history } = activity;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-stone-900/60 p-4 backdrop-blur-sm",
        cardBorder[level]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-medium text-stone-300">{label}</span>
        </div>
        <ConditionBadge level={level} label={headline} />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-stone-100">
          {reading}
        </span>
        <span className={cn("text-sm font-semibold", trendColor[trend])}>
          {trendIcon[trend]}
          {trend !== "unknown" && (
            <span className="ml-0.5 text-xs font-normal">{trend}</span>
          )}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-stone-400">{detail}</p>

      <div className="-mx-1">
        <TrendSparkline data={history} color={sparklineColor[level]} />
        <p className="mt-1 text-right text-[10px] text-stone-600">48-hour trend</p>
      </div>
    </div>
  );
}
