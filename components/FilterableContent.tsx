"use client";

import { useState } from "react";
import { ActivityCondition, GaugeReading, LakeReading, SportCategory } from "@/types/conditions";
import { WaterwaySection } from "./WaterwaySection";
import { cn } from "@/lib/utils";

export type SectionData = {
  id: string;
  name: string;
  shortName: string;
  subtitle?: string;
  activities: ActivityCondition[];
  gaugeSource?: string;
  gaugeUrl?: string;
  sourceData?: GaugeReading | LakeReading;
};

type SportFilter = SportCategory | "all";

const SPORTS: { id: SportFilter; label: string; icon: string }[] = [
  { id: "all", label: "All Sports", icon: "" },
  { id: "paddling", label: "Paddling", icon: "🌊" },
  { id: "surfing", label: "Surfing", icon: "🏄" },
  { id: "climbing", label: "Climbing", icon: "🧗" },
  { id: "swimming", label: "Swimming", icon: "🏊" },
];

interface Props {
  sections: SectionData[];
}

export function FilterableContent({ sections }: Props) {
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");
  const [waterwayFilter, setWaterwayFilter] = useState<string>("all");

  const waterways = [
    { id: "all", label: "All Waterways" },
    ...sections.map((s) => ({ id: s.id, label: s.shortName })),
  ];

  const filteredSections = sections
    .filter((s) => waterwayFilter === "all" || s.id === waterwayFilter)
    .map((s) => ({
      ...s,
      activities:
        sportFilter === "all"
          ? s.activities
          : s.activities.filter((a) => a.sport === sportFilter),
    }))
    .filter((s) => s.activities.length > 0);

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 rounded-xl border border-stone-800 bg-stone-900/40 px-4 py-2.5">
        <FilterRow
          label="Sport"
          options={SPORTS}
          value={sportFilter}
          onChange={(v) => setSportFilter(v as SportFilter)}
        />
        <FilterRow
          label="Waterway"
          options={waterways}
          value={waterwayFilter}
          onChange={setWaterwayFilter}
        />
      </div>

      <div className="flex flex-col gap-10">
        {filteredSections.length === 0 ? (
          <p className="py-12 text-center text-sm text-stone-500">
            No results for the selected filters.
          </p>
        ) : (
          filteredSections.map((s) => (
            <WaterwaySection
              key={s.id}
              name={s.name}
              subtitle={s.subtitle}
              activities={s.activities}
              sourceData={s.sourceData}
            />
          ))
        )}
      </div>
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string; icon?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-widest text-stone-600">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
              value === opt.id
                ? "bg-stone-200 text-stone-900"
                : "bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200"
            )}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
