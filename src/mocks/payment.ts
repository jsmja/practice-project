import type { ISubscriptionDto, IPaymentHistoryDto, IServiceProductDto } from '@/models/interface/dto';

export const MOCK_SUBSCRIPTIONS: ISubscriptionDto[] = [
  { id: 1, serviceName: '마수동', status: '이용중', subscriptionType: '연간', startDate: '2026.01.20', nextPaymentDate: '2026.03.20', amount: 55000 },
  { id: 2, serviceName: '간편가입', status: '이용중', subscriptionType: '월간', startDate: '2026.02.01', nextPaymentDate: '2026.03.20', amount: 33000 },
];

export const MOCK_SERVICE_PRODUCTS: IServiceProductDto[] = [
  { id: 'masudong', name: '마수동', status: '무료 체험 중', trialEndDate: '2026.03.20', monthlyPrice: 50000, annualPrice: 540000, discountRate: 10, description: '마케팅 수신동의 자동 전환 메시지 팝업 노출' },
  { id: 'easy-join', name: '간편가입', status: '이용중', monthlyPrice: 30000, annualPrice: 324000, discountRate: 10, description: '카카오/네이버 간편가입 제공' },
  { id: 'chat', name: 'SNS연동 무제한 채팅상담', status: '미사용', monthlyPrice: 9000, annualPrice: 97200, discountRate: 10, description: '카카오/네이버 채팅상담 무제한 제공' },
];

export const MOCK_PAYMENT_HISTORY: IPaymentHistoryDto[] = [
  { no: 1, paymentDate: '2026.03.15 11:20', status: '충전완료', productName: '포인트 충전 (50,000P)', subscriptionType: '-', paymentMethod: '신한카드 1234', amount: 55000, reason: '수수료 5,000원 포함', receiptUrl: '#' },
  { no: 2, paymentDate: '2026.03.10 09:30', status: '환불완료', productName: '포인트 환불', subscriptionType: '-', paymentMethod: '신한카드 1234', amount: -20000, reason: '사용자 환불 요청', receiptUrl: '#' },
  { no: 3, paymentDate: '2026.02.20 10:30', status: '결제완료', productName: '마수동', subscriptionType: '연간', paymentMethod: '신한카드 1234', amount: 594000, reason: '-', receiptUrl: '#' },
  { no: 4, paymentDate: '2026.02.15 14:00', status: '충전완료', productName: '포인트 충전 (30,000P)', subscriptionType: '-', paymentMethod: '신한카드 1234', amount: 33000, reason: '수수료 3,000원 포함', receiptUrl: '#' },
  { no: 5, paymentDate: '2026.02.01 09:00', status: '결제완료', productName: '간편가입', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 33000, reason: '-', receiptUrl: '#' },
  { no: 6, paymentDate: '2026.01.25 16:40', status: '충전완료', productName: '포인트 충전 (100,000P)', subscriptionType: '-', paymentMethod: '신한카드 1234', amount: 110000, reason: '수수료 10,000원 포함', receiptUrl: '#' },
  { no: 7, paymentDate: '2026.01.20 11:00', status: '결제취소', productName: 'SNS연동 무제한 채팅상담', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 9000, reason: '사용자 취소', receiptUrl: '#' },
  { no: 8, paymentDate: '2026.01.15 14:20', status: '결제실패', productName: '마수동', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 50000, reason: '한도 초과', receiptUrl: '' },
  { no: 9, paymentDate: '2026.01.10 10:00', status: '환불완료', productName: '포인트 환불', subscriptionType: '-', paymentMethod: '신한카드 1234', amount: -10000, reason: '사용자 환불 요청', receiptUrl: '#' },
];
