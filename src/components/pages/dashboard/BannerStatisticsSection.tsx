import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_BANNERS } from '@/mocks/banners';
import { Image, Eye, MousePointerClick, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BannerStatisticsSection() {
  const navigate = useNavigate();

  const activeBanners = MOCK_BANNERS.filter((b) => b.status === '진행중');
  const totalImpressions = activeBanners.reduce((sum, b) => sum + b.impressions, 0);
  const totalClicks = activeBanners.reduce((sum, b) => sum + b.clicks, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  // 클릭률 높은 순 TOP 3
  const top3 = [...activeBanners]
    .sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr))
    .slice(0, 3);

  return (
    <SectionCard
      title="마케팅 팝업 통계"
      titleRight={
        <button
          onClick={() => navigate('/marketing/event-banners')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          상세보기 <ArrowRight size={14} />
        </button>
      }
    >
      {/* KPI 요약 */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Image size={14} className="text-violet-500" />
            <span className="text-xs text-muted-foreground">진행중 배너</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold">{activeBanners.length}건</p>
        </div>
        <div className="rounded-xl border border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-blue-500" />
            <span className="text-xs text-muted-foreground">총 노출 수</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <MousePointerClick size={14} className="text-indigo-500" />
            <span className="text-xs text-muted-foreground">평균 CTR</span>
          </div>
          <p className="mt-1.5 text-2xl font-bold text-indigo-600">{avgCtr}%</p>
        </div>
      </div>

      {/* 배너 TOP 3 */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">클릭률 TOP 3</p>
        <div className="flex flex-col gap-2.5">
          {top3.map((banner, idx) => (
            <div
              key={banner.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3"
            >
              <span
                className={cn(
                  'inline-flex h-6 w-12 items-center justify-center rounded-md text-xs font-semibold text-white',
                  idx === 0 ? 'bg-violet-500' : idx === 1 ? 'bg-violet-400' : 'bg-violet-300',
                )}
              >
                TOP {idx + 1}
              </span>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-foreground">{banner.title}</p>
                <p className="text-xs text-muted-foreground">
                  노출 {banner.impressions.toLocaleString()} · 클릭 {banner.clicks.toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-semibold text-violet-600">{banner.ctr}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
