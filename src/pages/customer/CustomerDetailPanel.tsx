import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { ICustomerDto } from '@/models/interface/dto';
import type { BadgeVariantType } from '@/models/type';
import { CONSENT_STATUS } from '@/models/type';
import { useCustomerSendHistory } from '@/hooks/client/customers/useCustomersClient';

const STATUS_BADGE_MAP: Record<string, BadgeVariantType> = {
  '성공': 'success',
  '실패': 'destructive',
  '종료': 'default',
  '예정': 'info',
  '중지': 'warning',
};

const PAGE_SIZE = 5;

interface ICustomerDetailPanelProps {
  customer: ICustomerDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailPanel({ customer, isOpen, onClose }: ICustomerDetailPanelProps) {
  const { data: sendHistory = [] } = useCustomerSendHistory(customer?.customerId ?? '');
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(sendHistory.length / PAGE_SIZE));
  const pagedHistory = sendHistory.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[680px] flex-col border-l border-border bg-white shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">고객 상세 정보</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {customer && (
            <>
              {/* 기본 정보 */}
              <section className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">기본 정보</h3>
                <div className="space-y-3">
                  <InfoRow label="이름" value={customer.name} />
                  <InfoRow label="성별" value="-" />
                  <InfoRow label="생년월일" value="-" />
                  <InfoRow label="휴대폰 번호" value="-" />
                  <InfoRow label="주소" value="-" />
                  <InfoRow label="상세 주소" value="-" />
                  <InfoRow label="회원 이메일" value="-" />
                </div>
              </section>

              {/* 접속 정보 */}
              <section className="mb-6 border-t border-border pt-4">
                <div className="space-y-3">
                  <InfoRow label="브라우저 ID" value={customer.browserId} copyable />
                  <InfoRow label="고객 식별 정보" value={String(customer.customerId)} />
                  <InfoRow label="유입 디바이스" value="PC" />
                  <InfoRow label="유입 URL" value="https://ffqdqd001.cafe24.com/" copyable />
                  <InfoRow label="최근 접속 시간" value="2개월 전" />
                  <InfoRow label="최근 접속 횟수" value="1회(3개월 기준)" />
                  <InfoRow
                    label="마케팅 수신동의"
                    value={customer.marketingConsent}
                    badge={
                      customer.marketingConsent === CONSENT_STATUS.DISAGREED ? 'default' : 'success'
                    }
                  />
                </div>
              </section>

              {/* 카카오 발송 이력 */}
              <section className="border-t border-border pt-4">
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">카카오 발송 이력</h3>
                  <Badge variant="kakao">NEW</Badge>
                </div>

                <div className="overflow-hidden rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">일시</th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">유형</th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">회차</th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">발송건수</th>
                        <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-sm text-muted-foreground">
                            발송 이력이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        pagedHistory.map((item, idx) => {
                          const sentPct = item.totalCount > 0
                            ? Math.round((item.sentCount / item.totalCount) * 100)
                            : 0;

                          return (
                            <tr key={idx} className="border-t border-border/50 last:border-0 hover:bg-muted/20">
                              <td className="px-3 py-2.5 text-foreground">{item.date}</td>
                              <td className="px-3 py-2.5">
                                <Badge variant="kakao">{item.type}</Badge>
                              </td>
                              <td className="px-3 py-2.5">
                                {item.sendFrequency === '1회' ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Badge variant="default">1회</Badge>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1">
                                    <Badge variant="info">반복</Badge>
                                    <span className="text-xs font-medium">{item.sendRound}/{item.totalRounds}</span>
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="font-medium text-foreground">
                                  {item.sentCount.toLocaleString()}/{item.totalCount.toLocaleString()}
                                </span>
                                <span className={cn(
                                  'ml-1.5 text-xs',
                                  sentPct >= 80 ? 'text-emerald-600' : sentPct >= 50 ? 'text-amber-600' : 'text-red-500',
                                )}>
                                  ({sentPct}%)
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                {item.failReason ? (
                                  <span className="group relative inline-flex cursor-help">
                                    <Badge variant={STATUS_BADGE_MAP[item.status] ?? 'default'}>
                                      {item.status}
                                    </Badge>
                                    <span className="absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2.5 py-1 text-xs text-white shadow-lg group-hover:block">
                                      {item.failReason}
                                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                                    </span>
                                  </span>
                                ) : (
                                  <Badge variant={STATUS_BADGE_MAP[item.status] ?? 'default'}>
                                    {item.status}
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {sendHistory.length > PAGE_SIZE && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      총 {sendHistory.length}건
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className={cn(
                          'rounded-lg p-1.5 transition-colors',
                          page === 1
                            ? 'cursor-not-allowed text-gray-300'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-colors',
                            p === page
                              ? 'bg-primary text-white'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className={cn(
                          'rounded-lg p-1.5 transition-colors',
                          page === totalPages
                            ? 'cursor-not-allowed text-gray-300'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
  copyable,
  badge,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  badge?: 'default' | 'success';
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {badge ? (
          <Badge variant={badge}>{value}</Badge>
        ) : (
          <span className="truncate text-sm text-foreground">{value}</span>
        )}
        {copyable && (
          <button className="shrink-0 text-muted-foreground hover:text-foreground">
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
