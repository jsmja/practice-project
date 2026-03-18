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
    <div className={cn('rounded-2xl border border-border/60 bg-white p-6 shadow-sm', className)}>
      {(title || description) && (
        <div className="mb-5 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {titleRight}
        </div>
      )}
      {children}
    </div>
  );
}
