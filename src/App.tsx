import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/common/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomerListPage } from '@/pages/customer/CustomerListPage';
import { CrmCampaignListPage } from '@/pages/marketing/CrmCampaignListPage';
import { CrmCampaignCreatePage } from '@/pages/marketing/CrmCampaignCreatePage';
import { MarketingStatusPage } from '@/pages/marketing/MarketingStatusPage';
import { ServiceIntegrationPage } from '@/pages/service/ServiceIntegrationPage';
import { CrmStatisticsPage } from '@/pages/statistics/CrmStatisticsPage';
import { CustomerStatisticsPage } from '@/pages/statistics/CustomerStatisticsPage';
import { MarketingStatisticsPage } from '@/pages/statistics/MarketingStatisticsPage';
import { PointManagementPage } from '@/pages/settings/PointManagementPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/marketing/status" element={<MarketingStatusPage />} />
            <Route path="/marketing/crm" element={<CrmCampaignListPage />} />
            <Route path="/marketing/crm/create" element={<CrmCampaignCreatePage />} />
            <Route path="/service-integration" element={<ServiceIntegrationPage />} />
            <Route path="/statistics/customers" element={<CustomerStatisticsPage />} />
            <Route path="/statistics/marketing" element={<MarketingStatisticsPage />} />
            <Route path="/statistics/crm" element={<CrmStatisticsPage />} />
            <Route path="/settings/points" element={<PointManagementPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
