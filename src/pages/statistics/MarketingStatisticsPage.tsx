import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';

interface IMarketingStat {
  [key: string]: unknown;
  no: number;
  name: string;
  period: string;
  type: string;
  status: string;
  sendCount: string;
  target: string;
  impressions: number;
  clicks: string;
  avgClickTime: string;
}

const MOCK_DATA: IMarketingStat[] = [
  {
    no: 1,
    name: '마케팅 수신동의 받기',
    period: '25.12.17 14:30 ~ 26.12.31 23:59',
    type: '마케팅수신동의',
    status: '중지',
    sendCount: '접속 할 때마다 (오늘 하루 보지 않기)',
    target: '마케팅 수신 미동의',
    impressions: 0,
    clicks: '0 (0.0%)',
    avgClickTime: '00:00:00',
  },
];

const FILTERS = [
  { key: 'search', label: '마케팅 명', value: 'all', options: [{ label: '전체', value: 'all' }] },
  { key: 'type', label: '유형', value: 'all', options: [{ label: '전체', value: 'all' }] },
  { key: 'status', label: '상태', value: 'all', options: [{ label: '전체', value: 'all' }] },
  { key: 'sendCount', label: '발송 횟수', value: 'all', options: [{ label: '전체', value: 'all' }] },
];

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'name', header: '마케팅 명', sortable: true },
  { key: 'period', header: '발송 기간', sortable: true, width: '220px' },
  {
    key: 'type',
    header: '유형',
    sortable: true,
    width: '120px',
    render: (row: IMarketingStat) => <Badge variant="kakao">{row.type}</Badge>,
  },
  {
    key: 'status',
    header: '상태',
    sortable: true,
    width: '80px',
    render: (row: IMarketingStat) => (
      <Badge variant={row.status === '중지' ? 'destructive' : 'success'}>{row.status}</Badge>
    ),
  },
  { key: 'sendCount', header: '발송 횟수', sortable: true },
  { key: 'target', header: '대상' },
  { key: 'impressions', header: '노출 수', sortable: true, width: '80px' },
  { key: 'clicks', header: '메시지 클릭 수(클릭률)', sortable: true, width: '160px' },
  { key: 'avgClickTime', header: '평균 클릭 소요 시간', sortable: true, width: '150px' },
];

const PERIOD_TABS = ['어제', '일주일', '이번달'];

export function MarketingStatisticsPage() {
  const [activePeriod, setActivePeriod] = useState('일주일');
  const [filters, setFilters] = useState(FILTERS);

  return (
    <div>
      <PageHeader
        title="마케팅 통계"
        description="통계 : 매일 오전 4시 기준으로 집계 (예 : 6.17 = 6.17 04시 ~ 6.18 04시)"
        actions={
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Download size={14} />
            엑셀 다운로드
          </button>
        }
      />

      {/* Period tabs */}
      <div className="mb-6 flex items-center gap-2">
        {PERIOD_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePeriod(tab)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              activePeriod === tab ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
            )}
          >
            {tab}
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">📅 2026-03-05 ~ 2026-03-11</span>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard title="총 메시지 노출 수" value="0" />
        <StatCard title="총 클릭 수 (마케팅 수신동의 전환 수)" value="0 (0)" />
        <StatCard title="총 클릭률 (마케팅 수신동의 전환율)" value="0% (0%)" />
      </div>

      {/* TOP3 tables */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="mb-3 text-sm font-semibold">노출 수가 많은 마케팅 TOP3 ⓘ</p>
          <table className="w-full text-xs">
            <tbody>
              {[1, 2, 3].map((rank) => (
                <tr key={rank} className="border-t border-border">
                  <td className="py-2">
                    <Badge variant={rank === 1 ? 'info' : rank === 2 ? 'success' : 'warning'}>TOP {rank}</Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">-</td>
                  <td className="py-2 text-right text-muted-foreground">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="mb-3 text-sm font-semibold">메시지 클릭률이 높은 마케팅 TOP3 ⓘ</p>
          <table className="w-full text-xs">
            <tbody>
              {[1, 2, 3].map((rank) => (
                <tr key={rank} className="border-t border-border">
                  <td className="py-2">
                    <Badge variant={rank === 1 ? 'info' : rank === 2 ? 'success' : 'warning'}>TOP {rank}</Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">-</td>
                  <td className="py-2 text-right text-muted-foreground">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 마케팅 성과 추이 */}
      <div className="mb-6 rounded-xl border border-border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">마케팅 성과 추이</h3>
          <div className="flex gap-1">
            {['일별', '주별', '월별', '시간대별'].map((tab) => (
              <button key={tab} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-muted">
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 text-sm text-muted-foreground">
          📊 마케팅 성과 추이 차트 (클릭 수, 미클릭 수, 노출수, 수신동의 전환 수, 평균 클릭 소요 시간)
        </div>
      </div>

      {/* 마케팅별 상세 정보 */}
      <h3 className="mb-3 text-sm font-semibold">마케팅별 상세 정보</h3>
      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)))}
        onReset={() => setFilters(FILTERS)}
        className="mb-4"
      />
      <DataTable
        columns={COLUMNS}
        data={MOCK_DATA}
        pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
      />
    </div>
  );
}
