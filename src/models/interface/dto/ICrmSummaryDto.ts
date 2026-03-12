export interface ICrmSummaryDto {
  period: string;
  totalAttempt: number;
  totalSent: number;
  sendRate: number;
  totalOpen: number;
  openRate: number;
  totalClick: number;
  clickRate: number;
  totalConversion: number;
  conversionRate: number;
  totalClickRate: number;
  totalCouponIssued: number;
  totalCouponUsed: number;
  couponUsageRate: number;
}
