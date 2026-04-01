import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'destructive' | 'warning' | 'default'> = {
  [CAMPAIGN_STATUS.SUCCESS]: 'success',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
  [CAMPAIGN_STATUS.ENDED]: 'default',
  [CAMPAIGN_STATUS.SCHEDULED]: 'info',
  [CAMPAIGN_STATUS.PAUSED]: 'warning',
};

const TYPE_VARIANT: Record<string, 'kakao' | 'info' | 'warning'> = {
  '알림톡': 'kakao',
  '친구톡': 'info',
  '브랜드메시지': 'warning',
};

const FILTERS = [
  { key: 'type', label: '유형', value: 'all', options: [{ label: '전체', value: 'all' }, { label: '알림톡', value: 'alim' }, { label: '친구톡', value: 'friend' }, { label: '브랜드메시지', value: 'brand' }] },
  { key: 'count', label: '발송 횟수', value: 'all', options: [{ label: '전체', value: 'all' }] },
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
    header: '발송 유형',
    width: '120px',
    render: (row: ICampaignDto) => <Badge variant={TYPE_VARIANT[row.type] ?? 'default'}>{row.type}</Badge>,
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
    width: '100px',
    render: (row: ICampaignDto) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>,
  },
  { key: 'targetCount', header: '대상 수', width: '80px' },
  { key: 'successCount', header: '성공 수', width: '80px' },
  { key: 'failCount', header: '실패 수', width: '80px' },
];

export function CrmCampaignListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);

  const { data: campaigns = [] } = useCampaignList();

  const successCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SUCCESS).length, [campaigns]);
  const scheduledCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SCHEDULED).length, [campaigns]);
  const failedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.FAILED).length, [campaigns]);
  const endedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.ENDED).length, [campaigns]);
  const pausedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.PAUSED).length, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    if (statusFilter === 'all') return campaigns;
    return campaigns.filter((c) => c.status === statusFilter);
  }, [campaigns, statusFilter]);

  const handleStatCardClick = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  return (
    <div>
      <PageHeader
        title="메시지 캠페인 현황"
        actions={
          <button
            onClick={() => navigate('/marketing/crm')}
            className="flex items-center gap-2 rounded-lg bg-kakao px-4 py-2.5 text-sm font-medium text-kakao-foreground shadow-sm transition-colors hover:bg-yellow-400"
          >
            <Plus size={16} />
            캠페인 만들기
          </button>
        }
      />

      {/* StatCard 클릭 필터 */}
      <div className="mb-6 grid grid-cols-5 gap-4">
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
          title="일시중지"
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

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => { handleReset(); setStatusFilter('all'); }}
        className="mb-4"
      />

      <DataTable
        columns={COLUMNS}
        data={filteredCampaigns}
        pagination={NOOP_PAGINATION}
      />
    </div>
  );
}
