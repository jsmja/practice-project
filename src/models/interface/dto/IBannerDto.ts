export interface IBannerDto {
  id: string;
  title: string;
  industry: string;
  purpose: string;
  bannerType: string;
  targetCustomer: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  previewImageUrl?: string;
  prompt?: string;
}
