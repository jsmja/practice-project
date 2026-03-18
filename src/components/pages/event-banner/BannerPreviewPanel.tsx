import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BannerFormatPreview } from './BannerFormatPreview';
import { AlertTriangle } from 'lucide-react';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerSubType } from '@/models/type';
import type { IPromoCard } from '@/store/useBannerManagementStore';
import type { IAudienceState } from './steps/BannerAudienceStep';
import type { IDeliveryState } from './steps/BannerDeliveryStep';

const TOTAL_STEPS = 5;

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-white p-3">
      <p className="mb-2 text-xs text-muted-foreground">진행 상태</p>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={cn('h-1.5 flex-1 rounded-full', s <= currentStep ? 'bg-primary' : 'bg-gray-200')}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{currentStep}/{TOTAL_STEPS} 단계 완료</p>
    </div>
  );
}

interface IBannerPreviewPanelProps {
  selectedBannerFormat: string | null;
  selectedTemplate: IBannerTemplateDto | null;
  generatedPreview: string | null;
  currentStep: number;
  subType: BannerSubType | null;
  mainTitle: string;
  subTitle: string;
  bodyText: string;
  iconBgColor: string;
  promoCards: IPromoCard[];
  youtubeUrl: string;
  consentGuideText: string;
  consentButtonLabel: string;
  audience?: IAudienceState;
  delivery?: IDeliveryState;
  onSuggestionSelect?: (text: string) => void;
}

export function BannerPreviewPanel({
  selectedBannerFormat,
  selectedTemplate,
  generatedPreview,
  currentStep,
  subType,
  mainTitle,
  subTitle,
  bodyText,
  iconBgColor,
  promoCards,
  youtubeUrl,
  consentGuideText,
  consentButtonLabel,
  audience,
  delivery,
  onSuggestionSelect,
}: IBannerPreviewPanelProps) {
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (selectedBannerFormat) {
      setAnimateKey((prev) => prev + 1);
    }
  }, [selectedBannerFormat]);

  // step 1: 배너 유형 미리보기
  if (currentStep === 1) {
    return (
      <div className="p-5">
        <div
          key={animateKey}
          className={cn(
            'rounded-2xl border border-border/60 bg-white p-4 shadow-sm',
            selectedBannerFormat && 'animate-preview-enter'
          )}
        >
          {selectedBannerFormat ? (
            <div className="flex flex-col items-center">
              <BannerFormatPreview format={selectedBannerFormat} />
              <p className="mt-2 text-xs font-medium text-foreground">{selectedBannerFormat}</p>
              <p className="text-xs text-muted-foreground">배너 유형 미리보기</p>
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <div className="mb-2 h-12 w-12 rounded-xl bg-gray-100" />
              <p className="text-xs text-muted-foreground">배너 유형을 선택하면<br />미리보기가 표시됩니다</p>
            </div>
          )}
        </div>
        <ProgressBar currentStep={currentStep} />
      </div>
    );
  }

  // step 2: 템플릿 선택 - 추천 문구 선택 + 미리보기 이미지
  if (currentStep === 2) {
    const SUGGESTION_PREVIEWS = [
      { text: '봄 신메뉴 출시! 지금 주문하면 20% 할인', color: 'from-green-300 to-emerald-400' },
      { text: '3개월 만에 돌아오셨군요! 특별 재방문 쿠폰', color: 'from-blue-300 to-indigo-400' },
      { text: '지금 등록하면 3개월 + 1개월 무료!', color: 'from-amber-300 to-orange-400' },
      { text: '이번 시즌 신상품을 먼저 만나보세요', color: 'from-violet-300 to-purple-400' },
    ];

    return (
      <div className="p-5">
        {selectedTemplate ? (
          <div className="space-y-3">
            {/* 미리보기 이미지 - 선택된 문구에 따라 변경 */}
            <div className={cn(
              'flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br p-4 text-center shadow-sm',
              generatedPreview
                ? (SUGGESTION_PREVIEWS.find((s) => s.text === generatedPreview)?.color ?? 'from-primary/30 to-primary/50')
                : 'from-gray-200 to-gray-300'
            )}>
              <p className="text-sm font-bold text-white drop-shadow-sm">
                {generatedPreview || selectedTemplate.name}
              </p>
            </div>

            {/* 선택 템플릿 */}
            <div className="rounded-xl border border-border/60 bg-white p-3">
              <p className="mb-1 text-xs text-muted-foreground">선택 템플릿</p>
              <p className="text-xs font-medium">{selectedTemplate.name}</p>
              <p className="text-xs text-muted-foreground">{selectedTemplate.industry} · {selectedTemplate.purpose}</p>
            </div>

            {/* 추천 문구 선택 */}
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">추천 문구 선택</p>
              <div className="space-y-1.5">
                {SUGGESTION_PREVIEWS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSuggestionSelect?.(s.text)}
                    className={cn(
                      'w-full rounded-lg border px-3 py-2.5 text-left text-xs leading-relaxed transition-all',
                      generatedPreview === s.text
                        ? 'border-primary bg-primary/5 font-medium text-primary'
                        : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5'
                    )}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-border/60 bg-white text-center">
            <div className="mb-2 h-12 w-12 rounded-xl bg-gray-100" />
            <p className="text-xs text-muted-foreground">템플릿을 선택하면<br />추천 문구가 표시됩니다</p>
          </div>
        )}
        <ProgressBar currentStep={currentStep} />
      </div>
    );
  }

  // step 3: 콘텐츠 설정 미리보기
  if (currentStep === 3) {
    return (
      <div className="p-5">
        <ContentPreview
          subType={subType}
          mainTitle={mainTitle}
          subTitle={subTitle}
          bodyText={bodyText}
          iconBgColor={iconBgColor}
          promoCards={promoCards}
          youtubeUrl={youtubeUrl}
          consentGuideText={consentGuideText}
          consentButtonLabel={consentButtonLabel}
        />
        <ProgressBar currentStep={currentStep} />
      </div>
    );
  }

  // step 4: 오디언스 설정 미리보기
  if (currentStep === 4) {
    return (
      <div className="p-5">
        <ContentPreview
          subType={subType}
          mainTitle={mainTitle}
          subTitle={subTitle}
          bodyText={bodyText}
          iconBgColor={iconBgColor}
          promoCards={promoCards}
          youtubeUrl={youtubeUrl}
          consentGuideText={consentGuideText}
          consentButtonLabel={consentButtonLabel}
        />
        {audience && (
          <div className="mt-4 rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">오디언스 설정</p>
            <div className="space-y-1 text-xs">
              <p>대상: <span className="font-medium">{audience.targetCustomer === 'all' ? '전체 고객' : audience.targetCustomer === 'loggedIn' ? '로그인' : '비로그인'}</span></p>
              {audience.activeItems.includes('visitDay') && (
                <p>요일: <span className="font-medium">{audience.allDays ? '모든 요일' : audience.visitDays.join(', ')}</span></p>
              )}
              {audience.activeItems.includes('visitCount') && (
                <p>방문: <span className="font-medium">{audience.visitCount}회 이상</span></p>
              )}
            </div>
          </div>
        )}
        <ProgressBar currentStep={currentStep} />
      </div>
    );
  }

  // step 5: 발송 조건 설정 - 노출 위치 미리보기
  return (
    <div className="p-5">
      {/* 노출 위치 미니 프리뷰 */}
      <div className="mb-4 rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100">
          {/* 미니 브라우저 타이틀바 */}
          <div className="flex h-5 items-center gap-1 bg-gray-200 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
            <div className="ml-2 h-2 w-20 rounded bg-gray-300" />
          </div>
          {/* 페이지 콘텐츠 골격 */}
          <div className="p-3">
            <div className="mb-2 h-2 w-16 rounded bg-gray-200" />
            <div className="mb-1 h-1.5 w-full rounded bg-gray-200/70" />
            <div className="mb-1 h-1.5 w-4/5 rounded bg-gray-200/70" />
            <div className="mb-1 h-1.5 w-3/5 rounded bg-gray-200/70" />
            <div className="mb-2 h-1.5 w-full rounded bg-gray-200/70" />
            <div className="h-1.5 w-2/3 rounded bg-gray-200/70" />
          </div>
          {/* 노출 위치별 배너 표시 */}
          {delivery?.displayPosition === 'center' && (
            <>
              <div className="absolute inset-0 top-5 bg-black/20" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-4 shadow-lg">
                <div className="mb-1.5 h-1.5 w-16 rounded bg-primary/60" />
                <div className="mb-1 h-1 w-20 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-14 rounded bg-primary" />
              </div>
            </>
          )}
          {delivery?.displayPosition === 'corner-center' && (
            <>
              <div className="absolute inset-0 top-5 bg-black/10" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-5 py-3 shadow-lg">
                <div className="mb-1 h-1.5 w-14 rounded bg-primary/60" />
                <div className="h-1 w-18 rounded bg-gray-200" />
                <div className="mt-1.5 h-2.5 w-12 rounded bg-primary" />
              </div>
            </>
          )}
          {delivery?.displayPosition === 'heybutton' && (
            <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
              <span className="text-xs font-bold text-white">H</span>
            </div>
          )}
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-xs font-medium">
            {delivery?.displayPosition === 'center' ? '페이지 가운데' : delivery?.displayPosition === 'corner-center' ? '딥처리 및 페이지 가운데' : delivery?.displayPosition === 'heybutton' ? '헤이버튼 위치에 출력' : '노출 위치 미리보기'}
          </p>
        </div>
      </div>

      {/* 발송 조건 요약 */}
      {delivery && (
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">발송 조건 요약</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">발송 횟수</span><span className="font-medium">{delivery.frequency === 'once' ? '처음 1회' : delivery.frequency === 'daily' ? '매일 1회' : '접속 할 때마다'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">우선순위</span><span className="font-medium">{delivery.priority}순위</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">노출 위치</span><span className="font-medium">{delivery.displayPosition === 'center' ? '페이지 가운데' : delivery.displayPosition === 'corner-center' ? '딥처리 및 가운데' : '헤이버튼'}</span></div>
          </div>
        </div>
      )}

      <ProgressBar currentStep={currentStep} />
    </div>
  );
}

/* ── 콘텐츠 미리보기 (세부유형별) ── */
function ContentPreview({
  subType,
  mainTitle,
  subTitle,
  bodyText,
  iconBgColor,
  promoCards,
  youtubeUrl,
  consentGuideText,
  consentButtonLabel,
}: {
  subType: BannerSubType | null;
  mainTitle: string;
  subTitle: string;
  bodyText: string;
  iconBgColor: string;
  promoCards: IPromoCard[];
  youtubeUrl: string;
  consentGuideText: string;
  consentButtonLabel: string;
}) {
  if (subType === '기본형' || !subType) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: iconBgColor }}>
            <div className="h-5 w-5 rounded bg-white/30" />
          </div>
          <p className="text-sm font-semibold">{mainTitle || '메인 타이틀'}</p>
        </div>
        {subTitle && <p className="mt-2 text-xs text-muted-foreground">{subTitle}</p>}
        {bodyText && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{bodyText}</p>}
      </div>
    );
  }

  if (subType === '프로모션형') {
    const card = promoCards[0];
    return (
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex h-36 items-center justify-center rounded-t-2xl bg-gradient-to-br from-purple-200 to-pink-200">
          <span className="text-sm text-purple-500">이미지 미리보기</span>
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold">{card?.mainTitle || '메인 타이틀'}</p>
          {card?.bodyText && <p className="mt-1 text-xs text-muted-foreground">{card.bodyText}</p>}
          {card?.buttonLabel && (
            <button className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white">{card.buttonLabel}</button>
          )}
        </div>
      </div>
    );
  }

  if (subType === '홍보 유튜브') {
    const hasUrl = youtubeUrl.trim().length > 0;
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        {hasUrl ? (
          <div className="flex h-40 items-center justify-center rounded-xl bg-gray-900 text-white">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-600">▶</div>
              <p className="text-xs text-gray-400">YouTube 영상</p>
            </div>
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-center">
            <AlertTriangle size={20} className="mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">연결할 영상의 URL을 입력해 주세요.</p>
          </div>
        )}
      </div>
    );
  }

  if (subType === '홍보 인스타') {
    const MOCK_COLORS = ['#7C3AED', '#EC4899', '#F59E0B', '#22C55E', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316'];
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs text-white">IG</div>
          <p className="text-xs font-semibold">heythere_moley</p>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MOCK_COLORS.map((color, i) => (
            <div key={i} className="aspect-square rounded" style={{ backgroundColor: color + '40' }} />
          ))}
        </div>
      </div>
    );
  }

  if (subType === '마케팅 수신동의') {
    return (
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex h-36 items-center justify-center rounded-t-2xl bg-gradient-to-br from-violet-200 to-indigo-200">
          <div className="text-center">
            <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-lg font-bold text-white">Hi!</div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-semibold">{mainTitle || '메인 타이틀'}</p>
          <div className="mt-2 rounded-lg border border-border/60 bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium">쿠폰명</p>
            <p className="text-xs text-muted-foreground">사용 기준</p>
          </div>
          <button className="mt-3 w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-white">
            {consentButtonLabel || '마케팅 수신 동의하기'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
