import {
  Monitor,
  Minus,
  PanelRightOpen,
  Maximize,
  MousePointerClick,
  MessageSquare,
  Megaphone,
  Bell,
  Youtube,
  Instagram,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BANNER_FORMAT_WITHOUT_SUBTYPE } from '@/models/type';
import type { BannerFormatType, BannerSubType } from '@/models/type';

interface IBannerTypeStepProps {
  selectedBannerType: BannerFormatType | null;
  onBannerTypeChange: (type: BannerFormatType) => void;
  selectedSubType: BannerSubType | null;
  onSubTypeChange: (subType: BannerSubType) => void;
}

const BANNER_FORMAT_OPTIONS: Array<{
  type: BannerFormatType;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
}> = [
  {
    type: '센터 팝업',
    icon: <Monitor size={20} />,
    subtitle: '모달 팝업',
    description: '화면 중앙에 모달 형태로 노출되는 팝업. 프로모션, 쿠폰 발급, 중요 공지에 적합합니다.',
  },
  {
    type: '띠배너',
    icon: <Minus size={20} />,
    subtitle: '상단 배너',
    description: '페이지 상단에 얇은 띠 형태로 노출. 이벤트 안내, 배송 공지, 한줄 프로모션에 적합합니다.',
  },
  {
    type: '슬라이드인',
    icon: <PanelRightOpen size={20} />,
    subtitle: '하단 슬라이드',
    description: '우측 하단에서 슬라이드 형태로 등장. 재방문 유도, 리뷰 요청, 부드러운 CTA에 적합합니다.',
  },
  {
    type: '풀스크린',
    icon: <Maximize size={20} />,
    subtitle: '전체 화면',
    description: '전체 화면을 덮는 풀스크린 오버레이. 신규 방문자 안내, 대형 이벤트, 회원가입 유도에 적합합니다.',
  },
  {
    type: '이탈 감지',
    icon: <MousePointerClick size={20} />,
    subtitle: '이탈 방지',
    description: '사용자가 페이지를 떠나려 할 때 자동 노출. 이탈 방지 쿠폰, 마지막 제안, 장바구니 리마인더에 적합합니다.',
  },
];

const SUB_TYPE_OPTIONS: Array<{
  type: BannerSubType;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
}> = [
  {
    type: '기본형',
    icon: <MessageSquare size={20} />,
    subtitle: '인사말, 브랜드 로고',
    description: '간단한 문장으로 고객들에게 인사말을 전해보세요!',
  },
  {
    type: '프로모션형',
    icon: <Megaphone size={20} />,
    subtitle: '이벤트, 버튼 CTA',
    description: '이벤트를 효과적으로 홍보하고 고객을 이벤트 페이지로 연결하세요.',
  },
  {
    type: '마케팅 수신동의',
    icon: <Bell size={20} />,
    subtitle: '수신 동의 유도',
    description: '마케팅 수신 미동의 고객 대상으로 수신 동의를 유도합니다.',
  },
  {
    type: '홍보 유튜브',
    icon: <Youtube size={20} />,
    subtitle: '영상 콘텐츠 노출',
    description: 'YouTube 영상을 직접 노출하여 생동감 있게 전달하세요.',
  },
  {
    type: '홍보 인스타',
    icon: <Instagram size={20} />,
    subtitle: '피드/게시물 노출',
    description: '인스타그램 피드 게시물을 노출할 수 있습니다.',
  },
];

export function BannerTypeStep({
  selectedBannerType,
  onBannerTypeChange,
  selectedSubType,
  onSubTypeChange,
}: IBannerTypeStepProps) {
  const needsSubType = selectedBannerType && !BANNER_FORMAT_WITHOUT_SUBTYPE.includes(selectedBannerType);

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">어떤 유형의 배너를 만드시겠어요?</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        배너가 고객에게 노출되는 방식을 선택하세요
      </p>

      <div className="grid grid-cols-2 gap-3">
        {BANNER_FORMAT_OPTIONS.map((opt) => {
          const isSelected = selectedBannerType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => onBannerTypeChange(opt.type)}
              className={cn(
                'relative flex items-start gap-3.5 rounded-xl border-2 p-4 text-left',
                isSelected
                  ? 'border-primary bg-gray-50/80 shadow-sm'
                  : 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
              )}>
                {opt.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{opt.type}</p>
                <p className="text-xs text-muted-foreground">{opt.subtitle}</p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground/80">{opt.description}</p>
              </div>

              <div className={cn(
                'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
              )}>
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* 세부 유형 선택 (띠배너, 이탈감지 제외) */}
      {needsSubType && (
        <div className="mt-8">
          <h2 className="mb-1 text-base font-semibold">세부 유형을 선택하세요</h2>
          <p className="mb-5 text-xs text-muted-foreground">
            콘텐츠 구성 방식에 따라 세부 유형을 선택합니다
          </p>

          <div className="grid grid-cols-2 gap-3">
            {SUB_TYPE_OPTIONS.map((opt) => {
              const isSelected = selectedSubType === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => onSubTypeChange(opt.type)}
                  className={cn(
                    'relative flex items-start gap-3.5 rounded-xl border-2 p-4 text-left',
                    isSelected
                      ? 'border-primary bg-gray-50/80 shadow-sm'
                      : 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  <div className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  )}>
                    {opt.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{opt.type}</p>
                    <p className="text-xs text-muted-foreground">{opt.subtitle}</p>
                    <p className="mt-2 text-xs leading-snug text-muted-foreground/80">{opt.description}</p>
                  </div>

                  <div className={cn(
                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                    isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                  )}>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
