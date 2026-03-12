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
  [CAMPAIGN_STATUS.RESERVED]: 'info',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
};

const TYPE_VARIANT: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  '텍스트형': 'default',
  '이미지형': 'info',
  '와이드 이미지형': 'success',
  '와이드 아이템 리스트형': 'warning',
  '캐러셀 피드형': 'info',
};

const FILTERS = [
  {
    key: 'type',
    label: '유형',
    value: 'all',
    options: [
      { label: '전체', value: 'all' },
      { label: '텍스트형', value: '텍스트형' },
      { label: '이미지형', value: '이미지형' },
      { label: '와이드 이미지형', value: '와이드 이미지형' },
      { label: '와이드 아이템 리스트형', value: '와이드 아이템 리스트형' },
      { label: '캐러셀 피드형', value: '캐러셀 피드형' },
    ],
  },
  {
    key: 'status',
    label: '상태',
    value: 'all',
    options: [
      { label: '전체', value: 'all' },
      { label: '발송완료', value: 'done' },
      { label: '예약중', value: 'reserved' },
      { label: '실패', value: 'failed' },
    ],
  },
];

const COLUMNS = [
  { key: 'no', header: 'NO', width: '60px' },
  { key: 'name', header: '캠페인명' },
  {
    key: 'type',
    header: '메시지 유형',
    width: '160px',
    render: (row: ICampaignDto) => (
      <Badge variant={TYPE_VARIANT[row.type] ?? 'default'}>{row.type}</Badge>
    ),
  },
  { key: 'sendDate', header: '발송 일시', width: '160px' },
  {
    key: 'status',
    header: '상태',
    width: '100px',
    render: (row: ICampaignDto) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>
    ),
  },
  { key: 'targetCount', header: '대상 수', width: '80px' },
  { key: 'successCount', header: '성공 수', width: '80px' },
  { key: 'failCount', header: '실패 수', width: '80px' },
];

type TabType = '캠페인 현황' | '캠페인 만들기';

export function CrmManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('캠페인 현황');
  const { filters, handleFilterChange, handleReset } = useFilterState(FILTERS);
  const { data: campaigns = [] } = useCampaignList();

  const sentCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.SENT).length, [campaigns]);
  const reservedCount = useMemo(() => campaigns.filter((c) => c.status === CAMPAIGN_STATUS.RESERVED).length, [campaigns]);
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
            <StatCard title="발송 예정" value={reservedCount} icon={<Clock size={18} />} />
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
