import type { IMarketingDto } from '@/models/interface/dto';

export const MOCK_MARKETING_DATA: IMarketingDto[] = [
  {
    no: 1,
    name: '마케팅 수신동의 받기',
    period: '25.12.17 14:30 ~ 26.12.31 23:59',
    type: '마케팅수신동의',
    status: '일시중지',
    sendCount: '접속 할 때마다 (오늘 하루 보지 않기)',
    target: '마케팅 수신 미동의',
    impressions: 0,
    clicks: '0 (0.0%)',
    avgClickTime: '00:00:00',
  },
];
