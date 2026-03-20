import { cn } from '@/lib/utils';
import {
  MOCK_HEYBOARD_STATUS,
  MOCK_CHAT_CONSULT_QUOTA,
  MOCK_MARKETING_SUMMARY,
  MOCK_ACCOUNT_BALANCE,
} from '@/mocks/dashboard';
import {
  LayoutGrid,
  MousePointerClick,
  Layers,
  Image,
  MessageSquare,
  CalendarClock,
  Coins,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MiniDonut({ used, total }: { used: number; total: number }) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="#fbbf24"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-base font-bold text-foreground">{used}</span>
        <span className="text-xs text-muted-foreground">{total}</span>
      </div>
    </div>
  );
}

export function ServiceSummarySection() {
  const navigate = useNavigate();
  const heyboard = MOCK_HEYBOARD_STATUS;
  const chat = MOCK_CHAT_CONSULT_QUOTA;
  const marketing = MOCK_MARKETING_SUMMARY;
  const balance = MOCK_ACCOUNT_BALANCE;
  const isLowBalance = balance.points <= balance.lowThreshold;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* 헤이보드 현황 */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">헤이보드 현황</h4>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            상세보기 →
          </button>
        </div>
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2">
              <LayoutGrid size={16} className="text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">사용 중인 헤이보드</span>
            <span className="ml-auto text-base font-bold">1개</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <MousePointerClick size={16} className="text-indigo-500" />
            </div>
            <span className="text-sm text-muted-foreground">사용 중인 헤이버튼</span>
            <span className="ml-auto text-base font-bold">{heyboard.buttonCount}개</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Layers size={16} className="text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">사용 중인 카드</span>
            <span className="ml-auto text-base font-bold">
              {heyboard.cards.filter((c) => c.isActive).length}개
            </span>
          </div>
        </div>
      </div>

      {/* 채팅상담 노출 제공량 */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">채팅상담 노출 제공량</h4>
          <span className="text-xs text-muted-foreground">{chat.resetCycle} 기준</span>
        </div>
        <div className="flex items-center gap-5">
          <MiniDonut used={chat.used} total={chat.total} />
          <div>
            <p className="text-xs text-muted-foreground">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />
              노출 수 (해피톡 제외)
            </p>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              해피톡 상담은 무제한
              <br />
              무료로 이용 가능합니다.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/service-integration')}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
        >
          <Zap size={12} />
          무제한 이용하기
        </button>
      </div>

      {/* 마케팅 현황 */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">마케팅 현황</h4>
          <button
            onClick={() => navigate('/marketing/crm')}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            상세보기 →
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Image size={14} className="text-violet-500" />
                <span className="text-xs text-muted-foreground">마케팅 팝업</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold">{marketing.activeBanners}건</p>
            </div>
            <div className="rounded-xl border border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-blue-500" />
                <span className="text-xs text-muted-foreground">메시지</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold">{marketing.activeCrm}건</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className="text-gray-400" />
                <span className="text-xs text-muted-foreground">진행 예정</span>
              </div>
              <p className="mt-1.5 text-2xl font-bold">{marketing.scheduledCampaigns}건</p>
            </div>
            <div className={cn(
              'rounded-xl border px-4 py-3',
              isLowBalance ? 'border-red-200 bg-red-50/30' : 'border-border/60',
            )}>
              <div className="flex items-center gap-2">
                <Coins size={14} className={isLowBalance ? 'text-red-500' : 'text-amber-500'} />
                <span className="text-xs text-muted-foreground">잔여 포인트</span>
              </div>
              <p className={cn('mt-1.5 text-2xl font-bold', isLowBalance && 'text-red-600')}>
                {balance.points.toLocaleString()}P
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
