import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';
import { Coins, Plus } from 'lucide-react';
import { usePointHistory } from '@/hooks/client/points/usePointsClient';
import type { IPointHistoryDto } from '@/models/interface/dto';

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'date', header: '날짜', width: '160px', sortable: true },
  {
    key: 'type',
    header: '유형',
    width: '80px',
    render: (row: IPointHistoryDto) => (
      <Badge variant={row.type === '충전' ? 'success' : 'info'}>{row.type}</Badge>
    ),
  },
  { key: 'description', header: '내용' },
  {
    key: 'amount',
    header: '금액',
    width: '100px',
    sortable: true,
    render: (row: IPointHistoryDto) => (
      <span className={cn('font-medium', row.amount > 0 ? 'text-green-600' : 'text-red-500')}>
        {row.amount > 0 ? '+' : ''}{row.amount}P
      </span>
    ),
  },
  {
    key: 'balance',
    header: '잔액',
    width: '100px',
    render: (row: IPointHistoryDto) => <span className="font-medium">{row.balance}P</span>,
  },
];

const PERIOD_TABS = ['최근 1개월', '최근 3개월', '최근 6개월', '전체'];
const TYPE_TABS = ['전체', '충전', '사용'];

export function PointManagementPage() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('전체');
  const [activeType, setActiveType] = useState('전체');

  const { data: pointHistory = [] } = usePointHistory();

  return (
    <div>
      <PageHeader
        title="포인트 관리"
        actions={
          <button onClick={() => navigate('/payment/apply')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-gray-800">
            <Plus size={16} />
            서비스 신청/충전
          </button>
        }
      />

      {/* 잔여 포인트 */}
      <div className="mb-6">
        <StatCard
          title="잔여 포인트"
          value="730P"
          description="마지막 충전: 2025.12.15"
          icon={<Coins size={24} />}
          className="max-w-sm"
        />
      </div>

      {/* 포인트 단가 안내 */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="mb-3 text-sm font-semibold">포인트 단가 안내</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-muted-foreground">알림톡</p>
            <p className="mt-1 font-bold">1건당 0.7P</p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-muted-foreground">친구톡</p>
            <p className="mt-1 font-bold">텍스트 1.9P / 이미지 2.2P</p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <p className="text-xs text-muted-foreground">브랜드 메시지</p>
            <p className="mt-1 font-bold">친구 1.4P / 비친구 1.6P</p>
          </div>
        </div>
      </div>

      {/* 충전/사용 내역 */}
      <h3 className="mb-3 text-sm font-semibold">충전/사용 내역</h3>

      {/* Period filter */}
      <div className="mb-3 flex items-center gap-4">
        <div className="flex gap-1">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePeriod(tab)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs transition-colors',
                activePeriod === tab ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveType(tab)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs transition-colors',
                activeType === tab ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={pointHistory}
        pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
      />
    </div>
  );
}
