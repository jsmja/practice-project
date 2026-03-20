export interface IHeyboardCard {
  name: string;
  type: string;
  isActive: boolean;
}

export interface IHeyboardStatus {
  isActive: boolean;
  boardName: string;
  buttonCount: number;
  cards: IHeyboardCard[];
}

export const MOCK_HEYBOARD_STATUS: IHeyboardStatus = {
  isActive: true,
  boardName: '메인 헤이보드',
  buttonCount: 2,
  cards: [
    { name: '고객지원 안내', type: '고객지원', isActive: true },
    { name: '인스타그램 피드', type: '소셜미디어', isActive: true },
    { name: '브랜드 소개', type: '브랜드', isActive: true },
    { name: '이벤트 배너', type: '프로모션', isActive: true },
    { name: '공지사항', type: '안내', isActive: false },
  ],
};

export interface IHeyboardPerformance {
  clickUsers: number;
  avgStayTime: string;
  minStayTime: string;
  maxStayTime: string;
  cardTop3: { rank: number; cardName: string; cardType: string; clickRate: number; clicks: number }[];
}

export const MOCK_HEYBOARD_PERFORMANCE: IHeyboardPerformance = {
  clickUsers: 87,
  avgStayTime: '01:23:45',
  minStayTime: '00:02:10',
  maxStayTime: '05:42:30',
  cardTop3: [
    { rank: 1, cardName: '고객지원 안내', cardType: '고객지원카드', clickRate: 12.5, clicks: 45 },
    { rank: 2, cardName: '이벤트 배너', cardType: '프로모션카드', clickRate: 8.3, clicks: 30 },
    { rank: 3, cardName: '브랜드 소개', cardType: '기본카드', clickRate: 3.6, clicks: 13 },
  ],
};

export interface IMarketingSummary {
  activeBanners: number;
  activeCrm: number;
  scheduledCampaigns: number;
  consentConversions: number;
  consentPotential: number;
}

export const MOCK_MARKETING_SUMMARY: IMarketingSummary = {
  activeBanners: 5,
  activeCrm: 3,
  scheduledCampaigns: 1,
  consentConversions: 42,
  consentPotential: 3842,
};

export interface IMarketingTopItem {
  rank: number;
  name: string;
  clickRate: number;
  clicks: number;
  exposures: number;
}

export const MOCK_MARKETING_TOP3: IMarketingTopItem[] = [
  { rank: 1, name: '봄 신메뉴 출시 이벤트', clickRate: 8.8, clicks: 282, exposures: 3200 },
  { rank: 2, name: '3월 재방문 고객 할인', clickRate: 12.1, clicks: 224, exposures: 1850 },
  { rank: 3, name: 'VIP 특별 혜택 안내', clickRate: 15.3, clicks: 49, exposures: 320 },
];

export interface ISiteAnalysis {
  newVisitors: number;
  returningVisitors: number;
  deviceBreakdown: { device: string; percentage: number; color: string }[];
  pageViewTop3: { rank: number; url: string; views: number }[];
}

export const MOCK_SITE_ANALYSIS: ISiteAnalysis = {
  newVisitors: 743,
  returningVisitors: 500,
  deviceBreakdown: [
    { device: '모바일', percentage: 62.4, color: 'bg-orange-400' },
    { device: 'PC', percentage: 28.1, color: 'bg-pink-400' },
    { device: '태블릿', percentage: 7.2, color: 'bg-blue-400' },
    { device: '기타', percentage: 2.3, color: 'bg-gray-300' },
  ],
  pageViewTop3: [
    { rank: 1, url: 'https://shop.cafe24.com/', views: 1842 },
    { rank: 2, url: 'https://shop.cafe24.com/product/봄-신메뉴', views: 956 },
    { rank: 3, url: 'https://shop.cafe24.com/event/march', views: 412 },
  ],
};

export interface IActiveCampaign {
  id: number;
  name: string;
  status: string;
  sent: number;
  ctr: number;
  conversionRate: number;
  startDate: string;
}

export interface IOperationalAlert {
  id: number;
  type: 'warning' | 'info' | 'destructive';
  severity: number; // 높을수록 위험 (서비스중단=3, 데이터이상=2, 개선제안=1)
  message: string;
  action: string;
  actionPath: string;
}

export interface IRecommendedAction {
  id: number;
  title: string;
  description: string;
  impact: string;
  action: string;
  actionPath: string;
}

export interface ISiteTrafficKpi {
  visitors: number;
  visitorsChange: number;
  pageViews: number;
  pageViewsChange: number;
  avgStayTime: string;
  avgStayTimeChange: number;
  bounceRate: number;
  bounceRateChange: number;
}

export const MOCK_SITE_TRAFFIC_KPI: ISiteTrafficKpi = {
  visitors: 1243,
  visitorsChange: 12.5,
  pageViews: 4820,
  pageViewsChange: 8.3,
  avgStayTime: '2분 34초',
  avgStayTimeChange: 5.1,
  bounceRate: 42.3,
  bounceRateChange: -1.8,
};

export interface IMarketingConsent {
  consentCount: number;
  consentChange: number;
  nonConsentCount: number;
  totalCustomers: number;
}

export const MOCK_MARKETING_CONSENT: IMarketingConsent = {
  consentCount: 1254,
  consentChange: 3.2,
  nonConsentCount: 3842,
  totalCustomers: 5096,
};

export interface IChatConsultQuota {
  used: number;
  total: number;
  resetCycle: string;
}

export const MOCK_CHAT_CONSULT_QUOTA: IChatConsultQuota = {
  used: 0,
  total: 100,
  resetCycle: '1일',
};

export interface IAccountBalance {
  points: number;
  lowThreshold: number;
}

export const MOCK_ACCOUNT_BALANCE: IAccountBalance = {
  points: 4820,
  lowThreshold: 5000,
};

export const MOCK_ACTIVE_CAMPAIGNS: IActiveCampaign[] = [
  { id: 3, name: 'VIP 고객 특별 혜택 안내', status: '진행중', sent: 320, ctr: 15.3, conversionRate: 7.8, startDate: '2026.03.05' },
  { id: 2, name: '3월 재방문 고객 할인 쿠폰', status: '진행중', sent: 1850, ctr: 12.1, conversionRate: 5.1, startDate: '2026.03.08' },
  { id: 1, name: '봄 신메뉴 출시 이벤트 안내', status: '진행중', sent: 3200, ctr: 8.8, conversionRate: 3.2, startDate: '2026.03.10' },
];

export const MOCK_ALERTS: IOperationalAlert[] = [
  { id: 5, type: 'destructive', severity: 3, message: '인스타그램 연동이 만료되었습니다. 재연결이 필요합니다.', action: '서비스 연결', actionPath: '/service-integration' },
  { id: 1, type: 'warning', severity: 3, message: '잔여 포인트가 5,000P 이하입니다. 충전이 필요합니다.', action: '충전하기', actionPath: '/settings/points' },
  { id: 3, type: 'destructive', severity: 2, message: '봄 신메뉴 캠페인 클릭률이 전주 대비 15% 하락했습니다.', action: '성과 확인하기', actionPath: '/statistics/crm' },
  { id: 4, type: 'warning', severity: 2, message: '마케팅 수신 동의 고객이 50명 이하입니다. 수신 동의 유도 캠페인을 설정하세요.', action: '배너 관리', actionPath: '/marketing/event-banners' },
  { id: 2, type: 'info', severity: 1, message: '신규 캠페인을 시작하여 전환율을 높여보세요.', action: '캠페인 만들기', actionPath: '/marketing/crm' },
];

export const MOCK_RECOMMENDED_ACTIONS: IRecommendedAction[] = [
  {
    id: 1,
    title: '메시지 클릭률이 평균보다 낮습니다',
    description: '현재 클릭률 8.8%는 업종 평균 12%보다 낮습니다. 메시지 문구와 CTA 버튼을 변경하면 클릭률을 개선할 수 있습니다.',
    impact: '예상 클릭률 +3.2%p 개선',
    action: '메시지 문구 수정',
    actionPath: '/marketing/crm',
  },
  {
    id: 2,
    title: '신규 방문자 전용 캠페인이 없습니다',
    description: '지난 7일간 신규 방문자 2,340명 중 캠페인 노출은 0건입니다. 신규 방문자 대상 웰컴 쿠폰 캠페인을 추가하면 전환율이 증가할 수 있습니다.',
    impact: '예상 전환율 +1.8%p 증가',
    action: '캠페인 만들기',
    actionPath: '/marketing/crm',
  },
  {
    id: 3,
    title: '장바구니 이탈 고객을 놓치고 있습니다',
    description: '최근 7일간 장바구니 이탈 고객 187명에게 리마인드 메시지를 보내지 않았습니다. 장바구니 리마인드 캠페인은 평균 15% 구매 전환을 기록합니다.',
    impact: '예상 추가 매출 약 28건',
    action: '리마인드 캠페인 설정',
    actionPath: '/marketing/crm',
  },
];
