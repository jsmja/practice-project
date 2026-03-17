import {
  Monitor,
  Minus,
  PanelRightOpen,
  Maximize,
  MousePointerClick,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BannerFormatPreview } from '../BannerFormatPreview';
import type { BannerFormatType } from '@/models/type';

interface IBannerTypeStepProps {
  selectedBannerType: BannerFormatType | null;
  onBannerTypeChange: (type: BannerFormatType) => void;
}

const BANNER_FORMAT_OPTIONS: Array<{
  type: BannerFormatType;
  icon: React.ReactNode;
  iconBg: string;
  gradient: string;
  description: string;
  useCase: string;
}> = [
  {
    type: '센터 팝업',
    icon: <Monitor size={22} />,
    iconBg: 'bg-indigo-100 text-indigo-600',
    gradient: 'from-indigo-500 to-violet-600',
    description: '화면 중앙에 모달 형태로 노출되는 팝업',
    useCase: '프로모션, 쿠폰 발급, 중요 공지에 적합',
  },
  {
    type: '띠배너',
    icon: <Minus size={22} />,
    iconBg: 'bg-amber-100 text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
    description: '페이지 상단에 얇은 띠 형태로 노출',
    useCase: '이벤트 안내, 배송 공지, 한줄 프로모션에 적합',
  },
  {
    type: '슬라이드인',
    icon: <PanelRightOpen size={22} />,
    iconBg: 'bg-blue-100 text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
    description: '우측 하단에서 슬라이드 형태로 등장',
    useCase: '재방문 유도, 리뷰 요청, 부드러운 CTA에 적합',
  },
  {
    type: '풀스크린',
    icon: <Maximize size={22} />,
    iconBg: 'bg-violet-100 text-violet-600',
    gradient: 'from-violet-500 to-purple-600',
    description: '전체 화면을 덮는 풀스크린 오버레이',
    useCase: '신규 방문자 안내, 대형 이벤트, 회원가입 유도에 적합',
  },
  {
    type: '이탈 감지',
    icon: <MousePointerClick size={22} />,
    iconBg: 'bg-rose-100 text-rose-600',
    gradient: 'from-rose-500 to-pink-600',
    description: '사용자가 페이지를 떠나려 할 때 자동 노출',
    useCase: '이탈 방지 쿠폰, 마지막 제안, 장바구니 리마인더에 적합',
  },
];

export function BannerTypeStep({ selectedBannerType, onBannerTypeChange }: IBannerTypeStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">어떤 유형의 배너를 만드시겠어요?</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        배너가 고객에게 노출되는 방식을 선택하세요. 각 유형별 미리보기를 확인할 수 있어요
      </p>

      <div className="grid grid-cols-2 gap-3">
        {BANNER_FORMAT_OPTIONS.map((opt) => {
          const isSelected = selectedBannerType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => onBannerTypeChange(opt.type)}
              className={cn(
                'relative flex gap-4 overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
                isSelected
                  ? 'border-foreground bg-gray-50 shadow-sm'
                  : 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              {/* gradient accent bar */}
              <div className={cn('absolute left-0 top-0 h-full w-1 bg-gradient-to-b', opt.gradient)} />

              <div className="flex flex-col items-center gap-2">
                <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', opt.iconBg)}>
                  {opt.icon}
                </div>
                {/* 미니 미리보기 */}
                <BannerFormatPreview format={opt.type} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{opt.type}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{opt.description}</p>
                <p className="mt-2 text-xs text-muted-foreground/80">{opt.useCase}</p>
              </div>

              {isSelected && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
