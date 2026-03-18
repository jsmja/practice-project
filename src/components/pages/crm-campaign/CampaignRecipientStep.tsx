import { Gift, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CAMPAIGN_TYPES } from './CampaignTypeStep';

const GRADE_OPTIONS = ['전체', 'VIP', '골드', '실버', '일반', '신규'];

export interface IRecipientFilter {
  grade: string;
  // 가입일
  joinDateEnabled: boolean;
  joinDateFrom: string;
  joinDateTo: string;
  joinDateAll: boolean;
  // 마지막 로그인(일)
  lastVisitEnabled: boolean;
  lastVisitFrom: string;
  lastVisitTo: string;
  lastVisitAll: boolean;
  // 구매여부
  purchaseStatus: 'has' | 'none' | 'all';
  // 구매 이력 (장기 미구매용)
  purchaseHistoryEnabled: boolean;
  purchaseHistoryFrom: string;
  purchaseHistoryTo: string;
  purchaseHistoryAll: boolean;
  // 장바구니 상품 보유
  cartOwnership: 'has' | 'none' | 'all';
  // 장바구니 담은기간(일)
  cartPeriodFrom: string;
  cartPeriodTo: string;
  // 휴면회원 전환 기간
  dormantDateFrom: string;
  dormantDateTo: string;
}

export const INITIAL_RECIPIENT_FILTER: IRecipientFilter = {
  grade: '전체',
  joinDateEnabled: false,
  joinDateFrom: '',
  joinDateTo: '',
  joinDateAll: true,
  lastVisitEnabled: false,
  lastVisitFrom: '',
  lastVisitTo: '365',
  lastVisitAll: true,
  purchaseStatus: 'all',
  purchaseHistoryEnabled: false,
  purchaseHistoryFrom: '',
  purchaseHistoryTo: '',
  purchaseHistoryAll: true,
  cartOwnership: 'all',
  cartPeriodFrom: '',
  cartPeriodTo: '',
  dormantDateFrom: '',
  dormantDateTo: '',
};

interface ICampaignRecipientStepProps {
  campaignTypeId: string | null;
  filter: IRecipientFilter;
  onChange: (filter: IRecipientFilter) => void;
}

export function CampaignRecipientStep({ campaignTypeId, filter, onChange }: ICampaignRecipientStepProps) {
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);
  const activeFilters = campaignType?.filters ?? [];
  const isBirthday = campaignTypeId === 'birthday';
  const isAllFriends = campaignTypeId === 'all-friends';

  const set = <K extends keyof IRecipientFilter>(key: K, value: IRecipientFilter[K]) =>
    onChange({ ...filter, [key]: value });

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">오디언스 설정</h2>
      <p className="mb-5 text-xs text-muted-foreground">마케팅 대상 오디언스를 설정해 주세요.</p>

      {/* 전체 친구 대상 */}
      {isAllFriends && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <p className="text-sm text-blue-700">· 카카오 채널 내 모든 친구에게 발송됩니다.</p>
          </div>
        </div>
      )}

      {/* 생일 */}
      {isBirthday && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-violet-50 py-10">
          <Gift size={32} className="mb-3 text-violet-500" />
          <p className="text-sm font-semibold text-violet-700">생일 고객 자동 대상</p>
          <p className="mt-1 text-xs text-muted-foreground">고객의 생일 정보를 기반으로 자동으로 대상이 설정됩니다</p>
        </div>
      )}

      {/* 일반 필터 폼 */}
      {!isBirthday && !isAllFriends && (
        <div className="rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border/60">
              {/* 회원등급 */}
              {activeFilters.includes('grade') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">회원등급</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={filter.grade}
                      onChange={(e) => set('grade', e.target.value)}
                      className="rounded-lg border border-border/60 px-3 py-1.5 text-sm outline-none focus:border-primary"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              )}

              {/* 휴면회원 전환 기간 (웰컴백 전용) */}
              {activeFilters.includes('dormantPeriod') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">휴면회원 전환 기간</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <input type="date" value={filter.dormantDateFrom} onChange={(e) => set('dormantDateFrom', e.target.value)} className="rounded-lg border border-border/60 px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      <span className="text-xs text-muted-foreground">~</span>
                      <input type="date" value={filter.dormantDateTo} onChange={(e) => set('dormantDateTo', e.target.value)} className="rounded-lg border border-border/60 px-3 py-1.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </td>
                </tr>
              )}

              {/* 가입일 */}
              {activeFilters.includes('joinDate') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">가입일</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <RadioDot checked={!filter.joinDateAll} onClick={() => set('joinDateAll', false)} />
                      <input type="number" value={filter.joinDateFrom} onChange={(e) => set('joinDateFrom', e.target.value)} placeholder="" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.joinDateAll} />
                      <span className="text-xs text-muted-foreground">~</span>
                      <input type="number" value={filter.joinDateTo} onChange={(e) => set('joinDateTo', e.target.value)} placeholder="" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.joinDateAll} />
                      <span className="text-xs text-muted-foreground">일이 지난</span>
                      <RadioDot checked={filter.joinDateAll} onClick={() => set('joinDateAll', true)} />
                      <span className="text-xs text-muted-foreground">전체</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* 마지막 로그인(일) */}
              {activeFilters.includes('lastVisit') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">마지막 로그인(일)</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <RadioDot checked={!filter.lastVisitAll} onClick={() => set('lastVisitAll', false)} />
                      <input type="number" value={filter.lastVisitFrom} onChange={(e) => set('lastVisitFrom', e.target.value)} placeholder="" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.lastVisitAll} />
                      <span className="text-xs text-muted-foreground">~</span>
                      <input type="number" value={filter.lastVisitTo} onChange={(e) => set('lastVisitTo', e.target.value)} placeholder="365" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.lastVisitAll} />
                      <span className="text-xs text-muted-foreground">일이 된</span>
                      <RadioDot checked={filter.lastVisitAll} onClick={() => set('lastVisitAll', true)} />
                      <span className="text-xs text-muted-foreground">전체</span>
                      {!filter.lastVisitAll && (
                        <span className="text-xs italic text-muted-foreground">*선택하신 캠페인 유형의 기본 셋팅 값입니다.</span>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* 장바구니 상품 보유 */}
              {activeFilters.includes('cartOwnership') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">장바구니 상품 보유</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {[
                        { value: 'has' as const, label: '보유' },
                        { value: 'none' as const, label: '미보유' },
                        { value: 'all' as const, label: '전체' },
                      ].map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-1.5">
                          <RadioDot checked={filter.cartOwnership === opt.value} onClick={() => set('cartOwnership', opt.value)} />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                      {filter.cartOwnership !== 'all' && (
                        <span className="text-xs italic text-muted-foreground">*선택하신 캠페인 유형의 기본 셋팅 값입니다.</span>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* 장바구니 담은기간(일) */}
              {activeFilters.includes('cartPeriod') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">장바구니 담은기간(일)</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <input type="number" value={filter.cartPeriodFrom} onChange={(e) => set('cartPeriodFrom', e.target.value)} placeholder="1" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" />
                      <span className="text-xs text-muted-foreground">~</span>
                      <input type="number" value={filter.cartPeriodTo} onChange={(e) => set('cartPeriodTo', e.target.value)} placeholder="3" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" />
                      <span className="text-xs text-muted-foreground">일</span>
                      <span className="text-xs italic text-muted-foreground">*선택하신 캠페인 유형의 기본 셋팅 값입니다.</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* 구매여부 */}
              {activeFilters.includes('purchaseStatus') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">구매여부</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {[
                        { value: 'has' as const, label: '구매이력 있음' },
                        { value: 'none' as const, label: '구매이력 없음' },
                        { value: 'all' as const, label: '전체' },
                      ].map((opt) => (
                        <label key={opt.value} className="flex cursor-pointer items-center gap-1.5">
                          <RadioDot checked={filter.purchaseStatus === opt.value} onClick={() => set('purchaseStatus', opt.value)} />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                      {filter.purchaseStatus !== 'all' && (
                        <span className="text-xs italic text-muted-foreground">*선택하신 캠페인 유형의 기본 셋팅 값입니다.</span>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* 구매 이력 (장기 미구매용) */}
              {activeFilters.includes('purchaseHistory') && (
                <tr>
                  <td className="w-40 bg-gray-50/70 px-5 py-3.5 text-xs font-medium text-muted-foreground">구매 이력</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <RadioDot checked={!filter.purchaseHistoryAll} onClick={() => set('purchaseHistoryAll', false)} />
                      <span className="text-xs text-muted-foreground">마지막 구매 이후</span>
                      <input type="number" value={filter.purchaseHistoryFrom} onChange={(e) => set('purchaseHistoryFrom', e.target.value)} placeholder="60" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.purchaseHistoryAll} />
                      <span className="text-xs text-muted-foreground">~</span>
                      <input type="number" value={filter.purchaseHistoryTo} onChange={(e) => set('purchaseHistoryTo', e.target.value)} placeholder="70" className="w-16 rounded-lg border border-border/60 px-2 py-1.5 text-sm outline-none focus:border-primary" disabled={filter.purchaseHistoryAll} />
                      <span className="text-xs text-muted-foreground">일째 구매하지 않은</span>
                      <RadioDot checked={filter.purchaseHistoryAll} onClick={() => set('purchaseHistoryAll', true)} />
                      <span className="text-xs text-muted-foreground">전체</span>
                    </div>
                    {!filter.purchaseHistoryAll && (
                      <p className="mt-1.5 text-xs italic text-muted-foreground">*선택하신 캠페인 유형의 기본 셋팅 값입니다.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 추천 오디언스 가이드 */}
      {!isBirthday && !isAllFriends && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="mb-2 text-xs font-semibold text-primary">💡 추천 오디언스 설정</p>
          <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            {campaignTypeId === 'welcome-back' && (
              <>
                <p>· 휴면회원 전환 기간을 <span className="font-medium text-foreground">최근 90~180일</span>로 설정하면 이탈 직전의 고객을 효과적으로 타겟팅할 수 있어요.</p>
                <p>· VIP/골드 등급 고객의 이탈은 매출 영향이 크므로 등급별 차별화된 혜택을 제공해보세요.</p>
              </>
            )}
            {campaignTypeId === 'new-member' && (
              <>
                <p>· 가입 후 <span className="font-medium text-foreground">1~27일</span> 이내 고객을 타겟팅하면 첫 구매 전환율이 높아져요.</p>
                <p>· 구매이력 없음으로 설정하면 아직 첫 구매를 하지 않은 신규 고객만 정확히 타겟팅할 수 있어요.</p>
              </>
            )}
            {campaignTypeId === 'cart-reminder' && (
              <>
                <p>· 장바구니 담은 지 <span className="font-medium text-foreground">1~3일</span> 된 고객이 구매 전환율이 가장 높아요.</p>
                <p>· 4일 이상 경과 시에는 할인 쿠폰과 함께 발송하면 효과적이에요.</p>
              </>
            )}
            {campaignTypeId === 'long-no-purchase' && (
              <>
                <p>· 마지막 구매 후 <span className="font-medium text-foreground">60~70일</span>이 경과한 고객이 재구매 유도에 가장 적합해요.</p>
                <p>· 구매이력이 있는 고객 대상으로 설정하면 더 높은 전환율을 기대할 수 있어요.</p>
              </>
            )}
            {campaignTypeId === 'long-inactive' && (
              <>
                <p>· 마지막 로그인 <span className="font-medium text-foreground">300~365일</span> 이상 경과한 고객에게 적립금 소멸 안내와 함께 발송하면 효과적이에요.</p>
                <p>· 이탈 방지를 위해 복귀 시 혜택을 강조하는 메시지를 작성해보세요.</p>
              </>
            )}
            {(campaignTypeId === 'custom' || campaignTypeId === 'seasonal') && (
              <>
                <p>· 전체 등급 대상이라면 가입일과 마지막 로그인을 <span className="font-medium text-foreground">'전체'</span>로 두어 폭넓게 발송할 수 있어요.</p>
                <p>· 특정 구매 이력이 있는 고객만 타겟팅하면 더 높은 관심도를 기대할 수 있어요.</p>
              </>
            )}
            {!['welcome-back', 'new-member', 'cart-reminder', 'long-no-purchase', 'long-inactive', 'custom', 'seasonal'].includes(campaignTypeId ?? '') && (
              <p>· 캠페인 유형에 맞게 필터를 설정하면 더 효과적인 타겟팅이 가능해요.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** 라디오 점 UI */
function RadioDot({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2',
        checked ? 'border-primary' : 'border-gray-300'
      )}
    >
      {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
    </button>
  );
}
