import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { SectionCard } from '@/components/common/SectionCard';
import { PeriodTabGroup } from '@/components/common/PeriodTabGroup';
import { ChartPlaceholder } from '@/components/common/ChartPlaceholder';
import { ExcelDownloadButton } from '@/components/common/ExcelDownloadButton';
import { Send, CheckCircle, Coins } from 'lucide-react';
import type { ICrmStatDto } from '@/models/interface/dto';
import { NOOP_PAGINATION, PERIOD_TABS } from '@/lib/constants';
import { useCrmStats } from '@/hooks/client/statistics/useStatisticsClient';

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'campaignName', header: '캠페인명' },
  {
    key: 'type',
    header: '발송 유형',
    width: '100px',
    render: (row: ICrmStatDto) => <Badge variant="kakao">{row.type}</Badge>,
  },
  { key: 'sendDate', header: '발송일', width: '120px' },
  { key: 'targetCount', header: '대상 수', width: '80px', sortable: true },
  { key: 'successCount', header: '성공 수', width: '80px', sortable: true },
  { key: 'failCount', header: '실패 수', width: '80px', sortable: true },
  {
    key: 'cost',
    header: '비용(P)',
    width: '80px',
    sortable: true,
    render: (row: ICrmStatDto) => <span>{row.cost}P</span>,
  },
];

export function CrmStatisticsPage() {
  const [activePeriod, setActivePeriod] = useState('일주일');

  const { data: crmStats = [] } = useCrmStats();

  return (
    <div>
      <PageHeader
        title="CRM 발송 통계"
        actions={<ExcelDownloadButton />}
      />

      {/* Period Filter */}
      <PeriodTabGroup
        tabs={[...PERIOD_TABS]}
        activeTab={activePeriod}
        onTabChange={setActivePeriod}
        dateRange="2026-03-04 ~ 2026-03-10"
        className="mb-6"
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard title="총 발송 수" value="207건" icon={<Send size={18} />} />
        <StatCard
          title="발송 성공률"
          value="95.7%"
          change={{ value: '2.3% 전주 대비', isPositive: true }}
          icon={<CheckCircle size={18} />}
        />
        <StatCard title="총 비용 (포인트)" value="310P" icon={<Coins size={18} />} />
      </div>

      {/* 발송 유형별 통계 */}
      <SectionCard title="발송 유형별 통계" className="mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-xs text-muted-foreground">알림톡</p>
            <p className="mt-1 text-xl font-bold">57건</p>
            <p className="mt-1 text-xs text-green-600">성공률 98.2%</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-muted-foreground">친구톡</p>
            <p className="mt-1 text-xl font-bold">150건</p>
            <p className="mt-1 text-xs text-green-600">성공률 94.7%</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs text-muted-foreground">브랜드 메시지</p>
            <p className="mt-1 text-xl font-bold">0건</p>
            <p className="mt-1 text-xs text-muted-foreground">미사용</p>
          </div>
        </div>
      </SectionCard>

      {/* 일별 발송 추이 */}
      <SectionCard title="일별 발송 추이" className="mb-6">
        <ChartPlaceholder label="차트 영역 (일별 발송 건수 / 성공률 추이)" />
      </SectionCard>

      {/* 캠페인별 상세 데이터 */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">캠페인별 상세 데이터</h3>
      </div>
      <DataTable
        columns={COLUMNS}
        data={crmStats}
        pagination={NOOP_PAGINATION}
      />
    </div>
  );
}
