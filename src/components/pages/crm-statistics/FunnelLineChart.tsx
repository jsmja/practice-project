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

/** "평균 8-20%" → { min: 8, max: 20, mid: 14 } */
function parseAvgRange(avgRange: string): { min: number; max: number; mid: number } {
  const match = avgRange.match(/(\d+)-(\d+)/);
  if (!match) return { min: 0, max: 0, mid: 0 };
  const min = Number(match[1]);
  const max = Number(match[2]);
  return { min, max, mid: (min + max) / 2 };
}

export function FunnelLineChart({ points }: IFunnelLineChartProps) {
  const W = 900;
  const H = 180;
  const padX = 60;
  const padY = 20;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + (1 - normalize(p.rate)) * innerH;
    return { x, y };
  });

  // 평균 좌표
  const avgCoords = points.map((p, i) => {
    const avg = parseAvgRange(p.avgRange);
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + (1 - normalize(avg.mid)) * innerH;
    const yMin = padY + (1 - normalize(avg.min)) * innerH;
    const yMax = padY + (1 - normalize(avg.max)) * innerH;
    return { x, y, yMin, yMax, avg };
  });

  // Build smooth cubic bezier path
  const buildPath = (pts: Array<{ x: number; y: number }>) =>
    pts.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = pts[i - 1];
      const cpX = (prev.x + pt.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');

  const pathD = buildPath(coords);
  const avgPathD = buildPath(avgCoords);

  // Area fill path
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${H - padY + 4} L ${coords[0].x} ${H - padY + 4} Z`;

  // 평균 범위 영역
  const avgAreaTop = points.map((p, i) => {
    const avg = parseAvgRange(p.avgRange);
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + (1 - normalize(avg.max)) * innerH;
    return { x, y };
  });
  const avgAreaBottom = points.map((p, i) => {
    const avg = parseAvgRange(p.avgRange);
    const x = padX + (i / (points.length - 1)) * innerW;
    const y = padY + (1 - normalize(avg.min)) * innerH;
    return { x, y };
  });
  const avgRangePathTop = buildPath(avgAreaTop);
  const avgRangeArea = `${avgRangePathTop} L ${avgAreaBottom[avgAreaBottom.length - 1].x} ${avgAreaBottom[avgAreaBottom.length - 1].y} ${avgAreaBottom.slice().reverse().reduce((acc, pt, i) => {
    if (i === 0) return `L ${pt.x} ${pt.y}`;
    const prev = avgAreaBottom.slice().reverse()[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '')} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H + 50}`} className="w-full" style={{ height: '240px' }}>
        <defs>
          <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* 평균 범위 영역 (연한 주황) */}
        <path d={avgRangeArea} fill="#f59e0b" fillOpacity="0.08" />

        {/* 평균 라인 (점선) */}
        <path d={avgPathD} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />

        {/* 실적 Area fill */}
        <path d={areaD} fill="url(#funnelGrad)" />

        {/* 실적 Line */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Points + labels */}
        {coords.map((pt, i) => {
          const avg = parseAvgRange(points[i].avgRange);
          const diff = points[i].rate - avg.mid;
          const isAbove = diff >= 0;
          return (
            <g key={i}>
              {/* 실적 점 */}
              <circle cx={pt.x} cy={pt.y} r={5} fill="#6366f1" stroke="white" strokeWidth="2" />
              {/* 평균 점 */}
              <circle cx={avgCoords[i].x} cy={avgCoords[i].y} r={3} fill="#f59e0b" stroke="white" strokeWidth="1.5" />

              {/* 실적 Rate */}
              <text x={pt.x} y={pt.y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#3730a3">
                {points[i].rate}%
              </text>
              {/* 평균 대비 차이 */}
              <text x={pt.x} y={pt.y - 24} textAnchor="middle" fontSize="9" fill={isAbove ? '#16a34a' : '#dc2626'}>
                {isAbove ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%p
              </text>

              {/* 평균값 */}
              <text x={avgCoords[i].x + 12} y={avgCoords[i].y + 3} textAnchor="start" fontSize="9" fill="#d97706">
                평균 {avg.mid}%
              </text>

              {/* Stage label */}
              <text x={pt.x} y={H + 14} textAnchor="middle" fontSize="11" fill="#6b7280">
                {points[i].label}
              </text>
              {/* Count */}
              <text x={pt.x} y={H + 28} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {points[i].count.toLocaleString()}건
              </text>
              {/* 평균 범위 */}
              <text x={pt.x} y={H + 40} textAnchor="middle" fontSize="9" fill="#d97706">
                ({points[i].avgRange})
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={padX} y1={H - padY + 4} x2={W - padX} y2={H - padY + 4} stroke="#e5e7eb" strokeWidth="1" />
      </svg>

      {/* 범례 */}
      <div className="mt-1 flex items-center justify-center gap-6 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-indigo-500" /> 내 실적
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-amber-400" /> 업종 평균
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-amber-400/15" /> 평균 범위
        </span>
      </div>
    </div>
  );
}
