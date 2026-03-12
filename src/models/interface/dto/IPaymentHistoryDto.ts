export interface IPaymentHistoryDto {
  no: number;
  paymentDate: string;
  status: string;
  productName: string;
  subscriptionType: string;
  paymentMethod: string;
  amount: number;
  reason: string;
  receiptUrl: string;
}
