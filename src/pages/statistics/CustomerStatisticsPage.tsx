import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ExcelDownloadButton } from '@/components/common/ExcelDownloadButton';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

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
  { no: 2, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/', visits: 1, newVisits: 0, returnVisits: 1, avgStayTime: '00:00:00', deviceShare: 'PC: 0% / 모바일: 0% / 태블릿: 0% / 기타: 100%' },
  { no: 1, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/product/...', visits: 1, newVisits: 1, returnVisits: 0, avgStayTime: '00:00:06', deviceShare: 'PC: 0% / 모바일: 100% / 태블릿: 0% / 기타: 0%' },
];

const PAGE_COLUMNS = [
  { key: 'no', header: 'NO', width: '50px' },
  { key: 'date', header: '날짜', width: '100px' },
  { key: 'pageUrl', header: '페이지 URL' },
  { key: 'visits', header: '방문 수 ↕', sortable: true, width: '80px' },
  { key: 'newVisits', header: '신규 방문 ↕', sortable: true, width: '90px' },
  { key: 'returnVisits', header: '재방문 ↕', sortable: true, width: '80px' },
  { key: 'avgStayTime', header: '평균 체류 시간 ↕', sortable: true, width: '120px' },
  { key: 'deviceShare', header: '디바이스 점유율', width: '250px' },
];

const PERIOD_TABS = ['어제', '일주일', '이번달'];
const CHART_TABS = ['일별', '주별', '월별'];

export function CustomerStatisticsPage() {
  const [activePeriod, setActivePeriod] = useState('일주일');
  const [chatChartTab, setChatChartTab] = useState('일별');
  const [pageChartTab, setPageChartTab] = useState('일별');
  const [pageSearch, setPageSearch] = useState('');

  const dateRange = activePeriod === '어제' ? '2026-03-19' : activePeriod === '일주일' ? '2026-03-13 ~ 2026-03-19' : '2026-03-01 ~ 2026-03-19';
  const prevRange = '2026.03.06 ~ 2026.03.12';

  return (
    <div className="space-y-6">
      <PageHeader
        title="고객 유입 통계"
        description={`통계: 매일 오전 4시 기준으로 집계 (예: 6/17 = 6/17 04시 ~ 6/18 04시)`}
      />

      {/* 기간 탭 */}
      <div className="flex items-center gap-2">
        {PERIOD_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePeriod(tab)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              activePeriod === tab ? 'border-primary bg-primary/8 text-primary font-medium' : 'border-border hover:bg-muted'
            )}
          >
            {tab}
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">📅 {dateRange}</span>
      </div>

      {/* ── 사이트 통계 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">사이트 통계</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* 총 방문 수 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-muted-foreground">총 방문 수</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-bold">0</p>
              <span className="text-xs text-red-500">↓ 100% {prevRange} 대비</span>
            </div>
            <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
              <span>● 신규 방문자 (0%)</span>
              <span>● 재방문자 (0%)</span>
            </div>
            <div className="mt-4 flex h-20 items-center justify-center rounded-lg bg-gray-50 text-xs text-muted-foreground">!</div>
          </div>

          {/* 디바이스 점유율 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-muted-foreground">디바이스 점유율</p>
            <p className="mt-1 text-xl font-bold">-</p>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span>● PC (0%)</span>
              <span>● 모바일 (0%)</span>
              <span>● 태블릿 (0%)</span>
              <span>● 기타 (0%)</span>
            </div>
            <div className="mt-4 flex h-20 items-center justify-center rounded-lg bg-gray-50 text-xs text-muted-foreground">!</div>
          </div>

          {/* 평균 체류시간 */}
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-muted-foreground">평균 체류시간 ⓘ</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-bold">00:00:00</p>
              <span className="text-xs text-red-500">↓ 100% {prevRange} 대비</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">최소 00:00:00 최대 00:00:00</p>
            <div className="mt-3 flex h-20 items-center justify-center rounded-lg bg-gray-50">
              <div className="h-full w-full rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-50" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 채팅상담 통계 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">채팅상담 통계</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs text-muted-foreground">카카오톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs text-muted-foreground">네이버톡톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-xs text-muted-foreground">해피톡 채팅상담 노출/클릭 수 ⓘ</p>
            <p className="mt-2 text-2xl font-bold">-</p>
          </div>
        </div>

        {/* 일자별 상담건수 차트 */}
        <div className="mt-4 rounded-xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">일자별 상담건수</p>
            <div className="flex gap-1">
              {CHART_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChatChartTab(tab)}
                  className={cn('rounded-lg border px-2.5 py-1 text-xs transition-colors', chatChartTab === tab ? 'border-primary bg-primary/8 text-primary' : 'border-border hover:bg-muted')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 flex gap-4 text-xs text-muted-foreground">
            <span>● 카카오톡</span>
            <span>● 네이버톡톡</span>
            <span>● 해피톡</span>
          </div>
          <ChartPlaceholder height={160} labels={['03.13', '03.14', '03.15', '03.16', '03.17', '03.18', '03.19']} />
        </div>
      </div>

      {/* ── 헤이보드 통계 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">헤이보드 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm font-semibold">평균 클릭률</p>
            <p className="mt-2 text-3xl font-bold">0% <span className="text-sm font-normal text-muted-foreground">(0건)</span></p>
            <p className="mt-1 text-xs text-muted-foreground">(비교할 데이터가 없습니다.)</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm font-semibold">평균 체류 시간 ⓘ</p>
            <p className="mt-2 text-3xl font-bold">0초</p>
            <p className="mt-1 text-xs text-muted-foreground">0초 {prevRange} 대비</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="mb-3 text-sm font-semibold">헤이버튼 클릭률 TOP5 ⓘ</p>
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-xs font-bold', rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-muted-foreground')}>TOP {rank}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                </div>
                <span className="text-sm text-muted-foreground">-</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <p className="mb-3 text-sm font-semibold">카드 클릭률 TOP5 ⓘ</p>
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-xs font-bold', rank <= 3 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-muted-foreground')}>TOP {rank}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                </div>
                <span className="text-sm text-muted-foreground">-</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 페이지 통계 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">페이지 통계</h3>

        {/* 페이지 방문 추이 차트 */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">페이지 방문 추이</p>
            <div className="flex gap-1">
              {CHART_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPageChartTab(tab)}
                  className={cn('rounded-lg border px-2.5 py-1 text-xs transition-colors', pageChartTab === tab ? 'border-primary bg-primary/8 text-primary' : 'border-border hover:bg-muted')}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 flex gap-4 text-xs text-muted-foreground">
            <span>■ 신규 방문</span>
            <span>● 재방문</span>
            <span>— 평균 체류 시간</span>
          </div>
          <ChartPlaceholder height={200} labels={['03.13', '03.14', '03.15', '03.16', '03.17', '03.18', '03.19']} rightLabels={['0:04', '0:03', '0:02', '0:01', '0:00']} />
        </div>
      </div>

      {/* ── 페이지별 상세 데이터 ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">페이지별 상세 데이터</h3>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-white">
              <Search size={14} className="ml-3 text-muted-foreground" />
              <input
                type="text"
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                placeholder="페이지 URL 검색"
                className="border-none bg-transparent px-3 py-2 text-sm outline-none"
              />
            </div>
            <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white">검색</button>
          </div>
          <ExcelDownloadButton />
        </div>
        <DataTable
          columns={PAGE_COLUMNS}
          data={MOCK_PAGE_DATA}
          pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
        />
      </div>
    </div>
  );
}

/** 차트 플레이스홀더 */
function ChartPlaceholder({ height, labels, rightLabels }: { height: number; labels: string[]; rightLabels?: string[] }) {
  const W = 700;
  const H = height;
  const padL = 30;
  const padR = rightLabels ? 40 : 10;
  const padB = 24;
  const padT = 10;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const rows = rightLabels ? rightLabels.length : 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {/* 그리드 */}
      {Array.from({ length: rows }, (_, i) => {
        const y = padT + (i / (rows - 1)) * innerH;
        return <line key={i} x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f0f0f0" strokeWidth="1" />;
      })}
      {/* Y축 라벨 (좌) */}
      {Array.from({ length: rows }, (_, i) => {
        const y = padT + (i / (rows - 1)) * innerH;
        const val = rows - 1 - i;
        return <text key={i} x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{val}</text>;
      })}
      {/* Y축 라벨 (우) */}
      {rightLabels?.map((label, i) => {
        const y = padT + (i / (rightLabels.length - 1)) * innerH;
        return <text key={i} x={W - padR + 6} y={y + 4} textAnchor="start" fontSize="10" fill="#9ca3af">{label}</text>;
      })}
      {/* X축 라벨 */}
      {labels.map((label, i) => {
        const x = padL + (i / (labels.length - 1)) * innerW;
        return <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{label}</text>;
      })}
    </svg>
  );
}
