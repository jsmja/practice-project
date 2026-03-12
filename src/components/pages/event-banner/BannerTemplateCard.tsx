import { cn } from '@/lib/utils';
import type { IBannerTemplateDto } from '@/models/interface/dto';

interface IBannerTemplateCardProps {
  template: IBannerTemplateDto;
  isSelected: boolean;
  onSelect: (template: IBannerTemplateDto) => void;
}

export function BannerTemplateCard({ template, isSelected, onSelect }: IBannerTemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className={cn(
        'rounded-xl border-2 bg-white p-4 text-left transition-all hover:shadow-sm',
        isSelected ? 'border-foreground shadow-sm' : 'border-border hover:border-gray-300'
      )}
    >
      <div className={cn('mb-3 flex h-20 items-center justify-center rounded-lg text-3xl', template.thumbnailColor)}>
        {template.thumbnailIcon}
      </div>
      <div className="mb-1 flex items-center justify-between gap-1">
        <span className="text-sm font-semibold leading-tight">{template.name}</span>
      </div>
      <div className="mb-1.5 flex flex-wrap gap-1">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-muted-foreground">{template.industry}</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600">{template.purpose}</span>
      </div>
      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
      <p className="text-[10px] text-muted-foreground">사용 {template.usageCount.toLocaleString()}회</p>
    </button>
  );
}
