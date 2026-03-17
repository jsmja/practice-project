import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { MOCK_SITE_TRAFFIC_KPI, MOCK_SITE_ANALYSIS } from '@/mocks/dashboard';
import { Users, FileText, Clock, LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatChange(value: number): string {
  return `전일 대비 ${value > 0 ? '+' : ''}${value}%`;
}

function VisitorDonut({ newV, returning }: { newV: number; returning: number }) {
  const total = newV + returning;
  const newPct = total > 0 ? (newV / total) * 100 : 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (newPct / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" stroke="#fb923c" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#6366f1"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-base font-bold text-foreground">{total.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">총 방문자</p>
      </div>
    </div>
  );
}

function DeviceBar({ device, percentage, color }: { device: string; percentage: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-sm text-muted-foreground">{device}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-12 text-right text-sm font-medium text-foreground">{percentage}%</span>
    </div>
  );
}

export function SiteOverviewSection() {
  const navigate = useNavigate();
  const site = MOCK_SITE_TRAFFIC_KPI;
  const analysis = MOCK_SITE_ANALYSIS;

  return (
    <SectionCard
      title="사이트 현황"
      titleRight={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">2026-03-16 기준</span>
          <button
            onClick={() => navigate('/statistics/page')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            상세보기 <ArrowRight size={14} />
          </button>
        </div>
      }
    >
      {/* KPI 카드 */}
      <div className="mb-5 grid grid-cols-4 gap-4">
        <StatCard
          title="방문자"
          value={site.visitors.toLocaleString()}
          change={{ value: formatChange(site.visitorsChange), isPositive: site.visitorsChange > 0 }}
          icon={<Users size={18} />}
        />
        <StatCard
          title="페이지뷰"
          value={site.pageViews.toLocaleString()}
          change={{ value: formatChange(site.pageViewsChange), isPositive: site.pageViewsChange > 0 }}
          icon={<FileText size={18} />}
        />
        <StatCard
          title="평균 체류시간"
          value={site.avgStayTime}
          change={{ value: formatChange(site.avgStayTimeChange), isPositive: site.avgStayTimeChange > 0 }}
          icon={<Clock size={18} />}
        />
        <StatCard
          title="이탈률"
          value={`${site.bounceRate}%`}
          change={{ value: formatChange(site.bounceRateChange), isPositive: site.bounceRateChange < 0 }}
          icon={<LogOut size={18} />}
        />
      </div>

      {/* 방문자 분석 + 디바이스 + 페이지뷰 TOP3 */}
      <div className="grid grid-cols-3 gap-5">
        {/* 방문자 분석 */}
        <div className="rounded-xl border border-border/60 p-5">
          <p className="mb-4 text-sm font-medium text-foreground">페이지 방문자 분석</p>
          <div className="flex items-center gap-5">
            <VisitorDonut newV={analysis.newVisitors} returning={analysis.returningVisitors} />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">신규 방문자</span>
                <span className="ml-auto font-semibold">{analysis.newVisitors.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <span className="h-3 w-3 rounded-full bg-orange-400" />
                <span className="text-muted-foreground">재방문자</span>
                <span className="ml-auto font-semibold">{analysis.returningVisitors.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 디바이스 정보 */}
        <div className="rounded-xl border border-border/60 p-5">
          <p className="mb-4 text-sm font-medium text-foreground">디바이스 정보</p>
          <div className="flex flex-col gap-3">
            {analysis.deviceBreakdown.map((d) => (
              <DeviceBar key={d.device} device={d.device} percentage={d.percentage} color={d.color} />
            ))}
          </div>
        </div>

        {/* 페이지뷰 TOP 3 */}
        <div className="rounded-xl border border-border/60 p-5">
          <p className="mb-4 text-sm font-medium text-foreground">페이지뷰 TOP 3</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2.5 text-left text-xs font-medium" />
                <th className="pb-2.5 text-left text-xs font-medium">URL</th>
                <th className="pb-2.5 text-right text-xs font-medium">방문 수</th>
              </tr>
            </thead>
            <tbody>
              {analysis.pageViewTop3.map((item) => (
                <tr key={item.rank} className="border-t border-border/50">
                  <td className="py-2">
                    <span className={cn(
                      'inline-flex h-6 w-12 items-center justify-center rounded-md text-xs font-semibold text-white',
                      item.rank === 1 ? 'bg-blue-500' : item.rank === 2 ? 'bg-blue-400' : 'bg-blue-300',
                    )}>
                      TOP {item.rank}
                    </span>
                  </td>
                  <td className="max-w-[140px] truncate py-2 text-foreground" title={item.url}>
                    {item.url}
                  </td>
                  <td className="py-2 text-right font-medium text-foreground">{item.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
