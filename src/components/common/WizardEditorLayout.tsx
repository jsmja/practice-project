import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IWizardStep } from './WizardStepIndicator';
import type { ReactNode } from 'react';

interface IWizardEditorLayoutProps {
  name: string;
  namePlaceholder?: string;
  onNameChange: (name: string) => void;
  onBack: () => void;
  isActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  onDraftSave?: () => void;
  steps: IWizardStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  isLastStep?: boolean;
  lastStepLabel?: string;
  lastStepIcon?: ReactNode;
  onLastStepAction?: () => void;
  preview?: ReactNode;
  children: ReactNode;
  /** 좌측 하단 요약 정보 (타겟팅 요약 등) */
  sidebarFooter?: ReactNode;
}

const LEFT_MIN = 56;
const LEFT_MAX = 600;
const RIGHT_MIN = 56;
const RIGHT_MAX = 800;
const CENTER_MIN = 280;

export function WizardEditorLayout({
  name,
  namePlaceholder = '이름을 입력하세요',
  onNameChange,
  onBack,
  isActive,
  onActiveChange,
  onDraftSave,
  steps,
  currentStep,
  onStepClick,
  onPrev,
  onNext,
  canNext = true,
  isLastStep = false,
  lastStepLabel = '저장하기',
  lastStepIcon,
  onLastStepAction,
  preview,
  children,
  sidebarFooter,
}: IWizardEditorLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(220);
  const [rightWidth, setRightWidth] = useState(400);
  const isLeftCollapsed = leftWidth < 120;
  const [maxVisitedStep, setMaxVisitedStep] = useState(currentStep);

  // 현재 스텝이 변경될 때 최대 방문 스텝 갱신
  useEffect(() => {
    setMaxVisitedStep((prev) => Math.max(prev, currentStep));
  }, [currentStep]);
  const dragging = useRef<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = side;
    startX.current = e.clientX;
    startWidth.current = side === 'left' ? leftWidth : rightWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [leftWidth, rightWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const containerWidth = window.innerWidth;
      const otherWidth = dragging.current === 'left' ? rightWidth : leftWidth;
      const maxByCenter = containerWidth - otherWidth - CENTER_MIN;

      if (dragging.current === 'left') {
        const newWidth = Math.min(LEFT_MAX, maxByCenter, Math.max(LEFT_MIN, startWidth.current + delta));
        setLeftWidth(newWidth);
      } else {
        const newWidth = Math.min(RIGHT_MAX, maxByCenter, Math.max(RIGHT_MIN, startWidth.current - delta));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (dragging.current) {
        dragging.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="-mx-8 -mt-2 flex h-[calc(100vh-48px)] flex-col">
      {/* ── 상단 헤더 바 ── */}
      <div className="flex-shrink-0 border-b border-border/60 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </button>

          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={namePlaceholder}
            className="min-w-0 flex-1 border-none bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/60"
          />

          <div className="flex items-center gap-3">
            {onActiveChange !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">사용</span>
                <button
                  type="button"
                  onClick={() => onActiveChange?.(!isActive)}
                  className={cn(
                    'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                    isActive ? 'bg-green-500' : 'bg-gray-200'
                  )}
                >
                  <span className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    isActive ? 'translate-x-4' : 'translate-x-0'
                  )} />
                </button>
              </div>
            )}

            {onDraftSave && (
              <button
                onClick={onDraftSave}
                className="rounded-lg border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                임시저장
              </button>
            )}

            {onLastStepAction && (
              <button
                onClick={onLastStepAction}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90"
              >
                <Save size={13} />
                저장하기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 3컬럼 본문 ── */}
      <div className="flex min-h-0 flex-1">
        {/* 좌측: 수직 스텝 네비게이션 */}
        <div
          className="flex flex-shrink-0 flex-col border-r border-border/60 bg-gray-50/70"
          style={{ width: leftWidth }}
        >
          {!isLeftCollapsed && (
            <div className="px-4 pb-2 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">단계</p>
            </div>
          )}
          <nav className={cn('flex-1 space-y-1', isLeftCollapsed ? 'px-1.5 pt-4' : 'px-3')}>
            {steps.map((step) => {
              const isCurrent = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isVisited = step.id <= maxVisitedStep;
              const isClickable = isCompleted || isVisited;
              return (
                <button
                  key={step.id}
                  onClick={() => { if (isClickable && !isCurrent) { onStepClick(step.id); } }}
                  title={isLeftCollapsed ? step.label : undefined}
                  className={cn(
                    'flex w-full items-center rounded-xl text-left transition-all',
                    isLeftCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                    isCurrent && 'bg-white font-semibold text-foreground shadow-sm',
                    isCompleted && 'cursor-pointer text-green-700 hover:bg-white/60',
                    !isCurrent && !isCompleted && isVisited && 'cursor-pointer text-muted-foreground hover:bg-white/60',
                    !isCurrent && !isCompleted && !isVisited && 'cursor-default text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                    isCurrent && 'bg-primary text-white',
                    isCompleted && 'bg-green-100 text-green-700',
                    !isCurrent && !isCompleted && isVisited && 'bg-primary/10 text-primary',
                    !isCurrent && !isCompleted && !isVisited && 'bg-gray-100 text-muted-foreground'
                  )}>
                    {isCompleted ? <Check size={14} /> : step.id}
                  </div>
                  {!isLeftCollapsed && (
                    <span className="flex items-center gap-1.5 text-sm">
                      {step.label}
                      {step.badge && isCompleted && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">{step.badge}</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 사이드바 하단 커스텀 영역 (타겟팅 요약 등) */}
          {sidebarFooter && !isLeftCollapsed && (
            <div className="border-t border-border/40 px-3 py-3">
              {sidebarFooter}
            </div>
          )}

          {/* 하단 네비게이션 버튼 */}
          <div className={cn('border-t border-border/40', isLeftCollapsed ? 'p-1.5' : 'p-3')}>
            <div className="flex flex-col gap-2">
              {!isLastStep ? (
                <button
                  onClick={onNext}
                  disabled={!canNext}
                  title={isLeftCollapsed ? '다음 단계로' : undefined}
                  className={cn(
                    'w-full rounded-lg text-sm font-medium transition-colors',
                    isLeftCollapsed ? 'px-2 py-2.5' : 'px-4 py-2.5',
                    canNext
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                  )}
                >
                  {isLeftCollapsed ? '→' : '다음 단계로'}
                </button>
              ) : (
                <button
                  onClick={onLastStepAction}
                  title={isLeftCollapsed ? lastStepLabel : undefined}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary/90',
                    isLeftCollapsed ? 'px-2 py-2.5' : 'px-4 py-2.5'
                  )}
                >
                  {lastStepIcon}
                  {!isLeftCollapsed && lastStepLabel}
                </button>
              )}
              {onPrev && currentStep > steps[0].id && (
                <button
                  onClick={onPrev}
                  title={isLeftCollapsed ? '이전 단계' : undefined}
                  className={cn(
                    'w-full rounded-lg border border-border/60 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted',
                    isLeftCollapsed ? 'px-2 py-2' : 'px-4 py-2'
                  )}
                >
                  {isLeftCollapsed ? '←' : '이전 단계'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 좌측 리사이즈 핸들 */}
        <div
          onMouseDown={(e) => handleMouseDown('left', e)}
          className="group relative z-10 w-0 cursor-col-resize"
        >
          <div className="absolute -left-[2px] top-0 h-full w-[4px] transition-colors group-hover:bg-primary/15 group-active:bg-primary/25" />
        </div>

        {/* 가운데: 에디터 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-8 py-6">
            {children}
          </div>
        </div>

        {/* 우측: 미리보기 패널 */}
        {preview && (
          <>
            {/* 우측 리사이즈 핸들 */}
            <div
              onMouseDown={(e) => handleMouseDown('right', e)}
              className="group relative z-10 w-0 cursor-col-resize"
            >
              <div className="absolute -right-[2px] top-0 h-full w-[4px] transition-colors group-hover:bg-primary/15 group-active:bg-primary/25" />
            </div>

            <div
              className="flex-shrink-0 overflow-y-auto border-l border-border/60 bg-gray-50/50"
              style={{ width: rightWidth }}
            >
              {preview}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
