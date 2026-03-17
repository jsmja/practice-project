import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Send, Eye, MousePointer, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';
import type { ICrmSummaryDto } from '@/models/interface/dto';
import type { ReactNode } from 'react';

interface ICrmFunnelSectionProps {
  summary: ICrmSummaryDto;
  onNavigateDetail: () => void;
}

interface IFunnelStep {
  icon: ReactNode;
  label: string;
  rate: number;
  count: number;
  total: number;
  gradient: string;
  bg: string;
  text: string;
  ring: string;
}

export function CrmFunnelSection({ summary, onNavigateDetail }: ICrmFunnelSectionProps) {
  const funnelSteps: IFunnelStep[] = [
    {
      icon: <Send size={16} />,
      label: '발송',
      rate: summary.sendRate,
      count: summary.totalSent,
      total: summary.totalAttempt,
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      ring: 'ring-indigo-100',
    },
    {
      icon: <Eye size={16} />,
      label: '열람',
      rate: summary.openRate,
      count: summary.totalOpen,
      total: summary.totalSent,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-100',
    },
    {
      icon: <MousePointer size={16} />,
      label: '클릭',
      rate: summary.clickRate,
      count: summary.totalClick,
      total: summary.totalOpen,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      ring: 'ring-amber-100',
    },
    {
      icon: <TrendingUp size={16} />,
      label: '전환',
      rate: summary.conversionRate,
      count: summary.totalConversion,
      total: summary.totalClick,
      gradient: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      ring: 'ring-rose-100',
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-semibold text-foreground">메시지 발송 통계</h3>
          <Badge variant="kakao">NEW</Badge>
          <span className="text-xs text-muted-foreground">{summary.period}</span>
        </div>
        <button
          onClick={onNavigateDetail}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          상세보기 <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        {/* 퍼널 스텝 */}
        <div className="flex items-stretch">
          {funnelSteps.map((step, idx, arr) => (
            <div key={step.label} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm ring-4',
                    step.gradient,
                    step.ring,
                  )}
                >
                  {step.icon}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{step.label}</p>
                <p className={cn('mt-1 text-2xl font-bold tracking-tight', step.text)}>
                  {step.rate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.count.toLocaleString()}건
                  <span className="text-muted-foreground/60"> / {step.total.toLocaleString()}</span>
                </p>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex flex-shrink-0 items-center px-2">
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 요약 바 */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 via-amber-50 to-rose-50 px-5 py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">
              총 시도 <span className="font-semibold text-foreground">{summary.totalAttempt.toLocaleString()}건</span>
            </span>
            <span className="text-muted-foreground">
              최종 전환 <span className="font-semibold text-foreground">{summary.totalConversion.toLocaleString()}건</span>
            </span>
            <span className="text-muted-foreground">
              전체 전환율 <span className={cn('font-semibold', summary.conversionRate > 0 ? 'text-rose-600' : 'text-foreground')}>{summary.conversionRate}%</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">쿠폰 사용률</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-indigo-600 shadow-sm">
              {summary.couponUsageRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
