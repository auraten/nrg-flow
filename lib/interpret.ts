import { ActivityCondition, ConditionLevel, GaugeReading, LakeReading, SportCategory } from "@/types/conditions";

interface Interpretation {
  level: ConditionLevel;
  headline: string;
  detail: string;
}

function cfsRafting(cfs: number): Interpretation {
  if (cfs < 1000)
    return {
      level: "poor",
      headline: "Very Low",
      detail: "River is extremely low. Not recommended for rafting or kayaking.",
    };
  if (cfs < 3000)
    return {
      level: "caution",
      headline: "Low",
      detail: "Technical, bony paddling. Navigate around exposed rocks. Suitable for experienced kayakers.",
    };
  if (cfs < 10000)
    return {
      level: "good",
      headline: "Good",
      detail: "Ideal conditions for most paddlers. Class III–IV rapids are active but manageable.",
    };
  if (cfs < 18000)
    return {
      level: "caution",
      headline: "High",
      detail: "River is running high with big wave trains. Experienced paddlers only.",
    };
  if (cfs < 32000)
    return {
      level: "great",
      headline: "Big Water",
      detail: "Big water — 15–20 ft standing waves. Advanced paddlers only.",
    };
  return {
    level: "poor",
    headline: "Flood Stage",
    detail: "River is at flood stage. Do not paddle.",
  };
}

function gageHeightSurfing(ft: number): Interpretation {
  if (ft < 1.5)
    return {
      level: "poor",
      headline: "No Wave",
      detail: "Cunard Wave is not forming. Water is too low for surfing.",
    };
  if (ft < 2.0)
    return {
      level: "caution",
      headline: "Forming",
      detail: "Wave is starting to form. Small and inconsistent — worth checking but not prime.",
    };
  if (ft < 4.5)
    return {
      level: "good",
      headline: "On",
      detail: "Cunard Wave is surfable with decent eddy service. Good conditions.",
    };
  if (ft <= 5.5)
    return {
      level: "great",
      headline: "Prime",
      detail: "Best hole on the river right now. Prime surfing conditions with great eddy service.",
    };
  return {
    level: "caution",
    headline: "Washed Out",
    detail: "Water is too high — the wave has washed out. Check back as levels drop.",
  };
}

function cfsClimbing(cfs: number): Interpretation {
  if (cfs < 5000)
    return {
      level: "great",
      headline: "All Clear",
      detail: "All approach trails are accessible. Dry conditions for climbing.",
    };
  if (cfs < 15000)
    return {
      level: "caution",
      headline: "Partial Access",
      detail: "Some lower approach trails may be flooded. Upper walls generally accessible.",
    };
  return {
    level: "poor",
    headline: "Limited Access",
    detail: "Many lower-gorge approaches are flooded. Stick to Upper Wall areas and ridgeline crags.",
  };
}

function cfsGauley(cfs: number): Interpretation {
  if (cfs < 1000)
    return {
      level: "poor",
      headline: "Not Runnable",
      detail: "Dam release is too low. River is not runnable.",
    };
  if (cfs < 2000)
    return {
      level: "caution",
      headline: "Low Release",
      detail: "Lower Gauley may be runnable. Upper Gauley not recommended at this level.",
    };
  if (cfs <= 4000)
    return {
      level: "great",
      headline: "Season Release",
      detail: "Typical Gauley season release (~2,800 CFS on weekdays). Both Upper and Lower Gauley are running.",
    };
  return {
    level: "good",
    headline: "High Release",
    detail: "High dam release. Big water conditions on both Upper and Lower Gauley.",
  };
}

function cfsUpperNew(cfs: number): Interpretation {
  if (cfs < 500)
    return {
      level: "poor",
      headline: "Very Low",
      detail: "Upper New is very low. Shallow and rocky — not great for paddling.",
    };
  if (cfs < 2000)
    return {
      level: "caution",
      headline: "Low",
      detail: "Class I–II paddling with technical sections. Good for beginners in kayaks.",
    };
  if (cfs < 8000)
    return {
      level: "good",
      headline: "Good",
      detail: "Enjoyable Class I–III conditions. Great for beginners and casual floaters.",
    };
  return {
    level: "caution",
    headline: "High",
    detail: "Upper New is running high. Suitable for intermediate paddlers.",
  };
}

// Thresholds from Mountain Project area descriptions:
// mountainproject.com/area/106010457/whippoorwill
// mountainproject.com/area/105989762/summersville-gauley-river-area
// Full pool is ~1,652 ft. Climbing/bouldering emerges as lake drops.
function elevClimbing(ft: number): Interpretation {
  if (ft >= 1645)
    return {
      level: "poor",
      headline: "Underwater",
      detail:
        "Lake is at or near full pool. All Whippoorwill and Long Point climbing areas are submerged. Deep-water soloing may be possible.",
    };
  if (ft >= 1625)
    return {
      level: "poor",
      headline: "Mostly Submerged",
      detail:
        "Lake is draining but most routes are still underwater. Check back as levels drop toward 1,625 ft.",
    };
  if (ft >= 1620)
    return {
      level: "caution",
      headline: "Emerging",
      detail:
        "At 1,625 ft routes begin appearing: Don Miron, Masuko, Nonameyet, Bongo, Cowboy, Gimme a Clown, Blaze, and Mojo. Expect mud and wet rock.",
    };
  if (ft >= 1600)
    return {
      level: "good",
      headline: "Mostly Accessible",
      detail:
        "Below 1,620 ft most Whippoorwill routes are accessible with some rock-hopping through muddy sections. No wading needed.",
    };
  return {
    level: "great",
    headline: "Fully Accessible",
    detail:
      "Below 1,600 ft all main areas are fully accessible — Whippoorwill, Long Point, and Summersville bouldering. Optimal conditions.",
  };
}

function elevSwimming(ft: number): Interpretation {
  if (ft >= 1640)
    return {
      level: "great",
      headline: "Prime",
      detail: "Lake is high — deep and clear. Long Point cliff jumping and swimming are excellent.",
    };
  if (ft >= 1620)
    return {
      level: "good",
      headline: "Good",
      detail: "Lake is full enough for swimming and boating. Cliff jumping still possible at Long Point.",
    };
  if (ft >= 1600)
    return {
      level: "caution",
      headline: "Low",
      detail: "Lake is on the lower side. Swimming possible but some launch ramps and jump spots may be limited.",
    };
  return {
    level: "poor",
    headline: "Very Low",
    detail: "Lake is very low. Some boat ramps may be unusable. Check USACE for current access.",
  };
}

function formatCfs(cfs: number): string {
  return `${cfs.toLocaleString()} CFS`;
}

function formatFt(ft: number): string {
  return `${ft.toFixed(2)} ft`;
}

export function interpretLake(lake: LakeReading): ActivityCondition[] {
  const ft = lake.elevationFt;
  const climbInterp = ft !== null ? elevClimbing(ft) : null;
  const swimInterp = ft !== null ? elevSwimming(ft) : null;
  const reading = ft !== null ? `${ft.toFixed(2)} ft` : "—";
  // Fake history not available from USACE API — pass empty
  const history: { time: string; value: number }[] = [];

  return [
    {
      id: "lake-climbing",
      label: "Climbing & Bouldering",
      icon: "🧗",
      sport: "climbing" as SportCategory,
      level: climbInterp?.level ?? "unknown",
      headline: climbInterp?.headline ?? "No Data",
      detail: climbInterp?.detail ?? "Unable to fetch lake elevation.",
      reading,
      trend: lake.trend,
      history,
    },
    {
      id: "lake-swimming",
      label: "Swimming & Cliff Jumping",
      icon: "🏊",
      sport: "swimming" as SportCategory,
      level: swimInterp?.level ?? "unknown",
      headline: swimInterp?.headline ?? "No Data",
      detail: swimInterp?.detail ?? "Unable to fetch lake elevation.",
      reading,
      trend: lake.trend,
      history,
    },
  ];
}

export function interpretAll(gauges: {
  thurmond: GaugeReading;
  hinton: GaugeReading;
  gauleyBelowDam: GaugeReading;
}): {
  lowerNew: ActivityCondition[];
  upperNew: ActivityCondition[];
  gauley: ActivityCondition[];
} {
  const { thurmond, hinton, gauleyBelowDam } = gauges;

  // Lower New River activities use Thurmond gauge
  const raftingInterp = thurmond.cfs !== null ? cfsRafting(thurmond.cfs) : null;
  const surfingInterp = thurmond.gageHeight !== null ? gageHeightSurfing(thurmond.gageHeight) : null;
  const climbingInterp = thurmond.cfs !== null ? cfsClimbing(thurmond.cfs) : null;

  const lowerNew: ActivityCondition[] = [
    {
      id: "rafting",
      label: "Rafting & Kayaking",
      icon: "🌊",
      sport: "paddling",
      level: raftingInterp?.level ?? "unknown",
      headline: raftingInterp?.headline ?? "No Data",
      detail: raftingInterp?.detail ?? "Unable to fetch gauge data.",
      reading: thurmond.cfs !== null ? formatCfs(thurmond.cfs) : "—",
      trend: thurmond.trend,
      history: thurmond.history,
    },
    {
      id: "surfing",
      label: "River Surfing (Cunard Wave)",
      icon: "🏄",
      sport: "surfing",
      level: surfingInterp?.level ?? "unknown",
      headline: surfingInterp?.headline ?? "No Data",
      detail: surfingInterp?.detail ?? "Unable to fetch gauge data.",
      reading: thurmond.gageHeight !== null ? formatFt(thurmond.gageHeight) : "—",
      trend: thurmond.trend,
      history: thurmond.history.map((h) => ({ ...h })),
    },
    {
      id: "climbing",
      label: "Rock Climbing Access",
      icon: "🧗",
      sport: "climbing",
      level: climbingInterp?.level ?? "unknown",
      headline: climbingInterp?.headline ?? "No Data",
      detail: climbingInterp?.detail ?? "Unable to fetch gauge data.",
      reading: thurmond.cfs !== null ? formatCfs(thurmond.cfs) : "—",
      trend: thurmond.trend,
      history: thurmond.history,
    },
  ];

  // Upper New River
  const upperNewInterp = hinton.cfs !== null ? cfsUpperNew(hinton.cfs) : null;
  const upperNew: ActivityCondition[] = [
    {
      id: "upper-new-paddling",
      label: "Paddling",
      icon: "🛶",
      sport: "paddling",
      level: upperNewInterp?.level ?? "unknown",
      headline: upperNewInterp?.headline ?? "No Data",
      detail: upperNewInterp?.detail ?? "Unable to fetch gauge data.",
      reading: hinton.cfs !== null ? formatCfs(hinton.cfs) : "—",
      trend: hinton.trend,
      history: hinton.history,
    },
  ];

  // Gauley River
  const gauleyInterp = gauleyBelowDam.cfs !== null ? cfsGauley(gauleyBelowDam.cfs) : null;
  const gauley: ActivityCondition[] = [
    {
      id: "gauley-whitewater",
      label: "Whitewater (Dam Release)",
      icon: "⚡",
      sport: "paddling",
      level: gauleyInterp?.level ?? "unknown",
      headline: gauleyInterp?.headline ?? "No Data",
      detail: gauleyInterp?.detail ?? "Unable to fetch gauge data.",
      reading: gauleyBelowDam.cfs !== null ? formatCfs(gauleyBelowDam.cfs) : "—",
      trend: gauleyBelowDam.trend,
      history: gauleyBelowDam.history,
    },
  ];

  return { lowerNew, upperNew, gauley };
}
