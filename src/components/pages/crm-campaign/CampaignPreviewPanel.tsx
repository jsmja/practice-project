import { cn } from '@/lib/utils';
import { CAMPAIGN_TYPES } from './CampaignTypeStep';

interface ICampaignPreviewPanelProps {
  campaignName: string;
  campaignTypeId: string | null;
  messageTypeId: string | null;
  bodyText: string;
  headerText: string;
  buttonCount: number;
  couponEnabled: boolean;
  couponName: string;
  sendOption: 'now' | 'reserved';
  sendDate: string;
  sendTime: string;
  currentStep: number;
}

export function CampaignPreviewPanel({
  campaignName,
  campaignTypeId,
  messageTypeId,
  bodyText,
  headerText,
  buttonCount,
  couponEnabled,
  couponName,
  sendOption,
  sendDate,
  sendTime,
  currentStep,
}: ICampaignPreviewPanelProps) {
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);

  return (
    <div className="p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">미리보기</p>

      {/* 카카오톡 메시지 프리뷰 */}
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        {/* 카카오 헤더 */}
        <div className="flex items-center gap-2 rounded-t-2xl bg-kakao px-4 py-2.5">
          <div className="h-6 w-6 rounded-full bg-kakao-foreground/20" />
          <span className="text-xs font-bold text-kakao-foreground">브랜드 채널</span>
        </div>

        {/* 메시지 본문 */}
        <div className="p-4">
          {/* 헤더 */}
          {headerText && (
            <p className="mb-2 text-sm font-bold text-foreground">{headerText}</p>
          )}

          {/* 본문 */}
          {bodyText ? (
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
              {bodyText.length > 200 ? `${bodyText.slice(0, 200)}...` : bodyText}
            </p>
          ) : (
            <div className="space-y-1.5 py-2">
              <div className="h-2 w-full rounded bg-gray-100" />
              <div className="h-2 w-4/5 rounded bg-gray-100" />
              <div className="h-2 w-3/5 rounded bg-gray-100" />
              <p className="mt-3 text-center text-xs text-muted-foreground">메시지 내용을 입력하면 여기에 표시됩니다</p>
            </div>
          )}

          {/* 쿠폰 */}
          {couponEnabled && couponName && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-xs font-medium text-amber-700">🎫 {couponName}</p>
            </div>
          )}

          {/* 버튼 미리보기 */}
          {buttonCount > 0 && (
            <div className="mt-3 space-y-1.5">
              {Array.from({ length: Math.min(buttonCount, 3) }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-gray-50 py-2 text-center text-xs font-medium text-foreground">
                  버튼 {i + 1}
                </div>
              ))}
              {buttonCount > 3 && (
                <p className="text-center text-xs text-muted-foreground">외 {buttonCount - 3}개 버튼</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 설정 요약 */}
      <div className="mt-4 space-y-3">
        {/* 캠페인 유형 */}
        {campaignType && (
          <div className="rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-1 text-xs text-muted-foreground">캠페인 유형</p>
            <div className="flex items-center gap-2">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', campaignType.iconBg)}>
                {campaignType.icon}
              </div>
              <span className="text-xs font-medium">{campaignType.name}</span>
            </div>
          </div>
        )}

        {/* 발송 정보 */}
        {currentStep >= 4 && (
          <div className="rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-1 text-xs text-muted-foreground">발송 방식</p>
            <p className="text-xs font-medium">
              {sendOption === 'now' ? '⚡ 즉시 발송' : `📅 ${sendDate || '미정'} ${sendTime || ''}`}
            </p>
          </div>
        )}

        {/* 이름 */}
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-1 text-xs text-muted-foreground">캠페인명</p>
          <p className="text-xs font-medium">{campaignName || '(미입력)'}</p>
        </div>

        {/* 진행 상태 */}
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-2 text-xs text-muted-foreground">진행 상태</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  s <= currentStep ? 'bg-foreground' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{currentStep}/5 단계 완료</p>
        </div>
      </div>
    </div>
  );
}
