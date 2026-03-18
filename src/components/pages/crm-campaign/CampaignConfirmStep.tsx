import { CAMPAIGN_TYPES } from './CampaignTypeStep';
import type { IRecipientFilter } from './CampaignRecipientStep';

interface ICampaignConfirmStepProps {
  campaignName: string;
  campaignTypeId: string | null;
  messageTypeName: string;
  recipientFilter: IRecipientFilter;
  buttonCount: number;
  couponEnabled: boolean;
  couponName: string;
  sendOption: 'now' | 'reserved';
  sendDate: string;
  sendTime: string;
}

export function CampaignConfirmStep({
  campaignName,
  campaignTypeId,
  messageTypeName,
  recipientFilter,
  buttonCount,
  couponEnabled,
  couponName,
  sendOption,
  sendDate,
  sendTime,
}: ICampaignConfirmStepProps) {
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);
  const isBirthday = campaignTypeId === 'birthday';
  const targetCount = recipientFilter.grade === '전체' ? 3200 : 320;
  const estimatedCost = (targetCount * 15).toLocaleString();

  const summaryItems = [
    { label: '캠페인명', value: campaignName || '-' },
    { label: '캠페인 유형', value: campaignType?.name || '-' },
    { label: '메시지 유형', value: messageTypeName || '-' },
    { label: '수신 대상', value: isBirthday ? '생일 고객 (자동)' : `${recipientFilter.grade} 등급` },
    { label: '버튼 수', value: `${buttonCount}개` },
    { label: '쿠폰 연동', value: couponEnabled ? couponName || '설정됨' : '없음' },
    { label: '발송 방식', value: sendOption === 'now' ? '즉시 발송' : `예약 발송 · ${sendDate} ${sendTime}` },
  ];

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">발송 전 최종 확인</h2>
      <p className="mb-5 text-xs text-muted-foreground">아래 내용을 확인하고 발송하세요</p>

      <div className="space-y-3">
        {/* 요약 카드 */}
        <div className="rounded-xl border border-border/60 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">캠페인 정보</p>
          <div className="space-y-2.5 text-sm">
            {summaryItems.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-24 text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 예상 비용 */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="mb-2 text-xs font-semibold text-amber-700">예상 발송 비용</p>
          <div className="flex items-end justify-between">
            <div className="space-y-1 text-xs text-amber-700">
              <p>대상 고객 수: 약 {targetCount.toLocaleString()}명</p>
              <p>건당 단가: 15 포인트</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-600">총 예상 비용</p>
              <p className="text-xl font-bold text-amber-700">{estimatedCost} P</p>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="rounded-xl border border-border/60 bg-gray-50 p-4 text-xs text-muted-foreground">
          <p className="mb-1.5 font-medium text-foreground">발송 전 체크리스트</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>메시지 내용에 오탈자가 없는지 확인하세요</li>
            <li>수신 거부 고객은 자동으로 제외됩니다</li>
            <li>발송 후 취소는 예약 발송만 가능합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
