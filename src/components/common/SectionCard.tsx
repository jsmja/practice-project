import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ISectionCardProps {
  title?: string;
  titleRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, titleRight, children, className }: ISectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white p-5', className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {titleRight}
        </div>
      )}
      {children}
    </div>
  );
}
