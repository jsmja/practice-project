import { cn } from '@/lib/utils';

interface INavBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function NavBadge({ children, className }: INavBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white',
        className
      )}
    >
      {children}
    </span>
  );
}
