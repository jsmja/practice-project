import type { IPointHistoryDto } from '@/models/interface/dto';

export const MOCK_POINT_BALANCE = 48500;

export const MOCK_POINT_HISTORY: IPointHistoryDto[] = [
  { no: 1, date: '2026.03.10 14:30', type: '차감', description: '웰컴백 캠페인 발송 (이미지형 100건)', amount: -2000, balance: 48500 },
  { no: 2, date: '2026.03.07 10:15', type: '환불', description: '봄 신메뉴 캠페인 실패 13건 자동 환불', amount: 200, balance: 50500 },
  { no: 3, date: '2026.03.07 10:00', type: '차감', description: '봄 신메뉴 캠페인 발송 (텍스트형 800건)', amount: -12000, balance: 50300 },
  { no: 4, date: '2026.03.05 09:15', type: '차감', description: 'VIP 전용 캠페인 발송 (텍스트형 100건)', amount: -1500, balance: 62300 },
  { no: 5, date: '2026.03.01 10:00', type: '충전', description: '포인트 충전 (토스페이 · 신한카드 1234)', amount: 50000, balance: 63800 },
  { no: 6, date: '2026.02.25 16:00', type: '환불', description: '신규회원 이탈방지 발송 실패 40건 자동 환불', amount: 600, balance: 13800 },
  { no: 7, date: '2026.02.20 11:00', type: '차감', description: '신규회원 이탈방지 캠페인 발송 (텍스트형 120건)', amount: -1800, balance: 13200 },
  { no: 8, date: '2026.02.15 09:00', type: '충전', description: '포인트 충전 (토스페이 · 신한카드 1234)', amount: 10000, balance: 15000 },
  { no: 9, date: '2026.02.01 10:00', type: '충전', description: '신규 가입 보너스 포인트', amount: 5000, balance: 5000 },
];
