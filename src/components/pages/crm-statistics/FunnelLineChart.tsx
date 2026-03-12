interface IFunnelPoint {
  label: string;
  rate: number;
  count: number;
  avgRange: string;
}

interface IFunnelLineChartProps {
  points: IFunnelPoint[];
}

// Log scale normalize: maps 0-100% to visual 0-1 range using log(x+1)/log(101)
function normalize(value: number): number {
  return Math.log(value + 1) / Math.log(101);
}

export function FunnelLineChart({ points }: IFunnelLineChartProps) {
  const W = 680;
  const H = 140;
  const padX = 60;
  const padY = 20;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + (1 - normalize(p.rate)) * innerH;
    return { x, y };
  });

  // Build smooth cubic bezier path
  const pathD = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = coords[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  // Area fill path
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${H - padY + 4} L ${coords[0].x} ${H - padY + 4} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full" style={{ height: '160px' }}>
        <defs>
          <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill="url(#funnelGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Points + labels */}
        {coords.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={5} fill="#6366f1" stroke="white" strokeWidth="2" />
            {/* Rate label above point */}
            <text
              x={pt.x}
              y={pt.y - 10}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#3730a3"
            >
              {points[i].rate}%
            </text>
            {/* Stage label below x-axis */}
            <text
              x={pt.x}
              y={H + 14}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {points[i].label}
            </text>
            {/* Count below stage label */}
            <text
              x={pt.x}
              y={H + 28}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
            >
              {points[i].count.toLocaleString()}건
            </text>
          </g>
        ))}

        {/* Baseline */}
        <line
          x1={padX}
          y1={H - padY + 4}
          x2={W - padX}
          y2={H - padY + 4}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
