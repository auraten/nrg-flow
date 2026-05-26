export type ConditionLevel = "great" | "good" | "caution" | "poor" | "unknown";

export type SportCategory = "paddling" | "surfing" | "climbing" | "swimming";

export interface GaugeReading {
  siteId: string;
  siteName: string;
  cfs: number | null;
  gageHeight: number | null;
  waterTempC: number | null;
  unit: string;
  trend: "rising" | "falling" | "steady" | "unknown";
  history: { time: string; value: number }[];
  fetchedAt: string;
}

export interface ActivityCondition {
  id: string;
  label: string;
  icon: string;
  sport: SportCategory;
  level: ConditionLevel;
  headline: string;
  detail: string;
  reading: string;
  trend: "rising" | "falling" | "steady" | "unknown";
  history: { time: string; value: number }[];
}

export interface LakeReading {
  elevationFt: number | null;
  change24hr: number | null;
  trend: "rising" | "falling" | "steady" | "unknown";
  updatedAt: string | null;
  fetchedAt: string;
}

export interface WaterwaySection {
  id: string;
  name: string;
  activities: ActivityCondition[];
}
