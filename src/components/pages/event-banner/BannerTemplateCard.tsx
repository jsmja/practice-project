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
  Monitor,
  Minus,
  PanelRightOpen,
  Maximize,
  MousePointerClick,
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

const COLOR_MAP: Record<string, { bg: string; icon: string; gradientFrom: string; gradientTo: string }> = {
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', gradientFrom: 'from-orange-100', gradientTo: 'to-amber-50' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-500', gradientFrom: 'from-rose-100', gradientTo: 'to-pink-50' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-500', gradientFrom: 'from-violet-100', gradientTo: 'to-purple-50' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-500', gradientFrom: 'from-amber-100', gradientTo: 'to-yellow-50' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', gradientFrom: 'from-blue-100', gradientTo: 'to-indigo-50' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', gradientFrom: 'from-emerald-100', gradientTo: 'to-green-50' },
  red: { bg: 'bg-red-50', icon: 'text-red-500', gradientFrom: 'from-red-100', gradientTo: 'to-rose-50' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-500', gradientFrom: 'from-teal-100', gradientTo: 'to-cyan-50' },
};

const FORMAT_ICON_MAP: Record<string, LucideIcon> = {
  '센터 팝업': Monitor,
  '띠배너': Minus,
  '슬라이드인': PanelRightOpen,
  '풀스크린': Maximize,
  '이탈 감지': MousePointerClick,
};

interface IBannerTemplateCardProps {
  template: IBannerTemplateDto;
  isSelected: boolean;
  onSelect: (template: IBannerTemplateDto) => void;
}

export function BannerTemplateCard({ template, isSelected, onSelect }: IBannerTemplateCardProps) {
  const IconComponent = ICON_MAP[template.thumbnailIcon] ?? Users;
  const colors = COLOR_MAP[template.thumbnailColor] ?? COLOR_MAP.blue;
  const FormatIcon = FORMAT_ICON_MAP[template.bannerType];

  return (
    <button
      onClick={() => onSelect(template)}
      className={cn(
        'group rounded-2xl border bg-white p-5 text-left transition-all',
        isSelected
          ? 'border-foreground shadow-md ring-1 ring-foreground/10'
          : 'border-border/60 shadow-sm hover:border-gray-300 hover:shadow-md'
      )}
    >
      {/* 썸네일 */}
      <div className={cn(
        'mb-4 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-[1.02]',
        colors.gradientFrom,
        colors.gradientTo,
      )}>
        <div className={cn('rounded-xl p-3', colors.bg)}>
          <IconComponent size={28} className={colors.icon} strokeWidth={1.5} />
        </div>
      </div>

      {/* 카드명 */}
      <h4 className="mb-1.5 text-sm font-semibold text-foreground leading-tight">{template.name}</h4>

      {/* 업종 / 목적 / 배너유형 태그 */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted-foreground">{template.industry}</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">{template.purpose}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
          {FormatIcon && <FormatIcon size={10} />}
          {template.bannerType}
        </span>
      </div>

      {/* 설명 */}
      <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{template.description}</p>

      {/* 사용 횟수 */}
      <div className="flex items-center gap-1">
        <Users size={12} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">사용 {template.usageCount.toLocaleString()}회</span>
      </div>
    </button>
  );
}
