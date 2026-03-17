export interface ICrmStatDto {
  no: number;
  campaignName: string;
  type: string;
  sendFrequency: '1회' | '반복';
  sendRound: number;
  totalRounds: number;
  sendDate: string;
  targetCount: number;
  successCount: number;
  failCount: number;
  cost: number;
}
