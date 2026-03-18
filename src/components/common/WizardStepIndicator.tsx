import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface IWizardStep {
  id: number;
  label: string;
  icon: ReactNode;
  /** 스텝 라벨 옆에 표시할 뱃지 텍스트 (예: 선택한 유형명) */
  badge?: string;
}

interface IWizardStepIndicatorProps {
  steps: IWizardStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function WizardStepIndicator({ steps, currentStep, onStepClick }: IWizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => { if (isCompleted) { onStepClick(step.id); } }}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                isActive && 'bg-primary text-white shadow-sm',
                isCompleted && 'cursor-pointer bg-green-100 text-green-700 hover:bg-green-200',
                !isActive && !isCompleted && 'cursor-default bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? <Check size={12} /> : step.icon}
              {step.label}
            </button>
            {idx < steps.length - 1 && (
              <div className={cn('mx-1.5 h-px w-6', isCompleted ? 'bg-green-300' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
