import { cn } from '@/lib/utils';
import { Monitor, Columns2, SquareArrowOutUpRight } from 'lucide-react';

export type DeliveryFrequency = 'once' | 'daily' | 'every-visit';
export type DeliveryPriority = 1 | 2 | 3;
export type DisplayPosition = 'center' | 'corner-center' | 'heybutton';

export interface IDeliveryState {
  scheduleDate: string;
  frequency: DeliveryFrequency;
  priority: DeliveryPriority;
  displayPosition: DisplayPosition;
  includePageUrl: string;
  excludePageUrl: string;
}

export const INITIAL_DELIVERY: IDeliveryState = {
  scheduleDate: '',
  frequency: 'once',
  priority: 1,
  displayPosition: 'center',
  includePageUrl: '',
  excludePageUrl: '',
};

interface IBannerDeliveryStepProps {
  delivery: IDeliveryState;
  onChange: (delivery: IDeliveryState) => void;
}

const FREQUENCY_OPTIONS: Array<{ id: DeliveryFrequency; label: string }> = [
  { id: 'once', label: '처음 1회' },
  { id: 'daily', label: '매일 1회' },
  { id: 'every-visit', label: '접속 할 때마다' },
];

const PRIORITY_OPTIONS: DeliveryPriority[] = [1, 2, 3];

const POSITION_OPTIONS: Array<{
  id: DisplayPosition;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'center',
    label: '페이지 가운데',
    icon: <Monitor size={28} className="text-primary/60" />,
  },
  {
    id: 'corner-center',
    label: '딥처리 및 페이지 가운데',
    icon: <Columns2 size={28} className="text-primary/40" />,
  },
  {
    id: 'heybutton',
    label: '헤이버튼 위치에 출력',
    icon: <SquareArrowOutUpRight size={28} className="text-primary/40" />,
  },
];

export function BannerDeliveryStep({ delivery, onChange }: IBannerDeliveryStepProps) {
  const update = (partial: Partial<IDeliveryState>) => {
    onChange({ ...delivery, ...partial });
  };

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">발송 조건 설정</h2>
      <p className="mb-6 text-xs text-muted-foreground">
        발송 스케줄과 노출 조건을 설정해 주세요.
      </p>

      <div className="max-w-xl space-y-7">
        {/* 발송 시작 및 종료 설정 */}
        <div>
          <p className="mb-2 text-sm font-medium">발송 시작 및 종료 설정</p>
          <select
            value={delivery.scheduleDate}
            onChange={(e) => update({ scheduleDate: e.target.value })}
            className="w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm text-muted-foreground outline-none transition-colors focus:border-primary"
          >
            <option value="">날짜를 선택해 주세요.</option>
            <option value="immediate">즉시 시작</option>
            <option value="scheduled">날짜 지정</option>
          </select>
        </div>

        {/* 마케팅 발송 횟수 */}
        <div>
          <p className="mb-2 text-sm font-medium">마케팅 발송 횟수</p>
          <div className="flex rounded-lg border border-border/60">
            {FREQUENCY_OPTIONS.map((opt, idx) => (
              <button
                key={opt.id}
                onClick={() => update({ frequency: opt.id })}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-colors',
                  idx > 0 && 'border-l border-border/60',
                  delivery.frequency === opt.id
                    ? 'bg-primary/5 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 우선 순위 설정 */}
        <div>
          <p className="mb-2 text-sm font-medium">우선 순위 설정</p>
          <div className="flex rounded-lg border border-border/60">
            {PRIORITY_OPTIONS.map((p, idx) => (
              <button
                key={p}
                onClick={() => update({ priority: p })}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-colors',
                  idx > 0 && 'border-l border-border/60',
                  delivery.priority === p
                    ? 'bg-primary/5 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 노출 위치 설정 */}
        <div>
          <p className="mb-3 text-sm font-medium">노출 위치 설정</p>
          <div className="grid grid-cols-3 gap-3">
            {POSITION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => update({ displayPosition: opt.id })}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all',
                  delivery.displayPosition === opt.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/60 hover:border-primary/30'
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                  {opt.icon}
                </div>
                <span className="text-center text-xs font-medium leading-tight">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 특정 페이지 방문 */}
        <div>
          <p className="mb-2 text-sm font-medium">특정 페이지 방문</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={delivery.includePageUrl}
              onChange={(e) => update({ includePageUrl: e.target.value })}
              placeholder="http(s)://"
              className="flex-1 rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
            <button className="flex-shrink-0 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              적용
            </button>
          </div>
        </div>

        {/* 특정 페이지 제외 */}
        <div>
          <p className="mb-2 text-sm font-medium">특정 페이지 제외</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={delivery.excludePageUrl}
              onChange={(e) => update({ excludePageUrl: e.target.value })}
              placeholder="http(s)://"
              className="flex-1 rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
            <button className="flex-shrink-0 rounded-lg border border-border/60 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
