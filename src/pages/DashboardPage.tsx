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
    <div className="flex flex-col gap-6">
      <PageHeader title="대시보드" description="서비스 상태와 핵심 성과를 한눈에 확인하세요." />

      {/* ① 긴급 알림 — 서비스중단·데이터이상 */}
      <CriticalAlertsBanner alerts={MOCK_ALERTS} />

      {/* ② 서비스 이용 현황 — 헤이보드 / 채팅상담 / 마케팅 */}
      <ServiceSummarySection />

      {/* ③ 서비스 연동 현황 */}
      <ChannelStatusBar />

      {/* ④ 헤이보드 성과 — 클릭 수, 체류시간, 카드 TOP3 */}
      <HeyboardPerformanceSection />

      {/* ⑤ 배너 관리 통계 + 마케팅 고객 현황 (좌우 배치) */}
      <div className="grid grid-cols-2 gap-6">
        <BannerStatisticsSection />
        <MarketingCustomerSection />
      </div>

      {/* ⑥ 메시지 발송 통계 */}
      {summary && (
        <CrmFunnelSection
          summary={summary}
          onNavigateDetail={() => navigate('/statistics/crm')}
        />
      )}

      {/* ⑦ 메시지 캠페인 — 성과 태그 + Quick Action */}
      <ActiveCampaignsSection />

      {/* ⑧ 추천 액션 */}
      <AiRecommendationsSection />

      {/* ⑨ 사이트 현황 — 트래픽 + 방문자 분석 + 디바이스 + 페이지뷰 TOP3 */}
      <SiteOverviewSection />

      {/* ⑩ 운영 알림 (개선 제안 레벨) */}
      <OperationalAlertsSection />
    </div>
  );
}
