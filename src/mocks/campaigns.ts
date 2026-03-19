import type { ICampaignDto } from '@/models/interface/dto';

export const MOCK_CAMPAIGNS: ICampaignDto[] = [
  { no: 1, name: '봄 신메뉴 출시 이벤트', type: '커스텀 캠페인', sendFrequency: '반복', sendRound: 3, totalRounds: 5, sendDate: '2026.03.10 10:00', status: '진행', targetCount: 3200, successCount: 3136, failCount: 64 },
  { no: 2, name: '3월 재방문 고객 할인 쿠폰', type: '웰컴백 캠페인', sendFrequency: '반복', sendRound: 2, totalRounds: 4, sendDate: '2026.03.08 14:30', status: '진행', targetCount: 1850, successCount: 1813, failCount: 37 },
  { no: 3, name: 'VIP 고객 특별 혜택 안내', type: 'VIP 전용', sendFrequency: '1회', sendRound: 1, totalRounds: 1, sendDate: '2026.03.20 09:00', status: '예정', targetCount: 320, successCount: 0, failCount: 0 },
  { no: 4, name: '신규 회원 환영 메시지', type: '신규회원 이탈방지', sendFrequency: '반복', sendRound: 1, totalRounds: 3, sendDate: '2026.03.04 11:00', status: '종료', targetCount: 120, successCount: 118, failCount: 2 },
  { no: 5, name: '봄 컬렉션 재구매 유도', type: '재구매 유도', sendFrequency: '반복', sendRound: 1, totalRounds: 2, sendDate: '2026.03.15 10:00', status: '예정', targetCount: 500, successCount: 0, failCount: 0 },
  { no: 6, name: '구매 감사 메시지', type: '구매 감사', sendFrequency: '1회', sendRound: 1, totalRounds: 1, sendDate: '2026.03.03 16:00', status: '진행', targetCount: 45, successCount: 45, failCount: 0 },
  { no: 7, name: '생일 고객 축하 쿠폰', type: '생일 축하', sendFrequency: '반복', sendRound: 12, totalRounds: 12, sendDate: '2026.03.12 09:00', status: '중지', targetCount: 80, successCount: 52, failCount: 0 },
  { no: 8, name: '재방문 유도 캠페인', type: '웰컴백 캠페인', sendFrequency: '1회', sendRound: 1, totalRounds: 1, sendDate: '2026.03.01 14:00', status: '실패', targetCount: 200, successCount: 0, failCount: 200, failReason: '포인트 잔액 부족으로 발송이 중단되었습니다. 포인트 충전 후 재발송해 주세요.' },
];
