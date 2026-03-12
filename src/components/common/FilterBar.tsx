import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface IFilterOption {
  label: string;
  value: string;
}

interface IFilter {
  key: string;
  label: string;
  value: string;
  options: IFilterOption[];
}

interface IFilterBarProps {
  filters: IFilter[];
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

export function FilterBar({ filters, onFilterChange, onReset, className }: IFilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="appearance-none rounded-lg border border-border bg-white px-3 py-2 pr-8 text-sm text-foreground outline-none transition-colors hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {filter.label} : {opt.label}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      ))}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <RotateCcw size={14} />
        필터 초기화
      </button>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
