import type { ICrmStatDto, IPageStatDto, ICrmSummaryDto } from '@/models/interface/dto';

export const MOCK_CRM_SUMMARY: ICrmSummaryDto = {
  period: '2026-03-04 ~ 2026-03-10',
  totalAttempt: 128450,
  totalSent: 125890,
  sendRate: 98.0,
  totalOpen: 86230,
  openRate: 68.5,
  totalClick: 11036,
  clickRate: 8.8,
  totalConversion: 353,
  conversionRate: 0.28,
  totalClickRate: 10.5,
  totalCouponIssued: 252,
  totalCouponUsed: 133,
  couponUsageRate: 52.8,
};

export const MOCK_CRM_STATS: ICrmStatDto[] = [
  { no: 1, campaignName: '봄 신메뉴 출시 이벤트 안내', type: '커스텀 캠페인', sendFrequency: '반복', sendRound: 3, totalRounds: 5, sendDate: '2026.03.10', targetCount: 3200, successCount: 3136, failCount: 64, cost: 470 },
  { no: 2, campaignName: '3월 재방문 고객 할인 쿠폰', type: '웰컴백 캠페인', sendFrequency: '반복', sendRound: 2, totalRounds: 4, sendDate: '2026.03.08', targetCount: 1850, successCount: 1813, failCount: 37, cost: 272 },
  { no: 3, campaignName: '구매 감사 메시지', type: '구매 감사', sendFrequency: '1회', sendRound: 1, totalRounds: 1, sendDate: '2026.03.07', targetCount: 45, successCount: 45, failCount: 0, cost: 32 },
  { no: 4, campaignName: 'VIP 고객 특별 혜택 안내', type: 'VIP 전용', sendFrequency: '1회', sendRound: 1, totalRounds: 1, sendDate: '2026.03.05', targetCount: 320, successCount: 314, failCount: 6, cost: 47 },
  { no: 5, campaignName: '신규 회원 이탈방지 30일', type: '신규회원 이탈방지', sendFrequency: '반복', sendRound: 1, totalRounds: 3, sendDate: '2026.03.04', targetCount: 120, successCount: 118, failCount: 2, cost: 35 },
  { no: 6, campaignName: '생일 축하 쿠폰 발송', type: '생일 축하', sendFrequency: '반복', sendRound: 12, totalRounds: 12, sendDate: '2026.03.03', targetCount: 80, successCount: 78, failCount: 2, cost: 12 },
];

export const MOCK_COUPON_RANKING = [
  { rank: 1, campaignName: '재구매 유도 쿠폰 캠페인', issued: 45, used: 28, usageRate: 62.2, vsAvg: '+18.5%', positive: true },
  { rank: 2, campaignName: 'VIP 고객 특별 혜택', issued: 30, used: 17, usageRate: 56.7, vsAvg: '+8.2%', positive: true },
  { rank: 3, campaignName: '시즌 할인 프로모션', issued: 120, used: 65, usageRate: 54.2, vsAvg: '-3.1%', positive: false },
  { rank: 4, campaignName: '신규회원 이탈방지 30일_테스트', issued: 2, used: 1, usageRate: 50.0, vsAvg: '-7.3%', positive: false },
  { rank: 5, campaignName: '신상품 출시 알림', issued: 55, used: 22, usageRate: 40.0, vsAvg: '-12.4%', positive: false },
];

export const MOCK_PAGE_STATS: IPageStatDto[] = [
  { no: 2, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/', visits: 1, newVisits: 0, returnVisits: 1, avgStayTime: '00:00:00', deviceShare: 'PC : 0% / 모바일 : 0% / 태블릿 : 0% / 기타 : 100%' },
  { no: 1, date: '2026.03.10', pageUrl: 'https://ffqdqd001.cafe24.com/product/...', visits: 1, newVisits: 1, returnVisits: 0, avgStayTime: '00:00:06', deviceShare: 'PC : 0% / 모바일 : 100% / 태블릿 : 0% / 기타 : 0%' },
];
