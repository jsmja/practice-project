import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ISectionCardProps {
  title?: string;
  description?: string;
  titleRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, description, titleRight, children, className }: ISectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-white p-5', className)}>
      {(title || description) && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {titleRight}
        </div>
      )}
      {children}
    </div>
  );
}
