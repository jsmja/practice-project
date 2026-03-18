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
  { no: 1, paymentDate: '2026.02.20 10:30', status: '결제완료', productName: '마수동', subscriptionType: '연간', paymentMethod: '신한카드 1234', amount: 594000, reason: '-', receiptUrl: '#' },
  { no: 2, paymentDate: '2026.02.01 09:00', status: '결제완료', productName: '간편가입', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 33000, reason: '-', receiptUrl: '#' },
  { no: 3, paymentDate: '2026.01.20 11:00', status: '결제취소', productName: 'SNS연동 무제한 채팅상담', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 9000, reason: '사용자 취소', receiptUrl: '#' },
  { no: 4, paymentDate: '2026.01.15 14:20', status: '결제실패', productName: '마수동', subscriptionType: '월간', paymentMethod: '신한카드 1234', amount: 50000, reason: '한도 초과', receiptUrl: '' },
];
