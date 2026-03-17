import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { IOperationalAlert } from '@/mocks/dashboard';

interface ICriticalAlertsBannerProps {
  alerts: IOperationalAlert[];
}

const SEVERITY_LABEL: Record<number, string> = {
  3: '서비스 중단 위험',
  2: '데이터 이상',
  1: '개선 제안',
};

const ALERT_CONFIG: Record<string, {
  icon: typeof AlertCircle;
  bg: string;
  border: string;
  text: string;
  btnBg: string;
  btnHover: string;
}> = {
  destructive: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-l-red-500',
    text: 'text-red-800',
    btnBg: 'bg-red-500',
    btnHover: 'hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-l-amber-500',
    text: 'text-amber-800',
    btnBg: 'bg-amber-500',
    btnHover: 'hover:bg-amber-600',
  },
};

export function CriticalAlertsBanner({ alerts }: ICriticalAlertsBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  // severity 2 이상만 상단 배너에 표시 (서비스중단 + 데이터이상)
  const criticalAlerts = alerts
    .filter((a) => a.severity >= 2 && (a.type === 'destructive' || a.type === 'warning'))
    .filter((a) => !dismissed.has(a.id));

  if (criticalAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {criticalAlerts.map((alert) => {
        const config = ALERT_CONFIG[alert.type] ?? ALERT_CONFIG.destructive;
        const Icon = config.icon;
        const severityLabel = SEVERITY_LABEL[alert.severity];

        return (
          <div
            key={alert.id}
            className={cn(
              'flex items-center justify-between rounded-xl border-l-4 px-5 py-3.5',
              config.bg,
              config.border,
            )}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className={cn('flex-shrink-0', config.text)} />
              <div className="flex items-center gap-2.5">
                {severityLabel && (
                  <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', config.text, config.bg)}>
                    {severityLabel}
                  </span>
                )}
                <p className={cn('text-sm font-medium', config.text)}>{alert.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(alert.actionPath)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
                  config.btnBg,
                  config.btnHover,
                )}
              >
                {alert.action} <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleDismiss(alert.id)}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  alert.type === 'destructive'
                    ? 'text-red-400 hover:bg-red-100 hover:text-red-600'
                    : 'text-amber-400 hover:bg-amber-100 hover:text-amber-600',
                )}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
