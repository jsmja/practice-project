import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { useCrmSummary } from '@/hooks/client/statistics/useStatisticsClient';
import { MOCK_ALERTS } from '@/mocks/dashboard';

import { CriticalAlertsBanner } from '@/components/pages/dashboard/CriticalAlertsBanner';
import { ServiceSummarySection } from '@/components/pages/dashboard/ServiceSummarySection';
import { ChannelStatusBar } from '@/components/pages/dashboard/ChannelStatusBar';
import { HeyboardPerformanceSection } from '@/components/pages/dashboard/HeyboardPerformanceSection';
import { BannerStatisticsSection } from '@/components/pages/dashboard/BannerStatisticsSection';
import { MarketingCustomerSection } from '@/components/pages/dashboard/MarketingCustomerSection';
import { CrmFunnelSection } from '@/components/pages/dashboard/CrmFunnelSection';
import { ActiveCampaignsSection } from '@/components/pages/dashboard/ActiveCampaignsSection';
import { AiRecommendationsSection } from '@/components/pages/dashboard/AiRecommendationsSection';
import { SiteOverviewSection } from '@/components/pages/dashboard/SiteOverviewSection';
import { OperationalAlertsSection } from '@/components/pages/dashboard/OperationalAlertsSection';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary } = useCrmSummary();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="대시보드" description="비즈니스 성과와 마케팅 현황을 한눈에 확인하세요." />

      {/* ━━━ Zone A: 긴급 알림 & 마케팅 성과 (핵심 서비스) ━━━ */}
      <section className="flex flex-col gap-6">
        <CriticalAlertsBanner alerts={MOCK_ALERTS} />
        {summary && (
          <CrmFunnelSection
            summary={summary}
            onNavigateDetail={() => navigate('/statistics/crm')}
          />
        )}
        <ActiveCampaignsSection />
        <div className="grid grid-cols-2 gap-6">
          <BannerStatisticsSection />
          <MarketingCustomerSection />
        </div>
        <AiRecommendationsSection />
      </section>

      {/* ━━━ Zone B: 사이트 현황 ━━━ */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-indigo-400" />
          <h2 className="text-sm font-medium text-muted-foreground">사이트 현황</h2>
        </div>
        <SiteOverviewSection />
      </section>

      {/* ━━━ Zone C: 서비스 도구 현황 ━━━ */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-indigo-400" />
          <h2 className="text-sm font-medium text-muted-foreground">서비스 현황</h2>
        </div>
        <ServiceSummarySection />
        <HeyboardPerformanceSection />
      </section>

      {/* ━━━ Zone D: 시스템 상태 ━━━ */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-indigo-400" />
          <h2 className="text-sm font-medium text-muted-foreground">시스템 상태</h2>
        </div>
        <ChannelStatusBar />
        <OperationalAlertsSection />
      </section>
    </div>
  );
}
