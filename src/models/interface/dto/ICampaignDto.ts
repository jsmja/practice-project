export interface ICampaignDto {
  no: number;
  name: string;
  type: string;
  sendFrequency: '1회' | '반복';
  sendRound: number;
  totalRounds: number;
  sendDate: string;
  status: string;
  targetCount: number;
  successCount: number;
  failCount: number;
  failReason?: string;
}
