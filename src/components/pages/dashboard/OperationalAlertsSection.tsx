import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_ALERTS } from '@/mocks/dashboard';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const ALERT_STYLES: Record<string, { icon: ReactNode; bg: string; borderLeft: string; text: string }> = {
  warning: {
    icon: <AlertTriangle size={18} />,
    bg: 'bg-amber-50',
    borderLeft: 'border-l-amber-500',
    text: 'text-amber-600',
  },
  info: {
    icon: <Info size={18} />,
    bg: 'bg-blue-50',
    borderLeft: 'border-l-blue-500',
    text: 'text-blue-600',
  },
};

export function OperationalAlertsSection() {
  const navigate = useNavigate();

  // severity 2 이상은 CriticalAlertsBanner에서 처리, 나머지만 표시
  const lowPriorityAlerts = MOCK_ALERTS.filter((a) => a.severity < 2);

  if (lowPriorityAlerts.length === 0) {
    return null;
  }

  return (
    <SectionCard title="운영 알림">
      <div className="flex flex-col gap-3">
        {lowPriorityAlerts.map((alert) => {
          const style = ALERT_STYLES[alert.type];
          if (!style) return null;
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-center justify-between rounded-xl border border-transparent border-l-4 px-5 py-3.5',
                style.bg,
                style.borderLeft,
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex-shrink-0', style.text)}>{style.icon}</div>
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
              <button
                onClick={() => navigate(alert.actionPath)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  style.text,
                  'hover:bg-white/60',
                )}
              >
                {alert.action} <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
