import { Badge } from '@/components/common/Badge';
import { DataTable } from '@/components/common/DataTable';
import { NOOP_PAGINATION } from '@/lib/constants';
import type { IBannerDto } from '@/models/interface/dto';
import { BANNER_STATUS } from '@/models/type';
import type { BadgeVariantType } from '@/models/type';

const STATUS_VARIANT: Record<string, BadgeVariantType> = {
  [BANNER_STATUS.ACTIVE]: 'success',
  [BANNER_STATUS.PAUSED]: 'warning',
  [BANNER_STATUS.DRAFT]: 'default',
  [BANNER_STATUS.ENDED]: 'destructive',
};

const COLUMNS = [
  { key: 'title', header: '배너 명', sortable: true },
  { key: 'industry', header: '업종', width: '110px' },
  { key: 'purpose', header: '목적', width: '120px' },
  { key: 'bannerType', header: '배너 유형', width: '120px' },
  { key: 'targetCustomer', header: '대상 고객', width: '160px' },
  {
    key: 'status',
    header: '상태',
    width: '90px',
    render: (row: IBannerDto) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>
    ),
  },
  { key: 'startDate', header: '시작일', width: '100px' },
  { key: 'endDate', header: '종료일', width: '100px' },
  {
    key: 'impressions',
    header: '노출',
    width: '80px',
    sortable: true,
    render: (row: IBannerDto) => <span>{row.impressions.toLocaleString()}</span>,
  },
  {
    key: 'clicks',
    header: '클릭',
    width: '80px',
    sortable: true,
    render: (row: IBannerDto) => <span>{row.clicks.toLocaleString()}</span>,
  },
  { key: 'ctr', header: '클릭률', width: '80px' },
];

interface IBannerStatusTableProps {
  banners: IBannerDto[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const STATUS_TABS = ['전체', BANNER_STATUS.ACTIVE, BANNER_STATUS.PAUSED, BANNER_STATUS.DRAFT, BANNER_STATUS.ENDED];

export function BannerStatusTable({ banners, statusFilter, onStatusFilterChange }: IBannerStatusTableProps) {
  const filtered = statusFilter === '전체' ? banners : banners.filter((b) => b.status === statusFilter);

  return (
    <div>
      {/* 상태 탭 */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {STATUS_TABS.map((tab) => {
          const count = tab === '전체' ? banners.length : banners.filter((b) => b.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => onStatusFilterChange(tab)}
              className={
                statusFilter === tab
                  ? 'border-b-2 border-primary px-3 py-2.5 text-sm font-semibold text-foreground'
                  : 'px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground'
              }
            >
              {tab}
              <span className={
                'ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ' +
                (statusFilter === tab ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')
              }>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DataTable columns={COLUMNS} data={filtered} pagination={NOOP_PAGINATION} />
    </div>
  );
}
