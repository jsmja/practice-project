import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import { Plus, CheckCircle, Clock, AlertTriangle, Ban, CircleStop } from 'lucide-react';
import type { ICampaignDto } from '@/models/interface/dto';
import { CAMPAIGN_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { useCampaignList } from '@/hooks/client/campaigns/useCampaignsClient';
import { CrmCampaignCreateForm } from './CrmCampaignCreatePage';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'destructive' | 'warning' | 'default'> = {
  [CAMPAIGN_STATUS.SUCCESS]: 'success',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
  [CAMPAIGN_STATUS.ENDED]: 'default',
  [CAMPAIGN_STATUS.SCHEDULED]: 'info',
  [CAMPAIGN_STATUS.PAUSED]: 'warning',
};

const TYPE_VARIANT: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  '커스텀 캠페인': 'default',
  '웰컴백 캠페인': 'info',
  '신규회원 이탈방지': 'success',
  '재구매 유도': 'warning',
  '구매 감사': 'info',
  '생일 축하': 'success',
  'VIP 전용': 'warning',
};

const FILTERS = [
  {
    key: 'type',
    label: '유형',
    value: 'all',
    options: [
      { label: '전체', value: 'all' },
      { label: '커스텀 캠페인', value: '커스텀 캠페인' },
      { label: '웰컴백 캠페인', value: '웰컴백 캠페인' },
      { label: '신규회원 이탈방지', value: '신규회원 이탈방지' },
      { label: '재구매 유도', value: '재구매 유도' },
      { label: '구매 감사', value: '구매 감사' },
      { label: '생일 축하', value: '생일 축하' },
      { label: 'VIP 전용', value: 'VIP 전용' },
    ],
  },
];

function formatSendRound(row: ICampaignDto) {
  if (row.sendFrequency === '1회') {
    return (
      <span className="inline-flex items-center gap-1">
        <Badge variant="default">1회</Badge>
        <span className="text-xs font-medium">1/1회차</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Badge variant="info">반복</Badge>
      <span className="text-xs font-medium">{row.sendRound}/{row.totalRounds}회차</span>
    </span>
  );
}

const COLUMNS = [
  { key: 'no', header: 'NO', width: '60px' },
  { key: 'name', header: '캠페인명' },
  {
    key: 'type',
    header: '캠페인 유형',
    width: '160px',
    render: (row: ICampaignDto) => (
      <Badge variant={TYPE_VARIANT[row.type] ?? 'default'}>{row.type}</Badge>
    ),
  },
  {
    key: 'sendRound',
    header: '발송 회차',
    width: '130px',
    render: formatSendRound,
  },
  { key: 'sendDate', header: '발송 일시', width: '160px' },
  {
    key: 'status',
    header: '상태',
    width: '90px',
    render: (row: ICampaignDto) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>
    ),
  },
  { key: 'targetCount', header: '대상 수', width: '75px' },
  { key: 'successCount', header: '성공 수', width: '75px' },
  { key: 'failCount', header: '실패 수', width: '75px' },
];

type ViewType = 'list' | 'create';

export function CrmManagementPage() {
  const [activeView, setActiveView] = useState<ViewType>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);
  const { data: campaigns = [] } = useCampaignList();

  const successCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SUCCESS).length, [campaigns]);
  const scheduledCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SCHEDULED).length, [campaigns]);
  const failedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.FAILED).length, [campaigns]);
  const endedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.ENDED).length, [campaigns]);
  const pausedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.PAUSED).length, [campaigns]);

  // 상태 + 유형 필터 적용
  const filteredCampaigns = useMemo(() => {
    let result = campaigns;
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }
    const typeFilterValue = filters.find((f) => f.key === 'type')?.value;
    if (typeFilterValue && typeFilterValue !== 'all') {
      result = result.filter((c) => c.type === typeFilterValue);
    }
    return result;
  }, [campaigns, statusFilter, filters]);

  const handleStatCardClick = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  if (activeView === 'create') {
    return (
      <CrmCampaignCreateForm
        onCancel={() => setActiveView('list')}
        onComplete={() => setActiveView('list')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="캠페인 메시지 관리"
        description="카카오 브랜드 메시지 캠페인을 만들고 발송 현황을 관리합니다"
        actions={
          <button
            onClick={() => setActiveView('create')}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={15} />
            캠페인 만들기
          </button>
        }
      />

      {/* 상태별 StatCard */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          title="성공"
          value={successCount}
          icon={<CheckCircle size={18} />}
          isActive={statusFilter === CAMPAIGN_STATUS.SUCCESS}
          onClick={() => handleStatCardClick(CAMPAIGN_STATUS.SUCCESS)}
        />
        <StatCard
          title="예정"
          value={scheduledCount}
          icon={<Clock size={18} />}
          isActive={statusFilter === CAMPAIGN_STATUS.SCHEDULED}
          onClick={() => handleStatCardClick(CAMPAIGN_STATUS.SCHEDULED)}
        />
        <StatCard
          title="종료"
          value={endedCount}
          icon={<CircleStop size={18} />}
          isActive={statusFilter === CAMPAIGN_STATUS.ENDED}
          onClick={() => handleStatCardClick(CAMPAIGN_STATUS.ENDED)}
        />
        <StatCard
          title="중지"
          value={pausedCount}
          icon={<Ban size={18} />}
          isActive={statusFilter === CAMPAIGN_STATUS.PAUSED}
          onClick={() => handleStatCardClick(CAMPAIGN_STATUS.PAUSED)}
        />
        <StatCard
          title="실패"
          value={failedCount}
          icon={<AlertTriangle size={18} />}
          isActive={statusFilter === CAMPAIGN_STATUS.FAILED}
          onClick={() => handleStatCardClick(CAMPAIGN_STATUS.FAILED)}
        />
      </div>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={() => { handleReset(); setStatusFilter('all'); }} />

      <DataTable columns={COLUMNS} data={filteredCampaigns} pagination={NOOP_PAGINATION} />
    </div>
  );
}
