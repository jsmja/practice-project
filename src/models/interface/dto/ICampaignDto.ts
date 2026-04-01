export interface ICampaignButtonDto {
  label: string;
  type: '웹링크' | '앱링크' | '봇키워드' | '채널 추가' | '상담톡 전환' | '쿠폰형';
  url?: string;
}

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
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  messageContent?: string;
  messageType?: '기본형' | '와이드 이미지형';
  messageButtons?: ICampaignButtonDto[];
  couponName?: string;
  isAdultOnly?: boolean;
  abTestContent?: string;
  audienceTags?: string[];
}
