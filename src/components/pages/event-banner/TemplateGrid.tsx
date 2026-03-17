import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Monitor,
  Minus,
  PanelRightOpen,
  Maximize,
  MousePointerClick,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BannerTemplateCard } from './BannerTemplateCard';
import { BannerFormatPreview } from './BannerFormatPreview';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerFormatType, BannerIndustryType, BannerPurposeType } from '@/models/type';

const INDUSTRIES: Array<BannerIndustryType | '전체'> = [
  '전체', '음식/식당', '뷰티/미용', '패션/의류', '헬스/피트니스', '교육/학원', '의료/병원', '카페/디저트', '펫샵/동물병원',
];

const PURPOSES: Array<BannerPurposeType | '전체'> = [
  '전체', '신규 고객 유입', '재방문 유도', '이벤트 안내', '신상품 홍보', '할인 프로모션', '리뷰 유도', '회원가입 유도',
];

const BANNER_FORMATS: Array<BannerFormatType | '전체'> = [
  '전체', '센터 팝업', '띠배너', '슬라이드인', '풀스크린', '이탈 감지',
];

const FORMAT_ICON_MAP: Record<string, LucideIcon> = {
  '전체': LayoutGrid,
  '센터 팝업': Monitor,
  '띠배너': Minus,
  '슬라이드인': PanelRightOpen,
  '풀스크린': Maximize,
  '이탈 감지': MousePointerClick,
};

interface ITemplateGridProps {
  templates: IBannerTemplateDto[];
  selectedIndustry: BannerIndustryType | '전체';
  selectedPurpose: BannerPurposeType | '전체';
  selectedBannerType: BannerFormatType | '전체';
  selectedTemplate: IBannerTemplateDto | null;
  onIndustryChange: (industry: BannerIndustryType | '전체') => void;
  onPurposeChange: (purpose: BannerPurposeType | '전체') => void;
  onBannerTypeChange: (bannerType: BannerFormatType | '전체') => void;
  onSelectTemplate: (template: IBannerTemplateDto) => void;
}

export function TemplateGrid({
  templates,
  selectedIndustry,
  selectedPurpose,
  selectedBannerType,
  selectedTemplate,
  onIndustryChange,
  onPurposeChange,
  onBannerTypeChange,
  onSelectTemplate,
}: ITemplateGridProps) {
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchIndustry = selectedIndustry === '전체' || t.industry === selectedIndustry;
      const matchPurpose = selectedPurpose === '전체' || t.purpose === selectedPurpose;
      const matchBannerType = selectedBannerType === '전체' || t.bannerType === selectedBannerType;
      return matchIndustry && matchPurpose && matchBannerType;
    });
  }, [templates, selectedIndustry, selectedPurpose, selectedBannerType]);

  return (
    <div>
      {/* 배너 유형 아이콘 탭 */}
      <div className="mb-5 flex gap-2">
        {BANNER_FORMATS.map((fmt) => {
          const FmtIcon = FORMAT_ICON_MAP[fmt];
          const isSelected = selectedBannerType === fmt;
          const isHovered = hoveredFormat === fmt;
          return (
            <div key={fmt} className="relative flex-1">
              <button
                onClick={() => onBannerTypeChange(fmt)}
                onMouseEnter={() => fmt !== '전체' && setHoveredFormat(fmt)}
                onMouseLeave={() => setHoveredFormat(null)}
                className={cn(
                  'flex w-full flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all',
                  isSelected
                    ? 'border-foreground bg-foreground text-white shadow-sm'
                    : 'border-border/60 bg-white text-muted-foreground hover:border-gray-300 hover:bg-muted/50'
                )}
              >
                {FmtIcon && <FmtIcon size={18} strokeWidth={isSelected ? 2 : 1.5} />}
                {fmt}
              </button>
              {/* 호버 시 모션 미리보기 */}
              {isHovered && fmt !== '전체' && (
                <div
                  className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2"
                  onMouseEnter={() => setHoveredFormat(fmt)}
                  onMouseLeave={() => setHoveredFormat(null)}
                >
                  <div className="rounded-xl border border-border/60 bg-white p-2 shadow-lg">
                    <BannerFormatPreview format={fmt} />
                    <p className="mt-1.5 text-center text-xs text-muted-foreground">{fmt} 미리보기</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 업종 필터 */}
      <div className="mb-3 flex flex-wrap gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            onClick={() => onIndustryChange(ind)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              selectedIndustry === ind
                ? 'border-foreground bg-foreground text-white'
                : 'border-border/60 text-muted-foreground hover:border-gray-400 hover:bg-muted'
            )}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* 목적 필터 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PURPOSES.map((p) => (
          <button
            key={p}
            onClick={() => onPurposeChange(p)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              selectedPurpose === p
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-border/60 text-muted-foreground hover:border-blue-300 hover:bg-blue-50'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 템플릿 그리드 */}
      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border/60 text-sm text-muted-foreground">
          해당 조건의 템플릿이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((template) => (
            <BannerTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
