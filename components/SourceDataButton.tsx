"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GaugeReading, LakeReading } from "@/types/conditions";
import { formatRelativeTime } from "@/lib/utils";

const trendLabel: Record<string, string> = {
  rising: "↑ Rising",
  falling: "↓ Falling",
  steady: "→ Steady",
  unknown: "—",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-stone-800 last:border-0">
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-xs font-mono text-stone-300 text-right">{value}</span>
    </div>
  );
}

interface Props {
  sourceData: GaugeReading | LakeReading;
  sectionName: string;
}

export function SourceDataButton({ sourceData, sectionName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded border border-stone-700 bg-stone-800/50 px-2 py-0.5 text-center text-[10px] leading-tight text-stone-400 transition-colors hover:border-stone-500 hover:bg-stone-700/50 hover:text-stone-200"
        aria-label="View source data"
      >
        View<br />data
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-stone-950 border-stone-800 text-stone-100 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-widest text-stone-300">
              {sectionName}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-1">
            {"siteId" in sourceData ? (
              <GaugeRows gauge={sourceData} />
            ) : (
              <LakeRows lake={sourceData} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GaugeRows({ gauge }: { gauge: GaugeReading }) {
  return (
    <div>
      <Row label="Site" value={`${gauge.siteName} (${gauge.siteId})`} />
      <Row label="Flow" value={gauge.cfs !== null ? `${gauge.cfs.toLocaleString()} CFS` : "—"} />
      <Row label="Gage Height" value={gauge.gageHeight !== null ? `${gauge.gageHeight.toFixed(2)} ft` : "—"} />
      <Row label="Trend" value={trendLabel[gauge.trend]} />
      <Row label="History" value={`${gauge.history.length} readings (48h)`} />
      <Row label="Fetched" value={formatRelativeTime(gauge.fetchedAt)} />
    </div>
  );
}

function LakeRows({ lake }: { lake: LakeReading }) {
  return (
    <div>
      <Row label="Elevation" value={lake.elevationFt !== null ? `${lake.elevationFt.toFixed(2)} ft` : "—"} />
      <Row
        label="24h Change"
        value={
          lake.change24hr !== null
            ? `${lake.change24hr > 0 ? "+" : ""}${lake.change24hr.toFixed(2)} ft`
            : "—"
        }
      />
      <Row label="Trend" value={trendLabel[lake.trend]} />
      <Row label="USACE Updated" value={lake.updatedAt ? formatRelativeTime(lake.updatedAt) : "—"} />
      <Row label="Fetched" value={formatRelativeTime(lake.fetchedAt)} />
    </div>
  );
}
