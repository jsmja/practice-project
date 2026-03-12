import { cn } from '@/lib/utils';

interface IPeriodTabGroupProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  dateRange?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PeriodTabGroup({
  tabs,
  activeTab,
  onTabChange,
  dateRange,
  size = 'md',
  className,
}: IPeriodTabGroupProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'rounded-lg border transition-colors',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3 py-1.5 text-sm',
            activeTab === tab
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border hover:bg-muted'
          )}
        >
          {tab}
        </button>
      ))}
      {dateRange && (
        <span className={cn('ml-2 text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          📅 {dateRange}
        </span>
      )}
    </div>
  );
}
