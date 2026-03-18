import { cn } from '@/lib/utils';

const GRADE_OPTIONS = ['전체', 'VIP', '골드', '실버', '일반', '신규'];
const GENDER_OPTIONS = ['전체', '남성', '여성'];
const AGE_OPTIONS = ['전체', '10대', '20대', '30대', '40대', '50대+'];

interface IBannerTargetStepProps {
  targetGrade: string;
  targetGender: string;
  targetAgeGroup: string;
  displaySchedule: 'always' | 'scheduled';
  displayStartDate: string;
  displayEndDate: string;
  onTargetGradeChange: (grade: string) => void;
  onTargetGenderChange: (gender: string) => void;
  onTargetAgeGroupChange: (ageGroup: string) => void;
  onDisplayScheduleChange: (schedule: 'always' | 'scheduled') => void;
  onDisplayStartDateChange: (date: string) => void;
  onDisplayEndDateChange: (date: string) => void;
}

export function BannerTargetStep({
  targetGrade,
  targetGender,
  targetAgeGroup,
  displaySchedule,
  displayStartDate,
  displayEndDate,
  onTargetGradeChange,
  onTargetGenderChange,
  onTargetAgeGroupChange,
  onDisplayScheduleChange,
  onDisplayStartDateChange,
  onDisplayEndDateChange,
}: IBannerTargetStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">배너 노출 대상과 기간을 설정하세요</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        어떤 고객에게, 언제 배너를 노출할지 설정합니다
      </p>

      <div className="space-y-4">
        {/* 회원 등급 */}
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-semibold">회원 등급</p>
          <div className="flex flex-wrap gap-2">
            {GRADE_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => onTargetGradeChange(g)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  targetGrade === g
                    ? 'border-primary bg-primary text-white'
                    : 'border-border/60 hover:border-gray-400'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 성별 / 연령 */}
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-semibold">성별 / 연령</p>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">성별</p>
              <div className="flex gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => onTargetGenderChange(g)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                      targetGender === g
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/60 hover:border-gray-400'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">연령대</p>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => onTargetAgeGroupChange(a)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                      targetAgeGroup === a
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/60 hover:border-gray-400'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 노출 기간 */}
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-semibold">노출 기간</p>
          <div className="space-y-3">
            {[
              { id: 'always' as const, label: '상시 노출', sub: '배너를 비활성화할 때까지 계속 노출됩니다' },
              { id: 'scheduled' as const, label: '기간 설정', sub: '지정한 기간 동안만 노출됩니다' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onDisplayScheduleChange(opt.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                  displaySchedule === opt.id
                    ? 'border-primary bg-gray-50'
                    : 'border-border/60 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border-2',
                  displaySchedule === opt.id ? 'border-primary' : 'border-gray-300'
                )}>
                  {displaySchedule === opt.id && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.sub}</p>
                </div>
              </button>
            ))}

            {displaySchedule === 'scheduled' && (
              <div className="ml-7 rounded-xl border border-border/60 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">시작일</label>
                    <input
                      type="date"
                      value={displayStartDate}
                      onChange={(e) => onDisplayStartDateChange(e.target.value)}
                      className="rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <span className="mt-4 text-xs text-muted-foreground">~</span>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">종료일</label>
                    <input
                      type="date"
                      value={displayEndDate}
                      onChange={(e) => onDisplayEndDateChange(e.target.value)}
                      className="rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
