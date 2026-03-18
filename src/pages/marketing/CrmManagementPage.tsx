import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import { Plus, CheckCircle, Clock, AlertTriangle, Ban, CircleStop, MessageCircle, ArrowRight, Settings, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_POINT_BALANCE } from '@/mocks/points';
import type { ICampaignDto } from '@/models/interface/dto';
import { CAMPAIGN_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { useCampaignList } from '@/hooks/client/campaigns/useCampaignsClient';
import { useServiceStore } from '@/store/useServiceStore';
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
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);
  const { data: campaigns = [] } = useCampaignList();
  const { kakaoLinked, setKakaoLinked } = useServiceStore();

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

  const devToggle = (
    <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-2">
      <label className="flex cursor-pointer items-center gap-2">
        <span className="text-xs font-medium text-amber-700">개발자 모드: 카카오 연동 상태 전환</span>
        <input
          type="checkbox"
          checked={kakaoLinked}
          onChange={(e) => setKakaoLinked(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <span className="text-xs text-amber-600">{kakaoLinked ? '연동됨' : '미연동'}</span>
      </label>
    </div>
  );

  // 서비스 미연동 상태
  if (!kakaoLinked) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="캠페인 메시지 관리"
          description="카카오 브랜드 메시지 캠페인을 만들고 발송 현황을 관리합니다"
        />
        {devToggle}

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white py-20">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <MessageCircle size={36} className="text-amber-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-foreground">카카오 브랜드메시지 서비스 연동이 필요합니다</h3>
          <p className="mb-1 text-sm text-muted-foreground">캠페인 메시지를 발송하려면 먼저 카카오 브랜드메시지 서비스를 신청해 주세요.</p>
          <p className="mb-8 text-xs text-muted-foreground">서비스 연동 후 캠페인 만들기, 발송 관리 등 모든 기능을 이용할 수 있습니다.</p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/service-integration')}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <Settings size={16} />
              서비스 연동하기
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-border/60 bg-gray-50 px-6 py-4">
            <p className="mb-2 text-xs font-semibold text-foreground">서비스 연동 절차</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
                서비스 연동 페이지 이동
              </span>
              <ArrowRight size={12} className="text-border" />
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>
                카카오 브랜드메시지 신청
              </span>
              <ArrowRight size={12} className="text-border" />
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">3</span>
                채널 인증 완료
              </span>
              <ArrowRight size={12} className="text-border" />
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">4</span>
                캠페인 만들기 시작!
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {devToggle}

      {/* 포인트 잔액 */}
      <div className={cn(
        'flex items-center justify-between rounded-xl border p-4',
        MOCK_POINT_BALANCE <= 10000 ? 'border-red-200 bg-red-50' : MOCK_POINT_BALANCE <= 50000 ? 'border-amber-200 bg-amber-50' : 'border-border bg-white'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', MOCK_POINT_BALANCE <= 50000 ? 'bg-amber-100' : 'bg-muted')}>
            {MOCK_POINT_BALANCE <= 50000
              ? <AlertTriangle size={16} className="text-amber-600" />
              : <Coins size={16} className="text-muted-foreground" />
            }
          </div>
          <div>
            <p className="text-xs text-muted-foreground">메시지 발송 포인트 잔액</p>
            <p className={cn('text-base font-bold tabular-nums', MOCK_POINT_BALANCE <= 10000 ? 'text-red-600' : MOCK_POINT_BALANCE <= 50000 ? 'text-amber-600' : 'text-foreground')}>
              {MOCK_POINT_BALANCE.toLocaleString()}P
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings/points')}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          충전하기
        </button>
      </div>

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
