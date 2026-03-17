import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/common/Badge';
import { ChevronRight, Coins, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_SUBSCRIPTIONS, MOCK_SERVICE_PRODUCTS } from '@/mocks/payment';
import { MOCK_POINT_BALANCE } from '@/mocks/points';

const SUBSCRIPTION_TYPE_LABEL: Record<string, string> = {
  연간: '연간 구독',
  월간: '월간 구독',
};

export function SubscriptionPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="구독현황"
        description="현재 이용 중인 서비스와 결제 정보를 확인하고 관리할 수 있습니다"
      />

      {/* 결제 수단 + 포인트 현황 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* 토스페이 등록 카드 */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">T</div>
            <div>
              <p className="text-xs text-muted-foreground">구독 결제 수단 (토스페이)</p>
              <p className="text-sm font-semibold">신한카드 •••• 1234</p>
              <p className="text-xs text-muted-foreground">월정액 자동 결제 등록됨</p>
            </div>
          </div>
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
            변경
          </button>
        </div>

        {/* 포인트 현황 */}
        <div className={cn(
          'flex items-center justify-between rounded-xl border p-5',
          MOCK_POINT_BALANCE <= 10000 ? 'border-red-200 bg-red-50' : MOCK_POINT_BALANCE <= 50000 ? 'border-amber-200 bg-amber-50' : 'border-border bg-white'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', MOCK_POINT_BALANCE <= 50000 ? 'bg-amber-100' : 'bg-muted')}>
              {MOCK_POINT_BALANCE <= 50000
                ? <AlertTriangle size={18} className="text-amber-600" />
                : <Coins size={18} className="text-muted-foreground" />
              }
            </div>
            <div>
              <p className="text-xs text-muted-foreground">메시지 발송 포인트 잔액</p>
              <p className={cn('text-lg font-bold tabular-nums', MOCK_POINT_BALANCE <= 10000 ? 'text-red-600' : MOCK_POINT_BALANCE <= 50000 ? 'text-amber-600' : 'text-foreground')}>
                {MOCK_POINT_BALANCE.toLocaleString()}P
              </p>
              {MOCK_POINT_BALANCE <= 50000 && (
                <p className="text-xs text-amber-600">잔액이 부족합니다. 충전이 필요합니다.</p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/settings/points')}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            충전하기
          </button>
        </div>
      </div>

      {/* 구독 중인 서비스 */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">구독 중인 서비스</h3>
        <div className="space-y-3">
          {MOCK_SUBSCRIPTIONS.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between rounded-xl border border-border bg-white p-5">
              <div className="flex items-center gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{sub.serviceName}</span>
                    <Badge variant="success">{sub.status}</Badge>
                    <Badge variant="info">{SUBSCRIPTION_TYPE_LABEL[sub.subscriptionType]}</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>시작일 {sub.startDate}</span>
                    <span>다음 결제일 {sub.nextPaymentDate}</span>
                    <span className="font-medium text-foreground">
                      {sub.amount.toLocaleString()}원/월 <span className="font-normal text-muted-foreground">(VAT 포함)</span>
                    </span>
                  </div>
                </div>
              </div>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive">
                구독 취소
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 서비스 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">추가 서비스</h3>
          <button
            onClick={() => navigate('/payment/apply')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            전체 보기 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {MOCK_SERVICE_PRODUCTS.filter((p) => p.status === '미사용').map((product) => (
            <div key={product.id} className="rounded-xl border border-border bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold">{product.name}</span>
                <Badge variant="default">{product.status}</Badge>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">{product.description}</p>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground">월간</p>
                <p className="font-bold">{product.monthlyPrice.toLocaleString()}원/월</p>
              </div>
              <button
                onClick={() => navigate('/payment/apply')}
                className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                신청
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
