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
}

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
}: IWizardEditorLayoutProps) {
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
                className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
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
        <div className="flex w-[220px] flex-shrink-0 flex-col border-r border-border/60 bg-gray-50/70">
          <div className="px-4 pb-2 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">단계</p>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => { if (isCompleted) { onStepClick(step.id); } }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                    isActive && 'bg-white font-semibold text-foreground shadow-sm',
                    isCompleted && 'cursor-pointer text-green-700 hover:bg-white/60',
                    !isActive && !isCompleted && 'cursor-default text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                    isActive && 'bg-foreground text-white',
                    isCompleted && 'bg-green-100 text-green-700',
                    !isActive && !isCompleted && 'bg-gray-100 text-muted-foreground'
                  )}>
                    {isCompleted ? <Check size={14} /> : step.id}
                  </div>
                  <span className="text-sm">{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 하단 네비게이션 버튼 */}
          <div className="border-t border-border/40 p-3">
            <div className="flex flex-col gap-2">
              {!isLastStep ? (
                <button
                  onClick={onNext}
                  disabled={!canNext}
                  className={cn(
                    'w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    canNext
                      ? 'bg-foreground text-white hover:bg-gray-800'
                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                  )}
                >
                  다음 단계로
                </button>
              ) : (
                <button
                  onClick={onLastStepAction}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  {lastStepIcon}
                  {lastStepLabel}
                </button>
              )}
              {onPrev && currentStep > steps[0].id && (
                <button
                  onClick={onPrev}
                  className="w-full rounded-lg border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  이전 단계
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 가운데: 에디터 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-8 py-6">
            {children}
          </div>
        </div>

        {/* 우측: 미리보기 패널 */}
        {preview && (
          <div className="w-[320px] flex-shrink-0 overflow-y-auto border-l border-border/60 bg-gray-50/50">
            {preview}
          </div>
        )}
      </div>
    </div>
  );
}
