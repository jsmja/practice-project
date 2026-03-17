import { TemplateGrid } from '../TemplateGrid';
import type { IBannerTemplateDto } from '@/models/interface/dto';
import type { BannerFormatType, BannerIndustryType, BannerPurposeType } from '@/models/type';

interface IBannerContentStepProps {
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

export function BannerContentStep({
  templates,
  selectedIndustry,
  selectedPurpose,
  selectedBannerType,
  selectedTemplate,
  onIndustryChange,
  onPurposeChange,
  onBannerTypeChange,
  onSelectTemplate,
}: IBannerContentStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">템플릿을 선택하고 콘텐츠를 생성하세요</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        업종과 목적에 맞는 템플릿을 선택하면 AI가 최적화된 배너를 제안합니다
      </p>

      <TemplateGrid
        templates={templates}
        selectedIndustry={selectedIndustry}
        selectedPurpose={selectedPurpose}
        selectedBannerType={selectedBannerType}
        selectedTemplate={selectedTemplate}
        onIndustryChange={onIndustryChange}
        onPurposeChange={onPurposeChange}
        onBannerTypeChange={onBannerTypeChange}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
}
