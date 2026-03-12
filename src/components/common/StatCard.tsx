import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface IStatCardProps {
  title: string;
  value: string | number;
  change?: { value: string; isPositive: boolean };
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, change, icon, description, className }: IStatCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'mt-1 text-xs',
                change.isPositive ? 'text-green-600' : 'text-red-500'
              )}
            >
              {change.isPositive ? '↑' : '↓'} {change.value}
            </p>
          )}
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>
        )}
      </div>
    </div>
  );
}
