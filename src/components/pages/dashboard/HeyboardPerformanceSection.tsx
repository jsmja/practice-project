import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_HEYBOARD_PERFORMANCE } from '@/mocks/dashboard';
import { MousePointerClick, Clock, ArrowRight } from 'lucide-react';
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
            onClick={() => navigate('/statistics/heyboard')}
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
          <div className="mb-3 flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2">
              <MousePointerClick size={16} className="text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-foreground">클릭 수</p>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{perf.clickUsers}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">이번달 누적</p>
        </div>

        {/* 체류시간 */}
        <div className="rounded-xl border border-border/60 p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-50 p-2">
              <Clock size={16} className="text-blue-500" />
            </div>
            <p className="text-sm font-medium text-foreground">체류시간</p>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{perf.avgStayTime}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">평균</p>
          <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground">
            <span>최소 {perf.minStayTime}</span>
            <span>최대 {perf.maxStayTime}</span>
          </div>
        </div>

        {/* 카드 TOP 3 */}
        <div className="rounded-xl border border-border/60 p-5">
          <p className="mb-4 text-sm font-medium text-foreground">카드 TOP 3</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-2.5 text-left text-xs font-medium" />
                <th className="pb-2.5 text-left text-xs font-medium">카드명</th>
                <th className="pb-2.5 text-left text-xs font-medium">카드유형</th>
                <th className="pb-2.5 text-right text-xs font-medium">클릭률</th>
                <th className="pb-2.5 text-right text-xs font-medium">클릭 수</th>
              </tr>
            </thead>
            <tbody>
              {perf.cardTop3.map((item) => (
                <tr key={item.rank} className="border-t border-border/50">
                  <td className="py-2">
                    <span className={cn(
                      'inline-flex h-6 w-12 items-center justify-center rounded-md text-xs font-semibold text-white',
                      item.rank === 1 ? 'bg-blue-500' : item.rank === 2 ? 'bg-blue-400' : 'bg-blue-300',
                    )}>
                      TOP {item.rank}
                    </span>
                  </td>
                  <td className="py-2 text-foreground">{item.cardName}</td>
                  <td className="py-2 text-muted-foreground">{item.cardType}</td>
                  <td className="py-2 text-right font-medium text-blue-600">{item.clickRate}%</td>
                  <td className="py-2 text-right text-muted-foreground">{item.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
