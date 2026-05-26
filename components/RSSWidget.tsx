"use client";

import { useState, useEffect } from "react";

export function RSSWidget() {
  const [feedUrl, setFeedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/feed.xml`);
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const readers = [
    { label: "Feeder", href: `https://feeder.co/discover?url=${feedUrl}` },
    { label: "Feedly", href: `https://feedly.com/i/subscription/feed/${feedUrl}` },
    { label: "Inoreader", href: `https://www.inoreader.com/?add_feed=${feedUrl}` },
  ];

  return (
    <div className="mb-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-700">
        RSS Feed
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded border border-stone-800 bg-stone-900/50 px-2 py-1">
          <span className="font-mono text-[11px] text-stone-500 select-all">
            {feedUrl || "loading…"}
          </span>
          <button
            onClick={copy}
            className="ml-1 text-[10px] text-stone-600 hover:text-stone-300 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <span className="text-stone-700">·</span>
        {readers.map(({ label, href }) => (
          <a
            key={label}
            href={feedUrl ? href : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-stone-600 hover:text-stone-400 transition-colors"
          >
            Add to {label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}
