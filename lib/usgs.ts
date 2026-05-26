import { GaugeReading } from "@/types/conditions";
import { GAUGES, PARAM_CODES } from "./gauges";

const USGS_BASE = "https://waterservices.usgs.gov/nwis/iv/";

interface USGSTimeSeries {
  sourceInfo: { siteName: string; siteCode: [{ value: string }] };
  variable: { variableCode: [{ value: string }] };
  values: [{ value: { dateTime: string; value: string }[] }];
}

interface USGSResponse {
  value: { timeSeries: USGSTimeSeries[] };
}

function detectTrend(
  history: { time: string; value: number }[]
): "rising" | "falling" | "steady" | "unknown" {
  if (history.length < 4) return "unknown";
  const recent = history.slice(-4).map((h) => h.value);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const delta = last - first;
  const pct = Math.abs(delta) / (first || 1);
  if (pct < 0.02) return "steady";
  return delta > 0 ? "rising" : "falling";
}

async function fetchGauge(
  siteId: string,
  paramCode: string
): Promise<{ current: number | null; history: { time: string; value: number }[] }> {
  const url = `${USGS_BASE}?format=json&sites=${siteId}&parameterCd=${paramCode}&period=P2D`;
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) return { current: null, history: [] };

  const data: USGSResponse = await res.json();
  const series = data.value.timeSeries.find(
    (s) => s.sourceInfo.siteCode[0].value === siteId
  );
  if (!series) return { current: null, history: [] };

  const values = series.values[0].value;
  if (!values.length) return { current: null, history: [] };

  // Downsample to ~48 points (one per ~hour) for sparkline
  const step = Math.max(1, Math.floor(values.length / 48));
  const history = values
    .filter((_, i) => i % step === 0)
    .map((v) => ({ time: v.dateTime, value: parseFloat(v.value) }))
    .filter((v) => !isNaN(v.value));

  const latest = parseFloat(values[values.length - 1].value);
  return { current: isNaN(latest) ? null : latest, history };
}

export async function fetchAllGauges(): Promise<Record<keyof typeof GAUGES, GaugeReading>> {
  const now = new Date().toISOString();

  const [thurmondCfs, thurmondHeight, thurmondTemp, hintonCfs, hintonTemp, gauleyBelowDamCfs, gauleyTemp] =
    await Promise.all([
      fetchGauge(GAUGES.thurmond.siteId, PARAM_CODES.cfs),
      fetchGauge(GAUGES.thurmond.siteId, PARAM_CODES.gage_height),
      fetchGauge(GAUGES.thurmond.siteId, PARAM_CODES.water_temp),
      fetchGauge(GAUGES.hinton.siteId, PARAM_CODES.cfs),
      fetchGauge(GAUGES.hinton.siteId, PARAM_CODES.water_temp),
      fetchGauge(GAUGES.gauleyBelowDam.siteId, PARAM_CODES.cfs),
      fetchGauge(GAUGES.gauleyBelowDam.siteId, PARAM_CODES.water_temp),
    ]);

  return {
    thurmond: {
      siteId: GAUGES.thurmond.siteId,
      siteName: GAUGES.thurmond.name,
      cfs: thurmondCfs.current,
      gageHeight: thurmondHeight.current,
      waterTempC: thurmondTemp.current,
      unit: "cfs",
      trend: detectTrend(thurmondCfs.history),
      history: thurmondCfs.history,
      fetchedAt: now,
    },
    hinton: {
      siteId: GAUGES.hinton.siteId,
      siteName: GAUGES.hinton.name,
      cfs: hintonCfs.current,
      gageHeight: null,
      waterTempC: hintonTemp.current,
      unit: "cfs",
      trend: detectTrend(hintonCfs.history),
      history: hintonCfs.history,
      fetchedAt: now,
    },
    gauleyBelowDam: {
      siteId: GAUGES.gauleyBelowDam.siteId,
      siteName: GAUGES.gauleyBelowDam.name,
      cfs: gauleyBelowDamCfs.current,
      gageHeight: null,
      waterTempC: gauleyTemp.current,
      unit: "cfs",
      trend: detectTrend(gauleyBelowDamCfs.history),
      history: gauleyBelowDamCfs.history,
      fetchedAt: now,
    },
  };
}
