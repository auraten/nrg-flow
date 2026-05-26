import { ActivityCondition, GaugeReading, LakeReading } from "@/types/conditions";
import { ActivityCard } from "./ActivityCard";
import { SourceDataButton } from "./SourceDataButton";

interface Props {
  name: string;
  subtitle?: string;
  activities: ActivityCondition[];
  sourceData?: GaugeReading | LakeReading;
}

export function WaterwaySection({ name, subtitle, activities, sourceData }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-stone-200">
            {name}
          </h2>
          {subtitle && (
            <p className="text-xs text-stone-500">{subtitle}</p>
          )}
        </div>
        {sourceData && (
          <SourceDataButton sourceData={sourceData} sectionName={name} />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((a) => (
          <ActivityCard key={a.id} activity={a} />
        ))}
      </div>
    </section>
  );
}
