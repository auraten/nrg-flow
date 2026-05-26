"use client";

interface Point {
  time: string;
  value: number;
}

interface Props {
  data: Point[];
  color?: string;
}

export function TrendSparkline({ data, color = "#6ee7b7" }: Props) {
  if (data.length < 2) {
    return <div className="h-12 w-full opacity-30 text-xs text-stone-500 flex items-center">No trend data</div>;
  }

  const width = 200;
  const height = 48;
  const padding = 2;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const lastX = parseFloat(points[points.length - 1].split(",")[0]);
  const lastY = parseFloat(points[points.length - 1].split(",")[1]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-12"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${padding},${height} ${polyline} ${width - padding},${height}`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}
