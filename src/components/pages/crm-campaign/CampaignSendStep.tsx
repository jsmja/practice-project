import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ICampaignSendStepProps {
  sendOption: 'now' | 'reserved';
  onSendOptionChange: (option: 'now' | 'reserved') => void;
  sendDate: string;
  onSendDateChange: (date: string) => void;
  sendTime: string;
  onSendTimeChange: (time: string) => void;
}

const SEND_OPTIONS = [
  { id: 'now' as const, icon: '⚡', label: '즉시 발송', sub: '저장 즉시 메시지를 발송합니다' },
  { id: 'reserved' as const, icon: '📅', label: '예약 발송', sub: '지정한 날짜와 시간에 자동 발송합니다' },
];

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
      <h2 className="mb-4 text-base font-semibold">발송 일정을 설정해주세요</h2>
      <div className="space-y-3">
        {SEND_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSendOptionChange(opt.id)}
            className={cn(
              'flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all',
              sendOption === opt.id ? 'border-foreground bg-gray-50' : 'border-border/60 hover:border-gray-300'
            )}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p className="font-medium">{opt.label}</p>
              <p className="text-sm text-muted-foreground">{opt.sub}</p>
            </div>
            {sendOption === opt.id && (
              <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                <Check size={11} className="text-white" />
              </div>
            )}
          </button>
        ))}
        {sendOption === 'reserved' && (
          <div className="ml-12 rounded-xl border border-border/60 bg-white p-4">
            <div className="flex gap-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">날짜</label>
                <input type="date" value={sendDate} onChange={(e) => onSendDateChange(e.target.value)} className="rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">시간</label>
                <input type="time" value={sendTime} onChange={(e) => onSendTimeChange(e.target.value)} className="rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
