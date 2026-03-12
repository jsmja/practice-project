import type { ICustomerDto } from '@/models/interface/dto';

export const MOCK_CUSTOMERS: ICustomerDto[] = [
  { no: 1, name: '-', phone: '-', marketingConsent: '미동의', browserId: '90c35e79-a9ab-3401-31e5-6e2b0a5babc1', customerId: 'ffqdqd', lastAccess: '2025.12.17 14:34:24' },
  { no: 2, name: '-', phone: '-', marketingConsent: '동의(카페24)', browserId: '4cf94444-663c-67f4-5bb5-2b43154a7507', customerId: 'ffqdqd001', lastAccess: '2025.12.17 14:31:54' },
  { no: 3, name: '-', phone: '-', marketingConsent: '-', browserId: 'd5edf521-036a-9af8-6dea-ec7a6eb6fd59', customerId: 'bbfa8896-0689-b859-2205-bea646259e32', lastAccess: '2025.10.22 11:46:04' },
  { no: 4, name: '-', phone: '-', marketingConsent: '-', browserId: '7f1a6474-25ff-361c-d0ed-a271d22bc5c1', customerId: '861eed4d-5da6-e559-0ab0-053c8d708bc8', lastAccess: '2025.10.22 11:45:59' },
  { no: 5, name: '-', phone: '-', marketingConsent: '-', browserId: 'b3579129-6194-ab2e-c8ce-08d2f3a8a6dd', customerId: 'b4d6b8ed-6d70-55a0-bb57-ee10e117df6f', lastAccess: '2025.10.22 11:45:46' },
  { no: 6, name: '-', phone: '-', marketingConsent: '-', browserId: '04c9c8aa-e0b5-321d-39c0-7d5394ca2b4a', customerId: '5222682b-9fbf-586d-f2ba-1d97dbac6213', lastAccess: '2025.10.22 11:44:02' },
  { no: 7, name: '-', phone: '-', marketingConsent: '-', browserId: '2f4abcc3-34ad-3f6c-3613-2cbe6dc3ab5e', customerId: '1c897c3d-e7d1-ed34-c705-cd0894c4f68a', lastAccess: '2025.09.08 14:51:21' },
  { no: 8, name: '-', phone: '-', marketingConsent: '-', browserId: '3f7e92f1-92d3-6679-9a31-33a39ac246c2', customerId: '7c12c867-36b2-4006-a5d5-9ac5dde23117', lastAccess: '2025.07.21 17:39:08' },
];

export const MOCK_SEND_HISTORY = [
  { date: '2025.12.15 10:30', type: '알림톡', template: '주문 확인', status: '성공' },
  { date: '2025.12.10 14:20', type: '친구톡', template: '할인 안내', status: '성공' },
  { date: '2025.11.28 09:00', type: '알림톡', template: '배송 완료', status: '실패' },
];
