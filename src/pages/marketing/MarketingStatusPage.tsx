import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import type { IMarketingDto } from '@/models/interface/dto';
import { MARKETING_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { useMarketingList } from '@/hooks/client/marketing/useMarketingClient';

const FILTERS = [
  { key: 'type', label: '유형', value: 'all', options: [{ label: '전체', value: 'all' }] },
  { key: 'status', label: '상태', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '진행중', value: 'active' }, { label: '중지', value: 'paused' }] },
  { key: 'sendCount', label: '발송 횟수', value: 'all', options: [{ label: '전체', value: 'all' }] },
];

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'name', header: '마케팅 명', sortable: true },
  { key: 'period', header: '발송 기간', sortable: true, width: '220px' },
  {
    key: 'type',
    header: '유형',
    width: '120px',
    render: (row: IMarketingDto) => <Badge variant="kakao">{row.type}</Badge>,
  },
  {
    key: 'status',
    header: '상태',
    width: '80px',
    sortable: true,
    render: (row: IMarketingDto) => (
      <Badge variant={row.status === MARKETING_STATUS.PAUSED ? 'destructive' : 'success'}>{row.status}</Badge>
    ),
  },
  { key: 'sendCount', header: '발송 횟수', sortable: true },
  { key: 'target', header: '대상' },
  { key: 'impressions', header: '노출 수', sortable: true, width: '80px' },
  { key: 'clicks', header: '메시지 클릭 수(클릭률)', sortable: true, width: '160px' },
  { key: 'avgClickTime', header: '평균 클릭 소요 시간', sortable: true, width: '150px' },
];

export function MarketingStatusPage() {
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);

  const { data: marketingList = [] } = useMarketingList();

  return (
    <div>
      <PageHeader title="마케팅 현황" />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        className="mb-4"
      />

      <DataTable
        columns={COLUMNS}
        data={marketingList}
        pagination={NOOP_PAGINATION}
      />
    </div>
  );
}
