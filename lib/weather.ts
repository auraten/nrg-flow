// Hardcoded NWS grid for Fayetteville, WV (38.0529, -81.1040) — grid RLX/82,56
const NWS_HOURLY = "https://api.weather.gov/gridpoints/RLX/82,56/forecast/hourly";
const NWS_OBS = "https://api.weather.gov/stations/KBKW/observations/latest";
const NWS_HEADERS = {
  "User-Agent": "nrg-flow/1.0 (auraten@gmail.com)",
  Accept: "application/geo+json",
};
const FETCH_OPTS = { next: { revalidate: 900 }, headers: NWS_HEADERS } as const;

export interface WeatherData {
  tempF: number | null;
  conditions: string | null;
  windMph: number | null;
  precipChancePct: number | null;
  fetchedAt: string;
}

export async function fetchWeather(): Promise<WeatherData> {
  const now = new Date().toISOString();
  const empty: WeatherData = { tempF: null, conditions: null, windMph: null, precipChancePct: null, fetchedAt: now };

  try {
    const [obsRes, hourlyRes] = await Promise.all([
      fetch(NWS_OBS, FETCH_OPTS),
      fetch(NWS_HOURLY, FETCH_OPTS),
    ]);

    let tempF: number | null = null;
    let conditions: string | null = null;
    let windMph: number | null = null;

    if (obsRes.ok) {
      const obs = await obsRes.json();
      const p = obs.properties;
      const tempC = p.temperature?.value;
      if (tempC != null) tempF = Math.round(tempC * 9 / 5 + 32);
      conditions = p.textDescription || null;
      const windKph = p.windSpeed?.value;
      if (windKph != null) windMph = Math.round(windKph * 0.621371);
    }

    let precipChancePct: number | null = null;

    if (hourlyRes.ok) {
      const hourly = await hourlyRes.json();
      const next12 = (hourly.properties.periods as { probabilityOfPrecipitation: { value: number | null } }[]).slice(0, 12);
      const max = Math.max(...next12.map((p) => p.probabilityOfPrecipitation?.value ?? 0));
      if (isFinite(max)) precipChancePct = max;
    }

    return { tempF, conditions, windMph, precipChancePct, fetchedAt: now };
  } catch {
    return empty;
  }
}
