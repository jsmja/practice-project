import { cn } from '@/lib/utils';

interface ICampaignSendStepProps {
  sendOption: 'once' | 'repeat';
  onSendOptionChange: (option: 'once' | 'repeat') => void;
  sendDate: string;
  onSendDateChange: (date: string) => void;
  sendTime: string;
  onSendTimeChange: (time: string) => void;
}

export function CampaignSendStep({
  sendOption,
  onSendOptionChange,
  sendDate,
  onSendDateChange,
  sendTime,
  onSendTimeChange,
}: ICampaignSendStepProps) {
  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">발송 조건 설정</h2>
      <p className="mb-5 text-xs text-muted-foreground">발송 스케줄과 조건을 설정해 주세요.</p>

      <div className="rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border/60">
            {/* 횟수 */}
            <tr>
              <td className="w-40 bg-gray-50/70 px-5 py-4 text-xs font-medium text-muted-foreground">횟수</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <RadioDot checked={sendOption === 'once'} onClick={() => onSendOptionChange('once')} />
                    <span className="text-sm">1회 발송</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <RadioDot checked={sendOption === 'repeat'} onClick={() => onSendOptionChange('repeat')} />
                    <span className="text-sm">반복 발송</span>
                  </label>
                </div>
              </td>
            </tr>
            {/* 발송시각 */}
            <tr>
              <td className="w-40 bg-gray-50/70 px-5 py-4 text-xs font-medium text-muted-foreground">
                발송시각 <span className="text-red-500">*</span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={sendDate}
                    onChange={(e) => onSendDateChange(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="rounded-lg border border-border/60 px-3 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <select
                    value={sendTime}
                    onChange={(e) => onSendTimeChange(e.target.value)}
                    className="rounded-lg border border-border/60 px-3 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">00 : 00</option>
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                        {String(h).padStart(2, '0')} : 00
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 안내 사항 */}
      <div className="mt-4 rounded-xl border border-border/60 bg-gray-50/70 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
        <p>· 해당 캠페인은 현재 시각 기준 30분 이후부터 발송 가능합니다. (원하는 발송 시간이 있을 경우, 최소 30분 전에 등록해 주세요.)</p>
        <p className="mt-1 text-orange-500">· 친구톡은 광고성 메시지로 야간발송 제한 시간에는 발송할 수 없습니다. (발송 제한시간: 20:50~익일 8:00)</p>
      </div>
    </div>
  );
}

function RadioDot({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2',
        checked ? 'border-primary' : 'border-gray-300'
      )}
    >
      {checked && <div className="h-2 w-2 rounded-full bg-primary" />}
    </button>
  );
}
