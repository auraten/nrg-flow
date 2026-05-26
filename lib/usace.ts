import { LakeReading } from "@/types/conditions";

const LAKE_SURFACE_TEMP_F: Partial<Record<number, number>> = {
  4: 52, 5: 68, 6: 70, 7: 75, 8: 80, 9: 75, 10: 68,
};

export function getLakeSurfaceTempF(): number | null {
  return LAKE_SURFACE_TEMP_F[new Date().getMonth() + 1] ?? null;
}

const SUMMERSVILLE_URL =
  "https://www.lrh-wc.usace.army.mil/wm/data/json/projects/sug_15M.min.json.js";

interface USACEPoolCurrent {
  elev: number;
  elev_updated: string;
  chng_24_hr: number;
  inflow: number;
}

interface USACEResponse {
  sug: {
    pool_cur: USACEPoolCurrent;
  };
}

export async function fetchSummersvilleLake(): Promise<LakeReading> {
  const now = new Date().toISOString();

  try {
    const res = await fetch(SUMMERSVILLE_URL, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: USACEResponse = await res.json();
    const pool = data.sug.pool_cur;

    const change = pool.chng_24_hr ?? 0;
    let trend: LakeReading["trend"] = "steady";
    if (Math.abs(change) >= 0.05) {
      trend = change > 0 ? "rising" : "falling";
    }

    return {
      elevationFt: pool.elev,
      change24hr: change,
      trend,
      updatedAt: pool.elev_updated,
      fetchedAt: now,
    };
  } catch {
    return {
      elevationFt: null,
      change24hr: null,
      trend: "unknown",
      updatedAt: null,
      fetchedAt: now,
    };
  }
}
