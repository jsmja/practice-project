import type { ICampaignDto } from '@/models/interface/dto';

export const MOCK_CAMPAIGNS: ICampaignDto[] = [
  { no: 1, name: '봄 신메뉴 출시 이벤트', type: '이미지형', sendDate: '2026.03.10 10:00', status: '발송완료', targetCount: 3200, successCount: 3136, failCount: 64 },
  { no: 2, name: '3월 재방문 고객 할인 쿠폰', type: '와이드 이미지형', sendDate: '2026.03.08 14:30', status: '발송완료', targetCount: 1850, successCount: 1813, failCount: 37 },
  { no: 3, name: 'VIP 고객 특별 혜택 안내', type: '와이드 아이템 리스트형', sendDate: '2026.03.20 09:00', status: '예약중', targetCount: 320, successCount: 0, failCount: 0 },
  { no: 4, name: '신규 회원 환영 메시지', type: '텍스트형', sendDate: '2026.03.04 11:00', status: '발송완료', targetCount: 120, successCount: 118, failCount: 2 },
  { no: 5, name: '봄 컬렉션 슬라이드 소개', type: '캐러셀 피드형', sendDate: '2026.03.15 10:00', status: '예약중', targetCount: 500, successCount: 0, failCount: 0 },
  { no: 6, name: '배송 완료 안내', type: '텍스트형', sendDate: '2026.03.03 16:00', status: '발송완료', targetCount: 45, successCount: 45, failCount: 0 },
  { no: 7, name: '회원가입 감사 쿠폰', type: '이미지형', sendDate: '2026.02.28 11:00', status: '실패', targetCount: 80, successCount: 0, failCount: 80 },
];
