import { useState } from 'react';
import {
  Calendar,
  RefreshCw,
  Clock,
  MousePointer,
  Timer,
  Trash2,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── 타겟팅 항목 타입 ── */
type TargetingItemId = 'visitDay' | 'visitCount' | 'revisitPeriod' | 'stayTime' | 'mouseScroll';

interface ITargetingItem {
  id: TargetingItemId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const ALL_TARGETING_ITEMS: ITargetingItem[] = [
  { id: 'visitDay', label: '방문 요일', description: '방문 요일에 따라 타겟팅합니다', icon: <Calendar size={16} /> },
  { id: 'visitCount', label: '방문 횟수', description: '방문 횟수에 따라 타겟팅합니다', icon: <RefreshCw size={16} /> },
  { id: 'revisitPeriod', label: '재방문 기간', description: '재방문 기간에 따라 타겟팅합니다', icon: <Clock size={16} /> },
  { id: 'stayTime', label: '체류 시간', description: '체류 시간에 따라 타겟팅합니다', icon: <Timer size={16} /> },
  { id: 'mouseScroll', label: '마우스 스크롤', description: '스크롤 깊이에 따라 타겟팅합니다', icon: <MousePointer size={16} /> },
];

const DAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'];
const VISIT_COUNT_PRESETS = ['1회 이상', '3회 이상', '5회 이상', '10회 이상'];
const REVISIT_PRESETS = ['24시간 이내', '1일 이후', '3일 이후', '5일 이후', '10일 이후'];
const STAY_TIME_PRESETS = ['1분', '3분', '5분', '10분'];
const SCROLL_PRESETS = ['10%', '30%', '50%', '80%'];

/* ── 오디언스 상태 인터페이스 ── */
export interface IAudienceState {
  targetCustomer: 'all' | 'loggedIn' | 'guest';
  activeItems: TargetingItemId[];
  // 방문 요일
  visitDays: string[];
  allDays: boolean;
  // 방문 횟수
  visitCount: number;
  // 재방문 기간
  revisitPeriodValue: number;
  revisitPeriodPreset: string;
  // 체류 시간
  stayTimeType: 'duration' | 'specific';
  stayTimeValue: number;
  // 마우스 스크롤
  scrollPercent: number;
}

export const INITIAL_AUDIENCE: IAudienceState = {
  targetCustomer: 'all',
  activeItems: ['visitDay', 'visitCount'],
  visitDays: ['월', '화', '수', '목', '금', '토', '일'],
  allDays: true,
  visitCount: 1,
  revisitPeriodValue: 0,
  revisitPeriodPreset: '24시간 이내',
  stayTimeType: 'duration',
  stayTimeValue: 1,
  scrollPercent: 10,
};

interface IBannerAudienceStepProps {
  audience: IAudienceState;
  onChange: (audience: IAudienceState) => void;
}

export function BannerAudienceStep({ audience, onChange }: IBannerAudienceStepProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const update = (partial: Partial<IAudienceState>) => {
    onChange({ ...audience, ...partial });
  };

  const addItem = (id: TargetingItemId) => {
    if (!audience.activeItems.includes(id)) {
      update({ activeItems: [...audience.activeItems, id] });
    }
    setShowAddMenu(false);
  };

  const removeItem = (id: TargetingItemId) => {
    update({ activeItems: audience.activeItems.filter((i) => i !== id) });
  };

  const toggleDay = (day: string) => {
    let newDays: string[];
    if (audience.visitDays.includes(day)) {
      newDays = audience.visitDays.filter((d) => d !== day);
    } else {
      newDays = [...audience.visitDays, day];
    }
    const allDays = newDays.length === 7;
    update({ visitDays: newDays, allDays });
  };

  const toggleAllDays = () => {
    if (audience.allDays) {
      update({ visitDays: [], allDays: false });
    } else {
      update({ visitDays: [...DAY_OPTIONS], allDays: true });
    }
  };

  const resetAll = () => {
    onChange({ ...INITIAL_AUDIENCE });
  };

  const availableItems = ALL_TARGETING_ITEMS.filter((item) => !audience.activeItems.includes(item.id));

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold">오디언스 설정</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        마케팅 대상 오디언스를 설정해 주세요.
      </p>

      {/* 추천 오디언스 가이드 */}
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="mb-2 text-xs font-semibold text-primary">💡 추천 오디언스 설정 가이드</p>
        <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <p>· <span className="font-medium text-foreground">재방문 유도</span> — 방문 요일을 평일로, 방문 횟수 3회 이상으로 설정하면 충성 고객에게 집중할 수 있어요.</p>
          <p>· <span className="font-medium text-foreground">신규 고객 확보</span> — 방문 횟수 1회, 재방문 기간 24시간 이내로 설정하면 첫 방문 고객을 타겟팅할 수 있어요.</p>
          <p>· <span className="font-medium text-foreground">이탈 방지</span> — 재방문 기간 5일 이후, 마우스 스크롤 80% 이상으로 설정하면 관심은 있지만 이탈 위험이 있는 고객을 잡을 수 있어요.</p>
        </div>
      </div>

      {/* 대상 고객 */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-medium">대상 고객</p>
        <div className="flex items-center gap-4">
          {[
            { id: 'all' as const, label: '전체' },
            { id: 'loggedIn' as const, label: '로그인' },
            { id: 'guest' as const, label: '비로그인' },
          ].map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2">
              <div className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full border-2',
                audience.targetCustomer === opt.id ? 'border-primary' : 'border-gray-300'
              )}>
                {audience.targetCustomer === opt.id && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 활성 타겟팅 항목들 */}
      <div className="space-y-4">
        {/* 방문 요일 */}
        {audience.activeItems.includes('visitDay') && (
          <TargetingCard
            icon={<Calendar size={16} />}
            label="방문 요일"
            onRemove={() => removeItem('visitDay')}
          >
            <button
              onClick={toggleAllDays}
              className={cn(
                'mb-3 w-full rounded-lg border py-2 text-sm font-medium transition-colors',
                audience.allDays
                  ? 'border-primary bg-primary text-white'
                  : 'border-border/60 text-muted-foreground hover:bg-muted'
              )}
            >
              모든 요일
            </button>
            <div className="flex gap-2">
              {DAY_OPTIONS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                    audience.visitDays.includes(day)
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/60 text-muted-foreground hover:border-gray-400'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </TargetingCard>
        )}

        {/* 방문 횟수 */}
        {audience.activeItems.includes('visitCount') && (
          <TargetingCard
            icon={<RefreshCw size={16} />}
            label="방문 횟수"
            onRemove={() => removeItem('visitCount')}
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={audience.visitCount}
                onChange={(e) => update({ visitCount: parseInt(e.target.value) || 1 })}
                className="flex-1 rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">회 이상</span>
            </div>
            <div className="flex gap-2">
              {VISIT_COUNT_PRESETS.map((preset) => {
                const num = parseInt(preset);
                return (
                  <button
                    key={preset}
                    onClick={() => update({ visitCount: num })}
                    className={cn(
                      'flex-1 rounded-lg border py-2 text-xs font-medium transition-colors',
                      audience.visitCount === num
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/60 text-muted-foreground hover:border-gray-400'
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </TargetingCard>
        )}

        {/* 재방문 기간 */}
        {audience.activeItems.includes('revisitPeriod') && (
          <TargetingCard
            icon={<Clock size={16} />}
            label="재방문 기간"
            onRemove={() => removeItem('revisitPeriod')}
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={audience.revisitPeriodValue}
                onChange={(e) => update({ revisitPeriodValue: parseInt(e.target.value) || 0 })}
                placeholder="숫자 입력"
                className="flex-1 rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">일 이후</span>
            </div>
            <div className="flex gap-2">
              {REVISIT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => update({ revisitPeriodPreset: preset })}
                  className={cn(
                    'flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors',
                    audience.revisitPeriodPreset === preset
                      ? 'border-primary bg-primary text-white'
                      : 'border-border/60 text-muted-foreground hover:border-gray-400'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </TargetingCard>
        )}

        {/* 체류 시간 */}
        {audience.activeItems.includes('stayTime') && (
          <TargetingCard
            icon={<Timer size={16} />}
            label="체류 시간"
            onRemove={() => removeItem('stayTime')}
          >
            <div className="mb-3 flex items-center gap-4">
              {[
                { id: 'duration' as const, label: '체류 시간' },
                { id: 'specific' as const, label: '특정 시간대' },
              ].map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-2">
                  <div className={cn(
                    'flex h-3.5 w-3.5 items-center justify-center rounded-full border-2',
                    audience.stayTimeType === opt.id ? 'border-primary' : 'border-gray-300'
                  )}>
                    {audience.stayTimeType === opt.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="mb-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={audience.stayTimeValue}
                onChange={(e) => update({ stayTimeValue: parseInt(e.target.value) || 1 })}
                className="flex-1 rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">분</span>
            </div>
            <div className="flex gap-2">
              {STAY_TIME_PRESETS.map((preset) => {
                const num = parseInt(preset);
                return (
                  <button
                    key={preset}
                    onClick={() => update({ stayTimeValue: num })}
                    className={cn(
                      'flex-1 rounded-lg border py-2 text-xs font-medium transition-colors',
                      audience.stayTimeValue === num
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/60 text-muted-foreground hover:border-gray-400'
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </TargetingCard>
        )}

        {/* 마우스 스크롤 */}
        {audience.activeItems.includes('mouseScroll') && (
          <TargetingCard
            icon={<MousePointer size={16} />}
            label="마우스 스크롤"
            onRemove={() => removeItem('mouseScroll')}
          >
            <div className="mb-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={audience.scrollPercent}
                onChange={(e) => update({ scrollPercent: parseInt(e.target.value) || 10 })}
                className="flex-1 rounded-lg border border-border/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <div className="flex gap-2">
              {SCROLL_PRESETS.map((preset) => {
                const num = parseInt(preset);
                return (
                  <button
                    key={preset}
                    onClick={() => update({ scrollPercent: num })}
                    className={cn(
                      'flex-1 rounded-lg border py-2 text-xs font-medium transition-colors',
                      audience.scrollPercent === num
                        ? 'border-primary bg-primary text-white'
                        : 'border-border/60 text-muted-foreground hover:border-gray-400'
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </TargetingCard>
        )}
      </div>

      {/* 타겟팅 추가 / 초기화 */}
      <div className="relative mt-4">
        <div className="flex rounded-xl border border-dashed border-border/60">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={availableItems.length === 0}
            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            <Plus size={14} />
            타겟팅 추가
          </button>
          <div className="w-px bg-border/60" />
          <button
            onClick={resetAll}
            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw size={14} />
            초기화
          </button>
        </div>

        {/* 추가 메뉴 드롭다운 */}
        {showAddMenu && availableItems.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border/60 bg-white py-1 shadow-lg">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 타겟팅 카드 래퍼 ── */
function TargetingCard({
  icon,
  label,
  onRemove,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <p className="text-sm font-semibold">{label}</p>
        </div>
        <button onClick={onRemove} className="text-muted-foreground transition-colors hover:text-foreground">
          <Trash2 size={15} />
        </button>
      </div>
      {children}
    </div>
  );
}
