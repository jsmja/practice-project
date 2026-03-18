import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { CustomerDetailPanel } from './CustomerDetailPanel';
import { MessageSquare, Search } from 'lucide-react';
import type { ICustomerDto } from '@/models/interface/dto';
import { CONSENT_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { useCustomerList } from '@/hooks/client/customers/useCustomersClient';

const FILTERS = [
  { key: 'source', label: '유입 경로', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '카페24', value: 'cafe24' }, { label: '직접유입', value: 'direct' }] },
  { key: 'date', label: '특정 일시 선택', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '오늘', value: 'today' }, { label: '최근 7일', value: '7days' }] },
  { key: 'member', label: '회원여부', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '회원', value: 'member' }, { label: '비회원', value: 'guest' }] },
  { key: 'consent', label: '마케팅 수신동의', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '동의', value: 'agreed' }, { label: '미동의', value: 'disagreed' }] },
];

const COLUMNS = [
  { key: 'no', header: 'No.', width: '60px' },
  { key: 'name', header: '이름', width: '80px' },
  { key: 'phone', header: '휴대폰 번호', width: '120px' },
  {
    key: 'marketingConsent',
    header: '마케팅 수신동의',
    width: '130px',
    render: (row: ICustomerDto) => {
      if (row.marketingConsent === CONSENT_STATUS.DISAGREED) {
        return <Badge variant="default">{CONSENT_STATUS.DISAGREED}</Badge>;
      }
      if (row.marketingConsent.includes(CONSENT_STATUS.AGREED)) {
        return <Badge variant="success">{row.marketingConsent}</Badge>;
      }
      return <span>-</span>;
    },
  },
  { key: 'browserId', header: '브라우저 ID' },
  { key: 'customerId', header: '고객 식별 번호' },
  { key: 'lastAccess', header: '최근 접속 시간', sortable: true, width: '160px' },
];

export function CustomerListPage() {
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomerDto | null>(null);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data: customers = [] } = useCustomerList();

  return (
    <div className="relative space-y-6">
      <PageHeader
        title="고객 리스트"
        actions={
          selectedRows.size > 0 ? (
            <button className="flex items-center gap-2 rounded-lg bg-kakao px-4 py-2.5 text-sm font-medium text-kakao-foreground shadow-sm transition-colors hover:bg-yellow-400">
              <MessageSquare size={16} />
              선택 고객 카카오 발송 ({selectedRows.size}명)
            </button>
          ) : undefined
        }
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        className="mb-4"
      />

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="ml-auto flex items-center gap-2">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="all">전체</option>
            <option value="name">이름</option>
            <option value="browserId">브라우저 ID</option>
            <option value="customerId">고객 식별 번호</option>
          </select>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색어를 입력해 주세요."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            검색
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={customers}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onRowClick={(row) => setSelectedCustomer(row)}
        totalLabel={`전체 ${customers.length}건`}
        pagination={NOOP_PAGINATION}
      />

      {/* Detail Panel */}
      <CustomerDetailPanel
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
