import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';
import { Coins, Plus, RefreshCw, X, ChevronDown, AlertTriangle, AlertCircle, CreditCard, Check } from 'lucide-react';
import { usePointHistory } from '@/hooks/client/points/usePointsClient';
import type { IPointHistoryDto } from '@/models/interface/dto';
import { MOCK_POINT_BALANCE } from '@/mocks/points';
import { NOOP_PAGINATION } from '@/lib/constants';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const CHARGE_OPTIONS = [10000, 30000, 50000, 100000, 300000];

const UNIT_PRICE = 25;

const BANKS = ['KB국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크', '기타'];

const TYPE_VARIANT: Record<string, 'success' | 'info' | 'destructive' | 'warning'> = {
  충전: 'success',
  차감: 'destructive',
  환불: 'info',
  만료: 'warning',
};

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'date', header: '일시', width: '160px', sortable: true },
  {
    key: 'type',
    header: '구분',
    width: '80px',
    render: (row: IPointHistoryDto) => (
      <Badge variant={TYPE_VARIANT[row.type] ?? 'default'}>{row.type}</Badge>
    ),
  },
  { key: 'description', header: '상세' },
  {
    key: 'amount',
    header: '금액',
    width: '110px',
    sortable: true,
    render: (row: IPointHistoryDto) => (
      <span className={cn('font-medium tabular-nums', row.amount > 0 ? 'text-green-600' : 'text-red-500')}>
        {row.amount > 0 ? '+' : ''}{row.amount.toLocaleString()}P
      </span>
    ),
  },
  {
    key: 'balance',
    header: '잔액',
    width: '110px',
    render: (row: IPointHistoryDto) => (
      <span className="font-medium tabular-nums">{row.balance.toLocaleString()}P</span>
    ),
  },
];

const PERIOD_TABS = ['최근 1개월', '최근 3개월', '최근 6개월', '전체'];
const TYPE_TABS = ['전체', '충전', '차감', '환불', '만료'];

// ─── 충전 모달 ─────────────────────────────────────────────────────────────────

function ChargeModal({ onClose }: { onClose: () => void }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'complete'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'existing' | 'new'>('existing');

  const finalAmount = isCustom ? Number(customAmount.replace(/,/g, '')) : (selectedAmount ?? 0);
  const isValid = finalAmount >= 10000 && finalAmount % 10000 === 0;

  const handleCustomInput = (v: string) => {
    const num = v.replace(/[^0-9]/g, '');
    setCustomAmount(num ? Number(num).toLocaleString() : '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">
            {step === 'complete' ? '충전 완료' : '포인트 충전'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              <p className="mb-4 text-xs text-muted-foreground">
                충전한 포인트는 <span className="font-medium text-foreground">1P = 1원</span>으로 메시지 발송에 사용됩니다.
                유효기간은 충전일로부터 <span className="font-medium text-foreground">1년</span>입니다.
              </p>

              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold">충전 금액 선택</p>
                <div className="grid grid-cols-3 gap-2">
                  {CHARGE_OPTIONS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                      className={cn(
                        'rounded-lg border-2 py-2.5 text-sm font-medium transition-colors',
                        !isCustom && selectedAmount === amt ? 'border-primary bg-primary text-white' : 'border-border hover:border-gray-400'
                      )}
                    >
                      {(amt / 10000).toLocaleString()}만원
                    </button>
                  ))}
                  <button
                    onClick={() => { setIsCustom(true); setSelectedAmount(null); }}
                    className={cn(
                      'rounded-lg border-2 py-2.5 text-sm font-medium transition-colors',
                      isCustom ? 'border-primary bg-primary text-white' : 'border-border hover:border-gray-400'
                    )}
                  >
                    직접 입력
                  </button>
                </div>
              </div>

              {isCustom && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2.5">
                    <input
                      type="text"
                      value={customAmount}
                      onChange={(e) => handleCustomInput(e.target.value)}
                      placeholder="금액 입력 (10,000원 단위)"
                      className="flex-1 bg-transparent text-sm outline-none"
                      autoFocus
                    />
                    <span className="text-sm text-muted-foreground">원</span>
                  </div>
                  {customAmount && !isValid && (
                    <p className="mt-1 text-xs text-red-500">최소 10,000원 이상, 10,000원 단위로 입력해주세요</p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold">결제 수단</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('existing')}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all',
                      paymentMethod === 'existing' ? 'border-primary' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <CreditCard size={16} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">신한카드 ····1234</p>
                      <p className="text-xs text-muted-foreground">등록 카드로 즉시 결제</p>
                    </div>
                    {paymentMethod === 'existing' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setPaymentMethod('new')}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-3.5 text-left transition-all',
                      paymentMethod === 'new' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <Plus size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">신규 카드로 결제</p>
                      <p className="text-xs text-muted-foreground">새 카드를 등록하고 결제합니다</p>
                    </div>
                  </button>
                </div>
              </div>

              {finalAmount > 0 && isValid && (
                <div className="mb-4 space-y-2 rounded-xl border border-border bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">충전 금액</span>
                    <span className="text-sm font-medium">{finalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">수수료 (10%)</span>
                    <span className="text-sm font-medium">{Math.round(finalAmount * 0.1).toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">총 결제 금액</span>
                      <span className="text-lg font-bold text-primary">{(finalAmount + Math.round(finalAmount * 0.1)).toLocaleString()}원</span>
                    </div>
                    <p className="mt-0.5 text-right text-xs text-muted-foreground">충전 포인트: {finalAmount.toLocaleString()}P</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('confirm')}
                disabled={!isValid}
                className={cn(
                  'w-full rounded-xl py-3 text-sm font-semibold transition-colors',
                  isValid ? 'bg-primary text-white hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground'
                )}
              >
                충전하기
              </button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="mb-6 rounded-xl border border-border bg-gray-50 p-5">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">결제 정보 확인</p>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: '충전 포인트', value: `${finalAmount.toLocaleString()}P` },
                    { label: '충전 금액', value: `${finalAmount.toLocaleString()}원` },
                    { label: '수수료 (10%)', value: `${Math.round(finalAmount * 0.1).toLocaleString()}원` },
                    { label: '총 결제 금액', value: `${(finalAmount + Math.round(finalAmount * 0.1)).toLocaleString()}원`, bold: true },
                    { label: '결제 수단', value: '토스페이 · 신한카드 1234' },
                    { label: '유효기간', value: '충전일로부터 1년' },
                  ].map(({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
                    <div key={label} className={cn('flex justify-between', bold && 'border-t border-border pt-2 mt-1')}>
                      <span className={cn(bold ? 'font-semibold' : 'text-muted-foreground')}>{label}</span>
                      <span className={cn(bold ? 'font-bold text-primary' : 'font-medium')}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('select')} className="flex-1 rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted">이전</button>
                <button onClick={() => setStep('complete')} className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90">결제 확인</button>
              </div>
            </>
          )}

          {step === 'complete' && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Coins size={28} className="text-green-600" />
              </div>
              <p className="mb-1 text-lg font-bold">{finalAmount.toLocaleString()}P 충전 완료!</p>
              <p className="mb-1 text-sm text-muted-foreground">현재 잔액: {(MOCK_POINT_BALANCE + finalAmount).toLocaleString()}P</p>
              <p className="mb-6 text-xs text-muted-foreground">유효기간: 충전일로부터 1년</p>
              <button onClick={onClose} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90">확인</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 환불 신청 모달 ────────────────────────────────────────────────────────────

const REFUND_REASONS = ['서비스 미사용', '구독 취소', '이중 결제', '기타'];

function RefundModal({ onClose }: { onClose: () => void }) {
  const [refundType, setRefundType] = useState<'card' | 'account'>('card');
  const [refundAmount, setRefundAmount] = useState('');
  const [reason, setReason] = useState(REFUND_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [bank, setBank] = useState(BANKS[0]);
  const [accountNo, setAccountNo] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const amount = Number(refundAmount.replace(/,/g, ''));
  const isCardRefund = refundType === 'card';
  const isValid = isCardRefund
    ? amount >= 10000 && amount % 10000 === 0 && amount <= MOCK_POINT_BALANCE
    : amount >= 10000 && amount % 10000 === 0 && amount <= MOCK_POINT_BALANCE && !!accountNo && !!accountHolder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">{submitted ? (isCardRefund ? '즉시 환불 완료' : '환불 신청 완료') : '포인트 환불 신청'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-4 text-center">
              <div className={cn('mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full', isCardRefund ? 'bg-green-100' : 'bg-blue-100')}>
                <RefreshCw size={28} className={isCardRefund ? 'text-green-600' : 'text-blue-600'} />
              </div>
              <p className="mb-1 text-lg font-bold">{isCardRefund ? '즉시 환불 처리되었습니다' : '환불 신청이 접수되었습니다'}</p>
              <p className="mb-1 text-sm font-medium">{amount.toLocaleString()}P 환불</p>
              <p className="mb-6 text-sm text-muted-foreground">
                {isCardRefund ? '결제 카드로 즉시 환불되었습니다.' : '운영팀 검토 후 영업일 기준 3~5일 이내 처리됩니다.'}
              </p>
              <button onClick={onClose} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90">확인</button>
            </div>
          ) : (
            <>
              {/* 환불 방식 선택 */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-semibold">환불 방식 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRefundType('card')}
                    className={cn(
                      'rounded-lg border-2 p-3 text-left transition-all',
                      refundType === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <p className="text-sm font-medium">카드 즉시 환불</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">결제 금액 전액 즉시 환불</p>
                    <span className="mt-1.5 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">즉시 처리</span>
                  </button>
                  <button
                    onClick={() => setRefundType('account')}
                    className={cn(
                      'rounded-lg border-2 p-3 text-left transition-all',
                      refundType === 'account' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <p className="text-sm font-medium">계좌 환불</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">부분 환불 가능, 운영팀 승인</p>
                    <span className="mt-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">3~5일 소요</span>
                  </button>
                </div>
              </div>

              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                {isCardRefund
                  ? <>결제 금액 <span className="font-semibold">전액</span>이 결제 카드로 즉시 환불됩니다. 부분 환불은 계좌 환불을 이용해 주세요.</>
                  : <>계좌 환불은 <span className="font-semibold">운영팀 승인</span> 후 처리됩니다. 영업일 기준 3~5일이 소요됩니다.</>
                }
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">환불 포인트 <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
                    <input
                      type="text"
                      value={refundAmount}
                      onChange={(e) => {
                        const num = e.target.value.replace(/[^0-9]/g, '');
                        setRefundAmount(num ? Number(num).toLocaleString() : '');
                      }}
                      placeholder="10,000 단위"
                      className="flex-1 text-sm outline-none"
                    />
                    <span className="text-sm text-muted-foreground">P</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">현재 잔액: {MOCK_POINT_BALANCE.toLocaleString()}P · 최소 10,000P 단위</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold">환불 사유 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full appearance-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary">
                      {REFUND_REASONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" />
                  </div>
                  {reason === '기타' && (
                    <input type="text" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="사유를 입력해주세요" className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  )}
                </div>

                {/* 계좌 환불일 경우 계좌 입력 */}
                {!isCardRefund && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">환불 계좌 <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      <div className="relative">
                        <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full appearance-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary">
                          {BANKS.map((b) => <option key={b}>{b}</option>)}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <input type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="계좌번호 (숫자만)" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                      <input type="text" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="예금주명" className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={onClose} className="flex-1 rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted">취소</button>
                <button
                  onClick={() => { if (isValid) setSubmitted(true); }}
                  disabled={!isValid}
                  className={cn('flex-1 rounded-xl py-3 text-sm font-semibold transition-colors', isValid ? 'bg-primary text-white hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground')}
                >
                  {isCardRefund ? '즉시 환불하기' : '환불 신청하기'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 잔액 경고 배너 ────────────────────────────────────────────────────────────

function BalanceWarning({ balance, onCharge }: { balance: number; onCharge: () => void }) {
  if (balance > 50000) return null;
  const isDanger = balance <= 10000;
  return (
    <div className={cn('mb-4 flex items-center gap-3 rounded-xl border px-4 py-3', isDanger ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50')}>
      {isDanger ? <AlertCircle size={18} className="flex-shrink-0 text-red-500" /> : <AlertTriangle size={18} className="flex-shrink-0 text-amber-500" />}
      <p className={cn('flex-1 text-xs', isDanger ? 'text-red-700' : 'text-amber-700')}>
        {isDanger ? '포인트 잔액이 부족합니다. 충전 후 메시지 발송이 가능합니다.' : '포인트 잔액이 50,000P 이하입니다. 발송 전에 미리 충전해 두세요.'}
      </p>
      <button onClick={onCharge} className={cn('flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors', isDanger ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-500 text-white hover:bg-amber-600')}>
        충전하기
      </button>
    </div>
  );
}

// ─── 메인 페이지 ───────────────────────────────────────────────────────────────

export function PointManagementPage() {
  const [activePeriod, setActivePeriod] = useState('전체');
  const [activeType, setActiveType] = useState('전체');
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const { data: pointHistory = [] } = usePointHistory();

  const filteredHistory = useMemo(() => {
    if (activeType === '전체') return pointHistory;
    return pointHistory.filter((h) => h.type === activeType);
  }, [pointHistory, activeType]);

  const balance = MOCK_POINT_BALANCE;
  const balanceColor = balance <= 10000 ? 'text-red-600' : balance <= 50000 ? 'text-amber-600' : 'text-foreground';

  return (
    <div className="space-y-6">
      <PageHeader
        title="포인트 관리"
        description="메시지 발송에 사용되는 포인트를 충전하고 내역을 확인합니다"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RefreshCw size={15} />
              환불 신청
            </button>
            <button
              onClick={() => setShowChargeModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <Plus size={15} />
              포인트 충전
            </button>
          </div>
        }
      />

      <BalanceWarning balance={balance} onCharge={() => setShowChargeModal(true)} />

      {/* 잔액 + 단가 */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="col-span-1 rounded-xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              <Coins size={18} className="text-amber-600" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">현재 잔액</p>
          </div>
          <p className={cn('text-2xl font-bold tabular-nums', balanceColor)}>
            {balance.toLocaleString()}P
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">= {balance.toLocaleString()}원</p>
          <button
            onClick={() => setShowChargeModal(true)}
            className="mt-4 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
          >
            충전하기
          </button>
        </div>

        <div className="col-span-3 rounded-xl border border-border bg-white p-5">
          <p className="mb-3 text-xs font-semibold">브랜드 메시지 발송 단가</p>
          <div className="flex items-center gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-2xl font-bold">{UNIT_PRICE}P<span className="text-sm font-normal text-muted-foreground"> /건</span></p>
              <p className="mt-0.5 text-xs text-muted-foreground">= {UNIT_PRICE}원/건 (기본형·와이드 이미지형 동일)</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            · 발송 실패 시 해당 건수만큼 자동 환불됩니다 &nbsp;·&nbsp; 잔액 부족 시 발송이 중단됩니다 &nbsp;·&nbsp; 포인트 유효기간: 충전일로부터 1년
          </p>
        </div>
      </div>

      {/* 내역 */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">포인트 내역</h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {PERIOD_TABS.map((tab) => (
              <button key={tab} onClick={() => setActivePeriod(tab)} className={cn('rounded-lg border px-3 py-1.5 text-xs transition-colors', activePeriod === tab ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted')}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {TYPE_TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveType(tab)} className={cn('rounded-lg border px-3 py-1.5 text-xs transition-colors', activeType === tab ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted')}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTable columns={COLUMNS} data={filteredHistory} pagination={NOOP_PAGINATION} />

      {showChargeModal && <ChargeModal onClose={() => setShowChargeModal(false)} />}
      {showRefundModal && <RefundModal onClose={() => setShowRefundModal(false)} />}
    </div>
  );
}
