import { fetchAllGauges } from "@/lib/usgs";
import { fetchSummersvilleLake } from "@/lib/usace";
import { interpretAll, interpretLake } from "@/lib/interpret";
import { ActivityCondition, ConditionLevel } from "@/types/conditions";

export const dynamic = "force-dynamic";

const LEVEL_ORDER: Record<ConditionLevel, number> = {
  unknown: 0,
  poor: 1,
  caution: 2,
  good: 3,
  great: 4,
};

function esc(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toRFC2822(iso: string) {
  return new Date(iso).toUTCString();
}

function renderItem(sectionName: string, activity: ActivityCondition, baseUrl: string, fetchedAt: string) {
  const title = esc(`${sectionName} — ${activity.label}: ${activity.headline}`);
  const desc = esc(`${activity.detail} Reading: ${activity.reading}.`);
  const guid = `nrg-flow-${activity.id}-${activity.headline.toLowerCase().replace(/\s+/g, "-")}`;
  return `
    <item>
      <title>${title}</title>
      <description>${desc}</description>
      <link>${baseUrl}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${toRFC2822(fetchedAt)}</pubDate>
    </item>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activityFilter = searchParams.get("activity");
  const minLevel = searchParams.get("minLevel") as ConditionLevel | null;

  const [gauges, lake] = await Promise.all([fetchAllGauges(), fetchSummersvilleLake()]);
  const { lowerNew, upperNew, gauley } = interpretAll(gauges);
  const lakeActivities = interpretLake(lake);
  const fetchedAt = gauges.thurmond.fetchedAt;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const sections = [
    { name: "Lower New River", activities: lowerNew },
    { name: "Summersville Lake", activities: lakeActivities },
    { name: "Gauley River", activities: gauley },
    { name: "Upper New River", activities: upperNew },
  ];

  const items = sections
    .flatMap(({ name, activities }) =>
      activities
        .filter((a) => {
          if (activityFilter && a.id !== activityFilter) return false;
          if (minLevel && LEVEL_ORDER[a.level] < LEVEL_ORDER[minLevel]) return false;
          return true;
        })
        .map((a) => renderItem(name, a, baseUrl, fetchedAt))
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>NRG Flow — Live Conditions</title>
    <link>${baseUrl}</link>
    <description>Real-time river conditions for New River Gorge, WV</description>
    <lastBuildDate>${toRFC2822(fetchedAt)}</lastBuildDate>
    <ttl>15</ttl>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
    },
  });
}
