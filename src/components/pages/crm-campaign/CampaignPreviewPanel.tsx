import { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAMPAIGN_TYPES } from './CampaignTypeStep';
import type { IRecipientFilter } from './CampaignRecipientStep';

/** 캠페인별 추천 프롬프트 */
const CAMPAIGN_PROMPTS: Record<string, string[]> = {
  custom: ['나에게 맞는 캠페인이 없다면?\n나만의 캠페인을 제작해 보세요!', '#{고객명}님, 고객님만을 위한 특별한 혜택을 준비했어요.'],
  'welcome-back': ['#{고객명}님, 다시 만나 반가워요! 😊\n돌아오신 기념으로 특별 쿠폰을 드립니다.', '오랜만에 방문하신 고객님께\n재방문 감사 혜택을 드려요!'],
  'new-member': ['#{고객명}님, 가입을 환영합니다! 🎉\n신규회원만 받을 수 있는 혜택을 꼭 받아보세요.', '첫 구매 시 20% 할인!\n지금 바로 시작해보세요.'],
  repurchase: ['#{고객명}님, 이전에 구매하신 상품 어떠셨나요?\n재구매 시 특별 할인을 드려요!'],
  'purchase-thanks': ['#{고객명}님, 구매해 주셔서 감사합니다! ❤️\n다음 방문 때 사용하실 수 있는 쿠폰을 드려요.'],
  birthday: ['#{고객명}님, 생일 축하드려요! 🎂\n생일 기념 특별 쿠폰을 선물합니다.'],
  vip: ['#{고객명}님은 소중한 VIP 고객이세요! ⭐\nVIP만을 위한 프리미엄 혜택을 확인하세요.'],
  'long-inactive': ['#{고객명}님, 오랜 기간 방문하지 않으셨군요 😢\n장기 미접속 시 보유한 적립금이 소멸될 수 있습니다.'],
  'cart-reminder': ['#{고객명}님이 담으신 상품이 장바구니에 남아있어요 🛒\n품절되기 전에 구매를 서두르세요!'],
  'long-no-purchase': ['#{고객명}님 잘 계시죠..?\n고객님에게만 드리는 시크릿쿠폰 🎉'],
  'all-friends': ['카카오 채널 친구분들께 드리는 소식\n새로운 상품이 도착했어요! 놓치기 아까운 시즌 신상품!'],
  seasonal: ['#{고객명}님, 즐거운 시즌 보내세요! 🎄\n시즌 한정 특별 혜택을 준비했어요.'],
};

interface ICampaignPreviewPanelProps {
  campaignName: string;
  campaignTypeId: string | null;
  bodyText: string;
  headerText: string;
  buttonCount: number;
  couponEnabled: boolean;
  couponName: string;
  currentStep: number;
  recipientFilter: IRecipientFilter;
}

export function CampaignPreviewPanel({
  campaignTypeId,
  bodyText,
  buttonCount,
  couponEnabled,
  couponName,
  currentStep,
  recipientFilter,
}: ICampaignPreviewPanelProps) {
  const [conditionOpen, setConditionOpen] = useState(true);
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);
  const isAllFriends = campaignTypeId === 'all-friends';

  // step 1: 캠페인 유형 선택 시 예시 화면 + 추천 프롬프트
  if (currentStep === 1) {
    const prompts = campaignTypeId ? (CAMPAIGN_PROMPTS[campaignTypeId] ?? []) : [];
    return (
      <div className="p-5">
        {campaignType ? (
          <>
            {/* 캠페인 예시 카카오톡 프리뷰 */}
            <div className="rounded-2xl bg-[#B2C7D9] p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">HT</div>
                <span className="text-[10px] font-medium text-[#3B4A5A]">(광고)헤이데어</span>
              </div>
              <div className="ml-10 rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm">
                <p className="whitespace-pre-wrap text-xs leading-[1.7] text-[#333]">
                  {prompts[0] || `${campaignType.name} 메시지 예시`}
                </p>
                <div className="mt-3 border-t border-[#e5e5e5] pt-3">
                  <div className="flex items-center justify-center rounded-full border border-[#c5cdd5] py-2 text-xs font-medium text-[#3B4A5A]">
                    홈페이지로 이동
                  </div>
                </div>
              </div>
            </div>

            {/* 추천 프롬프트 */}
            {prompts.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-primary" />
                  <p className="text-xs font-semibold text-primary">추천 메시지 문구</p>
                </div>
                <div className="space-y-1.5">
                  {prompts.map((p, idx) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-white px-3 py-2.5 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-border/60 bg-white text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">HT</div>
            <p className="text-xs text-muted-foreground">캠페인 유형을 선택하면<br />예시 화면이 표시됩니다</p>
          </div>
        )}

        <ProgressBar currentStep={currentStep} />
      </div>
    );
  }

  // step 2, 3, 4: 카카오톡 미리보기 + 수신조건
  return (
    <div className="p-5">
      {/* 발송메시지 수신조건 (step 3에서만) */}
      {currentStep === 3 && (
        <div className="mb-4 rounded-xl border border-border/60 bg-white">
          <button onClick={() => setConditionOpen(!conditionOpen)} className="flex w-full items-center justify-between px-4 py-3 text-left">
            <span className="text-sm font-semibold">발송메시지 수신조건</span>
            {conditionOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          {conditionOpen && (
            <div className="space-y-2 border-t border-border/40 px-4 pb-4 pt-3">
              {isAllFriends ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">수신대상</span>
                  <span className="font-medium text-primary">카카오 채널 친구 전체</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">회원 조건</span>
                    <span className="font-medium text-primary">{recipientFilter.grade}</span>
                  </div>
                  {campaignType?.filters.includes('cartOwnership') && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">장바구니</span>
                      <span className="font-medium">{recipientFilter.cartOwnership === 'all' ? '전체' : recipientFilter.cartOwnership === 'has' ? '보유' : '미보유'}</span>
                    </div>
                  )}
                  {campaignType?.filters.includes('purchaseStatus') && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">구매여부</span>
                      <span className="font-medium">{recipientFilter.purchaseStatus === 'all' ? '전체' : recipientFilter.purchaseStatus === 'has' ? '구매있음' : '구매없음'}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 카카오톡 메시지 프리뷰 */}
      <div className="rounded-2xl bg-[#B2C7D9] p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">HT</div>
          <span className="text-[10px] font-medium text-[#3B4A5A]">(광고)헤이데어</span>
        </div>
        <div className="ml-10 rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm">
          {bodyText ? (
            <div className="whitespace-pre-wrap text-xs leading-[1.7] text-[#333]">
              {bodyText.length > 200 ? `${bodyText.slice(0, 200)}...` : bodyText}
            </div>
          ) : (
            <p className="text-xs text-[#999]">메시지를 작성해주세요.</p>
          )}
          {couponEnabled && couponName && (
            <div className="mt-2 text-xs text-amber-600">🎫 {couponName}</div>
          )}
          {buttonCount > 0 && (
            <div className="mt-3 border-t border-[#e5e5e5] pt-3">
              <div className="flex items-center justify-center rounded-full border border-[#c5cdd5] py-2 text-xs font-medium text-[#3B4A5A]">
                홈페이지로 이동
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 포인트/발송 정보 */}
      <div className="mt-4 rounded-xl border border-border/60 bg-white p-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">현재 포인트</span>
            <span className="text-sm font-bold text-foreground">48,500<span className="text-xs font-normal text-muted-foreground"> P</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">예상 차감 포인트</span>
            <span className="text-sm font-bold text-primary">{isAllFriends ? '360' : recipientFilter.grade === '전체' ? '1,230' : '0'}<span className="text-xs font-normal text-muted-foreground"> P</span></span>
          </div>
          <div className="h-px bg-border/60" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">발송 모수</span>
            <span className="text-sm font-bold text-foreground">{isAllFriends ? '24' : recipientFilter.grade === '전체' ? '82' : '0'}<span className="text-xs font-normal text-muted-foreground"> 명</span></span>
          </div>
        </div>
      </div>

      <ProgressBar currentStep={currentStep} />
    </div>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-4 rounded-xl border border-border/60 bg-white p-3">
      <p className="mb-2 text-xs text-muted-foreground">진행 상태</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={cn('h-1.5 flex-1 rounded-full', s <= currentStep ? 'bg-primary' : 'bg-gray-200')} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{currentStep}/4 단계 완료</p>
    </div>
  );
}
