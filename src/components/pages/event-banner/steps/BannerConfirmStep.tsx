import type { IBannerTemplateDto } from '@/models/interface/dto';

interface IBannerConfirmStepProps {
  bannerName: string;
  selectedBannerType: string | null;
  selectedTemplate: IBannerTemplateDto | null;
  generatedPreview: string | null;
  targetGrade: string;
  targetGender: string;
  targetAgeGroup: string;
  displaySchedule: 'always' | 'scheduled';
  displayStartDate: string;
  displayEndDate: string;
  isActive: boolean;
}

export function BannerConfirmStep({
  bannerName,
  selectedBannerType,
  selectedTemplate,
  generatedPreview,
  targetGrade,
  targetGender,
  targetAgeGroup,
  displaySchedule,
  displayStartDate,
  displayEndDate,
  isActive,
}: IBannerConfirmStepProps) {
  const summaryItems = [
    { label: '배너명', value: bannerName || '-' },
    { label: '배너 유형', value: selectedBannerType || '-' },
    { label: '템플릿', value: selectedTemplate?.name || '-' },
    { label: '업종', value: selectedTemplate?.industry || '-' },
    { label: '목적', value: selectedTemplate?.purpose || '-' },
    { label: '대상 등급', value: targetGrade },
    { label: '대상 성별', value: targetGender },
    { label: '대상 연령', value: targetAgeGroup },
    { label: '노출 기간', value: displaySchedule === 'always' ? '상시 노출' : `${displayStartDate} ~ ${displayEndDate}` },
    { label: '사용 여부', value: isActive ? '활성' : '비활성' },
  ];

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">저장 전 최종 확인</h2>
      <p className="mb-5 text-xs text-muted-foreground">아래 내용을 확인하고 저장하세요</p>

      <div className="space-y-4">
        {/* 요약 카드 */}
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">배너 정보</p>
          <div className="space-y-2.5">
            {summaryItems.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-24 text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 생성된 콘텐츠 미리보기 */}
        {generatedPreview && (
          <div className="rounded-xl border border-border/60 bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">생성된 콘텐츠</p>
            <div className="rounded-lg border border-border/60 bg-gradient-to-br from-orange-50 to-amber-50 p-5 text-center">
              <p className="text-base font-bold text-foreground">{generatedPreview}</p>
              <p className="mt-1 text-xs text-muted-foreground">실제 배너 적용 시 디자인이 자동 최적화됩니다</p>
            </div>
          </div>
        )}

        {/* 체크리스트 */}
        <div className="rounded-xl border border-border/60 bg-gray-50 p-4 text-xs text-muted-foreground">
          <p className="mb-1.5 font-medium text-foreground">저장 전 체크리스트</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>배너 문구에 오탈자가 없는지 확인하세요</li>
            <li>노출 대상과 기간이 올바른지 확인하세요</li>
            <li>사용 여부가 &ldquo;활성&rdquo;이면 저장 즉시 노출됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
