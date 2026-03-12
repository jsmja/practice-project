import type { ICampaignDto } from '@/models/interface/dto';

export const MOCK_CAMPAIGNS: ICampaignDto[] = [
  { no: 1, name: '12월 크리스마스 할인 안내', type: '친구톡', sendDate: '2025.12.20 10:00', status: '발송완료', targetCount: 150, successCount: 142, failCount: 8 },
  { no: 2, name: '주문 확인 알림', type: '알림톡', sendDate: '2025.12.18 14:30', status: '발송완료', targetCount: 45, successCount: 45, failCount: 0 },
  { no: 3, name: '신년 이벤트 안내', type: '브랜드메시지', sendDate: '2026.01.01 09:00', status: '예약중', targetCount: 200, successCount: 0, failCount: 0 },
  { no: 4, name: '배송 지연 안내', type: '알림톡', sendDate: '2025.12.15 16:00', status: '발송완료', targetCount: 12, successCount: 11, failCount: 1 },
  { no: 5, name: '회원가입 감사 쿠폰', type: '친구톡', sendDate: '2025.12.10 11:00', status: '실패', targetCount: 80, successCount: 0, failCount: 80 },
];
