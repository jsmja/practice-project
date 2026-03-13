import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';
import { useCrmSummary } from '@/hooks/client/statistics/useStatisticsClient';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Coins,
  ShoppingBag,
  Instagram,
  Youtube,
  MessageCircle,
  Zap,
  ArrowRight,
  Eye,
  MousePointer,
  TrendingUp,
  Clock,
  Monitor,
  HelpCircle,
  Calendar,
  Copy,
  Users,
  BarChart3,
  MousePointerClick,
  FileText,
  ChevronRight,
} from 'lucide-react';

const SERVICE_LINKS = [
  { icon: <ShoppingBag size={20} />, label: '커머스', sub: '카페24', color: 'text-blue-600', logo: 'cafe24' },
  { icon: <Instagram size={20} />, label: '소셜미디어', sub: '인스타그램', color: 'text-pink-500' },
  { icon: <Youtube size={20} />, label: '소셜미디어', sub: '유튜브', color: 'text-red-500' },
  { icon: <MessageCircle size={20} />, label: '부가 서비스(유료)', sub: '채팅상담', color: 'text-gray-600' },
  { icon: <Zap size={20} />, label: '기본 서비스', sub: '헤이데어', color: 'text-amber-500' },
];

const SERVICE_LINKS_ROW2 = [
  { icon: <CheckCircle size={20} />, label: '부가 서비스(유료)', sub: '마케팅 수신 동의', color: 'text-green-500' },
];

/** 간단한 도넛 차트 SVG */
function DonutChart({
  value,
  max,
  size = 80,
  strokeWidth = 10,
  color = '#3B82F6',
  bgColor = '#E5E7EB',
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? value / max : 0;
  const dashOffset = circumference * (1 - percentage);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{max}</p>
      </div>
    </div>
  );
}

/** 간단한 라인 차트 placeholder */
function SimplePlaceholderChart({
  height = 128,
  color = '#3B82F6',
  data,
  labels,
}: {
  height?: number;
  color?: string;
  data?: number[];
  labels?: string[];
}) {
  const chartData = data ?? [0, 0, 0, 0, 0, 0, 0];
  const chartLabels = labels ?? ['03.06', '03.07', '03.08', '03.09', '03.10', '03.11', '03.12'];
  const maxVal = Math.max(...chartData, 1);

  return (
    <div className="mt-4" style={{ height }}>
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="30"
            y1={height - 20 - (height - 40) * ratio}
            x2="290"
            y2={height - 20 - (height - 40) * ratio}
            stroke="#F3F4F6"
            strokeWidth="1"
          />
        ))}
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={chartData
            .map((v, i) => {
              const x = 30 + (i / (chartData.length - 1)) * 260;
              const y = height - 20 - ((v / maxVal) * (height - 40));
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {/* X-axis labels */}
        {chartLabels.map((label, i) => (
          <text
            key={label}
            x={30 + (i / (chartLabels.length - 1)) * 260}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize="9"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/** 간단한 도넛 파이 차트 (방문자 분석, 디바이스 용) */
function PieDonut({
  segments,
  size = 160,
  strokeWidth = 40,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {total === 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
        ) : (
          segments.map((seg) => {
            const ratio = seg.value / total;
            const offset = circumference * accumulated;
            accumulated += ratio;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference * ratio} ${circumference * (1 - ratio)}`}
                strokeDashoffset={-offset}
              />
            );
          })
        )}
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-muted-foreground">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary } = useCrmSummary();

  const dateLabels = ['03.06', '03.07', '03.08', '03.09', '03.10', '03.11', '03.12'];

  return (
    <div>
      <PageHeader title="대시보드" />

      {/* ───────── 헤이보드 현황 + 마케팅 현황 ───────── */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        {/* 헤이보드 현황 */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-semibold text-foreground">헤이보드 현황</h3>
              <HelpCircle size={14} className="text-muted-foreground" />
            </div>
            <button className="text-xs text-muted-foreground hover:underline">상세보기</button>
          </div>
          <div className="flex gap-6">
            {/* 좌측 수치 */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">사용 중인 헤이보드</p>
                  <p className="mt-0.5 text-xl font-bold">1개</p>
                </div>
                <Copy size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">사용 중인 헤이버튼</p>
                  <p className="mt-0.5 text-xl font-bold">2개</p>
                </div>
                <BarChart3 size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">사용 중인 카드</p>
                  <p className="mt-0.5 text-xl font-bold">11개</p>
                </div>
                <FileText size={16} className="text-muted-foreground" />
              </div>
            </div>
            {/* 우측 채팅상담 노출 제공량 */}
            <div className="flex flex-col items-center rounded-lg border border-border px-6 py-4">
              <div className="mb-3 flex items-center gap-1">
                <p className="text-xs font-medium text-foreground">채팅상담 노출 제공량</p>
                <span className="text-[10px] text-muted-foreground">1일 기준</span>
                <HelpCircle size={12} className="text-muted-foreground" />
              </div>
              <div className="mb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[10px] text-muted-foreground">노출 수(해피톡 제외)</span>
              </div>
              <DonutChart value={0} max={100} size={90} strokeWidth={12} color="#FBBF24" bgColor="#F3F4F6" />
              <p className="mt-2 text-[10px] text-muted-foreground">
                해피톡 상담은 제공량과 관계없이 무제한 무료로 이용 가능합니다.
              </p>
              <button className="mt-2 rounded-md border border-border px-3 py-1 text-[10px] text-muted-foreground hover:bg-muted">
                무제한 이용하기
              </button>
            </div>
          </div>
        </div>

        {/* 마케팅 현황 */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-semibold text-foreground">마케팅 현황</h3>
              <HelpCircle size={14} className="text-muted-foreground" />
            </div>
            <button className="text-xs text-muted-foreground hover:underline">상세보기</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
              <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">진행중 마케팅</p>
                <p className="mt-0.5 text-xl font-bold">0건</p>
              </div>
            </div>
            <div className="flex items-start justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">마케팅 수신 동의 전환 수</p>
                    <HelpCircle size={10} className="text-muted-foreground" />
                  </div>
                  <p className="mt-0.5 text-xl font-bold">1명</p>
                </div>
              </div>
              <button className="text-xs text-primary hover:underline">마케팅 만들기</button>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
              <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">진행 예정</p>
                <p className="mt-0.5 text-xl font-bold">0건</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
              <div className="rounded-full bg-gray-100 p-2 text-gray-500">
                <Users size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground">마케팅 수신 동의 잠재고객 수</p>
                  <HelpCircle size={10} className="text-muted-foreground" />
                </div>
                <p className="mt-0.5 text-xl font-bold">1명</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── 서비스 연동 현황 ───────── */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-1">
          <h3 className="text-sm font-semibold text-foreground">서비스 연동 현황</h3>
          <HelpCircle size={14} className="text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-3">
          {SERVICE_LINKS.map((service, idx) => (
            <div
              key={idx}
              className="flex min-w-[180px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:border-gray-300"
            >
              <div className={service.color}>{service.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{service.label}</p>
                <p className="text-sm font-medium">{service.sub}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {SERVICE_LINKS_ROW2.map((service, idx) => (
            <div
              key={idx}
              className="flex min-w-[180px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:border-gray-300"
            >
              <div className={service.color}>{service.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{service.label}</p>
                <p className="text-sm font-medium">{service.sub}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* ───────── CRM 발송 현황 ───────── */}
      {summary && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">CRM 발송 현황</h3>
              <Badge variant="kakao">NEW</Badge>
            </div>
            <button
              onClick={() => navigate('/statistics/crm')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              상세보기 <ArrowRight size={12} />
            </button>
          </div>

          <div className="mb-4 grid grid-cols-4 gap-4">
            <StatCard
              title="이번 주 발송"
              value={`${summary.totalSent.toLocaleString()}건`}
              icon={<Send size={18} />}
            />
            <StatCard
              title="발송 성공률"
              value={`${summary.sendRate}%`}
              change={{ value: '전주 대비 +1.2%', isPositive: true }}
              description={summary.period}
              icon={<CheckCircle size={18} />}
            />
            <StatCard
              title="이번 달 총 발송"
              value="125,890건"
              change={{ value: '지난달 대비 +8.3%', isPositive: true }}
              icon={<MessageSquare size={18} />}
            />
            <StatCard
              title="잔여 포인트"
              value="4,820P"
              description="충전하기 →"
              icon={<Coins size={18} />}
            />
          </div>

          {/* 퍼널 단계별 통계 */}
          <div className="overflow-hidden rounded-xl border border-border bg-white p-6">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <p className="text-xs font-semibold text-foreground">발송 퍼널 분석</p>
              <p className="text-[10px] text-muted-foreground">{summary.period}</p>
            </div>

            {/* 퍼널 스텝 */}
            <div className="flex items-stretch gap-0">
              {[
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
                  barColor: 'bg-indigo-500',
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
                  barColor: 'bg-blue-500',
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
                  barColor: 'bg-amber-500',
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
                  barColor: 'bg-rose-500',
                },
              ].map((step, idx, arr) => (
                <div key={step.label} className="flex flex-1 items-center">
                  <div className="flex w-full flex-col items-center">
                    {/* 아이콘 원형 */}
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md ring-4',
                        step.gradient,
                        step.ring,
                      )}
                    >
                      {step.icon}
                    </div>

                    {/* 라벨 */}
                    <p className="mt-2.5 text-xs font-semibold text-foreground">{step.label}</p>

                    {/* 비율 */}
                    <p className={cn('mt-1 text-2xl font-bold tracking-tight', step.text)}>
                      {step.rate}%
                    </p>

                    {/* 건수 */}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.count.toLocaleString()}건
                    </p>

                    {/* 프로그레스 바 */}
                    <div className="mt-3 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn('h-full rounded-full transition-all', step.barColor)}
                        style={{ width: `${Math.min(step.rate, 100)}%` }}
                      />
                    </div>

                    {/* 모수 대비 */}
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      / {step.total.toLocaleString()}건 중
                    </p>
                  </div>

                  {/* 화살표 구분자 */}
                  {idx < arr.length - 1 && (
                    <div className="flex flex-shrink-0 flex-col items-center px-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 하단 요약 바 */}
            <div className="mt-6 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-50 via-blue-50 via-amber-50 to-rose-50 px-5 py-3">
              <div className="flex items-center gap-6 text-xs">
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
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">쿠폰 사용률</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-indigo-600 shadow-sm">
                  {summary.couponUsageRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── 서비스 통계 ───────── */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-semibold text-foreground">서비스 통계</h3>
            <HelpCircle size={14} className="text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button className="rounded-md border border-border px-3 py-1.5 hover:bg-muted">어제</button>
            <button className="rounded-md border border-primary bg-primary px-3 py-1.5 text-primary-foreground">일주일</button>
            <button className="rounded-md border border-border px-3 py-1.5 hover:bg-muted">이번달</button>
            <div className="ml-2 flex items-center gap-1 rounded-md border border-border px-3 py-1.5">
              <Calendar size={12} />
              <span>2026-03-06 ~ 2026-03-12</span>
            </div>
          </div>
        </div>

        {/* Row 1: 헤이버튼 클릭 사용자 | 체류 시간 | 클릭 TOP 3 */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          {/* 헤이버튼 클릭 사용자 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-1">
              <MousePointerClick size={14} className="text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">헤이버튼 클릭 사용자</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">0</p>
            <p className="mt-1 text-xs text-muted-foreground">비교할 데이터가 없습니다.</p>
            <SimplePlaceholderChart
              height={120}
              color="#6366F1"
              data={[0, 0, 0, 0, 0, 0, 0]}
              labels={dateLabels}
            />
          </div>

          {/* 헤이버튼 체류 시간 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-1">
              <Clock size={14} className="text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">헤이버튼 체류 시간</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">
              00:00:00 <span className="text-sm font-normal text-muted-foreground">평균</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">최소00:00:00 최대00:00:00</p>
            <SimplePlaceholderChart
              height={120}
              color="#6366F1"
              data={[0, 0, 0, 0, 0, 0, 0]}
              labels={dateLabels}
            />
          </div>

          {/* 헤이버튼 클릭 TOP 3 + 마케팅 현황 TOP 3 */}
          <div className="flex flex-col gap-4">
            {/* 헤이버튼 클릭 TOP 3 */}
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-1">
                <p className="text-xs font-medium text-foreground">헤이버튼 클릭 TOP 3</p>
                <HelpCircle size={12} className="text-muted-foreground" />
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 text-left font-normal" />
                    <th className="pb-2 text-left font-normal">헤이보드명</th>
                    <th className="pb-2 text-left font-normal">헤이버튼명</th>
                    <th className="pb-2 text-right font-normal">클릭률</th>
                    <th className="pb-2 text-right font-normal">클릭 수</th>
                    <th className="pb-2 text-right font-normal">노출 수</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((rank) => (
                    <tr key={rank} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <Badge variant={rank === 1 ? 'info' : rank === 2 ? 'success' : 'warning'}>
                          TOP {rank}
                        </Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">-</td>
                      <td className="py-2 text-muted-foreground">-</td>
                      <td className="py-2 text-right">0%</td>
                      <td className="py-2 text-right">0</td>
                      <td className="py-2 text-right">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 마케팅 현황 TOP 3 */}
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="mb-3 flex items-center gap-1">
                <p className="text-xs font-medium text-foreground">마케팅 현황 TOP 3</p>
                <HelpCircle size={12} className="text-muted-foreground" />
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 text-left font-normal" />
                    <th className="pb-2 text-left font-normal">마케팅명</th>
                    <th className="pb-2 text-right font-normal">클릭률</th>
                    <th className="pb-2 text-right font-normal">클릭 수</th>
                    <th className="pb-2 text-right font-normal">노출 수</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((rank) => (
                    <tr key={rank} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <Badge variant={rank === 1 ? 'info' : rank === 2 ? 'success' : 'warning'}>
                          TOP {rank}
                        </Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">-</td>
                      <td className="py-2 text-right">0%</td>
                      <td className="py-2 text-right">0</td>
                      <td className="py-2 text-right">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 2: 페이지 방문자 분석 | 디바이스 정보 | 페이지뷰 TOP 3 */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          {/* 페이지 방문자 분석 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center gap-1">
              <Users size={14} className="text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">페이지 방문자 분석</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <PieDonut
              segments={[
                { label: '신규 방문자', value: 1, color: '#6366F1' },
                { label: '재방문자', value: 1, color: '#F97316' },
              ]}
              size={140}
              strokeWidth={35}
            />
          </div>

          {/* 디바이스 정보 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center gap-1">
              <Monitor size={14} className="text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">디바이스 정보</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <PieDonut
              segments={[
                { label: '모바일', value: 1, color: '#EC4899' },
                { label: 'PC', value: 0, color: '#6366F1' },
                { label: '태블릿', value: 0, color: '#10B981' },
                { label: '기타', value: 1, color: '#F59E0B' },
              ]}
              size={140}
              strokeWidth={35}
            />
          </div>

          {/* 페이지뷰 TOP 3 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-3 flex items-center gap-1">
              <p className="text-xs font-medium text-foreground">페이지뷰 TOP 3</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 text-left font-normal" />
                  <th className="pb-2 text-left font-normal">URL</th>
                  <th className="pb-2 text-right font-normal">방문 수</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2">
                    <Badge variant="info">TOP 1</Badge>
                  </td>
                  <td className="max-w-[200px] truncate py-2" title="https://ffqdqd001.cafe24.com/">
                    https://ffqdqd001.cafe24.com/
                  </td>
                  <td className="py-2 text-right">1</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2">
                    <Badge variant="success">TOP 2</Badge>
                  </td>
                  <td className="max-w-[200px] truncate py-2" title="https://ffqdqd001.cafe24.com/product/%EB%A3%A8%EB%...">
                    https://ffqdqd001.cafe24.com/product/%EB%A3%A8%EB%...
                  </td>
                  <td className="py-2 text-right">1</td>
                </tr>
                <tr>
                  <td className="py-2">
                    <Badge variant="warning">TOP 3</Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">-</td>
                  <td className="py-2 text-right">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: 사용자 활동 | 메시지 노출 및 버튼 오픈 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 사용자 활동 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-1">
              <p className="text-xs font-medium text-foreground">사용자 활동</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <div className="mb-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">헤이버튼 클릭</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">카드 클릭</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="text-muted-foreground">페이지 조회</span>
              </div>
            </div>
            <SimplePlaceholderChart
              height={150}
              color="#F97316"
              data={[0, 0, 0, 0, 0.5, 2, 0]}
              labels={['03.06', '03.07', '03.08', '03.09', '03.10', '03.11', '03.12']}
            />
          </div>

          {/* 메시지 노출 및 버튼 오픈 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-2 flex items-center gap-1">
              <p className="text-xs font-medium text-foreground">메시지 노출 및 버튼 오픈</p>
              <HelpCircle size={12} className="text-muted-foreground" />
            </div>
            <div className="mb-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">버튼 오픈</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">버튼 미오픈</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">메시지 노출</span>
              </div>
            </div>
            <SimplePlaceholderChart
              height={150}
              color="#6366F1"
              data={[0, 0, 0, 0, 0, 0, 0]}
              labels={['03.06', '03.07', '03.08', '03.09', '03.10', '03.11', '03.12']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
