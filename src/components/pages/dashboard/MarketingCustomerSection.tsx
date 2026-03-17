import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_MARKETING_CONSENT } from '@/mocks/dashboard';
import { Users, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MarketingCustomerSection() {
  const navigate = useNavigate();
  const consent = MOCK_MARKETING_CONSENT;
  const consentRate = ((consent.consentCount / consent.totalCustomers) * 100).toFixed(1);

  return (
    <SectionCard title="마케팅 고객 현황">
      {/* 동의 / 미동의 카드 */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        {/* 수신 동의 고객 */}
        <div className="rounded-xl border border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
              <Users size={18} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">수신 동의 고객</p>
              <p className="text-2xl font-bold text-foreground">
                {consent.consentCount.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-muted-foreground">명</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
            <span>↑ 전주 대비 +{consent.consentChange}%</span>
          </div>
        </div>

        {/* 수신 미동의 고객 (잠재 고객) */}
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/30 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                수신 미동의
                <span className="ml-1 font-medium text-amber-600">잠재 고객</span>
              </p>
              <p className="text-2xl font-bold text-foreground">
                {consent.nonConsentCount.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-muted-foreground">명</span>
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            전체 고객 {consent.totalCustomers.toLocaleString()}명 중{' '}
            <span className="font-medium text-amber-600">
              {(100 - Number(consentRate)).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 수신 동의율 바 */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">수신 동의율</span>
          <span className="font-semibold text-foreground">{consentRate}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all"
            style={{ width: `${consentRate}%` }}
          />
        </div>
      </div>

      {/* 잠재 고객 전환 유도 CTA */}
      <div
        className={cn(
          'flex items-center justify-between rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4',
        )}
      >
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-indigo-500" />
          <div>
            <p className="text-sm font-medium text-foreground">
              수신 미동의 고객 {consent.nonConsentCount.toLocaleString()}명을 전환하세요
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              마케팅 수신 동의 팝업을 활용하면 잠재 고객을 캠페인 대상으로 전환할 수 있습니다.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/marketing/consent')}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          수신 동의 팝업 설정 <ArrowRight size={14} />
        </button>
      </div>
    </SectionCard>
  );
}
