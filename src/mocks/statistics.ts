import type { ICrmStatDto } from '@/models/interface/dto';
import type { IPageStatDto } from '@/models/interface/dto';

export const MOCK_CRM_STATS: ICrmStatDto[] = [
  { no: 1, campaignName: '12월 크리스마스 할인 안내', type: '친구톡', sendDate: '2025.12.20', targetCount: 150, successCount: 142, failCount: 8, cost: 270 },
  { no: 2, campaignName: '주문 확인 알림', type: '알림톡', sendDate: '2025.12.18', targetCount: 45, successCount: 45, failCount: 0, cost: 32 },
  { no: 3, campaignName: '배송 지연 안내', type: '알림톡', sendDate: '2025.12.15', targetCount: 12, successCount: 11, failCount: 1, cost: 8 },
];

export const MOCK_PAGE_STATS: IPageStatDto[] = [
  { no: 2, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/', visits: 1, newVisits: 0, returnVisits: 1, avgStayTime: '00:00:00', deviceShare: 'PC : 0% / 모바일 : 0% / 태블릿 : 0% / 기타 : 100%' },
  { no: 1, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/product/...', visits: 1, newVisits: 1, returnVisits: 0, avgStayTime: '00:00:06', deviceShare: 'PC : 0% / 모바일 : 100% / 태블릿 : 0% / 기타 : 0%' },
];
