import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { FilterBar } from '@/components/common/FilterBar';
import { Plus, Send, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICampaignDto } from '@/models/interface/dto';
import { CAMPAIGN_STATUS } from '@/models/type';
import { useFilterState } from '@/hooks/useFilterState';
import { NOOP_PAGINATION } from '@/lib/constants';
import { useCampaignList } from '@/hooks/client/campaigns/useCampaignsClient';
import { CrmCampaignCreateForm } from './CrmCampaignCreatePage';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'destructive' | 'warning'> = {
  [CAMPAIGN_STATUS.SENT]: 'success',
  [CAMPAIGN_STATUS.PENDING]: 'info',
  [CAMPAIGN_STATUS.SENDING]: 'warning',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
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
  {
    key: 'status',
    label: '상태',
    value: 'all',
    options: [
      { label: '전체', value: 'all' },
      { label: '대기', value: '대기' },
      { label: '발송중', value: '발송중' },
      { label: '완료', value: '완료' },
      { label: '실패', value: '실패' },
    ],
  },
];

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

type TabType = '캠페인 현황' | '캠페인 만들기';

export function CrmManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('캠페인 현황');
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);
  const { data: campaigns = [] } = useCampaignList();

  const sentCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SENT).length, [campaigns]);
  const pendingCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.PENDING || c.status === CAMPAIGN_STATUS.SENDING).length, [campaigns]);
  const failedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.FAILED).length, [campaigns]);

  return (
    <div>
      <PageHeader
        title="CRM 관리"
        description="카카오 브랜드 메시지 캠페인을 만들고 발송 현황을 관리합니다"
        actions={
          activeTab === '캠페인 현황' ? (
            <button
              onClick={() => setActiveTab('캠페인 만들기')}
              className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
            >
              <Plus size={16} />
              캠페인 만들기
            </button>
          ) : undefined
        }
      />

      {/* 탭 */}
      <div className="mb-6 flex gap-0 border-b border-border">
        {(['캠페인 현황', '캠페인 만들기'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '캠페인 현황' && (
        <>
          <div className="mb-6 grid grid-cols-4 gap-4">
            <StatCard title="전체 캠페인" value={campaigns.length} icon={<Send size={18} />} />
            <StatCard title="발송 완료" value={sentCount} icon={<CheckCircle size={18} />} />
            <StatCard title="발송 예정/중" value={pendingCount} icon={<Clock size={18} />} />
            <StatCard title="발송 실패" value={failedCount} icon={<AlertTriangle size={18} />} />
          </div>

          <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} className="mb-4" />

          <DataTable columns={COLUMNS} data={campaigns} pagination={NOOP_PAGINATION} />
        </>
      )}

      {activeTab === '캠페인 만들기' && (
        <CrmCampaignCreateForm onCancel={() => setActiveTab('캠페인 현황')} onComplete={() => setActiveTab('캠페인 현황')} />
      )}
    </div>
  );
}
