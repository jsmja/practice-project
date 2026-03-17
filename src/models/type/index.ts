export type BadgeVariantType = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'kakao';

export const CAMPAIGN_STATUS = {
  SUCCESS: '성공',
  FAILED: '실패',
  ENDED: '종료',
  SCHEDULED: '예정',
  PAUSED: '중지',
} as const;

export const MARKETING_STATUS = {
  ACTIVE: '진행중',
  PAUSED: '중지',
} as const;

export const CONSENT_STATUS = {
  AGREED: '동의',
  DISAGREED: '미동의',
} as const;

export const POINT_TYPE = {
  CHARGE: '충전',
  USE: '사용',
} as const;

export const BANNER_STATUS = {
  ACTIVE: '진행중',
  PAUSED: '중지',
  DRAFT: '임시저장',
  ENDED: '종료',
} as const;

export type BannerPurposeType = '신규 고객 유입' | '재방문 유도' | '이벤트 안내' | '신상품 홍보' | '할인 프로모션' | '리뷰 유도' | '회원가입 유도';

export type BannerIndustryType = '음식/식당' | '뷰티/미용' | '패션/의류' | '헬스/피트니스' | '교육/학원' | '의료/병원' | '카페/디저트' | '펫샵/동물병원';

export type BannerFormatType = '센터 팝업' | '띠배너' | '슬라이드인' | '풀스크린' | '이탈 감지';
