import { WeatherData } from "@/lib/weather";
import { cn } from "@/lib/utils";

interface Props {
  weather: WeatherData;
}

export function WeatherBar({ weather }: Props) {
  const { tempF, conditions, windMph, precipChancePct } = weather;
  const hasAny = tempF !== null || conditions !== null || windMph !== null || precipChancePct !== null;
  if (!hasAny) return null;

  const highPrecip = precipChancePct !== null && precipChancePct >= 50;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg border border-stone-800 bg-stone-900/30 px-4 py-2 text-xs text-stone-400">
      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
        Near Fayetteville
      </span>

      {tempF !== null && (
        <Stat label="Air">{tempF}°F{conditions ? ` · ${conditions}` : ""}</Stat>
      )}

      {windMph !== null && windMph > 0 && (
        <Stat label="Wind">{windMph} mph</Stat>
      )}
      {windMph === 0 && (
        <Stat label="Wind">Calm</Stat>
      )}

      {precipChancePct !== null && (
        <Stat label="Rain next 12h">
          <span className={cn(highPrecip && "text-amber-400 font-medium")}>
            {precipChancePct}%
          </span>
        </Stat>
      )}
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span>
      <span className="text-stone-600">{label}: </span>
      {children}
    </span>
  );
}
