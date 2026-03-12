export type BadgeVariantType = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'kakao';

export const CAMPAIGN_STATUS = {
  SENT: '발송완료',
  RESERVED: '예약중',
  FAILED: '실패',
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
