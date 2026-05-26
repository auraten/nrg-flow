export interface GaugeConfig {
  siteId: string;
  name: string;
  parameters: ("cfs" | "gage_height")[];
}

export const GAUGES = {
  thurmond: {
    siteId: "03185400",
    name: "New River at Thurmond, WV",
    parameters: ["cfs", "gage_height"],
  },
  hinton: {
    siteId: "03184500",
    name: "New River at Hinton, WV",
    parameters: ["cfs"],
  },
  gauleyBelowDam: {
    siteId: "03189100",
    name: "Gauley River near Craigsville, WV",
    parameters: ["cfs"],
  },
} as const satisfies Record<string, GaugeConfig>;

export const PARAM_CODES = {
  cfs: "00060",
  gage_height: "00065",
  water_temp: "00010",
} as const;
