import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { cn } from '@/lib/utils';

interface IPageStat {
  [key: string]: unknown;
  no: number;
  date: string;
  pageUrl: string;
  visits: number;
  newVisits: number;
  returnVisits: number;
  avgStayTime: string;
  deviceShare: string;
}

const MOCK_PAGE_DATA: IPageStat[] = [
  { no: 2, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/', visits: 1, newVisits: 0, returnVisits: 1, avgStayTime: '00:00:00', deviceShare: 'PC : 0% / 모바일 : 0% / 태블릿 : 0% / 기타 : 100%' },
  { no: 1, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/product/...', visits: 1, newVisits: 1, returnVisits: 0, avgStayTime: '00:00:06', deviceShare: 'PC : 0% / 모바일 : 100% / 태블릿 : 0% / 기타 : 0%' },
];

const COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'date', header: '날짜', width: '100px' },
  { key: 'pageUrl', header: '페이지 URL' },
  { key: 'visits', header: '방문 수 ↕', sortable: true, width: '80px' },
  { key: 'newVisits', header: '신규 방문 ↕', sortable: true, width: '90px' },
  { key: 'returnVisits', header: '재방문 ↕', sortable: true, width: '80px' },
  { key: 'avgStayTime', header: '평균 체류 시간 ↕', sortable: true, width: '130px' },
  { key: 'deviceShare', header: '디바이스 점유율', width: '300px' },
];

const PERIOD_TABS = ['어제', '일주일', '이번달'];

export function CustomerStatisticsPage() {
  const [activePeriod, setActivePeriod] = useState('일주일');

  return (
    <div className="space-y-6">
      <PageHeader title="고객 유입 통계" description="통계: 매일 오전 4시 기준으로 집계" />

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
        <span className="ml-2 text-sm text-muted-foreground">📅 2026-03-04 ~ 2026-03-10</span>
      </div>

      {/* 사이트 통계 */}
      <h3 className="mb-3 text-sm font-semibold">사이트 통계</h3>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard
          title="총 방문 수"
          value="2"
          change={{ value: '50% 2026.02.25 ~ 2026.03.03 대비', isPositive: false }}
        />
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-sm text-muted-foreground">디바이스 점유율</p>
          <p className="mt-1 text-xl font-bold">모바일, 기타 우세</p>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span>PC (0%)</span>
            <span>모바일 (50%)</span>
            <span>태블릿 (0%)</span>
            <span>기타 (50%)</span>
          </div>
          <div className="mt-3 flex h-24 items-center justify-center rounded-lg bg-gray-50 text-xs text-muted-foreground">
            🍩 도넛 차트
          </div>
        </div>
        <StatCard
          title="평균 체류시간 ⓘ"
          value="00:00:03"
          change={{ value: '78.6% 2026.02.25 ~ 2026.03.03 대비', isPositive: false }}
          description="최소 00:00:00 최대 00:00:06"
        />
      </div>

      {/* 채팅상담 통계 */}
      <div className="mb-6 rounded-xl border border-border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold">채팅상담 통계</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">카카오톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-1 text-xl font-bold text-blue-600">2/0</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">네이버톡톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-1 text-xl font-bold">-</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">해피톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-1 text-xl font-bold">-</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium">일자별 상담건수</p>
            <div className="flex gap-1">
              {['일별', '주별', '월별'].map((tab) => (
                <button key={tab} className="rounded border border-border px-2 py-0.5 text-xs hover:bg-muted">
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 text-xs text-muted-foreground">
            📊 일자별 상담건수 차트
          </div>
        </div>
      </div>

      {/* 헤이보드 통계 */}
      <div className="mb-6 rounded-xl border border-border bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold">헤이보드 통계</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">평균 클릭률</p>
            <p className="mt-1 text-xl font-bold">0% (0건)</p>
            <p className="mt-1 text-xs text-muted-foreground">비교할 데이터가 없습니다</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">평균 체류 시간 ⓘ</p>
            <p className="mt-1 text-xl font-bold">0초</p>
            <p className="mt-1 text-xs text-muted-foreground">0초 2026.02.25 ~ 2026.03.03 대비</p>
          </div>
        </div>
      </div>

      {/* 페이지별 상세 데이터 */}
      <h3 className="mb-3 text-sm font-semibold">페이지별 상세 데이터</h3>
      <DataTable
        columns={COLUMNS}
        data={MOCK_PAGE_DATA}
        pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
      />
    </div>
  );
}
