import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { ExcelDownloadButton } from '@/components/common/ExcelDownloadButton';
import { cn } from '@/lib/utils';
import type { IPaymentHistoryDto } from '@/models/interface/dto';
import { MOCK_PAYMENT_HISTORY } from '@/mocks/payment';
import { NOOP_PAGINATION } from '@/lib/constants';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'info'> = {
  결제완료: 'success',
  충전완료: 'info',
  환불대기: 'warning',
  환불완료: 'default',
  결제취소: 'warning',
  결제실패: 'destructive',
};

const STATUS_TABS = ['전체', '결제완료', '충전완료', '환불대기', '환불완료', '결제취소', '결제실패'];
const PERIOD_TABS = ['전체', '주', '월'];

const COLUMNS = [
  { key: 'paymentDate', header: '결제 일시', width: '160px', sortable: true },
  {
    key: 'status',
    header: '상태',
    width: '100px',
    render: (row: IPaymentHistoryDto) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>
    ),
  },
  { key: 'productName', header: '구독 상품' },
  { key: 'subscriptionType', header: '구독 유형', width: '100px' },
  { key: 'paymentMethod', header: '결제 수단', width: '140px' },
  {
    key: 'amount',
    header: '결제 금액',
    width: '110px',
    sortable: true,
    render: (row: IPaymentHistoryDto) => (
      <span className={cn('font-medium', row.amount < 0 && 'text-red-500')}>
        {row.amount < 0 ? `${row.amount.toLocaleString()}원` : `${row.amount.toLocaleString()}원`}
      </span>
    ),
  },
  { key: 'reason', header: '사유', width: '100px' },
  {
    key: 'receiptUrl',
    header: '영수증',
    width: '80px',
    render: (row: IPaymentHistoryDto) =>
      row.receiptUrl ? (
        <a href={row.receiptUrl} className="text-xs text-blue-600 underline hover:text-blue-800">
          보기
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  {
    key: 'action',
    header: '처리',
    width: '100px',
    render: (row: IPaymentHistoryDto) =>
      row.status === '환불대기' ? (
        <button
          onClick={() => alert(`환불 처리 완료: ${Math.abs(row.amount).toLocaleString()}원`)}
          className="rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
        >
          환불 처리
        </button>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
];

export function PaymentHistoryPage() {
  const [activeStatus, setActiveStatus] = useState('전체');
  const [activePeriod, setActivePeriod] = useState('전체');

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: MOCK_PAYMENT_HISTORY.length };
    MOCK_PAYMENT_HISTORY.forEach((item) => {
      counts[item.status] = (counts[item.status] ?? 0) + 1;
    });
    return counts;
  }, []);

  const filteredData = useMemo(() => {
    if (activeStatus === '전체') return MOCK_PAYMENT_HISTORY;
    return MOCK_PAYMENT_HISTORY.filter((item) => item.status === activeStatus);
  }, [activeStatus]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="결제내역"
        actions={<ExcelDownloadButton />}
      />

      {/* 기간 + 검색 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePeriod(tab)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs transition-colors',
                activePeriod === tab ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="검색"
          className="rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* 상태 탭 */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatus(tab)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors',
              activeStatus === tab
                ? 'border-b-2 border-primary font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
              activeStatus === tab ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            )}>
              {statusCounts[tab] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <DataTable columns={COLUMNS} data={filteredData} pagination={NOOP_PAGINATION} />
    </div>
  );
}
