import { cn } from '@/lib/utils';
import { BannerFormatPreview } from './BannerFormatPreview';
import type { IBannerTemplateDto } from '@/models/interface/dto';

interface IBannerPreviewPanelProps {
  bannerName: string;
  selectedBannerFormat: string | null;
  selectedTemplate: IBannerTemplateDto | null;
  generatedPreview: string | null;
  targetGrade: string;
  targetGender: string;
  targetAgeGroup: string;
  displaySchedule: 'always' | 'scheduled';
  displayStartDate: string;
  displayEndDate: string;
  isActive: boolean;
  currentStep: number;
}

export function BannerPreviewPanel({
  bannerName,
  selectedBannerFormat,
  selectedTemplate,
  generatedPreview,
  targetGrade,
  targetGender,
  targetAgeGroup,
  displaySchedule,
  displayStartDate,
  displayEndDate,
  isActive,
  currentStep,
}: IBannerPreviewPanelProps) {
  return (
    <div className="p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">미리보기</p>

      {/* 배너 미리보기 */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        {selectedBannerFormat ? (
          <div className="flex flex-col items-center">
            <BannerFormatPreview format={selectedBannerFormat} />
            <p className="mt-2 text-xs font-medium text-foreground">{selectedBannerFormat}</p>
            <p className="text-xs text-muted-foreground">배너 유형 미리보기</p>
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <div className="mb-2 h-12 w-12 rounded-xl bg-gray-100" />
            <p className="text-xs text-muted-foreground">배너 유형을 선택하면<br />미리보기가 표시됩니다</p>
          </div>
        )}
      </div>

      {/* 생성된 콘텐츠 미리보기 */}
      {generatedPreview && (
        <div className="mt-4 rounded-xl border border-border/60 bg-gradient-to-br from-orange-50 to-amber-50 p-4 text-center shadow-sm">
          <p className="text-sm font-bold text-foreground">{generatedPreview}</p>
          <p className="mt-1 text-xs text-muted-foreground">AI 생성 문구</p>
        </div>
      )}

      {/* 설정 요약 */}
      <div className="mt-4 space-y-3">
        {/* 배너명 */}
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-1 text-xs text-muted-foreground">배너명</p>
          <p className="text-xs font-medium">{bannerName || '(미입력)'}</p>
        </div>

        {/* 선택 템플릿 */}
        {selectedTemplate && (
          <div className="rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-1 text-xs text-muted-foreground">선택 템플릿</p>
            <p className="text-xs font-medium">{selectedTemplate.name}</p>
            <p className="text-xs text-muted-foreground">{selectedTemplate.industry} · {selectedTemplate.purpose}</p>
          </div>
        )}

        {/* 타겟 정보 */}
        {currentStep >= 3 && (
          <div className="rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-1 text-xs text-muted-foreground">노출 대상</p>
            <p className="text-xs font-medium">{targetGrade} · {targetGender} · {targetAgeGroup}</p>
          </div>
        )}

        {/* 노출 기간 */}
        {currentStep >= 3 && (
          <div className="rounded-xl border border-border/60 bg-white p-3">
            <p className="mb-1 text-xs text-muted-foreground">노출 기간</p>
            <p className="text-xs font-medium">
              {displaySchedule === 'always' ? '상시 노출' : `${displayStartDate || '미정'} ~ ${displayEndDate || '미정'}`}
            </p>
          </div>
        )}

        {/* 사용 여부 */}
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-1 text-xs text-muted-foreground">사용 여부</p>
          <div className="flex items-center gap-1.5">
            <div className={cn('h-2 w-2 rounded-full', isActive ? 'bg-green-500' : 'bg-gray-300')} />
            <p className="text-xs font-medium">{isActive ? '활성' : '비활성'}</p>
          </div>
        </div>

        {/* 진행 상태 */}
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-2 text-xs text-muted-foreground">진행 상태</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  s <= currentStep ? 'bg-foreground' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{currentStep}/4 단계 완료</p>
        </div>
      </div>
    </div>
  );
}
