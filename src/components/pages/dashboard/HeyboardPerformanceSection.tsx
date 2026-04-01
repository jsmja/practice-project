import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_HEYBOARD_PERFORMANCE } from '@/mocks/dashboard';
import { MousePointerClick, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeyboardPerformanceSection() {
  const navigate = useNavigate();
  const perf = MOCK_HEYBOARD_PERFORMANCE;

  return (
    <SectionCard
      title="헤이보드 성과"
      titleRight={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">이번달 기준</span>
          <button
            onClick={() => navigate('/statistics/customers')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            상세보기 <ArrowRight size={14} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-5">
        {/* 클릭 수 */}
        <div className="rounded-xl border border-border/60 p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2">
              <MousePointerClick size={16} className="text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-foreground">클릭 수</p>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{perf.clickUsers}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">이번달 누적</p>

          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">노출 대비 클릭률</span>
              <span className="text-xs font-semibold text-foreground">7.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">전월 대비</span>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={12} />
                +12.3%
              </span>
            </div>
          </div>
        </div>

        {/* 체류시간 */}
        <div className="rounded-xl border border-border/60 p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-50 p-2">
              <Clock size={16} className="text-blue-500" />
            </div>
            <p className="text-sm font-medium text-foreground">체류시간</p>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{perf.avgStayTime}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">평균</p>

          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">최소</span>
              <span className="text-xs font-medium text-foreground">{perf.minStayTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">최대</span>
              <span className="text-xs font-medium text-foreground">{perf.maxStayTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">전월 평균</span>
              <span className="text-xs font-medium text-foreground">01:15:20</span>
            </div>
          </div>
        </div>

        {/* 카드 TOP 3 */}
        <div className="rounded-xl border border-border/60 p-5">
          <p className="mb-4 text-sm font-medium text-foreground">카드 TOP 3</p>
          <div className="flex flex-col gap-2">
            {perf.cardTop3.map((item) => (
              <div
                key={item.rank}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5',
                  item.rank === 1 ? 'bg-blue-50/60' : 'bg-transparent',
                )}
              >
                <span className={cn(
                  'inline-flex h-6 w-12 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white',
                  item.rank === 1 ? 'bg-blue-500' : item.rank === 2 ? 'bg-blue-400' : 'bg-blue-300',
                )}>
                  TOP {item.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.cardName}</p>
                  <p className="text-xs text-muted-foreground">{item.cardType}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-blue-600">{item.clickRate}%</p>
                  <p className="text-xs text-muted-foreground">{item.clicks}회</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
