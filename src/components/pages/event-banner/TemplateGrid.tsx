import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { BannerTemplateCard } from './BannerTemplateCard';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerIndustryType, BannerPurposeType } from '@/models/type';

const INDUSTRIES: Array<BannerIndustryType | '전체'> = [
  '전체', '음식/식당', '뷰티/미용', '패션/의류', '헬스/피트니스', '교육/학원', '의료/병원', '카페/디저트', '펫샵/동물병원',
];

const PURPOSES: Array<BannerPurposeType | '전체'> = [
  '전체', '신규 고객 유입', '재방문 유도', '이벤트 안내', '신상품 홍보', '할인 프로모션', '리뷰 유도', '회원가입 유도',
];

interface ITemplateGridProps {
  templates: IBannerTemplateDto[];
  selectedIndustry: BannerIndustryType | '전체';
  selectedPurpose: BannerPurposeType | '전체';
  selectedTemplate: IBannerTemplateDto | null;
  onIndustryChange: (industry: BannerIndustryType | '전체') => void;
  onPurposeChange: (purpose: BannerPurposeType | '전체') => void;
  onSelectTemplate: (template: IBannerTemplateDto) => void;
}

export function TemplateGrid({
  templates,
  selectedIndustry,
  selectedPurpose,
  selectedTemplate,
  onIndustryChange,
  onPurposeChange,
  onSelectTemplate,
}: ITemplateGridProps) {
  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchIndustry = selectedIndustry === '전체' || t.industry === selectedIndustry;
      const matchPurpose = selectedPurpose === '전체' || t.purpose === selectedPurpose;
      return matchIndustry && matchPurpose;
    });
  }, [templates, selectedIndustry, selectedPurpose]);

  return (
    <div>
      {/* 업종 필터 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            onClick={() => onIndustryChange(ind)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              selectedIndustry === ind
                ? 'border-foreground bg-foreground text-white'
                : 'border-border hover:border-gray-400 hover:bg-muted'
            )}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* 목적 필터 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {PURPOSES.map((p) => (
          <button
            key={p}
            onClick={() => onPurposeChange(p)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              selectedPurpose === p
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-border hover:border-blue-300 hover:bg-blue-50'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 템플릿 그리드 */}
      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          해당 조건의 템플릿이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
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
