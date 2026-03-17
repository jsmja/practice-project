import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_SERVICE_PRODUCTS } from '@/mocks/payment';

const STEPS = ['서비스 선택', '토스페이 카드 등록'];

const POLICIES = [
  '구독 서비스는 선택한 구독 기간(월간/연간) 단위로 자동 갱신됩니다.',
  '구독 취소는 현재 구독 기간 만료 전까지 가능하며, 취소 후 잔여 기간 동안 서비스를 계속 이용할 수 있습니다.',
  '연간 구독의 경우 구독 시작일로부터 7일 이내 취소 시 전액 환불됩니다.',
  '환불은 결제한 카드로 영업일 기준 3~5일 이내 처리됩니다.',
];

export function ServiceApplyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subscriptionType, setSubscriptionType] = useState<'월간' | '연간'>('월간');
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  const toggleService = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedProducts = MOCK_SERVICE_PRODUCTS.filter((p) => selectedIds.has(p.id));
  const totalAmount = selectedProducts.reduce((sum, p) => {
    return sum + (subscriptionType === '연간' ? Math.floor(p.annualPrice / 12) : p.monthlyPrice);
  }, 0);

  const canProceed = selectedIds.size > 0 && agreedPolicy;

  return (
    <div>
      <PageHeader title="서비스 신청" description="원하시는 서비스 상품을 선택하고 결제를 진행해주세요" />

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  idx <= currentStep ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {idx < currentStep ? <Check size={12} /> : idx + 1}
              </div>
              <span className={cn('text-sm', idx <= currentStep ? 'font-semibold' : 'text-muted-foreground')}>
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && <div className="mx-4 h-px w-12 bg-border" />}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <>
          {/* 구독 기간 선택 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold">구독 기간</h3>
            <div className="flex gap-2">
              {(['월간', '연간'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSubscriptionType(type)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors',
                    subscriptionType === type ? 'border-foreground bg-foreground text-white' : 'border-border hover:bg-muted'
                  )}
                >
                  {type} (자동갱신)
                  {type === '연간' && <Badge variant="success">10% 할인</Badge>}
                </button>
              ))}
            </div>
          </div>

          {/* 서비스 선택 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold">서비스 선택</h3>
            <div className="grid grid-cols-3 gap-4">
              {MOCK_SERVICE_PRODUCTS.map((product) => {
                const isSelected = selectedIds.has(product.id);
                const price = subscriptionType === '연간' ? Math.floor(product.annualPrice / 12) : product.monthlyPrice;

                return (
                  <button
                    key={product.id}
                    onClick={() => toggleService(product.id)}
                    className={cn(
                      'rounded-xl border-2 bg-white p-5 text-left transition-colors',
                      isSelected ? 'border-foreground' : 'border-border hover:border-gray-400'
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{product.name}</span>
                      <div className={cn('flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                        isSelected ? 'border-foreground bg-foreground' : 'border-border'
                      )}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                    </div>
                    <Badge variant={product.status === '이용중' ? 'success' : product.status === '무료 체험 중' ? 'warning' : 'default'} >
                      {product.status}
                    </Badge>
                    {product.trialEndDate && (
                      <p className="mt-1 text-xs text-muted-foreground">무료 기간 종료일 {product.trialEndDate}</p>
                    )}
                    <div className="mt-3">
                      <p className="text-xl font-bold">{price.toLocaleString()}원<span className="text-sm font-normal text-muted-foreground">/월</span></p>
                      {subscriptionType === '연간' && (
                        <p className="text-xs text-muted-foreground">연 {product.annualPrice.toLocaleString()}원 ({product.discountRate}% 할인)</p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{product.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 결제 수단 안내 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold">결제 방식</h3>
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">T</div>
                <div>
                  <p className="text-sm font-semibold">토스페이 카드 등록</p>
                  <p className="text-xs text-muted-foreground">카드를 등록하면 매월 선택한 요금이 자동 결제됩니다</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-xs text-muted-foreground">
                <p>· 등록된 카드는 구독 서비스 월정액 자동 결제에만 사용됩니다</p>
                <p>· 메시지 발송 포인트 충전은 별도로 진행됩니다 (설정 &gt; 포인트 관리)</p>
                <p>· 언제든지 마이페이지에서 카드 정보를 변경하거나 구독을 취소할 수 있습니다</p>
              </div>
            </div>
          </div>

          {/* 취소 정책 */}
          <div className="mb-6 rounded-xl border border-border bg-gray-50 p-5">
            <h3 className="mb-3 text-sm font-semibold">구독 취소 정책</h3>
            <ul className="mb-4 space-y-2">
              {POLICIES.map((policy, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="shrink-0">{idx + 1}.</span>
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm font-medium">위 취소 정책에 동의합니다 (필수)</span>
            </label>
          </div>

          {/* 합계 + 다음 버튼 */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-white p-5">
            <div>
              <p className="text-xs text-muted-foreground">선택 {selectedIds.size}개 서비스 · {subscriptionType} 구독</p>
              <p className="text-lg font-bold">{totalAmount.toLocaleString()}원<span className="text-sm font-normal text-muted-foreground">/월 (VAT 포함)</span></p>
            </div>
            <button
              onClick={() => canProceed && setCurrentStep(1)}
              disabled={!canProceed}
              className={cn(
                'rounded-lg px-6 py-2.5 text-sm font-medium transition-colors',
                canProceed ? 'bg-foreground text-white hover:bg-gray-800' : 'cursor-not-allowed bg-muted text-muted-foreground'
              )}
            >
              다음
            </button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <div className="rounded-xl border border-border bg-white p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-xl font-bold text-white">T</div>
            <p className="mb-1 font-semibold">토스페이 카드 등록</p>
            <p className="text-sm text-muted-foreground">카드를 등록하면 구독 서비스가 매월 자동 결제됩니다</p>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-gray-50 p-5">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">구독 정보 확인</p>
            <div className="space-y-2 text-sm">
              {selectedProducts.map((p) => (
                <div key={p.id} className="flex justify-between">
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="font-medium">
                    {(subscriptionType === '연간' ? Math.floor(p.annualPrice / 12) : p.monthlyPrice).toLocaleString()}원/월
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2">
                <span className="font-semibold">합계</span>
                <span className="font-bold">{totalAmount.toLocaleString()}원/월 (VAT 포함)</span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            실제 서비스에서는 여기에 토스페이 카드 등록 창이 표시됩니다. 카드 등록 완료 후 다음 결제일부터 자동 결제가 시작됩니다.
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={() => setCurrentStep(0)} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted">이전</button>
            <button onClick={() => navigate('/payment/subscription')} className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800">카드 등록 완료 (테스트)</button>
          </div>
        </div>
      )}
    </div>
  );
}
