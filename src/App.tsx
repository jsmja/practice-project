import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/common/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomerListPage } from '@/pages/customer/CustomerListPage';
import { CrmManagementPage } from '@/pages/marketing/CrmManagementPage';
import { MarketingStatusPage } from '@/pages/marketing/MarketingStatusPage';
import { EventBannerManagementPage } from '@/pages/marketing/EventBannerManagementPage';
import { ServiceIntegrationPage } from '@/pages/service/ServiceIntegrationPage';
import { CrmStatisticsPage } from '@/pages/statistics/CrmStatisticsPage';
import { CustomerStatisticsPage } from '@/pages/statistics/CustomerStatisticsPage';
import { MarketingStatisticsPage } from '@/pages/statistics/MarketingStatisticsPage';
import { PointManagementPage } from '@/pages/settings/PointManagementPage';
import { SubscriptionPage } from '@/pages/payment/SubscriptionPage';
import { ServiceApplyPage } from '@/pages/payment/ServiceApplyPage';
import { PaymentHistoryPage } from '@/pages/payment/PaymentHistoryPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/marketing/status" element={<MarketingStatusPage />} />
            <Route path="/marketing/event-banners" element={<EventBannerManagementPage />} />
            <Route path="/marketing/crm" element={<CrmManagementPage />} />
            <Route path="/service-integration" element={<ServiceIntegrationPage />} />
            <Route path="/statistics/customers" element={<CustomerStatisticsPage />} />
            <Route path="/statistics/marketing" element={<MarketingStatisticsPage />} />
            <Route path="/statistics/crm" element={<CrmStatisticsPage />} />
            <Route path="/settings/points" element={<PointManagementPage />} />
            <Route path="/payment/subscription" element={<SubscriptionPage />} />
            <Route path="/payment/apply" element={<ServiceApplyPage />} />
            <Route path="/payment/history" element={<PaymentHistoryPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
