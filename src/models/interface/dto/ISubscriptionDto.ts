export interface ISubscriptionDto {
  id: number;
  serviceName: string;
  status: string;
  subscriptionType: string;
  startDate: string;
  nextPaymentDate: string;
  amount: number;
}
