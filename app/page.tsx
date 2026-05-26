import { fetchAllGauges } from "@/lib/usgs";
import { fetchSummersvilleLake, getLakeSurfaceTempF } from "@/lib/usace";
import { fetchWeather } from "@/lib/weather";
import { interpretAll, interpretLake } from "@/lib/interpret";
import { FilterableContent, SectionData } from "@/components/FilterableContent";
import { WeatherBar } from "@/components/WeatherBar";
import { RSSWidget } from "@/components/RSSWidget";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [gauges, lake, weather] = await Promise.all([fetchAllGauges(), fetchSummersvilleLake(), fetchWeather()]);
  const { lowerNew, upperNew, gauley } = interpretAll(gauges);
  const lakeActivities = interpretLake(lake);
  const updatedAt = formatRelativeTime(gauges.thurmond.fetchedAt);

  const waterTempF = (c: number | null) =>
    c !== null ? ` · ${Math.round(c * 9 / 5 + 32)}°F water` : "";

  const lakeSurfaceTempF = getLakeSurfaceTempF();
  const lakeSubtitle =
    lake.elevationFt !== null
      ? `${lake.elevationFt.toFixed(2)} ft elevation · ${
          lake.change24hr !== null && lake.change24hr !== 0
            ? `${lake.change24hr > 0 ? "+" : ""}${lake.change24hr.toFixed(2)} ft past 24h`
            : "steady past 24h"
        }${lakeSurfaceTempF !== null ? ` · ~${lakeSurfaceTempF}°F surface` : ""}`
      : "Summersville Dam — USACE";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-4 border-b border-stone-800 pb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">▲</span>
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="text-2xl font-black uppercase tracking-widest text-stone-100 sm:text-3xl">
                NRG Flow
              </h1>
              <p className="text-xs text-stone-600">Updated {updatedAt}</p>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              New River Gorge — Live Conditions
            </p>
          </div>
        </div>
      </header>

      <WeatherBar weather={weather} />

      {/* Sections */}
      <FilterableContent
        sections={[
          {
            id: "lower-new",
            name: "New River — Lower Gorge",
            shortName: "Lower New",
            subtitle: `Gauged at Thurmond, WV${waterTempF(gauges.thurmond.waterTempC)}`,
            activities: lowerNew,
            gaugeSource: "USGS 03185400",
            gaugeUrl: "https://waterdata.usgs.gov/monitoring-location/03185400/",
            sourceData: gauges.thurmond,
          },
          {
            id: "summersville-lake",
            name: "Summersville Lake",
            shortName: "Summersville",
            subtitle: lakeSubtitle,
            activities: lakeActivities,
            gaugeSource: "USACE SUG",
            gaugeUrl: "https://www.lrh-wc.usace.army.mil/wm/?basin/kan/sug",
            sourceData: lake,
          },
          {
            id: "gauley",
            name: "Gauley River",
            shortName: "Gauley",
            subtitle: `Below Summersville Dam — controlled releases${waterTempF(gauges.gauleyBelowDam.waterTempC)}`,
            activities: gauley,
            gaugeSource: "USGS 03189100",
            gaugeUrl: "https://waterdata.usgs.gov/monitoring-location/03189100/",
            sourceData: gauges.gauleyBelowDam,
          },
          {
            id: "upper-new",
            name: "Upper New River",
            shortName: "Upper New",
            subtitle: `Gauged at Hinton, WV — Class I–III paddling${waterTempF(gauges.hinton.waterTempC)}`,
            activities: upperNew,
            gaugeSource: "USGS 03184500",
            gaugeUrl: "https://waterdata.usgs.gov/monitoring-location/03184500/",
            sourceData: gauges.hinton,
          },
        ] satisfies SectionData[]}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-800 pt-6 text-[11px] text-stone-600">
        <RSSWidget />

        <div className="mb-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-700">Gauge Sources</p>
          <ul className="flex flex-col gap-1">
            {[
              { label: "New River — Lower Gorge", source: "USGS 03185400", url: "https://waterdata.usgs.gov/monitoring-location/03185400/" },
              { label: "Summersville Lake", source: "USACE SUG", url: "https://www.lrh-wc.usace.army.mil/wm/?basin/kan/sug" },
              { label: "Gauley River", source: "USGS 03189100", url: "https://waterdata.usgs.gov/monitoring-location/03189100/" },
              { label: "Upper New River", source: "USGS 03184500", url: "https://waterdata.usgs.gov/monitoring-location/03184500/" },
            ].map(({ label, source, url }) => (
              <li key={source} className="flex items-baseline gap-2">
                <span className="text-stone-600">{label}</span>
                <span className="text-stone-800">—</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:text-stone-400 transition-colors"
                >
                  {source} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-center">
          Data sourced from{" "}
          <a
            href="https://waterservices.usgs.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-400 transition-colors"
          >
            USGS Water Services
          </a>
          {" "}and{" "}
          <a
            href="https://www.lrh-wc.usace.army.mil/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-400 transition-colors"
          >
            USACE Huntington District
          </a>
          . Climbing thresholds from{" "}
          <a
            href="https://www.mountainproject.com/area/106010457/whippoorwill"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-400 transition-colors"
          >
            Mountain Project
          </a>
          . Conditions are informational only — always verify before entering the water or on the rock.
        </p>
      </footer>
    </main>
  );
}
