"use client";

import { useState, useEffect } from "react";

type LevelOption = { id: string; label: string };
type ActivityConfig = { id: string; label: string; levels: LevelOption[] };

const ACTIVITIES: ActivityConfig[] = [
  {
    id: "rafting",
    label: "Rafting & Kayaking (Lower New)",
    levels: [
      { id: "caution", label: "Low or better" },
      { id: "good", label: "Good or better" },
      { id: "great", label: "Big Water" },
    ],
  },
  {
    id: "surfing",
    label: "River Surfing (Lower New)",
    levels: [
      { id: "caution", label: "Forming or better" },
      { id: "good", label: "On or better" },
      { id: "great", label: "Prime" },
    ],
  },
  {
    id: "climbing",
    label: "Rock Climbing (Lower New)",
    levels: [
      { id: "caution", label: "Partial Access or better" },
      { id: "great", label: "All Clear" },
    ],
  },
  {
    id: "gauley-whitewater",
    label: "Whitewater (Gauley)",
    levels: [
      { id: "caution", label: "Low Release or better" },
      { id: "good", label: "High Release or better" },
      { id: "great", label: "Season Release" },
    ],
  },
  {
    id: "upper-new-paddling",
    label: "Paddling (Upper New)",
    levels: [
      { id: "caution", label: "Low or better" },
      { id: "good", label: "Good" },
    ],
  },
  {
    id: "lake-climbing",
    label: "Climbing (Summersville Lake)",
    levels: [
      { id: "caution", label: "Emerging or better" },
      { id: "good", label: "Mostly Accessible or better" },
      { id: "great", label: "Fully Accessible" },
    ],
  },
  {
    id: "lake-swimming",
    label: "Swimming (Summersville Lake)",
    levels: [
      { id: "caution", label: "Low or better" },
      { id: "good", label: "Good or better" },
      { id: "great", label: "Prime" },
    ],
  },
];

function FeedRow({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const readers = [
    { label: "Feeder", href: `https://feeder.co/discover?url=${encodeURIComponent(url)}` },
    { label: "Feedly", href: `https://feedly.com/i/subscription/feed/${encodeURIComponent(url)}` },
    { label: "Inoreader", href: `https://www.inoreader.com/?add_feed=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <div className="flex items-center gap-1.5 rounded border border-stone-800 bg-stone-900/50 px-2 py-1">
        <span className="select-all font-mono text-[11px] text-stone-500">{url}</span>
        <button
          onClick={copy}
          className="text-[10px] text-stone-600 transition-colors hover:text-stone-300"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {readers.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-stone-600 transition-colors hover:text-stone-400"
        >
          Add to {label} ↗
        </a>
      ))}
    </div>
  );
}

export function RSSWidget() {
  const [origin, setOrigin] = useState("");
  const [activity, setActivity] = useState("surfing");
  const [minLevel, setMinLevel] = useState("good");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const selectedActivity = ACTIVITIES.find((a) => a.id === activity) ?? ACTIVITIES[0];

  function handleActivityChange(newId: string) {
    const act = ACTIVITIES.find((a) => a.id === newId)!;
    setActivity(newId);
    if (!act.levels.find((l) => l.id === minLevel)) {
      setMinLevel(act.levels[0].id);
    }
  }

  const baseFeedUrl = origin ? `${origin}/feed.xml` : "…";
  const customFeedUrl = origin
    ? `${origin}/feed.xml?activity=${activity}&minLevel=${minLevel}`
    : "…";

  const selectClass =
    "rounded border border-stone-700 bg-stone-800 px-2 py-0.5 text-[11px] text-stone-300 focus:outline-none";

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-700">
          RSS Feed — All Conditions
        </p>
        <FeedRow url={baseFeedUrl} />
      </div>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-700">
          RSS Feed — Custom
        </p>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
          <span>Notify me when</span>
          <select value={activity} onChange={(e) => handleActivityChange(e.target.value)} className={selectClass}>
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <span>is</span>
          <select value={minLevel} onChange={(e) => setMinLevel(e.target.value)} className={selectClass}>
            {selectedActivity.levels.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
        <FeedRow url={customFeedUrl} />
      </div>
    </div>
  );
}
