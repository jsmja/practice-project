export interface IServiceProductDto {
  id: string;
  name: string;
  status: string;
  trialEndDate?: string;
  monthlyPrice: number;
  annualPrice: number;
  discountRate: number;
  description: string;
}
