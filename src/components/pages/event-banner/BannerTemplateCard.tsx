import { cn } from '@/lib/utils';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import {
  UtensilsCrossed,
  Scissors,
  Shirt,
  Coffee,
  Star,
  GraduationCap,
  Dumbbell,
  Heart,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Scissors,
  Shirt,
  Coffee,
  Star,
  GraduationCap,
  Dumbbell,
  Heart,
};

const COLOR_MAP: Record<string, { bg: string; gradientFrom: string; gradientTo: string }> = {
  orange: { bg: 'bg-orange-500', gradientFrom: 'from-orange-400', gradientTo: 'to-amber-500' },
  rose: { bg: 'bg-rose-500', gradientFrom: 'from-rose-400', gradientTo: 'to-pink-500' },
  violet: { bg: 'bg-violet-500', gradientFrom: 'from-violet-400', gradientTo: 'to-purple-600' },
  amber: { bg: 'bg-amber-500', gradientFrom: 'from-amber-400', gradientTo: 'to-yellow-500' },
  blue: { bg: 'bg-blue-500', gradientFrom: 'from-blue-400', gradientTo: 'to-indigo-500' },
  emerald: { bg: 'bg-emerald-500', gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-500' },
  red: { bg: 'bg-red-500', gradientFrom: 'from-red-400', gradientTo: 'to-rose-500' },
  teal: { bg: 'bg-teal-500', gradientFrom: 'from-teal-400', gradientTo: 'to-cyan-500' },
};

/** 템플릿별 예시 메시지 */
const SAMPLE_MESSAGES: Record<string, { title: string; body: string; button: string }> = {
  t1: { title: '다시 만나서 반가워요!', body: '오랜만에 방문하신 고객님께 특별 할인 쿠폰을 드립니다. 지금 바로 확인해보세요!', button: '쿠폰 받기' },
  t2: { title: '첫 방문을 환영합니다!', body: '신규 고객님을 위한 특별 혜택이 준비되어 있어요. 첫 구매 시 20% 할인!', button: '혜택 확인' },
  t3: { title: '신상품이 도착했어요!', body: '이번 시즌 신상품을 먼저 만나보세요. 한정 수량 특별가로 제공됩니다.', button: '자세히 보기' },
  t4: { title: '특별 이벤트 안내', body: '오늘 하루 한정! 기간 한정 할인으로, 절대 놓치지마세요!', button: '자세히 보기' },
  t5: { title: '소중한 후기를 남겨주세요', body: '방문 후기를 남겨주시면 다음 방문 시 특별 혜택을 드립니다.', button: '리뷰 작성' },
  t6: { title: '지금 등록하면 혜택이!', body: '수강 등록 시 첫 달 50% 할인! 이번 기회를 놓치지 마세요.', button: '등록하기' },
  t7: { title: '무료 체험 이벤트!', body: '3일 무료 체험으로 시작해보세요. 부담 없이 경험해보실 수 있어요.', button: '체험 신청' },
  t8: { title: '정기 검진 시기입니다', body: '건강한 반려동물을 위한 정기 검진, 지금 예약하시면 10% 할인!', button: '예약하기' },
};

interface IBannerTemplateCardProps {
  template: IBannerTemplateDto;
  isSelected: boolean;
  onSelect: (template: IBannerTemplateDto) => void;
  isRecommended?: boolean;
}

export function BannerTemplateCard({ template, isSelected, onSelect, isRecommended }: IBannerTemplateCardProps) {
  const IconComponent = ICON_MAP[template.thumbnailIcon] ?? Users;
  const colors = COLOR_MAP[template.thumbnailColor] ?? COLOR_MAP.blue;
  const sample = SAMPLE_MESSAGES[template.id] ?? { title: template.name, body: template.description, button: '자세히 보기' };

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border bg-[#B2C7D9] transition-all',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : isRecommended
            ? 'border-amber-300 hover:border-amber-400'
            : 'border-transparent hover:border-gray-300'
      )}
    >
      {/* 카카오톡 프리뷰 */}
      <div className="px-3 pb-2 pt-3">
        {/* 프로필 */}
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs">🐰</div>
          <span className="text-[10px] text-[#3B4A5A]">(광고) 헤이데어</span>
        </div>

        {/* 메시지 버블 */}
        <div className="ml-7 overflow-hidden rounded-xl rounded-tl-sm bg-white shadow-sm">
          {/* 배너 이미지 */}
          <div className={cn(
            'flex h-24 items-center justify-center bg-gradient-to-br',
            colors.gradientFrom,
            colors.gradientTo
          )}>
            <div className="rounded-lg bg-white/20 p-2">
              <IconComponent size={24} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* 텍스트 */}
          <div className="px-3 py-2.5">
            <p className="mb-0.5 text-[11px] font-bold text-[#333] leading-tight">{sample.title}</p>
            <p className="line-clamp-2 text-[10px] leading-snug text-[#666]">{sample.body}</p>
            <div className="mt-2">
              <div className="rounded-full border border-[#c5cdd5] py-1 text-center text-[10px] font-medium text-[#3B4A5A]">
                {sample.button}
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="border-t border-gray-100 px-3 py-1.5 text-center">
            <span className="text-[9px] text-[#999]">수신거부 | 홈 &gt; 채널 차단</span>
          </div>
        </div>
      </div>

      {/* 템플릿 사용하기 버튼 */}
      <button
        onClick={() => onSelect(template)}
        className={cn(
          'mx-2 mb-2 mt-1 rounded-xl py-2.5 text-xs font-medium transition-colors',
          isSelected
            ? 'bg-primary text-white'
            : 'bg-white text-[#3B4A5A] hover:bg-gray-50'
        )}
      >
        {isSelected ? '선택됨' : '템플릿 사용하기'}
      </button>
    </div>
  );
}
