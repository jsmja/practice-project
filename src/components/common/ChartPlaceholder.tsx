import { cn } from '@/lib/utils';

interface IChartPlaceholderProps {
  label: string;
  height?: string;
  className?: string;
}

export function ChartPlaceholder({ label, height = 'h-48', className }: IChartPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-gray-50 text-sm text-muted-foreground',
        height,
        className
      )}
    >
      📊 {label}
    </div>
  );
}
