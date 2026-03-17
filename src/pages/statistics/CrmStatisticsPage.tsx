import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { SectionCard } from '@/components/common/SectionCard';
import { PeriodTabGroup } from '@/components/common/PeriodTabGroup';
import { ExcelDownloadButton } from '@/components/common/ExcelDownloadButton';
import { FunnelLineChart } from '@/components/pages/crm-statistics/FunnelLineChart';
import { Send, Eye, MousePointer, ShoppingCart, Lightbulb, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICrmStatDto } from '@/models/interface/dto';
import { NOOP_PAGINATION, PERIOD_TABS } from '@/lib/constants';
import { useCrmStats, useCrmSummary } from '@/hooks/client/statistics/useStatisticsClient';
import { MOCK_COUPON_RANKING } from '@/mocks/statistics';

type EvalType = '매우좋음' | '양호' | '개선 필요';

const EVAL_STYLE: Record<EvalType, string> = {
  '매우좋음': 'bg-green-100 text-green-700',
  '양호': 'bg-blue-100 text-blue-700',
  '개선 필요': 'bg-red-100 text-red-700',
};

function getEval(type: 'send' | 'open' | 'click' | 'conversion', rate: number): EvalType {
  if (type === 'send') return rate >= 95 ? '매우좋음' : rate >= 85 ? '양호' : '개선 필요';
  if (type === 'open') return rate >= 60 ? '매우좋음' : rate >= 30 ? '양호' : '개선 필요';
  if (type === 'click') return rate >= 8 ? '매우좋음' : rate >= 3 ? '양호' : '개선 필요';
  return rate >= 3 ? '매우좋음' : rate >= 1 ? '양호' : '개선 필요';
}

const AVG_RANGE: Record<string, string> = {
  send: '평균 90-99%',
  open: '평균 8-20%',
  click: '평균 3-18%',
  conversion: '평균 1-8%',
};

function formatStatSendRound(row: ICrmStatDto) {
  if (row.sendFrequency === '1회') {
    return (
      <span className="inline-flex items-center gap-1">
        <Badge variant="default">1회</Badge>
        <span className="text-xs font-medium">1/1</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Badge variant="info">반복</Badge>
      <span className="text-xs font-medium">{row.sendRound}/{row.totalRounds}</span>
    </span>
  );
}

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'campaignName', header: '캠페인명' },
  {
    key: 'type',
    header: '캠페인 유형',
    width: '130px',
    render: (row: ICrmStatDto) => <Badge variant="default">{row.type}</Badge>,
  },
  {
    key: 'sendRound',
    header: '회차',
    width: '100px',
    render: formatStatSendRound,
  },
  { key: 'sendDate', header: '발송일', width: '120px' },
  {
    key: 'targetCount',
    header: '대상 수',
    width: '90px',
    sortable: true,
    render: (row: ICrmStatDto) => <span>{row.targetCount.toLocaleString()}</span>,
  },
  {
    key: 'successCount',
    header: '성공 수',
    width: '90px',
    sortable: true,
    render: (row: ICrmStatDto) => (
      <span className="font-medium text-green-600">{row.successCount.toLocaleString()}</span>
    ),
  },
  {
    key: 'failCount',
    header: '실패 수',
    width: '80px',
    render: (row: ICrmStatDto) => (
      <span className={cn(row.failCount > 0 ? 'text-red-500' : 'text-muted-foreground')}>
        {row.failCount}
      </span>
    ),
  },
  {
    key: 'successRate',
    header: '성공률',
    width: '80px',
    render: (row: ICrmStatDto) => {
      const rate = Math.round((row.successCount / row.targetCount) * 1000) / 10;
      return <span className="font-medium">{rate}%</span>;
    },
  },
  {
    key: 'cost',
    header: '비용(P)',
    width: '80px',
    sortable: true,
    render: (row: ICrmStatDto) => <span>{row.cost}P</span>,
  },
];

type TabType = '발송 및 클릭' | '쿠폰 발급 및 사용';
const CONTENT_TABS: TabType[] = ['발송 및 클릭', '쿠폰 발급 및 사용'];

export function CrmStatisticsPage() {
  const [activePeriod, setActivePeriod] = useState('일주일');
  const [activeTab, setActiveTab] = useState<TabType>('발송 및 클릭');

  const { data: crmStats = [] } = useCrmStats();
  const { data: summary } = useCrmSummary();

  const sendEval = useMemo(() => (summary ? getEval('send', summary.sendRate) : '양호'), [summary]);
  const openEval = useMemo(() => (summary ? getEval('open', summary.openRate) : '양호'), [summary]);
  const clickEval = useMemo(() => (summary ? getEval('click', summary.clickRate) : '양호'), [summary]);
  const convEval = useMemo(() => (summary ? getEval('conversion', summary.conversionRate) : '개선 필요'), [summary]);

  const funnelPoints = useMemo(
    () =>
      summary
        ? [
            { label: '발송', rate: summary.sendRate, count: summary.totalSent, avgRange: AVG_RANGE.send },
            { label: '열람', rate: summary.openRate, count: summary.totalOpen, avgRange: AVG_RANGE.open },
            { label: '클릭', rate: summary.clickRate, count: summary.totalClick, avgRange: AVG_RANGE.click },
            { label: '전환', rate: summary.conversionRate, count: summary.totalConversion, avgRange: AVG_RANGE.conversion },
          ]
        : [],
    [summary]
  );

  if (!summary) {
    return (
      <div>
        <PageHeader title="메시지 발송 통계" actions={<ExcelDownloadButton />} />
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="메시지 발송 통계" actions={<ExcelDownloadButton />} />

      <PeriodTabGroup
        tabs={[...PERIOD_TABS]}
        activeTab={activePeriod}
        onTabChange={setActivePeriod}
        dateRange={summary.period}
        className="mb-6"
      />

      {/* 콘텐츠 탭 */}
      <div className="mb-6 flex gap-0 border-b border-border">
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '발송 및 클릭' && (
        <>
          {/* KPI 카드 3개 */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            {[
              { icon: <Send size={18} />, label: '발송', rate: summary.sendRate, count: summary.totalSent, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: <Eye size={18} />, label: '열람', rate: summary.openRate, count: summary.totalOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: <MousePointer size={18} />, label: '클릭', rate: summary.clickRate, count: summary.totalClick, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((kpi) => (
              <div key={kpi.label} className="flex items-center gap-4 rounded-xl border border-border bg-white p-5">
                <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full', kpi.bg, kpi.color)}>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className={cn('text-2xl font-bold', kpi.color)}>{kpi.rate}%</p>
                  <p className="text-xs text-muted-foreground">{kpi.count.toLocaleString()}건</p>
                </div>
              </div>
            ))}
          </div>

          {/* 상세 수치 행 */}
          <div className="mb-6 flex overflow-hidden rounded-xl border border-border bg-white">
            <div className="flex flex-1 divide-x divide-border">
              {[
                { label: '전체 시도수', value: summary.totalAttempt, sub: `평균 ${Math.round(summary.totalAttempt / 6).toLocaleString()}` },
                { label: '전체 발송수', value: summary.totalSent, sub: `평균 ${Math.round(summary.totalSent / 6).toLocaleString()}` },
                { label: '전체 열람수', value: summary.totalOpen, sub: `평균 ${Math.round(summary.totalOpen / 6).toLocaleString()}` },
                { label: '전체 클릭수', value: summary.totalClick, sub: `평균 ${Math.round(summary.totalClick / 6).toLocaleString()}` },
              ].map((item) => (
                <div key={item.label} className="flex-1 px-5 py-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-xl font-bold">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex divide-x divide-border border-l border-border">
              {[
                { label: '전체 클릭률', value: `${summary.totalClickRate}%` },
                { label: '전체 전환률', value: `${summary.conversionRate}%` },
              ].map((item) => (
                <div key={item.label} className="flex min-w-[120px] flex-col items-center justify-center px-6 py-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-2xl font-bold text-indigo-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 단계별 분석 */}
          <SectionCard title="단계별 분석" description="고객 여정의 각 단계별 전환 현황" className="mb-6">
            {/* 발송 헤더 */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Send size={15} className="text-indigo-600" />
                <span className="font-semibold text-sm">발송</span>
                <span className="text-xl font-bold text-indigo-600">{summary.sendRate}%</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {summary.totalAttempt.toLocaleString()}건 시도 →{' '}
                  <strong className="text-foreground">{summary.totalSent.toLocaleString()}건 발송</strong>
                </span>
                <span className="text-xs text-muted-foreground">{AVG_RANGE.send}</span>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', EVAL_STYLE[sendEval])}>
                  {sendEval}
                </span>
              </div>
            </div>

            {/* STEP 카드 */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                { stepKey: 'open' as const, step: 'STEP 1', label: '열람', icon: <Eye size={14} />, rate: summary.openRate, count: summary.totalOpen, eval: openEval, avg: AVG_RANGE.open },
                { stepKey: 'click' as const, step: 'STEP 2', label: '클릭', icon: <MousePointer size={14} />, rate: summary.clickRate, count: summary.totalClick, eval: clickEval, avg: AVG_RANGE.click, tag: '자체측정' },
                { stepKey: 'conversion' as const, step: 'STEP 3', label: '전환', icon: <ShoppingCart size={14} />, rate: summary.conversionRate, count: summary.totalConversion, eval: convEval, avg: AVG_RANGE.conversion, tag: '자체측정' },
              ].map((step) => {
                const barWidth = Math.min(100, step.rate);
                const barColor =
                  step.eval === '매우좋음' ? 'bg-green-400' : step.eval === '양호' ? 'bg-blue-400' : 'bg-red-400';
                return (
                  <div key={step.stepKey} className="rounded-xl border border-border bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">{step.step}</span>
                        {step.tag && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {step.tag}
                          </span>
                        )}
                      </div>
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', EVAL_STYLE[step.eval])}>
                        {step.eval}
                      </span>
                    </div>
                    <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                      {step.icon}
                      <span className="font-semibold text-foreground">{step.label}</span>
                    </div>
                    <p className="mb-0.5 text-2xl font-bold">{step.rate}%</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {step.avg} · {step.count.toLocaleString()}건
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={cn('h-full rounded-full', barColor)} style={{ width: `${Math.max(barWidth, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 단계별 전환 흐름 */}
            <div className="mb-4 rounded-xl border border-border bg-gray-50/50 px-5 pt-4 pb-2">
              <p className="mb-0.5 text-xs font-semibold text-muted-foreground">단계별 전환 흐름 시각화</p>
              <p className="mb-3 text-[10px] text-muted-foreground">각 단계별 전환율과 이탈 전환</p>
              <FunnelLineChart points={funnelPoints} />
            </div>

            {/* 핵심 인사이트 */}
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-400">
                <Lightbulb size={13} className="text-white" />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold text-amber-800">핵심 인사이트</p>
                <p className="text-xs leading-relaxed text-amber-700">
                  전환률(발송 대비 {summary.conversionRate}%)이 평균(1-8%)보다 낮아 개선이 필요합니다.
                  클릭 후 전환 경로를 점검하고, 랜딩 페이지의 전환 유도 요소를 강화하는 것이 필요합니다.
                  열람률({summary.openRate}%)과 클릭률({summary.clickRate}%)은 양호하므로 메시지 품질은 우수합니다.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* 캠페인 유형별 통계 */}
          <SectionCard title="캠페인 유형별 통계" className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '커스텀 캠페인', count: '3,200', rate: '98.0%', color: 'border-slate-200 bg-slate-50', textColor: 'text-slate-600' },
                { label: '웰컴백 캠페인', count: '1,850', rate: '98.0%', color: 'border-blue-200 bg-blue-50', textColor: 'text-blue-600' },
                { label: 'VIP 전용', count: '320', rate: '98.1%', color: 'border-yellow-200 bg-yellow-50', textColor: 'text-yellow-700' },
                { label: '신규회원 이탈방지', count: '120', rate: '98.3%', color: 'border-emerald-200 bg-emerald-50', textColor: 'text-emerald-600' },
                { label: '구매 감사', count: '45', rate: '100%', color: 'border-pink-200 bg-pink-50', textColor: 'text-pink-600' },
                { label: '생일 축하', count: '80', rate: '97.5%', color: 'border-violet-200 bg-violet-50', textColor: 'text-violet-600' },
              ].map(({ label, count, rate, color, textColor }) => (
                <div key={label} className={`rounded-lg border p-3 ${color}`}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-lg font-bold">{count}건</p>
                  <p className={`mt-1 text-xs font-medium ${textColor}`}>성공률 {rate}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 캠페인별 상세 */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">캠페인별 상세 데이터</h3>
          </div>
          <DataTable columns={COLUMNS} data={crmStats} pagination={NOOP_PAGINATION} />
        </>
      )}

      {activeTab === '쿠폰 발급 및 사용' && (
        <>
          {/* 쿠폰 KPI */}
          <div className="mb-4 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                <Tag size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">쿠폰 발급</p>
                <p className="text-2xl font-bold text-orange-500">100%</p>
                <p className="text-xs text-muted-foreground">{summary.totalCouponIssued.toLocaleString()}건</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <ShoppingCart size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">쿠폰 사용</p>
                <p className="text-2xl font-bold text-green-600">{summary.couponUsageRate}%</p>
                <p className="text-xs text-muted-foreground">{summary.totalCouponUsed.toLocaleString()}건</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex divide-x divide-border">
              {[
                { label: '총쿠폰발급수', value: summary.totalCouponIssued },
                { label: '총쿠폰사용수', value: summary.totalCouponUsed },
              ].map((item) => (
                <div key={item.label} className="px-5">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 text-xl font-bold">{item.value}</p>
                </div>
              ))}
              <div className="flex flex-col items-start justify-center px-5">
                <p className="text-xs text-muted-foreground">쿠폰사용률</p>
                <p className="mt-0.5 text-2xl font-bold text-indigo-600">{summary.couponUsageRate}%</p>
              </div>
            </div>
          </div>

          {/* 쿠폰 사용률 랭킹 TOP 5 */}
          <SectionCard title="쿠폰 사용률 랭킹 TOP 5" description="사용률 기준 우수 캠페인 (최근 1년)" className="mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 text-left">순위</th>
                  <th className="pb-2 text-left">캠페인명</th>
                  <th className="pb-2 text-right">발급</th>
                  <th className="pb-2 text-right">사용</th>
                  <th className="pb-2 text-right">사용률</th>
                  <th className="pb-2 text-right">평균 대비</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COUPON_RANKING.map((row) => (
                  <tr key={row.rank} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <span className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                        row.rank === 1 ? 'bg-amber-400' : row.rank === 2 ? 'bg-gray-400' : row.rank === 3 ? 'bg-orange-300' : 'bg-gray-200 text-gray-500'
                      )}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3 text-blue-600">{row.campaignName}</td>
                    <td className="py-3 text-right">{row.issued}건</td>
                    <td className="py-3 text-right">{row.used}건</td>
                    <td className="py-3 text-right font-medium">{row.usageRate}%</td>
                    <td className={cn('py-3 text-right text-xs font-semibold', row.positive ? 'text-blue-500' : 'text-red-500')}>
                      {row.positive ? '↑' : '↓'} {row.vsAvg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* 성과 인사이트 & 유지 확장 */}
          <div className="grid grid-cols-2 gap-4">
            <SectionCard title="성과 인사이트" description="주요 지표 및 평가">
              <div className="space-y-2">
                {[
                  { text: '메시지 도달 및 혜택 인식 명확', detail: '발급률 80-100% 달성' },
                  { text: '이탈 요인 거의 없음', detail: '사용률 60% 이상 달성' },
                  { text: '캠페인 구조 적합', detail: '타깃과 혜택이 잘 맞음' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2.5">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-medium text-green-800">{item.text}</p>
                      <p className="text-[10px] text-green-600">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="유지 & 확장" description="성과 유지 및 확산을 위한 액션 아이디어">
              <div className="space-y-2">
                {[
                  { action: '유사 캠페인 재활용', detail: '동일 메시지 구조 및 혜택 반복 활용', level: '높음', color: 'bg-green-500' },
                  { action: '확산 실험', detail: '사용률 높은 구간을 기준으로 타겟 확장', level: '중간', color: 'bg-amber-400' },
                  { action: '성과 기준선 설정', detail: '이로 캠페인의 벤치마크로 활용', level: '중간', color: 'bg-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm">
                        {i === 0 ? '🔄' : i === 1 ? '🎯' : '📊'}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{item.action}</p>
                        <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold text-white', item.color)}>
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
