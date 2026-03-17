import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface IStatCardProps {
  title: string;
  value: string | number;
  change?: { value: string; isPositive: boolean };
  icon?: ReactNode;
  description?: string;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function StatCard({ title, value, change, icon, description, className, isActive, onClick }: IStatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'h-full rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all',
        onClick && 'cursor-pointer hover:border-gray-300 hover:shadow-md',
        isActive && 'border-foreground ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'mt-1.5 text-sm font-medium',
                change.isPositive ? 'text-emerald-600' : 'text-red-500',
              )}
            >
              {change.isPositive ? '↑' : '↓'} {change.value}
            </p>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-xl bg-gray-50 p-2.5 text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  );
}
