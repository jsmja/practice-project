import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  X, Pencil, Copy, Trash2, Pause, Play, AlertTriangle,
  Users, Link, Ticket, ShieldAlert, FlaskConical, Maximize2, Minimize2,
} from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  if (!campaign) return null;

  const sendRate = campaign.targetCount > 0
    ? Math.round((campaign.successCount / campaign.targetCount) * 100)
    : 0;

  const canEdit = campaign.status === CAMPAIGN_STATUS.SCHEDULED;
  const canPauseResume = campaign.sendFrequency === '반복' &&
    (campaign.status === CAMPAIGN_STATUS.SUCCESS || campaign.status === CAMPAIGN_STATUS.PAUSED);
  const isPaused = campaign.status === CAMPAIGN_STATUS.PAUSED;

  const handleClose = () => {
    setIsExpanded(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={handleClose} />
      )}

      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full flex-col border-l border-border bg-white shadow-xl transition-all duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          isExpanded ? 'w-full' : 'w-[720px]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">캠페인 상세</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={isExpanded ? '축소' : '전체보기'}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={handleClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X size={18} />
            </button>
          </div>
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
          <div className={cn(isExpanded ? 'mx-auto grid max-w-5xl grid-cols-[1fr_320px] gap-8' : 'flex flex-col')}>
            {/* 좌측(또는 기본): 정보 영역 */}
            <div className="flex flex-col gap-6">
              {/* 기본 정보 */}
              <section>
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

              {/* 메시지 작성 정보 */}
              <section className="border-t border-border pt-5">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">메시지 작성</h3>
                <div className="space-y-3">
                  <InfoRow label="메시지 유형">
                    <Badge variant={campaign.messageType === '와이드 이미지형' ? 'info' : 'default'}>
                      {campaign.messageType || '기본형'}
                    </Badge>
                  </InfoRow>

                  {/* 버튼 상세 */}
                  {campaign.messageButtons && campaign.messageButtons.length > 0 && (
                    <InfoRow label="버튼">
                      <div className="flex flex-col gap-2">
                        {campaign.messageButtons.map((btn, idx) => (
                          <div key={idx} className="flex items-start gap-2 rounded-lg border border-border/60 px-3 py-2">
                            <Badge variant={btn.type === '쿠폰형' ? 'warning' : btn.type === '웹링크' ? 'info' : 'default'}>
                              {btn.type}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">{btn.label}</p>
                              {btn.url && (
                                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                                  <Link size={10} className="shrink-0" />
                                  {btn.url}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfoRow>
                  )}

                  {/* 쿠폰 */}
                  {campaign.couponName && (
                    <InfoRow label="쿠폰">
                      <div className="flex items-center gap-2">
                        <Ticket size={14} className="text-amber-500" />
                        <span className="text-sm font-medium text-foreground">{campaign.couponName}</span>
                      </div>
                    </InfoRow>
                  )}

                  {/* 성인 전용 */}
                  {campaign.isAdultOnly && (
                    <InfoRow label="성인 전용">
                      <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1">
                        <ShieldAlert size={13} className="text-red-500" />
                        <span className="text-xs font-medium text-red-700">성인 전용 메시지</span>
                      </div>
                    </InfoRow>
                  )}

                  {/* A/B 테스트 */}
                  {campaign.abTestContent && (
                    <InfoRow label="A/B 테스트">
                      <div className="rounded-lg border border-border/60 p-3">
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <FlaskConical size={13} className="text-indigo-500" />
                          <span className="text-xs font-semibold text-indigo-600">B안</span>
                        </div>
                        <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                          {campaign.abTestContent}
                        </p>
                      </div>
                    </InfoRow>
                  )}
                </div>
              </section>

              {/* 오디언스 설정 */}
              {campaign.audienceTags && campaign.audienceTags.length > 0 && (
                <section className="border-t border-border pt-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">오디언스 설정</h3>
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
              <section className="border-t border-border pt-5">
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

              {/* 메시지 미리보기 - 비확장 모드일 때만 여기에 표시 */}
              {!isExpanded && campaign.messageContent && (
                <section className="border-t border-border pt-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">메시지 미리보기</h3>
                  <KakaoPreview campaign={campaign} />
                </section>
              )}
            </div>

            {/* 우측: 전체보기 모드일 때만 미리보기 고정 */}
            {isExpanded && campaign.messageContent && (
              <div className="sticky top-0 self-start">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">메시지 미리보기</h3>
                <KakaoPreview campaign={campaign} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ━━━ 카카오톡 미리보기 ━━━ */

function KakaoPreview({ campaign }: { campaign: ICampaignDto }) {
  return (
    <div className="rounded-xl border border-border/60 bg-[#B2C7D9] p-4">
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
            {campaign.couponName && (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5">
                <Ticket size={12} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-700">{campaign.couponName}</span>
              </div>
            )}
            {campaign.messageButtons && campaign.messageButtons.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                {campaign.messageButtons.map((btn, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-medium text-gray-600"
                  >
                    {btn.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━ InfoRow ━━━ */

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
