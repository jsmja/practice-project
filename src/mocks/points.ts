import type { IPointHistoryDto } from '@/models/interface/dto';

export const MOCK_POINT_HISTORY: IPointHistoryDto[] = [
  { no: 1, date: '2025.12.20 10:30', type: '사용', description: '친구톡 발송 - 크리스마스 할인 안내 (150건)', amount: -270, balance: 730 },
  { no: 2, date: '2025.12.18 14:30', type: '사용', description: '알림톡 발송 - 주문 확인 알림 (45건)', amount: -32, balance: 1000 },
  { no: 3, date: '2025.12.15 09:00', type: '충전', description: '포인트 충전 (카드결제)', amount: 1000, balance: 1032 },
  { no: 4, date: '2025.12.10 11:00', type: '사용', description: '알림톡 발송 - 배송 지연 안내 (12건)', amount: -8, balance: 32 },
  { no: 5, date: '2025.12.01 10:00', type: '충전', description: '신규 가입 보너스 포인트', amount: 40, balance: 40 },
];
