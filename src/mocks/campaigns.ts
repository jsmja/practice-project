import type { ICampaignDto } from '@/models/interface/dto';

export const MOCK_CAMPAIGNS: ICampaignDto[] = [
  { no: 1, name: '봄 신메뉴 출시 이벤트', type: '커스텀 캠페인', sendDate: '2026.03.10 10:00', status: '완료', targetCount: 3200, successCount: 3136, failCount: 64 },
  { no: 2, name: '3월 재방문 고객 할인 쿠폰', type: '웰컴백 캠페인', sendDate: '2026.03.08 14:30', status: '완료', targetCount: 1850, successCount: 1813, failCount: 37 },
  { no: 3, name: 'VIP 고객 특별 혜택 안내', type: 'VIP 전용', sendDate: '2026.03.20 09:00', status: '대기', targetCount: 320, successCount: 0, failCount: 0 },
  { no: 4, name: '신규 회원 환영 메시지', type: '신규회원 이탈방지', sendDate: '2026.03.04 11:00', status: '완료', targetCount: 120, successCount: 118, failCount: 2 },
  { no: 5, name: '봄 컬렉션 재구매 유도', type: '재구매 유도', sendDate: '2026.03.15 10:00', status: '대기', targetCount: 500, successCount: 0, failCount: 0 },
  { no: 6, name: '구매 감사 메시지', type: '구매 감사', sendDate: '2026.03.03 16:00', status: '완료', targetCount: 45, successCount: 45, failCount: 0 },
  { no: 7, name: '생일 고객 축하 쿠폰', type: '생일 축하', sendDate: '2026.03.12 09:00', status: '발송중', targetCount: 80, successCount: 52, failCount: 0 },
];
