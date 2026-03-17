import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAMPAIGN_TYPES } from './CampaignTypeStep';

const GRADE_OPTIONS = ['전체', 'VIP', '골드', '실버', '일반', '신규'];
const DEMOGRAPHIC_GENDER = ['전체', '남성', '여성'];
const DEMOGRAPHIC_AGE = ['전체', '10대', '20대', '30대', '40대', '50대+'];

export interface IRecipientFilter {
  grade: string;
  lastVisitDays: string;
  joinDateFrom: string;
  joinDateTo: string;
  purchaseMin: string;
  purchaseCount: string;
  gender: string;
  ageGroup: string;
}

export const INITIAL_RECIPIENT_FILTER: IRecipientFilter = {
  grade: '전체',
  lastVisitDays: '',
  joinDateFrom: '',
  joinDateTo: '',
  purchaseMin: '',
  purchaseCount: '',
  gender: '전체',
  ageGroup: '전체',
};

interface ICampaignRecipientStepProps {
  campaignTypeId: string | null;
  filter: IRecipientFilter;
  onChange: (filter: IRecipientFilter) => void;
}

export function CampaignRecipientStep({ campaignTypeId, filter, onChange }: ICampaignRecipientStepProps) {
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);
  const set = (key: keyof IRecipientFilter, value: string) => onChange({ ...filter, [key]: value });
  const activeFilters = campaignType?.filters ?? [];
  const isBirthday = campaignType?.id === 'birthday';

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">수신 대상을 설정해주세요</h2>
      {campaignType && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', campaignType.iconBg)}>
            {campaignType.icon}
          </div>
          <span className="text-xs font-medium">{campaignType.name}</span>
          <span className="text-xs text-muted-foreground">· {campaignType.subtitle}</span>
        </div>
      )}

      {isBirthday ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-violet-50 py-10">
          <Gift size={32} className="mb-3 text-violet-500" />
          <p className="text-sm font-semibold text-violet-700">생일 고객 자동 대상</p>
          <p className="mt-1 text-xs text-muted-foreground">고객의 생일 정보를 기반으로 자동으로 대상이 설정됩니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeFilters.includes('grade') && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="mb-3 text-xs font-semibold">회원 등급</p>
              <div className="flex flex-wrap gap-2">
                {GRADE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => set('grade', g)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                      filter.grade === g ? 'border-foreground bg-foreground text-white' : 'border-border/60 hover:border-gray-400'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeFilters.includes('lastVisit') && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="mb-3 text-xs font-semibold">최종 접속일</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">최근</span>
                <input
                  type="number"
                  value={filter.lastVisitDays}
                  onChange={(e) => set('lastVisitDays', e.target.value)}
                  placeholder="30"
                  className="w-20 rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary"
                />
                <span className="text-xs text-muted-foreground">일 이상 미접속</span>
              </div>
            </div>
          )}

          {activeFilters.includes('joinDate') && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="mb-3 text-xs font-semibold">가입일 범위</p>
              <div className="flex items-center gap-2">
                <input type="date" value={filter.joinDateFrom} onChange={(e) => set('joinDateFrom', e.target.value)} className="rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
                <span className="text-xs text-muted-foreground">~</span>
                <input type="date" value={filter.joinDateTo} onChange={(e) => set('joinDateTo', e.target.value)} className="rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
              </div>
            </div>
          )}

          {activeFilters.includes('purchase') && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="mb-3 text-xs font-semibold">구매 이력</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">최소 구매 금액 (원)</label>
                  <input type="number" value={filter.purchaseMin} onChange={(e) => set('purchaseMin', e.target.value)} placeholder="0" className="w-full rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">최소 구매 횟수</label>
                  <input type="number" value={filter.purchaseCount} onChange={(e) => set('purchaseCount', e.target.value)} placeholder="1" className="w-full rounded-lg border border-border/60 px-3 py-2 text-xs outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          )}

          {activeFilters.includes('demographic') && (
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="mb-3 text-xs font-semibold">성별 / 연령</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">성별</p>
                  <div className="flex gap-2">
                    {DEMOGRAPHIC_GENDER.map((g) => (
                      <button key={g} onClick={() => set('gender', g)} className={cn('rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors', filter.gender === g ? 'border-foreground bg-foreground text-white' : 'border-border/60 hover:border-gray-400')}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">연령대</p>
                  <div className="flex flex-wrap gap-2">
                    {DEMOGRAPHIC_AGE.map((a) => (
                      <button key={a} onClick={() => set('ageGroup', a)} className={cn('rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors', filter.ageGroup === a ? 'border-foreground bg-foreground text-white' : 'border-border/60 hover:border-gray-400')}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
