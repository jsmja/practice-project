import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { BannerTemplateCard } from './BannerTemplateCard';
import { useCompanyInfoStore } from '@/store/useCompanyInfoStore';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerFormatType, BannerPurposeType } from '@/models/type';

const PURPOSES: Array<BannerPurposeType | '전체'> = [
  '전체', '신규 고객 유입', '재방문 유도', '이벤트 안내', '신상품 홍보', '할인 프로모션', '리뷰 유도', '회원가입 유도',
];

/** 업태/업종 텍스트에서 매칭되는 BannerIndustryType을 찾는 헬퍼 */
function matchIndustry(businessType: string, businessCategory: string): string | null {
  const combined = `${businessType} ${businessCategory}`.toLowerCase();
  const INDUSTRY_KEYWORDS: Record<string, string[]> = {
    '음식/식당': ['음식', '식당', '레스토랑', '요식'],
    '뷰티/미용': ['뷰티', '미용', '헤어', '네일', '피부'],
    '패션/의류': ['패션', '의류', '옷', '잡화', '쇼핑'],
    '헬스/피트니스': ['헬스', '피트니스', '운동', '체육', 'pt', '짐'],
    '교육/학원': ['교육', '학원', '학습', '과외', '강의'],
    '의료/병원': ['의료', '병원', '의원', '클리닉', '치과', '한의원'],
    '카페/디저트': ['카페', '디저트', '베이커리', '빵', '커피'],
    '펫샵/동물병원': ['펫', '동물', '반려', '수의'],
  };

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => combined.includes(kw))) {
      return industry;
    }
  }
  return null;
}

interface ITemplateGridProps {
  templates: IBannerTemplateDto[];
  selectedPurpose: BannerPurposeType | '전체';
  selectedTemplate: IBannerTemplateDto | null;
  bannerFormat: BannerFormatType | null;
  onPurposeChange: (purpose: BannerPurposeType | '전체') => void;
  onSelectTemplate: (template: IBannerTemplateDto) => void;
}

export function TemplateGrid({
  templates,
  selectedPurpose,
  selectedTemplate,
  bannerFormat,
  onPurposeChange,
  onSelectTemplate,
}: ITemplateGridProps) {
  const { businessType, businessCategory } = useCompanyInfoStore();
  const matchedIndustry = useMemo(
    () => matchIndustry(businessType, businessCategory),
    [businessType, businessCategory]
  );

  const { recommended, others } = useMemo(() => {
    const filtered = templates.filter((t) => {
      const matchPurpose = selectedPurpose === '전체' || t.purpose === selectedPurpose;
      const matchBannerType = !bannerFormat || t.bannerType === bannerFormat;
      return matchPurpose && matchBannerType;
    });

    if (!matchedIndustry) {
      return { recommended: [], others: filtered };
    }

    const rec: IBannerTemplateDto[] = [];
    const rest: IBannerTemplateDto[] = [];
    for (const t of filtered) {
      if (t.industry === matchedIndustry) {
        rec.push(t);
      } else {
        rest.push(t);
      }
    }
    return { recommended: rec, others: rest };
  }, [templates, selectedPurpose, bannerFormat, matchedIndustry]);

  const hasRecommended = recommended.length > 0;

  return (
    <div>
      {/* 목적 필터 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PURPOSES.map((p) => (
          <button
            key={p}
            onClick={() => onPurposeChange(p)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              selectedPurpose === p
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 text-muted-foreground hover:border-gray-400 hover:bg-muted'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 추천 템플릿 섹션 */}
      {hasRecommended && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <p className="text-sm font-semibold text-foreground">
              우리 업종 추천 템플릿
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {matchedIndustry}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {recommended.map((template) => (
              <BannerTemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={onSelectTemplate}
                isRecommended
              />
            ))}
          </div>
        </div>
      )}

      {/* 전체 템플릿 */}
      {others.length === 0 && !hasRecommended ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-border/60 text-sm text-muted-foreground">
          해당 조건의 템플릿이 없습니다.
        </div>
      ) : others.length > 0 ? (
        <div>
          {hasRecommended && (
            <p className="mb-3 text-sm font-semibold text-muted-foreground">기타 템플릿</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {others.map((template) => (
              <BannerTemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
