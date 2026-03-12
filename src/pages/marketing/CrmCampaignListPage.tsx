import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import { Plus, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { ICampaignDto } from '@/models/interface/dto';
import { CAMPAIGN_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { MOCK_CAMPAIGNS } from '@/mocks/campaigns';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'destructive' | 'warning'> = {
  [CAMPAIGN_STATUS.SENT]: 'success',
  [CAMPAIGN_STATUS.RESERVED]: 'info',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
};

const TYPE_VARIANT: Record<string, 'kakao' | 'info' | 'warning'> = {
  '알림톡': 'kakao',
  '친구톡': 'info',
  '브랜드메시지': 'warning',
};

const FILTERS = [
  { key: 'type', label: '유형', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '알림톡', value: 'alim' }, { label: '친구톡', value: 'friend' }, { label: '브랜드메시지', value: 'brand' }] },
  { key: 'status', label: '상태', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '발송완료', value: 'done' }, { label: '예약중', value: 'reserved' }, { label: '실패', value: 'failed' }] },
  { key: 'count', label: '발송 횟수', value: 'all', options: [{ label: '전체', value: 'all' }] },
];

const COLUMNS = [
  { key: 'no', header: 'NO', width: '60px' },
  { key: 'name', header: '캠페인명' },
  {
    key: 'type',
    header: '발송 유형',
    width: '120px',
    render: (row: ICampaignDto) => <Badge variant={TYPE_VARIANT[row.type] ?? 'default'}>{row.type}</Badge>,
  },
  { key: 'sendDate', header: '발송 일시', width: '160px' },
  {
    key: 'status',
    header: '상태',
    width: '100px',
    render: (row: ICampaignDto) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>,
  },
  { key: 'targetCount', header: '대상 수', width: '80px' },
  { key: 'successCount', header: '성공 수', width: '80px' },
  { key: 'failCount', header: '실패 수', width: '80px' },
];

export function CrmCampaignListPage() {
  const navigate = useNavigate();
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);

  const sentCount = useMemo(() => MOCK_CAMPAIGNS.filter((c) => c.status === CAMPAIGN_STATUS.SENT).length, []);
  const reservedCount = useMemo(() => MOCK_CAMPAIGNS.filter((c) => c.status === CAMPAIGN_STATUS.RESERVED).length, []);
  const failedCount = useMemo(() => MOCK_CAMPAIGNS.filter((c) => c.status === CAMPAIGN_STATUS.FAILED).length, []);

  return (
    <div>
      <PageHeader
        title="CRM 캠페인 현황"
        actions={
          <button
            onClick={() => navigate('/marketing/crm/create')}
            className="flex items-center gap-2 rounded-lg bg-kakao px-4 py-2.5 text-sm font-medium text-kakao-foreground shadow-sm transition-colors hover:bg-yellow-400"
          >
            <Plus size={16} />
            캠페인 만들기
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard title="전체 캠페인" value={MOCK_CAMPAIGNS.length} icon={<Send size={18} />} />
        <StatCard title="발송 완료" value={sentCount} icon={<CheckCircle size={18} />} />
        <StatCard title="발송 예정" value={reservedCount} icon={<Clock size={18} />} />
        <StatCard title="발송 실패" value={failedCount} icon={<AlertTriangle size={18} />} />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        className="mb-4"
      />

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={MOCK_CAMPAIGNS}
        pagination={NOOP_PAGINATION}
      />
    </div>
  );
}
