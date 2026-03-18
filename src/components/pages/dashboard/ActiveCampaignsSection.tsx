import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_ACTIVE_CAMPAIGNS } from '@/mocks/dashboard';
import { ArrowRight, Flame, AlertTriangle, Copy, Pause, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// CTR 8% 이상 & 전환율 5% 이상이면 "성과 좋음"
const CTR_GOOD = 8;
const CONVERSION_GOOD = 5;

function getPerformanceTag(ctr: number, conversionRate: number) {
  if (ctr >= 12 && conversionRate >= CONVERSION_GOOD) {
    return { label: '우수', color: 'text-green-700 bg-green-50 border-green-200', icon: Flame };
  }
  if (ctr >= CTR_GOOD && conversionRate >= CONVERSION_GOOD) {
    return { label: '양호', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: null };
  }
  return { label: '개선 필요', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle };
}

export function ActiveCampaignsSection() {
  const navigate = useNavigate();
  const campaigns = MOCK_ACTIVE_CAMPAIGNS;

  // 전환율 기준 정렬 (높은 순)
  const sorted = [...campaigns].sort((a, b) => b.conversionRate - a.conversionRate);
  const maxCtr = Math.max(...campaigns.map((c) => c.ctr), 1);
  const maxConversion = Math.max(...campaigns.map((c) => c.conversionRate), 1);

  return (
    <SectionCard
      title="메시지 캠페인"
      titleRight={
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          전체보기 <ArrowRight size={14} />
        </button>
      }
    >
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <p className="text-sm text-muted-foreground">활성 캠페인이 없습니다.</p>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
          >
            캠페인 만들기
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">캠페인명</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">성과</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">발송 수</th>
                <th className="w-[150px] px-5 py-3 text-right text-xs font-medium text-muted-foreground">CTR</th>
                <th className="w-[150px] px-5 py-3 text-right text-xs font-medium text-muted-foreground">전환율</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((campaign) => {
                const perf = getPerformanceTag(campaign.ctr, campaign.conversionRate);
                const PerfIcon = perf.icon;

                return (
                  <tr key={campaign.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{campaign.startDate} 시작</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
                        perf.color,
                      )}>
                        {PerfIcon && <PerfIcon size={12} />}
                        {perf.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-blue-400 transition-all"
                            style={{ width: `${(campaign.ctr / maxCtr) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          'min-w-[40px] text-right font-medium',
                          campaign.ctr >= 10 ? 'text-blue-600' : 'text-blue-500',
                        )}>
                          {campaign.ctr}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-green-100">
                          <div
                            className="h-full rounded-full bg-green-400 transition-all"
                            style={{ width: `${(campaign.conversionRate / maxConversion) * 100}%` }}
                          />
                        </div>
                        <span className={cn(
                          'min-w-[40px] text-right font-medium',
                          campaign.conversionRate >= 5 ? 'text-green-600' : 'text-green-500',
                        )}>
                          {campaign.conversionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="복제"
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          title="중지"
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Pause size={15} />
                        </button>
                        <button
                          title="A/B 테스트"
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-500"
                        >
                          <FlaskConical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
