import { cn } from '@/lib/utils';
import { X, Copy } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { ICustomerDto } from '@/models/interface/dto';
import { CONSENT_STATUS } from '@/models/type';
import { MOCK_SEND_HISTORY } from '@/mocks/customers';

interface ICustomerDetailPanelProps {
  customer: ICustomerDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailPanel({ customer, isOpen, onClose }: ICustomerDetailPanelProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-border bg-white shadow-xl transition-transform duration-300',
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

              {/* 카카오 발송 이력 (NEW) */}
              <section className="border-t border-border pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">카카오 발송 이력</h3>
                  <Badge variant="kakao">NEW</Badge>
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">일시</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">유형</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">템플릿</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SEND_HISTORY.map((item, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-3 py-2">{item.date}</td>
                          <td className="px-3 py-2">
                            <Badge variant="kakao">{item.type}</Badge>
                          </td>
                          <td className="px-3 py-2">{item.template}</td>
                          <td className="px-3 py-2">
                            <Badge variant={item.status === '성공' ? 'success' : 'destructive'}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
      <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
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
