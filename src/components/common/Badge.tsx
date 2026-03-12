import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import type { BadgeVariantType } from '@/models/type';

interface IBadgeProps {
  variant?: BadgeVariantType;
  children: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariantType, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  destructive: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  kakao: 'bg-yellow-100 text-yellow-800',
};

export function Badge({ variant = 'default', children, className }: IBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
