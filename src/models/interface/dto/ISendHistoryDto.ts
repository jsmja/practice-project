export interface ISendHistoryDto {
  id?: number;
  customerId: string;
  date: string;
  type: string;
  sendFrequency: '1회' | '반복';
  sendRound: number;
  totalRounds: number;
  sentCount: number;
  totalCount: number;
  status: string;
  failReason?: string;
}
