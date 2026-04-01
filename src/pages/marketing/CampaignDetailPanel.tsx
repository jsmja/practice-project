import { cn } from '@/lib/utils';
import { X, Pencil, Copy, Trash2, Pause, Play, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { ICampaignDto } from '@/models/interface/dto';
import type { BadgeVariantType } from '@/models/type';
import { CAMPAIGN_STATUS } from '@/models/type';

const STATUS_BADGE_MAP: Record<string, BadgeVariantType> = {
  [CAMPAIGN_STATUS.SUCCESS]: 'success',
  [CAMPAIGN_STATUS.FAILED]: 'destructive',
  [CAMPAIGN_STATUS.ENDED]: 'default',
  [CAMPAIGN_STATUS.SCHEDULED]: 'info',
  [CAMPAIGN_STATUS.PAUSED]: 'warning',
};

const TYPE_BADGE_MAP: Record<string, BadgeVariantType> = {
  '커스텀 캠페인': 'default',
  '웰컴백 캠페인': 'info',
  '신규회원 이탈방지': 'success',
  '재구매 유도': 'warning',
  '구매 감사': 'info',
  '생일 축하': 'success',
  'VIP 전용': 'warning',
  '장기 미접속 이탈방지': 'info',
  '장바구니 리마인딩': 'warning',
  '장기 미구매 구매 유도': 'default',
  '전체 친구 대상': 'success',
  '시즌 캠페인': 'info',
};

interface ICampaignDetailPanelProps {
  campaign: ICampaignDto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (campaign: ICampaignDto) => void;
  onDuplicate: (campaign: ICampaignDto) => void;
  onDelete: (campaign: ICampaignDto) => void;
  onTogglePause: (campaign: ICampaignDto) => void;
}

export function CampaignDetailPanel({
  campaign,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePause,
}: ICampaignDetailPanelProps) {
  if (!campaign) return null;

  const sendRate = campaign.targetCount > 0
    ? Math.round((campaign.successCount / campaign.targetCount) * 100)
    : 0;

  const canEdit = campaign.status === CAMPAIGN_STATUS.SCHEDULED;
  const canPauseResume = campaign.sendFrequency === '반복' &&
    (campaign.status === CAMPAIGN_STATUS.SUCCESS || campaign.status === CAMPAIGN_STATUS.PAUSED);
  const isPaused = campaign.status === CAMPAIGN_STATUS.PAUSED;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      )}

      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[680px] flex-col border-l border-border bg-white shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">캠페인 상세</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        {/* Action toolbar */}
        <div className="flex items-center gap-2 border-b border-border px-6 py-3">
          {canEdit && (
            <button
              onClick={() => onEdit(campaign)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Pencil size={13} />
              수정
            </button>
          )}
          <button
            onClick={() => onDuplicate(campaign)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Copy size={13} />
            복사
          </button>
          {canPauseResume && (
            <button
              onClick={() => onTogglePause(campaign)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                isPaused
                  ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  : 'border-amber-200 text-amber-700 hover:bg-amber-50',
              )}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              {isPaused ? '재개' : '일시중지'}
            </button>
          )}
          <button
            onClick={() => onDelete(campaign)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={13} />
            삭제
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* 기본 정보 */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">기본 정보</h3>
            <div className="space-y-3">
              <InfoRow label="캠페인명" value={campaign.name} />
              <InfoRow label="캠페인 유형">
                <Badge variant={TYPE_BADGE_MAP[campaign.type] ?? 'default'}>{campaign.type}</Badge>
              </InfoRow>
              <InfoRow label="설명" value={campaign.description || '-'} />
              <InfoRow label="생성일" value={campaign.createdDate || '-'} />
              <InfoRow label="최종 수정일" value={campaign.lastModifiedDate || '-'} />
            </div>
          </section>

          {/* 메시지 미리보기 */}
          {campaign.messageContent && (
            <section className="mb-6 border-t border-border pt-5">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">메시지 미리보기</h3>
              <div className="rounded-xl border border-border/60 bg-[#B2C7D9] p-4">
                {/* 카카오톡 말풍선 */}
                <div className="flex gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-white">
                    HT
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-xs font-medium text-gray-700">헤이데어</p>
                    <div className="rounded-lg bg-white p-3.5 shadow-sm">
                      <p className="mb-1 text-[10px] text-gray-400">(광고) 헤이데어</p>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-900">
                        {campaign.messageContent}
                      </p>
                      {campaign.messageButtons && campaign.messageButtons.length > 0 && (
                        <div className="mt-3 flex flex-col gap-1.5">
                          {campaign.messageButtons.map((btn, idx) => (
                            <div
                              key={idx}
                              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-medium text-gray-600"
                            >
                              {btn}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 오디언스 */}
          {campaign.audienceTags && campaign.audienceTags.length > 0 && (
            <section className="mb-6 border-t border-border pt-5">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">발송 대상 조건</h3>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-violet-50 p-2">
                  <Users size={16} className="text-violet-500" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.audienceTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 발송 정보 */}
          <section className="mb-6 border-t border-border pt-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">발송 정보</h3>
            <div className="space-y-3">
              <InfoRow label="발송 유형">
                <Badge variant={campaign.sendFrequency === '1회' ? 'default' : 'info'}>
                  {campaign.sendFrequency}
                </Badge>
              </InfoRow>
              <InfoRow label="발송 회차" value={`${campaign.sendRound} / ${campaign.totalRounds}회차`} />
              <InfoRow label="발송 일시" value={campaign.sendDate} />
              <InfoRow label="상태">
                <Badge variant={STATUS_BADGE_MAP[campaign.status] ?? 'default'}>
                  {campaign.status}
                </Badge>
              </InfoRow>
            </div>
          </section>

          {/* 발송 결과 */}
          <section className="border-t border-border pt-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">발송 결과</h3>
            <div className="space-y-3">
              <InfoRow label="발송 대상" value={`${campaign.targetCount.toLocaleString()}명`} />
              <InfoRow label="발송 성공" value={`${campaign.successCount.toLocaleString()}건`} />
              <InfoRow label="발송 실패" value={`${campaign.failCount.toLocaleString()}건`} />
              <InfoRow label="발송률">
                <span className={cn(
                  'text-sm font-medium',
                  sendRate >= 90 ? 'text-emerald-600' : sendRate >= 50 ? 'text-foreground' : 'text-red-500',
                )}>
                  {sendRate}%
                </span>
              </InfoRow>
            </div>

            {campaign.failReason && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border-l-4 border-l-red-500 bg-red-50 px-4 py-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs font-semibold text-red-800">실패 사유</p>
                  <p className="mt-0.5 text-xs text-red-600">{campaign.failReason}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">
        {children ?? <span className="text-sm text-foreground">{value}</span>}
      </div>
    </div>
  );
}
